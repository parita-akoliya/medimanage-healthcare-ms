import { AdminController } from '../../controllers/AdminController';
import { AppointmentController } from '../../controllers/AppointmentController';
import { authenticate } from '../../middleware/verifyJWTToken';
import { authorize } from '../../middleware/verifyRoles';
import { EAuthRoles } from '../../types/Enums';
import { RouteConfigType } from '../../types/RouteConfigType';

const appointmentController = new AppointmentController();

const adminRoutes: RouteConfigType[] = [
    {
        method: 'get',
        path: '/appointment/:user_id',
        controller: appointmentController.getAppointments.bind(appointmentController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN, EAuthRoles.DOCTOR, EAuthRoles.FRONTDESK])],
    },
    {
        method: 'delete',
        path: '/appointment',
        controller: appointmentController.cancelAppointments.bind(appointmentController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    }
];

export default adminRoutes;
