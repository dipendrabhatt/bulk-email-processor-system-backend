import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import fs from "fs";
import path from "path";

const PUBLIC_FOLDER_PATH = path.join(__dirname, '..', '..', 'public');
const UPLOADS_FOLDER_PATH = path.join(__dirname, '..', '..', 'public', 'uploads');

const upload = {
    single: (fieldName: string) => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (req.files) {
                // *Ensure that only one file is uploaded
                if (Object.keys(req.files).length !== 1) {
                    throw new Error("Only one file can be uploaded at a time");
                }
                const file = req.files[fieldName] as UploadedFile;
                const fileExtension = path.extname(file.name);
                const fileSize = file.size;
                let supportedExtensions: string[];
                let maxFileSize: number = 10 * 1024 * 1024;//10MB 
                let isValidFileSize = fileSize <= maxFileSize;

                if (!isValidFileSize)
                    throw new Error(`File size must not be greater than ${maxFileSize} bytes`);

                const fileName = `${Date.now()}__${file.name}`;

                const folderPath = path.join(UPLOADS_FOLDER_PATH, 'excel');

                // *Enure that the folder exists
                !fs.existsSync(PUBLIC_FOLDER_PATH) && fs.mkdirSync(PUBLIC_FOLDER_PATH);
                !fs.existsSync(UPLOADS_FOLDER_PATH) && fs.mkdirSync(UPLOADS_FOLDER_PATH);
                !fs.existsSync(folderPath) && fs.mkdirSync(folderPath);

                const filePath = path.join(folderPath, fileName);

                file.mv(filePath, (err: any) => {
                    if (err) {
                        throw new Error("Error uploading file");
                    }
                });
                file.name = fileName;;
                file.tempFilePath = filePath;
                req.file = file;

                next()
            } else {
                throw new Error("No file was uploaded");
            }
        }

    }
}



export default upload;