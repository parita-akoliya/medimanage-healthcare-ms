import { required } from 'joi';
import mongoose, { Document, Schema } from 'mongoose';

export interface ILookupData extends Document {
  type: mongoose.Types.ObjectId | null;
  value: string;
  parentId: mongoose.Types.ObjectId | null;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId | null;

}

const lookupDataSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  type: { type: Schema.Types.ObjectId, ref: 'LookupDataCategory', required: true },
  value: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'LookupData', default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, {
  timestamps: true
});

export const LookupData = mongoose.model<ILookupData>('LookupData', lookupDataSchema);