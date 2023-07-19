import amqp from 'amqplib';
import { Request } from 'express';
import appDataSource from '../../config/database.config';
import webSocketServer from "../../config/webSocket";
import { EmailLog } from '../../entities/emailLog/emailLog.entity';
import { EmailTemplate } from '../../entities/emailTemplate/emailTemplate.entity';
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
        const templateId = req.query.templateId as string;
        if (!templateId) {
            throw new Error('Template is required');
        }

        const template = await appDataSource.getRepository(EmailTemplate).findOne({
            where: {
                id: templateId,
            },
        });
        if (!template) {
            throw new Error('Template not found');
        }

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
                    this.emailLog.push({ email, sentTime: new Date(), type: SendType.SUCCESS });
                } catch (error: any) {
                    this.emailLog.push({ email, sentTime: null, type: SendType.FAILED });
                }
            }
            await channel.consume('email-queue', async (msg: any) => {
                const email = msg?.content.toString();
                await this.sendEmail(email, template.template);
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
            message: 'Emails are being processed . Please wait for some time.',
        };
    }

    private async sendAndSaveEmailLogs(req: Request) {
        const uniqueEmails = new Set<string>(); // Set to store unique email addresses
        let sentEmailLog: EmailLog[] = [];
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
                const emailLogs = await this.emailLogRepository.save(emailLog);
                sentEmailLog.push(emailLogs);
            }
        }

        webSocketServer.get().to(req.user.id).emit('email-logs', sentEmailLog);

        this.emailLog = [];

    }


    private async sendEmail(email: string, template: string) {

        try {
            await sendMailService.sendMail({
                from: 'Email Processor',
                to: email,
                subject: 'Mail Send',
                html: template,
            });
            this.emailLog.push({ email, sentTime: new Date(), type: SendType.SUCCESS });
        } catch (error: any) {
            console.error('Failed to send email:', email, error);
            this.emailLog.push({ email, sentTime: null, type: SendType.FAILED });
        }
    }
}

export default new MailSenderService();
