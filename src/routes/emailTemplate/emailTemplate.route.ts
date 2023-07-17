import { Router } from "express";
import emailTemplateController from "../../controller/emailTemplate/emailTemplate.controller";
import { catchAsync } from "../../utils/catchAsync";


const router = Router();

router.get('/',
    // authentication(),
    catchAsync(emailTemplateController.getEmailTemplates));

export default router;