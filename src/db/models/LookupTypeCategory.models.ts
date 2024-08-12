import mongoose, { Document, Schema } from 'mongoose';

export interface ILookupDataCategory extends Document {
  name: string;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId | null;
}

const lookupDataCategorySchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, {
  timestamps: true
});

export const LookupDataCategory = mongoose.model<ILookupDataCategory>('LookupDataCategory', lookupDataCategorySchema);