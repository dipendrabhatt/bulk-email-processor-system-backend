import { Request, Response, Router } from "express";

const router = Router();


router.post('/register', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'hello there'
    })

})

export default Router()