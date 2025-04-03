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
import axios from "axios";
import CustomCarosuel from "./Carousel/view"
import { LinkedIn } from "@mui/icons-material";

const LinkedInCarousel = ({ linkedinProfiles }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Show one profile at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };
}

const ContactUsDesktop = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
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
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/sendmail/contactus",
        formData
      );
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        py: 8,
        px: 4,
        bgcolor: "white",
      }}
    >
      <Box sx={{ maxWidth: "1300px", width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box textAlign="center" mb={6} width={"60%"}>
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: 700,
                fontSize: "28px",
                color: "#24252C",
              }}
            >
              Talk to Us, We’re{" "}
              <span
                style={{
                  fontFamily: "Satoshi",
                  fontWeight: 700,
                  fontSize: "28px",
                  color: "#3C7EFC",
                }}
              >
                Listening!
              </span>
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "14px",
                color: "#808195",
                mt: 2,
              }}
            >
              High-paying roles are within reach. Get access to high-paying,
              strategic roles and secure your place before someone else does.
              Stay ahead in the hiring game with real-time updates and
              AI-powered job matches.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2,width:"70%"}}
          >
            <Typography sx={{fontFamily:"Satoshi",fontWeight:"500",fontSize:18,color:"#24252C"}}>Name *</Typography>
            <TextField
              name="name"
              variant="outlined"
              fullWidth
              required
              onChange={handleChange}
              value={formData.name}
              sx={{'& .MuiOutlinedInput-root': {
      borderRadius:16, // Adjust the radius as needed
      width:"70%"
    }}}
            />
            <Typography sx={{fontFamily:"Satoshi",fontWeight:"500",fontSize:18,color:"#24252C"}}>Email Address *</Typography>
            <TextField
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              required
              onChange={handleChange}
              value={formData.email}
              sx={{'& .MuiOutlinedInput-root': {
                borderRadius:16, // Adjust the radius as needed
                width:"70%"
              }}}
            />
             <Typography sx={{fontFamily:"Satoshi",fontWeight:"500",fontSize:18,color:"#24252C"}}>Message *</Typography>
            <TextField
              name="message"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              required
              onChange={handleChange}
              value={formData.message}
              sx={{'& .MuiOutlinedInput-root': {
                borderRadius:4, // Adjust the radius as needed
              }}}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2, borderRadius: "25px", fontWeight: "bold",textTransform:"none",fontFamily:"Satoshi" }}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Send Message"
              )}
            </Button>
          </Box>
        </Box>

       {/* LinkdIn Part */}
       <Box
      sx={{
        p: 4,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        width:"80%",
        
        mx: "auto", // Center align
      }}
    >
      <Typography sx={{fontFamily:"Poppins",fontWeight:500,mb:6,fontSize:"20px",ml:5,color:"#474E68"}}>
      Connect with us on <LinkedIn color="primary"/>
      </Typography>

     {/* Custom Carousel Component */}
     <CustomCarosuel
        items={linkedinProfiles.map((link, index) => (
          <iframe
            key={index}
            src={link}
            width="100%"
            height="450"
            style={{
              border: "none",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
            }}
            allowFullScreen
          ></iframe>
        ))}
      />
    </Box>
      </Box>

      {/* Success Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
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

export default ContactUsDesktop;
