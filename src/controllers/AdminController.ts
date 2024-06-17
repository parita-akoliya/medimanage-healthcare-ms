import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';

export class AdminController {
    private adminService: AdminService;

    constructor() {
        this.adminService = new AdminService();
    }

    public async changeUserRole(req: Request, res: Response): Promise<void> {
        const { userId, newRole } = req.body;
        try {
            const updatedUser = await this.adminService.changeUserRole(userId, newRole);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async updateUserEmail(req: Request, res: Response): Promise<void> {
        const { userId, newEmail } = req.body;
        try {
            const updatedUser = await this.adminService.updateUserEmail(userId, newEmail);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async resetUserPassword(req: Request, res: Response): Promise<void> {
        const { userId, newPassword } = req.body;
        try {
            const updatedUser = await this.adminService.resetUserPassword(userId, newPassword);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }
}
