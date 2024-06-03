import mongoose, { Document, Schema } from 'mongoose';

export interface ISlot extends Document {
    start_time: Date;
    end_time: Date;
    status: string;
    date: Date;
    doctor_id: mongoose.Types.ObjectId;
}

const slotSchema = new Schema({
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    status: { type: String, required: true },
    date: { type: Date, required: true },
    doctor_id: { type: mongoose.Types.ObjectId, ref: 'Doctor', required: true },
});


export const Slot = mongoose.model<ISlot>('Slot', slotSchema);
