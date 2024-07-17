import { ISlotDocument } from "../db/models/Slot.models";
import { IUserDocument } from "../db/models/User.models";
import { DoctorRepository } from "../db/repository/DoctorRepository";
import { SlotRepository } from "../db/repository/SlotRepository";
import { UserRepository } from "../db/repository/UserRepository";
import { ISlotsRequest } from "../types/Slot";

export class SlotService {
    private slotRepository: SlotRepository;
    private doctorRepository: DoctorRepository;

    constructor() {
        this.slotRepository = new SlotRepository();
        this.doctorRepository = new DoctorRepository();
    }

    async addSlots(slots: ISlotsRequest): Promise<ISlotDocument | null> {
        await this.slotRepository.deleteMany({doctor_id: slots.doctorId})
        const slotSave = this.slotRepository.addSlots(slots);
        let availabilityArr = slots.slots
        const availabilityJson: any[] = []
        availabilityArr.map(availability => {
            let obj: any = {}
            obj['day'] = availability.day
            obj['startTime'] = availability.slot.startTime
            obj['endTime'] = availability.slot.endTime
            availabilityJson.push(obj)
        })
        const dbAvailabilitySave = this.doctorRepository.updateOne({_id: new Object(slots.doctorId)}, {
            $set: {
                availability: availabilityJson
            }
        })
        return slotSave
    }

    async availableSlots(doctorId: string): Promise<ISlotDocument[] | null> {
        const slotSave = this.slotRepository.getAvailableSlots(doctorId);
        return slotSave
    }


}
