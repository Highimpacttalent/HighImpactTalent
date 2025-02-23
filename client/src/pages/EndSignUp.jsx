import React from "react";
import { Container, Typography, Button, Paper, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExploreIcon from "@mui/icons-material/Explore";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import hiringAnimation from "../assets/hiring.json"; // Lottie animation file

const RecruiterRedirectPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        background: "linear-gradient(135deg, #d9afd9 0%, #97d9e1 100%)",
        padding: { xs: 2, md: 4 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: { xs: 3, md: 5 },
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
            width: { xs: "90%", sm: "80%", md: "70%" }, // Wider in desktop view
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Switch layout for desktop
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* Left Side - Animation */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: { xs: 0, md: 3 },
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{ width: "100%", maxWidth: { xs: 200, md: 400 } }}
            >
              <Lottie animationData={hiringAnimation} loop />
            </motion.div>
          </Box>

          {/* Right Side - Content */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: { xs: 2, md: 4 },
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              gutterBottom
              sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
            >
              🎉 Welcome Aboard!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: "1rem", md: "1.3rem" }, mb: 3 }}
            >
              Find top talent and the best candidates for your job openings. Our platform connects you with the right professionals efficiently. Start hiring today!
            </Typography>

            {/* Explore Button */}
            <motion.div whileHover={{ scale: 1.1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ExploreIcon />}
                onClick={() => navigate("/upload-job")}
                sx={{
                  mt: 3,
                  padding: { xs: "10px 20px", md: "14px 30px" },
                  fontSize: { xs: "0.9rem", md: "1.2rem" },
                  borderRadius: "10px",
                  transition: "all 0.3s ease",
                  boxShadow: "0px 4px 20px rgba(0, 140, 255, 0.3)",
                  "&:hover": {
                    boxShadow: "0px 6px 25px rgba(0, 140, 255, 0.5)",
                  },
                }}
              >
                Start Exploring
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default RecruiterRedirectPage;
