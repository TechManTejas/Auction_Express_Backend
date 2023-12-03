import mongoose, { Document, Schema } from 'mongoose';

export interface IStaff extends Document {
  username: string;
  password: string;
}

const staffSchema = new Schema<IStaff>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Staff = mongoose.model<IStaff>('Staff', staffSchema);

export default Staff;
