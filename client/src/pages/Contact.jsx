import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Modal,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    centerPadding: "15%",
    arrows: false,
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("https://highimpacttalent.onrender.com/api-v1/sendmail/contactus", formData);
      if (response.data.success) {
        setShowModal(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hide modal after 2 seconds
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => setShowModal(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", py: 8, px: 4 }}>
      <Box sx={{ maxWidth: "1300px", width: "100%" }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Get in Touch with High Impact Talent
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Have questions? Need support? We're here to help.
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
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
                  <Box key={index} sx={{ display: "flex", justifyContent: "center" }}>
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
              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Name" name="name" variant="outlined" fullWidth required onChange={handleChange} value={formData.name} />
                <TextField label="Email Address" name="email" type="email" variant="outlined" fullWidth required onChange={handleChange} value={formData.email} />
                <TextField label="Message" name="message" variant="outlined" fullWidth multiline rows={4} required onChange={handleChange} value={formData.message} />
                
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 2, borderRadius: "25px", fontWeight: "bold" }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Send Message"}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Success Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box
          sx={{
            backgroundColor: "#fff",
            p: 4,
            borderRadius: 3,
            boxShadow: 24,
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          <Typography variant="h6" color="primary" fontWeight="bold">
            Message Sent Successfully!
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default Contact;
