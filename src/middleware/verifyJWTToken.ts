import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserDocument, User } from '../db/models/User.models';
import config from '../config';
import { EAuthRoles } from '../types/Enums';
import { Doctor, IDoctorDocument } from '../db/models/Doctor.models';
import { ClinicStaff, IClinicStaffDocument } from '../db/models/ClinicStaff.models';

interface AuthRequest extends Request {
    role?: string;
    user?: IUserDocument;
    doctor?: IDoctorDocument;
    clinic?: IClinicStaffDocument;
    admin?: IUserDocument;
    frontstaff?: IClinicStaffDocument;
}

const getDBNameFromRole = async (userId: any, role: string, req: AuthRequest) => {
    switch (role) {
        case EAuthRoles.DOCTOR:
            const doctor = await Doctor.findOne({ user: userId }).populate('clinic').exec();
            req.doctor = doctor || undefined;
            break;
        case EAuthRoles.FRONTDESK:
            const clinic = await ClinicStaff.findOne({ user: userId }).populate('clinic_id').exec();
            req.clinic = clinic || undefined;
            break;
        default:
            break;
    }
};

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ error: 'Access denied. User invalid.' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById((decoded as any).id).exec();

        if (!user) {
            return res.status(401).send({ error: 'Invalid token.' });
        }

        req.user = user;
        req.role = user.role;
        await getDBNameFromRole(user._id, user.role, req);
        next();
    } catch (error: any) {
        res.status(401).send({ error: 'Invalid token.' });
    }
};
