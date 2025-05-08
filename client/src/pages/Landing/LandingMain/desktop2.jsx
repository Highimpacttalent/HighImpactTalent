import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  CircularProgress // Added for suspense fallback
} from '@mui/material';
// Assuming Lucide Icons are installed: npm install lucide-react
import { 
  Search, 
  School, // Example icon, not strictly used as is but good to have
  MessageSquare, // Using MessageSquare as Chat/Message Icon
  CheckCircle, 
  SlidersHorizontal, // Using SlidersHorizontal for growth/process
  ChartLine,
  BarChart2, // Using BarChart2 for ChartLine/Metrics
  Linkedin, // Example social icons
  Twitter,
  Star, // Example trust badge icon
  Shield // Example trust badge icon
} from 'lucide-react';


// ----------------------------------------------------------
// 1. Global Setup: Theme, Fonts (comment), Variants
// ----------------------------------------------------------

// Create custom theme with our color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#3C7EFC', // Electric Blue
    },
    secondary: {
      main: '#00C48C', // Bright Green (Accent)
    },
    background: {
      default: '#F8F9FB', // Off-white Background Gray
      paper: '#FFFFFF', // Card/Paper background
    },
    text: {
      primary: '#5A6378', // Text Gray
      secondary: '#778092', // Slightly lighter text gray
    },
  },
  typography: {
    // Poppins Regular will be the default
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontFamily: "'Satoshi', sans-serif",
      fontWeight: 800, // ExtraBold
      color: '#333', // Darker text for headlines
    },
    h2: {
      fontFamily: "'Satoshi', sans-serif",
      fontWeight: 800,
      color: '#333',
    },
    h3: {
      fontFamily: "'Satoshi', sans-serif",
      fontWeight: 800,
      color: '#333',
    },
    h4: {
      fontFamily: "'Satoshi', sans-serif",
      fontWeight: 700,
      color: '#333',
    },
    h5: {
      fontFamily: "'Satoshi', sans-serif",
      fontWeight: 700,
      color: '#333',
    },
    h6: {
      fontFamily: "'Satoshi', sans-serif",
      fontWeight: 700,
      color: '#333',
    },
    body1: {
      color: '#5A6378',
    },
    body2: {
      color: '#778092',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Pill shape
          textTransform: 'none',
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          boxShadow: 'none', // Remove default shadow
          '&:hover': {
             boxShadow: 'none', // Ensure no shadow on hover unless specified
          }
        },
        contained: {
            '&:hover': {
                opacity: 0.9, // Simple hover effect before adding glow
            }
        },
        outlined: {
            borderWidth: '2px !important', // Thicker border
            '&:hover': {
                borderWidth: '2px !important',
            }
        }
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 16, // Rounded corners for cards
            }
        }
    },
    MuiTabs: {
        styleOverrides: {
            indicator: {
                // Hidden indicator for pill-style tabs
                display: 'none',
            },
        },
    },
    MuiTab: {
        styleOverrides: {
            root: {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '10px 24px',
                minHeight: 'auto',
                transition: 'all 0.3s ease',
                borderRadius: 50, // Pill shape for tabs
                '&.Mui-selected': {
                    color: 'white', // Text color for active tab
                },
            },
        },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 24, // Pill shape for text field
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                        boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.08)',
                    },
                    '&.Mui-focused': {
                         boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
                         borderColor: '#3C7EFC !important', // Add focus border color
                    },
                },
                 '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent !important', // Hide default outline
                },
            },
        },
    },
  },
});

// Comment reminder for Google Fonts:
// Import Poppins (Regular) and Satoshi (ExtraBold 800) in your public/index.html <head>:
/*
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Satoshi:wght@800&display=swap" rel="stylesheet">
*/


// Framer Motion Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const popIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
      mass: 0.5 // Added mass for a slightly different feel
    }
  }
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 120, // Adjusted stiffness
      damping: 25 // Adjusted damping
    }
  }
};

const slideFromRight = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 25
    }
  }
};

const slideFromBottom = {
    hidden: { opacity: 0, y: 100 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 20
        }
    }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Faster stagger for subtle effect
      delayChildren: 0.2 // Delay before children start animating
    }
  }
};

const textReveal = { // For typewriter-like effect
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 1.5, // Control speed
            ease: "linear"
        }
    }
};

const bounceIn = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            damping: 8, // Control bounciness
            stiffness: 100, // Control speed
            duration: 0.5
        }
    }
}


