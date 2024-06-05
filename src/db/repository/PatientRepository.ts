import { IAddress, IPatient, IRegisterPatient, IUser } from '../../types/Auth';
import { IPatientDocument, Patient } from '../models/Patient.models';
import { IUserDocument, User } from '../models/User.models';
import { BaseRepository } from './BaseRepository';
import { UserRepository } from './UserRepository';

export class PatientRepository extends BaseRepository<IPatientDocument> {
    userRepository: UserRepository
    constructor() {
        super(Patient);
        this.userRepository = new UserRepository();
    }

    async registerPatient(data: IRegisterPatient, type: string): Promise<IRegisterPatient> {
        try {
            if(!data.password || data.password=== ''){
                throw new Error("Passoword is mandatory field")
            }
            let address: IAddress = {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            }
            if(data.address){
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
                ...(data.dob ? {dob: data.dob}: {}),
                ...(address ? {address: address}: {}),
                ...(data.gender ? {gender: data.gender}: {}),
                password: data.password,
                role: type,
                status: 'Active'  
            };
            const user: IUserDocument = await this.userRepository.create(userData);
            const patientData: IPatient = {
                insurance_details: data.insurance_details,
                emergency_contact: data.emergency_contact,
                healthcard_details: data.healthcard_details            
            }
            data.user_id = user._id
            patientData.user = user._id;
            const patient: IPatientDocument = await this.create(patientData);
            data.patient_id = patient._id
            return data;
        } catch (error: any) {
            console.error('Error registering patient:', error);
            throw new Error('Failed to register patient');
        }
    }

    async deletePatient(identifier: string): Promise<void> {
        try {
            const patient = await this.findById(identifier);
            if (!patient) {
                throw new Error('Patient not found');
            }
            const user = await this.userRepository.findById(patient.user);

            if (!user) {
                throw new Error('User not found');
            }

            await Patient.findByIdAndDelete(patient._id);
            await User.findByIdAndDelete(user._id);
        } catch (error: any) {
            console.error('Error deleting patient:', error);
            throw new Error('Failed to delete patient');
        }
    }

    async updatePatient(identifier: string, newData: IRegisterPatient): Promise<IPatient> {
        try {
            const patient = await this.findById(identifier) as IPatientDocument;

            if (!patient) {
                throw new Error('Patient not found');
            }

            const user = await this.userRepository.findById(patient.user);

            if (!user) {
                throw new Error('User not found');
            }

            const updatedPatient = await this.findByIdAndUpdate(patient._id, newData) as IPatientDocument;

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
}
