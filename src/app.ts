import 'dotenv/config';
import express from 'express';
import mongoose from './db';
import cors from 'cors';
import fs from 'fs';
import https from "https"
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

// Specify the paths to your SSL certificate and private key
const privateKey = fs.readFileSync('private.key', 'utf8');
const certificate = fs.readFileSync('certificate.crt', 'utf8');
const ca = fs.readFileSync('ca_bundle.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate, ca: ca };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

// Initialize Socket.IO
const io = new Server(httpsServer, {
  cors: {
    origin: '*',  // Replace with your frontend URL
  },
});

// Initialize Socket.IO logic for auctions
auctionSockets(io);

app.use('/users', userRoutes);
app.use('/auctions', auctionRoutes);

app.get('/.well-known/pki-validation/44ACDDD30968E49728910DA7A6DDB8AD.txt', (req, res) => {
  // Assuming your text file is named 'example.txt' in the root directory
  const filePath = '44ACDDD30968E49728910DA7A6DDB8AD.txt';

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
httpsServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} with SSL`);
});