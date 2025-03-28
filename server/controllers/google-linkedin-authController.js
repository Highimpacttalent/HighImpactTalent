import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/userModel.js'; 
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { 
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

export const linkedinAuth = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Authorization code is required" });

    // 1. Exchange authorization code for access token
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token } = tokenResponse.data;

    // 2. Fetch basic profile info
    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    // 3. Fetch additional profile data to get LinkedIn URL
    const profileUrlResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    // 4. Extract all user data
    const {
      sub: linkedinId,
      email,
      given_name: firstName,
      family_name: lastName,
      picture: profilePicture,
      email_verified
    } = profileResponse.data;

    const linkedinProfileUrl = `https://www.linkedin.com/in/${profileUrlResponse.data.vanityName || linkedinId}`;

    // 5. Find or create user
    let user = await User.findOne({ email });
    const isNewUser = !user;

    if (isNewUser) {
      user = new User({
        email,
        firstName,
        lastName,
        profileUrl: profilePicture,
        linkedinLink: linkedinProfileUrl,  // Storing LinkedIn URL
        authProvider: 'linkedin',
        providerId: linkedinId,
        isEmailVerified: email_verified || false
      });
      await user.save();
    } else {
      // Update existing user's LinkedIn URL if not present
      if (!user.linkedinLink) {
        user.linkedinLink = linkedinProfileUrl;
        await user.save();
      }
    }

    // 6. Generate JWT
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d"
    });

    // 7. Return response (consistent with Google auth format)
    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileUrl: user.profileUrl,
        linkedinUrl: user.linkedinUrl, 
        isNewUser
      }
    });

  } catch (error) {
    console.error("LinkedIn authentication error:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Authentication failed",
      error: error.response?.data || error.message 
    });
  }
};