import { Router } from "express";
import authRoutes from "./auth/auth.route";
import excelUploadRoutes from "./excelUpload/excelUpload.route";

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