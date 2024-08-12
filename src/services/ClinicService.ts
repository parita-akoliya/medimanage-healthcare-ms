import { ObjectId } from "bson";
import { IClinic, IClinicRequest } from "../db/models/Clinic.models";
import { ClinicRepository } from "../db/repository/ClinicRepository";
import { DoctorRepository } from "../db/repository/DoctorRepository";
import { EmailTemplates } from "../types/EmailTemplates";
import { logger } from "../utils/logger";
import { mailSender } from "../utils/mailer";
import { AuthService } from "./AuthService";
import { ClinicStaffRepository } from "../db/repository/ClinicStaffRepository";

export class ClinicService {
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

    public async registerClinic(clinicData: Partial<IClinicRequest>): Promise<IClinic> {
        try {
            const { data, frontDesk } = clinicData;
            if (data && frontDesk) {
                const clinic = await this.clinicRepository.registerClinic(data);
                const frontDeskData = await this.authService.registerUser(frontDesk, false);
                await this.sendWelcomeEmail(clinic.name, clinic.email);
                return clinic;
            } else {
                throw new Error("Validation Error: Clinic data or front desk information is missing.");
            }
        } catch (error) {
            logger.error("Error registering clinic:", error);
            throw new Error("Failed to register clinic. Please try again later.");
        }
    }

    public async updateClinic(clinicData: Partial<IClinic>): Promise<IClinic> {
        try {
            return await this.clinicRepository.updateClinic(clinicData);
        } catch (error) {
            logger.error("Error updating clinic:", error);
            throw new Error("Failed to update clinic. Please try again later.");
        }
    }

    public async deleteClinic(clinicData: Partial<IClinic>): Promise<IClinic> {
        try {
            return await this.clinicRepository.deleteClinic(clinicData);
        } catch (error) {
            logger.error("Error deleting clinic:", error);
            throw new Error("Failed to delete clinic. Please try again later.");
        }
    }

    private async sendWelcomeEmail(name: string, email: string) {
        try {
            const mailResponse = await mailSender({
                to: email,
                subject: "Welcome to MediManage",
                templateName: EmailTemplates.WelcomeClinicEmail,
                placeholders: { name: name }
            });
            logger.debug("Email sent successfully: ", mailResponse);
        } catch (error) {
            logger.error("Error occurred while sending email:", error);
            throw new Error("Failed to send welcome email.");
        }
    }

    public async getClinicDetailsWithDoctors(clinicId: string): Promise<any> {
        try {
            const clinic = await this.clinicRepository.findById(clinicId) as IClinic;
            if (!clinic) throw new Error("Clinic not found.");
            
            const doctors = await this.doctorRepository.findByClinicId(clinicId);
            clinic.doctors = doctors;
            return { clinic };
        } catch (error) {
            logger.error("Error getting clinic details with doctors:", error);
            throw new Error("Failed to get clinic details with doctors. Please try again later.");
        }
    }

    public async getAllClinics(): Promise<any> {
        try {
            const finalClinics = [];
            const clinics = await this.clinicRepository.find({}) as any[];
            if (!clinics.length) throw new Error("No clinics found.");

            for (const clinic of clinics) {
                const doctors = await this.doctorRepository.findByClinicId(clinic._id);
                const users = await this.clinicStaffRepository.findAndPopulate({ clinic_id: clinic._id }, ['user']);
                let objClinic: any = {};
                Object.assign(objClinic, { clinic, doctors, users });
                finalClinics.push(objClinic);
            }
            return finalClinics;
        } catch (error) {
            logger.error("Error getting all clinics:", error);
            throw new Error("Failed to get clinic details with doctors. Please try again later.");
        }
    }
}
