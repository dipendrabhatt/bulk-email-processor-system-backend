
import jwt from 'jsonwebtoken'
import appDataSource from '../config/database.config'
import env from '../config/env'
import { User } from '../entities/user/user.entity'
export interface IJwtOptions {
    secret: string
    expiresIn: string
}

export interface IJwtPayload {
    id: string
    email: string
}



class WebTokenService {
    constructor(
        private readonly userRepository = appDataSource.getRepository(User),
    ) {
    }

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

    async userExists(email: string) {
        const user = await this.userRepository.findOne({
            where: {
                email
            }
        });
        console.log("🚀 ~ file: token.service.ts:61 ~ WebTokenService ~ userExists ~ user:", user)
        if (!user) {
            return false;
        }
        return true;
    }

}

export default new WebTokenService();