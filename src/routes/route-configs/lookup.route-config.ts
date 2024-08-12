import { authenticate } from '../../middleware/verifyJWTToken';
import { authorize } from '../../middleware/verifyRoles';
import { EAuthRoles } from '../../types/Enums';
import { RouteConfigType } from '../../types/RouteConfigType';
import { LookupController } from '../../controllers/LookupController';

const lookupController = new LookupController();

const lookupRoutes: RouteConfigType[] = [
    {
        method: 'post',
        path: '/lookup',
        controller: lookupController.createLookup.bind(lookupController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'post',
        path: '/lookup/category/:category',
        controller: lookupController.createLookupInCategory.bind(lookupController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'get',
        path: '/lookup',
        controller: lookupController.getAllLookups.bind(lookupController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN, EAuthRoles.DOCTOR, EAuthRoles.FRONTDESK])],
    },
    {
        method: 'get',
        path: '/lookup/category/:category',
        controller: lookupController.getLookupsByCategory.bind(lookupController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN, EAuthRoles.DOCTOR, EAuthRoles.FRONTDESK])],
    },
    {
        method: 'get',
        path: '/lookup/parent/:parentId',
        controller: lookupController.getLookupsByParent.bind(lookupController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN, EAuthRoles.DOCTOR, EAuthRoles.FRONTDESK])],
    },
    {
        method: 'delete',
        path: '/lookup/:id',
        controller: lookupController.deleteLookup.bind(lookupController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'put',
        path: '/lookup/:id',
        controller: lookupController.updateLookup.bind(lookupController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'post',
        path: '/lookup/category',
        controller: lookupController.createLookupCategory.bind(lookupController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'get',
        path: '/lookup/categories',
        controller: lookupController.getAllCategories.bind(lookupController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN, EAuthRoles.DOCTOR, EAuthRoles.FRONTDESK])],
    },
    {
        method: 'put',
        path: '/lookup/category/:id',
        controller: lookupController.updateLookupCategory.bind(lookupController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'delete',
        path: '/lookup/category/:id',
        controller: lookupController.deleteLookupCategory.bind(lookupController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    }
];

export default lookupRoutes;
