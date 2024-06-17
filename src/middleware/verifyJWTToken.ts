import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserDocument, User } from '../db/models/User.models';
import config from '../config';

interface AuthRequest extends Request {
    user?: IUserDocument;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ error: 'Access denied. User invalid.' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById((decoded as any).id);

        if (!user) {
            return res.status(401).send({ error: 'Invalid token.' });
        }

        req.user = user;
        next();
    } catch (error: any) {
        res.status(401).send({ error: 'Invalid token.' });
    }
};
