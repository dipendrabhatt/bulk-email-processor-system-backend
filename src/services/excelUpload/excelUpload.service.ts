import { UploadedFile as File } from "express-fileupload";
import readXlsxFile from "read-excel-file/node";


import { Request } from "express";
import mailSenderService from "../../services/mailSender/mailSender.service";

class ExcelUpload {
    async create(file: File, sheet: string, req: Request) {
        const rows = await readXlsxFile(file.tempFilePath);
        rows.splice(0, 1); // remove the first row which is heading in our case
        const result = mailSenderService.sendMail(rows, req);
        return result;

    }

}


export default new ExcelUpload();