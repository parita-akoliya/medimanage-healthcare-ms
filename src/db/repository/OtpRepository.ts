import { IOtp, Otp } from '../models/Otp.models';
import { BaseRepository } from './BaseRepository';

export class OtpRepository extends BaseRepository<IOtp> {
    constructor() {
        super(Otp);
    }
}
