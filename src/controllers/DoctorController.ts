import { Request, Response } from 'express';
import { ClinicService } from '../services/ClinicService';
import { DoctorService } from '../services/DoctorService';

export class DoctorController {
    private doctorService: DoctorService;

    constructor() {
        this.doctorService = new DoctorService();
    }

    public async deleteDoctor(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req.params.doctor_id;
            const doctor = await this.doctorService.deleteDoctor(doctorId);
            res.sendApiResponse({ data: doctor });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
    public async updateDoctor(req: Request, res: Response): Promise<void> {
        try {
            const doctorData = req.body;
            const doctor = await this.doctorService.updateDoctor(doctorData);
            res.sendApiResponse({ data: doctor });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getAllDoctor(req: Request, res: Response): Promise<void> {
        try {
            const doctors = await this.doctorService.getDoctors();
            res.sendApiResponse({ data: doctors });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getDoctor(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req.params.doctor_id;
            const doctors = await this.doctorService.getDoctors(doctorId);
            res.sendApiResponse({ data: doctors });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getDoctorByClinicId(req: Request, res: Response): Promise<void> {
        try {
            const clinicId = req.params.clinic_id;
            const doctors = await this.doctorService.getDoctorByClinicId(clinicId);
            res.sendApiResponse({ data: doctors });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

}
