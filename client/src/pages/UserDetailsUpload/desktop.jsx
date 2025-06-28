import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Modal,
  LinearProgress,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useSelector } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import AlertModal from "../../components/Alerts/view.jsx"
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Premium Loading Component
const PremiumLoader = ({ open, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");

  const loadingMessages = [
    { percentage: 10, message: "Wow, impressive formatting..." },
    { percentage: 25, message: "Analyzing your experience..." },
    { percentage: 45, message: "Matching with hiring signals..." },
    { percentage: 65, message: "Extracting key achievements..." },
    { percentage: 87, message: "Almost there. We see impact..." },
    { percentage: 100, message: "Let's get you hired 🔥" }
  ];

  useEffect(() => {
    if (!open) {
      setProgress(0);
      setCurrentMessage("");
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < loadingMessages.length) {
        const targetPercentage = loadingMessages[currentIndex].percentage;
        const message = loadingMessages[currentIndex].message;
        
        // Smooth progress animation
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= targetPercentage) {
              clearInterval(progressInterval);
              setCurrentMessage(message);
              return targetPercentage;
            }
            return prev + 1;
          });
        }, 50);

        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [open]);

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)'
        }
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          p: 6,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "90%",
          maxWidth: 500,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Premium Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1
            }}
          >
            Processing Your Resume
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#64748b",
              fontWeight: 500
            }}
          >
            Our AI is analyzing your profile
          </Typography>
        </Box>

        {/* Premium Progress Bar */}
        <Box sx={{ width: "100%", mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                color: "#1976d2",
                fontSize: "2.5rem"
              }}
            >
              {progress}%
            </Typography>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center",
              bgcolor: "#e3f2fd",
              px: 2,
              py: 0.5,
              borderRadius: 2
            }}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#1976d2",
                mr: 1,
                animation: "pulse 2s infinite"
              }} />
              <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: 600 }}>
                LIVE
              </Typography>
            </Box>
          </Box>

          {/* Custom Progress Bar */}
          <Box sx={{ 
            width: "100%", 
            height: 12, 
            bgcolor: "#e5e7eb", 
            borderRadius: 6,
            overflow: "hidden",
            position: "relative"
          }}>
            <Box sx={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%)",
              borderRadius: 6,
              transition: "width 0.3s ease-in-out",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                animation: "shimmer 2s infinite"
              }
            }} />
          </Box>
        </Box>

        {/* Dynamic Message */}
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", minHeight: 60 }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#1e293b",
              fontWeight: 600,
              fontSize: "1.1rem",
              lineHeight: 1.4
            }}
          >
            {currentMessage}
          </Typography>
        </motion.div>

        {/* Premium Footer */}
        <Box sx={{ 
          mt: 3, 
          display: "flex", 
          alignItems: "center",
          gap: 1,
          opacity: 0.7
        }}>
          <Box sx={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            bgcolor: "#22c55e"
          }} />
          <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500 }}>
            Secured with enterprise-grade encryption
          </Typography>
        </Box>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </Box>
    </Modal>
  );
};

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
      if(error.response.data.message === "Invalid or expired token"){
        setAlert({
        open: true,
        message: "Your Session has expired. Please Logout once and Login again.",
        title: "Error",
        type: "error",
      });
      }
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
        message: "Failed to parse resume.Please wait..",
        title: "Error",
        type: "error",
      });
      setTimeout(() => {
        navigate("/user-additional-details");
      }, 2000);
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
            Welcome to the Inner Circle
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={3}>
            Let’s get you hired. Fast.<br/>Drop your resume (PDF or DOCX only).
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

       <PremiumLoader 
        open={openModal} 
        onClose={() => setOpenModal(false)}   
      />


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