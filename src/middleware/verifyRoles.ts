import { Request, Response, NextFunction } from 'express';
import { IUserDocument } from '../db/models/User.models';

interface AuthRequest extends Request {
    user?: IUserDocument;
}

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(403).send({ error: 'Access denied. No user information found.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ error: 'Access denied. Insufficient permissions.' });
        }

        next();
    };
};
