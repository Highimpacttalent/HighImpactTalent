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
  Container,
  Grid,
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

// Minimal animation hook for subtle effects
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, {
      threshold: 0.2,
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

  return [ref, isInView];
};

// Subtle animation wrapper - minimal and professional
const AnimatedSection = ({ children, delay = 0, ...props }) => {
  const [ref, isInView] = useInView();
  
  return (
    <div 
      ref={ref} 
      style={{
        transform: isInView ? 'translateY(0px)' : 'translateY(20px)',
        opacity: isInView ? 1 : 0,
        transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
      }} 
      {...props}
    >
      {children}
    </div>
  );
};

const DesktopLanding = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

   const handleClick = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/find-jobs");
    } else {
      navigate("/u-login");
    }
  };

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      setIsOpen(true);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribing:', email);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#fafafa',
      overflow: 'hidden',
      px:2
    }}>
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#ffffff',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(60, 126, 252, 0.02) 0%, rgba(27, 165, 234, 0.02) 100%)',
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={8} alignItems="center">
            {/* Left Column - Content */}
            <Grid item xs={12} md={6}>
              <AnimatedSection delay={0}>
                <Box sx={{ maxWidth: 600 }}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { md: '2.5rem', lg: '2.5rem' },
                      fontWeight: 700,
                      fontFamily: 'Satoshi, -apple-system, BlinkMacSystemFont, sans-serif',
                      lineHeight: 1.1,
                      color: '#0a0a0a',
                      mb: 3,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Where the right talent meet the{' '}
                    <Box 
                      component="span" 
                      sx={{
                         fontSize: { md: '2.5rem', lg: '2.5rem' },
                      fontWeight: 700,
                      fontFamily: 'Satoshi, -apple-system, BlinkMacSystemFont, sans-serif',
                      lineHeight: 1.1,
                      color: '#0a0a0a',
                      mb: 3,
                      letterSpacing: '-0.02em',
                        background: 'linear-gradient(135deg, #3C7EFC 0%, #1BA5EA 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Right roles
                    </Box>{' '}
                    Fast.
                  </Typography>
                  
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: '1.1rem',
                      fontFamily: 'Poppins, sans-serif',
                      color: '#64748b',
                      mb: 5,
                      lineHeight: 1.6,
                      fontWeight: 400
                    }}
                  >
                    Most platforms throw thousands of irrelevant profiles your way. We don't. Whether you're hiring or job hunting, we get you to the shortlist faster with AI, insight, and a human touch.
                  </Typography>

                  <Stack direction="row" spacing={3} sx={{ mb: 6 }}>
                    <Button
                      variant="contained"
                      onClick={handleClick}
                      size="large"
                      sx={{
                        bgcolor: '#3C7EFC',
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        fontFamily: 'Poppins',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 20px rgba(60, 126, 252, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          bgcolor: '#2563eb',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 30px rgba(60, 126, 252, 0.4)',
                        }
                      }}
                    >
                      Find Your Dream Job
                    </Button>
                    
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/r-login"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        fontFamily: 'Poppins',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        border: '2px solid #e2e8f0',
                        color: '#475569',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          borderColor: '#3C7EFC',
                          color: '#3C7EFC',
                          bgcolor: 'rgba(60, 126, 252, 0.04)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      Hire Top Talent
                    </Button>
                  </Stack>

                  {/* Trust indicators */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#0a0a0a', mb: 0.5 }}>
                        1K+
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        Jobs Parsed
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#0a0a0a', mb: 0.5 }}>
                        50+
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        Companies
                      </Typography>
                    </Box>
                    {/* <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#0a0a0a', mb: 0.5 }}>
                        90%
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        Success Rate
                      </Typography>
                    </Box> */}
                  </Box>
                </Box>
              </AnimatedSection>
            </Grid>

            {/* Right Column - Hero Image */}
            <Grid item xs={12} md={6}>
              <AnimatedSection delay={200}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <img 
                    src={Hero} 
                    alt="Professional hiring platform" 
                    style={{ 
                      maxWidth: '100%',
                      height: 'auto',
                      maxHeight: '500px',
                      filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.1))'
                    }} 
                  />
                </Box>
              </AnimatedSection>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Job Seekers Section */}
      <Box
        component="section"
        sx={{
          py: { md: 12, lg: 16 },
          bgcolor: '#ffffff',
          borderTop: '1px solid #f1f5f9'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={10} alignItems="center">
            <Grid item xs={12} md={6}>
              <AnimatedSection>
                <Box sx={{ position: 'relative' }}>
                  <img 
                    src={Comp1} 
                    alt="Job matching platform" 
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.08))'
                    }} 
                  />
                </Box>
              </AnimatedSection>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <AnimatedSection delay={200}>
                <Box sx={{ pl: { md: 4 } }}>
                  <Chip
                    label="For Job Seekers"
                    sx={{
                      mb: 3,
                      px: 3,
                      py: 1,
                      bgcolor: '#eff6ff',
                      color: '#2563eb',
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      borderRadius: '50px',
                      border: '1px solid #dbeafe',
                      fontStyle:'bold'
                    }}
                  />
                  
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { md: '2.5rem', lg: '2.5rem' },
                      fontWeight: 700,
                      fontFamily: 'Satoshi',
                      lineHeight: 1.2,
                      color: '#0a0a0a',
                      mb: 4,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Your career deserves better{' '}
                    <Box component="span" sx={{ color: '#3C7EFC' }}>
                      than job boards.
                    </Box>
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1.1rem',
                      fontFamily: 'Poppins',
                      color: '#64748b',
                      mb: 4,
                      lineHeight: 1.7
                    }}
                  >
                    We don’t just parse your resume—we understand your story. Our AI matches you to roles that respect your ambition and skip the fluff.
                  </Typography>

                  <Stack spacing={3}>
                    {[
                      'Hyper-personalized job matches',
                      'Direct access to top companies',
                      'Real-time application tracking (and no ghosting)'
                    ].map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle size={20} color="#10b981" />
                        <Typography sx={{ color: '#374151', fontFamily: 'Poppins' }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </AnimatedSection>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Employers Section */}
      <Box
        component="section"
        sx={{
          py: { md: 12, lg: 16 },
          bgcolor: '#f8fafc',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={10} alignItems="center">
            <Grid item xs={12} md={6}>
              <AnimatedSection>
                <Box sx={{ pr: { md: 4 } }}>
                  <Chip
                    label="For Employers"
                    sx={{
                      mb: 3,
                      px: 3,
                      py: 1,
                      bgcolor: '#f0f9ff',
                      color: '#0284c7',
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      borderRadius: '50px',
                      border: '1px solid #e0f2fe',
                      fontStyle:'bold'
                    }}
                  />
                  
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { md: '2.5rem', lg: '2.5rem' },
                      fontWeight: 700,
                      fontFamily: 'Satoshi',
                      lineHeight: 1.2,
                      color: '#0a0a0a',
                      mb: 4,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Find candidates{' '}
                    <Box component="span" sx={{ color: '#1BA5EA' }}>
                       you won’t want to lose.
                    </Box>
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1.125rem',
                      fontFamily: 'Poppins',
                      color: '#64748b',
                      mb: 4,
                      lineHeight: 1.7
                    }}
                  >
                    No more CV flood. No more guesswork. Just sharp, high-retention talent vetted for skill and culture fit. Delivered faster than your team’s group chat.
                  </Typography>

                  <Stack spacing={3}>
                    {[
                      'AI-driven resume screening (zero noise)',
                      'Culture-fit insights (beyond keywords)',
                      'Interview-ready shortlists in short time'
                    ].map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle size={20} color="#10b981" />
                        <Typography sx={{ color: '#374151', fontFamily: 'Poppins' }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </AnimatedSection>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <AnimatedSection delay={300}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
            }}>
              <img 
                src={Comp3} 
                alt="Platform interface" 
                style={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  filter: 'drop-shadow(0 30px 80px rgba(0, 0, 0, 0.12))',
                  borderRadius: '16px'
                }} 
              />
            </Box>
          </AnimatedSection>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bottom Wave
      <Box sx={{ 
        bgcolor: '#ffffff',
        '& img': { 
          width: '100%', 
          height: 'auto',
          display: 'block'
        }
      }}>
        <img src={Bottom} alt="Wave decoration"/>
      </Box> */}

      {/* Premium Subscribe Section */}
      <AnimatedSection>
        <PremiumSubscribeSection />
      </AnimatedSection>
    </Box>
  );
};

export default DesktopLanding;