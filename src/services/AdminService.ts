import { IUserDocument } from "../db/models/User.models";
import { AppointmentRepository } from "../db/repository/AppointmentRepository";
import { DoctorRepository } from "../db/repository/DoctorRepository";
import { PatientRepository } from "../db/repository/PatientRepository";
import { UserRepository } from "../db/repository/UserRepository";
import { EAppointmentStatus } from "../types/Enums";

export class AdminService {
    private userRepository: UserRepository;
    private doctorRepository: DoctorRepository;
    private patientRepository: PatientRepository;
    private appointmentRepository: AppointmentRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.doctorRepository = new DoctorRepository();
        this.patientRepository = new PatientRepository();
        this.appointmentRepository = new AppointmentRepository();
    }

    async changeUserRole(userId: string, newRole: string): Promise<IUserDocument | null> {
        return this.userRepository.changeUserRole(userId, newRole);
    }

    async updateUserEmail(userId: string, newEmail: string): Promise<IUserDocument | null> {
        return this.userRepository.updateUserEmail(userId, newEmail);
    }

    async resetUserPassword(userId: string, newPassword: string): Promise<IUserDocument | null> {
        return this.userRepository.resetUserPassword(userId, newPassword);
    }

    async getDashboardData(role: string): Promise<any> {
        return {
            patients: await this.patientRepository.countDocuments({}),
            appoinments: await this.appointmentRepository.countDocuments({status: { $in: [EAppointmentStatus.ATTENDED, EAppointmentStatus.SCHEDULED]}}),
            doctors: await this.doctorRepository.countDocuments({}),
        } 
    }

}
