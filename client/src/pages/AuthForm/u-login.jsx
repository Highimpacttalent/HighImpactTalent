import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils";
import { useDispatch } from "react-redux";
import { Login } from "../../redux/userSlice";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  InputAdornment,
  IconButton,
  CircularProgress,
  Avatar,
  Card,
  CardContent
} from "@mui/material";
import { Visibility, VisibilityOff,Star,} from "@mui/icons-material";
// FIX: Import the hook instead of the component
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useLocation } from "react-router-dom";

const generateRandomState = () => {
  const array = new Uint32Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => dec.toString(16).padStart(8, "0")).join("");
};

// Mock testimonials data
const testimonials = [
  {
    id: 1,
    name: "Manas Singh",
    role: "Full Stack Developer",
    avatar: "MS",
    comment: "From frontend UI decisions to backend performance tuning, this platform made my development process remarkably efficient. The built-in automation and clean APIs helped me ship features faster without compromising on quality. Truly a developer-friendly experience!",
    rating: 5
  },
  {
    id: 2,
    name: "Anuradha",
    role: "Tech Lead",
    avatar: "A",
    comment: "What impressed me most was how seamlessly the platform scaled with our engineering needs. Managing sprints, integrating new tools, and overseeing multiple developers became smoother than ever. It’s built with tech leadership in mind — reliable, flexible, and insightful.",
    rating: 5
  },
  {
    id: 3,
    name: "Divija",
    role: "Marketing Expert",
    avatar: "D",
    comment: "This platform helped me identify and engage the right talent 10x faster. The clarity in profile insights and AI-powered recommendations made campaign planning and execution a breeze. It’s more than a hiring tool — it’s a marketer’s secret weapon.",
    rating: 5
  }
];

const TestimonialCard = ({ testimonial, isVisible }) => (
  <Card
    sx={{
      mb: 2,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(60, 126, 252, 0.08)',
      borderRadius: '20px',
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
      opacity: isVisible ? 1 : 0,
      boxShadow: '0 8px 32px rgba(60, 126, 252, 0.08)',
      '&:hover': {
        transform: isVisible ? 'translateY(-4px) scale(1.02)' : 'translateY(20px) scale(0.95)',
        boxShadow: '0 16px 48px rgba(60, 126, 252, 0.12)',
      }
    }}
  >
    <CardContent sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar
          sx={{
            bgcolor: 'linear-gradient(135deg, rgba(60, 126, 252, 1) 0%, rgba(60, 126, 252, 0.8) 100%)',
            color: 'white',
            width: 56,
            height: 56,
            fontSize: '20px',
            fontWeight: 'bold',
            mr: 3,
            boxShadow: '0 4px 16px rgba(60, 126, 252, 0.2)'
          }}
        >
          {testimonial.avatar}
        </Avatar>
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(64, 66, 88, 1)',
              fontWeight: 700,
              fontSize: '18px',
              fontFamily: 'Satoshi',
              mb: 0.5
            }}
          >
            {testimonial.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(128, 129, 149, 1)',
              fontSize: '14px',
              fontFamily: 'Satoshi',
              fontWeight: 500
            }}
          >
            {testimonial.role}
          </Typography>
        </Box>
      </Box>
      
      <Box display="flex" mb={3}>
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} sx={{ 
            color: 'rgba(60, 126, 252, 1)', 
            fontSize: '20px',
            filter: 'drop-shadow(0 2px 4px rgba(60, 126, 252, 0.2))'
          }} />
        ))}
      </Box>
      
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(64, 66, 88, 0.8)',
          fontSize: '16px',
          lineHeight: 1.7,
          fontFamily: 'Satoshi',
          fontWeight: 400,
          position: 'relative',
          pl: 2,
          '&::before': {
            content: '""', // Use empty content for pseudo-element
            position: 'absolute',
            left: 0,
            top: 4, // Adjust positioning
            bottom: 4, // Adjust positioning
            width: '3px',
            backgroundColor: 'rgba(60, 126, 252, 0.1)',
            borderRadius: '2px'
          }
        }}
      >
        {testimonial.comment}
      </Typography>
    </CardContent>
  </Card>
);

const AnimatedTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState([0, 1]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % testimonials.length;
        const nextVisible = [
          next,
          (next + 1) % testimonials.length
        ];
        setVisibleTestimonials(nextVisible);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ height: '450px', overflow: 'hidden', position: 'relative' }}>
      {testimonials.map((testimonial, index) => (
        <Box
          key={testimonial.id}
          sx={{
            position: 'absolute',
            width: '100%',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            ...(index === visibleTestimonials[0] && {
              top: '0%',
              zIndex: 2
            }),
            ...(index === visibleTestimonials[1] && {
              top: '52%',
              zIndex: 1
            }),
            ...(!visibleTestimonials.includes(index) && {
              top: '100%',
              zIndex: 0,
              opacity: 0
            })
          }}
        >
          <TestimonialCard
            testimonial={testimonial}
            isVisible={visibleTestimonials.includes(index)}
          />
        </Box>
      ))}
    </Box>
  );
};

// Updated CustomGoogleButton component with proper round Google logo
const CustomGoogleButton = ({ onClick, disabled }) => (
  <Button
    fullWidth
    variant="outlined"
    onClick={onClick}
    disabled={disabled}
    sx={{
      display: "flex", 
      alignItems: "center", 
      justifyContent: "flex-start",
      gap: 1, 
      textTransform: "none", 
      fontWeight: 600,
      color: "rgba(64, 66, 88, 1)", 
      borderColor: "rgba(64, 66, 88, 0.23)",
      backgroundColor: "rgba(255, 255, 255, 1)", 
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
      height: "44px", 
      minHeight: "44px", 
      width: "100%", 
      padding: "6px 16px",
      position: "relative", 
      overflow: "hidden",
      "&:hover": { 
        backgroundColor: "rgba(249, 250, 251, 1)", 
        borderColor: "rgba(64, 66, 88, 0.35)" 
      },
    }}
  >
    <Box sx={{ 
      position: 'relative', 
      width: '20px', 
      height: '20px', 
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {disabled ? (
        <CircularProgress size={20} />
      ) : (
        // Updated Google G logo - properly round
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
    <Box sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <Typography sx={{
        fontFamily: "Roboto, Arial, sans-serif", 
        fontSize: "0.9rem",
        fontWeight: 500, 
        textOverflow: "ellipsis", 
        whiteSpace: "nowrap",
        overflow: "hidden", 
        color: '#5F6368'
      }}>
        Continue with Google
      </Typography>
    </Box>
  </Button>
);

function UserLoginForm() {
  const location = useLocation();
  const refer = location.state?.refer || "/find-jobs";
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
        let messageToDisplay = res?.message;
        if (messageToDisplay === "Invalid email or password") {
          messageToDisplay = "That email isn't registered with us.";
        }
        setErrMsg(messageToDisplay || "An unexpected error occurred.");
        return;
      } else {
        setErrMsg("");
        const userData = { token: res?.token, ...res?.user };
        dispatch(Login(userData));
        localStorage.setItem("userInfo", JSON.stringify(userData));
        navigate(refer);
      }
    } catch (error) {
      setErrMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // FIX: Update the Google success handler to process the authorization `code`.
  const handleGoogleSuccess = async (codeResponse) => {
    try {
      setGoogleLoading(true);
      setErrMsg("");

      const { code } = codeResponse;
      if (!code) {
        throw new Error("No authorization code received from Google");
      }
      
      // IMPORTANT: Your backend now receives a 'code' instead of a 'token'.
      // It must exchange this code for user tokens with Google.
      const res = await apiRequest({
        url: "auth/google",
        method: "POST",
        data: { code: code },
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

  // FIX: Implement the `useGoogleLogin` hook.
  const googleLogin = useGoogleLogin({
    flow: 'auth-code', // Use the recommended and secure auth code flow
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  const handleLinkedInLogin = () => {
    try {
      setLinkedinLoading(true);
      setErrMsg("");
      const state = generateRandomState();
      localStorage.setItem("linkedin_oauth_state", state);
      const params = new URLSearchParams({
        response_type: "code",
        client_id: "86a6w4yf01ndrx",
        redirect_uri: `${window.location.origin}/linkedin-callback`,
        scope: "openid profile email",
        state: state,
      });
      window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    } catch (error) {
      console.error("LinkedIn auth error:", error);
      setErrMsg("Failed to initiate LinkedIn login");
      setLinkedinLoading(false);
    }
  };
  
  return (
    //<GoogleOAuthProvider clientId="390148996153-usdltgirc8gk0mor929tnibamu7a6tad.apps.googleusercontent.com">
      <Box sx={{ minHeight: '100vh', display: 'flex' }}>
        {/* Left Panel - Login Form */}
        <Box sx={{ flex: 1, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, md: 6 } }}>
          <Box sx={{ width: '100%', maxWidth: '400px' }}>
            <Typography variant="h4" fontWeight="700" fontFamily="Satoshi" fontSize="32px" textAlign="center" mb={4} color="rgba(64, 66, 88, 1)">
              Login
            </Typography>

            {errMsg && (
              <Typography color="error" textAlign="center" mb={3}>
                {errMsg}
              </Typography>
            )}

            <form onSubmit={handleSubmit}>
              <Box mb={3}>
                <Typography fontWeight="700" fontFamily="Satoshi" color="rgba(64, 66, 88, 1)" mb={1}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth variant="outlined" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>

              <Box mb={2}>
                <Typography fontWeight="700" fontFamily="Satoshi" color="rgba(64, 66, 88, 1)" mb={1}>
                  Password
                </Typography>
                <TextField
                  fullWidth variant="outlined" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Typography textAlign="right" mb={3}>
                <a href="/password" style={{ color: "rgba(60, 126, 252, 1)", textDecoration: "none", fontWeight: "bold", fontFamily: "Satoshi", fontSize: "14px", }}>
                  Forgot Password?
                </a>
              </Typography>

              <Button
                fullWidth type="submit" variant="contained"
                sx={{
                  py: 1.5, borderRadius: 2, textTransform: "none", fontSize: "16px", fontWeight: "600", fontFamily: "Satoshi", bgcolor: "rgba(60, 126, 252, 1)", mb: 3,
                  '&:hover': { bgcolor: "rgba(50, 116, 242, 1)", }
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>

              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "Satoshi", fontSize: "12px" }}>
                  OR CONTINUE WITH
                </Typography>
              </Divider>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  {/* FIX: Use the custom button and call the hook's function on click. */}
                  <CustomGoogleButton 
                    onClick={() => googleLogin()} 
                    disabled={googleLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth variant="outlined" onClick={handleLinkedInLogin} disabled={linkedinLoading}
                    sx={{
                      display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 1, textTransform: "none", fontWeight: 600,
                      color: "rgba(64, 66, 88, 1)", borderColor: "rgba(64, 66, 88, 0.23)", backgroundColor: "rgba(255, 255, 255, 1)",
                      height: "44px", minHeight: "44px", padding: "6px 16px",
                      "&:hover": { backgroundColor: "rgba(249, 250, 251, 1)", borderColor: "rgba(64, 66, 88, 0.35)", },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', flexShrink: 0 }}>
                      {linkedinLoading ? <CircularProgress size={20} /> : <LinkedInIcon sx={{ color: "#0077B5", fontSize: '20px' }} />}
                    </Box>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography sx={{ fontFamily: "Arial", fontSize: "0.9rem", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", }}>
                        Continue with LinkedIn
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              </Grid>

              <Typography textAlign="center" color="rgba(128, 129, 149, 1)" sx={{ fontSize: "14px", fontFamily: "Satoshi" }}>
                Don't have an account?{" "}
                <a href="/u-authform" style={{ color: "rgba(60, 126, 252, 1)", textDecoration: "none", fontWeight: "600", }}>
                  Create Account
                </a>
              </Typography>
            </form>
          </Box>
        </Box>

        {/* Right Panel - Animated Testimonials */}
        <Box sx={{ flex: 1, background: 'linear-gradient(135deg, rgba(248, 250, 252, 1) 0%, rgba(241, 245, 249, 1) 50%, rgba(248, 250, 252, 1) 100%)', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 6, position: 'relative', overflow: 'hidden' }}>
          {/* Elegant background decoration */}
          <Box sx={{ position: 'absolute', top: '15%', right: '10%', width: '300px', height: '300px', background: 'linear-gradient(135deg, rgba(60, 126, 252, 0.03) 0%, rgba(60, 126, 252, 0.08) 100%)', borderRadius: '50%', filter: 'blur(60px)', }} />
          <Box sx={{ position: 'absolute', bottom: '20%', left: '5%', width: '200px', height: '200px', background: 'linear-gradient(135deg, rgba(60, 126, 252, 0.05) 0%, rgba(60, 126, 252, 0.1) 100%)', borderRadius: '50%', filter: 'blur(40px)', }} />
          {/* Geometric shapes */}
          <Box sx={{ position: 'absolute', top: '25%', left: '8%', width: '2px', height: '60px', background: 'linear-gradient(180deg, rgba(60, 126, 252, 0.2) 0%, rgba(60, 126, 252, 0.05) 100%)', borderRadius: '1px', transform: 'rotate(45deg)', }} />
          <Box sx={{ position: 'absolute', top: '70%', right: '12%', width: '16px', height: '16px', border: '2px solid rgba(60, 126, 252, 0.15)', borderRadius: '50%', }} />

          <Box sx={{ textAlign: 'center', mb: 6, zIndex: 2 }}>
            <Typography variant="h4" sx={{ color: 'rgba(64, 66, 88, 1)', fontWeight: 700, fontFamily: 'Satoshi', fontSize: '32px', mb: 3, letterSpacing: '-0.5px' }}>
              Trusted by Professionals
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(128, 129, 149, 1)', fontWeight: 400, fontSize: '18px', maxWidth: '450px', lineHeight: 1.6, fontFamily: 'Satoshi' }}>
              We don’t do job lists. We do dream fits. Tell us what you’re great at—and what you’ll never settle for. We’ll match you with roles that get it, and get you.
            </Typography>
          </Box>

          <Box sx={{ width: '100%', maxWidth: '480px', zIndex: 2 }}>
            <AnimatedTestimonials />
          </Box>

          {/* Floating elements with blue theme */}
          <Box sx={{ position: 'absolute', top: '35%', left: '12%', animation: 'float 6s ease-in-out infinite', '@keyframes float': { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-15px)' } } }}>
            <Box sx={{ width: '8px', height: '8px', background: 'rgba(60, 126, 252, 0.4)', borderRadius: '50%', }} />
          </Box>
          <Box sx={{ position: 'absolute', top: '55%', right: '15%', animation: 'float 8s ease-in-out infinite reverse', }}>
            <Box sx={{ width: '6px', height: '6px', background: 'rgba(60, 126, 252, 0.3)', borderRadius: '50%', }} />
          </Box>
          <Box sx={{ position: 'absolute', bottom: '35%', left: '20%', animation: 'float 10s ease-in-out infinite', }}>
            <Box sx={{ width: '10px', height: '10px', background: 'rgba(60, 126, 252, 0.2)', borderRadius: '50%', }} />
          </Box>
        </Box>
      </Box>
    //</GoogleOAuthProvider>
  );
}

export default UserLoginForm;