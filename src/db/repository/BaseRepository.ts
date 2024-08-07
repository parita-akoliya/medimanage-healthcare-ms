import { ObjectId } from 'bson';
import { Model, Document, FilterQuery, UpdateQuery, Schema, Types } from 'mongoose';

export class BaseRepository<T extends Document> {
    constructor(private model: Model<T>) {}

    async create(data: Partial<T>): Promise<T> {
        return this.model.create(data);
    }

    async insertMany(data: Partial<T>): Promise<any> {
        return this.model.insertMany(data);
    }

    async find(filter: FilterQuery<T>): Promise<T[] | null> {
        return this.model.find(filter).exec();
    }

    async findAndPopulate(filter: FilterQuery<T>, populateFields: string | any): Promise<T[] | null> {
        return this.model.find(filter).populate(populateFields).exec();
    }

    async findById(id: string | Types.ObjectId): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(filter).exec();
    }

    async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
        return this.model.findOneAndUpdate(filter, update, { new: true }).exec();
    }

    async deleteOne(filter: FilterQuery<T>): Promise<void> {
        await this.model.deleteOne(filter).exec();
    }

    async findOneAndDelete(filter: FilterQuery<T>): Promise<T | null> {
        return this.model.findOneAndDelete(filter).exec();
    }

    async findByIdAndDelete(id: string | Types.ObjectId | any): Promise<T | null> {
        return this.model.findByIdAndDelete(new ObjectId(id)).exec();
    }
    
    async findByIdAndUpdate(id: string | Types.ObjectId | any, update: UpdateQuery<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, update).exec();
    }

    async deleteMany(data: FilterQuery<T>): Promise<any> {
        return this.model.deleteMany(data);
    }

    async countDocuments(data: FilterQuery<T>): Promise<any> {
        return this.model.countDocuments(data);
    }


}
