import appDataSource from "../../config/database.config";
import { User } from "../../entities/user/user.entity";
import BcryptService from "../../utils/bcrypt.service";

class UserService {
    constructor(
        private readonly userRepository = appDataSource.getRepository(User),
        private readonly bcryptService = new BcryptService(),
    ) {

    }

    async create(data: User): Promise<User> {
        const user = new User();
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.middleName = data.middleName;
        user.email = data.email;
        //hash password using bcrypt
        const hashPassword = await this.bcryptService.hash(data.password)
        user.password = hashPassword;
        user.isVerified = data.isVerified;
        return await this.userRepository.save(user);
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

export default new UserService();