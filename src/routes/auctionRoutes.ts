import express, { Request, Response } from 'express';
import {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuctionById,
  deleteAuctionById,
  getAllSimplifiedAuctions,
  getFullAuctionDetailsById,
} from '../controllers/auctionController';
import { generateCRUDRoutes } from '../utils/simplecrud.controller';
import AuctionModel, { IAuction } from '../models/Auction';
import multer from 'multer';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/auctions'); // Specify the destination directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage: storage });

// Create Auction
router.post('/create', upload.fields([
  { name: 'image', maxCount: 1 },
]), async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      start_datetime,
      duration,
      durationHours,
      durationMinutes,
      opening_bid_amount,
    } = req.body;

    console.log(
      title,
      description,
      start_datetime,
      duration,
      durationHours,
      durationMinutes,
      opening_bid_amount
    )
    console.log(req.body);
    console.log(req.files);

    // Use Express.Multer.File type
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Access files using the specified field names
    const image = files['image'][0];

    // Access the uploaded image using the specified field name
    const imageUrl = `/uploads/auctions/${image.originalname}`;

    const newAuction: IAuction = new AuctionModel({
      title,
      description,
      image: imageUrl,
      start_datetime,
      duration,
      durationHours,
      durationMinutes,
      opening_bid_amount,
    });

    const savedAuction = await newAuction.save();

    res.status(201).json(savedAuction);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Update Auction by ID
router.put('/:id/update', upload.fields([
  { name: 'image', maxCount: 1 },
]), async (req: Request, res: Response) => {
  try {
    const auctionId = req.params.id;
    const {
      title,
      description,
      start_datetime,
      duration,
      durationHours,
      durationMinutes,
      opening_bid_amount,
    } = req.body;

    // Use Express.Multer.File type
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Access files using the specified field names
    const image = files['image'][0];

    // Access the uploaded image using the specified field name
    const imageUrl = image ? `/uploads/auctions/${image.originalname}` : undefined;

    // Find the existing auction by ID
    const existingAuction = await AuctionModel.findById(auctionId);

    if (!existingAuction) {
      // If the auction with the specified ID is not found
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Create an updated auction object with existing values as defaults
    const updatedAuction: Partial<IAuction> = {
      title: title || existingAuction.title,
      description: description || existingAuction.description,
      image: imageUrl || existingAuction.image,
      start_datetime: start_datetime || existingAuction.start_datetime,
      duration: duration || existingAuction.duration,
      durationHours: durationHours || existingAuction.durationHours,
      durationMinutes: durationMinutes || existingAuction.durationMinutes,
      opening_bid_amount: opening_bid_amount || existingAuction.opening_bid_amount,
    };

    // Perform the update
    const updatedAuctionResult = await AuctionModel.findByIdAndUpdate(
      auctionId,
      updatedAuction,
      { new: true } // Return the modified document
    );

    if (!updatedAuctionResult) {
      // If the auction with the specified ID is not found
      return res.status(404).json({ error: 'Auction not found' });
    }

    res.status(200).json(updatedAuctionResult);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



router.use('/', generateCRUDRoutes(AuctionModel))

export default router;
