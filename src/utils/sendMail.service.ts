
import nodemailer, { Transporter } from 'nodemailer';
import env from '../config/env';

class SendMailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env.MAIL_TRAP_HOST,
            port: env.MAIL_TRAP_PORT,
            secure: false,
            auth: {
                user: env.MAIL_TRAP_USERNAME,
                pass: env.MAIL_TRAP_PASSWORD
            }
        });
    }

    async sendMail(data: any) {
        const mailOptions = {
            from: data.from,
            to: data.to,
            subject: data.subject,
            html: data.html
        }
        return await this.transporter.sendMail(mailOptions);
    }
}

export default new SendMailService();
