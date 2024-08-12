import { ObjectId } from 'bson';
import { IUserDocument } from '../db/models/User.models';
import { ClinicStaffRepository } from '../db/repository/ClinicStaffRepository';
import { DoctorRepository } from '../db/repository/DoctorRepository';
import { PatientRepository } from '../db/repository/PatientRepository';
import { UserRepository } from '../db/repository/UserRepository';
import { EAuthRoles } from '../types/Enums';
import { AppointmentRepository } from '../db/repository/AppointmentRepository';

export class UserService {
    private userRepository: UserRepository;
    private appointmentRepository: AppointmentRepository;
    private repositories: {
        [key in EAuthRoles]: any;
    };

    constructor() {
        this.userRepository = new UserRepository();
        this.appointmentRepository = new AppointmentRepository();
        this.repositories = {
            [EAuthRoles.DOCTOR]: new DoctorRepository(),
            [EAuthRoles.ADMIN]: new UserRepository(),
            [EAuthRoles.FRONTDESK]: new ClinicStaffRepository(),
            [EAuthRoles.PATIENT]: new PatientRepository()
        };
    }

    private getRepositoryForRole(role: EAuthRoles) {
        const repository = this.repositories[role];
        if (!repository) {
            throw new Error('Invalid role provided.');
        }
        return repository;
    }

    private async getDBNameFromRole(userId: string, role: EAuthRoles): Promise<any> {
        const repository = this.getRepositoryForRole(role);

        try {
            switch (role) {
                case EAuthRoles.DOCTOR:
                    return await repository.findAndPopulate({ user: userId }, ['clinic']);
                case EAuthRoles.ADMIN:
                    return await repository.find({ user: userId });
                case EAuthRoles.FRONTDESK:
                    return await repository.findAndPopulate({ user: userId }, ['clinic_id']);
                case EAuthRoles.PATIENT:
                    const patientDetails = await repository.findOne({ user: userId });

                    if (patientDetails) {
                        const appointments = await this.appointmentRepository.findAndPopulate(
                            { patient_id: patientDetails._id },
                            ['slot_id', 'clinic_id']
                        );
                        return { patientDetails, appointments };
                    }
                    return patientDetails;
                default:
                    throw new Error('Invalid role provided.');
            }
        } catch (error) {
            console.error(`Error in getDBNameFromRole for role ${role}:`, error);
            throw new Error('Failed to fetch data based on role.');
        }
    }

    private async updateDBNameFromRole(userId: string, role: EAuthRoles, details: any): Promise<any> {
        const repository = this.getRepositoryForRole(role);
        try {
            switch (role) {
                case EAuthRoles.DOCTOR:
                case EAuthRoles.FRONTDESK:
                    return await repository.updateOne({ user: userId }, details);
                default:
                    throw new Error('Update not supported for this role.');
            }
        } catch (error) {
            console.error(`Error in updateDBNameFromRole for role ${role}:`, error);
            throw new Error('Failed to update data based on role.');
        }
    }

    public async getUserProfile(userId: string): Promise<{ user: IUserDocument; details: any }> {
        try {
            const userDetails = await this.userRepository.findById(userId);

            if (!userDetails) {
                throw new Error('User details not found.');
            }

            const roleDetails = await this.getDBNameFromRole(userDetails._id as string, userDetails.role as EAuthRoles);
            return {
                user: userDetails,
                details: roleDetails || {}
            };
        } catch (error) {
            console.error('Error in getUserProfile:', error);
            throw new Error('Failed to fetch user profile.');
        }
    }

    public async updateUserProfile(userId: string, updatedProfile: any, role: string): Promise<IUserDocument | null> {
        try {
            const result = await this.userRepository.findByIdAndUpdate(userId, updatedProfile.profileData);
            await this.updateDBNameFromRole(userId, role as EAuthRoles, updatedProfile.details);
            return result;
        } catch (error) {
            console.error('Error in updateUserProfile:', error);
            throw new Error('Failed to update user profile.');
        }
    }

    public async getUser(id: string): Promise<IUserDocument | null> {
        try {
            return await this.userRepository.findById(id);
        } catch (error) {
            console.error('Error in getUser:', error);
            throw new Error('Failed to fetch user.');
        }
    }

    public async deleteUser(id: string): Promise<any | null> {
        try {
            return await this.userRepository.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error in deleteUser:', error);
            throw new Error('Failed to delete user.');
        }
    }

    private async processUser(user: IUserDocument): Promise<any> {
        try {
            const roleDetails = await this.getDBNameFromRole(user._id as string, user.role as EAuthRoles);
            return { ...user.toObject(), details: roleDetails };
        } catch (error) {
            console.error('Error in processUser:', error);
            throw new Error('Failed to process user.');
        }
    }

    public async processUsers(users: IUserDocument[]): Promise<IUserDocument[]> {
        try {
            return await Promise.all(users.map(user => this.processUser(user)));
        } catch (error) {
            console.error('Error in processUsers:', error);
            throw new Error('Failed to process users.');
        }
    }

    public async getAllUsers(): Promise<IUserDocument[]> {
        try {
            const users = await this.userRepository.find({}) as IUserDocument[];
            return this.processUsers(users);
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            throw new Error('Failed to fetch all users.');
        }
    }
}
