import { AdminController } from '../../controllers/AdminController';
import { authenticate } from '../../middleware/verifyJWTToken';
import { authorize } from '../../middleware/verifyRoles';
import { EAuthRoles } from '../../types/Enums';
import { RouteConfigType } from '../../types/RouteConfigType';

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
    },
    {
        method: 'get',
        path: '/user/:id',
        controller: adminController.getUser.bind(adminController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'put',
        path: '/user/:id',
        controller: adminController.updateUser.bind(adminController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'delete',
        path: '/auth/users/:id',
        controller: adminController.deleteUser.bind(adminController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'get',
        path: '/users',
        controller: adminController.getAllUser.bind(adminController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'get',
        path: '/dashboard',
        controller: adminController.getDashboardData.bind(adminController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN, EAuthRoles.DOCTOR, EAuthRoles.FRONTDESK])],
    },

];

export default adminRoutes;
