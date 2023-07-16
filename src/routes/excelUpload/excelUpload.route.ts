import { Router } from "express";
import authentication from "../../middlewares/authentication";

import { post } from "../../controller/excelUpload/excelUpload.controller";
import upload from "../../middlewares/upload.middleware";
import { catchAsync } from "../../utils/catchAsync";



const router = Router();


router.post("/", authentication(), upload.single("file"), catchAsync(post));


export default router;