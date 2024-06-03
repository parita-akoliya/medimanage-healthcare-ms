import { Application } from 'express';
import { validate } from '../middleware/validationMiddleware';
import { logger } from '../utils/logger';
import authRoutes from './route-configs/auth.route-config';

const loadRoutes = [authRoutes]

export function setupRoutes(app: Application) {
    loadRoutes.forEach(routes => {
        routes.forEach((route) => {
            logger.info(`Loading ${route.method} for ${route.path} with validation ${route.requestBodyValidation}`)
            if (route.joiValidationSchema) {
                app[route.method](`${route.path}`, validate(route.joiValidationSchema), route.controller);
            } else {
                app[route.method](`${route.path}`, route.controller);
            }
        });
    });
}
