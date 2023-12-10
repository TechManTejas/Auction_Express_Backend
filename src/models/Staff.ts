import mongoose, { Document, Schema } from 'mongoose';

// Define the role enums for staff
export type StaffRole = 'SUPERADMIN' | 'AUCTIONADMIN' | 'TENDERADMIN';

export interface IStaff extends Document {
  _id: string;
  username: string;
  password: string;
  role: StaffRole; // Added role attribute
}

const roleEnums: StaffRole[] = ['SUPERADMIN', 'AUCTIONADMIN', 'TENDERADMIN'];

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
  role: {
    type: String,
    required: true,
    enum: roleEnums
  },
});

const Staff = mongoose.model<IStaff>('Staff', staffSchema);

export default Staff;
