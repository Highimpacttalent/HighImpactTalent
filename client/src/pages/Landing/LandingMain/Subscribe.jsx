import React, { useState } from "react";
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
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const [email, setEmail] = useState('');
  const [hover, setHover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('EMAIL', email);
      formData.append('email_address_check', '');
      formData.append('locale', 'en');

      const response = await fetch(
        'https://feb3b4bd.sibforms.com/serve/MUIFADuynwjYKMzhbXR3lcod0vsaRiXf1dgp7Ouf4wUS__zbtLywaZJKl9DerZ4S_coIR9xQkcb25NCCSZTNhRisYs27VALmXZEYYzkHRpFapr4Xe7slq6ir4su2gTeOxUKba0yb5rXHeh7xzh1y3G4_01O6C0OM6eQib8BqvZ7jlAIbZ88R5mFEItYw0P68AcTcwMIz-gDk9jJO?isAjax=1',
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Thank you for joining');
        setEmail('');
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
      } else {
        setSuccessMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setSuccessMessage('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Stay Ahead of the
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
                  Career Curve
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
                Join 25,000+ professionals who get exclusive career insights,
                job opportunities, and industry trends delivered weekly.
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
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 3,
                    p: 1,
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
                        <InputAdornment position="start">
                          <MailOutlineIcon color="action" />
                        </InputAdornment>
                      ),
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
                      py: 1.5,
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
                  >
                    <Box textAlign={{ xs: "center", sm: "left" }}>
                      <Typography
                        fontFamily="Satoshi, sans-serif"
                        color="text.secondary"
                      >
                        <Box
                          component="span"
                          fontWeight={700}
                          color="text.primary"
                        >
                          25,000+
                        </Box>{" "}
                        professionals already joined
                      </Typography>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={{ xs: "center", sm: "flex-start" }}
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
