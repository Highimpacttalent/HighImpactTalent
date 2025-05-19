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
import AlertModal from "../../components/Alerts/view.jsx";
import { useNavigate } from "react-router-dom";
import BackupIcon from '@mui/icons-material/Backup';
import { useLocation } from "react-router-dom";
import { Document, Page } from 'react-pdf';

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
    type: "success",
    title: "",
    message: "",
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
      if(error.response.data.message === "Invalid or expired token"){
        setAlert({
        open: true,
        message: "Your Session has expired. Please Logout once and Login again.",
        title: "Error",
        type: "error",
      });
      }
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
        backgroundColor: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
          px: 4,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Satoshi",
            fontSize: "24px",
            fontWeight: 600,
            color: "#24252C",
            textAlign: "center",
            mt: 4,
          }}
        >
          You're Now Part of an{" "}
          <span
            style={{
              fontFamily: "Satoshi",
              fontSize: "24px",
              fontWeight: 600,
              color: "#3C7EFC",
            }}
          >
            Exclusive Talent
          </span>{" "}
          Network
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 400,
              color: "#808195",
              width: { sx: "100%", xs: "100%", lg: "70%", md: "70%" },
              textAlign: "center",
            }}
          >
            Save Time, Land Faster! Fill a few details to get more personalized
            recommendations
          </Typography>
        </Box>
      </Box>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        style={{ display: "none" }}
      />

      {/* Upload Section */}
      <div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: "flex", justifyContent: "center", width: "100%" }}
      >
        <Box
          sx={{
            p: 4,
            width: { xs: "90%", sm: "80%", md: 400 },
            borderRadius: 3,
          }}
        >
          <Typography
            fontSize="20px"
            fontWeight="600"
            color="#24252C"
            fontFamily="Poppins"
            mb={1}
          >
            Upload Resume
          </Typography>
          <Typography
            fontSize="14px"
            color="#24252C80"
            fontFamily="Poppins"
            mb={3}
          >
            Upload your resume to explore exciting job opportunities!
          </Typography>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
              onClick={openFileDialog}
              sx={{
                border: "3px dashed #24252C",
                p: 4,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
                borderRadius: 2,
                transition: "all 0.3s",
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
                  <BackupIcon fontSize="large" sx={{color:"#3a42e8"}}/>
                  <Typography
                    fontSize="12px"
                    color="#24252C"
                    fontFamily="Poppins"
                    mt={1}
                  >
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

          <Box sx={{ display: "flex",flexDirection:"column", alignItems: "center", }}>
          <Typography
            fontSize="14px"
            color="#24252C80"
            fontFamily="Poppins"
            mt={3}
          >
            Only support .pdf and .docx files.
          </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2, borderRadius: 3, fontWeight: "500", px: 2,py:1 ,textTransform:"none",fontFamily:"Poppins"}}              
              disabled={!fileUrl || submitting}
            >
              {submitting ? "Processing..." : "Submit Resume"}
            </Button>
          </Box>
        </Box>
      </div>

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