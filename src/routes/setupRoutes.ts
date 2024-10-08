import { Application, RequestHandler } from 'express';
import { validate } from '../middleware/validationMiddleware';
import { logger } from '../utils/logger';
import authRoutes from './route-configs/auth.route-config';
import adminRoutes from './route-configs/admin.route-config';
import clinicRoutes from './route-configs/clinic.route-config';
import profileRoutes from './route-configs/profile.route-config';
import searchRoutes from './route-configs/search.route-config';
import slotRoutes from './route-configs/slot.route-config';
import doctorRoutes from './route-configs/doctor.route-config';
import appointmentRoutes from './route-configs/appointment.route-config';
import lookupRoutes from './route-configs/lookup.route-config';

const loadRoutes = [authRoutes, adminRoutes, clinicRoutes, profileRoutes, searchRoutes, slotRoutes, doctorRoutes, appointmentRoutes, lookupRoutes]

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
