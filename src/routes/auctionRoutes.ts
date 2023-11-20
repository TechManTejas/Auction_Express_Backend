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

const router = express.Router();

// Create a new auction
router.post('/', createAuction);

// Get all auctions
router.get('/', getAllAuctions);

// Get a simplified view of all auctions
router.get('/simplified', getAllSimplifiedAuctions);

// Get all details of a specific auction by ID (for admin)
router.get('/:id/details', getFullAuctionDetailsById);

// Get a specific auction by ID
router.get('/:id', getAuctionById);

// Update a specific auction by ID
router.put('/:id', updateAuctionById);

// Delete a specific auction by ID
router.delete('/:id', deleteAuctionById);

export default router;
