import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IClinicStaffDocument extends Document {
    user: Types.ObjectId;
    staff_number: string;
    clinic_id: mongoose.Types.ObjectId;
    createdAt: Date;
}

const clinicStaffSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    staff_number: { type: String, required: false },
    clinic_id: { type: Schema.Types.ObjectId, ref: 'Clinic', required: false },
    createdAt: { type: Date, default: Date.now },

}, {
    timestamps: true,
});


export const ClinicStaff = mongoose.model<IClinicStaffDocument>('ClinicStaff', clinicStaffSchema);
