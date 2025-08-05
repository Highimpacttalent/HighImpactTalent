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
import CustomCarosuel from "./Carousel/view";
import { LinkedIn } from "@mui/icons-material";

const ContactUsDesktop = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const linkedinProfiles = [
    "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7358408328558886913",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7356234837260652544",
    "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7355862775560114179",
    "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7354147592345116672",
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
    const { name, value } = e.target;

    if (name === "phone") {
      // remove non-digits
      const digitsOnly = value.replace(/\D/g, "");
      // limit to 10 chars
      const limited = digitsOnly.slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: limited }));

      // validation feedback
      if (limited.length === 0) {
        setPhoneError("");
      } else if (!/^\d{10}$/.test(limited)) {
        setPhoneError("Please enter a valid 10 digit phone number");
      } else {
        setPhoneError("");
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone if provided
    const phone = formData.phone?.trim();
    if (phone && !/^\d{10}$/.test(phone)) {
      setPhoneError("Please enter a valid 10 digit phone number");
      return;
    }

    setLoading(true);

    try {
      // Append phone to message only if provided
      const finalMessage =
        phone && phone.length === 10
          ? `${formData.message}\n\nUser contact number: ${phone}`
          : formData.message;

      const payload = {
        name: formData.name,
        email: formData.email,
        message: finalMessage,
      };

      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/sendmail/contactus",
        payload
      );

      if (response.data?.success) {
        setShowModal(true);
        setFormData({ name: "", email: "", message: "", phone: "" });
        setPhoneError("");
      } else {
        // optional: show warning if needed
        console.warn("Contact submission returned success:false", response.data);
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
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "70%",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: "500",
                fontSize: 18,
                color: "#24252C",
              }}
            >
              Name *
            </Typography>
            <TextField
              name="name"
              variant="outlined"
              fullWidth
              required
              onChange={handleChange}
              value={formData.name}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                },
              }}
            />
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: "500",
                fontSize: 18,
                color: "#24252C",
              }}
            >
              Email Address *
            </Typography>
            <TextField
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              required
              onChange={handleChange}
              value={formData.email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                },
              }}
            />
            {/* Phone field (optional) */}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: "500",
                fontSize: 18,
                color: "#24252C",
              }}
            >
              Phone (optional)
            </Typography>
            <TextField
              name="phone"
              variant="outlined"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
              error={Boolean(phoneError)}
              helperText={phoneError || "Enter 10 digit mobile number (numbers only)."}
              inputProps={{
                maxLength: 10,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                },
              }}
            />
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: "500",
                fontSize: 18,
                color: "#24252C",
              }}
            >
              Message *
            </Typography>
            <TextField
              name="message"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              required
              onChange={handleChange}
              value={formData.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 4, // Adjust the radius as needed
                },
              }}
            />


            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 2,
                borderRadius: "25px",
                fontWeight: "bold",
                textTransform: "none",
                fontFamily: "Satoshi",
              }}
              type="submit"
              disabled={loading || Boolean(phoneError)}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Send Message"}
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
            width: "80%",
            mx: "auto", // Center align
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 500,
              mb: 6,
              fontSize: "20px",
              ml: 5,
              color: "#474E68",
            }}
          >
            Connect with us on{" "}
            <span
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/company/highimpacttalent/",
                  "_blank"
                )
              }
              style={{
                cursor: "pointer",
                display: "inline-flex",
                verticalAlign: "middle",
              }}
            >
              <LinkedIn color="primary" />
            </span>
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
