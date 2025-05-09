import React, { useState, useRef } from "react";
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
import axios from "axios";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import hiringAnimation from "../../assets/hiring.json";
import AlertModal from "../../components/Alerts/view.jsx"
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ResumeUpload = () => {
  const location = useLocation();
  const refer = location.state?.refer;
  const { user } = useSelector((state) => state.user);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [alert, setAlert] = useState({
      open: false,
      type: 'success',
      title: '',
      message: ''
    });

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/upload-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.url) {
        throw new Error("No URL returned from server");
      }

      setFileUrl(response.data.url);
    } catch (error) {
      console.error("Resume upload error:", error);
      setAlert({
        open: true,
        message: "Failed to upload resume. Please try again.",
        title: "Error",
        type: "error",
        });
      setFileUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!fileUrl) {
      setError("Please upload a resume first.");
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
      setAlert({
        open: true,
        message: "Resume uploaded successfully.",
        title: "Resume Uploaded",
        type: "success", 
      });
      
      setTimeout(() => {
        navigate("/user-additional-details", { state: { parsedData,refer } });
      }, 2000);
      
  
    } catch (error) {
      console.error("Resume submission error:", error);
      setError("Failed to submit resume. Please try again.");
      setAlert({
        open: true,
        message: "Failed to submit resume. Please try again.",
        title: "Error",
        type: "error",
        });
    } finally {
      setSubmitting(false);
      setOpenModal(false);
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
     
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        style={{ display: "none" }}
      />

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
              onClick={openFileDialog}
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
                    Click here to upload PDF resume
                  </Typography>
                </>
              )}
            </Box>
          </motion.div>

          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 3, borderRadius: 2, fontWeight: "bold", px: 3 }}
              disabled={!fileUrl || submitting}
            >
              {submitting ? "Processing..." : "Submit Resume"}
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
              title="Resume Preview"
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
            Processing your resume...
          </Typography>
        </Box>
      </Modal>
      <AlertModal
              open={alert.open}
              onClose={() => setAlert({ ...alert, open: false })}
              type={alert.type}
              title={alert.title}
              message={alert.message}
            />
    </Box>
  );
};

export default ResumeUpload;