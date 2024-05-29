import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async getUser(req: Request, res: Response) {
        const id = req.params.id;
        try {
            console.log(id);
            const user = await this.authService.getUser(id);
            res.sendApiResponse(user);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }
}