// ----------------------------------------------------------
// Helper Components (SVG, Cards, etc.)
// ----------------------------------------------------------

// SVG for the Hero Headline Underline
const UnderlineSVG = () => (
  <motion.svg
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 1, ease: "easeInOut", delay: 1.0 }} // Adjusted delay
    width="100%"
    height="12" // Increased height slightly
    viewBox="0 0 200 12"
    fill="none"
    style={{ position: 'absolute', bottom: -8, left: 0, right: 0 }} // Adjusted position
  >
    <motion.path
      d="M2,10 C50,2 150,18 198,10" // More organic curve
      stroke="#00C48C" // Accent Green
      strokeWidth="4" // Thicker line
      strokeLinecap="round"
    />
  </motion.svg>
);

// SVG for Connecting Lines in How It briefcases section
const ConnectingLine = () => (
  // This SVG will span the full width between two grid items on desktop
  // and should be hidden or styled differently on mobile if layout changes
  <motion.svg
    initial={{ pathLength: 0 }}
    whileInView={{ pathLength: 1 }}
    viewport={{ once: true, margin: "-50px" }} // Trigger when slightly visible
    transition={{ duration: 1.5, ease: "easeInOut" }}
    width="100%"
    height="2"
    viewBox="0 0 100 2"
    preserveAspectRatio="none"
    className="absolute top-1/2 left-0 z-0 hidden md:block" // Hide on mobile, position absolutely on desktop
  >
    <motion.path
      d="M0,1 L100,1" // Simple horizontal line
      stroke="#3C7EFC" // Primary Blue
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="8 8" // Dashed line
    />
  </motion.svg>
);


// Placeholder for HeroVisual (replace with actual component if available)
const PlaceholderHeroVisual = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // Only apply parallax on non-mobile screens
    if (window.innerWidth < theme.breakpoints.values.md) return;

    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();

    // Calculate rotation based on mouse position relative to element center
    const x = (clientX - left) / width - 0.5; // -0.5 to 0.5
    const y = (clientY - top) / height - 0.5; // -0.5 to 0.5

    // Max rotation angle
    const maxRotation = 15;

    setRotation({
        x: y * -maxRotation, // Tilt up/down based on mouse Y
        y: x * maxRotation    // Tilt left/right based on mouse X
    });
  };

  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className="w-full h-64 md:h-96 flex items-center justify-center" // Added h-64 for mobile
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave} // Added mouse leave handler
      whileHover={{ scale: 1.03 }} // Reduced hover scale slightly
    >
      {/* This inner div applies the 3D transform */}
      <div
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.3s ease-out', // Smoother transition
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Replace this with your actual SVG/Image component */}
        {/* Example: <ActualHeroSVG aria-hidden="true" /> */}
        {/* Placeholder Visual: A simple blue/green abstract shape */}
        <Box
          sx={{
            width: '80%', // Occupy more space
            maxWidth: 400, // Max size
            height: '80%',
            maxHeight: 400,
            bgcolor: 'primary.main',
            borderRadius: '20%', // Abstract shape
            position: 'relative',
            overflow: 'hidden',
             boxShadow: '0 20px 50px rgba(0,0,0,0.1)', // Add shadow
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
          }}
          aria-hidden="true" // Hide from screen readers as it's decorative
        >
             {/* Green blob */}
             <Box sx={{
                 position: 'absolute',
                 bottom: -50,
                 right: -50,
                 width: 150,
                 height: 150,
                 bgcolor: 'secondary.main',
                 borderRadius: '50%',
                 opacity: 0.7,
                 filter: 'blur(30px)'
             }}></Box>
             {/* Lighter Blue blob */}
             <Box sx={{
                 position: 'absolute',
                 top: -50,
                 left: -50,
                 width: 150,
                 height: 150,
                 bgcolor: 'rgba(60, 126, 252, 0.5)',
                 borderRadius: '50%',
                 opacity: 0.7,
                 filter: 'blur(30px)'
             }}></Box>
             {/* Central element/icon */}
             <briefcase size={64} color="white" style={{ position: 'relative', zIndex: 1 }} />
        </Box>
      </div>
    </motion.div>
  );
};

// Lazy load the placeholder (or actual) visual
// Using PlaceholderHeroVisual directly for the single-file delivery,
// but keeping the Suspense structure as requested for demonstrating lazy loading setup.
const LazyHeroVisual = lazy(() => Promise.resolve({ default: PlaceholderHeroVisual }));


