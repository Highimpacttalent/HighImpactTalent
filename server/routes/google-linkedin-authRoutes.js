import express from 'express';
import {
  googleSignup,
  googleSignin,
  linkedinSignup,
  linkedinSignin
} from '../controllers/google-linkedin-authController.js';

const router = express.Router();

// Google Routes
router.post('/google/signup', googleSignup);
router.post('/google/signin', googleSignin);

// LinkedIn Routes
router.post('/linkedin/signup', linkedinSignup);
router.post('/linkedin/signin', linkedinSignin);

export default router;