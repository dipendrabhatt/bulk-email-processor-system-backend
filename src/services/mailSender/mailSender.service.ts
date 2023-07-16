import amqp from 'amqplib';
import { Request } from 'express';
import appDataSource from '../../config/database.config';
import { EmailLog } from '../../entities/emailLog/emailLog.entity';
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
    ) {
    }


    public async sendMail(rows: any[], req: Request) {



        const queue = await amqp.connect('amqp://localhost:5672');

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        for (const row of rows) {
            const email = row[0];
            console.log('Email:', email);

            // Validate email pattern
            if (!emailPattern.test(email)) {
                throw new Error(`Invalid email pattern for ${email}`);
            }

            // Add the email to the queue
            try {
                const channel = await queue.createChannel();
                await channel.assertQueue('email-queue', {
                    durable: true,
                });
                await channel.sendToQueue('email-queue', Buffer.from(email));
                console.log('Email added to the queue:', email);
                channel.close();
                this.emailLog.push({ email, sentTime: new Date(), type: SendType.SUCCESS });

            } catch (error: any) {
                console.error('Failed to add email to the queue:', email, error);
                this.emailLog.push({ email, sentTime: null, type: SendType.FAILED });
            }
        }

        try {
            const channel = await queue.createChannel();
            await channel.assertQueue('email-queue', {
                durable: true,
            });

            const sendEmail = async (email: string) => {
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
            };

            await channel.consume('email-queue', async (msg: any) => {
                const email = msg?.content.toString();
                console.log('Email received from queue:', email);
                await sendEmail(email);
                channel.ack(msg);
            });
        } catch (error) {
            console.error('Failed to consume emails from the queue:', error);
        }

        await this.saveEmailLogs(); // Save email logs to the database

        return {
            message: 'Emails sent successfully',
            data: this.emailLog,
        };
    }

    private async saveEmailLogs() {

        for (const log of this.emailLog) {
            const emailLog = new EmailLog();
            emailLog.email = log.email;
            emailLog.sentTime = log.sentTime || null;
            emailLog.type = log.type;
            await this.emailLogRepository.save(emailLog);
        }

    }
}

export default new MailSenderService();
