import amqp from 'amqplib';
import { Request } from 'express';
import appDataSource from '../../config/database.config';
import { EmailLog } from '../../entities/emailLog/emailLog.entity';
import { User } from '../../entities/user/user.entity';
import sendMailService from '../../utils/sendMail.service';

export enum SendType {
    SUCCESS = 'success',
    FAILED = 'failed',
}

interface Logs {
    email: string;
    sentTime?: Date | null;
    type: SendType;
}

export class MailSenderService {
    constructor(
        private emailLog: Logs[] = [],
        private emailLogRepository = appDataSource.getRepository(EmailLog),
        private userRepository = appDataSource.getRepository(User),
    ) { }

    public async sendMail(rows: any[], req: Request) {
        const queue = await amqp.connect('amqp://localhost:5672');

        const channel = await queue.createChannel();
        await channel.assertQueue('email-queue', {
            durable: true,
        });

        try {
            for (const row of rows) {
                const email = row[0];
                console.log('Email:', email);
                try {
                    channel.sendToQueue('email-queue', Buffer.from(email));
                    console.log('Email added to the queue:', email);
                    this.emailLog.push({ email, sentTime: new Date(), type: SendType.SUCCESS });
                } catch (error: any) {
                    console.error('Failed to add email to the queue:', email, error);
                    this.emailLog.push({ email, sentTime: null, type: SendType.FAILED });
                }
            }
            await channel.consume('email-queue', async (msg: any) => {
                const email = msg?.content.toString();
                console.log('Email received from queue:', email);
                await this.sendEmail(email);
                channel.ack(msg);
            });
        } catch (error) {
            console.error('Failed to consume emails from the queue:', error);
        }

        // Send emails and save logs
        await this.sendAndSaveEmailLogs(req);

        // Clear the queue
        await channel.purgeQueue('email-queue');

        return {
            message: 'Emails sent successfully',
            data: this.emailLog,
        };
    }

    private async sendAndSaveEmailLogs(req: Request) {
        const uniqueEmails = new Set<string>(); // Set to store unique email addresses

        for (const log of this.emailLog) {
            if (!uniqueEmails.has(log.email)) { // Check if the email is already saved
                uniqueEmails.add(log.email); // Add the email to the set to mark it as saved

                const emailLog = new EmailLog();
                emailLog.email = log.email;
                emailLog.sentTime = log.sentTime || null;
                emailLog.type = log.type;

                const user = await this.userRepository.findOne({
                    where: {
                        id: req.user.id,
                    },
                });

                if (!user) {
                    throw new Error('User not found');
                }

                emailLog.user = user;
                await this.emailLogRepository.save(emailLog);
            }
        }

        // Clear the email log array
        this.emailLog = [];
    }


    private async sendEmail(email: string) {
        try {
            await sendMailService.sendMail({
                from: 'Email Processor',
                to: email,
                subject: 'Email Verification',
                html: '<h5>Happy Birthday</h5>',
            });
            console.log('Email sent:', email);
            this.emailLog.push({ email, sentTime: new Date(), type: SendType.SUCCESS });
        } catch (error: any) {
            console.error('Failed to send email:', email, error);
            this.emailLog.push({ email, sentTime: null, type: SendType.FAILED });
        }
    }
}

export default new MailSenderService();
