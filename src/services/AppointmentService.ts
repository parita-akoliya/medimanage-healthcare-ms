import mongoose from "mongoose";
import { IAppointment } from "../db/models/Appointment.models";
import { Patient } from "../db/models/Patient.models";
import { AppointmentRepository } from "../db/repository/AppointmentRepository";
import { SlotRepository } from "../db/repository/SlotRepository";
import { IAppointmentRequest } from "../types/Appointments";
import { EAppointmentStatus, ESlotStatus, isValidAppointmentStatus } from "../types/Enums";
import { PatientRecord } from "../db/models/PatientRecords.models";
import { PatientRepository } from "../db/repository/PatientRepository";
import { mailSender } from "../utils/mailer";
import { EmailTemplates } from "../types/EmailTemplates";
import { ISlotDocument } from "../db/models/Slot.models";
import { Clinic, IClinic } from "../db/models/Clinic.models";
import { logger } from "../utils/logger";
import { IPatient } from "../types/Auth";

export class AppointmentService {
    private appointmentRepository = new AppointmentRepository();
    private patientRepository = new PatientRepository();
    private slotRepository = new SlotRepository();

    async getAppointment(appointmentId: string): Promise<any> {
        try {
            const appointment = await this.appointmentRepository.getAppointment(appointmentId);
            if (!appointment) throw new Error('Appointment not found');

            return this.flattenAppointment(appointment);
        } catch (error) {
            throw new Error(" Please try again later.");
        }
    }

    async getAppointments(userId: string, role: string): Promise<IAppointment[] | null> {
        try {
            if (role === 'Patient') {
                const patient = await this.patientRepository.findOne({ user: new mongoose.Types.ObjectId(userId) });
                if (!patient) throw new Error('Patient not found');
                userId = (patient as any)._id.toString();
            }
            return await this.appointmentRepository.getAppointments(userId);
        } catch (error) {
            throw new Error("Error fetching appointments: Please try again later.");

        }
    }

    async cancelAppointments(userId: string): Promise<IAppointment | null> {
        try {
            return await this.appointmentRepository.cancelAppointments(userId);
        } catch (error) {
            throw new Error(" Please try again later.");

        }
    }

    async scheduleAppointments(userId: string, appointmentData: IAppointmentRequest): Promise<IAppointment | null> {
        try {
            const slot = await this.slotRepository.checkIfSlotIsAvailableForBooking(appointmentData.slotId) as ISlotDocument;
            if (slot?.status !== ESlotStatus.AVAILABLE) throw new Error("The selected time slot is not available.");

            const patient = await this.patientRepository.findAndPopulate({ user: new mongoose.Types.ObjectId(userId) }, ['user']);
            if (!patient) throw new Error("Patient not found.");

            appointmentData.patientId = (patient as any)?._id.toString();
            const appointment = await this.appointmentRepository.scheduleAppointments(appointmentData);
            await this.slotRepository.findByIdAndUpdate(appointmentData.slotId, { status: ESlotStatus.NOT_AVAILABLE });

            const clinic = await Clinic.findById(appointmentData.clinicId).exec();
            const mailerData = this.getMailerData(patient, slot, appointmentData.reason, clinic as IClinic);

            await this.sendAppointmentEmails(mailerData, (patient as any).user.email);
            return appointment;
        } catch (error) {
            throw new Error(" Please try again later.");
        }
    }

    async updateAppointmentStatus(appointmentId: string, status: string): Promise<IAppointment | null> {
        try {
            if (!isValidAppointmentStatus(status)) throw new Error("Invalid appointment status.");

            const updatedAppointment = await this.appointmentRepository.updateAppointments(appointmentId, { status });
            const mailerObj = await this.appointmentRepository.findByIdAndPopulate(appointmentId, [
                { path: 'patient_id', populate: 'user' },
                'slot_id',
                'clinic_id'
            ]);
            if (!mailerObj) {
                throw new Error('Email not sent')
            }
            const mailerData = this.getMailerData(
                mailerObj.patient_id,
                mailerObj.slot_id,
                mailerObj.reason,
                mailerObj.clinic_id as any
            );

            if (status === EAppointmentStatus.REJECTED) {
                await this.sendAppointmentRejectionEmails(mailerData, (mailerObj.patient_id as any)?.user?.email);
            }
            return updatedAppointment;
        } catch (error) {
            throw new Error(" Please try again later.");
        }
    }

