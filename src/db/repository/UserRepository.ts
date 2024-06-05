import { IUserDocument, User } from '../models/User.models';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<IUserDocument> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<IUserDocument | null> {
        return this.findOne({ email });
    }

    async comparePasswords(user: IUserDocument, candidatePassword: string): Promise<boolean> {
        return user.comparePassword(candidatePassword);
    }

    async changeUserRole(userId: string, newRole: string): Promise<IUserDocument | null> {
        return this.findByIdAndUpdate(userId, { role: newRole });
    }

    async activateUser(userId: string): Promise<IUserDocument | null> {
        return this.findByIdAndUpdate(userId, {status: 'Active'});
    }

    async deActivateUser(userId: string): Promise<IUserDocument | null> {
        return this.findByIdAndUpdate(userId, {status: 'Inactive'});
    }


    async updateUserEmail(userId: string, newEmail: string): Promise<IUserDocument | null> {
        return this.findByIdAndUpdate(userId, { email: newEmail });
    }

    async resetUserPassword(userId: string, newPassword: string): Promise<IUserDocument | null> {
        const user = await this.findById(userId);
        if (!user) return null;

        user.password = newPassword;
        await user.save();
        return user;
    }
    async checkExistingUser(email: string) {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        return null;
    }

}
