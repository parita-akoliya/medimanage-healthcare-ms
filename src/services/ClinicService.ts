import { IClinic, IClinicRequest } from "../db/models/Clinic.models";
import { ClinicRepository } from "../db/repository/ClinicRepository";
import { DoctorRepository } from "../db/repository/DoctorRepository";
import { EmailTemplates } from "../types/EmailTemplates";
import { logger } from "../utils/logger";
import { mailSender } from "../utils/mailer";
import { AuthService } from "./AuthService";

export class ClinicService {
    private doctorRepository: DoctorRepository;
    private clinicRepository: ClinicRepository;
    private authService: AuthService;

    constructor() {
        this.clinicRepository = new ClinicRepository();
        this.doctorRepository = new DoctorRepository();
        this.authService = new AuthService();
    }

    public async registerClinic(clinicData: Partial<IClinicRequest>): Promise<IClinic> {
        const {data, frontDesk} = clinicData
        if(data && frontDesk){
            const clinic = await this.clinicRepository.registerClinic(data);
            const frontDeskData = await this.authService.registerUser(frontDesk, false)
            await this.sendWelcomeEmail(clinic.name, clinic.email)
            return clinic;
        }
        throw "Validation Error"
    }
    public async updateClinic(clinicData: Partial<IClinic>): Promise<IClinic> {
        return await this.clinicRepository.updateClinic(clinicData);
    }
    public async deleteClinic(clinicData: Partial<IClinic>): Promise<IClinic> {
        return this.clinicRepository.deleteClinic(clinicData);
    }

    private async sendWelcomeEmail(name: string, email: string) {
        try {
            const mailResponse = await mailSender({
              to:email,
              subject: "Welcome to MediManage",
              templateName: EmailTemplates.WelcomeClinicEmail,
              placeholders: {name: name}}
            );
            logger.debug("Email sent successfully: ", mailResponse)
          } catch (error: any) {
            logger.error("Error occurred while sending email: ", error);
            throw error;
          }
    }


    public async getClinicDetailsWithDoctors(clinicId: string): Promise<any> {
        try {
            const clinic = await this.clinicRepository.findById(clinicId) as IClinic;
            const doctors = await this.doctorRepository.findByClinicId(clinicId);
            clinic.doctors = doctors
            return { clinic };
        } catch (error: any) {
            console.error('Error getting clinic details with doctors:', error);
            throw new Error('Failed to get clinic details with doctors');
        }
    }
}
