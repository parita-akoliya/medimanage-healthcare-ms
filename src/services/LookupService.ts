import { ILookupData } from "../db/models/LookupData.models";
import { LookupRepository } from "../db/repository/LookupRepository";

export class LookupService {
    private lookupRepository: LookupRepository
    constructor() {
        this.lookupRepository = new LookupRepository();
    }

    async createLookup(data: Partial<ILookupData>): Promise<ILookupData> {
        return this.lookupRepository.create(data);
    }

    async getAllLookups(): Promise<ILookupData[] | null> {
        return this.lookupRepository.find({});
    }

    async getLookupsByCategory(category: string): Promise<ILookupData[] | null> {
        return this.lookupRepository.findByCategory(category);
    }

    async getLookupsByParent(parentId: string): Promise<ILookupData[] | null> {
        return this.lookupRepository.findByParent(parentId);
    }

    async updateLookup(id: string, data: Partial<ILookupData>): Promise<ILookupData | null> {
        return this.lookupRepository.findByIdAndUpdate(id, data)
    }

    async deleteLookup(id: string): Promise<ILookupData | null> {
        return this.lookupRepository.findByIdAndDelete(id);
    }
}