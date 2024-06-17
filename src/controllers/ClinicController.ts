import { Request, Response } from 'express';
import { ClinicService } from '../services/ClinicService';

export class ClinicController {
    private clinicService: ClinicService;

    constructor() {
        this.clinicService = new ClinicService();
    }

    public async registerClinic(req: Request, res: Response): Promise<void> {
        try {
            const clinicData = req.body;
            const clinic = await this.clinicService.registerClinic(clinicData);
            res.sendApiResponse({ data: clinic });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
    public async deleteClinic(req: Request, res: Response): Promise<void> {
        try {
            const clinicData = req.body;
            const clinic = await this.clinicService.deleteClinic(clinicData);
            res.sendApiResponse({ data: clinic });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
    public async updateClinic(req: Request, res: Response): Promise<void> {
        try {
            const clinicData = req.body;
            const clinic = await this.clinicService.updateClinic(clinicData);
            res.sendApiResponse({ data: clinic });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getClinicDetailsWithDoctors(req: Request, res: Response): Promise<void> {
        try {
            const clinicId = req.params.clinicId;
            const clinic = await this.clinicService.getClinicDetailsWithDoctors(clinicId);
            res.sendApiResponse({ data: clinic });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

}
