import { ClinicRepository } from "../db/repository/ClinicRepository";
import { DoctorRepository } from "../db/repository/DoctorRepository";
import { logger } from "../utils/logger";
import { AuthService } from "./AuthService";
import { ClinicStaffRepository } from "../db/repository/ClinicStaffRepository";
import { IDoctor, IRegisterDoctor } from "../types/Auth";
import mongoose from "mongoose";

export class DoctorService {
    private doctorRepository: DoctorRepository;

    constructor() {
        this.doctorRepository = new DoctorRepository();
    }

    public async updateDoctor(doctorData: IRegisterDoctor): Promise<IDoctor> {
        try {
            const updatedDoctor = await this.doctorRepository.updateDoctor(doctorData.doctor_id, doctorData);
            return updatedDoctor;
        } catch (error) {
            logger.error("Error updating doctor:", error);
            throw new Error("Failed to update doctor. Please try again later.");
        }
    }

    public async deleteDoctor(doctorId: string): Promise<IDoctor> {
        try {
            const deletedDoctor = await this.doctorRepository.deleteDoctor(doctorId);
            return deletedDoctor;
        } catch (error) {
            logger.error("Error deleting doctor:", error);
            throw new Error("Failed to delete doctor. Please try again later.");
        }
    }

    public async getDoctors(doctorId?: string): Promise<any> {
        try {
            let query = {};
            if (doctorId) {
                query = { _id: doctorId };
            }
            const doctors = await this.doctorRepository.findAndPopulate(query, ['user', 'clinic', 'availability']);
            return doctors;
        } catch (error) {
            logger.error("Error getting doctor(s):", error);
            throw new Error("Failed to get doctor details. Please try again later.");
        }
    }

    public async getDoctorByClinicId(clinicId: string): Promise<any> {
        try {
            const query = { clinic: new mongoose.Types.ObjectId(clinicId) };
            const doctors = await this.doctorRepository.findAndPopulate(query, ['user', 'clinic', 'availability']);
            return doctors;
        } catch (error) {
            logger.error("Error getting doctors by clinic ID:", error);
            throw new Error("Failed to get doctor details by clinic ID. Please try again later.");
        }
    }
}
