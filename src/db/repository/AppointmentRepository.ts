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

    async scheduleAppointments(appointmentData: IAppointmentRequest): Promise<IAppointment> {
        const dbInsert: Partial<IAppointment> = {
            patient_id: new mongoose.Types.ObjectId(appointmentData.patientId),
            slot_id: new mongoose.Types.ObjectId(appointmentData.slotId),
            clinic_id: new mongoose.Types.ObjectId(appointmentData.clinicId),
            reason: appointmentData.reason,
            status: EAppointmentStatus.SCHEDULED,
            ...(appointmentData.type ? { type: appointmentData.type } : {}),
            doctor_id: new mongoose.Types.ObjectId(appointmentData.doctorId),
        }
        const appointment = await this.create(dbInsert);
        return appointment.save();
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
        console.log(userId);
        
        const searchCriteria: any = {
            "$or":[
                {
                    "patient_id": new mongoose.Types.ObjectId(userId)
                },
                {
                    "doctor_id": new mongoose.Types.ObjectId(userId)
                },
                {
                    "clinic_id": new mongoose.Types.ObjectId(userId)
                }
            ]
        };


        return await this.findAndPopulate(searchCriteria, [{path: 'patient_id', populate: 'user'}, 'doctor_id', 'slot_id', 'clinic_id']) as IAppointment[];
    }

    async attendAppointments(appointmentId: string, reason: string): Promise<IAppointment> {
        const appointment = await this.findByIdAndUpdate(appointmentId, { reason: reason, status: EAppointmentStatus.ATTENDED}) as IAppointment;
        return appointment.save();
    }

}
