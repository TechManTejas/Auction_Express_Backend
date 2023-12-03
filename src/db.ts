import mongoose from 'mongoose';
import { createStaffUserIfNotExists } from './controllers/staffController';

const MONGODB_URI = `${process.env.MONGODB_URI}` || 'default_connection_string';

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  const username = 'SUPERUSER';
  const password = 'SUPERUSER';

  createStaffUserIfNotExists(username, password)
    .then((createdUser) => {
      console.log('User created or already exists:', createdUser);
    })
    .catch((error) => {
      console.error('Error creating user:', error.message);
    });
});

export default mongoose;
