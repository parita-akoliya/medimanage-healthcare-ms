import mongoose, { Document, Schema } from 'mongoose';
import { IAvailability } from '../../types/Auth';

export interface IDoctorDocument extends Document {
    user: mongoose.Types.ObjectId;
    speciality: string;
    license_number: string;
    availability: IAvailability[];
    yearsOfExperience: string;
    clinic: mongoose.Types.ObjectId;
}


const availabilitySchema = new Schema({
    day: String,
    startTime: String,
    endTime: String,
});

const doctorSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    speciality: { type: String, required: false },
    license_number: { type: String, required: false },
    availability: { type: [availabilitySchema], required: false },
    yearsOfExperience: { type: String, required: false },
    clinic: { type: Schema.Types.ObjectId, ref: 'Clinic', required: false }
}, {
    timestamps: true,
});


export const Doctor = mongoose.model<IDoctorDocument>('Doctor', doctorSchema);
