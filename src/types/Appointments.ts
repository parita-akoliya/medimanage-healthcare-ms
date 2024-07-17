export interface IAppointmentRequest {
    patientId: string;
    doctorId: string;
    slotId: string;
    clinicId: string;
    recordId?: string;
    billingId?: string;
    reason: string;
    status: string;
    type?: string;
}