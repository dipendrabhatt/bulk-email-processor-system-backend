import emailTemplateService from "../../services/emailTemplate/emailTemplate.service";



class EmailTemplateController {

    async getEmailTemplates(req: any, res: any) {
        try {
            const emailTemplates = await emailTemplateService.getEmailTemplates();
            res.json({
                success: true,
                message: 'Email Templates fetched successfully',
                data: emailTemplates
            })
        } catch (error: any) {
            res.json({
                success: false,
                message: error.message,
                data: []
            })
        }
    }
}

export default new EmailTemplateController();