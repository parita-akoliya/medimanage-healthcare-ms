import { AuthController } from "../../controllers/AuthController";
import { RouteConfigType } from "../../types/RouteConfigType";
import { authenticate } from "../../middleware/verifyJWTToken";
import { authorize } from "../../middleware/verifyRoles";
import { EAuthRoles } from "../../types/Enums";
import { parseFormData, parseJsonData } from "../../middleware/formDataMiddleware";

const authController = new AuthController();

const authRoutes: RouteConfigType[] = [
    {
        method: 'post',
        path: '/auth/register/patient',
        controller: authController.registerPatient.bind(authController),
        middlewares: [parseFormData, parseJsonData]
    },
    {
        method: 'post',
        path: '/auth/login',
        controller: authController.login.bind(authController),
        middlewares: [parseFormData, parseJsonData]
    },
    {
        method: 'post',
        path: '/auth/verify-otp',
        controller: authController.verifyOtp.bind(authController),
    },
    {
        method: 'post',
        path: '/auth/forgot-password',
        controller: authController.forgotPassword.bind(authController),
    },
    {
        method: 'post',
        path: '/auth/reset-password',
        controller: authController.resetPassword.bind(authController),
        middlewares: [parseFormData, parseJsonData]
    },
    {
        method: 'get',
        path: '/users/:id',
        controller: authController.getUser.bind(authController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'delete',
        path: '/auth/users/:id',
        controller: authController.deleteUser.bind(authController),
        middlewares: [authenticate, authorize([EAuthRoles.ADMIN])],
    },
    {
        method: 'post',
        path: '/auth/register/doctor',
        controller: authController.registerDoctor.bind(authController),
        middlewares: [authenticate, authorize(['Admin'])],
    }, {
        method: 'post',
        path: '/auth/register/frontdesk',
        controller: authController.registerFrontDesk.bind(authController),
        middlewares: [authenticate, authorize(['Admin'])],
    }, {
        method: 'post',
        path: '/auth/register/admin',
        controller: authController.registerAdmin.bind(authController),
        middlewares: [],
    }
];

export default authRoutes;