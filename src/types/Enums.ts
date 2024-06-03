export enum EAuthRoles {
    DOCTOR = 'Doctor',
    ADMIN = 'Admin',
    FRONTDESK = 'FrontDesk',
    PATIENT = 'Patient'
}

export const AuthRoles = [EAuthRoles.ADMIN, EAuthRoles.DOCTOR, EAuthRoles.FRONTDESK, EAuthRoles.PATIENT]

export enum ETokenType {
    RESETPASSWORD = 'ResetPassword',
    NEWACCOUNT = 'NewAccount'
}