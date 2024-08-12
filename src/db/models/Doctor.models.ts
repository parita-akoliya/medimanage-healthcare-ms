import mongoose, { Document, Schema } from 'mongoose';
import { IAvailability, IAvailaibleDates } from '../../types/Auth';

export interface IDoctorDocument extends Document {
    user: mongoose.Types.ObjectId;
    speciality: string;
    license_number: string;
    availability: IAvailability[];
    availableDates: IAvailaibleDates
    yearsOfExperience: string;
    clinic: mongoose.Types.ObjectId;
    createdAt: Date;
}


const availabilitySchema = new Schema({
    day: String,
    startTime: String,
    endTime: String,
});

const availaibleDates = new Schema({
    startDate: String,
    endDate: String,
});


const doctorSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    speciality: { type: String, required: false },
    license_number: { type: String, required: false },
    availability: { type: [availabilitySchema], required: false },
    availableDates: { type: availaibleDates, required: false },
    yearsOfExperience: { type: String, required: false },
    clinic: { type: Schema.Types.ObjectId, ref: 'Clinic', required: false },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});


export const Doctor = mongoose.model<IDoctorDocument>('Doctor', doctorSchema);
