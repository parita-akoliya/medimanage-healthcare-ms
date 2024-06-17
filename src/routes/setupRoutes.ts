import { Application, RequestHandler } from 'express';
import { validate } from '../middleware/validationMiddleware';
import { logger } from '../utils/logger';
import authRoutes from './route-configs/auth.route-config';

const loadRoutes = [authRoutes]

export function setupRoutes(app: Application) {
    loadRoutes.forEach(routes => {
        routes.forEach((route) => {
            const { method, path, joiValidationSchema, controller, middlewares = [] } = route;
            const middlewareHandlers: RequestHandler[] = [];

            if (joiValidationSchema) {
                middlewareHandlers.push(validate(joiValidationSchema));
            }
            middlewareHandlers.push(...middlewares);
            app[method](path, ...middlewareHandlers, controller);
            const printLog = joiValidationSchema ? `Loading ${method} for ${path} with validation ${joiValidationSchema}` : `Loading ${method} for ${path}`
            logger.info(printLog);
        });
    });
}
