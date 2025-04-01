import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Typography,
  Button,
  Card,
  Snackbar,
  Alert,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FiEye } from "react-icons/fi";

const ScreeningView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [applied, setApplied] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [applyButton, setApplyButton] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { user } = useSelector((state) => state.user);
  const hasUploadedResume = user?.cvUrl || false;

  const [formData, setFormData] = useState({
    answers: state?.questions ? Array(state.questions.length).fill("") : [],
  });

  // Initialize resume URL from user data
  useEffect(() => {
    if (user?.cvUrl) {
      setResumeUrl(user.cvUrl);
      setApplyButton(true);
    }
  }, [user]);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...formData.answers];
    newAnswers[index] = value;
    setFormData({ ...formData, answers: newAnswers });
  };

  const applyHandler = async () => {
    const allQuestionsAnswered = formData.answers.every(answer => answer.trim() !== "");

  if(filteredQuestions.length > 0){
  if (!allQuestionsAnswered) {
    setSnackbar({
      open: true,
      message: "Please answer all screening questions before submitting.",
      severity: "error",
    });
    return;
  }
}
    if (!applied) {
      try {
        const res = await axios.post(
          "https://highimpacttalent.onrender.com/api-v1/application/create",
          {
            job: state?.jobid,
            company: state?.companyid,
            applicant: state?.userid,
          }
        );
        if (res) {
          setApplied(true);
          setSnackbar({
            open: true,
            message: res.message,
            severity: "success",
          });
        }
      } catch (error) {
        console.error("Error while applying:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to apply. Please try again.";
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      }
    } else {
      navigate("/application-tracking");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset file input
    e.target.value = null;

    // Validate file type
    if (file.type !== "application/pdf") {
      setSnackbar({
        open: true,
        message: "Only PDF files are allowed",
        severity: "error",
      });
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "File size must be less than 2MB",
        severity: "error",
      });
      return;
    }

    setUploading(true);

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

      if (response.data?.url) {
        setResumeUrl(response.data.url);
        setApplyButton(true);
        setSnackbar({
          open: true,
          message: "Resume uploaded successfully!",
          severity: "success",
        });
      } else {
        throw new Error("No URL returned from server");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error uploading resume",
        severity: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const openFileDialog = () => {
    if (hasUploadedResume) {
      setOpenDialog(true);
    } else {
      fileInputRef.current.click();
    }
  };

  const confirmUpload = () => {
    setOpenDialog(false);
    fileInputRef.current.click();
  };

  // Filter out empty questions
  const filteredQuestions = state?.questions?.filter(
    (question) => question.question.trim() !== ""
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "white",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 6 }}>
        <Typography
          sx={{
            color: "#404258",
            fontFamily: "Satoshi",
            fontSize: {lg:"32px", md:"32px",xs:"23px",sm:"23px"},
            fontWeight: "700",
          }}
        >
          <span
            style={{
              color: "#3C7EFC",
              fontFamily: "Satoshi",
              fontWeight: "700",
            }}
          >
            Almost There!
          </span>{" "}
          Just a Few Details to Get You Noticed.
        </Typography>
      </Box>
      <Box
        sx={{
          p: 4,
          border: "2px solid #00000040",
          borderRadius: "20px",
          mb: 10,
        }}
      >
        <Box>
          {/* Resume Upload Section */}
          <Box mb={4}>
            <Typography
              sx={{
                color: "#404258",
                fontFamily: "Satoshi",
                fontSize: "20px",
                fontWeight: 700,
              }}
              mb={2}
            >
              Resume
            </Typography>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              style={{ display: "none" }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box mt={2} display="flex" gap={2}>
                {resumeUrl && (
                  <Button
                    variant="contained"
                    href={resumeUrl}
                    target="_blank"
                    sx={{
                      bgcolor: "#3C7EFC",
                      color: "white",
                      fontFamily: "Satoshi",
                      fontWeight: 700,
                      borderRadius: 16,
                      textTransform: "none",
                    }}
                    startIcon={<FiEye />}
                  >
                    View Resume
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={openFileDialog}
                  disabled={uploading}
                  sx={{
                    bgcolor: "#3C7EFC",
                    color: "white",
                    fontFamily: "Satoshi",
                    fontWeight: 700,
                    borderRadius: 16,
                    textTransform: "none",
                  }}
                  startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                >
                  {uploading ? "Uploading..." : "Upload Resume"}
                </Button>
              </Box>
            </Box>

            <Typography
              sx={{
                textAlign: "center",
                color: "#808195",
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 400,
                mt: 1,
              }}
            >
              Supported Format: PDF (Max 2MB)
            </Typography>
          </Box>

          {/* Screening Questions Section */}
          {filteredQuestions?.length > 0 ? (
            <Box mb={4}>
              <Typography
                sx={{
                  fontFamily: "Satoshi",
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "#404258",
                }}
                mb={4}
              >
                Company Screening Questions
              </Typography>
              {filteredQuestions.map((question, index) => (
                <Box key={index} mb={2}>
                  <Typography
                    sx={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#404258",
                    }}
                  >
                    Question {index + 1}: {question.question}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 16,
                        border:"1px solid #404258"
                      },
                    }}
                    value={formData.answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: 500,
                fontSize: "14px",
                color: "#404258",
                mb:4
              }}
            >
              No screening questions provided by the company.
            </Typography>
          )}

          {/* Apply Button */}
          {applyButton ? (
            <Button
              fullWidth
              variant="contained"
              onClick={applyHandler}
              sx={{
                borderRadius:16,
                textTransform:"none",
                fontFamily:"Satoshi",
                bgcolor: applied ? "success.main" : "#3C7EFC",
                "&:hover": {
                  bgcolor: applied ? "success.dark" : "#3C7EFC",
                }
              }}
            >
              {applied ? "View Application Status" : "Submit"}
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              disabled
              sx={{
                borderRadius:16,
                textTransform:"none",
                fontFamily:"Satoshi",
                bgcolor: "#3C7EFC",
              }}
            >
              Upload Your Resume First
            </Button>
          )}
        </Box>

        {/* Resume Upload Confirmation Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Upload New Resume?</DialogTitle>
          <DialogContent>
            <Typography>
              You already have a resume uploaded. Are you sure you want to
              replace it?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={confirmUpload} color="primary">
              Upload New
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ScreeningView;