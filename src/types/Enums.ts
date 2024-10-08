export enum EAuthRoles {
    DOCTOR = 'Doctor',
    ADMIN = 'Admin',
    FRONTDESK = 'FrontDesk',
    PATIENT = 'Patient'
}

export enum EAppointmentTypes {
    InPerson = 'In-Person',
    Online = 'Online'
}


export enum EAppointmentStatus {
    SCHEDULED = 'Scheduled',
    CANCELLED = 'Cancelled',
    ATTENDED = 'Attended',
    NOT_ATTENDED = 'Not Attended',
    REJECTED = 'Rejected'
}

export enum ESlotStatus {
    AVAILABLE = 'Available',
    RESERVED = 'Reserved',
    NOT_AVAILABLE = 'Not Available'
}


export const AuthRoles = [EAuthRoles.ADMIN, EAuthRoles.DOCTOR, EAuthRoles.FRONTDESK, EAuthRoles.PATIENT]

export const AppointmentTypes = [EAppointmentTypes.InPerson, EAppointmentTypes.Online]


export enum ETokenType {
    RESETPASSWORD = 'ResetPassword',
    NEWACCOUNT = 'NewAccount'
}

export const AppointmentStatuses = [EAppointmentStatus.ATTENDED, EAppointmentStatus.CANCELLED, EAppointmentStatus.NOT_ATTENDED, EAppointmentStatus.SCHEDULED]


export const SlotStatuses = [ESlotStatus.AVAILABLE, ESlotStatus.NOT_AVAILABLE, ESlotStatus.RESERVED]

export const isValidAppointmentStatus = (status: string): boolean => {
    return Object.values(EAppointmentStatus).includes(status as EAppointmentStatus);
}