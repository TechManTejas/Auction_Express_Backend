import 'dotenv/config';
import express from 'express';
import moment from 'moment-timezone';
import mongoose from './db';
import cors from 'cors';
import fs from 'fs';
import http from 'http';
import https from "https"
import { Server } from 'socket.io';

import userRoutes from './routes/userRoutes';
import staffRoutes from './routes/staffRoutes';
import auctionRoutes from './routes/auctionRoutes';
import tenderRoutes from './routes/tenderRoutes';
import tenderformRoutes from './routes/tenderformRoutes';

import auctionSockets from './sockets/auctionSocket';
import checkAndEndTenders from './tenderManager';

const app = express();

// Set the default time zone for your server
const serverTimeZone = 'Asia/Kolkata'; // Change this to your desired time zone
moment.tz.setDefault(serverTimeZone);

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
// const httpsServer = https.createServer(credentials, app);

// Create an HTTPS server
const httpsServer = http.createServer(app);

// Initialize Socket.IO
export const io = new Server(httpsServer, {
  cors: {
    origin: '*', 
  },
});

// Initialize Socket.IO logic for auctions
auctionSockets(io);
// Set the interval to check and end tenders every 1 minute (adjust as needed)
const checkTendersInterval = setInterval(async () => {
  checkAndEndTenders();
}, 60000); // 60000 milliseconds = 1 minute

// Uncomment the line below if you want to stop the interval when needed (e.g., when the server is shutting down)
// clearInterval(checkTendersInterval);

app.use('/users', userRoutes);
app.use('/admins', staffRoutes);
app.use('/auctions', auctionRoutes);
app.use('/tenders', tenderRoutes);
app.use('/tenderform', tenderformRoutes);

// Add this line to your Express app
app.use('/uploads/tenders', express.static('uploads/tenders'));
app.use('/uploads/auctions', express.static('uploads/auctions'));


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