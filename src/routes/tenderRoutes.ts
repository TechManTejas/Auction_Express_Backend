import express from 'express';
import { generateCRUDRoutes } from '../utils/simplecrud.controller';
import TenderModel from '../models/Tender';

const router = express.Router();

router.use('/', generateCRUDRoutes(TenderModel))

export default router;
