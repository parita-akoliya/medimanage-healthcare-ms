import mongoose, { Document, Schema } from 'mongoose';
import { AppointmentStatuses } from '../../types/Enums';

export interface IAppointment extends Document {
    patient_id: mongoose.Types.ObjectId;
    doctor_id: mongoose.Types.ObjectId;
    slot_id: mongoose.Types.ObjectId;
    clinic_id: mongoose.Types.ObjectId;
    record_id: mongoose.Types.ObjectId;
    billing_id: mongoose.Types.ObjectId;
    reason: string;
    status: string;
    type: string;
}

const appointmentSchema = new Schema({
    patient_id: { type: mongoose.Types.ObjectId, ref: 'Patient', required: true },
    doctor_id: { type: mongoose.Types.ObjectId, ref: 'Doctor', required: true },
    slot_id: { type: mongoose.Types.ObjectId, ref: 'Slot', required: true },
    clinic_id: { type: mongoose.Types.ObjectId, ref: 'Clinic', required: true },
    record_id: { type: mongoose.Types.ObjectId, ref: 'PatientRecord', required: false },
    billing_id: { type: mongoose.Types.ObjectId, ref: 'Billing', required: false },
    reason: { type: String, required: true },
    status: { type: String, enum: AppointmentStatuses, required: true },
    type: { type: String, required: false },
});


export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
