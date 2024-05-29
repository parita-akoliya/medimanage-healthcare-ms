import Joi from "joi";
import { AuthController } from "../../controllers/AuthController";
import { RouteConfigType } from "../../types/RouteConfigType";

const authController = new AuthController();

const authRoutes: RouteConfigType[] = [
    {
        method: 'get',
        path: '/auth/users/:id',
        controller: authController.getUser.bind(authController),
    }
];

export default authRoutes;