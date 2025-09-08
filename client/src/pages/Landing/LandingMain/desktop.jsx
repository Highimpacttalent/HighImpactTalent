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
import { CheckCircle, Mail, ArrowRight } from "lucide-react";
import Bottom from "../../../assets/Landing/Bottom.svg";
import PremiumSubscribeSection from "./Subscribe";
import Landing from "../../../assets/Landing/Landing.svg";

// Minimal animation hook for subtle effects
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.2,
        ...options,
      }
    );

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
        transform: isInView ? "translateY(0px)" : "translateY(20px)",
        opacity: isInView ? 1 : 0,
        transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

function useSmoothNumber(to, { duration = 900 } = {}) {
  const [value, setValue] = React.useState(
    typeof to === "number" ? Math.round(to) : 0
  );
  const rafRef = React.useRef(null);
  const startRef = React.useRef(null);
  const fromRef = React.useRef(value);

  React.useEffect(() => {
    if (typeof to !== "number" || isNaN(to)) {
      setValue(0);
      fromRef.current = 0;
      return;
    }
    cancelAnimationFrame(rafRef.current);
    const from = fromRef.current ?? 0;
    const diff = to - from;
    if (diff === 0) {
      setValue(Math.round(to));
      fromRef.current = Math.round(to);
      return;
    }
    startRef.current = null;
    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - (1 - t) * (1 - t); // easeOutQuad
      const current = Math.round(from + diff * eased);
      setValue(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = Math.round(to);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, duration]);

  return value;
}

// Small live stat display (keeps original look — h4 + body2)
function LiveStat({ target, fallbackText, label, loading, bigNumber }) {
  const animated = useSmoothNumber(typeof target === "number" ? target : 0, {
    duration: "2000",
  });
  const displayText = loading
    ? "..."
    : typeof target === "number"
    ? animated.toLocaleString()
    : fallbackText;
  const [pop, setPop] = React.useState(false);

  React.useEffect(() => {
    if (loading) return;
    setPop(true);
    const t = setTimeout(() => setPop(false), 250);
    return () => clearTimeout(t);
  }, [animated, loading]);

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          color: "#22223B",
          fontSize: bigNumber
            ? { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" }
            : { xs: "2.1rem", sm: "2.5rem" },
          lineHeight: 1.13,
          fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: "-0.01em",
          transition: "transform 160ms cubic-bezier(.2,.9,.2,1)",
          transform: pop ? "scale(1.07)" : "scale(1)",
          mb: bigNumber ? 0.5 : 0,
        }}
      >
        {displayText}{" "}
      </Typography>
      {!!label && (
        <Typography
          sx={{
            color: "#64748b",
            fontFamily: "Poppins, sans-serif",
            fontSize: "1rem",
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
}

const DesktopLanding = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userCount, setUserCount] = useState(null);
  const [countLoading, setCountLoading] = useState(true);

  const handleClick = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/find-jobs");
    } else {
      navigate("/u-login");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleClickRec = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/view-jobs");
    } else {
      navigate("/r-login");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      setIsOpen(true);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribing:", email);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserCount = async () => {
      setCountLoading(true);
      try {
        const res = await fetch(
          "https://highimpacttalent.onrender.com/api-v1/user/rounded-user-count"
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        setUserCount(data.totalUsers);
      } catch (err) {
        console.error("Error fetching user count:", err);
        if (isMounted) setUserCount(null);
      } finally {
        if (isMounted) setCountLoading(false);
      }
    };

    fetchUserCount();

    // clean up
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fafafa",
        overflow: "hidden",
        px: 2,
      }}
    >
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          bgcolor: "#ffffff",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(60, 126, 252, 0.02) 0%, rgba(27, 165, 234, 0.02) 100%)",
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={8} alignItems="center">
            {/* Left Column - Content */}
            <Grid item xs={12} md={6}>
              <AnimatedSection delay={0}>
                <Box sx={{ maxWidth: 600 }}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { md: "2.5rem", lg: "2.5rem" },
                      fontWeight: 700,
                      fontFamily:
                        "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif",
                      lineHeight: 1.1,
                      color: "#0a0a0a",
                      mb: 3,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Where the{" "}
                    <Box
                      component="span"
                      sx={{
                        fontSize: { md: "2.5rem", lg: "2.5rem" },
                        fontWeight: 700,
                        fontFamily:
                          "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif",
                        lineHeight: 1.1,
                        color: "#0a0a0a",
                        mb: 3,
                        letterSpacing: "-0.02em",
                        background:
                          "linear-gradient(135deg, #3C7EFC 0%, #1BA5EA 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {" "}
                      Right talent
                    </Box>{" "}
                    meets the{" "}
                    <Box
                      component="span"
                      sx={{
                        fontSize: { md: "2.5rem", lg: "2.5rem" },
                        fontWeight: 700,
                        fontFamily:
                          "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif",
                        lineHeight: 1.1,
                        color: "#0a0a0a",
                        mb: 3,
                        letterSpacing: "-0.02em",
                        background:
                          "linear-gradient(135deg, #3C7EFC 0%, #1BA5EA 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Right roles
                    </Box>{" "}
                    Fast.
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: "1.1rem",
                      fontFamily: "Poppins, sans-serif",
                      color: "#64748b",
                      mb: 5,
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    Whether you're hiring or job hunting, we get you to the
                    shortlist faster with AI, insight, and a human touch.
                  </Typography>

                  <Stack direction="row" spacing={3} sx={{ mb: 6 }}>
                    <Button
                      variant="contained"
                      onClick={handleClick}
                      size="large"
                      sx={{
                        bgcolor: "#3C7EFC",
                        px: 4,
                        py: 1.5,
                        borderRadius: "12px",
                        fontFamily: "Poppins",
                        fontSize: "1rem",
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 2px 12px rgba(60, 126, 252, 0.15)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          bgcolor: "#2563eb",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 30px rgba(60, 126, 252, 0.4)",
                        },
                      }}
                    >
                      Start My Job Search
                    </Button>

                    <Button
                      variant="contained"
                      onClick={handleClickRec}
                      size="large"
                      sx={{
                        bgcolor: "#10B981", // Emerald green for recruiters
                        px: 4,
                        py: 1.5,
                        borderRadius: "12px",
                        fontFamily: "Poppins",
                        fontSize: "1rem",
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 2px 12px rgba(16, 185, 129, 0.15)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          bgcolor: "#059669",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 30px rgba(16, 185, 129, 0.4)",
                        },
                      }}
                    >
                      Hire Top Talent
                    </Button>

                    <Button
                      variant="contained"
                      component="a"
                      href="https://calendly.com/koustubhharidas"
                      target="_blank"
                      rel="noopener noreferrer"
                      size="large"
                      sx={{
                        background:
                          "linear-gradient(135deg, #059669 0%, #047857 100%)",
                        color: "white",
                        px: 4,
                        py: 1.5,
                        borderRadius: "12px",
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 2px 10px rgba(252, 211, 77, 0.2)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #047857 0%, #065f46 100%)",
                          boxShadow: "0 8px 24px rgba(252, 211, 77, 0.35)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Book 1-1 Hiring Strategy Call
                    </Button>
                  </Stack>
                </Box>
              </AnimatedSection>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: { xs: "260px", md: "460px" },
                py: { xs: 3, md: 0 },
              }}
            >
              <AnimatedSection delay={200}>
                <Box
                  sx={{
                    width: { xs: "100%", sm: 360, md: 410 },
                    bgcolor: "#fff",
                    borderRadius: "32px",
                    boxShadow: "0 8px 40px rgba(0,20,60,0.08)",
                    px: { xs: 3, sm: 6, md: 8 },
                    py: { xs: 4, sm: 6, md: 8 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {/* Optional: Subtitle */}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontFamily: "Poppins",
                      color: "#3C7EFC",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      fontSize: "0.92rem",
                      mb: 2,
                    }}
                  >
                    TRUSTED BY PROFESSIONALS
                  </Typography>

                  {/* LIVE COUNTER */}
                  <LiveStat
                    target={userCount}
                    fallbackText={"2,500+"}
                    label={null}
                    loading={countLoading}
                    /* Add bigNumber prop to control style */
                    bigNumber
                  />

                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#374151",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      mt: 1,
                      fontSize: { xs: "1.18rem", md: "1.28rem" },
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Professionals Onboarded
                  </Typography>

                  {/* Divider */}
                  <Box
                    sx={{
                      height: 1,
                      width: "54%",
                      bgcolor: "#EEF2F6",
                      my: 3,
                    }}
                  />
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
          bgcolor: "#f8fafc",
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
                      bgcolor: "#f0f9ff",
                      color: "#0284c7",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      borderRadius: "50px",
                      border: "1px solid #e0f2fe",
                      fontStyle: "bold",
                    }}
                  />

                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { md: "2.5rem", lg: "2.5rem" },
                      fontWeight: 600,
                      fontFamily: "Satoshi",
                      lineHeight: 1.2,
                      color: "#0a0a0a",
                      mb: 4,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Find candidates{" "}
                    <Box
                      component="span"
                      sx={{ color: "#1BA5EA", fontWeight: 700 }}
                    >
                      you won’t want to lose.
                    </Box>
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1.125rem",
                      fontFamily: "Poppins",
                      color: "#64748b",
                      mb: 4,
                      lineHeight: 1.7,
                    }}
                  >
                    No more CV flood. No more guesswork. Just sharp,
                    high-retention talent vetted for skill and culture fit.
                  </Typography>

                  <Stack spacing={3}>
                    {[
                      "AI-driven resume screening (zero noise)",
                      "Culture-fit insights (beyond keywords)",
                      "Industry ready shortlist in required time",
                    ].map((feature, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <CheckCircle size={20} color="#10b981" />
                        <Typography
                          sx={{ color: "#374151", fontFamily: "Poppins" }}
                        >
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={Comp3}
                    alt="Platform interface"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      maxHeight: "400px",
                      filter: "drop-shadow(0 30px 80px rgba(0, 0, 0, 0.12))",
                      borderRadius: "16px",
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
          bgcolor: "#ffffff",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={10} alignItems="center">
            <Grid item xs={12} md={6}>
              <AnimatedSection>
                <Box sx={{ position: "relative" }}>
                  <img
                    src={Comp1}
                    alt="Job matching platform"
                    style={{
                      width: "100%",
                      height: "auto",
                      filter: "drop-shadow(0 20px 60px rgba(0, 0, 0, 0.08))",
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
                      bgcolor: "#eff6ff",
                      color: "#2563eb",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      borderRadius: "50px",
                      border: "1px solid #dbeafe",
                      fontStyle: "bold",
                    }}
                  />

                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { md: "2.5rem", lg: "2.5rem" },
                      fontWeight: 600,
                      fontFamily: "Satoshi",
                      lineHeight: 1.2,
                      color: "#0a0a0a",
                      mb: 4,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Your career deserves better{" "}
                    <Box
                      component="span"
                      sx={{ color: "#3C7EFC", fontWeight: 700 }}
                    >
                      than job boards.
                    </Box>
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1.1rem",
                      fontFamily: "Poppins",
                      color: "#64748b",
                      mb: 4,
                      lineHeight: 1.7,
                    }}
                  >
                    We don’t just parse your resume—we understand your story.
                    Our AI matches you to roles that respect your ambition and
                    skip the fluff.
                  </Typography>

                  <Stack spacing={3}>
                    {[
                      "Hyper-personalized job matches",
                      "Real-time application tracking (and no ghosting)",
                    ].map((feature, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <CheckCircle size={20} color="#10b981" />
                        <Typography
                          sx={{ color: "#374151", fontFamily: "Poppins" }}
                        >
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
