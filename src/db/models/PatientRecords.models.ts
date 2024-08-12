import mongoose, { Document, Schema } from 'mongoose';
import { IPrescription, IPrescriptionDocument } from '../../types/Auth';

export interface IPatientRecord extends Document {
    notes: string;
    symptoms: string[];
    diagnosis: string;
    diagnosisForCustomer: string;
    prescriptions: IPrescription[];
    documents: IPrescriptionDocument[];
    createdAt: Date;
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
    createdAt: { type: Date, default: Date.now },
    notes: { type: String, required: false },
    symptoms: { type: String, required: false },
    diagnosisForCustomer: { type: String, required: false },
    diagnosis: { type: String, required: true },
    prescriptions: { type: [prescriptionSchema], required: false },
    documents: { type: [documentSchema], required: false },
});



export const PatientRecord = mongoose.model<IPatientRecord>('PatientRecord', patientRecordSchema);
