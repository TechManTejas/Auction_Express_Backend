// server/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import StaffModel, { IStaff, StaffRole } from '../models/Staff';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with all required fields
    const newStaff = await StaffModel.create({
      username,
      password: hashedPassword,
      role: role
    });

    res.status(201).json(newStaff);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await StaffModel.findOne({ username });

    // Check if the user exists and the password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({ message: 'Sign in successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Function to check if a user exists and create if not
export const createStaffUserIfNotExists = async (username: string, password: string, role: string) => {
  try {
    // Check if the user already exists
    const existingUser: IStaff | null = await StaffModel.findOne({ username });

    if (existingUser) {
      console.log('User already exists');
      return existingUser;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with all required fields, including the role
    const newStaff = await StaffModel.create({
      username,
      password: hashedPassword,
      role: role as StaffRole // Make sure 'role' is of type StaffRole
    });

    console.log('User created successfully');
    return newStaff;
  } catch (error: any) {
    console.error('Error creating user:', error.message);
    throw error;
  }
};