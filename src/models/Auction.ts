import mongoose, { Schema, Document } from 'mongoose';

export interface IAuction extends Document {
  winner_id: string; // Assuming winner_id is a reference to user_id
  winner_bid_amount: number;
  title: string[];
  description: string;
  images: [string]; // You might want to use a specific data type for images, like Buffer or a URL
  start_datetime: Date;
  duration: number; // Duration in minutes, for example
  opening_bid_amount: number;
  logs: Record<string, any>[]; // JSON structure for logs
  raise_options: Record<string, any>; // JSON structure for raise_options
  status: 'Not Started' | 'In Progress' | 'Ended'; // Added status attribute
}

const AuctionSchema: Schema = new Schema({
  winner_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  winner_bid_amount: { type: Number, default: 0 },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  start_datetime: { type: Date, required: true },
  duration: { type: Number, required: true },
  opening_bid_amount: { type: Number, required: true },
  logs: { type: [Object], default: [] },
  raise_options: { type: Object, default: {} },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Ended'], default: 'Not Started' },
});

const AuctionModel = mongoose.model<IAuction>('Auction', AuctionSchema);

export default AuctionModel;
