import mongoose, { Document, Schema } from 'mongoose';

export interface ILookupData extends Document {
  type: string;
  value: string;
  parentId: mongoose.Types.ObjectId | null;
}

const lookupDataSchema = new Schema({
  type: { type: String, required: true },
  value: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'LookupData', default: null }
}, {
  timestamps: true
});

export const LookupData = mongoose.model<ILookupData>('LookupData', lookupDataSchema);