import { Request, Response } from 'express';
import { SearchService } from '../services/SearchService';

export class SearchController {
    private searchService: SearchService;

    constructor() {
        this.searchService = new SearchService();
    }

    public async searchClinics(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query;
            const clinics = await this.searchService.searchClinics(query);
            res.sendApiResponse({ data: clinics });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    public async searchDoctors(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query;
            const doctors = await this.searchService.searchDoctors(query);
            res.sendApiResponse({ data: doctors });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }
}
