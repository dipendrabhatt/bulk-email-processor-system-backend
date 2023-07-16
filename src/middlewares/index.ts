import compression from 'compression';
import cors from "cors";
import express, { Application } from "express";
import fileUpload from 'express-fileupload';
import routes from "../routes/index";


const middlewares = (app: Application) => {
    app.use(express.json());
    app.use(fileUpload());

    app.use(express.static("public/uploads"))
    app.use(compression())
    app.use(cors())
    app.use("/api", routes);

}

export default middlewares;