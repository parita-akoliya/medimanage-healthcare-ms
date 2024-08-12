import { Request, Response } from 'express';
import { LookupService } from '../services/LookupService';
import mongoose from 'mongoose';

export class LookupController {
    private lookupService: LookupService;

    constructor() {
        this.lookupService = new LookupService();
    }

    async createLookupCategory(req: Request, res: Response) {
        try {
            const { name } = req.body;
            if (!name) {
                return res.sendApiResponse({}, 'Category name is required', 400);
            }

            const category = await this.lookupService.createLookupCategory({ name }, new mongoose.Types.ObjectId(req.user._id));
            res.sendApiResponse(category, 'Category created successfully');
        } catch (error: any) {
            res.sendApiResponse({}, 'Error creating lookup category', 500);
        }
    }

    async createLookup(req: Request, res: Response) {
        try {
            const { type, value, parentId } = req.body;
            if (!type || !value) {
                return res.sendApiResponse({}, 'Type and value are required', 400);
            }

            const lookup = await this.lookupService.createLookupData({ type, value, parentId }, new mongoose.Types.ObjectId(req.user._id));
            res.sendApiResponse(lookup, 'Lookup created successfully');
        } catch (error: any) {
            res.sendApiResponse({}, 'Error creating lookup data', 500);
        }
    }

    async getAllLookups(req: Request, res: Response) {
        try {
            const categories = await this.lookupService.getAllLookups();
            res.sendApiResponse(categories, 'Lookups fetched successfully');
        } catch (error: any) {
            res.sendApiResponse({}, 'Error fetching lookups', 500);
        }
    }

    async getLookupsByCategory(req: Request, res: Response) {
        try {
            const { category } = req.params;
            if (!category) {
                return res.sendApiResponse({}, 'Category ID is required', 400);
            }

            const lookups = await this.lookupService.getLookupsByCategory(category);
            res.sendApiResponse(lookups, 'Lookups by category fetched successfully');
        } catch (error: any) {
            res.sendApiResponse({}, 'Error fetching lookups by category', 500);
        }
    }

    async getLookupsByParent(req: Request, res: Response) {
        try {
            const { parentId } = req.params;
            if (!parentId) {
                return res.sendApiResponse({}, 'Parent ID is required', 400);
            }

            const lookups = await this.lookupService.getLookupsByParent(new mongoose.Types.ObjectId(parentId));
            res.sendApiResponse(lookups, 'Lookups by parent fetched successfully');
        } catch (error: any) {
            res.sendApiResponse({}, 'Error fetching lookups by parent', 500);
        }
    }

    async updateLookup(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!id) {
                return res.sendApiResponse({}, 'Lookup ID is required', 400);
            }

            const updatedLookup = await this.lookupService.updateLookupData(new mongoose.Types.ObjectId(id), updateData);
            if (!updatedLookup) {
                return res.sendApiResponse({}, 'Lookup data not found', 404);
            }

            res.sendApiResponse(updatedLookup, 'Lookup updated successfully');
        } catch (error: any) {
            res.sendApiResponse({}, 'Error updating lookup data', 500);
        }
    }

    async updateLookupCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!id) {
                return res.sendApiResponse({}, 'Lookup ID is required', 400);
            }

            const updatedLookup = await this.lookupService.updateLookupDataCategory(new mongoose.Types.ObjectId(id), updateData);
            if (!updatedLookup) {
                return res.sendApiResponse({}, 'Lookup data not found', 404);
            }

            res.sendApiResponse(updatedLookup, 'Lookup updated successfully');
        } catch (error: any) {
            res.sendApiResponse(error, 'Error updating lookup data', 500);
        }
    }


    async createLookupInCategory(req: Request, res: Response) {
        try {
            const { category } = req.params;
            if (!category) {
                return res.sendApiResponse({}, 'Category is required', 400);
            }
            const { value, parentId } = req.body;
            if (!value) {
                return res.sendApiResponse({}, 'Value is required', 400);
            }

            const lookup = await this.lookupService.createLookupData({ type: new mongoose.Types.ObjectId(category), value, parentId }, new mongoose.Types.ObjectId(req.user._id));
            res.sendApiResponse(lookup, 'Lookup created in category successfully');
        } catch (error: any) {
            res.sendApiResponse({}, 'Error creating lookup in category', 500);
        }
    }

    async deleteLookup(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.sendApiResponse({}, 'Lookup ID is required', 400);
            }

            const result = await this.lookupService.deleteLookupData(new mongoose.Types.ObjectId(id));
            if (result.deletedCount === 0) {
                return res.sendApiResponse({}, 'Lookup data not found', 404);
            }
            res.sendApiResponse({}, 'Lookup data deleted successfully');
        } catch (error: any) {
            res.sendApiResponse({}, 'Error deleting lookup data', 500);
        }
    }

    async deleteLookupCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.sendApiResponse({}, 'Category ID is required', 400);
            }

            const result = await this.lookupService.deleteLookupDataCategory(new mongoose.Types.ObjectId(id));
            if (result.deletedCount === 0) {
                return res.sendApiResponse({}, 'Lookup data not found', 404);
            }
            res.sendApiResponse({}, 'Lookup data deleted successfully');
        } catch (error: any) {
            res.sendApiResponse({}, 'Error deleting lookup data', 500);
        }
    }


    async getAllCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this.lookupService.getAllLookupCategories();
            res.sendApiResponse(categories, 'Categories fetched successfully');
        } catch (error: any) {
            res.sendApiResponse({}, 'Error fetching categories', 500);
        }
    }
}
