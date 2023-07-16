
import { NextFunction, Request, Response } from 'express';
import tokenService from '../utils/token.service';

export default () =>
    async (req: Request, res: Response, next: NextFunction) => {

        //make single function for response
        const responseMessage = () => {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to access this resource'
            });

        }

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return responseMessage();
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return responseMessage();
        }


        const user = tokenService.verifyAccessToken(token);
        if (!user) {
            return responseMessage();
        }

        const userExists = await tokenService.userExists(user.email);
        if (!userExists) {
            return responseMessage();
        }

        req.user = user;
        next();

    }

