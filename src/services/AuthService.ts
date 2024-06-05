import config from "../config";
import { OtpRepository } from "../db/repository/OtpRepository";
import { PasswordResetTokenRepository } from "../db/repository/PasswordResetTokenRepository";
import { UserRepository } from "../db/repository/UserRepository";
import { EAuthRoles, ETokenType } from "../types/Enums";
import { EmailTemplates } from "../types/EmailTemplates";
import { logger } from "../utils/logger";
import { mailSender } from "../utils/mailer";
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import { IUserDocument } from "../db/models/User.models";
import { DoctorRepository } from "../db/repository/DoctorRepository";
import { IAddress, IClinicStaff, IRegisterDoctor, IRegisterPatient, IUser } from "../types/Auth";
import { PatientRepository } from "../db/repository/PatientRepository";
import { ClinicStaffRepository } from "../db/repository/ClinicStaffRepository";

export class AuthService {
    otpRepository: OtpRepository;
    userRepository: UserRepository;
    passwordResetTokenRepository: PasswordResetTokenRepository;
    doctorRepository: DoctorRepository;
    patientRepository: PatientRepository;
    clinicSTaffRepository: ClinicStaffRepository;

    constructor(){
        this.otpRepository = new OtpRepository();
        this.userRepository = new UserRepository();
        this.passwordResetTokenRepository = new PasswordResetTokenRepository();
        this.doctorRepository = new DoctorRepository();
        this.patientRepository = new PatientRepository();
        this.clinicSTaffRepository = new ClinicStaffRepository();
    }

    public async login(email: string, password: string): Promise<{ verify_user: boolean, token: string, message: string }> {
        const user = await this.userRepository.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await this.userRepository.comparePasswords(user, password);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otpRepository.create({ user: user._id, otp }).then(() => this.sendVerificationEmail(user.email, otp));

        return { verify_user:true, token: '', message: 'OTP sent to email' };
    }

    private async sendVerificationEmail(email:string, otp:string) {
        try {
            const mailResponse = await mailSender({
              to:email,
              subject: "Verification Email",
              templateName: EmailTemplates.OtpTemplate,
              placeholders: {OTP: otp}}
            );
            logger.debug("Email sent successfully: ", mailResponse)
          } catch (error: any) {
            logger.error("Error occurred while sending email: ", error);
            throw error;
          }
    }

    public async verifyOtp(email: string, otp: string): Promise<{ token: string, role: string }> {
        const user = await this.userRepository.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        const otpRecord = await this.otpRepository.findOne({ user: user._id, otp });

        if (!otpRecord) {
            throw new Error('Invalid OTP');
        }

        await this.otpRepository.findOneAndDelete({ user: user._id, otp });

        const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });

        return { token, role: user.role };
    }
        
    public async forgotPassword(email: string): Promise<string> {
        const user = await this.userRepository.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        const token = crypto.randomBytes(20).toString('hex');
        await this.passwordResetTokenRepository.create({ user: user._id, token, type: ETokenType.RESETPASSWORD });

        await this.sendResetPasswordEmail(user.email, token, ETokenType.RESETPASSWORD);

        return 'Reset password email sent';
    }

    private async sendResetPasswordEmail(email:string, token:string, type: string) {
        try {
            const mailResponse = await mailSender({
              to:email,
              subject: "Reset Password",
              templateName: EmailTemplates.ResetPasswordTemplate,
              placeholders: {RESET_LINK: `http://localhost:3001/auth/reset-password/${token}`, TEMPLATE_SUBJECT: type === ETokenType.RESETPASSWORD ? 'Password Reset' : 'New Account', DESCRIPTION: type === ETokenType.RESETPASSWORD ? 'We received a request to reset your password. Please click the link below to reset your password:' : 'We received a request to create your account with us. Please click the link below to set your password and activate your account:', ACTION_TEXT:type === ETokenType.RESETPASSWORD ? 'Reset Password' : 'Activate Account'}}
            );
            logger.debug("Email sent successfully: ", mailResponse)
          } catch (error: any) {
            logger.error("Error occurred while sending email: ", error);
            throw error;
          }
    }


    public async resetPassword(token: string, newPassword: string): Promise<string> {
        const resetTokenRecord = await this.passwordResetTokenRepository.findOne({ token });

        if (!resetTokenRecord) {
            throw new Error('Invalid or expired password reset token');
        }

        const user = await this.userRepository.findById(resetTokenRecord.user);

        if (!user) {
            throw new Error('User not found');
        }

        user.password = newPassword;
        await user.save();
        await this.passwordResetTokenRepository.findByIdAndDelete(resetTokenRecord._id);
        return 'Password reset successfully';
    }

    public async getUser(id: string): Promise<IUserDocument | null> {
        const user = await this.userRepository.findById(id);
        return user;
    }

    public async deleteUser(id: string): Promise<IUserDocument | null> {
        const user = await this.userRepository.findByIdAndDelete(id) as IUserDocument;
        return user;
    }

    public async registerUser(userData: IUser, isAdmin: boolean) {
        try {            
            await this.userRepository.checkExistingUser(userData.email)
            let address: IAddress = {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            }
            if(userData.address){
                address = {
                    street: userData.address.street,
                    city: userData.address.city,
                    state: userData.address.state,
                    zip: userData.address.zip,
                    country: userData.address.country        
                };    
            }

            const user = await this.userRepository.create({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                contact_no: userData.contact_no,
                ...(userData.dob ? {dob: userData.dob}: {}),
                ...(address ? {address: address}: {}),
                ...(userData.gender ? {gender: userData.gender}: {}),
                role: isAdmin ? EAuthRoles.ADMIN : EAuthRoles.FRONTDESK,
                status: 'Inactive'
            });
            if(!isAdmin) {
                const clinicStaffData: IClinicStaff = {
                    user: user._id,
                    clinic_id: userData.clinic_id,
                    staff_number: userData.staff_number
                }
                const clinicStaff = await this.clinicSTaffRepository.registerStaff(clinicStaffData)
            }
            const token = crypto.randomBytes(20).toString('hex');
            await this.passwordResetTokenRepository.create({ user: user._id, token, type: ETokenType.NEWACCOUNT });
            await this.sendResetPasswordEmail(user.email, token, ETokenType.NEWACCOUNT);
            return user;
        } catch (error: any) {
            throw error;
        }

    }

    public async registerDoctor(doctorData: IRegisterDoctor): Promise<IRegisterDoctor> {
        try {            
            await this.userRepository.checkExistingUser(doctorData.email)
            const user = await this.doctorRepository.registerDoctor(doctorData, EAuthRoles.DOCTOR)
            const token = crypto.randomBytes(20).toString('hex');
            await this.passwordResetTokenRepository.create({ user: user.user_id, token, type: ETokenType.NEWACCOUNT });
            await this.sendResetPasswordEmail(user.email, token, ETokenType.NEWACCOUNT);
            return user;
        } catch (error: any) {
            throw error;
            
        }
    }

    public async registerPatient(patientData: IRegisterPatient) {
        try {            
            await this.userRepository.checkExistingUser(patientData.email)
            const user = await this.patientRepository.registerPatient(patientData, EAuthRoles.PATIENT)
            return user;
        } catch (error: any) {
            throw error;
            
        }
    }
}
