import { NextFunction } from 'express';
import multer from 'multer';
import { logger } from '../utils/logger';
import { decryptBody } from '../utils/crypto';

const upload = multer();

const parseFormData = upload.single('data');

const parseJsonData = (req: any, res: any, next: NextFunction) => {
    if (req.body && req.body['data']) {
        try {
            req.body = JSON.parse(decryptBody(req.body.data.toString(), 'AUTH'));
        } catch (error) {
            return res.status(400).send({ error: 'Invalid JSON in form data' });
        }
    }
    next();
};

export { parseFormData, parseJsonData };
