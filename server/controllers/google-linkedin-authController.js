import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/userModel.js'; 
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Unified Google Auth Handler
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token is required" });

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Extract user info
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: "Invalid token" });

    const { 
      email, 
      given_name: firstName, 
      family_name: lastName, 
      picture: profileUrl,
      email_verified 
    } = payload;

    // Check if user exists
    let user = await User.findOne({ email });
    const isNewUser = !user;

    if (isNewUser) {
      // Create new user
      user = new User({ 
        email,
        firstName,
        lastName,
        profileUrl,
        authProvider: 'google',
        isEmailVerified: email_verified || false
      });
      await user.save();
    }

    // Generate JWT
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { 
      expiresIn: "7d" 
    });

    res.json({ 
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileUrl: user.profileUrl,
        isNewUser
      }
    });

  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};