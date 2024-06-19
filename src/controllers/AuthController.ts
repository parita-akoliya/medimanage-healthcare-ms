import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { IRegisterDoctor, IUser } from '../types/Auth';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async registerDoctor(req: Request, res: Response): Promise<void> {
        try {
            const doctorData: IRegisterDoctor = req.body;
            const result = await this.authService.registerDoctor(doctorData);
            res.sendApiResponse({ message: 'Doctor registered successfully. An email has been sent for setting the password.', data: result });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.sendApiResponse(result);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;
            const result = await this.authService.verifyOtp(email, otp);
            res.sendApiResponse(result);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async registerPatient(req: Request, res: Response) {
        try {
            const response = await this.authService.registerPatient(req.body)
            res.sendApiResponse(response);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async registerFrontDesk(req: Request, res: Response): Promise<void> {
        try {
            const frontDeskData: IUser = req.body;
            const result = await this.authService.registerUser(frontDeskData, false);
            res.sendApiResponse({ message: 'FrontDesk registered successfully. An email has been sent for setting the password.', data: result });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async registerAdmin(req: Request, res: Response): Promise<void> {
        try {
            const adminData: IUser = req.body;
            const result = await this.authService.registerUser(adminData, true);
            res.sendApiResponse({ message: 'Admin registered successfully. An email has been sent for setting the password.', data: result });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }


    public async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const result = await this.authService.forgotPassword(email);
            res.sendApiResponse({ message: result });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, newPassword } = req.body;
            const result = await this.authService.resetPassword(token, newPassword);
            res.sendApiResponse({ message: result });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

}
