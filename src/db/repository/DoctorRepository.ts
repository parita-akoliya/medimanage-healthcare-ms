import mongoose from 'mongoose';
import { IAddress, IAvailability, IDoctor, IRegisterDoctor, IUser } from '../../types/Auth';
import { Doctor, IDoctorDocument } from '../models/Doctor.models';
import { IUserDocument, User } from '../models/User.models';
import { BaseRepository } from './BaseRepository';
import { UserRepository } from './UserRepository';

export class DoctorRepository extends BaseRepository<IDoctorDocument> {
    userRepository: UserRepository;
    constructor() {
        super(Doctor);
        this.userRepository = new UserRepository();
    }
    async registerDoctor(data: IRegisterDoctor, type: string): Promise<IRegisterDoctor> {
        try {
            let address: IAddress = {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            }
            if (data.address) {
                address = {
                    street: data.address.street,
                    city: data.address.city,
                    state: data.address.state,
                    zip: data.address.zip,
                    country: data.address.country
                };
            }
            const userData: IUser = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                contact_no: data.contact_no,
                ...(data.dob ? { dob: data.dob } : {}),
                ...(address ? { address: address } : {}),
                ...(data.gender ? { gender: data.gender } : {}),
                role: type,
                status: 'Inactive'
            };
            const user: IUserDocument = await this.userRepository.create(userData);
            const doctorData: IDoctor = {
                speciality: data.speciality,
                license_number: data.license_number,
                availability: data.availability as IAvailability[],
                yearsOfExperience: data.yearsOfExperience as string,
                clinic: data.clinic as mongoose.Types.ObjectId
            }
            data.user_id = user._id
            doctorData.user = user._id;
            const doctor: IDoctorDocument = await this.create(doctorData);
            data.doctor_id = doctor._id
            return data;
        } catch (error: any) {
            console.error('Error registering doctor:', error);
            throw new Error('Failed to register doctor');
        }
    }

    async deleteDoctor(identifier: string): Promise<IDoctor> {
        try {
            const doctor = await this.findById(identifier);
            if (!doctor) {
                throw new Error('Patient not found');
            }
            const user = await this.userRepository.findById(doctor.user);

            if (!user) {
                throw new Error('User not found');
            }

            await this.findByIdAndDelete(doctor._id);
            await User.findByIdAndDelete(user._id);
            return doctor;
        } catch (error: any) {
            console.error('Error deleting patient:', error);
            throw new Error('Failed to delete patient');
        }
    }

    async updateDoctor(identifier: string, newData: IRegisterDoctor): Promise<IDoctor> {
        try {
            const patient = await this.findById(identifier) as IDoctorDocument;

            if (!patient) {
                throw new Error('Patient not found');
            }

            const user = await this.userRepository.findById(patient.user);

            if (!user) {
                throw new Error('User not found');
            }

            const updatedPatient = await this.findByIdAndUpdate(patient._id, newData) as IDoctorDocument;

            const userUpdateData: Partial<IUser> = {
                firstName: newData.firstName,
                lastName: newData.lastName,
                contact_no: newData.contact_no,
                dob: newData.dob,
                address: newData.address,
                gender: newData.gender
            };
            await this.findByIdAndUpdate(user._id, userUpdateData);
            return updatedPatient;
        } catch (error: any) {
            console.error('Error updating patient:', error);
            throw new Error('Failed to update patient');
        }
    }

    async findByClinicId(clinicId: any): Promise<IDoctorDocument[]> {
        return await this.find({ clinic: clinicId }) as IDoctorDocument[]
    }


    async searchDoctors(query: any): Promise<IDoctorDocument[]> {
        const { name, specialty, location } = query;
        const pipeline: any[] = [
            
            {
                $lookup: {
                    from: 'users', 
                    localField: 'user', 
                    foreignField: '_id', 
                    as: 'user'
                }
            },
            
            {
                $lookup: {
                    from: 'clinics', 
                    localField: 'clinic', 
                    foreignField: '_id', 
                    as: 'clinic'
                }
            },
            { $unwind: '$user' }, 
            { $unwind: '$clinic' }, 
            
            {
                $match: {
                    ...(name ? {
                        $or: [
                            { 'user.firstName': { $regex: new RegExp(name, 'i') } },
                            { 'user.lastName': { $regex: new RegExp(name, 'i') } }
                        ]
                    } : {}),
                    ...(specialty ? { specialty: { $regex: new RegExp(specialty, 'i') } } : {}),
                    ...(location ? { 'user.address.city': { $regex: new RegExp(location, 'i') } } : {})
                }
            },
            
        ];

        try {
            const results = await Doctor.aggregate(pipeline).exec();
            return results as IDoctorDocument[];
        } catch (error) {
            console.error('Error in searchDoctors:', error); 
            throw error;
        }
    }
}
