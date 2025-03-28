import express from 'express';
import {
  googleAuth,
  googleAuthCallback,
  linkedinAuth,
  linkedinAuthCallback
} from '../controllers/google-linkedin-authController.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

// LinkedIn OAuth routes
router.get('/linkedin', linkedinAuth);
router.get('/linkedin/callback', linkedinAuthCallback);

export default router;