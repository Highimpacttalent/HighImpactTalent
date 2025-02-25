import React from "react";
import { Box, Typography, Grid, Paper, TextField, Button, Divider } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Contact = () => {
  const linkedinProfiles = [
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7253389464947892225",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7221837885979672576",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7224095613582213121",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7249773333687197696",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7255831803842748416",
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: "15%", // Allows visibility of next & previous posts
    arrows: false,
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", py: 8, px: 4 }}>
      <Box sx={{ maxWidth: "1300px", width: "100%" }}>
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Get in Touch with High Impact Talent
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Have questions? Need support? We're here to help.
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {/* LinkedIn Carousel Section */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "#f9f9f9",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
                Connect with Us on LinkedIn
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Slider {...settings}>
                {linkedinProfiles.map((link, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <iframe
                      src={link}
                      width="100%"
                      height="350"
                      style={{
                        border: "none",
                        borderRadius: "10px",
                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                      }}
                      allowFullScreen
                    ></iframe>
                  </Box>
                ))}
              </Slider>
            </Paper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
                Send Us a Message
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Name" variant="outlined" fullWidth required />
                <TextField label="Email Address" type="email" variant="outlined" fullWidth required />
                <TextField label="Message" variant="outlined" fullWidth multiline rows={4} required />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 2, borderRadius: "25px", fontWeight: "bold" }}
                >
                  Send Message
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Contact;
