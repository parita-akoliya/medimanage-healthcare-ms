import { IUserDocument } from "../db/models/User.models";
import { UserRepository } from "../db/repository/UserRepository";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async getUserProfile(userId: string): Promise<IUserDocument | null> {
        return this.userRepository.findById(userId);
    }

    public async updateUserProfile(userId: string, updatedProfile: Partial<IUserDocument>): Promise<IUserDocument | null> {
        return this.userRepository.findByIdAndUpdate(userId, updatedProfile);
    }
}
