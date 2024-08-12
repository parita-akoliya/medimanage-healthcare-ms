import { DoctorRepository } from "../db/repository/DoctorRepository";
import { IDoctorDocument } from "../db/models/Doctor.models";
import { ClinicRepository } from "../db/repository/ClinicRepository";
import { IClinic } from "../db/models/Clinic.models";
import { logger } from "../utils/logger";

export class SearchService {
    private clinicRepository: ClinicRepository;
    private doctorRepository: DoctorRepository;

    constructor() {
        this.clinicRepository = new ClinicRepository();
        this.doctorRepository = new DoctorRepository();
    }

    public async searchDoctors(query: any): Promise<IDoctorDocument[]> {
        try {
            const doctors = await this.doctorRepository.searchDoctors(query);
            return doctors;
        } catch (error) {
            logger.error("Error searching doctors:", error);
            throw new Error("Failed to search doctors. Please try again later.");
        }
    }

    public async searchClinics(query: any): Promise<IClinic[]> {
        try {
            const clinics = await this.clinicRepository.searchClinics(query);
            return clinics;
        } catch (error) {
            logger.error("Error searching clinics:", error);
            throw new Error("Failed to search clinics. Please try again later.");
        }
    }
}
