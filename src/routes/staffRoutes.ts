import express from 'express';
import { signUp, signIn } from '../controllers/staffController';
import { generateCRUDRoutes } from '../utils/simplecrud.controller';
import StaffModel from '../models/Staff';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

router.use('/', generateCRUDRoutes(StaffModel))

export default router;
