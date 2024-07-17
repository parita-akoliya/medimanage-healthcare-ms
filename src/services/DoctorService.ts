import { ObjectId } from "bson";
import { IClinic, IClinicRequest } from "../db/models/Clinic.models";
import { ClinicRepository } from "../db/repository/ClinicRepository";
import { DoctorRepository } from "../db/repository/DoctorRepository";
import { EmailTemplates } from "../types/EmailTemplates";
import { logger } from "../utils/logger";
import { mailSender } from "../utils/mailer";
import { AuthService } from "./AuthService";
import { ClinicStaffRepository } from "../db/repository/ClinicStaffRepository";
import { IDoctor, IRegisterDoctor } from "../types/Auth";
import mongoose from "mongoose";

export class DoctorService {
    private doctorRepository: DoctorRepository;
    private clinicRepository: ClinicRepository;
    private authService: AuthService;
    private clinicStaffRepository: ClinicStaffRepository;

    constructor() {
        this.clinicRepository = new ClinicRepository();
        this.doctorRepository = new DoctorRepository();
        this.authService = new AuthService();
        this.clinicStaffRepository = new ClinicStaffRepository();
    }

    public async updateDoctor(doctorData: IRegisterDoctor): Promise<IDoctor> {
        return await this.doctorRepository.updateDoctor(doctorData.doctor_id, doctorData);
    }
    public async deleteDoctor(doctorId: string): Promise<IDoctor> {
        return await this.doctorRepository.deleteDoctor(doctorId);
    }

    public async getDoctors(doctorId?: string): Promise<any> {
        try {
            let query = {}
            if(doctorId){
                query = {
                    _id : doctorId
                }
            }
            const doctors = await this.doctorRepository.findAndPopulate(query, ['user', 'clinic', 'availability'])
            return doctors;
        } catch (error: any) {
            console.error('Error getting clinic details with doctors:', error);
            throw new Error('Failed to get clinic details with doctors');
        }
    }


    public async getDoctorByClinicId(clinicId: string): Promise<any> {
        try {
            let query = {
                    clinic : new mongoose.Types.ObjectId(clinicId)
                }
            const doctors = await this.doctorRepository.findAndPopulate(query, ['user', 'clinic', 'availability'])
            return doctors;
        } catch (error: any) {
            console.error('Error getting clinic details with doctors:', error);
            throw new Error('Failed to get clinic details with doctors');
        }
    }

}
