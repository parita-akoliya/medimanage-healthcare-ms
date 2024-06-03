import mongoose, { Document, Schema } from 'mongoose';
import { IPrescription, IPrescriptionDocument } from '../../types/Auth';

export interface IPatientRecord extends Document {
    description: string;
    symptoms: string[];
    diagnosis: string[];
    prescriptions: IPrescription[];
    documents: IPrescriptionDocument[];
}

const prescriptionSchema = new Schema({
    medication: String,
    dosage: String,
    duration: String,
});

const documentSchema = new Schema({
    name: String,
    url: String,
});

const patientRecordSchema = new Schema({
    description: { type: String, required: true },
    symptoms: { type: [String], required: true },
    diagnosis: { type: [String], required: true },
    prescriptions: { type: [prescriptionSchema], required: true },
    documents: { type: [documentSchema], required: true },
});



export const PatientRecord = mongoose.model<IPatientRecord>('PatientRecord', patientRecordSchema);
