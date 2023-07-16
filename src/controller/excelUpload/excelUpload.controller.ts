import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import excelUploadService from "../../services/excelUpload/excelUpload.service";


export const post = async (req: Request, res: Response) => {


    try {
        const data = await excelUploadService.create(req.file as UploadedFile, req.body.sheet, req);
        res.status(
            201
        ).json({
            success: true,
            data,
            message: "File uploaded successfully"
        })
    } catch (error: any) {
        res.status(
            400
        ).json({
            success: false,
            message: error.message,
            data: []
        })
    }
}