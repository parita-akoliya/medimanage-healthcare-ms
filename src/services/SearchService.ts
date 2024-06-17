import config from "../config";
import { OtpRepository } from "../db/repository/OtpRepository";
import { PasswordResetTokenRepository } from "../db/repository/PasswordResetTokenRepository";
import { UserRepository } from "../db/repository/UserRepository";
import { EAuthRoles } from "../types/Enums";
import { EmailTemplates } from "../types/EmailTemplates";
import { logger } from "../utils/logger";
import { mailSender } from "../utils/mailer";
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import { IUserDocument } from "../db/models/User.models";
import { DoctorRepository } from "../db/repository/DoctorRepository";
import { IRegisterDoctor, IRegisterPatient, IUser } from "../types/Auth";
import { PatientRepository } from "../db/repository/PatientRepository";
import { IDoctorDocument } from "../db/models/Doctor.models";
import { ClinicRepository } from "../db/repository/ClinicRepository";
import { IClinic } from "../db/models/Clinic.models";

export class SearchService {
    clinicRepository: ClinicRepository;
    doctorRepository: DoctorRepository;

    constructor(){
        this.clinicRepository = new ClinicRepository();
        this.doctorRepository = new DoctorRepository();
    }

    public async searchDoctors(query: any): Promise<IDoctorDocument[]> {
        return await this.doctorRepository.searchDoctors(query);
    }

    public async searchClinics(query: any): Promise<IClinic[]> {
        return await this.clinicRepository.searchClinics(query);
    }
}
