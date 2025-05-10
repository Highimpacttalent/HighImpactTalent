import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FiEye } from "react-icons/fi";
import AlertModal from "../../../components/Alerts/view";
import { useSelector } from "react-redux";
import axios from "axios";

const ResumeUpload = ({ userInfo, onResumeUploaded }) => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(userInfo?.cvUrl || null);
  const fileInputRef = useRef(null);
   const [alert, setAlert] = useState({
      open: false,
      type: 'success',
      title: '',
      message: ''
    });

  // Update local state when userInfo changes
  useEffect(() => {
    setResumeUrl(userInfo?.cvUrl || null);
  }, [userInfo]);

  const handleView = () => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      setAlert({open:"true", type: "error", title: "Error", message: "No resume uploaded yet."});
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset file input
    e.target.value = null;

    // Validate file type
    if (file.type !== "application/pdf") {
      setAlert({open:"true", type: "error", title: "Error", message: "Only PDF files are allowed."});
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAlert({open:"true", type: "error", title: "Error", message: "File size must be less than 2MB."});
      setError("File size must be less than 2MB");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("filename", `${Date.now()}-${file.name}`);

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

      if (!response.data?.url) {
        throw new Error("No URL returned from server");

      }

      // Update local state
      setResumeUrl(response.data.url);
      
      // Notify parent component
      if (onResumeUploaded) {
        onResumeUploaded(response.data.url);
      }

      setAlert({open:"true", type: "success", title: "Success", message: "Resume uploaded successfully!"});
    } catch (error) {
      console.error("Resume upload error:", error);
      setAlert({open:"true", type: "error", title: "Error", message: error.response?.data?.message || "Failed to upload resume"});
    } finally {
      setLoading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <Box sx={{}}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Tabs value={0}>
          <Tab
            sx={{
              "&.MuiTab-root": {
                color: "#404258",
                fontWeight: 700,
                textTransform: "none",
              },
            }}
            label="Resume"
          />
        </Tabs>
      </Box>
      <AlertModal
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />

      <Card variant="outlined" sx={{ py: 2, borderRadius: 2, border: "1px solid #00000040" }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              startIcon={!loading && <CloudUploadIcon />}
              sx={{ borderRadius: 16 }}
              onClick={openFileDialog}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Upload Resume"}
            </Button>
            <Button
              variant="contained"
              startIcon={<FiEye />}
              sx={{ borderRadius: 16 }}
              onClick={handleView}
              disabled={!resumeUrl}
            >
              View Resume
            </Button>
          </Box>
          
          {error && (
            <Typography color="error" variant="caption" display="block" textAlign="center" mt={1}>
              {error}
            </Typography>
          )}
          
          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            mt={1}
            color="#808195"
          >
            Supported Format: PDF (Max 2MB)
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResumeUpload;