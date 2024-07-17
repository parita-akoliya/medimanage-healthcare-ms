import { AdminController } from '../../controllers/AdminController';
import { AppointmentController } from '../../controllers/AppointmentController';
import { authenticate } from '../../middleware/verifyJWTToken';
import { authorize } from '../../middleware/verifyRoles';
import { EAuthRoles } from '../../types/Enums';
import { RouteConfigType } from '../../types/RouteConfigType';

const appointmentController = new AppointmentController();

const appointmentRoutes: RouteConfigType[] = [
    {
        method: 'post',
        path: '/appointment',
        controller: appointmentController.scheduleAppointment.bind(appointmentController),
        middlewares: [authenticate, authorize([EAuthRoles.PATIENT])],
    },
    {
        method: 'post',
        path: '/appointment/status',
        controller: appointmentController.updateAppointmentStatus.bind(appointmentController),
        middlewares: [authenticate, authorize([EAuthRoles.PATIENT, EAuthRoles.DOCTOR])],
    },
    {
        method: 'get',
        path: '/appointment',
        controller: appointmentController.getAppointments.bind(appointmentController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN, EAuthRoles.DOCTOR, EAuthRoles.FRONTDESK])],
    },
    {
        method: 'delete',
        path: '/appointment',
        controller: appointmentController.cancelAppointments.bind(appointmentController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN, EAuthRoles.DOCTOR])],
    }
];

export default appointmentRoutes;
