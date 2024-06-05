export interface IAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface IInsuranceDetails {
    provider: string;
    policyNumber: string;
    validTill: Date;
}

export interface IHealthcardDetails {
    cardNumber: string;
    validTill: Date;
}

export interface IAvailability {
    day: string;
    startTime: string;
    endTime: string;
}

export interface IPrescription {
    medication: string;
    dosage: string;
    duration: string;
}

export interface IPrescriptionDocument {
    name: string;
    url: string;
}


export interface IUser extends IDoctor, IClinicStaff, IPatient{
    firstName: string;
    lastName: string;
    email: string;
    contact_no: string;
    dob?: Date;
    address?: IAddress;
    password?: string;
    gender?: string;
    role: string;
    status: string;
}

export interface IPatient {
    user?: any;
    insurance_details?: IInsuranceDetails;
    emergency_contact?: string;
    healthcard_details?: IHealthcardDetails;
    health_history2?: string;
}

export interface IDoctor {
    user?: any;
    speciality?: string;
    license_number?: string;
    availability?: IAvailability[];
    yearsOfExperience?: string;
}

export interface IClinicStaff {
    user?: any;
    staff_number?: string;
    clinic_id?: any;
}


export interface IRegisterUser {
    firstName: string;
    lastName: string;
    email: string;
    contact_no: string;
    dob: Date;
    address: IAddress;
    password: string;
    gender: string;
    role: string;

}

export interface IRegisterPatient extends IRegisterUser {
    user_id?: any;
    patient_id?: any;
    insurance_details: IInsuranceDetails;
    emergency_contact: string;
    healthcard_details: IHealthcardDetails;
}

export interface IRegisterDoctor extends IRegisterUser {
    user_id?: any;
    doctor_id?: any;
    speciality: string;
    license_number: string;
    availability?: IAvailability[];
    yearsOfExperience?: string;
}