// Candidate Card Component for Search Results
const CandidateCard = ({ name, role, skills, match }) => (
  <motion.div
    variants={popIn} // Animate when appearing in the grid
    className="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100" // Tailwind classes for background, shape, shadow, border
  >
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" className="text-gray-800">{name}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{role}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
        {skills.map((skill, i) => (
          <Box key={i} sx={{
            backgroundColor: '#F0F7FF', // Light blue background
            px: 1,
            py: 0.2,
            borderRadius: 2,
            fontSize: '0.7rem',
            color: 'primary.main', // Blue text
            fontWeight: 500,
          }}>
            {skill}
          </Box>
        ))}
      </Box>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Button variant="outlined" size="small" sx={{
          borderColor: 'primary.main',
          color: 'primary.main',
           px: 2, // Increased padding
          '&:hover': {
            bgcolor: 'primary.main',
            color: 'white',
            borderColor: 'primary.main',
          }
        }}>
          View Profile
        </Button>
        <Box sx={{
          bgcolor: 'secondary.main', // Green background
          color: 'white',
          px: 1.5,
          py: 0.5,
          borderRadius: 5,
          fontSize: '0.8rem',
          fontWeight: 'bold',
          minWidth: 70, // Ensure minimum width
          textAlign: 'center'
        }}>
          {match}%
        </Box>
      </Box>
    </Box>
  </motion.div>
);

// Feature Card Component for circular icons
const FeatureBlock = ({ icon: Icon, title, description }) => { // Renamed to Block for clarity vs Card
  return (
    <motion.div
      variants={popIn} // Stagger-fade/pop in
      whileHover={{ scale: 1.05, y: -5 }} // Hover pop effect
      className="flex flex-col items-center text-center p-4" // Added padding
    >
      <Box sx={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        bgcolor: '#F0F7FF', // Light blue
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
        color: 'primary.main', // Blue icon
        boxShadow: '0 5px 15px rgba(60,126,252,0.2)' // Subtle blue shadow
      }}>
        <Icon size={36} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>
    </motion.div>
  );
};

// Step Card Component for How It briefcases
const StepCard = ({ number, title, description }) => (
  <motion.div
    variants={popIn}
    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full flex flex-col justify-start" // Added shadow and flex-col
  >
    <Box sx={{
      bgcolor: 'primary.main', // Blue circle
      color: 'white',
      width: 48, // Slightly larger circle
      height: 48,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      mb: 3, // Increased margin bottom
      boxShadow: '0 4px 12px rgba(60,126,252,0.4)' // Blue shadow
    }}>
      {number}
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{title}</Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {description}
    </Typography>
  </motion.div>
);

// ----------------------------------------------------------
// Main Landing Page Component
// ----------------------------------------------------------

const LandingPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // For the headline text animation
  const headlineWords = ["A", "job", "portal", "designed", "for", "Impact"];

  // Simulated candidates data for search
  const candidates = [
    { name: "Alex Morgan", role: "Senior React Developer", skills: ["React", "TypeScript", "AWS", "Fintech"], match: 94 },
    { name: "Jordan Lee", role: "Full Stack Engineer", skills: ["Node.js", "React", "MongoDB", "Azure"], match: 89 },
    { name: "Taylor Smith", role: "UI/UX Designer", skills: ["Figma", "Adobe XD", "Sketch", "Design Systems"], match: 85 },
    { name: "Casey Johnson", role: "Product Manager", skills: ["Agile", "Jira", "User Research", "SaaS"], match: 82 },
     { name: "Riley Chen", role: "Data Scientist", skills: ["Python", "TensorFlow", "SQL", "Big Data"], match: 91 },
    { name: "Samira Khan", role: "DevOps Engineer", skills: ["AWS", "Docker", "Kubernetes", "CI/CD"], match: 88 },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, you'd filter/fetch candidates here
    setShowResults(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', color: 'text.primary', overflowX: 'hidden' }}>
        {/* 2. Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(60,126,252,0.1) 0%, rgba(255,255,255,0) 100%)', // Diagonal gradient overlay
            pt: { xs: 8, md: 16 },
            pb: { xs: 10, md: 16 },
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center" direction={isMobile ? 'column-reverse' : 'row'}> {/* Reverse on mobile */}
              <Grid item xs={12} md={6}>
                <Box sx={{ position: 'relative' }}>
                  {/* Headline */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: { xs: 1, md: 2 }, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                    {headlineWords.map((word, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30, rotateX: 90 }} // Added rotateX for 3D pop
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{
                          delay: index * 0.15, // Stagger delay
                          type: 'spring',
                          stiffness: 200, // Softer spring
                          damping: 10,
                          mass: 0.8 // Added mass
                        }}
                        style={{ marginRight: '12px', position: 'relative', transformOrigin: 'center bottom' }} // Transform origin for 3D
                      >
                        <Typography
                          variant="h2" // Adjusted variant based on size defined in sx
                          component="span"
                          sx={{
                            fontWeight: 'extrabold',
                            color: theme.typography.h2.color, // Use theme color
                             fontSize: 'inherit', // Inherit font size from parent motion.div
                            position: 'relative', // Needed for underline positioning
                            lineHeight: 1.2, // Adjust line height
                          }}
                        >
                          {word}
                          {word === 'Impact' && <UnderlineSVG />} {/* Underline only Impact */}
                        </Typography>
                      </motion.div>
                    ))}
                  </Box>

                  {/* Subhead */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer} // Use stagger for subhead lines
                  >
                    <motion.div variants={fadeIn}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: 'text.primary', // Use theme color
                          mb: 1,
                          fontWeight: 'normal',
                          fontSize: { xs: '1.2rem', md: '1.5rem' }
                        }}
                      >
                        Top talent and high-impact opportunities move fast.
                      </Typography>
                    </motion.div>

                    <motion.div variants={fadeIn}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: 'text.primary', // Use theme color
                          mb: 4,
                          fontWeight: 'normal',
                          fontSize: { xs: '1.2rem', md: '1.5rem' }
                        }}
                      >
                        Join the elite netbriefcase that leads the way.
                      </Typography>
                    </motion.div>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} // Simple fade/slide for buttons
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.5 }} // Adjusted delay
                  >
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                      <Button
                        variant="contained"
                         // Tailwind classes for padding and background (bg-blue-500 is similar to primary.main)
                        className="px-6 py-3" // Adjusted padding to be slightly larger
                        sx={{
                          bgcolor: 'primary.main', // Ensure MUI theme color is used
                          color: 'white',
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: 'primary.dark', // Darken on hover
                            transform: 'scale(1.05)', // Scale on hover
                            boxShadow: '0 0 20px rgba(60,126,252,0.5)', // Blue glow
                          }
                        }}
                      >
                        Find Your Next Role
                      </Button>
                      <Button
                        variant="outlined"
                        className="px-6 py-3" // Adjusted padding
                        sx={{
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          fontWeight: 600,
                          borderWidth: '2px', // Ensure thick border
                          '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderColor: 'primary.main', // Maintain border color consistency
                             boxShadow: '0 0 20px rgba(60,126,252,0.3)', // Subtle blue glow
                          }
                        }}
                      >
                        Post a Job
                      </Button>
                    </Box>
                  </motion.div>
                </Box>
              </Grid>

              {/* Hero Visual */}
              <Grid item xs={12} md={6}>
                <Suspense fallback={<Box sx={{ height: { xs: 300, md: 500 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>}> {/* Fallback for lazy loading */}
                  <LazyHeroVisual /> {/* Using the lazy-loaded component/placeholder */}
                </Suspense>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* 3. Section: AI-Powered Job Match */}
        <Box sx={{ bgcolor: '#F0F7FF', py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            {/* Title */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px 0px" }} // Trigger earlier
              variants={slideFromBottom} // Slide up
            >
              <Typography
                variant="h3"
                sx={{
                  textAlign: 'center',
                  mb: 2,
                  fontWeight: 'bold',
                   color: theme.typography.h3.color,
                }}
              >
                AI-Powered Job Recommendations
              </Typography>
            </motion.div>

            {/* Copy */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px 0px" }}
              variants={textReveal} // Simple fade for "typewriter" feel without character animation
            >
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  mb: 6,
                  fontWeight: 'normal',
                  fontStyle: 'italic', // Italic style
                   color: 'text.primary',
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                "Our AI decodes your skills, experience & aspirations—to surface roles you never knew existed."
              </Typography>
            </motion.div>

            {/* Feature Cards (Circular Icon Blocks) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px 0px" }}
              variants={staggerContainer}
            >
              <Grid container spacing={4} sx={{ mb: 8 }}>
                <Grid item xs={12} md={4}>
                   <FeatureBlock
                    icon={BarChart2} // ChartLine icon
                    title="Deep Skill Profiling"
                    description="Our AI analyzes your experience and skills to create a comprehensive profile that matches you with the perfect roles."
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FeatureBlock
                    icon={SlidersHorizontal} // SlidersHorizontal icon
                    title="Real-time Role Alerts"
                    description="Get instant notifications when new positions matching your unique profile are posted."
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FeatureBlock
                    icon={CheckCircle} // CheckCircle icon
                    title="Transparent Match Insights"
                    description="See exactly why you matched with each role and how to improve your chances."
                  />
                </Grid>
              </Grid>
            </motion.div>

            {/* Interactive Carousel */}
           
          </Container>
        </Box>

        {/* 4. Section: Recruiter’s Best-Fit Candidates */}
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center" direction={isMobile ? 'column-reverse' : 'row'}>
              {/* Visual / Image */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px 0px" }}
                  variants={fadeIn} // Fade in the image/visual
                  className="bg-gradient-to-br from-blue-500 to-green-400 rounded-3xl p-1" // Border gradient effect
                >
                  <Box
                    sx={{
                      bgcolor: 'white',
                      borderRadius: 5,
                      p: { xs: 2, md: 4 }, // Responsive padding
                      height: '100%',
                       minHeight: { xs: 400, md: 500 }, // Minimum height
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Placeholder for Recruiter Dashboard Visual */}
                     <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Top Candidate Shortlist</Typography>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>Search: Senior React Dev, Fintech, AWS</Typography>
                         <Box sx={{ display: 'flex', gap: 1 }}>
                             <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FF6B6B' }}></Box>
                             <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FFD166' }}></Box>
                             <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#06D6A0' }}></Box>
                         </Box>
                     </Box>

                    <Box sx={{ mb: 3, p: 2, bgcolor: '#F8F9FB', borderRadius: 2, border: '1px solid #E0E7FF' }}>
                         <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>AI Match Analysis</Typography>
                         <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                             Showing 5 candidates with {">"}80% match score. Ranked by Skill Fit and Culture Fit.
                         </Typography>
                        {/* Match Score Progress Bar */}
                         <Box sx={{ height: 8, bgcolor: '#E0E7FF', borderRadius: 3, mb: 1, overflow: 'hidden' }}>
                             <Box sx={{
                                 width: '85%', // Simulated average match score
                                 height: '100%',
                                 borderRadius: 3,
                                 background: 'linear-gradient(90deg, #3C7EFC 0%, #00C48C 100%)'
                             }}></Box>
                         </Box>
                         <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                             Overall Shortlist Match Confidence
                         </Typography>
                     </Box>

                     {/* Candidate List in Visual */}
                     <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}> {/* Added flexGrow and overflow for potential scrolling */}
                         {[
                             { name: "Alex Morgan", match: "94%", skills: ["React", "AWS", "Fintech"] },
                             { name: "Riley Chen", match: "91%", skills: ["React", "Python", "ML"] },
                             { name: "Samira Khan", match: "88%", skills: ["AWS", "Docker", "React"] },
                             { name: "Jordan Lee", match: "87%", skills: ["React", "Node", "MongoDB"] },
                             { name: "Casey Johnson", match: "82%", skills: ["React", "Product", "Agile"] },
                         ].map((candidate, idx) => (
                             <Box
                                 key={idx}
                                 sx={{
                                     display: 'flex',
                                     justifyContent: 'space-between',
                                     alignItems: 'center', // Vertically align
                                     p: 2,
                                     mb: 2, // Spacing between items
                                     borderRadius: 2,
                                     bgcolor: idx === 0 ? '#F0F7FF' : 'transparent', // Highlight top match
                                     border: '1px solid',
                                     borderColor: idx === 0 ? '#E0E7FF' : 'transparent',
                                 }}
                             >
                                 <Box>
                                     <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{candidate.name}</Typography> {/* subtitle1 for names */}
                                     <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                                         {candidate.skills.map((skill, i) => (
                                             <Box
                                                 key={i}
                                                 sx={{
                                                     bgcolor: '#E8F0FE', // Lighter blue tag
                                                     color: 'primary.main',
                                                     px: 0.8, // Smaller padding for tags
                                                     py: 0.1,
                                                     borderRadius: 1,
                                                     fontSize: '0.65rem', // Smaller font size
                                                     fontWeight: 500,
                                                 }}
                                             >
                                                 {skill}
                                             </Box>
                                         ))}
                                     </Box>
                                 </Box>
                                 <Box sx={{
                                     bgcolor: idx === 0 ? 'secondary.main' : '#E0E7FF', // Green for top match, gray for others
                                     color: idx === 0 ? 'white' : 'text.primary',
                                     px: 1.5,
                                     py: 0.5,
                                     borderRadius: 5,
                                     fontSize: '0.9rem', // Slightly larger match percentage
                                     fontWeight: 'bold',
                                     height: 'fit-content',
                                     minWidth: 60,
                                     textAlign: 'center'
                                 }}>
                                     {candidate.match}
                                 </Box>
                             </Box>
                         ))}
                     </Box>
                  </Box>
                </motion.div>
              </Grid>

              {/* Text Content */}
              <Grid item xs={12} md={6}>
                {/* Title */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px 0px" }}
                  variants={slideFromRight} // Slide in from right
                >
                  <Typography
                    variant="h3"
                    sx={{
                      mb: 2,
                      fontWeight: 'bold',
                       color: theme.typography.h3.color,
                    }}
                  >
                    AI-Driven Best-Fit Candidates
                  </Typography>
                </motion.div>

                {/* Copy */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px 0px" }}
                  variants={fadeIn} // Fade in
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 4,
                      fontWeight: 'normal',
                      color: 'text.primary'
                    }}
                  >
                    Stop endless scrolling—our AI ranks talent by skill, cultural fit, and availability so you hire smarter, faster, fairer.
                  </Typography>
                </motion.div>

                {/* Feature Grid */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px 0px" }}
                  variants={staggerContainer}
                >
                  <Grid container spacing={4}> {/* Increased spacing */}
                     {/* Feature 1: Skill Match Score */}
                    <Grid item xs={12} sm={6} md={4}> {/* Adjusted grid for 3 items */}
                       <FeatureBlock
                           icon={ChartLine} // Using ChartLine for Skill Match
                           title="Skill Match Score"
                           description="AI-powered analysis of candidate skills against job requirements for precise matching."
                       />
                    </Grid>

                     {/* Feature 2: Culture-Fit Predictor */}
                    <Grid item xs={12} sm={6} md={4}>
                      <FeatureBlock
                        icon={MessageSquare} // Using MessageSquare for Culture Fit
                        title="Culture-Fit Predictor"
                        description="Evaluates candidate values and briefcase style preferences for team alignment."
                      />
                    </Grid>

                     {/* Feature 3: Rapid Time-to-Hire */}
                    <Grid item xs={12} sm={6} md={4}>
                      <FeatureBlock
                        icon={SlidersHorizontal} // Using SlidersHorizontal for process/speed
                        title="Rapid Time-to-Hire"
                        description="Streamlined hiring process cuts average fill time significantly."
                      />
                    </Grid>
                  </Grid>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* 5. Section: Natural-Language Resume Search */}
        <Box sx={{ bgcolor: '#F8F9FB', py: { xs: 8, md: 12 } }}> {/* Changed background slightly */}
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6, position: 'relative' }}>
              {/* Title with Underline */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px 0px" }}
                variants={fadeIn}
              >
                <Typography
                  variant="h3"
                  sx={{
                    mb: 1,
                    fontWeight: 'bold',
                    position: 'relative', // Needed for underline
                    display: 'inline-block', // Contain underline to text width
                    color: theme.typography.h3.color,
                  }}
                >
                  Search 100K+ Resumes with a Prompt
                  {/* Underline Animation */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "0px 0px -50px 0px" }} // Trigger when title is fully visible
                    transition={{ duration: 0.8, delay: 0.3 }} // Adjusted delay
                    style={{
                      position: 'absolute',
                      bottom: -5,
                      left: 0,
                      right: 0,
                      height: 4, // Thicker line
                      background: 'linear-gradient(90deg, #3C7EFC 0%, #00C48C 100%)', // Gradient line
                      transformOrigin: 'left',
                    }}
                  />
                </Typography>
              </motion.div>

              {/* Copy */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px 0px" }}
                variants={fadeIn} // Fade in
              >
                <Typography
                  variant="h6"
                  sx={{
                    maxWidth: 800,
                    mx: 'auto',
                    fontWeight: 'normal',
                    color: 'text.primary',
                    mt: 2, // Added margin top
                  }}
                >
                  Just type: 'Senior React dev, fintech background, AWS expert'—and get ranked candidates instantly.
                </Typography>
              </motion.div>
            </Box>

            {/* Search UI */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px 0px" }}
              variants={fadeIn} // Fade in the search bar
            >
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  maxWidth: 800,
                  mx: 'auto',
                  mb: 6,
                  display: 'flex', // Use flex for textfield and button alignment
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 1 } // Added gap
                }}
              >
                <TextField
                  fullWidth // Allow TextField to take full width
                  placeholder="Describe the perfect candidate..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{
                    startAdornment: <Search style={{ color: theme.palette.primary.main, marginRight: 8 }} size={20} />,
                     // sx styling for InputProps is handled by the component styleOverrides
                  }}
                   // sx styling for the TextField root is handled by the component styleOverrides
                />
                 <Button
                   type="submit"
                   variant="contained"
                   className="px-6 py-3" // Tailwind padding
                   sx={{
                     minWidth: { sm: 150 }, // Minimum width for button on desktop
                     bgcolor: 'primary.main',
                     color: 'white',
                     fontWeight: 600,
                     '&:hover': {
                       bgcolor: 'primary.dark',
                     },
                   }}
                 >
                   Find Candidates
                 </Button>
              </Box>
            </motion.div>

            {/* Candidate Results Grid */}
            <AnimatePresence> {/* Use AnimatePresence for exit animation if needed */}
              {showResults && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden" // Exit animation
                  variants={staggerContainer} // Stagger animation for the grid items
                >
                  <Typography
                    variant="h5" // Slightly larger title
                    sx={{
                      mb: 3,
                      fontWeight: 'bold',
                       color: theme.typography.h5.color,
                    }}
                  >
                    Top Matches ({candidates.length})
                  </Typography>

                  <Grid container spacing={3}> {/* Spacing between cards */}
                    {candidates.map((candidate, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}> {/* Responsive grid: 1/3 on md, 1/2 on sm, full on xs */}
                        <CandidateCard {...candidate} />
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              )}
            </AnimatePresence>
          </Container>
        </Box>

        {/* 6. Section: How It briefcases – Dual-Tab briefcaseflow */}
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              {/* Title */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px 0px" }}
                variants={fadeIn}
              >
                <Typography
                  variant="h3"
                  sx={{
                    mb: 2,
                    fontWeight: 'bold',
                     color: theme.typography.h3.color,
                  }}
                >
                  How It briefcases
                </Typography>
              </motion.div>

              {/* Copy */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px 0px" }}
                variants={fadeIn}
              >
                <Typography
                  variant="h6"
                  sx={{
                    maxWidth: 800,
                    mx: 'auto',
                    fontWeight: 'normal',
                    color: 'text.primary',
                    mb: 4
                  }}
                >
                  We've optimized the experience for both job seekers and employers.
                </Typography>
              </motion.div>

              {/* Tabs */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}> {/* Increased margin bottom */}
                <Box
                  sx={{
                    borderRadius: 10, // Pill shape container
                    bgcolor: '#E0E7FF', // Light background for tabs
                    p: 0.5, // Padding around tabs
                    display: 'inline-flex',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)' // Subtle shadow
                  }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    // Indicator is hidden via MuiTabs styleOverrides in theme
                  >
                    <Tab
                      label="Candidate"
                      sx={{
                        bgcolor: tabValue === 0 ? 'primary.main' : 'transparent', // Blue when active
                        color: tabValue === 0 ? 'white' : 'text.primary', // White text when active
                        '&.Mui-selected': { // Explicitly target selected state
                            color: 'white',
                            // Optional: Active tab glow/scale using sx transitions or motion.div
                            // For simplicity, let's rely on MUI + CSS transition defined in theme
                             boxShadow: tabValue === 0 ? '0 4px 12px rgba(60,126,252,0.4)' : 'none', // Add shadow to active tab
                        },
                        '&:hover': {
                           color: tabValue === 0 ? 'white' : 'primary.main', // Color change on hover
                        }
                      }}
                    />
                    <Tab
                      label="Recruiter"
                       sx={{
                        bgcolor: tabValue === 1 ? 'primary.main' : 'transparent',
                        color: tabValue === 1 ? 'white' : 'text.primary',
                         '&.Mui-selected': {
                             color: 'white',
                            boxShadow: tabValue === 1 ? '0 4px 12px rgba(60,126,252,0.4)' : 'none',
                         },
                         '&:hover': {
                           color: tabValue === 1 ? 'white' : 'primary.main',
                         }
                       }}
                    />
                  </Tabs>
                </Box>
              </Box>
            </Box>

            {/* Tab Content */}
            <AnimatePresence mode="wait"> {/* AnimatePresence for cross-fade */}
              <motion.div
                key={tabValue} // Key changes to trigger animation on tab switch
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {tabValue === 0 ? (
                  // Candidate Flow
                  <Box sx={{ position: 'relative' }}>
                    {/* Connecting Lines - positioned within the Box */}
                     {/* Line 1: Card 1 to Card 2 */}
                    <Box sx={{ position: 'absolute', width: 'calc(100% / 3 * 1)', left: 'calc(100% / 3 * 0.5)', top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}>
                         <ConnectingLine />
                    </Box>
                     {/* Line 2: Card 2 to Card 3 */}
                    <Box sx={{ position: 'absolute', width: 'calc(100% / 3 * 1)', left: 'calc(100% / 3 * 1.5)', top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}>
                         <ConnectingLine />
                    </Box>

                    <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}> {/* Grid for step cards */}
                      <Grid item xs={12} md={4}>
                         <StepCard
                          number={1}
                          title="Profile Creation"
                          description="Create your profile once and let our AI extract your skills, experience, and career goals."
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <StepCard
                          number={2}
                          title="Daily Matches"
                          description="Receive personalized job recommendations based on your unique profile and preferences."
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <StepCard
                          number={3}
                          title="Apply & Track"
                          description="Apply with one click and track your application status in real-time."
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  // Recruiter Flow
                  <Box sx={{ position: 'relative' }}>
                     {/* Connecting Lines (mirrored positioning) */}
                    <Box sx={{ position: 'absolute', width: 'calc(100% / 3 * 1)', left: 'calc(100% / 3 * 0.5)', top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}>
                         <ConnectingLine />
                    </Box>
                    <Box sx={{ position: 'absolute', width: 'calc(100% / 3 * 1)', left: 'calc(100% / 3 * 1.5)', top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}>
                         <ConnectingLine />
                    </Box>

                    <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}> {/* Grid for step cards */}
                      <Grid item xs={12} md={4}>
                        <StepCard
                          number={1}
                          title="Post Role"
                          description="Define your job requirements and company culture to find the perfect match."
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <StepCard
                          number={2}
                          title="AI Curation"
                          description="Our AI ranks candidates by skills, experience, and cultural fit to create your shortlist."
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <StepCard
                          number={3}
                          title="Engage & Hire"
                          description="Connect directly with candidates, schedule interviews, and make offers—all in one platform."
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </motion.div>
            </AnimatePresence>
          </Container>
        </Box>

        {/* 7. Final CTA */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #3C7EFC 0%, #5A6378 100%)', // Gradient background
            py: { xs: 8, md: 12 },
            color: 'white', // White text on dark background
            textAlign: 'center'
          }}
        >
          <Container maxWidth="md">
            {/* Headline */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px 0px" }}
              variants={bounceIn} // Bounce in animation
            >
              <Typography
                variant="h3"
                sx={{
                  mb: 4,
                  fontWeight: 'bold',
                   color: 'white', // Ensure white text on this background
                }}
              >
                Ready to transform how you find jobs—or hires?
              </Typography>
            </motion.div>

            {/* Button */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px 0px" }}
              variants={fadeIn} // Simple fade in for button
               whileHover={{
                 scale: 1.05, // Scale effect
                // Pulse/Glow effect using filter and transition
                 filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
                 transition: {
                   duration: 0.3,
                   repeat: Infinity, // Pulse animation
                   repeatType: "reverse", // Reverse direction
                   ease: "easeInOut",
                   delay: 0.1 // Start pulse after initial scale
                 }
               }}
                transition={{ duration: 0.5 }} // Initial fade transition
            >
              <Button
                variant="contained"
                size="large"
                className="px-10 py-3" // Large padding
                sx={{
                  fontSize: { xs: '1rem', md: '1.4rem' }, // Responsive font size
                  bgcolor: 'white', // White background
                  color: 'primary.main', // Blue text
                  fontWeight: 600,
                  borderRadius: 50, // Pill shape
                   // Default shadow removed by global button style
                   // Hover glow added via motion whileHover
                }}
              >
                Get Started Free
              </Button>
            </motion.div>
          </Container>
        </Box>

      

      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;