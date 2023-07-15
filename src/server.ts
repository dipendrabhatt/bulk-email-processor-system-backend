import dotenv from "dotenv";
import express from "express";
import path from "path";
const app = express();

dotenv.config({ path: path.join(__dirname, "../.env") });

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});