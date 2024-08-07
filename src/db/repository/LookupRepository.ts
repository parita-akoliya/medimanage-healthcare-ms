import { BaseRepository } from './BaseRepository';
import { ILookupData, LookupData } from '../models/LookupData.models';

export class LookupRepository extends BaseRepository<ILookupData> {
    constructor() {
        super(LookupData);
    }

    async findByCategory(category: string): Promise<ILookupData[]> {
        return await this.find({ type: category }) as ILookupData[];
    }

    async findByParent(parentId: string): Promise<ILookupData[]> {
        return await this.find({ parentId }) as ILookupData[];
    }
}