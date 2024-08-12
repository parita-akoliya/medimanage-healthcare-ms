import mongoose, { Document, Schema } from 'mongoose';
import { SlotStatuses } from '../../types/Enums';

export interface ISlotDocument extends Document {
    start_time: Date;
    end_time: Date;
    status: string;
    date: Date;
    doctor_id: mongoose.Types.ObjectId;
    createdAt: Date;
}

const slotSchema = new Schema({
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    status: { type: String, enum: SlotStatuses,required: true },
    date: { type: Date, required: true },
    doctor_id: { type: mongoose.Types.ObjectId, ref: 'Doctor', required: true },
    createdAt: { type: Date, default: Date.now },
});


export const Slot = mongoose.model<ISlotDocument>('Slot', slotSchema);
