import { Clinic, IClinic } from '../models/Clinic.models';
import { BaseRepository } from './BaseRepository';

export class ClinicRepository extends BaseRepository<IClinic> {
    constructor() {
        super(Clinic);
    }

    async registerClinic(clinicData: Partial<IClinic>): Promise<IClinic> {
        const clinic = await this.create(clinicData);
        return clinic.save();
    }

    async updateClinic(clinicData: Partial<IClinic>): Promise<IClinic> {
        const clinic = await this.findByIdAndUpdate(clinicData._id, clinicData) as IClinic;
        return clinic.save();
    }

    async deleteClinic(clinicData: Partial<IClinic>): Promise<IClinic> {
        const clinic = await this.findByIdAndDelete(clinicData._id) as IClinic;
        return clinic.save();
    }

    async searchClinics(query: any): Promise<IClinic[]> {
        const { name, location } = query;
        const searchCriteria: any = {};

        if (name) {
            searchCriteria.name = { $regex: name, $options: 'i' };
        }

        if (location) {
            searchCriteria['location.city'] = { $regex: location, $options: 'i' };
        }

        return await this.find(searchCriteria) as IClinic[];
    }
}
