import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaBriefcase, FaUsers } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import {
 Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Grow
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Hero from "../../../assets/Landing/Hero.png";
import Comp1 from "../../../assets/Landing/COmp1.svg";
import Comp2 from "../../../assets/Landing/Comp2.svg";
import Comp3 from "../../../assets/Landing/Comp3.png";
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

import Bottom from "../../../assets/Landing/Bottom.svg";
import PremiumSubscribeSection from "./Subscribe";

// Custom hook for intersection observer
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        setHasBeenInView(true);
      } else {
        setIsInView(false);
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isInView, hasBeenInView];
};

// Animated wrapper component
const AnimatedSection = ({ 
  children, 
  animation = 'fadeUp', 
  delay = 0, 
  duration = 800,
  ...props 
}) => {
  const [ref, isInView, hasBeenInView] = useInView();
  
  const getAnimationStyles = () => {
    const baseStyle = {
      transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      transitionDelay: `${delay}ms`,
    };

    switch (animation) {
      case 'fadeUp':
        return {
          ...baseStyle,
          transform: hasBeenInView ? 'translateY(0px)' : 'translateY(60px)',
          opacity: hasBeenInView ? 1 : 0,
        };
      case 'fadeDown':
        return {
          ...baseStyle,
          transform: hasBeenInView ? 'translateY(0px)' : 'translateY(-60px)',
          opacity: hasBeenInView ? 1 : 0,
        };
      case 'fadeLeft':
        return {
          ...baseStyle,
          transform: hasBeenInView ? 'translateX(0px)' : 'translateX(-60px)',
          opacity: hasBeenInView ? 1 : 0,
        };
      case 'fadeRight':
        return {
          ...baseStyle,
          transform: hasBeenInView ? 'translateX(0px)' : 'translateX(60px)',
          opacity: hasBeenInView ? 1 : 0,
        };
      case 'scale':
        return {
          ...baseStyle,
          transform: hasBeenInView ? 'scale(1)' : 'scale(0.8)',
          opacity: hasBeenInView ? 1 : 0,
        };
      case 'rotate':
        return {
          ...baseStyle,
          transform: hasBeenInView ? 'rotate(0deg) scale(1)' : 'rotate(-10deg) scale(0.9)',
          opacity: hasBeenInView ? 1 : 0,
        };
      case 'slideUp':
        return {
          ...baseStyle,
          transform: hasBeenInView ? 'translateY(0px) scale(1)' : 'translateY(100px) scale(0.95)',
          opacity: hasBeenInView ? 1 : 0,
        };
      default:
        return {
          ...baseStyle,
          opacity: hasBeenInView ? 1 : 0,
        };
    }
  };

  return (
    <div ref={ref} style={getAnimationStyles()} {...props}>
      {children}
    </div>
  );
};

