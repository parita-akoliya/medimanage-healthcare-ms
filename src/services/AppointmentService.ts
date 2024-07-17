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
}
