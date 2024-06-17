import { AdminController } from '../../controllers/AdminController';
import { authenticate } from '../../middleware/verifyJWTToken';
import { authorize } from '../../middleware/verifyRoles';
import { EAuthRoles } from '../../types/Enums';
import { RouteConfig, RouteConfigType } from '../../types/RouteConfigType';

const adminController = new AdminController();

const adminRoutes: RouteConfigType[] = [
    {
        method: 'post',
        path: '/admin/change-role',
        controller: adminController.changeUserRole.bind(adminController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'post',
        path: '/admin/update-email',
        controller: adminController.updateUserEmail.bind(adminController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'post',
        path: '/admin/reset-password',
        controller: adminController.resetUserPassword.bind(adminController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    }
];

export default adminRoutes;
