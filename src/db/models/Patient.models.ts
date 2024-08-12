import mongoose, { Document, Schema, Types } from 'mongoose';
import { IPatient } from '../../types/Auth';

export interface IPatientDocument extends IPatient, Document {
    user: Types.ObjectId,
    createdAt: Date;
    insurance_details?: any;
    emergency_contact?: any;
    healthcard_details?: any;
    health_history?: any;
}

const insuranceDetailsSchema = new Schema({
    provider: String,
    policyNumber: String,
    validTill: Date,
});

const healthcardDetailsSchema = new Schema({
    cardNumber: String,
    validTill: Date,
});

const patientSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    insurance_details: { type: insuranceDetailsSchema, required: false },
    emergency_contact: { type: String, required: false },
    healthcard_details: { type: healthcardDetailsSchema, required: false },
    health_history: { type: String, required: false },
});


export const Patient = mongoose.model<IPatientDocument>('Patient', patientSchema);
