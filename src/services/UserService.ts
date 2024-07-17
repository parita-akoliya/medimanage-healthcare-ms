import { ObjectId } from "bson";
import { IUserDocument } from "../db/models/User.models";
import { ClinicStaffRepository } from "../db/repository/ClinicStaffRepository";
import { DoctorRepository } from "../db/repository/DoctorRepository";
import { PatientRepository } from "../db/repository/PatientRepository";
import { UserRepository } from "../db/repository/UserRepository";
import { EAuthRoles } from "../types/Enums";
import mongoose from "mongoose";
import { AppointmentRepository } from "../db/repository/AppointmentRepository";

export class UserService {
    private userRepository: UserRepository;
    private appointmentRepository: AppointmentRepository;
    private repository: DoctorRepository | PatientRepository | UserRepository | ClinicStaffRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.repository = new UserRepository();
        this.appointmentRepository = new AppointmentRepository();

    }

    private async getDBNameFromRole(userId: any, role: string) {
        try {
            switch (role) {
                case EAuthRoles.DOCTOR:
                    this.repository = new DoctorRepository();
                    return await this.repository.findAndPopulate({user: userId}, ['clinic']);
    
                case EAuthRoles.ADMIN:
                    this.repository = new UserRepository();
                    return await this.repository.find({user: userId});
    
                case EAuthRoles.FRONTDESK:
                    this.repository = new ClinicStaffRepository();
                    return await this.repository.findAndPopulate({user: userId}, ['clinic_id']);
    
                case EAuthRoles.PATIENT:
                    this.repository = new PatientRepository();
                    let patient_details: any = await this.repository.findOne({user: userId});
                    
                    if (patient_details) {
                        if (!this.appointmentRepository) {
                            throw new Error('AppointmentRepository is not initialized.');
                        }
    
                        let appointmentsObj = await this.appointmentRepository.findAndPopulate({patient_id: patient_details._id}, ['slot_id','clinic_id']);
                        return [appointmentsObj];
                    }
                    return patient_details
                    
                default:
                    throw new Error('Invalid role provided.');
            }
        } catch (error) {
            console.error('Error in getDBNameFromRole:', error);
            throw error;
        }
    }
    
    public async getUserProfile(userId: string): Promise<any | null> {
        const userDetails = await this.userRepository.findById(userId);
        const role = userDetails?.role
        if(role){
            const roleDetails = await this.getDBNameFromRole(userDetails._id, role)
            console.log(JSON.stringify(roleDetails));
            
            return {
                user: userDetails,
                details: roleDetails && roleDetails.length>0 ? roleDetails[0]: {}
            }
        }
        throw new Error('Person details not found');
    }

    public async updateUserProfile(userId: string, updatedProfile: Partial<IUserDocument>): Promise<IUserDocument | null> {
        return this.userRepository.findByIdAndUpdate(userId, updatedProfile);
    }

    public async getUser(id: string): Promise<IUserDocument | null> {
        const user = await this.userRepository.findById(id);
        return user;
    }

    public async deleteUser(id: string): Promise<IUserDocument | null> {
        const user = await this.userRepository.findByIdAndDelete(id) as IUserDocument;
        return user;
    }

    public async getAllUsers(): Promise<IUserDocument[] | null> {
        const user = await this.userRepository.find({}) as IUserDocument[];
        return user;
    }
}
