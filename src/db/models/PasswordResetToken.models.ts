import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPasswordResetToken extends Document {
    user: Types.ObjectId | any;
    token: string;
    type: string;
    createdAt: Date;
}

const passwordResetTokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    type: { type: String, required: true},
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 }
});

passwordResetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export const PasswordResetToken = mongoose.model<IPasswordResetToken>('PasswordResetToken', passwordResetTokenSchema);