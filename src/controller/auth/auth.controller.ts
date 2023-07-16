import AuthService from "../../services/auth/auth.service";



class AuthController {

    async signUp(req: any, res: any) {
        try {
            const user = await AuthService.signUp(req.body);
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

    async login(req: any, res: any) {
        try {
            const { email, password } = req.body;
            const user = await AuthService.login(email, password);
            res.json({
                success: true,
                message: 'User logged in successfully',
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

    async verifyEmail(req: any, res: any) {
        try {
            const user = await AuthService.verifyEmail(req.params.token);
            res.json({
                success: true,
                message: 'User verified successfully',
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

export default new AuthController();