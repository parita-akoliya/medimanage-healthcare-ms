import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';

export function validate(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const options = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        };

        const { error } = schema.validate(req.body, options);

        if (error) {
            const validationError = error.details.map((detail) => detail.message).join(', ');
            return res.status(400).json({ error: validationError });
        }

        next();
    };
}
