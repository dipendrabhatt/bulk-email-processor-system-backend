import { Request } from "express";
import appDataSource from "../../config/database.config";
import { EmailLog } from "../../entities/emailLog/emailLog.entity";



class UserService {
    constructor(
        private readonly emailLogRepository = appDataSource.getRepository(EmailLog),
    ) {

    }

    async getEmailLogs(req: Request): Promise<EmailLog[]> {
        const emailLogs = await this.emailLogRepository.find({
            where: {
                user: {
                    id: req.user.id
                }
            }
        });

        if (!emailLogs) {
            throw new Error("Email logs not found");
        }
        return emailLogs;
    }
}

export default new UserService();