export interface ISlotsAdd {
    fromDate: Date;
    toDate: Date;
    startTime: string;
    endTime: string;
}

export interface ISlotsRequest {
    doctorId: string;
    days: Array<string>;
    noOfMinPerSlot: number;
    slots: ISlotsAdd
}

export interface ISlot {
    start_time: Date;
    end_time: Date;
    status: string;
    date: Date;
    doctor_id: string;
}