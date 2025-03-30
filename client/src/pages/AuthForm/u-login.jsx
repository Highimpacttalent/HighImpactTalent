import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils";
import { useDispatch } from "react-redux";
import { Login } from "../../redux/userSlice";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  Grid
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const generateRandomState = () => {
  const array = new Uint32Array(16); 
  window.crypto.getRandomValues(array); 
  return Array.from(array, dec => dec.toString(16).padStart(8, '0')).join(''); 
};

const LINKEDIN_CONFIG = {
  CLIENT_ID: '86a6w4yf01ndrx',
  REDIRECT_URI: `${window.location.origin}/linkedin-callback`,
  STATE: generateRandomState(), 
};

function UserLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newData = { email, password };
      const res = await apiRequest({
        url: "user/login",
        method: "POST",
        data: newData,
      });

      if (res?.success !== true) {
        setErrMsg(res?.message);
        return;
      } else {
        setErrMsg("");
        const userData = { token: res?.token, ...res?.user };
        dispatch(Login(userData));
        localStorage.setItem("userInfo", JSON.stringify(userData));
        navigate("/find-jobs");
      }
    } catch (error) {
      setErrMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);
      setErrMsg("");
      
      const { credential } = credentialResponse;
      if (!credential) {
        throw new Error("No credential received");
      }
      
      const res = await apiRequest({
        url: "auth/google",
        method: "POST",
        data: { token: credential }
      });
  
      if (!res?.token) {
        throw new Error(res?.message || "Authentication failed - no token received");
      }
  
      const userData = { 
        token: res.token, 
        ...res.user,
        isNewUser: res.isNewUser ?? false
      };
      
      dispatch(Login(userData));
      localStorage.setItem("userInfo", JSON.stringify(userData));
      navigate(userData.isNewUser ? "/userinformation" : "/find-jobs");
      
    } catch (error) {
      setErrMsg(error.message || "Google authentication failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLinkedInLogin = () => {
    try {
      setLinkedinLoading(true);
      setErrMsg("");
  
      // Generate a state parameter and store it
      const state = generateRandomState();
      localStorage.setItem('linkedin_oauth_state', state);
  
      // Create the authorization URL with proper encoding
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: '86a6w4yf01ndrx',
        redirect_uri: `${window.location.origin}/linkedin-callback`,
        scope: 'openid profile email',
        state: state
      });
  
      // Log the URL to debug
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
      console.log('LinkedIn Auth URL:', authUrl);
      
      // Redirect to LinkedIn
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('LinkedIn auth error:', error);
      setErrMsg("Failed to initiate LinkedIn login");
      setLinkedinLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrMsg("Google authentication failed");
  };

  return (
    <Box sx={{ background: "#fff" }}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Box sx={{ width: { xs: "90%", md: "50%" } }}>
          <Typography
            variant="h4"
            fontWeight="700"
            fontFamily="Satoshi"
            fontSize="32px"
            textAlign="center"
            mb={3}
            color="rgba(64, 66, 88, 1)"
          >
            Login
          </Typography>

          {errMsg && (
            <Typography color="error" textAlign="center" mb={2}>
              {errMsg}
            </Typography>
          )}

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <GoogleOAuthProvider clientId="390148996153-usdltgirc8gk0mor929tnibamu7a6tad.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    render={({ onClick }) => (
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={onClick}
                        disabled={googleLoading}
                        sx={{
                          py: 1.5,
                          borderRadius: 16,
                          textTransform: "none",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: 'rgba(64, 66, 88, 1)',
                          borderColor: 'rgba(64, 66, 88, 0.23)',
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
                          height: '48px',
                          '&:hover': {
                            backgroundColor: 'rgba(249, 250, 251, 1)',
                            borderColor: 'rgba(64, 66, 88, 0.35)',
                          }
                        }}
                        startIcon={
                          googleLoading ? 
                          <CircularProgress size={20} /> : 
                          <GoogleIcon sx={{ color: '#4285F4' }} />
                        }
                      >
                        Sign in with Google
                      </Button>
                    )}
                  />
                </GoogleOAuthProvider>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleLinkedInLogin}
                  disabled={linkedinLoading}
                  sx={{
                    py: 1.5,
                    borderRadius: 16,
                    textTransform: "none",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: 'rgba(64, 66, 88, 1)',
                    borderColor: 'rgba(64, 66, 88, 0.23)',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
                    height: '48px',
                    '&:hover': {
                      backgroundColor: 'rgba(249, 250, 251, 1)',
                      borderColor: 'rgba(64, 66, 88, 0.35)',
                    }
                  }}
                  startIcon={
                    linkedinLoading ? 
                    <CircularProgress size={20} /> : 
                    <LinkedInIcon sx={{ color: '#0077B5' }} />
                  }
                >
                  Sign in with LinkedIn
                </Button>
              </Grid>
            </Grid>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR LOGIN WITH EMAIL
            </Typography>
          </Divider>

          <form onSubmit={handleSubmit}>
            <Typography fontWeight="700" fontFamily="Satoshi" color="rgba(64, 66, 88, 1)">
              Email Address
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 16, mb: 1 } }}
            />

            <Typography fontWeight="700" fontFamily="Satoshi" color="rgba(64, 66, 88, 1)">
              Password
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 16 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" >
                      {showPassword ? <Visibility />:<VisibilityOff /> }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* Forgot Password Link */}
            <Typography textAlign="right" mt={2}>
               <Link
                 to="/password"
                 style={{
                   color: "rgba(60, 126, 252, 1)",
                   textDecoration: "none",
                   fontWeight: "bold",
                   fontFamily: "Satoshi",
                   fontSize: "16px",
                 }}
               >
                 Forgot Password?
               </Link>
             </Typography>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, py: 1.5, borderRadius: 16, textTransform: "none", fontSize: "1rem", fontWeight: "bold" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
            <Typography textAlign="center" mt={4} color="rgba(128, 129, 149, 1)">
            Don't have an account?{" "}
            <Link to="/u-authform" style={{ color: "rgba(60, 126, 252, 1)", textDecoration: "none" }}>
              Create Account
            </Link>
          </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default UserLoginForm;