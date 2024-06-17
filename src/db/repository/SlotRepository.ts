import { ISlot, ISlotsAdd, ISlotsRequest } from '../../types/Slot';
import { ISlotDocument, Slot } from '../models/Slot.models';
import { BaseRepository } from './BaseRepository';

export class SlotRepository extends BaseRepository<ISlotDocument> {
    constructor() {
        super(Slot);
    }

    async addSlots(slotsData: ISlotsRequest): Promise<ISlotDocument> {
        const { doctorId, noOfMinPerSlot, slots, days } = slotsData
        const slotsGeneration = this.generateSlots(days, slots.startTime, slots.endTime, noOfMinPerSlot, slots.fromDate, slots.toDate, doctorId)
        const slotDb = await this.insertMany(slotsGeneration);
        return slotDb.save();
    }

    generateSlots(
        days: string[],
        startTime: string,
        endTime: string,
        noOfMinPerSlot: number,
        startDate: Date,
        endDate: Date,
        doctorId: string
    ): any {
        const slots: ISlot[] = [];
        const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

        for (const day of days) {
            if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
                throw new Error("Invalid time format. Please use HH:MM format.");
            }

            const timeValues = [startTime, endTime].map(time => time.split(':').map(Number));

            let currentDay = new Date(startDate);
            while (currentDay.getTime() <= new Date(endDate).getTime()) {
                if (this.getDayIndex(day) === currentDay.getDay()) {
                    currentDay.setHours(timeValues[0][0]);
                    currentDay.setMinutes(timeValues[0][1]);
                    const endDay = new Date(currentDay.getTime());
                    endDay.setHours(timeValues[1][0]);
                    endDay.setMinutes(timeValues[1][1]);

                    while (currentDay < endDay) {
                        const slot: ISlot = {
                            start_time: new Date(currentDay.getTime()),
                            end_time: new Date(currentDay.getTime() + (noOfMinPerSlot * 60000)),
                            status: 'available',
                            date: currentDay,
                            doctor_id: doctorId,
                        };
                        slots.push(slot);
                        currentDay.setTime(currentDay.getTime() + (noOfMinPerSlot * 60000));
                    }
                }
                currentDay.setDate(currentDay.getDate() + 1);
            }
        }

        slots.sort((slotA, slotB) => slotA.start_time.getTime() - slotB.start_time.getTime());
        return slots;
    }

    getDayIndex(day: string): number {
        const daysOfWeek: any = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
        };
        return daysOfWeek[day] || 0;
      }
}
