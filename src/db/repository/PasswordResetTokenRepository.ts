import { IOtp, Otp } from '../models/Otp.models';
import { IPasswordResetToken, PasswordResetToken } from '../models/PasswordResetToken.models';
import { BaseRepository } from './BaseRepository';

export class PasswordResetTokenRepository extends BaseRepository<IPasswordResetToken> {
    constructor() {
        super(PasswordResetToken);
    }
}
