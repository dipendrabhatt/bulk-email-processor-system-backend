import appDataSource from "../../config/database.config";
import env from "../../config/env";
import { User } from "../../entities/user/user.entity";
import BcryptService from "../../utils/bcrypt.service";
import sendMailService from "../../utils/sendMail.service";
import tokenService from "../../utils/token.service";

class AuthService {
    constructor(
        private readonly userRepository = appDataSource.getRepository(User),
        private readonly bcryptService = new BcryptService(),
    ) {

    }

    async signUp(data: User) {
        const user = new User();
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.middleName = data.middleName;


        //check if email exists
        const emailExists = await this.userRepository.findOne({
            where: {
                email: data.email
            }
        });
        if (emailExists) {
            throw new Error("Email already exists");
        }
        user.email = data.email;

        //hash password
        const hashPassword = await this.bcryptService.hash(data.password)
        user.password = hashPassword;
        user.isVerified = data.isVerified;

        const result = await this.userRepository.save(user);
        //send email verification link
        const token = tokenService.generateAccessToken(user);
        const emailVerificationUrl = `${env.BASE_URL}/verify-email?token=${token}`;
        await sendMailService.sendMail({
            from: "Email Processor",
            to: user.email,
            subject: "Email Verification",
            html: `<h1>Click on the link below to verify your email</h1>
            <a href="${emailVerificationUrl}">Verify Email</a>`
        });
        return {
            user: result,
            token
        }

    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await this.bcryptService.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = tokenService.generateAccessToken(user);

        return {
            user,
            token
        }
    }


    async verifyEmail(token: string) {
        const user = tokenService.verifyAccessToken(token);
        if (!user) {
            throw new Error("Invalid token");
        }
        const userToUpdate = await this.userRepository.findOne({
            where: {
                id: user.id
            }
        });
        if (!userToUpdate) {
            throw new Error("User not found");
        }
        userToUpdate.isVerified = true;
        const result = await this.userRepository.save(userToUpdate);
        return {
            user: result,
            token
        }
    }


}

export default new AuthService();