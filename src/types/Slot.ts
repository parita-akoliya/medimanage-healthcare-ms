export interface ISlotsAdd {
    day: string
    slot: ISlotSection
}

export interface ISlotSection {
    startTime: string;
    endTime: string;
}

export interface ISlotsRequest {
    doctorId: string;
    fromDate: Date;
    toDate: Date;
    noOfMinPerSlot: number;
    slots: Array<ISlotsAdd>
}

export interface ISlot {
    start_time: Date;
    end_time: Date;
    status: string;
    date: Date;
    doctor_id: string;
}