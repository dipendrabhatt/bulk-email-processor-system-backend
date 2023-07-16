import { Router } from "express";
import userController from '../../controller/user/user.controller';
import authentication from "../../middlewares/authentication";
import { catchAsync } from './../../utils/catchAsync';


const router = Router();

router.get("/", authentication(), catchAsync(userController.getEmailLogs));

export default router;