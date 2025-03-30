import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/userModel.js'; 
import dotenv from 'dotenv';
import axios from "axios";

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

    res.status(202).json({
      success: true,
      message: "Login successfully",
      user,
      token : jwtToken,
      isNewUser
    });

  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

export const linkedinAuth = async (req, res) => {
  try {
      const { code, state, storedState } = req.body;

      // Validate state parameter for CSRF protection
      if (!state || !storedState || state !== storedState) {
          return res.status(401).json({ message: "Invalid state parameter" });
      }

      if (!code) {
          return res.status(400).json({ message: "Authorization code is required" });
      }

      // 1. Exchange authorization code for access token
      const tokenResponse = await axios.post(
          "https://www.linkedin.com/oauth/v2/accessToken",
          new URLSearchParams({
              grant_type: "authorization_code",
              code,
              client_id: process.env.LINKEDIN_CLIENT_ID,
              client_secret: process.env.LINKEDIN_CLIENT_SECRET,
              redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          }),
          {
              headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
              },
          }
      );

      const { access_token } = tokenResponse.data;

      // 2. Fetch user info from LinkedIn's /me endpoint
      const userInfoResponse = await axios.get(
          "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,vanityName,profilePicture(displayImage~:playableStreams))",
          {
              headers: {
                  Authorization: `Bearer ${access_token}`,
                  "cache-control": "no-cache",
                  "X-Restli-Protocol-Version": "2.0.0",
              },
          }
      );

      const {
          id: linkedinId,
          localizedFirstName: firstName,
          localizedLastName: lastName,
          vanityName,
          profilePicture,
      } = userInfoResponse.data;

      // Construct the LinkedIn profile URL
      const linkedinLink = vanityName
          ? `https://www.linkedin.com/in/${vanityName}`
          : `https://www.linkedin.com/in/${linkedinId}`;

      // 3. Fetch user email
      const emailResponse = await axios.get(
          "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
          {
              headers: {
                  Authorization: `Bearer ${access_token}`,
                  "cache-control": "no-cache",
                  "X-Restli-Protocol-Version": "2.0.0",
              },
          }
      );

      const email = emailResponse.data.elements[0]["handle~"].emailAddress || "";

      // Extract profile picture URL
      const profilePictureUrl =
          profilePicture?.["displayImage~"]?.elements?.pop()?.identifiers?.[0]?.identifier || null;

      // 4. Find or create user in database
      let user = await User.findOne({ email });
      const isNewUser = !user;

      if (isNewUser) {
          user = new User({
              email,
              firstName,
              lastName,
              profileUrl: profilePictureUrl,
              linkedinLink,
              authProvider: "linkedin",
              providerId: linkedinId,
              isEmailVerified: true, // LinkedIn does not return email_verified, assuming true
          });
          await user.save();
      } else {
          // Update existing user's LinkedIn URL if not present
          if (!user.linkedinLink) {
              user.linkedinLink = linkedinLink;
              await user.save();
          }
      }

      // 5. Generate JWT token
      const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "7d",
      });

      // 6. Return response
      res.json({
          token: jwtToken,
          user,
          isNewUser,
      });
  } catch (error) {
      console.error("LinkedIn authentication error:", error.response?.data || error.message);

      if (error.response?.status === 403) {
          return res.status(403).json({
              message: "Permission denied by LinkedIn",
              error: "Ensure your LinkedIn app has the correct permissions (openid, profile, email) and that these permissions are approved by LinkedIn",
          });
      }

      res.status(500).json({
          message: "Authentication failed",
          error: error.response?.data || error.message,
      });
  }
};
