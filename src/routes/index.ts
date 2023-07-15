import { Router } from "express";
import userRoutes from "./user/user.route";

const router = Router();

export type Route = {
    path: string;
    route: Router;
};

const routes: Route[] = [
    {
        path: "/user",
        route: userRoutes
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