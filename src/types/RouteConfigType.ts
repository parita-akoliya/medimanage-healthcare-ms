import { Schema } from 'joi';
import { RequestHandler } from 'express';

export interface RouteConfigType {
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    path: string;
    controller: RequestHandler;
    requestBodyValidation?: boolean;
    joiValidationSchema?: Schema;
    middlewares?: Array<any>
}

export const defaultRouteConfig: Partial<RouteConfigType> = {
    requestBodyValidation: false,
    joiValidationSchema: undefined
};