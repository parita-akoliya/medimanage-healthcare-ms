import { IRegisterUser } from '../../types/Auth';
import { ClinicStaff, IClinicStaffDocument } from '../models/ClinicStaff.models';
import { BaseRepository } from './BaseRepository';

export class ClinicStaffRepository extends BaseRepository<IClinicStaffDocument> {
    constructor() {
        super(ClinicStaff);
    }

    async registerStaff(clinicData: Partial<IClinicStaffDocument>): Promise<IClinicStaffDocument> {
        const clinicStaff = await this.create(clinicData);
        return clinicStaff.save();
    }

    async updateClinicStaff(clinicStaffData: Partial<IClinicStaffDocument>): Promise<IClinicStaffDocument> {
        const clinicStaff = await this.findByIdAndUpdate(clinicStaffData._id, clinicStaffData) as IClinicStaffDocument;
        return clinicStaff.save();
    }

    async deleteClinicStaff(clinicData: Partial<IClinicStaffDocument>): Promise<IClinicStaffDocument> {
        const clinic = await this.findByIdAndDelete(clinicData._id) as IClinicStaffDocument;
        return clinic.save();
    }
}
