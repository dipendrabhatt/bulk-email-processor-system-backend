import { Router } from "express";
import authController from "../../controller/auth/auth.controller";
import { LoginDTO } from "../../dtos/auth/login.dto";
import { UserDTO } from "../../dtos/user/user.dto";
import RequestValidator from "../../middlewares/request.validator";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();

router.post('/sign-up', RequestValidator.validate(UserDTO), catchAsync(authController.signUp));
router.post('/login', RequestValidator.validate(LoginDTO), catchAsync(authController.login));
router.get('/verify-email/:token', catchAsync(authController.verifyEmail));

export default router;