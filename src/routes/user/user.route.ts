import { Router } from "express";
import userController from "../../controller/user/user.controller";
import { UserDTO } from "../../dtos/user/user.dto";
import RequestValidator from "../../middlewares/request.validator";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();


router.post('/', RequestValidator.validate(UserDTO), catchAsync(userController.create));

export default router;