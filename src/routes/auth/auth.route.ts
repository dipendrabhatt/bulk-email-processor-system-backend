import { Router } from "express";
import authController from "../../controller/auth/auth.controller";
import { UserDTO } from "../../dtos/user/user.dto";
import RequestValidator from "../../middlewares/request.validator";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();


router.post('/sign-up', RequestValidator.validate(UserDTO), catchAsync(authController.create));
router.get('/verify-email/:token', catchAsync(authController.verifyEmail));

export default router;