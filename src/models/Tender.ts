import mongoose, { Document, Schema } from 'mongoose';

export interface TenderModel extends Document {
  title: string;
  description: string;
  estCost: number;
  timeToComplete: string;
  city: string;
  bidEndsOn: Date;
  status: 'In Progress' | 'Ended'; // New field for status
}

const tenderSchema: Schema<TenderModel> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  estCost: {
    type: Number,
    required: true,
  },
  timeToComplete: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  bidEndsOn: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['In Progress', 'Ended'],
    default: 'In Progress',
    required: true,
  },
});

const Tender = mongoose.model<TenderModel>('Tender', tenderSchema);

export default Tender;
