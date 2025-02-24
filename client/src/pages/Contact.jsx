import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", py: 8, px: 4 }}>
      <Box sx={{ maxWidth: "1200px", width: "100%" }}>
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Get in Touch with High Impact Talent
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Have questions? Need support? We're here to help.
          </Typography>
        </Box>

        {/* Contact Section */}
        <Grid container spacing={4}>
          {/* Contact Info & Socials */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                Contact Information
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FaEnvelope color="#1176DB" /> highimpacttalentenquiry@gmail.com
              </Typography>

              {/* Social Links */}
              <Typography variant="body1" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                Connect with us:
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <IconButton href="https://facebook.com" target="_blank" sx={{ color: "#3b5998" }}>
                  <FaFacebook size={24} />
                </IconButton>
                <IconButton href="https://twitter.com" target="_blank" sx={{ color: "#00acee" }}>
                  <FaTwitter size={24} />
                </IconButton>
                <IconButton href="https://linkedin.com" target="_blank" sx={{ color: "#0e76a8" }}>
                  <FaLinkedin size={24} />
                </IconButton>
                <IconButton href="https://instagram.com" target="_blank" sx={{ color: "#C13584" }}>
                  <FaInstagram size={24} />
                </IconButton>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                Send Us a Message
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Name" variant="outlined" fullWidth required />
                <TextField label="Email Address" type="email" variant="outlined" fullWidth required />
                <TextField label="Message" variant="outlined" fullWidth multiline rows={4} required />

                <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
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
