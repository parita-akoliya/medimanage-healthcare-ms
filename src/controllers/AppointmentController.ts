import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';

declare global {
    namespace Express {
        interface Request {
            doctor?: any;
        }
    }
}


export class AppointmentController {
    private appointmentService: AppointmentService;

    constructor() {
        this.appointmentService = new AppointmentService();
    }

    public async scheduleAppointment(req: Request, res: Response): Promise<void> {
        const appointmentData = req.body;
        try {
            const updatedUser = await this.appointmentService.scheduleAppointments(req.user.id,appointmentData);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async updateAppointmentStatus(req: Request, res: Response): Promise<void> {
        const appointmentData = req.body;
        try {
            const updatedUser = await this.appointmentService.updateAppointmentStatus(appointmentData.appointmentId,appointmentData.status);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }


    public async getAppointments(req: Request, res: Response): Promise<void> {
        const userId = req.doctor.id;
        try {
            const updatedUser = await this.appointmentService.getAppointments(userId);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async cancelAppointments(req: Request, res: Response): Promise<void> {
        const { userId } = req.body;
        try {
            const updatedUser = await this.appointmentService.cancelAppointments(userId);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }
}
