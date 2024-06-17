import { AdminController } from '../../controllers/AdminController';
import { ClinicController } from '../../controllers/ClinicController';
import { authenticate } from '../../middleware/verifyJWTToken';
import { authorize } from '../../middleware/verifyRoles';
import { EAuthRoles } from '../../types/Enums';
import { RouteConfig, RouteConfigType } from '../../types/RouteConfigType';

const clinicController = new ClinicController();

const clinicRoutes: RouteConfigType[] = [
    {
        method: 'put',
        path: '/clinic',
        controller: clinicController.registerClinic.bind(clinicController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'delete',
        path: '/clinic',
        controller: clinicController.deleteClinic.bind(clinicController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'post',
        path: '/clinic',
        controller: clinicController.updateClinic.bind(clinicController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'get',
        path: '/clinic/:clinicId',
        controller: clinicController.getClinicDetailsWithDoctors.bind(clinicController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    }
];

export default clinicRoutes;
