import express, { Request, Response } from 'express';
import { userSignUpValidator } from '../../utils/validations';
import { signUp } from '../../controllers/Auth';

const router = express.Router();



// Create a new user
router.post("/signup", userSignUpValidator, signUp);


export default router;

