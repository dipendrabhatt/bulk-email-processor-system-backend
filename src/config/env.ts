import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });
class env {
    static NODE_ENV = process.env.NODE_ENVIRONMENT;
    static PORT = +process.env.PORT!;

    // *Database Configurations
    static DATABASE_HOST = process.env.DATABASE_HOST;
    static DATABASE_PORT = +process.env.DATABASE_PORT!;
    static DATABASE_USERNAME = process.env.DATABASE_USERNAME;
    static DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
    static DATABASE_NAME = process.env.DATABASE_NAME;

    // *Other Configurations
    static DEBUG_MODE = process.env.DEBUG_MODE;
    static TOKEN_SECRET = process.env.TOKEN_SECRET!;
    static TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN!;

    // *Mail Configurations
    static MAIL_TRAP_HOST = process.env.MAIL_TRAP_HOST;
    static MAIL_TRAP_PORT = +process.env.MAIL_TRAP_PORT!;
    static MAIL_TRAP_USERNAME = process.env.MAIL_TRAP_USERNAME;
    static MAIL_TRAP_PASSWORD = process.env.MAIL_TRAP_PASSWORD;


    // *Server Information
    static BASE_URL = process.env.BASE_URL!;
}

export default env;
