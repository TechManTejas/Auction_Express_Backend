import mongoose, { Document, Schema, Types } from 'mongoose';

export interface TenderFormModel extends Document {
  companyName: string;
  experience: string;
  quoteAmount: number;
  panNumber: string;
  gstNumber: string;
  incomeProof: string;
  itReturnOrBankStatement: string;
  projectDetails1: string;
  projectDetails2: string;
  projectDetails3: string;
  tenderId: Types.ObjectId;
}

const tenderFormSchema: Schema<TenderFormModel> = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  quoteAmount: {
    type: Number,
    required: true,
  },
  panNumber: {
    type: String,
    required: true,
  },
  gstNumber: {
    type: String,
    required: true,
  },
  incomeProof: {
    type: String,
    required: true,
  },
  itReturnOrBankStatement: {
    type: String,
    required: true,
  },
  projectDetails1: {
    type: String,
    required: true,
  },
  projectDetails2: {
    type: String,
    required: true,
  },
  projectDetails3: {
    type: String,
    required: true,
  },
  tenderId: {
    type: Schema.Types.ObjectId,
    ref: 'Tender',
    required: true,
  },
});

const TenderForm = mongoose.model<TenderFormModel>('TenderForm', tenderFormSchema);

export default TenderForm;
