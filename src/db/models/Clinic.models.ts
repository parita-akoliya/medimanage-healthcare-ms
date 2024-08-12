import mongoose, { Document, Schema } from 'mongoose';
import { IAddress, IUser } from '../../types/Auth';


export interface IClinic extends Document {
    name: string;
    address: IAddress;
    phone: string;
    email: string;
    specialty: string[];
    doctors?: any;
    createdAt: Date;
}

export interface IClinicRequest {
    data: IClinic;
    frontDesk: IUser;
}

const addressSchema = new Schema({
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
});

const clinicSchema = new Schema({
    name: { type: String, required: true },
    address: { type: addressSchema, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    specialty: { type: [String], required: false },
    createdAt: { type: Date, default: Date.now },
});

export const Clinic = mongoose.model<IClinic>('Clinic', clinicSchema);
