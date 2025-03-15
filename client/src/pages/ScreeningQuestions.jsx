import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Widget } from "@uploadcare/react-widget";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Card,
  Snackbar,
  Alert,
  CardContent,
  TextField,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ScreeningQuestions = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const widgetApi = useRef();

  const [applied, setApplied] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [applyButton, setApplyButton] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, warning, info
  });

  const { user } = useSelector((state) => state.user);
  const hasUploadedResume = user?.cvUrl || false;

  const [formData, setFormData] = useState({
    answers: state?.questions ? Array(state.questions.length).fill("") : [],
  });

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...formData.answers];
    newAnswers[index] = value;
    setFormData({ ...formData, answers: newAnswers });
  };

  const applyHandler = async () => {
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
          setSnackbar({ open: true, message: res.message, severity: "success" });
        }
      } catch (error) {
        console.error("Error while applying:", error);
        const errorMessage = error.response?.data?.message || "Failed to apply. Please try again.";
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      }
    } else {
      navigate("/application-tracking");
    }
  };

  const handleUpload = async (fileInfo) => {
    setFileUrl(fileInfo.cdnUrl);

    try {
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/upload-resume",
        { url: fileInfo.cdnUrl },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setApplyButton(true);
        setSnackbar({ open: true, message: "Resume uploaded successfully!", severity: "success" });
      } else {
        setSnackbar({ open: true, message: "Please login first.", severity: "warning" });
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      setSnackbar({ open: true, message: "Error uploading resume", severity: "error" });
    }
  };

  const openUploadDialog = () => {
    widgetApi.current.openDialog(null, {
      accept: "application/pdf",
    });
  };

  // Filter out empty questions
  const filteredQuestions = state?.questions?.filter(
    (question) => question.question.trim() !== ""
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent>
          {/* Screening Questions Section */}
          {filteredQuestions?.length > 0 ? (
            <Box mb={4}>
              <Typography variant="h5" fontWeight="bold" mb={2}>
                Screening Questions
              </Typography>
              {filteredQuestions.map((question, index) => (
                <Box key={index} mb={2}>
                  <Typography fontWeight="bold">
                    Question {index + 1}: {question.question}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                    value={formData.answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography mb={4} color="textSecondary">
              No screening questions provided by the company.
            </Typography>
          )}

          {/* Resume Upload Section */}
          <Box mb={4}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Upload Your Resume
            </Typography>

            {hasUploadedResume ? (
              <Box>
                <Typography color="textSecondary">
                  You have already uploaded a resume.
                </Typography>
                <Box mt={2} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="success"
                    href={user.cvUrl}
                    target="_blank"
                  >
                    View Resume
                  </Button>
                  <Button variant="outlined" color="primary" onClick={openUploadDialog}>
                    Upload New Resume
                  </Button>
                </Box>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={openUploadDialog}
              >
                Upload PDF Resume
              </Button>
            )}

            <Widget
              publicKey="8eeb05a138df98a3c92f"
              ref={widgetApi}
              onChange={handleUpload}
              style={{ display: "none" }}
              validators={[
                (fileInfo) => {
                  const allowedTypes = [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ];
                  return allowedTypes.includes(fileInfo.mimeType);
                },
              ]}
            />

            {fileUrl && (
              <Typography mt={2}>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  View Uploaded Resume
                </a>
              </Typography>
            )}
          </Box>

          {/* Apply Button */}
          {applyButton || hasUploadedResume ? (
            <Button
              fullWidth
              variant="contained"
              color={applied ? "success" : "primary"}
              onClick={applyHandler}
            >
              {applied ? "View Application Status" : "Apply Now"}
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              disabled
            >
              Upload Your Resume First
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Resume Upload Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Upload New Resume?</DialogTitle>
        <DialogContent>
          <Typography>
            You already have a resume uploaded. Are you sure you want to replace it?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={openUploadDialog} color="primary">
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
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ScreeningQuestions;
