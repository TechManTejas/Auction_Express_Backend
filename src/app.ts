import 'dotenv/config';
import express from 'express';
import mongoose from './db';
import userRoutes from './routes/userRoutes';
import auctionRoutes from './routes/auctionRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
app.use('/users', userRoutes);
app.use('/auctions', auctionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
