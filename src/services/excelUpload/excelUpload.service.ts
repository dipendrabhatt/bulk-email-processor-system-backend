import { UploadedFile as File } from "express-fileupload";
import readXlsxFile from "read-excel-file/node";


import { Request } from "express";

class ExcelUpload {
    async create(file: File, sheet: string, req: Request) {
        const rows = await readXlsxFile(file.tempFilePath);
        rows.splice(0, 1); // remove the first row which is heading in our case

        const data = rows.map((row: any) => {
            const email = row[0]
            console.log("🚀 ~ file: excelUpload.service.ts:14 ~ ExcelUpload ~ data ~ email:", email)
            //validate email pattern
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailPattern.test(email)) {
                throw new Error(`Invalid email address ${email}`);
            }
            console.log("🚀 ~ file: excelUpload.service.ts:24 ~ ExcelUpload ~ data ~ row:", row)
            return {
                email,
            }
        });
        console.log("🚀 ~ file: excelUpload.service.ts:24 ~ ExcelUpload ~ data ~ data:", data)

        return data;

    }

}


export default new ExcelUpload();