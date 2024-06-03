import mongoose, { Document, Schema, Types } from 'mongoose';
import { IPatient } from '../../types/Auth';

export interface IPatientDocument extends IPatient, Document {
    user: Types.ObjectId,
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
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    insurance_details: { type: insuranceDetailsSchema, required: false },
    emergency_contact: { type: String, required: false },
    healthcard_details: { type: healthcardDetailsSchema, required: false },
    health_history2: { type: String, required: false },
});


export const Patient = mongoose.model<IPatientDocument>('Patient', patientSchema);
