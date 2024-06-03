import mongoose, { Schema, Types } from 'mongoose';

export interface IOtp extends Document {
    user: Types.ObjectId | any;
    otp: string;
    createdAt: Date;
    expiresAt: Date;
    verified: boolean;
}

const otpSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 5 * 60 * 1000) },
    verified: { type: Boolean, default: false },
});

otpSchema.index({ user_id: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


export const Otp = mongoose.model<IOtp>('Otp', otpSchema);
