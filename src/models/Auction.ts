import mongoose, { Schema, Document } from 'mongoose';

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
}

export interface IAuction extends Document {
  winner_id: mongoose.Types.ObjectId | null;
  winner_name: string | null; // Added winner_name attribute
  winner_bid_amount: number;
  title: string;
  description: string;
  image: string;
  start_datetime: Date;
  duration: number;
  durationHours: number;
  durationMinutes: number;
  opening_bid_amount: number;
  logs: Record<string, any>[];
  raise_options: Record<string, any>;
  status: 'Not Started' | 'In Progress' | 'Ended';
  users: IUser[];
}

const AuctionSchema: Schema = new Schema({
  winner_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  winner_name: { type: String, default: null }, // Added winner_name attribute
  winner_bid_amount: { type: Number, default: 0 },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  start_datetime: { type: Date, required: true },
  duration: { type: Number, required: true },
  durationHours: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },
  opening_bid_amount: { type: Number, required: true },
  logs: { type: [Object], default: [] },
  raise_options: { type: Object, default: {} },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Ended'], default: 'Not Started' },
  users: [{ _id: { type: Schema.Types.ObjectId, ref: 'User' }, name: String }],
});

const AuctionModel = mongoose.model<IAuction>('Auction', AuctionSchema);

export default AuctionModel;
