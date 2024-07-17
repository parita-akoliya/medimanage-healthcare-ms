import { SlotController } from '../../controllers/SlotController';
import { authenticate } from '../../middleware/verifyJWTToken';
import { authorize } from '../../middleware/verifyRoles';
import { EAuthRoles } from '../../types/Enums';
import { RouteConfigType } from '../../types/RouteConfigType';

const slotController = new SlotController();

const slotRoutes: RouteConfigType[] = [
    {
        method: 'post',
        path: '/slot',
        controller: slotController.addSlots.bind(slotController),
        middlewares: [authenticate, authorize([EAuthRoles.DOCTOR])],
    },
    {
        method: 'get',
        path: '/slot/available/:doctor_id',
        controller: slotController.availableSlots.bind(slotController),
        middlewares: [],
    },

];

export default slotRoutes;
