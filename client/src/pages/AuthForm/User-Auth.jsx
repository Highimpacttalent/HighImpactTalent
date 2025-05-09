import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Login } from "../../redux/userSlice"; // Adjust import path if needed
import { apiRequest } from "../../utils"; // Ensure you have an API request utility
import Heroimg from "../../assets/CreateAccount/HeroImg.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useLocation } from "react-router-dom";

const generateRandomState = () => {
  const array = new Uint32Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => dec.toString(16).padStart(8, "0")).join("");
};

const LINKEDIN_CONFIG = {
  CLIENT_ID: "86a6w4yf01ndrx",
  REDIRECT_URI: `${window.location.origin}/linkedin-callback`,
  STATE: generateRandomState(),
};


const UserSignUp = () => {
  const location = useLocation();
  const refer = location.state?.refer || "/find-jobs";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [linkedinLoading, setLinkedinLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const checkPasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      lengthCriteria &&
      uppercaseCriteria &&
      lowercaseCriteria &&
      numberCriteria &&
      specialCharCriteria
    ) {
      setPasswordStrength("Strong Password");
      setPasswordError("");
    } else if (
      lengthCriteria &&
      (uppercaseCriteria || lowercaseCriteria) &&
      numberCriteria
    ) {
      setPasswordStrength("Medium Password");
      setPasswordError(
        "Consider adding special characters for a stronger password."
      );
    } else {
      setPasswordStrength("Weak Password");
      setPasswordError(
        "Password should include uppercase, lowercase, number, and special character."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") checkPasswordStrength(value);
    if (name === "confirmPassword") {
      setPasswordError(value !== form.password ? "Passwords do not match" : "");
    }
    if (name === "email") {
      setEmailError(
        emailRegex.test(value) ? "" : "Please enter a valid email address."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password.length < 5) {
      alert("Password must be at least 5 characters long.");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await apiRequest({
        url: "/user/register",
        method: "POST",
        data: form,
      });

      if (res.success) {
        const userData = { token: res.token, ...res.user };
        dispatch(Login(userData));
        localStorage.setItem("userInfo", JSON.stringify(userData));
        navigate("/userinformation", {
        state: { refer },
      });
      } else {
        alert(res.message || "Error while registering");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Something went wrong. Please try again.");
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
          data: { token: credential },
        });
  
        if (!res?.token) {
          throw new Error(
            res?.message || "Authentication failed - no token received"
          );
        }
  
        const userData = {
          token: res.token,
          ...res.user,
          isNewUser: res.isNewUser ?? false,
        };
  
        dispatch(Login(userData));
        localStorage.setItem("userInfo", JSON.stringify(userData));
        navigate(userData.isNewUser ? "/userinformation" : "/find-jobs", {
        state: { refer },
      });
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
        localStorage.setItem("linkedin_oauth_state", state);
  
        // Create the authorization URL with proper encoding
        const params = new URLSearchParams({
          response_type: "code",
          client_id: "86a6w4yf01ndrx",
          redirect_uri: `${window.location.origin}/linkedin-callback`,
          scope: "openid profile email",
          state: state,
        });
  
        // Log the URL to debug
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
        console.log("LinkedIn Auth URL:", authUrl);
  
        // Redirect to LinkedIn
        window.location.href = authUrl;
      } catch (error) {
        console.error("LinkedIn auth error:", error);
        setErrMsg("Failed to initiate LinkedIn login");
        setLinkedinLoading(false);
      }
    };
  
    const handleGoogleError = () => {
      setErrMsg("Google authentication failed");
    };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "white",
        display: "flex",
        padding: 3,
        px: {md:10,lg:10,xs:4,sm:4}
      }}
    >
      <Box sx={{ width: {md:"50%",lg:"50%",xs:"100%",sm:"100%"}, mt: 4, p: {md:4,lg:4,xs:0,sm:0}}}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "700",
            mb: 3,
            fontFamily: "Satoshi",
            color: "#24252C",
            fontSize: "32px",
          }}
        >
          One Click Closer to a{" "}
          <span
            style={{
              fontWeight: "700",
              fontFamily: "Satoshi",
              color: "#3C7EFC",
            }}
          >
            Game-Changing{" "}
          </span>{" "}
          Opportunity!
        </Typography>
        <Box>
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
                            size="large"
                            shape="pill"
                            text="continue_with"
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
                            display: "flex", // ✅ Ensures flex behavior
                            alignItems: "center", // ✅ Centers items properly
                            justifyContent: "center", // ✅ Centers icon + text dynamically
                            gap: 1, // ✅ Spacing between icon and text
                            borderRadius: 16,
                            textTransform: "none",
                            fontSize: { xs: "0.8rem", sm: "0.9rem" }, // ✅ Responsive font size
                            fontWeight: 600,
                            color: "rgba(64, 66, 88, 1)",
                            borderColor: "rgba(64, 66, 88, 0.23)",
                            backgroundColor: "rgba(255, 255, 255, 1)",
                            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
                            height: { xs: "40px", sm: "40px", md: "42px" }, // ✅ Responsive height
                            "&:hover": {
                              backgroundColor: "rgba(249, 250, 251, 1)",
                              borderColor: "rgba(64, 66, 88, 0.35)",
                            },
                          }}
                          startIcon={
                            linkedinLoading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <LinkedInIcon sx={{ color: "#0077B5" }} />
                            )
                          }
                        >
                          <Typography
                            sx={{
                              flexGrow: 1, // ✅ Allows text to expand dynamically
                              textAlign: "center", // ✅ Keeps text centered
                              fontFamily: "Arial",
                              fontSize: "0.9rem",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                            }}
                          >
                            Continue with LinkedIn
                          </Typography>
                        </Button>
                      </Grid>
                    </Grid>
          
                    <Divider sx={{ my: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        OR LOGIN WITH EMAIL
                      </Typography>
                    </Divider>
          <Box component="form" onSubmit={handleSubmit} sx={{width: {md:"90%",lg:"90%",xs:"100%",sm:"100%"} }}>
            <Typography
              sx={{
                fontFamily: "Satoshi",  
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
              }}
            >
              Name
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 16,
                    height: 50,
                  },
                }}
              />
              <TextField
                fullWidth
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 16,
                    height: 50,
                  },
                }}
              />
            </Box>
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
                mt: 3,
              }}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              type="email"
              name="email"
              placeholder="Enter your email here"
              value={form.email}
              onChange={handleChange}
              required
              error={!!emailError}
              helperText={emailError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                  height: 50,
                },
              }}
            />
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mt: 2,
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              placeholder="Enter your password here"
              onChange={handleChange}
              margin="normal"
              required
              error={!!passwordError}
              helperText={passwordError || passwordStrength}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                  height: 50,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              error={!!passwordError}
              helperText={passwordError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                  height: 50,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Typography
              sx={{
                fontFamily: "Satoshi",
                color: "#808195",
                fontWeight: "500",
                fontSize: "14px",
                px: 2,
                py: 1,
              }}
            >
              By creating account, you agree to the{" "}
              <Link href="/t&c">Terms & Conditions</Link> and
              <Link href="/privacy-policy"> Privacy Policy</Link> of High Impact
              Talent
            </Typography>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: "16px",
                background: "#2575fc",
                "&:hover": { background: "#1e5dd9" },
                borderRadius: 16,
                textTransform: "none",
                fontFamily: "Satoshi",
                fontWeight: "700",
              }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
            <Typography
              align="center"
              sx={{
                mt: 2,
                fontFamily: "Satoshi",
                fontWeight: "700",
                color: "#808195",
              }}
            >
              Have an account?{" "}
              <Link href="/u-login" underline="hover">
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{display:{md:"flex",lg:"flex",xs:"none",sm:"none"}}}>
        <Divider sx={{ border: "1px solid #A3A3A3", height: "76%", mt: 18 }} />
      </Box>
      <Box sx={{ display:{md:"flex",lg:"flex",xs:"none",sm:"none"},p: 4, mt: 16, ml: 6 }}>
        <img src={Heroimg} alt="Hero" style={{ height: "550px" }} />
      </Box>
    </Box>
  );
};

export default UserSignUp;
