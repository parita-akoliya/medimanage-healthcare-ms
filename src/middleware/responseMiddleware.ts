import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/ApiResponse';

declare global {
    namespace Express {
        interface Response {
            sendApiResponse(data: any, message?: string, code?: number): void;
        }
    }
}

export function responseMiddleware(req: Request, res: Response, next: NextFunction) {
    res.sendApiResponse = (data: any, message?: string, code?: number) => {
        const responseData: ApiResponse<any> = {
            status: data.status || 'success',
            message: message || data.message || '',
            data: data.data || data || null
        };
        const statusCode = data.status === 'error' ? code ? code : 500 : code ? code : 200;
        res.status(statusCode).json(responseData);
    };
    next();
}
