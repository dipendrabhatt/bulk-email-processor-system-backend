import { Router } from "express";

import { post } from "../../controller/excelUpload/excelUpload.controller";
import upload from "../../middlewares/upload.middleware";
import { catchAsync } from "../../utils/catchAsync";



const router = Router();


router.post("/", upload.single("file"), catchAsync(post));


export default router;