import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Signup Handler
export const googleSignup = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: "Token is required" });

        // Verify Google ID Token
        const ticket = await googleClient.verifyIdToken({
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
            picture: profileUrl
        } = payload;

        // Check if user exists, else create
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ 
                email, 
                firstName, 
                lastName, 
                profileUrl,
                authProvider: 'google',
                isEmailVerified: true  
            });
            await user.save();
        }

        // Generate JWT
        const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ 
            token: jwtToken, 
            user: { 
                id: user._id, 
                email: user.email, 
                firstName: user.firstName, 
                lastName: user.lastName,
                profileUrl: user.profileUrl
            } 
        });
    } catch (error) {
        console.error("Google authentication error:", error);
        res.status(500).json({ message: "Authentication failed" });
    }
};

// Google Signin Handler
export const googleSignin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: "Token is required" });

        // Verify Google ID Token
        const ticket = await googleClient.verifyIdToken({
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
            picture: profileUrl 
        } = payload;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please sign up first." });
        }

        // Generate JWT
        const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ 
            token: jwtToken, 
            user: { 
                id: user._id, 
                email: user.email, 
                firstName: user.firstName, 
                lastName: user.lastName,
                profileUrl: user.profileUrl
            } 
        });
    } catch (error) {
        console.error("Google authentication error:", error);
        res.status(500).json({ message: "Authentication failed" });
    }
};

// LinkedIn Signup Handler
export const linkedinSignup = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: "Authorization code is required" });

        // Exchange authorization code for access token
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
                redirect_uri: process.env.LINKEDIN_REDIRECT_URI
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token } = tokenResponse.data;

        // Fetch user profile
        const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        // Fetch user email
        const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        const profile = profileResponse.data;
        const email = emailResponse.data.elements[0]['handle~'].emailAddress;

        // Check if user exists, else create
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ 
                email, 
                firstName: profile.firstName, 
                lastName: profile.lastName,
                authProvider: 'linkedin',
                providerId: profile.id,
                isEmailVerified: true
            });
            await user.save();
        }

        // Generate JWT
        const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ 
            token: jwtToken, 
            user: { 
                id: user._id, 
                email: user.email, 
                firstName: user.firstName, 
                lastName: user.lastName
            } 
        });
    } catch (error) {
        console.error("LinkedIn authentication error:", error);
        res.status(500).json({ message: "Authentication failed" });
    }
};

// LinkedIn Signin Handler
export const linkedinSignin = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: "Authorization code is required" });

        // Exchange authorization code for access token
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
                redirect_uri: process.env.LINKEDIN_REDIRECT_URI
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token } = tokenResponse.data;

        // Fetch user profile
        const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        // Fetch user email
        const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        const profile = profileResponse.data;
        const email = emailResponse.data.elements[0]['handle~'].emailAddress;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please sign up first." });
        }

        // Generate JWT
        const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ 
            token: jwtToken, 
            user: { 
                id: user._id, 
                email: user.email, 
                firstName: user.firstName, 
                lastName: user.lastName
            } 
        });
    } catch (error) {
        console.error("LinkedIn authentication error:", error);
        res.status(500).json({ message: "Authentication failed" });
    }
};