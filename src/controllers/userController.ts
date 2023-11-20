// server/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/User';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, password, name, mobile_no, email_id } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with all required fields
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      name,
      mobile_no,
      email_id,
    });

    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });

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
