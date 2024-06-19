import { ObjectId } from "bson";
import { IUserDocument } from "../db/models/User.models";
import { ClinicStaffRepository } from "../db/repository/ClinicStaffRepository";
import { DoctorRepository } from "../db/repository/DoctorRepository";
import { PatientRepository } from "../db/repository/PatientRepository";
import { UserRepository } from "../db/repository/UserRepository";
import { EAuthRoles } from "../types/Enums";

export class UserService {
    private userRepository: UserRepository;
    private repository: DoctorRepository | PatientRepository | UserRepository | ClinicStaffRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.repository = new UserRepository();

    }

    private getDBNameFromRole(role: string) {
        switch (role) {
            case EAuthRoles.DOCTOR:
                this.repository = new DoctorRepository();
                break;
            case EAuthRoles.ADMIN:
                this.repository = new UserRepository();
                break;
            case EAuthRoles.FRONTDESK:
                this.repository = new ClinicStaffRepository();
                break;
            case EAuthRoles.PATIENT:
                this.repository = new PatientRepository();
                break;

            default:
                break;
        }

    }

    public async getUserProfile(userId: string): Promise<any | null> {
        const userDetails = await this.userRepository.findById(userId);
        const role = userDetails?.role
        if(role){
            this.getDBNameFromRole(role)
            const roleDetails = this.repository.find({user: userDetails._id})
            return {
                user: userDetails,
                details: roleDetails
            }
        }
        throw new Error('Person details not found');

    }

    public async updateUserProfile(userId: string, updatedProfile: Partial<IUserDocument>): Promise<IUserDocument | null> {
        console.log(userId, updatedProfile);
        
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
