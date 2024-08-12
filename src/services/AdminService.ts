import moment from "moment";
import { IUserDocument } from "../db/models/User.models";
import { AppointmentRepository } from "../db/repository/AppointmentRepository";
import { ClinicRepository } from "../db/repository/ClinicRepository";
import { DoctorRepository } from "../db/repository/DoctorRepository";
import { PatientRepository } from "../db/repository/PatientRepository";
import { UserRepository } from "../db/repository/UserRepository";
import { EAppointmentStatus, EAppointmentTypes, EAuthRoles } from "../types/Enums";
import { ClinicStaff } from "../db/models/ClinicStaff.models";
import { IDoctor } from "../types/Auth";
import { IClinic } from "../db/models/Clinic.models";
import mongoose from "mongoose";
import { IDoctorDocument } from "../db/models/Doctor.models";

interface DashboardData {
    counts?: any;
    graphData?: Array<any>;
    pieData?: Array<any>;
    demographicsData?: Array<any>;
    clinicUtilizationData?: Array<any>;
    dailyAppointmentsData?: Array<any>;
}

export class AdminService {
    private userRepository: UserRepository;
    private doctorRepository: DoctorRepository;
    private patientRepository: PatientRepository;
    private appointmentRepository: AppointmentRepository;
    private clinicRepository: ClinicRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.doctorRepository = new DoctorRepository();
        this.patientRepository = new PatientRepository();
        this.appointmentRepository = new AppointmentRepository();
        this.clinicRepository = new ClinicRepository();
    }

    async changeUserRole(userId: string, newRole: string): Promise<IUserDocument | null> {
        try {
            return await this.userRepository.changeUserRole(userId, newRole);
        } catch (error: any) {
            throw new Error(`Failed to change user role: ${error.message}`);
        }
    }

    async updateUserEmail(userId: string, newEmail: string): Promise<IUserDocument | null> {
        try {
            return await this.userRepository.updateUserEmail(userId, newEmail);
        } catch (error: any) {
            throw new Error(`Failed to update user email: ${error.message}`);
        }
    }

    async resetUserPassword(userId: string, newPassword: string): Promise<IUserDocument | null> {
        try {
            return await this.userRepository.resetUserPassword(userId, newPassword);
        } catch (error: any) {
            throw new Error(`Failed to reset user password: ${error.message}`);
        }
    }

    private async fetchPatientsData(): Promise<{ totalPatients: number; demographics: Array<{ name: string; value: number }> }> {
        try {
            const totalPatients = await this.patientRepository.countDocuments({});
            const patientsByAgeRange = await this.patientRepository.aggregate([
                {
                    $bucket: {
                        groupBy: {
                            $cond: [
                                { $lte: ["$age", 18] },
                                "0-18",
                                {
                                    $cond: [
                                        { $lte: ["$age", 35] },
                                        "19-35",
                                        {
                                            $cond: [
                                                { $lte: ["$age", 50] },
                                                "36-50",
                                                "51+"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        boundaries: ["0-18", "19-35", "36-50", "51+"],
                        default: "Unknown",
                        output: {
                            count: { $sum: 1 }
                        }
                    }
                }
            ]);

            const demographicsData = patientsByAgeRange.map(entry => ({
                name: entry._id,
                value: entry.count
            }));

            return { totalPatients, demographics: demographicsData };
        } catch (error: any) {
            throw new Error(`Failed to fetch patients data: ${error.message}`);
        }
    }

    private async fetchAppointmentsData(userId?: string | IDoctor | IClinic, role?: string): Promise<{ todaysAppointmentsCount: number; monthlyAppointments: Array<{ name: string; count: number }> }> {
        const todayStart = moment().startOf('day').toDate();
        const todayEnd = moment().endOf('day').toDate();

        const query: any = {
            createdAt: { $gte: todayStart, $lt: todayEnd },
            status: { $in: [EAppointmentStatus.SCHEDULED, EAppointmentStatus.ATTENDED] }
        };

        if (role === EAuthRoles.DOCTOR) {
            query.doctor_id = (userId as IDoctorDocument)._id;
        } else if (role === EAuthRoles.FRONTDESK) {
            query.clinic_id = (userId as IClinic)._id;
        }
        try {
            const todaysAppointmentsCount = await this.appointmentRepository.countDocuments(query);
            const appointmentsByMonthYear = await this.appointmentRepository.aggregate([
                {
                    $lookup: {
                        from: "slots",
                        localField: "slot_id",
                        foreignField: "_id",
                        as: "slot"
                    }
                },
                {
                    $unwind: "$slot"
                },
                {
                    $project: {
                        year: { $year: "$slot.start_time" },
                        month: { $month: "$slot.start_time" },
                        appointmentId: "$_id",
                        slotId: "$slot_id",
                        createdAt: 1,
                        startTime: "$slot.start_time",
                        endTime: "$slot.end_time"
                    }
                },
                {
                    $group: {
                        _id: { year: "$year", month: "$month" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 }
                }
            ]);

            const monthlyAppointments = appointmentsByMonthYear.map(entry => ({
                name: moment().month(entry._id.month - 1).format('MMM'),
                count: entry.count
            }));

            return { todaysAppointmentsCount, monthlyAppointments };
        } catch (error: any) {
            throw new Error(`Failed to fetch appointments data: ${error.message}`);
        }
    }

    private async fetchClinicUtilizationData(): Promise<{ clinicUtilization: Array<{ name: string; value: number }> }> {
        try {
            const clinicUtilization = await this.appointmentRepository.aggregate([
                {
                    $lookup: {
                        from: 'clinics',
                        localField: 'clinic_id',
                        foreignField: '_id',
                        as: 'clinic'
                    }
                },
                { $unwind: '$clinic' },
                {
                    $group: {
                        _id: '$clinic.name',
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]);

            const clinicUtilizationData = clinicUtilization.map(entry => ({
                name: entry._id,
                value: entry.count
            }));

            return { clinicUtilization: clinicUtilizationData };
        } catch (error: any) {
            throw new Error(`Failed to fetch clinic utilization data: ${error.message}`);
        }
    }

    private async fetchDailyAppointmentsData(): Promise<{ dailyAppointments: Array<{ day: string; appointments: number }> }> {
        try {
            const dailyAppointments = await this.appointmentRepository.aggregate([
                {
                    $project: {
                        dayOfWeek: { $dayOfWeek: "$createdAt" }
                    }
                },
                {
                    $group: {
                        _id: "$dayOfWeek",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const dailyAppointmentsData = dailyAppointments.map(entry => ({
                day: daysOfWeek[entry._id - 1],
                appointments: entry.count
            }));

            return { dailyAppointments: dailyAppointmentsData };
        } catch (error: any) {
            throw new Error(`Failed to fetch daily appointments data: ${error.message}`);
        }
    }

    async fetchCounts() {
        let totalClinics = 0, totalPatients = 0, totalInPersonAppointments = 0, totalOnlineAppointments = 0;
        totalClinics = await this.clinicRepository.countDocuments({});
        totalPatients = await this.patientRepository.countDocuments({});
        totalInPersonAppointments = await this.appointmentRepository.countDocuments({ type: EAppointmentTypes.InPerson });
        totalOnlineAppointments = await this.appointmentRepository.countDocuments({ type: EAppointmentTypes.Online });
        return { totalClinics, totalPatients, totalInPersonAppointments, totalOnlineAppointments }
    }

    async getDashboardData(): Promise<DashboardData> {
        try {
            let data: DashboardData = {};

            const [
                patientsData,
                appointmentsData,
                clinicUtilizationData,
                dailyAppointmentsData,
                counts
            ] = await Promise.all([
                this.fetchPatientsData(),
                this.fetchAppointmentsData(),
                this.fetchClinicUtilizationData(),
                this.fetchDailyAppointmentsData(),
                this.fetchCounts()
            ]);

            const { totalClinics, totalPatients, totalInPersonAppointments, totalOnlineAppointments } = counts;

            data = {
                graphData: appointmentsData.monthlyAppointments,
                counts: { totalClinics, totalPatients, totalInPersonAppointments, totalOnlineAppointments },
                pieData: [
                    { name: 'In-Person', value: totalInPersonAppointments },
                    { name: 'Online', value: totalOnlineAppointments }
                ],
                demographicsData: patientsData.demographics,
                clinicUtilizationData: clinicUtilizationData.clinicUtilization,
                dailyAppointmentsData: dailyAppointmentsData.dailyAppointments
            };

            return data;
        } catch (error: any) {
            throw new Error(`Failed to get dashboard data: ${error.message}`);
        }
    }
}
