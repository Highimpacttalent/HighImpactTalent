import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import Users from '../models/userModel.js';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); 

// Configure Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await Users.findOne({ 
        $or: [
          { email: profile.emails[0].value },
          { providerId: profile.id }
        ]
      });

      if (!user) {
        // Create new user
        user = new Users({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          authProvider: 'google',
          providerId: profile.id,
          isEmailVerified: true,
          profileUrl: profile.photos[0].value
        });
        await user.save();
      } else if (!user.authProvider) {
        // User exists with email/password but now logging in with Google
        user.authProvider = 'google';
        user.providerId = profile.id;
        user.isEmailVerified = true;
        if (!user.profileUrl && profile.photos[0]) {
          user.profileUrl = profile.photos[0].value;
        }
        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Configure Passport LinkedIn Strategy
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL,
    scope: ['r_emailaddress', 'r_liteprofile'],
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await Users.findOne({ 
        $or: [
          { email: profile.emails[0].value },
          { providerId: profile.id }
        ]
      });

      if (!user) {
        // Create new user
        user = new Users({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          authProvider: 'linkedin',
          providerId: profile.id,
          isEmailVerified: true,
          profileUrl: profile.photos[0].value,
          linkedinLink: profile.profileUrl
        });
        await user.save();
      } else if (!user.authProvider) {
        // User exists with email/password but now logging in with LinkedIn
        user.authProvider = 'linkedin';
        user.providerId = profile.id;
        user.isEmailVerified = true;
        if (!user.profileUrl && profile.photos[0]) {
          user.profileUrl = profile.photos[0].value;
        }
        if (!user.linkedinLink) {
          user.linkedinLink = profile.profileUrl;
        }
        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google authentication route
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
});

// Google callback route
export const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent(err.message)}`);
    }
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed`);
    }
    
    // Generate JWT token
    const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });
    
    // Redirect with token
    res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}&userId=${user._id}`);
  })(req, res, next);
};

// LinkedIn authentication route
export const linkedinAuth = passport.authenticate('linkedin', {
  session: false
});

// LinkedIn callback route
export const linkedinAuthCallback = (req, res, next) => {
  passport.authenticate('linkedin', { session: false }, (err, user, info) => {
    if (err) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent(err.message)}`);
    }
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed`);
    }
    
    // Generate JWT token
    const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });
    
    // Redirect with token
    res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}&userId=${user._id}`);
  })(req, res, next);
};