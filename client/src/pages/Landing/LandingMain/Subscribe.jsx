import React, { useState,useEffect } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Snackbar, Alert } from "@mui/material";

const PremiumSubscribeSection = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("md"));
  const [email, setEmail] = useState("");
  const [hover, setHover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userCount, setUserCount] = useState(null);
    const [countLoading, setCountLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("EMAIL", email);
      formData.append("email_address_check", "");
      formData.append("locale", "en");

      const response = await fetch(
        "https://feb3b4bd.sibforms.com/serve/MUIFADuynwjYKMzhbXR3lcod0vsaRiXf1dgp7Ouf4wUS__zbtLywaZJKl9DerZ4S_coIR9xQkcb25NCCSZTNhRisYs27VALmXZEYYzkHRpFapr4Xe7slq6ir4su2gTeOxUKba0yb5rXHeh7xzh1y3G4_01O6C0OM6eQib8BqvZ7jlAIbZ88R5mFEItYw0P68AcTcwMIz-gDk9jJO?isAjax=1",
        { method: "POST", body: formData }
      );

      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Thank you for joining");
        setEmail("");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setSuccessMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setSuccessMessage("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
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
  
          // Try to extract an integer in a few common shapes
          let total = null;
          if (data == null) {
            total = null;
          } else if (typeof data === "number") {
            total = data;
          } else if (typeof data.totalUsers === "number") {
            total = data.totalUsers;
          } else if (typeof data.count === "number") {
            total = data.count;
          } else if (typeof data.total === "number") {
            total = data.total;
          } else if (Array.isArray(data)) {
            total = data.length;
          } else if (Array.isArray(data.data)) {
            total = data.data.length;
          } else if (typeof data.data === "number") {
            total = data.data;
          }
  
          if (isMounted && typeof total === "number" && !isNaN(total)) {
            // round down to nearest 100 (2579 -> 2500)
            const rounded = Math.floor(total / 100) * 100;
            setUserCount(rounded);
          } else if (isMounted) {
            // couldn't parse, set null so UI uses fallback
            setUserCount(null);
          }
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
    <Box sx={{ width: "100%", bgcolor: "background.default", py: 6, px: 2 }}>
      <Container maxWidth="lg">
        <Card
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
            border: `1px solid ${theme.palette.grey[100]}`,
            boxShadow: `0 4px 20px ${theme.palette.primary.main}20`,
          }}
        >
          {/* Background Patterns */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.3,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -100,
                left: -100,
                width: 400,
                height: 400,
                bgcolor: theme.palette.primary.light,
                backgroundImage:
                  "radial-gradient(circle at top left, transparent, transparent)",
                borderRadius: "50%",
                filter: "blur(100px)",
                transform: "translate(-50%, -50%)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -100,
                right: -100,
                width: 400,
                height: 400,
                bgcolor: theme.palette.primary.light,
                backgroundImage:
                  "radial-gradient(circle at bottom right, transparent, transparent)",
                borderRadius: "50%",
                filter: "blur(100px)",
                transform: "translate(50%, 50%)",
              }}
            />
          </Box>

          <CardContent
            sx={{
              position: "relative",
              zIndex: 1,
              px: { xs: 3, md: 8 },
              py: { xs: 6, md: 10 },
            }}
          >
            <Box textAlign="center">
              {/* Heading */}
              <Typography
                variant={isSm ? "h4" : "h2"}
                fontFamily="Satoshi, sans-serif"
                fontWeight={600}
                mb={2}
              >
                Stay Ahead.
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    background: "linear-gradient(to right, #1e40af, #1e3a8a)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    fontWeight: 600,
                    fontFamily: "Satoshi, sans-serif",
                  }}
                >
                  Stay Wanted.
                </Box>
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h6"
                fontFamily="Satoshi, sans-serif"
                color="text.secondary"
                fontSize={{ xs: "1rem", md: "1.25rem" }}
                mb={4}
              >
                Join {countLoading ? "..." : userCount ? `${userCount}+` : "2500+"} ambitious professionals getting handpicked job
                drops, market moves, and no-fluff career advice—every week.
              </Typography>

              {/* Subscribe Form */}
              <Box maxWidth={400} mx="auto">
                {successMessage && (
                  <Typography
                    variant="body1"
                    align="center"
                    color="success.main"
                    mb={2}
                  >
                    {successMessage}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    mt: 5, // optional top margin
                  }}
                >
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                      p: 2,
                      maxWidth: 500,
                      width: "100%",
                      bgcolor: "grey.50",
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.grey[200]}`,
                      transition: "all 0.3s",
                      "&:focus-within": {
                        bgcolor: "background.paper",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 0 }}>
                            <MailOutlineIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          justifyContent: "center", // center icon and input text
                        },
                        "& input": {
                          textAlign: "center",
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                      sx={{
                        whiteSpace: "nowrap",
                        textTransform: "none",
                        px: 4,
                        backgroundImage:
                          "linear-gradient(to right, #1e40af, #1e3a8a)",
                        boxShadow: hover
                          ? `0 8px 16px ${theme.palette.primary.main}40`
                          : "none",
                        transform: hover ? "scale(1.05)" : "none",
                        transition: "all 0.3s",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Subscribe
                    </Button>
                  </Box>
                </Box>

                {/* Trust Indicators */}
                <Stack
                  direction="row"
                  spacing={4}
                  justifyContent="center"
                  color="text.secondary"
                  fontSize="0.875rem"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleOutlineIcon color="success" fontSize="small" />
                    <Typography fontFamily="Satoshi, sans-serif">
                      No spam
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleOutlineIcon color="success" fontSize="small" />
                    <Typography fontFamily="Satoshi, sans-serif">
                      No fluff
                    </Typography>
                  </Stack>
                </Stack>

                {/* Social Proof */}
                <Box
                  mt={6}
                  pt={4}
                  borderTop={`1px solid ${theme.palette.grey[100]}`}
                >
                 <Box
  display="flex"
  flexDirection={{ xs: "column", sm: "row" }}
  alignItems="center"
  justifyContent="center"
  gap={4}
  textAlign="center" // Default to center for all content
  width="100%"
>
  <Box textAlign={{ xs: "center", sm: "center" }} maxWidth={400}>
    <Typography fontFamily="Satoshi, sans-serif" color="text.secondary">
      <Box component="span" fontWeight={700} color="text.primary">
        {countLoading ? "..." : userCount ? `${userCount}+` : "2500+"}
      </Box>{" "}
      professionals already joined
    </Typography>

    <Box
      display="flex"
      alignItems="center"
      justifyContent="center" // Always center the stars row
      gap={0.5}
      mt={0.5}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Typography key={i} fontSize="1rem" color="#facc15">
          ★
        </Typography>
      ))}
      <Typography
        fontFamily="Satoshi, sans-serif"
        fontSize="0.875rem"
        color="text.secondary"
        ml={0.5}
      >
        4.9/5 rating
      </Typography>
    </Box>
  </Box>
</Box>

                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PremiumSubscribeSection;
