// ProfileController.ts

import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { IUserDocument } from '../db/models/User.models';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export class ProfileController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public async getProfile(req: Request, res: Response): Promise<void> {
        const userId = req.user.id;
        try {
            const userProfile = await this.userService.getUserProfile(userId);
            res.sendApiResponse({ data: userProfile });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async updateProfile(req: Request, res: Response): Promise<void> {
        const userId = req.user.id;
        const updatedProfile = req.body;
        try {
            const userProfile = await this.userService.updateUserProfile(userId, updatedProfile);
            res.sendApiResponse({ data: userProfile });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }
}
