import express from "express";
import 'reflect-metadata';

import middlewares from "../middlewares";

const app = express();

middlewares(app);

export default app