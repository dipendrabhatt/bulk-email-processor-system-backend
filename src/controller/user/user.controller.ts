import userService from "../../services/user/user.service";



class UserController {

    async getEmailLogs(req: any, res: any) {
        try {
            const emailLogs = await userService.getEmailLogs(req);
            res.json({
                success: true,
                message: 'Email logs fetched successfully',
                data: emailLogs
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