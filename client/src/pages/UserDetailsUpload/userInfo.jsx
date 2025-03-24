import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Modal,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useSelector } from "react-redux";
import { openDialog } from "uploadcare-widget";
import axios from "axios";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import hiringAnimation from "../../assets/hiring.json";
import { useNavigate } from "react-router-dom";

const ResumeUpload = () => {
  const { user } = useSelector((state) => state.user);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleUpload = () => {
    openDialog({}, { publicKey: "8eeb05a138df98a3c92f" }).done((file) => {
      setLoading(true);
      file.done(async (file) => {
        setFileUrl(file.cdnUrl);
        try {
          const response = await axios.post(
            "https://highimpacttalent.onrender.com/api-v1/user/upload-resume",
            { url: file.cdnUrl },
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.data) { 
            throw new Error("No response from server");
          }
        } catch (error) {
          console.error("Resume upload error:", error);
          alert("Failed to save resume. Please try again.");
          setFileUrl("");
        } finally {
          setLoading(false);
        }
      });
    });
  };

  const handleSubmit = async () => {
    if (!fileUrl) {
      alert("Please upload a resume first.");
      return;
    }
  
    try {
      setSubmitting(true);
      setOpenModal(true);
  
      // Fetch the PDF file as a Blob
      const response = await fetch(fileUrl);
      const blob = await response.blob();
  
      // Create a File object from the Blob
      const file = new File([blob], "resume.pdf", { type: "application/pdf" });
  
      // Prepare FormData
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("cvurl", fileUrl);
  
      // Send the PDF file to the API
      const uploadResponse = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/ai/resume-parser",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      const parsedData = uploadResponse.data;
      const skills = parsedData.data?.skills || []; 
  
      setOpenModal(false);
      console.log("Parsed Data:", parsedData);
      console.log("Skills Extracted:", skills);
      navigate("/user-additional-details", { state: { parsedData } });

  
    } catch (error) {
      console.error("Resume submission error:", error);
      alert("Failed to submit resume. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        px: 3,
        py: 5,
        gap: 4,
      }}
    >
      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: "flex", justifyContent: "center", width: "100%" }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            textAlign: "center",
            width: { xs: "90%", sm: "80%", md: 400 },
            borderRadius: 3,
            backgroundColor: "#ffffff",
            boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Upload Your Resume
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={3}>
            Upload your resume to explore exciting job opportunities!
          </Typography>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
              onClick={handleUpload}
              sx={{
                border: "2px dashed #1976d2",
                p: 4,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
                borderRadius: 2,
                backgroundColor: "#e3f2fd",
                transition: "all 0.3s",
                "&:hover": { backgroundColor: "#bbdefb" },
              }}
            >
              {loading ? (
                <CircularProgress />
              ) : fileUrl ? (
                <>
                  <InsertDriveFileIcon color="primary" fontSize="large" />
                  <Typography variant="body2" color="textSecondary">
                    Resume Uploaded
                  </Typography>
                </>
              ) : (
                <>
                  <InsertDriveFileIcon color="action" fontSize="large" />
                  <Typography variant="body2" color="textSecondary">
                    Click here to upload resume
                  </Typography>
                </>
              )}
            </Box>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 3, borderRadius: 2, fontWeight: "bold", px: 3 }}
              disabled={!fileUrl}
            >
              Submit Resume
            </Button>
          </motion.div>
        </Paper>
      </motion.div>

      {/* Resume Preview Section */}
      {fileUrl && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 3,
              width: { xs: "90%", sm: "80%", md: 450 },
              borderRadius: 3,
              backgroundColor: "#fff",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
              height: { xs: "60vh", sm: "75vh", md: "80vh" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Resume Preview
            </Typography>
            <iframe
              src={fileUrl}
              width="100%"
              height="100%"
              style={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            ></iframe>
          </Paper>
        </motion.div>
      )}

       {/* Modal for Animation */}
       <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%", 
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "rgba(255, 255, 255, 0.8)",
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            maxWidth: 400,
            backdropFilter: "blur(10px)",
          }}
        >
          <Lottie animationData={hiringAnimation} loop />
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            Uploading your resume...
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default ResumeUpload;