    async attendAppointments(appointmentId: string, data: {
        diagnosisDoctor: string;
        diagnosisCustomer: string;
        notes: string;
        prescriptions: { medicineName: string; dosage: string; duration: string }[];
        symptoms: string;
    }): Promise<IAppointment> {
        try {
            const appointment = await this.appointmentRepository.findById(appointmentId);
            if (!appointment) throw new Error("Appointment not found.");
            if (this.isAppointmentAttendedOrCancelled(appointment)) throw new Error("Appointment already attended.");

            const patientRecord = new PatientRecord({
                diagnosis: data.diagnosisDoctor,
                diagnosisForCustomer: data.diagnosisCustomer,
                notes: data.notes,
                prescriptions: data.prescriptions,
                symptoms: data.symptoms

            });
            const savedPatientRecord = await patientRecord.save();

            appointment.status = EAppointmentStatus.ATTENDED;
            appointment.record_id = savedPatientRecord._id as mongoose.Types.ObjectId;

            return await this.appointmentRepository.updateAppointments(appointmentId, appointment.toObject());
        } catch (error) {
            throw new Error(" Please try again later.");
        }
    }

    private flattenAppointment(appointment: any) {
        return {
            appointmentId: appointment._id.toString(),
            patient: {
                id: appointment.patient_id._id.toString(),
                firstName: appointment.patient_id.user.firstName,
                lastName: appointment.patient_id.user.lastName,
                email: appointment.patient_id.user.email,
                gender: appointment.patient_id.user.gender || '',
                dob: appointment.patient_id.user.dob || '',
                contact_no: appointment.patient_id.user.contact_no || '',
            },
            doctor: { id: appointment.doctor_id._id.toString() },
            slot: {
                id: appointment.slot_id._id.toString(),
                startTime: appointment.slot_id.start_time,
                endTime: appointment.slot_id.end_time,
                date: appointment.slot_id.date
            },
            clinic: {
                id: appointment.clinic_id._id.toString(),
                name: appointment.clinic_id.name,
                address: appointment.clinic_id.address,
                phone: appointment.clinic_id.phone,
                email: appointment.clinic_id.email
            },
            reason: appointment.reason,
            status: appointment.status,
            type: appointment.type,
            createdAt: appointment.createdAt
        };
    }

    private getMailerData(patient: any, slot: any, reason: string, clinic: IClinic) {
        return {
            patientName: `${patient.user.firstName} ${patient.user.lastName}`,
            appointmentDate: slot.start_time.toLocaleDateString(),
            appointmentTime: slot.start_time.toLocaleTimeString(),
            reason: reason,
            clinicName: clinic.name
        };
    }

    private async sendAppointmentEmails(mailerData: any, email: string) {
        await this.sendEmail(
            email,
            "Appointment Scheduled",
            EmailTemplates.AppointmentScheduled,
            mailerData
        );
    }

    private async sendAppointmentRejectionEmails(mailerData: any, email: string) {
        await this.sendEmail(
            email,
            "Appointment Rejected",
            EmailTemplates.AppointmentRejected,
            mailerData
        );
    }

    private async sendEmail(email: string, subject: string, templateName: string, mailerData: any) {
        try {
            const mailResponse = await mailSender({
                to: email,
                subject: subject,
                templateName: templateName,
                placeholders: mailerData
            });
            logger.debug("Email sent successfully: ", mailResponse);
        } catch (error) {
            logger.error("Error occurred while sending email: ", error);
            throw error;
        }
    }

    private handleError(message: string, error: any) {
        console.error(message, error);
        throw new Error(message + " Please try again later.");
    }

    private isAppointmentAttendedOrCancelled(appointment: IAppointment): boolean {
        return [
            EAppointmentStatus.ATTENDED,
            EAppointmentStatus.CANCELLED,
            EAppointmentStatus.REJECTED
        ].includes(appointment.status as EAppointmentStatus);
    }
}
