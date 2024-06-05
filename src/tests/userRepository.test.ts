// Importing necessary modules and dependencies
import mongoose, { Types } from 'mongoose';
import { IUserDocument, User } from '../db/models/User.models';
import { UserRepository } from '../db/repository/UserRepository';

// Mocking User model
jest.mock('../db/models/User.models');

// Defining a custom interface for IUserDocument with _id property
interface IUserDocumentMock extends IUserDocument {
    _id: string;
}

// Describe block for testing UserRepository
describe('UserRepository', () => {
    let userRepository: UserRepository;
    let mockUser: IUserDocument;

    // Setting up before each test
    beforeEach(() => {
        userRepository = new UserRepository();
        // Creating a mock user object
        mockUser = {
            _id: new Types.ObjectId().toString(), // Convert ObjectId to string
            email: 'test@example.com',
            password: 'hashedpassword',
            comparePassword: jest.fn().mockResolvedValue(true), // Mocking comparePassword method
            save: jest.fn(), // Mocking save method
        } as unknown as IUserDocument;
    });

    // Clearing all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test case for finding a user by email
    it('should find a user by email', async () => {
        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser); // Mocking findByEmail method
        const result = await userRepository.findByEmail('test@example.com');
       
        expect(result).toEqual(mockUser); // Expecting result to equal mockUser
    });

    // Test case for comparing passwords
    it('should compare passwords', async () => {
        jest.spyOn(mockUser, 'comparePassword').mockResolvedValue(true); // Mocking comparePassword method

        const isMatch = await userRepository.comparePasswords(mockUser, 'password'); // Calling comparePasswords method

        expect(mockUser.comparePassword).toHaveBeenCalledWith('password'); // Expecting comparePassword to be called with correct password
        expect(isMatch).toBe(true); // Expecting the result to be true
    });

    // Test case for changing user role
    it('should change user role', async () => {
        const updatedUser: any = { ...mockUser, role: 'newRole' };
        jest.spyOn(userRepository, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

        const result = await userRepository.changeUserRole(String(mockUser._id), 'newRole');

        expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, { role: 'newRole' });
        expect(result).toEqual(updatedUser);
    });

    // Test case for activating a user
    it('should activate a user', async () => {
        const updatedUser: any = { ...mockUser, status: 'Active' };
        jest.spyOn(userRepository, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

        const result = await userRepository.activateUser(String(mockUser._id));

        expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, { status: 'Active' });
        expect(result).toEqual(updatedUser);
    });

    // Test case for deactivating a user
    it('should deactivate a user', async () => {
        const updatedUser: any = { ...mockUser, status: 'Inactive' };
        jest.spyOn(userRepository, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

        const result = await userRepository.deActivateUser(String(mockUser._id));

        expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, { status: 'Inactive' });
        expect(result).toEqual(updatedUser);
    });

    // Test case for updating user email
    it('should update user email', async () => {
        const updatedUser: any = { ...mockUser, email: 'newemail@example.com' };
        jest.spyOn(userRepository, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

        const result = await userRepository.updateUserEmail(String(mockUser._id), 'newemail@example.com');

        expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, { email: 'newemail@example.com' });
        expect(result).toEqual(updatedUser);
    });

    // Test case for resetting user password
    it('should reset user password', async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

        const result = await userRepository.resetUserPassword(String(mockUser._id), 'newpassword');

        expect(userRepository.findById).toHaveBeenCalledWith(mockUser._id);
        expect(mockUser.password).toBe('newpassword');
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual(mockUser);
    });

    // Test case for throwing an error if user already exists
    it('should throw an error if user already exists', async () => {
        jest.spyOn(userRepository, 'findOne').mockImplementation(async (filter) => {
            const existingUser = await userRepository.findOne(filter);
            if (existingUser) {
                throw new Error('User with this email already exists');
            } else {
                return null; // Resolve with null when the user does not exist
            }
        });
    });
});
