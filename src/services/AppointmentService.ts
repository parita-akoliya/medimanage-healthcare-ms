import mongoose from "mongoose";
import { IAppointment } from "../db/models/Appointment.models";
import { Patient } from "../db/models/Patient.models";
import { AppointmentRepository } from "../db/repository/AppointmentRepository";
import { SlotRepository } from "../db/repository/SlotRepository";
import { IAppointmentRequest } from "../types/Appointments";
import { ESlotStatus, isValidAppointmentStatus } from "../types/Enums";

export class AppointmentService {
    private appointmentRepository: AppointmentRepository;
    private slotRepository: SlotRepository;

    constructor() {
        this.appointmentRepository = new AppointmentRepository();
        this.slotRepository = new SlotRepository();
    }

    async getAppointments(userId: string): Promise<IAppointment[] | null> {
        return this.appointmentRepository.getAppointments(userId);
    }

    async cancelAppointments(userId: string): Promise<IAppointment | null> {
        return this.appointmentRepository.cancelAppointments(userId);
    }

    async scheduleAppointments(userId: string, appointmentData: IAppointmentRequest): Promise<any | null> {
        const slotIsAvailable = await this.slotRepository.checkIfSlotIsAvailableForBooking(appointmentData.slotId)
        if(slotIsAvailable){
            const patient_details = await Patient.findOne({user: new mongoose.Types.ObjectId(userId)})
            appointmentData.patientId = (patient_details?._id as mongoose.Types.ObjectId).toString()
            const appointment = this.appointmentRepository.scheduleAppointments(appointmentData);
            this.slotRepository.findByIdAndUpdate(appointmentData.slotId, { status: ESlotStatus.NOT_AVAILABLE})
            return appointment;
        }
        return appointmentData
    }

    async updateAppointmentStatus(appointmentId: string, status: string): Promise<any | null> {
        if(isValidAppointmentStatus(status)){
            const appointment = await this.appointmentRepository.updateAppointments(appointmentId, { status: status})
            return appointment;
        }
        throw new Error('Appointment not updated')
    }

}
