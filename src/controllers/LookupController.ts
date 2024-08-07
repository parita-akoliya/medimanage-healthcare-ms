import { Request, Response } from 'express';
import { LookupService } from '../services/LookupService';

export class LookupController {
    private lookupService: LookupService
    constructor() {
        this.lookupService = new LookupService();
    }

    async createLookup(req: Request, res: Response) {
        try {
            const lookup = await this.lookupService.createLookup(req.body);
            res.status(201).json(lookup);
        } catch (error) {
            res.status(400).json({ message: 'Error creating lookup', error });
        }
    }

    async createLookupInCategory(req: Request, res: Response) {
        try {
            const { category } = req.params;
            const lookup = await this.lookupService.createLookup({ ...req.body, type: category });
            res.status(201).json(lookup);
        } catch (error) {
            res.status(400).json({ message: 'Error creating lookup in category', error });
        }
    }

    async getAllLookups(req: Request, res: Response) {
        try {
            const lookups = await this.lookupService.getAllLookups();
            res.json(lookups);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching lookups', error });
        }
    }

    async getLookupsByCategory(req: Request, res: Response) {
        try {
            const { category } = req.params;
            const lookups = await this.lookupService.getLookupsByCategory(category);
            res.json(lookups);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching lookups by category', error });
        }
    }

    async getLookupsByParent(req: Request, res: Response) {
        try {
            const { parentId } = req.params;
            const lookups = await this.lookupService.getLookupsByParent(parentId);
            res.json(lookups);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching lookups by parent', error });
        }
    }

    async updateLookup(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updatedLookup = await this.lookupService.updateLookup(id, req.body);
            if (!updatedLookup) {
                return res.status(404).json({ message: 'Lookup not found' });
            }
            res.json(updatedLookup);
        } catch (error) {
            res.status(400).json({ message: 'Error updating lookup', error });
        }
    }

    async deleteLookup(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await this.lookupService.deleteLookup(id);
            if (!result) {
                return res.status(404).json({ message: 'Lookup not found' });
            }
            res.json({ message: 'Lookup deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting lookup', error });
        }
    }
}