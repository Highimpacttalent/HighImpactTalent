import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Widget } from "@uploadcare/react-widget";
import axios from "axios";
import {
  Typography,
  Button,
  Card,
  Snackbar,
  Alert,
  TextField,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ScreeningView = () => {
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
    // Check if all screening questions are answered
  const allQuestionsAnswered = formData.answers.every(answer => answer.trim() !== "");

  if (!allQuestionsAnswered) {
    setSnackbar({
      open: true,
      message: "Please answer all screening questions before submitting.",
      severity: "error",
    });
    return;
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
        setSnackbar({
          open: true,
          message: "Resume uploaded successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Please login first.",
          severity: "warning",
        });
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      setSnackbar({
        open: true,
        message: "Error uploading resume",
        severity: "error",
      });
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

            {hasUploadedResume ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box mt={2} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    href={user.cvUrl}
                    target="_blank"
                    sx={{
                      bgcolor: "#3C7EFC",
                      color: "white",
                      fontFamily: "Satoshi",
                      fontWeight: 700,
                      borderRadius: 16,
                      textTransform: "none",
                    }}
                  >
                    View Resume
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={openUploadDialog}
                    sx={{
                      height: "40px",
                      width: "150px",
                      bgcolor: "#3C7EFC",
                      color: "white",
                      fontFamily: "Satoshi",
                      fontWeight: 700,
                      borderRadius: 16,
                      textTransform: "none",
                    }}
                  >
                    Upload Resume
                  </Button>
                </Box>
              </Box>
            ) : (
                <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                variant="contained"
                color="primary"
                onClick={openUploadDialog}
                sx={{
                  height: "40px",
                  width: "150px",
                  bgcolor: "#3C7EFC",
                  color: "white",
                  fontFamily: "Satoshi",
                  fontWeight: 700,
                  borderRadius: 16,
                  textTransform: "none",
                }}
              >
                Upload Resume
              </Button>
              </Box>
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
            <Typography
              sx={{
                textAlign: "center",
                color: "#808195",
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 400,
              }}
            >
              Supported Formats: doc, docx, rtf, pdf, upto 2 MB
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
          {applyButton || hasUploadedResume ? (
            <Button
              fullWidth
              variant="contained"
              onClick={applyHandler}
              sx={{borderRadius:16,textTransform:"none",fontFamily:"Satoshi",bgcolor:applied ? "success" : "#3C7EFC"}}
            >
              {applied ? "View Application Status" : "Submit"}
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              disabled
              sx={{borderRadius:16,textTransform:"none",fontFamily:"Satoshi",bgcolor:applied ? "success" : "#3C7EFC"}}
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
