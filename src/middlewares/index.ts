import compression from 'compression';
import cors from "cors";
import express, { Application } from "express";
import routes from "../routes/index";


const middlewares = (app: Application) => {
    app.use(compression())
    app.use(cors())
    app.use(express.json());
    app.use(express.static("public/uploads"))
    app.use("/api", routes);

}

export default middlewares;