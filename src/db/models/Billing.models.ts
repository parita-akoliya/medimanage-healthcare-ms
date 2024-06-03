import mongoose, { Document, Schema } from 'mongoose';

export interface IBilling extends Document {
    provider: string;
    type: string;
    amount: string;
    payment_reference_id: mongoose.Types.ObjectId;
    date: Date;
    time: Date;
    status: string;
}

const billingSchema = new Schema({
    provider: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: String, required: true },
    payment_reference_id: { type: mongoose.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    time: { type: Date, required: true },
    status: { type: String, required: true },
});


export const Billing = mongoose.model<IBilling>('Billing', billingSchema);
