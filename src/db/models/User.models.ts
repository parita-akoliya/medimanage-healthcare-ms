import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    user_name: string;
    user_id: string;
    user_role: string;
    password: string;
    people_id: string;
}

const UserSchema: Schema = new Schema({
    user_name: { type: String, required: true },
    user_id: { type: String, required: true, unique: true },
    user_role: { type: String, required: true },
    password: { type: String, required: true },
    people_id: { type: String, required: true },
});

UserSchema.pre<IUser>('save', async function (next) {
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

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.post<IUser>('save', function (doc, next) {
    console.log(`User ${doc.user_name} has been saved.`);
    next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
