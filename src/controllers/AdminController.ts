import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';
import { UserService } from '../services/UserService';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


export class AdminController {
    private adminService: AdminService;
    private userService: UserService;

    constructor() {
        this.adminService = new AdminService();
        this.userService = new UserService();
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

    public async getUser(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const user = await this.userService.getUser(id);
            res.sendApiResponse(user);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const result = await this.userService.deleteUser(id);
            res.sendApiResponse({ message: 'User deleted successfully', data: result });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async getAllUser(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.userService.getAllUsers();
            res.sendApiResponse({ message: 'User fetched successfully', data: result });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        const updatedProfile = req.body;
        try {
            const userProfile = await this.userService.updateUserProfile(userId, updatedProfile, 'Admin');
            res.sendApiResponse({ data: userProfile });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async getDashboardData(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.adminService.getDashboardData();
            res.sendApiResponse({ message: 'Dashboard data fetched successfully', data: result });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }


}
