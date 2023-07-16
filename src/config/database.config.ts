import "reflect-metadata";
import { DataSource } from "typeorm";
import env from "./env";

const appDataSource = new DataSource({
    type: "mysql",
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    synchronize: true,
    logging: true,
    // dropSchema: true,
    entities: ["./src/entities/**/*entity.ts"],
    subscribers: [],
});

export default appDataSource;
