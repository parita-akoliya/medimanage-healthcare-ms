import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';
import { SlotService } from '../services/SlotService';
import { ISlotsRequest } from '../types/Slot';

export class SlotController {
    private slotService: SlotService;

    constructor() {
        this.slotService = new SlotService();
    }

    public async addSlots(req: Request, res: Response): Promise<void> {
        const slotsBody: ISlotsRequest = req.body;
        try {
            const updatedUser = await this.slotService.addSlots(slotsBody);
            res.sendApiResponse({ data: updatedUser });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }
}
