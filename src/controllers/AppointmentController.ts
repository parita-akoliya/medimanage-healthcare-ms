import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';

export class AppointmentController {
    private appointmentService: AppointmentService;

    constructor() {
        this.appointmentService = new AppointmentService();
    }

    public async getAppointments(req: Request, res: Response): Promise<void> {
        const { userId, newRole } = req.body;
        try {
            const updatedUser = await this.appointmentService.getAppointments(userId);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async cancelAppointments(req: Request, res: Response): Promise<void> {
        const { userId, newEmail } = req.body;
        try {
            const updatedUser = await this.appointmentService.cancelAppointments(userId, newEmail);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }
}
