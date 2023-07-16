
import jwt from 'jsonwebtoken'
import env from '../config/env'
export interface IJwtOptions {
    secret: string
    expiresIn: string
}

export interface IJwtPayload {
    id: string
    email: string
}



class WebTokenService {

    sign(user: IJwtPayload, options: IJwtOptions) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            options.secret,
            {
                expiresIn: options.expiresIn,
            }
        )
    }

    generateAccessToken(user: IJwtPayload) {
        return this.sign(
            user,
            {
                expiresIn: env.TOKEN_EXPIRES_IN,
                secret: env.TOKEN_SECRET,
            }
        )
    }

    verifyAccessToken(token: string) {
        try {
            return jwt.verify(token, env.TOKEN_SECRET) as IJwtPayload
        } catch (error) {
            return null
        }
    }

}

export default new WebTokenService();