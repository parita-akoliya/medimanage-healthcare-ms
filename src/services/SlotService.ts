import { ISlotDocument } from "../db/models/Slot.models";
import { IUserDocument } from "../db/models/User.models";
import { SlotRepository } from "../db/repository/SlotRepository";
import { UserRepository } from "../db/repository/UserRepository";
import { ISlotsRequest } from "../types/Slot";

export class SlotService {
    private slotRepository: SlotRepository;

    constructor() {
        this.slotRepository = new SlotRepository();
    }

    async addSlots(slots: ISlotsRequest): Promise<ISlotDocument | null> {
        return this.slotRepository.addSlots(slots);
    }

}
