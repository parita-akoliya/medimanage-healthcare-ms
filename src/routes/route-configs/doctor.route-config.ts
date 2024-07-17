import { DoctorController } from '../../controllers/DoctorController';
import { authenticate } from '../../middleware/verifyJWTToken';
import { authorize } from '../../middleware/verifyRoles';
import { EAuthRoles } from '../../types/Enums';
import { RouteConfigType } from '../../types/RouteConfigType';

const doctorController = new DoctorController();

const doctorRoutes: RouteConfigType[] = [
    {
        method: 'delete',
        path: '/doctors/:doctor_id',
        controller: doctorController.deleteDoctor.bind(doctorController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN, EAuthRoles.DOCTOR, EAuthRoles.FRONTDESK])],
    },
    {
        method: 'post',
        path: '/doctors',
        controller: doctorController.updateDoctor.bind(doctorController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN, EAuthRoles.DOCTOR, EAuthRoles.FRONTDESK])],
    },
    {
        method: 'get',
        path: '/doctor/:doctor_id',
        controller: doctorController.getDoctor.bind(doctorController),
        middlewares: [],
    },
    {
        method: 'get',
        path: '/doctors',
        controller: doctorController.getAllDoctor.bind(doctorController),
        middlewares: [],
    },
    {
        method: 'get',
        path: '/doctors/clinic/:clinic_id',
        controller: doctorController.getDoctorByClinicId.bind(doctorController),
        middlewares: [],
    }
];

export default doctorRoutes;
