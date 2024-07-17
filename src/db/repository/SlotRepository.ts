import mongoose from 'mongoose';
import { ESlotStatus } from '../../types/Enums';
import { ISlot, ISlotSection, ISlotsAdd, ISlotsRequest } from '../../types/Slot';
import { ISlotDocument, Slot } from '../models/Slot.models';
import { BaseRepository } from './BaseRepository';
import { ObjectId } from 'bson';

export class SlotRepository extends BaseRepository<ISlotDocument> {
    constructor() {
        super(Slot);
    }

    async checkIfSlotIsAvailableForBooking(slotId: string): Promise<boolean | false> {
        const slot = await this.findById(slotId)
        return slot?.status === ESlotStatus.AVAILABLE ? true : false
    }

    async getAvailableSlots(doctorId: string): Promise<ISlotDocument[] | null> {
        const results = await this.find({doctor_id: new ObjectId(doctorId), status: ESlotStatus.AVAILABLE})
        return results
    }
    async addSlots(slotsData: ISlotsRequest): Promise<ISlotDocument> {
        const { doctorId, noOfMinPerSlot, slots, fromDate, toDate } = slotsData
        const slotsGeneration = this.generateSlots(slots, noOfMinPerSlot, fromDate, toDate, doctorId)
        const slotDb = await this.insertMany(slotsGeneration);
        return slotDb;
    }

    generateSlots(
        slots: Array<ISlotsAdd>,
        noOfMinPerSlot: number,
        startDate: Date,
        endDate: Date,
        doctorId: string
    ): any {
        const generatedSlots: ISlot[] = [];
        const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

        for (const slot of slots) {
            if (!timeRegex.test(slot.slot.startTime) || !timeRegex.test(slot.slot.endTime)) {
                throw new Error("Invalid time format. Please use HH:MM format.");
            }

            const timeValues = [slot.slot.startTime, slot.slot.endTime].map(time => time.split(':').map(Number));
            console.log("timeValuestimeValues", timeValues);
            
            let currentDay = new Date(startDate);
            while (currentDay.getTime() <= new Date(endDate).getTime()) {
                if (this.getDayIndex(slot.day) === currentDay.getDay()) {
                    currentDay.setHours(timeValues[0][0], timeValues[0][1], 0, 0);
                    const endDay = new Date(currentDay.getTime());
                    endDay.setHours(timeValues[1][0], timeValues[1][1], 0, 0);
                    while (currentDay < endDay) {
                        const finalSlot: ISlot = {
                            start_time: new Date(currentDay.getTime()),
                            end_time: new Date(currentDay.getTime() + (noOfMinPerSlot * 60000)),
                            status: ESlotStatus.AVAILABLE,
                            date: currentDay,
                            doctor_id: doctorId,
                        };
                        console.log(finalSlot);
                        
                        generatedSlots.push(finalSlot);
                        currentDay.setTime(currentDay.getTime() + (noOfMinPerSlot * 60000));
                    }
                }
                currentDay.setDate(currentDay.getDate() + 1);
            }
        }

        generatedSlots.sort((slotA, slotB) => slotA.start_time.getTime() - slotB.start_time.getTime());
        return generatedSlots;
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
