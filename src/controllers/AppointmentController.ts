import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';
import upload from '../utils/multerConfig';
import multer from 'multer';

declare global {
    namespace Express {
        interface Request {
            doctor?: any;
            clinic?: any;
            role?: any;
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
            const updatedUser = await this.appointmentService.scheduleAppointments(req.user.id, appointmentData);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async updateAppointmentStatus(req: Request, res: Response): Promise<void> {
        const appointmentData = req.body;
        try {
            const updatedUser = await this.appointmentService.updateAppointmentStatus(appointmentData.appointmentId, appointmentData.status);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }


    public async getAppointments(req: Request, res: Response): Promise<void> {
        try {
            let userId = req.user._id;
            if (req.role === 'Doctor') {
                userId = req.doctor.id
            }
            const updatedUser = await this.appointmentService.getAppointments(userId, req.role);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async getAppointment(req: Request, res: Response): Promise<void> {
        try {
            const appointmentId = req.params.appointmentId;
            const updatedUser = await this.appointmentService.getAppointment(appointmentId);
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

    async attendAppointments(req: Request, res: Response): Promise<void> {
        const appointmentData = req.body;

        const { appointmentId, diagnosisDoctor, diagnosisCustomer, notes, prescriptions, symptoms, } = appointmentData;
        try {
            const updatedUser = await this.appointmentService.attendAppointments(appointmentId, {
                diagnosisDoctor,
                diagnosisCustomer,
                notes,
                prescriptions,
                symptoms
            });
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }
}