const MobileLanding = () => {
  const theme = useTheme()
  const [email, setEmail] = useState('')
  const isSm = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      setIsOpen(true);
    }
  }, [user]);

  useEffect(() => {
    // Trigger initial load animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    // your submit logic here
    console.log('Subscribing:', email)
  }

  return (
    <div>
      {/* {LoginModal} */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            pb: { xs: 3, md: 15 },
            pt: { xs: 3 },
            minHeight: { md: "100vh" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "white",
          }}
        >
          <Box sx={{ flex: 1, textAlign: "center" }}>
            {/* Hero Section with staggered animations */}
            <AnimatedSection animation="scale" delay={200} duration={1000}>
              <Box sx={{ mt: 1 }}>
                <img src={Hero} alt="./hero" style={{ height: "220px" }} />
              </Box>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={600} duration={800}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                }}
              >
                <Button
                  variant="contained"
                  component={Link}
                  to="/u-login"
                  sx={{
                    bgcolor: "#3C7EFC",
                    borderRadius: 2,
                    fontFamily: "Poppins",
                    width: "30%",
                    textTransform: "none",
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: "#2563eb",
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px rgba(60, 126, 252, 0.3)',
                    }
                  }}
                >
                  Get a job
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/r-login"
                  sx={{
                    borderRadius: 2,
                    fontFamily: "Poppins",
                    width: "30%",
                    textTransform: "none",
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      bgcolor: 'rgba(60, 126, 252, 0.05)',
                    }
                  }}
                >
                  Hire Now
                </Button>
              </Box>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={800} duration={1000}>
              <Box sx={{ width: "100%" }}>
                <img src={Bottom} alt="./hero" style={{ width: "100%" }} />
              </Box>
            </AnimatedSection>

            {/* First Content Section */}
            <Box
              component="section"
              sx={{
                pt: { xs: 2, md: 10 },
                pb: { xs: 5, md: 7 },
                px: { xs: 4, md: 3 },
                backgroundColor: "background.default",
              }}
            >
              <Box textAlign="center">
                {/* Badge with bounce animation */}
                <AnimatedSection animation="fadeDown" delay={200} duration={600}>
                  <Chip
                    label="Get Hired"
                    sx={{
                      mb: 2,
                      px: 2,
                      bgcolor: "#C9E7F6",
                      color: "#0284FE",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      borderRadius: "999px",
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(2, 132, 254, 0.2)',
                      }
                    }}
                  />
                </AnimatedSection>

                {/* Main Heading with typewriter effect simulation */}
                <AnimatedSection animation="fadeUp" delay={400} duration={1000}>
                  <Typography
                    variant="h1"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontSize: { xs: "24px", md: "3.75rem", lg: "4.5rem" },
                      fontWeight: 600,
                      fontFamily: "Satoshi",
                      lineHeight: 1.2,
                      background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Cut through the noise. Land roles that actually fit.
                  </Typography>
                </AnimatedSection>

                <AnimatedSection animation="fadeUp" delay={600} duration={800}>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", md: "1.5rem" },
                      width: "100%",
                      fontFamily: "Poppins",
                      color: "#00000066",
                      mb: 3,
                      mt: 1,
                    }}
                  >
                    Tired of job hunts that lead nowhere? Tell us what you do
                    best—and what you won't settle for. We'll match you with roles
                    that truly fit.
                  </Typography>
                </AnimatedSection>

                <AnimatedSection animation="scale" delay={200} duration={1000}>
                  <Box sx={{ mt: 1 }}>
                    <img 
                      src={Comp1} 
                      alt="./hero" 
                      style={{ 
                        height: "220px",
                        filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))',
                        transition: 'all 0.3s ease',
                      }} 
                    />
                  </Box>
                </AnimatedSection>
              </Box>
            </Box>

            {/* Second Content Section */}
            <Box
              component="section"
              sx={{
                pt: { xs: 2, md: 10 },
                pb: { xs: 5, md: 7 },
                px: { xs: 2, md: 3 },
                backgroundColor: "#1BA5EA1A",
              }}
            >
              <Box textAlign="center">
                {/* Main Heading */}
                <AnimatedSection animation="fadeUp" delay={200} duration={1000}>
                  <Typography
                    variant="h1"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontSize: { xs: "22px", md: "3.75rem", lg: "4.5rem" },
                      fontWeight: 600,
                      fontFamily: "Satoshi",
                      lineHeight: 1.2,
                      px: 2,
                      mb: 2,
                      background: 'linear-gradient(135deg, #1BA5EA 0%, #0284FE 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Streamline Your Hiring. Connect with Talent That Truly Fits.
                  </Typography>
                </AnimatedSection>

                <AnimatedSection animation="fadeUp" delay={400} duration={800}>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", md: "1.5rem" },
                      fontFamily: "Poppins",
                      color: "#00000066",
                      mb: 3,
                      mt: 1,
                    }}
                  >
                    Our AI-driven platform helps you identify the right candidates
                    — faster, smarter, and more effectively. Focus on what
                    matters: hiring talent that sticks.
                  </Typography>
                </AnimatedSection>

                <AnimatedSection animation="fadeLeft" delay={600} duration={1000}>
                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img 
                      src={Comp2} 
                      alt="./comp2" 
                      style={{
                        filter: 'drop-shadow(0 15px 35px rgba(27, 165, 234, 0.15))',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Box>
                </AnimatedSection>

                <AnimatedSection animation="scale" delay={800} duration={1200}>
                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img 
                      src={Comp3} 
                      alt="./comp3" 
                      style={{ 
                        height: "280px",
                        filter: 'drop-shadow(0 20px 40px rgba(27, 165, 234, 0.2))',
                        transition: 'all 0.3s ease',
                      }} 
                    />
                  </Box>
                </AnimatedSection>
              </Box>
            </Box>

            {/* Premium Subscribe Section */}
            <AnimatedSection animation="slideUp" delay={200} duration={1000}>
              <Box sx={{width: "100%"}}>
                <PremiumSubscribeSection/>
              </Box>
            </AnimatedSection>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default MobileLanding;