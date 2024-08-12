
import mongoose, { Types } from 'mongoose';
import { IUserDocument, User } from '../db/models/User.models';
import { UserRepository } from '../db/repository/UserRepository';


jest.mock('../db/models/User.models');


interface IUserDocumentMock extends IUserDocument {
    _id: string;
}


describe('UserRepository', () => {
    let userRepository: UserRepository;
    let mockUser: IUserDocument;

    
    beforeEach(() => {
        userRepository = new UserRepository();
        
        mockUser = {
            _id: new Types.ObjectId().toString(), 
            email: 'test@example.com',
            password: 'hashedpassword',
            comparePassword: jest.fn().mockResolvedValue(true), 
            save: jest.fn(), 
        } as unknown as IUserDocument;
    });

    
    afterEach(() => {
        jest.clearAllMocks();
    });

    
    it('should find a user by email', async () => {
        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser); 
        const result = await userRepository.findByEmail('test@example.com');
       
        expect(result).toEqual(mockUser); 
    });

    
    it('should compare passwords', async () => {
        jest.spyOn(mockUser, 'comparePassword').mockResolvedValue(true); 

        const isMatch = await userRepository.comparePasswords(mockUser, 'password'); 

        expect(mockUser.comparePassword).toHaveBeenCalledWith('password'); 
        expect(isMatch).toBe(true); 
    });

    
    it('should change user role', async () => {
        const updatedUser: any = { ...mockUser, role: 'newRole' };
        jest.spyOn(userRepository, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

        const result = await userRepository.changeUserRole(String(mockUser._id), 'newRole');

        expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, { role: 'newRole' });
        expect(result).toEqual(updatedUser);
    });

    
    it('should activate a user', async () => {
        const updatedUser: any = { ...mockUser, status: 'Active' };
        jest.spyOn(userRepository, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

        const result = await userRepository.activateUser(String(mockUser._id));

        expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, { status: 'Active' });
        expect(result).toEqual(updatedUser);
    });

    
    it('should deactivate a user', async () => {
        const updatedUser: any = { ...mockUser, status: 'Inactive' };
        jest.spyOn(userRepository, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

        const result = await userRepository.deActivateUser(String(mockUser._id));

        expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, { status: 'Inactive' });
        expect(result).toEqual(updatedUser);
    });

    
    it('should update user email', async () => {
        const updatedUser: any = { ...mockUser, email: 'newemail@example.com' };
        jest.spyOn(userRepository, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

        const result = await userRepository.updateUserEmail(String(mockUser._id), 'newemail@example.com');

        expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, { email: 'newemail@example.com' });
        expect(result).toEqual(updatedUser);
    });

    
    it('should reset user password', async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

        const result = await userRepository.resetUserPassword(String(mockUser._id), 'newpassword');

        expect(userRepository.findById).toHaveBeenCalledWith(mockUser._id);
        expect(mockUser.password).toBe('newpassword');
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual(mockUser);
    });

    
    it('should throw an error if user already exists', async () => {
        jest.spyOn(userRepository, 'findOne').mockImplementation(async (filter) => {
            const existingUser = await userRepository.findOne(filter);
            if (existingUser) {
                throw new Error('User with this email already exists');
            } else {
                return null; 
            }
        });
    });
});
