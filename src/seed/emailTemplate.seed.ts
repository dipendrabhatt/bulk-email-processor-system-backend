import appDataSource from "../config/database.config";
import { emailTemplate } from "../constants/emailTemplate";
import { EmailTemplate } from "../entities/emailTemplate/emailTemplate.entity";


appDataSource.initialize().then(async (_) => {
    const indicatorRepository = appDataSource.getRepository(EmailTemplate);

    // *Iterate through super admin and insert into the database
    for (const element of emailTemplate) {
        const indicator = new EmailTemplate();
        indicator.template = element.template;
        await indicatorRepository.save(indicator);
    }
}).catch((err) => {
    console.log(err);
})
    .finally(() => {
        // *Finish the process
        appDataSource.destroy();
    });