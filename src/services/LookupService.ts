import mongoose from 'mongoose';
import { ILookupData, LookupData } from '../db/models/LookupData.models';
import { ILookupDataCategory, LookupDataCategory } from '../db/models/LookupTypeCategory.models';
import { logger } from '../utils/logger';

export class LookupService {
    async createLookupCategory(data: { name: string }, createdBy: mongoose.Types.ObjectId): Promise<ILookupDataCategory> {
        try {
            if (!data.name) {
                throw new Error('Category name is required');
            }

            const newCategory = new LookupDataCategory({
                name: data.name,
                createdBy: createdBy
            });

            return await newCategory.save();
        } catch (error: any) {
            logger.error('Error creating lookup category:', error.message);
            throw new Error('Failed to create lookup category: ' + error.message);
        }
    }

    async createLookupData(data: { type: mongoose.Types.ObjectId; value: string; parentId?: mongoose.Types.ObjectId }, createdBy: mongoose.Types.ObjectId): Promise<ILookupData> {
        try {
            if (!data.type || !data.value) {
                throw new Error('Type and value are required');
            }

            const newLookupData = new LookupData({
                type: data.type,
                value: data.value,
                parentId: data.parentId || null,
                createdBy: createdBy
            });

            return await newLookupData.save();
        } catch (error: any) {
            logger.error('Error creating lookup data:', error.message);
            throw new Error('Failed to create lookup data: ' + error.message);
        }
    }

    async getAllLookups(): Promise<ILookupData[]> {
        try {
            return await LookupData.find().populate(['parentId', 'type']).exec();
        } catch (error: any) {
            logger.error('Error fetching lookup data:', error.message);
            throw new Error('Failed to fetch lookup data: ' + error.message);
        }
    }

    async getAllLookupCategories(): Promise<ILookupDataCategory[]> {
        try {
            return await LookupDataCategory.find().exec();
        } catch (error: any) {
            logger.error('Error fetching lookup categories:', error.message);
            throw new Error('Failed to fetch lookup categories: ' + error.message);
        }
    }

    async getLookupsByCategory(category: string): Promise<ILookupData[]> {
        try {
            const lookupCategory = await LookupDataCategory.findOne({ name: { '$regex': category, $options: 'i' }}).exec();
            if(!lookupCategory) {
                throw new Error('Category not found')
            }
            return await LookupData.find({ type: lookupCategory?._id }).populate('type').exec();
        } catch (error: any) {
            logger.error('Error fetching lookups by category:', error.message);
            throw new Error('Failed to fetch lookups by category: ' + error.message);
        }
    }

    async getLookupsByParent(parentId: mongoose.Types.ObjectId): Promise<ILookupData[]> {
        try {
            return await LookupData.find({ parentId }).populate('type').exec();
        } catch (error: any) {
            logger.error('Error fetching lookups by parent:', error.message);
            throw new Error('Failed to fetch lookups by parent: ' + error.message);
        }
    }

    async updateLookupData(id: mongoose.Types.ObjectId, update: Partial<ILookupData>): Promise<ILookupData | null> {
        try {
            const updatedLookupData = await LookupData.findByIdAndUpdate(id, update, { new: true }).exec();
            if (!updatedLookupData) {
                throw new Error('Lookup data not found');
            }
            return updatedLookupData;
        } catch (error: any) {
            logger.error('Error updating lookup data:', error.message);
            throw new Error('Failed to update lookup data: ' + error.message);
        }
    }

    async updateLookupDataCategory(id: mongoose.Types.ObjectId, update: Partial<ILookupDataCategory>): Promise<ILookupDataCategory | null> {
        try {
            const updatedLookupDataCategory = await LookupDataCategory.findByIdAndUpdate(id, update, { new: true }).exec();
            if (!updatedLookupDataCategory) {
                throw new Error('Lookup category not found');
            }
            return updatedLookupDataCategory;
        } catch (error: any) {
            logger.error('Error updating lookup category:', error.message);
            throw new Error('Failed to update lookup category: ' + error.message);
        }
    }

    async deleteLookupData(id: mongoose.Types.ObjectId): Promise<{ deletedCount?: number }> {
        try {

            await LookupData.deleteMany({ parentId: id }).exec();
            
            const childLookups = await LookupData.find({ parentId: id }).exec();
            for (const lookup of childLookups) {
                await this.deleteLookupData(lookup._id as mongoose.Types.ObjectId);
            }
            
            const result = await LookupData.deleteOne({ _id: id }).exec();
            if (result.deletedCount === 0) {
                throw new Error('Lookup data not found');
            }
            return result;
        } catch (error: any) {
            logger.error('Error deleting lookup data:', error.message);
            throw new Error('Failed to delete lookup data: ' + error.message);
        }
    }

    async deleteLookupDataCategory(id: mongoose.Types.ObjectId): Promise<{ deletedCount?: number }> {
        try {
            const lookups = await LookupData.find({ type: id }).exec();
            
            for (const lookup of lookups) {
                await this.deleteLookupData(lookup._id as mongoose.Types.ObjectId);
            }
            
            const result = await LookupDataCategory.deleteOne({ _id: id }).exec();
            if (result.deletedCount === 0) {
                throw new Error('Lookup category not found');
            }
            return result;
        } catch (error: any) {
            logger.error('Error deleting lookup category:', error.message);
            throw new Error('Failed to delete lookup category: ' + error.message);
        }
    }
}
