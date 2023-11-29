import express from 'express';
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
import AuctionModel from '../models/Auction';
import { upload } from '../middleware/upload';

const router = express.Router();

// Create a new auction
router.post('/create', [upload], createAuction);

// Get all auctions
// router.get('/', getAllAuctions);

// Get a simplified view of all auctions
// router.get('/simplified', getAllSimplifiedAuctions);

// Get all details of a specific auction by ID (for admin)
// router.get('/:id/details', getFullAuctionDetailsById);

// Get a specific auction by ID
// router.get('/:id', getAuctionById);

// Update a specific auction by ID
// router.put('/:id', updateAuctionById);

// Delete a specific auction by ID
// router.delete('/:id', deleteAuctionById);

router.use('/', generateCRUDRoutes(AuctionModel))

export default router;
