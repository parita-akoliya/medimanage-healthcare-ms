import { IUserDocument } from "../db/models/User.models";
import { UserRepository } from "../db/repository/UserRepository";

export class AdminService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async changeUserRole(userId: string, newRole: string): Promise<IUserDocument | null> {
        return this.userRepository.changeUserRole(userId, newRole);
    }

    async updateUserEmail(userId: string, newEmail: string): Promise<IUserDocument | null> {
        return this.userRepository.updateUserEmail(userId, newEmail);
    }

    async resetUserPassword(userId: string, newPassword: string): Promise<IUserDocument | null> {
        return this.userRepository.resetUserPassword(userId, newPassword);
    }
}
