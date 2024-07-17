import { IAppointment } from "../db/models/Appointment.models";
import { AppointmentRepository } from "../db/repository/AppointmentRepository";
import { SlotRepository } from "../db/repository/SlotRepository";
import { IAppointmentRequest } from "../types/Appointments";
import { ESlotStatus } from "../types/Enums";

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

    async scheduleAppointments(appointmentData: IAppointmentRequest): Promise<any | null> {
        const slotIsAvailable = await this.slotRepository.checkIfSlotIsAvailableForBooking(appointmentData.slotId)
        if(slotIsAvailable){
            const appointment = this.appointmentRepository.scheduleAppointments(appointmentData);
            this.slotRepository.findByIdAndUpdate(appointmentData.slotId, { status: ESlotStatus.NOT_AVAILABLE})
            return appointment;
        }
        return appointmentData
    }
}
