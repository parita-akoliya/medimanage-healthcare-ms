/**
 * This test suite covers the functionality of the AuthService class.
 * Each test case validates a specific method of AuthService.
 * Mocked dependencies include UserRepository, OtpRepository, PasswordResetTokenRepository, mailSender, jsonwebtoken, and crypto.
 */

// Importing necessary modules and dependencies
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../db/repository/UserRepository';
import { OtpRepository } from '../db/repository/OtpRepository';
import { PasswordResetTokenRepository } from '../db/repository/PasswordResetTokenRepository';
import { mailSender } from '../utils/mailer';
import { IUserDocument } from '../db/models/User.models';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser } from '../types/Auth';
import { EmailTemplates } from '../types/EmailTemplates';

// Mocking dependencies
jest.mock('../db/repository/UserRepository');
jest.mock('../db/repository/OtpRepository');
jest.mock('../db/repository/PasswordResetTokenRepository');
jest.mock('../utils/mailer');
jest.mock('jsonwebtoken');
jest.mock('crypto', () => ({
    randomBytes: jest.fn().mockReturnValue({ toString: jest.fn().mockReturnValue('randomtoken') }),
}));

// Describe block for testing AuthService
describe('AuthService', () => {
    let authService: AuthService;
    let mockUser: IUserDocument;

    // Setting up before each test
    beforeEach(() => {
        authService = new AuthService();
        mockUser = {
            _id: 'userid',
            email: 'test@example.com',
            password: 'hashedpassword',
            comparePassword: jest.fn().mockResolvedValue(true),
            save: jest.fn(),
        } as unknown as IUserDocument;
    });

    // Clearing all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test case for registering a new user and sending activation email
    it('should register a new user and send activation email', async () => {
        // Mocking dependencies
        (UserRepository.prototype.checkExistingUser as jest.Mock).mockResolvedValue(true);
        (UserRepository.prototype.create as jest.Mock).mockResolvedValue(mockUser);
        (crypto.randomBytes as jest.Mock).mockReturnValueOnce({ toString: jest.fn().mockReturnValue('randomtoken') });
        (mailSender as jest.Mock).mockResolvedValue(true);

        // Test data
        const userData: IUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            contact_no: '1234567890',
            address: {
                street: '123 Street',
                city: 'City',
                state: 'State',
                zip: '12345',
                country: 'Country'
            },
            gender: 'Male',
            dob: new Date('1990-01-01'),
            role: 'Admin',
            status: 'Inactive'
        };

        // Calling the method being tested
        const result = await authService.registerUser(userData, true);

        // Validating expectations
        expect(UserRepository.prototype.checkExistingUser).toHaveBeenCalledWith('test@example.com');
        expect(UserRepository.prototype.create).toHaveBeenCalledWith(expect.objectContaining(userData));
        expect(crypto.randomBytes).toHaveBeenCalled();
        expect(mailSender).toHaveBeenCalledWith({
            to: 'test@example.com',
            subject: 'Reset Password',
            templateName: EmailTemplates.ResetPasswordTemplate,
            placeholders: {
                RESET_LINK: expect.any(String),
                TEMPLATE_SUBJECT: 'New Account',
                DESCRIPTION: "We received a request to create your account with us. Please click the link below to set your password and activate your account:",
                ACTION_TEXT: 'Activate Account'
            }
        });
        expect(result).toEqual(mockUser);
    });

    // Test case for logging in user and sending OTP
    it('should login user and send OTP', async () => {
        // Mocking dependencies
        (PasswordResetTokenRepository.prototype.create as jest.Mock).mockResolvedValue(true);

        // Test data
        const userData: IUser = {
            email: 'test@example.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe',
            contact_no: '',
            role: 'Admin',
            status: 'Active'
        };
    
        // Registering a user
        await authService.registerUser(userData, true);
    
        // Mocking dependencies
        (UserRepository.prototype.findOne as jest.Mock).mockResolvedValue(mockUser);
        (OtpRepository.prototype.create as jest.Mock).mockResolvedValue(true);
        (mailSender as jest.Mock).mockResolvedValue(true);
        (UserRepository.prototype.comparePasswords as jest.Mock).mockResolvedValue(true)

        // Calling the method being tested
        const result = await authService.login('test@example.com', 'hashedpassword');
    
        // Validating expectations
        expect(UserRepository.prototype.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(OtpRepository.prototype.create).toHaveBeenCalled();
        expect(mailSender).toHaveBeenCalled();
        expect(result).toEqual({ verify_user: true, token: '', message: 'OTP sent to email' });
    });

    // Test case for verifying OTP and returning token
    it('should verify OTP and return token', async () => {
        // Mocking dependencies
        (UserRepository.prototype.findOne as jest.Mock).mockResolvedValue(mockUser);
        (OtpRepository.prototype.findOne as jest.Mock).mockResolvedValue({ user: mockUser._id, otp: '123456' });
        (OtpRepository.prototype.findOneAndDelete as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('jsonwebtoken');

        // Calling the method being tested
        const result = await authService.verifyOtp('test@example.com', '123456');

        // Validating expectations
        expect(UserRepository.prototype.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(OtpRepository.prototype.findOne).toHaveBeenCalledWith({ user: mockUser._id, otp: '123456' });
        expect(OtpRepository.prototype.findOneAndDelete).toHaveBeenCalledWith({ user: mockUser._id, otp: '123456' });
        expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser._id, role: mockUser.role }, expect.any(String), { expiresIn: '1h' });
        expect(result).toEqual({ token: 'jsonwebtoken', role: mockUser.role });
    });

    // Test case for sending reset password email
    it('should send reset password email', async () => {
        // Mocking dependencies
        (UserRepository.prototype.findOne as jest.Mock).mockResolvedValue(mockUser);
        (PasswordResetTokenRepository.prototype.create as jest.Mock).mockResolvedValue(true);
        (mailSender as jest.Mock).mockResolvedValue(true);

        // Calling the method being tested
        const result = await authService.forgotPassword('test@example.com');

        // Validating expectations
        expect(UserRepository.prototype.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(PasswordResetTokenRepository.prototype.create).toHaveBeenCalledWith(expect.any(Object));
        expect(mailSender).toHaveBeenCalled();
        expect(result).toEqual('Reset password email sent');
    });




    it('should reset user password', async () => {
        const resetTokenRecord = { user: mockUser._id, token: 'randomtoken' };
        (PasswordResetTokenRepository.prototype.findOne as jest.Mock).mockResolvedValue(resetTokenRecord);
        (UserRepository.prototype.findById as jest.Mock).mockResolvedValue(mockUser);
        (PasswordResetTokenRepository.prototype.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

        const result = await authService.resetPassword('randomtoken', 'newpassword');

        expect(PasswordResetTokenRepository.prototype.findOne).toHaveBeenCalledWith({ token: 'randomtoken' });
        expect(UserRepository.prototype.findById).toHaveBeenCalledWith(mockUser._id);
        expect(mockUser.password).toBe('newpassword');
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual('Password reset successfully');
    });
});