import appDataSource from "../../config/database.config";
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

    async create(data: User) {
        const user = new User();
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.middleName = data.middleName;
        user.email = data.email;
        const hashPassword = await this.bcryptService.hash(data.password)
        user.password = hashPassword;
        user.isVerified = data.isVerified;

        const result = await this.userRepository.save(user);
        const token = tokenService.generateAccessToken(user);

        //create url for email verification
        //send email verification link

        const emailVerificationUrl = `http://localhost:4000/api/auth/verify-email/${token}`;
        console.log(emailVerificationUrl);

        //senf the email verification link to the user email using mailtrap

        await sendMailService.sendMail({
            from: "Email Processor",
            to: user.email,
            subject: "Email Verification",
            html: `<h1>Click on the link below to verify your email</h1>
            <a href="${emailVerificationUrl}">Verify Email</a>`
        });
        return result;

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
        return await this.userRepository.save(userToUpdate);
    }

    async findAll() {
        return await this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                id
            }
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async update(id: string, user: User): Promise<User> {
        const userToUpdate = await this.userRepository.findOne({
            where: {
                id
            }
        });
        if (!userToUpdate) {
            throw new Error("User not found");
        }

        return await this.userRepository.save({
            ...userToUpdate,
            ...user
        });
    }

    async remove(id: string) {
        return await this.userRepository.delete(id);
    }

}

export default new AuthService();