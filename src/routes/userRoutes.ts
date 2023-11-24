import express from 'express';
import { signUp, signIn } from '../controllers/userController';
import { generateCRUDRoutes } from '../utils/simplecrud.controller';
import UserModel from '../models/User';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

router.use('/', generateCRUDRoutes(UserModel))

export default router;
