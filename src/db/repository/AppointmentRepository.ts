import { ObjectId } from 'bson';
import { IAppointmentRequest } from '../../types/Appointments';
import { EAppointmentStatus } from '../../types/Enums';
import { Appointment, IAppointment } from '../models/Appointment.models';
import { BaseRepository } from './BaseRepository';
import mongoose from 'mongoose';

export class AppointmentRepository extends BaseRepository<IAppointment> {
    constructor() {
        super(Appointment);
    }

    async updateAppointments(appointmentId: string, appointmentData: any): Promise<IAppointment> {
        const appointment = await this.findByIdAndUpdate(appointmentId, appointmentData) as IAppointment;
        return appointment.save();
    }

    async notAttendingAppointments(appointmentId: string): Promise<IAppointment> {
        const appointment = await this.findByIdAndUpdate(appointmentId, { status: EAppointmentStatus.NOT_ATTENDED}) as IAppointment;
        return appointment.save();
    }
    async cancelAppointments(appointmentId: string): Promise<IAppointment> {
        const appointment = await this.findByIdAndUpdate(appointmentId, { status: EAppointmentStatus.CANCELLED}) as IAppointment;
        return appointment.save();
    }

    async getAppointments(userId: string): Promise<IAppointment[]> {
        const searchCriteria: any = {
            "$or":[
                {
                    "patient_id": userId
                },
                {
                    "doctor_id": userId
                },
                {
                    "clinic_id": userId
                }
            ]
        };


        return await this.find(searchCriteria) as IAppointment[];
    }
}
