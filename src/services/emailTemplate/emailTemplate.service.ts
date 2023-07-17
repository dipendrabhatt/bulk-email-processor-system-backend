import appDataSource from "../../config/database.config";
import { EmailTemplate } from "../../entities/emailTemplate/emailTemplate.entity";



class EmailTemplateService {
    constructor(
        public emailTemplateRepository = appDataSource.getRepository(EmailTemplate),
    ) { }

    async getEmailTemplates() {
        return await this.emailTemplateRepository.find();
    }
}

export default new EmailTemplateService();