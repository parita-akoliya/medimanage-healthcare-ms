import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { logger } from '../../utils/logger';
import { IUser } from '../../types/Auth';
import { AuthRoles } from '../../types/Enums';

export interface IUserDocument extends Document, IUser {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const addressSchema = new Schema({
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
});

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contact_no: { type: String, required: false },
    address: { type: addressSchema, required: false },
    dob: { type: Date, required: false },
    gender: { type: String, required: false },
    role: { type: String, enum: AuthRoles, required: true },
    status: { type: String, enum: ["Active", "Inactive", "Deleted"], required: true}
}, {
    timestamps: true
}
);


userSchema.pre<IUserDocument>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err: any) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.post<IUserDocument>('save', function (doc, next) {
    logger.debug(`User ${doc.email} has been saved.`);
    next();
});



export const User = mongoose.model<IUserDocument>('User', userSchema);
