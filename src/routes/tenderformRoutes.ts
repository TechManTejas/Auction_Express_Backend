import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import TenderForm, { TenderFormModel } from '../models/TenderForm';
import { generateCRUDRoutes } from '../utils/simplecrud.controller';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/tenders'); // Specify the destination directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage: storage });

// Create TenderForm
router.post('/create', upload.fields([
  { name: 'incomeProof', maxCount: 1 },
  { name: 'itReturnOrBankStatement', maxCount: 1 },
]), async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      experience,
      quoteAmount,
      panNumber,
      gstNumber,
      projectDetails1,
      projectDetails2,
      projectDetails3,
      tenderId,
    } = req.body;

    // Use Express.Multer.File type
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Access files using the specified field names
    const incomeProofFile = files['incomeProof'][0];
    const itReturnOrBankStatementFile = files['itReturnOrBankStatement'][0];

    // Assuming you have stored the files and obtained their URLs
    const incomeProofUrl = `/uploads/tenders/${incomeProofFile.originalname}`;
    const itReturnOrBankStatementUrl = `/uploads/tenders/${itReturnOrBankStatementFile.originalname}`;

    const newTenderForm: TenderFormModel = new TenderForm({
      companyName,
      experience,
      quoteAmount,
      panNumber,
      gstNumber,
      incomeProof: incomeProofUrl,
      itReturnOrBankStatement: itReturnOrBankStatementUrl,
      projectDetails1,
      projectDetails2,
      projectDetails3,
      tenderId: new mongoose.Types.ObjectId(tenderId),
    });

    const savedTenderForm = await newTenderForm.save();

    res.status(201).json(savedTenderForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.use('/', generateCRUDRoutes(TenderForm));

export default router;
