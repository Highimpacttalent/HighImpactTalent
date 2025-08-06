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
  Grid,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Login } from "../../redux/userSlice";
import { apiRequest } from "../../utils";
import Heroimg from "../../assets/CreateAccount/HeroImg.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// Updated import - use useGoogleLogin hook instead of GoogleLogin component
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useLocation } from "react-router-dom";
import AlertModal from "../../components/Alerts/view";

const generateRandomState = () => {
  const array = new Uint32Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => dec.toString(16).padStart(8, "0")).join("");
};

// Custom Google Button Component (similar to your login page)
const CustomGoogleButton = ({ onClick, disabled }) => (
  <Button
    fullWidth
    variant="outlined"
    onClick={onClick}
    disabled={disabled}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      borderRadius: 16,
      textTransform: "none",
      fontSize: { xs: "0.8rem", sm: "0.9rem" },
      fontWeight: 600,
      color: "rgba(64, 66, 88, 1)",
      borderColor: "rgba(64, 66, 88, 0.23)",
      backgroundColor: "rgba(255, 255, 255, 1)",
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
      height: { xs: "40px", sm: "40px", md: "42px" },
      "&:hover": {
        backgroundColor: "rgba(249, 250, 251, 1)",
        borderColor: "rgba(64, 66, 88, 0.35)",
      },
    }}
  >
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px', 
      height: '20px', 
      flexShrink: 0
    }}>
      {disabled ? (
        <CircularProgress size={20} />
      ) : (
        // Google G logo SVG
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            fill="#4285f4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34a853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#fbbc05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#ea4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
    </Box>
    <Typography
      sx={{
        flexGrow: 1,
        textAlign: "center",
        fontFamily: "Roboto, Arial, sans-serif",
        fontSize: "0.9rem",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        color: '#5F6368'
      }}
    >
      Continue with Google
    </Typography>
  </Button>
);

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
  const [RevertPass, setRevertPass] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  // Email verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);

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

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    if (otpError) setOtpError("");
  };

  // Updated Google Success Handler - handles authorization code
  const handleGoogleSuccess = async (codeResponse) => {
    try {
      setGoogleLoading(true);
      setErrMsg("");

      const { code } = codeResponse;
      if (!code) {
        throw new Error("No authorization code received from Google");
      }
      
      // Send code to backend instead of token
      const res = await apiRequest({
        url: "auth/google",
        method: "POST",
        data: { code: code }, // Changed from token to code
      });

      if (!res?.token) {
        throw new Error(res?.message || "Authentication failed - no token received");
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

  const handleGoogleError = () => {
    setGoogleLoading(false);
    setErrMsg("Google authentication failed. Please try again.");
  };

  // Updated Google Login Hook - uses authorization code flow
  const googleLogin = useGoogleLogin({
    flow: 'auth-code', // Use authorization code flow
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  // Function to validate email with OTP
  const validateEmail = async (e) => {
    e.preventDefault();

    if (passwordStrength == "Weak Password") {
      setAlert({
        open: true,
        type: "warning",
        title: "Warning",
        message:
          "Please choose a password of at least Medium strength to keep your account secure.",
      });
      setRevertPass(true);
      return;
    }
    if (form.password.length < 5) {
      setAlert({
        open: true,
        type: "warning",
        title: "Warning",
        message: "Password must be at least 5 characters long.",
      });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setAlert({
        open: true,
        type: "warning",
        title: "Warning",
        message: "Passwords do not match.",
      });
      return;
    }

    try {
      setOtpSending(true);

      // Generate a random 4-digit OTP
      const randomOtp = Math.floor(1000 + Math.random() * 9000);
      setGeneratedOtp(randomOtp.toString());

      // Call the email verification API
      const res = await apiRequest({
        url: "/sendmail/password",
        method: "POST",
        data: {
          email: form.email,
          otp: randomOtp,
        },
      });

      if (res.success) {
        setIsVerifying(true);
        setErrMsg("");
      } else {
        setErrMsg(
          res.message || "Failed to send verification code. Please try again."
        );
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setErrMsg(
        "An error occurred while sending verification code. Please try again."
      );
    } finally {
      setOtpSending(false);
    }
  };

  // Function to verify OTP and proceed with account creation
  const verifyOtp = () => {
    if (otp === generatedOtp) {
      handleSubmit();
    } else {
      setOtpError("Invalid verification code. Please try again.");
    }
  };

  // Function to create account after OTP verification
  const handleSubmit = async () => {
    setLoading(true);

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
        setAlert({
          open: true,
          type: "error",
          title: "Error",
          message: "Error while registering",
        });
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
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

  return (
    //<GoogleOAuthProvider clientId="390148996153-usdltgirc8gk0mor929tnibamu7a6tad.apps.googleusercontent.com">
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "white",
          display: "flex",
          padding: 3,
          px: { md: 10, lg: 10, xs: 4, sm: 4 },
        }}
      >
        <AlertModal
          open={alert.open}
          onClose={() => setAlert({ ...alert, open: false })}
          type={alert.type}
          title={alert.title}
          message={alert.message}
        />
        <Box
          sx={{
            width: { md: "60%", lg: "60%", xs: "100%", sm: "100%" },
            mt: 4,
            p: { md: 4, lg: 4, xs: 0, sm: 0 },
          }}
        >
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
            You're One Step Away {" "}
            <span
              style={{
                fontWeight: "700",
                fontFamily: "Satoshi",
                color: "#3C7EFC",
              }}
            >
             from Smarter,Faster Hiring!{" "}
            </span>{" "}
            
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "400",
              mb: 3,
              fontFamily: "Satoshi",
              color: "grey",
              fontSize: "18px",
            }}
          >
            Create your free account. No spam. Just opportunities that match your ambition.
          </Typography>
          <Box>
            {errMsg && (
              <Typography color="error" textAlign="center" mb={2}>
                {errMsg}
              </Typography>
            )}

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                {/* Updated Google Button - uses custom button and hook */}
                <CustomGoogleButton 
                  onClick={() => googleLogin()} 
                  disabled={googleLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleLinkedInLogin}
                  disabled={linkedinLoading}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    borderRadius: 16,
                    textTransform: "none",
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    fontWeight: 600,
                    color: "rgba(64, 66, 88, 1)",
                    borderColor: "rgba(64, 66, 88, 0.23)",
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
                    height: { xs: "40px", sm: "40px", md: "42px" },
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
                      flexGrow: 1,
                      textAlign: "center",
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

            {isVerifying ? (
              // OTP Verification Form
              <Box
                sx={{ width: { md: "90%", lg: "90%", xs: "100%", sm: "100%" } }}
              >
                <Typography
                  sx={{
                    fontFamily: "Satoshi",
                    fontSize: "16px",
                    color: "#24252C",
                    fontWeight: "500",
                    mb: 1,
                  }}
                >
                  Ping! Your Invite Just Landed!
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Satoshi",
                    fontSize: "14px",
                    color: "#808195",
                    mb:4
                  }}
                >
                  We've sent a verification code to {form.email} <br/>Because even the smartest career moves need a tiny security check.
                </Typography>

               
                <Typography
                  sx={{
                    fontFamily: "Satoshi",
                    fontSize: "16px",
                    color: "#24252C",
                    fontWeight: "500",
                    mb: 1,
                  }}
                >
                  Enter the magic digits below
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  name="otp"
                  placeholder="Yes, the ones from your inbox — not your ATM pin."
                  value={otp}
                  onChange={handleOtpChange}
                  required
                  error={!!otpError}
                  helperText={otpError}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 16,
                      height: 50,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={verifyOtp}
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
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Verify & Create Account"
                  )}
                </Button>
                 <Typography
                  sx={{
                    fontFamily: "Satoshi",
                    color: "#FF6B6B",
                    fontSize: "12px",
                    fontStyle: "italic",
                    textAlign:'center',
                    mt: 3,
                  }}
                >
                  Can't find it?
  Try your Spam, Junk, or that weird tab Gmail made up called "Promotions."
                </Typography>
                <Typography
                  align="center"
                  sx={{
                    mt: 1,
                    fontFamily: "Satoshi",
                    fontWeight: "700",
                    color: "#808195",
                  }}
                >
                  Still nothing?{" "}
                  <Link
                    href="#"
                    underline="hover"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsVerifying(false);
                    }}
                  >
                    Resend OTP
                  </Link>
                   {" "}- we got you
                </Typography>
              </Box>
            ) : (
              // Registration Form
              <Box
                component="form"
                onSubmit={validateEmail}
                sx={{ width: { md: "90%", lg: "90%", xs: "100%", sm: "100%" } }}
              >
                <Typography
                  sx={{
                    fontFamily: "Satoshi",
                    fontSize: "16px",
                    color: "#24252C",
                    fontWeight: "500",
                    mb: 1,
                  }}
                >
                  Tell us your Name (we'll remember it)
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
                  Email Address (We'll only send you relevant stuff—no spam, ever.)
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
                  Password (Make it strong. This is your career, after all.)
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
                  placeholder="Confirm Password (Just to be sure)"
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
                {RevertPass && (
                  <Box mt={1} px={1} mb={2}>
                    <Typography
                      sx={{ fontSize: "14px", fontWeight: 600, color: "#444" }}
                    >
                     A strong password typically includes:
                    </Typography>
                    <Typography
                      sx={{ fontSize: "13px", color: "#757575", mt: 0.5 }}
                    >
                      • At least 8 characters
                    </Typography>
                    <Typography
                      sx={{ fontSize: "13px", color: "#757575", mt: 0.3 }}
                    >
                      • Uppercase and lowercase letters
                    </Typography>
                    <Typography
                      sx={{ fontSize: "13px", color: "#757575", mt: 0.3 }}
                    >
                      • At least one number
                    </Typography>
                    <Typography
                      sx={{ fontSize: "13px", color: "#757575", mt: 0.3 }}
                    >
                      • At least one special character (e.g. !@#$%)
                    </Typography>
                  </Box>
                )}

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
                  <Link href="/privacy-policy"> Privacy Policy</Link> of High
                  Impact Talent
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
                  disabled={otpSending}
                >
                  {otpSending ? <CircularProgress size={24} /> : "Create Account"}
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
            )}
          </Box>
        </Box>
        <Box sx={{ display: { md: "flex", lg: "flex", xs: "none", sm: "none" } }}>
          <Divider sx={{ border: "1px solid #A3A3A3", height: "90%", mt: 9 }} />
        </Box>
        <Box
          sx={{
            display: { md: "flex", lg: "flex", xs: "none", sm: "none" },
            p: 4,
            mt: 16,
            ml: 6,
          }}
        >
          <img src={Heroimg} alt="Hero" style={{ height: "550px" }} />
        </Box>
      </Box>
    //</GoogleOAuthProvider>
  );
};

export default UserSignUp;