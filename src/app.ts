import 'dotenv/config';
import express from 'express';
import http from 'http';
import mongoose from './db';
import cors from 'cors';
import fs from 'fs';
import { Server } from 'socket.io';


import userRoutes from './routes/userRoutes';
import auctionRoutes from './routes/auctionRoutes';
import auctionSockets from './sockets/auctionSocket';

const app = express();

// Use the cors middleware to enable CORS and allow all origins
app.use(cors({
  origin: '*',
}));

app.use(express.json());
const PORT = process.env.PORT || 5000;

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',  // Replace with your frontend URL
  },
});

// Initialize Socket.IO logic for auctions
auctionSockets(io);

app.use('/users', userRoutes);
app.use('/auctions', auctionRoutes);

app.get('/.well-known/pki-validation/44ACDDD30968E49728910DA7A6DDB8AD.txt', (req, res) => {
  // Assuming your text file is named 'example.txt' in the root directory
  const filePath = '39DDA8E16A8150424FC88AD44C09AED0.txt';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(data);
    }
  });
});


// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});