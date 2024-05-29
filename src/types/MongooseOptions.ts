import { ConnectOptions } from "mongoose";

export interface MongooseOptions extends ConnectOptions {
    useNewUrlParser?: boolean;
    useUnifiedTopology?: boolean;
    useCreateIndex?: boolean;
    useFindAndModify?: boolean;
}