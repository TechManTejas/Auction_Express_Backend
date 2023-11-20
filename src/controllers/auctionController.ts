import { Request, Response } from 'express';
import AuctionModel, { IAuction } from '../models/Auction';

// Create a new auction
export const createAuction = async (req: Request, res: Response) => {
  try {
    const newAuction: IAuction = req.body;
    const createdAuction = await AuctionModel.create(newAuction);
    res.status(201).json(createdAuction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all auctions
export const getAllAuctions = async (_: Request, res: Response) => {
  try {
    const auctions = await AuctionModel.find({}, { logs: 0 });
    res.status(200).json(auctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a specific auction by ID
export const getAuctionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const auction = await AuctionModel.findById(id, { logs: 0 });
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    res.status(200).json(auction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a specific auction by ID
export const updateAuctionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedAuction = await AuctionModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAuction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    res.status(200).json(updatedAuction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a specific auction by ID
export const deleteAuctionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedAuction = await AuctionModel.findByIdAndDelete(id);
    if (!deletedAuction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    res.status(200).json({ message: 'Auction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a simplified view of all auctions
export const getAllSimplifiedAuctions = async (_: Request, res: Response) => {
    try {
      const auctions = await AuctionModel.find({}, {
        title: 1,
        description: 1,
        images: { $slice: 1 }, // Get only the first image
        opening_bid_amount: 1,
        start_datetime: 1,
        duration: 1,
      });
  
      res.status(200).json(auctions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

// Get all details of a specific auction (including logs)
export const getFullAuctionDetailsById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const auction = await AuctionModel.findById(id);
      if (!auction) {
        return res.status(404).json({ message: 'Auction not found' });
      }
      res.status(200).json(auction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };