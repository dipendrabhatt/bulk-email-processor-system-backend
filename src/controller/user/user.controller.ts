import UserService from "../../services/user/user.service";



class UserController {

    async create(req: any, res: any) {
        try {
            const user = await UserService.create(req.body);
            res.json({
                success: true,
                message: 'User created successfully',
                data: user
            })
        } catch (error: any) {
            res.json({
                success: false,
                message: error.message,
                data: []
            })
        }
    }

    async findAll(req: any, res: any) {
        try {
            const users = await UserService.findAll();
            res.json({
                success: true,
                message: 'Users retrieved successfully',
                data: users
            })
        } catch (error: any) {
            res.json({
                success: false,
                message: error.message,
                data: []
            })
        }
    }


    async findOne(req: any, res: any) {
        try {
            const user = await UserService.findOne(req.params.id);
            res.json({
                success: true,
                message: 'User retrieved successfully',
                data: user
            })
        } catch (error: any) {
            res.json({
                success: false,
                message: error.message,
                data: []
            })
        }
    }

    async update(req: any, res: any) {

        try {
            const user = await UserService.update(req.params.id, req.body);
            res.json({
                success: true,
                message: 'User updated successfully',
                data: user
            })
        }
        catch (error: any) {
            res.json({
                success: false,
                message: error.message,
                data: []
            })
        }
    }


    async remove(req: any, res: any) {
        try {
            const user = await UserService.remove(req.params.id);
            res.json({
                success: true,
                message: 'User deleted successfully',
                data: user
            })
        } catch (error: any) {
            res.json({
                success: false,
                message: error.message,
                data: []
            })
        }
    }

}

export default new UserController();