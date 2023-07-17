import { Router } from "express";
import authRoutes from "./auth/auth.route";
import emailTemplateRoutes from "./emailTemplate/emailTemplate.route";
import excelUploadRoutes from "./excelUpload/excelUpload.route";
import userRoutes from "./user/user.route";

const router = Router();

export type Route = {
    path: string;
    route: Router;
};

const routes: Route[] = [
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/excel-upload",
        route: excelUploadRoutes
    },
    {
        path: "/email-logs",
        route: userRoutes
    },
    {
        path: "/email-templates",
        route: emailTemplateRoutes
    }
]


// *Instantiate all the routes
routes.forEach((route) => {
    router.use(route.path, route.route);
});

// *Route to ensure that server is currently running
router.get("/", (req, res) => {
    res.send({
        success: true,
        message: "Welcome to Email Processing API",
        data: [],
    });
});

export default router