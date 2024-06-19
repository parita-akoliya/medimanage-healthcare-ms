// profileRoutes.ts

import { ProfileController } from '../../controllers/ProfileController';
import { authenticate } from '../../middleware/verifyJWTToken';
import { RouteConfigType } from '../../types/RouteConfigType';

const profileController = new ProfileController();

const profileRoutes: RouteConfigType[] = [
    {
        method: 'get',
        path: '/profile',
        controller: profileController.getProfile.bind(profileController),
        middlewares: [authenticate],
    },
    {
        method: 'put',
        path: '/profile',
        controller: profileController.updateProfile.bind(profileController),
        middlewares: [authenticate],
    }
];

export default profileRoutes;
