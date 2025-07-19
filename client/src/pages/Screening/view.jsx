import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  Typography,
  Button,
  Card, // Not used in original UI, removing
  Snackbar,
  Alert,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  RadioGroup, // Import RadioGroup
  FormControlLabel, // Import FormControlLabel
  Radio, // Import Radio
  Checkbox, // Import Checkbox
} from "@mui/material";
import { UpdateUser } from "../../redux/userSlice"; // Assuming this path is correct
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FiEye } from "react-icons/fi";

// Define shared styling for consistency, focusing on TextField-like appearance
const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 16, // Original border radius from your code
    border: "1px solid #404258", // Original border color from your code
    fontSize: "0.875rem", // Match size small font size
    fontFamily: "Poppins", // Match surrounding text font
    color: "#404258", // Match surrounding text color
    padding: "8px 14px", // Match TextField padding
    "&.Mui-focused fieldset": {
      // Remove default blue focus border
      borderColor: "#404258",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      // Keep consistent border on hover
      borderColor: "#404258",
    },
    // Specific padding adjustments for input element itself
    "& .MuiInputBase-input": {
      padding: 0, // Reset default input padding
      fontFamily: "Poppins",
      fontSize: "0.875rem",
      color: "#404258",
    },
  },
  "& .MuiInputLabel-root": {
    // Style label
    fontFamily: "Poppins",
    fontSize: "0.875rem",
    color: "#404258",
    "&.Mui-focused": { color: "#404258" }, // Keep color on focus
    "&.MuiFormLabel-shrink": {
      // Label when shrunk (input filled)
      transform: "translate(14px, -6px) scale(0.8)", // Adjust position
      bgcolor: "white", // Add background to prevent text overlap
      px: 0.5, // Add horizontal padding
    },
  },
  // Add styles for multiline TextField
  "& .MuiOutlinedInput-multiline": {
    padding: "14px", // Restore some padding for multiline
  },
};

const ScreeningView = () => {
  const { state } = useLocation(); // state should contain job data including screeningQuestions
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  // Assuming initial state check if already applied happens elsewhere or via API,
  // setting default based on whether state has initial applied status
  const [applied, setApplied] = useState(state?.isApplied ?? false); // Default to false if not in state
  const [resumeUrl, setResumeUrl] = useState("");
  const [applyButton, setApplyButton] = useState(false); // Controls if apply button is enabled (needs resume)
  const [openDialog, setOpenDialog] = useState(false); // For resume upload confirmation
  const [uploading, setUploading] = useState(false); // For resume upload loading
  const [submitting, setSubmitting] = useState(false); // For application submission loading

  // State to hold user's answers, indexed by the position of the question in the filteredQuestions array
  // Initialize with an empty array initially
  const [formData, setFormData] = useState({
    answers: [],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { user } = useSelector((state) => state.user);
  console.log("User data from Redux:", user);
  const hasUploadedResume = user?.cvUrl || false;

  // Get screening questions from location state and filter out empty ones
  // Use optional chaining defensively
  const allQuestions = state?.questions || [];
  const filteredQuestions = allQuestions.filter(
    (question) =>
      question && question.question && question.question.trim() !== ""
  );

  // Initialize formData.answers based on fetched questions or user's existing answers
  useEffect(() => {
    if (filteredQuestions.length > 0) {
      // Check if state includes existing answers (e.g., if navigating back from confirmation)
      // If initial answers exist, use them. Otherwise, initialize based on question type.
      const initialAnswers = state?.initialAnswers
        ? state.initialAnswers
        : filteredQuestions.map((q) => {
            // Initialize answer based on question type
            switch (q.questionType) {
              case "yes/no":
                return false; // Boolean (false by default)
              case "multi_choice":
                return []; // Array of strings
              case "single_choice":
                // Using "" as initial value allows radio group to have no default selection
                return "";
              case "short_answer":
              case "long_answer":
              default:
                return ""; // Empty string
            }
          });
      setFormData({ answers: initialAnswers });
    } else {
      setFormData({ answers: [] }); // No questions, empty answers
    }

    // Also update applied status if provided in state
    if (state?.isApplied !== undefined) {
      setApplied(state.isApplied);
    }
  }, [state?.questions, state?.initialAnswers, state?.isApplied]); // Re-run when questions or initial answers/applied status change in location state

  // Initialize resume URL from user data and enable apply button if resume exists
  useEffect(() => {
    if (user?.cvUrl) {
      setResumeUrl(user.cvUrl);
      // Enable apply button only if resume is uploaded AND user hasn't already applied
      // The button will be disabled if 'applied' is true
      setApplyButton(true);
    } else {
      // If user has no resume, apply button starts disabled
      setApplyButton(false);
      setResumeUrl("");
    }
  }, [user]); // Re-run when user state changes

  // --- Handlers for different question types ---

  // Generic handler for updating an answer at a specific index
  // This handler updates the state with the type-specific value (boolean, array, or string)
  const updateAnswer = (index, value) => {
    setFormData((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[index] = value;
      return { ...prev, answers: newAnswers };
    });
  };

  // Handler for Text input (Short Answer, Long Answer)
  const handleTextAnswerChange = (index, value) => {
    updateAnswer(index, value); // Store the string value
  };

  // Handler for Yes/No (Radio Group with "Yes"/"No" options)
  const handleYesNoAnswerChange = (index, value) => {
    // Store boolean true for "yes", false for "no" in state
    updateAnswer(index, value === "yes");
  };

  // Handler for Single Choice (Radio Group)
  const handleSingleChoiceAnswerChange = (index, value) => {
    // Store the selected option string in state
    updateAnswer(index, value);
  };

  // Handler for Multi Choice (Checkbox group)
  const handleMultiChoiceAnswerChange = (index, optionValue, checked) => {
    setFormData((prev) => {
      const newAnswers = [...prev.answers];
      // Ensure the answer at this index is treated as an array
      let currentOptions = Array.isArray(newAnswers[index])
        ? [...newAnswers[index]]
        : [];

      if (checked) {
        // Add option if checked and not already in array
        if (!currentOptions.includes(optionValue)) {
          currentOptions.push(optionValue);
        }
      } else {
        // Remove option if unchecked
        currentOptions = currentOptions.filter((opt) => opt !== optionValue);
      }

      newAnswers[index] = currentOptions; // Store array of selected option strings in state
      return { ...prev, answers: newAnswers };
    });
  };

  // --- Apply Logic ---
  const applyHandler = async () => {
  // Prevent multiple submissions
  if (submitting) return;
  setSubmitting(true);

  try {
    // --- Frontend Validation ---
    const allMandatoryAnswered = filteredQuestions.every((question, index) => {
      if (!question.isMandatory) return true;

      const answer = formData.answers[index];

      switch (question.questionType) {
        case "yes/no":
          return typeof answer === "boolean";
        case "single_choice":
          return typeof answer === "string" && answer.trim() !== "";
        case "multi_choice":
          return (
            Array.isArray(answer) &&
            answer.filter((opt) => opt.trim() !== "").length > 0
          );
        case "short_answer":
        case "long_answer":
        default:
          return typeof answer === "string" && answer.trim() !== "";
      }
    });

    if (!allMandatoryAnswered) {
      setSnackbar({
        open: true,
        message: "Please answer all mandatory screening questions before submitting.",
        severity: "error",
      });
      return;
    }

    if (!resumeUrl) {
      setSnackbar({
        open: true,
        message: "Please upload your resume before submitting.",
        severity: "error",
      });
      return;
    }

    if (applied) {
      navigate("/application-tracking");
      return;
    }

    // --- Prepare API Payload ---
    const screeningAnswersPayload = filteredQuestions.map((question, index) => {
      const answerValue = formData.answers[index];
      let formattedAnswerString;

      switch (question.questionType) {
        case "yes/no":
          formattedAnswerString =
            typeof answerValue === "boolean"
              ? answerValue ? "yes" : "no"
              : "";
          break;
        case "multi_choice":
          formattedAnswerString = Array.isArray(answerValue)
            ? answerValue
                .filter((opt) => typeof opt === "string" && opt.trim() !== "")
                .map((opt) => opt.trim())
                .join(", ")
            : "";
          break;
        case "single_choice":
        case "short_answer":
        case "long_answer":
        default:
          formattedAnswerString =
            typeof answerValue === "string" ? answerValue.trim() : "";
          break;
      }

      return {
        questionId: question._id,
        question: question.question,
        questionType: question.questionType,
        answer: formattedAnswerString,
      };
    });

    const finalScreeningAnswersPayload = screeningAnswersPayload.filter(
      (item) => item.answer !== ""
    );

    const res = await axios.post(
      "https://highimpacttalent.onrender.com/api-v1/application/create",
      {
        job: state?.jobid,
        company: state?.companyid,
        applicant: user?._id,
        screeningAnswers: finalScreeningAnswersPayload,
        cvUrl: resumeUrl,
        jobTitle: state?.jobTitle,
        companyName: state?.companyName,
      },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (res.data?.success) {
      setApplied(true);
      console.log(res.data);
      if (res.data.user) {
        dispatch(UpdateUser(res.data.user));
      }
      setSnackbar({
        open: true,
        message: res.data.message || "Application submitted successfully!",
        severity: "success",
      });
    } else {
      const errorMessage = res.data.message || "Failed to apply. Please try again.";
      console.error("API Error:", errorMessage);
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  } catch (error) {
    console.error("Error while applying:", error.response?.data || error);
    const errorMessage =
      error.response?.data?.message || "Failed to apply. An error occurred.";
    setSnackbar({ open: true, message: errorMessage, severity: "error" });
  } finally {
    setSubmitting(false);
  }
};

  // --- Resume Upload Logic (Kept mostly as is, applying original styling) ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset file input to allow re-uploading same file after cancellation
    e.target.value = null;

    // Validate file type
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setSnackbar({
        open: true,
        message: "Only PDF files are allowed",
        severity: "error",
      });
      return;
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
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
      // Append filename, perhaps with user ID or timestamp for uniqueness
      formData.append(
        "filename",
        `${user?._id || "user"}-${Date.now()}-${file.name}`
      );

      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/upload-resume", // Verify this endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`, // Use token from Redux state
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.url) {
        setResumeUrl(response.data.url);
        setApplyButton(true); // Enable apply button
        // Update Redux user state with new CV URL
        dispatch(UpdateUser({ ...user, cvUrl: response.data.url }));

        setSnackbar({
          open: true,
          message: "Resume uploaded successfully!",
          severity: "success",
        });
      } else {
        // Handle unexpected response structure
        throw new Error("Upload successful, but no URL returned.");
      }
    } catch (error) {
      console.error("Error uploading resume:", error.response?.data || error);
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
    // If user already has a resume uploaded, ask for confirmation to replace
    if (hasUploadedResume && resumeUrl) {
      // Check resumeUrl state as well
      setOpenDialog(true);
    } else {
      // Otherwise, directly open the file dialog
      fileInputRef.current.click();
    }
  };

  const confirmUpload = () => {
    setOpenDialog(false);
    fileInputRef.current.click(); // Trigger file input after confirmation
  };

  // --- Render Logic ---

  // Determine Apply button state and text
  const isApplyDisabled = !applyButton || uploading; // Disable if no resume, already applied, or uploading
  const applyButtonText = applied
    ? "View Application Status"
    : uploading
    ? "Uploading Resume..."
    : "Submit Application";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "white", // Original background color
        flexDirection: "column",
        minHeight: "100vh",
        py: 4,
      }}
    >

      {/* Title Section */}
      <Box sx={{ p: { xs: 3, md: 6 }, textAlign: "center", mb: 4 }}>
        <Typography
          sx={{
            color: "#404258",
            fontFamily: "Satoshi",
            fontSize: { lg: "32px", md: "32px", xs: "23px", sm: "23px" },
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

      {/* Main Content Box */}
      {/* Reverted to original Box structure and styling */}
      <Box
        sx={{
          p: 4,
          border: "2px solid #00000040",
          borderRadius: "20px",
          mb: 6, // Adjusted margin to give some space below
          maxWidth: 600, // Limited max width for readability as before
          width: "100%", // Take full width up to max
          bgcolor: "white", // Ensure white background inside border
        }}
      >
        {/* Resume Upload Section */}
        <Box mb={4} sx={{ textAlign: "center" }}>
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

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            style={{ display: "none" }}
          />

          <Box
            mt={2}
            display="flex"
            gap={2}
            justifyContent="center"
            flexWrap="wrap"
          >
            {resumeUrl && (
              <Button
                variant="contained" // Keep original contained style for view
                href={resumeUrl}
                target="_blank"
                sx={{
                  bgcolor: "#3C7EFC", // Use primary color
                  color: "white",
                  fontFamily: "Satoshi",
                  fontWeight: 700,
                  borderRadius: 16, // Original border radius
                  textTransform: "none",
                }}
                startIcon={<FiEye size={18} />}
              >
                View Resume
              </Button>
            )}
            <Button
              variant="contained" // Keep original contained style for upload
              onClick={openFileDialog}
              disabled={uploading}
              sx={{
                bgcolor: "#3C7EFC",
                color: "white",
                fontFamily: "Satoshi",
                fontWeight: 700,
                borderRadius: 16,
                textTransform: "none",
                "&:hover": { bgcolor: "#3C7EFC" }, // Hover effect
                "&:disabled": { bgcolor: "#a0c3fc", color: "#fff" }, // Disabled state
              }}
              startIcon={
                uploading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CloudUploadIcon />
                )
              }
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </Button>
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              color: "#808195", // Text secondary color
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 400,
              mt: 1,
            }}
          >
            Supported Format: PDF (Max 2MB)
          </Typography>
        </Box>

        {Array.isArray(user?.experienceHistory) && user.experienceHistory.length === 0 && (
        <Box sx={{ mb: 3, textAlign: 'center'}}>
          <Typography sx={{ color: '#d32f2f', fontFamily: 'Satoshi', fontWeight: 700, fontSize: '1rem' }}>
            Hey there! It looks like your profile is missing work experience complete it to stay ahead of the competition.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/user-profile')}
            sx={{ mt: 2, bgcolor: '#3C7EFC', color: 'white', fontFamily: 'Satoshi', fontWeight: 700, borderRadius: 16, textTransform: 'none' }}
          >
            Complete Your Profile
          </Button>
        </Box>
      )}

        {/* Screening Questions Section */}
        {filteredQuestions?.length > 0 && (


          <Box mb={4}>
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: 700,
                fontSize: "20px",
                color: "#404258",
              }}
              mb={4} // Original margin
            >
              Company Screening Questions
            </Typography>
            {filteredQuestions.map((question, index) => (
              // Keep question Box styling simple like the original TextField structure
              <Box key={question._id || `q-${index}`} mb={3}>
                {" "}
                {/* Use _id if available, fallback to index */}
                <Typography
                  sx={{
                    fontFamily: "Satoshi",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#404258",
                    mb: 1, // Margin below question text
                  }}
                >
                  Question {index + 1}: {question.question}
                  {question.isMandatory && (
                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                  )}
                </Typography>
                {/* --- Conditional Rendering of Answer Input --- */}
                {/* Apply styling to inputs to visually match the original TextField */}
                {question.questionType === "yes/no" && (
                  <RadioGroup
                    row // Display radios in a row
                    // value is the string 'yes' or 'no' based on the boolean answer state
                    value={
                      formData.answers[index] === true
                        ? "yes"
                        : formData.answers[index] === false
                        ? "no"
                        : ""
                    }
                    onChange={(e) =>
                      handleYesNoAnswerChange(index, e.target.value)
                    }
                    sx={{
                      "& .MuiFormControlLabel-root": {
                        // Style the radio button container
                        marginRight: { xs: 1, sm: 3 }, // Spacing between options
                        // Align radio button visually with TextField input
                        "& .MuiButtonBase-root": {
                          padding: "8px", // Match size of TextField size="small" padding area
                        },
                      },
                      fontFamily: "Poppins", // Match surrounding text font
                      fontSize: "14px",
                      color: "#404258", // Match surrounding text color
                    }}
                  >
                    {/* Use Typography in label to control font/size */}
                    <FormControlLabel
                      value="yes"
                      control={<Radio size="small" />}
                      label={
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.875rem",
                            fontFamily: "Poppins",
                            color: "#404258",
                          }}
                        >
                          Yes
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio size="small" />}
                      label={
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.875rem",
                            fontFamily: "Poppins",
                            color: "#404258",
                          }}
                        >
                          No
                        </Typography>
                      }
                    />
                  </RadioGroup>
                )}
                {question.questionType === "single_choice" &&
                  Array.isArray(question.options) &&
                  question.options.length > 0 && (
                    <RadioGroup
                      // value should be the selected option string
                      value={formData.answers[index] || ""}
                      onChange={(e) =>
                        handleSingleChoiceAnswerChange(index, e.target.value)
                      }
                      sx={{
                        "& .MuiFormControlLabel-root": {
                          // Style the radio button container
                          marginBottom: 0.5, // Small margin below each option
                          "& .MuiButtonBase-root": {
                            // Style the radio button itself
                            padding: "8px", // Match size of TextField size="small" padding area
                          },
                        },
                        fontFamily: "Poppins", // Match surrounding text font
                        fontSize: "14px",
                        color: "#404258", // Match surrounding text color
                      }}
                    >
                      {question.options.map((option, optIndex) => (
                        // Use Typography in label to control font/size
                        <FormControlLabel
                          key={optIndex}
                          value={option} // Value is the option text
                          control={<Radio size="small" />}
                          label={
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.875rem",
                                fontFamily: "Poppins",
                                color: "#404258",
                              }}
                            >
                              {option}
                            </Typography>
                          }
                        />
                      ))}
                    </RadioGroup>
                  )}
                {question.questionType === "multi_choice" &&
                  Array.isArray(question.options) &&
                  question.options.length > 0 && (
                    <Box
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        color: "#404258",
                        display: "flex",
                        flexWrap: "wrap", // Wrap to next line on small screens
                        gap: 2, // spacing between items
                        alignItems: "center",
                      }}
                    >
                      {question.options.map((option, optIndex) => (
                        <FormControlLabel
                          key={optIndex}
                          control={
                            <Checkbox
                              checked={
                                Array.isArray(formData.answers[index]) &&
                                formData.answers[index].includes(option)
                              }
                              onChange={(e) =>
                                handleMultiChoiceAnswerChange(
                                  index,
                                  option,
                                  e.target.checked
                                )
                              }
                              color="primary"
                              size="small"
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.875rem",
                                fontFamily: "Poppins",
                                color: "#404258",
                              }}
                            >
                              {option}
                            </Typography>
                          }
                          sx={{
                            margin: 0,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                {/* Default to TextField for Short/Long Answer or unknown types */}
                {(question.questionType === "short_answer" ||
                  question.questionType === "long_answer" ||
                  !["yes/no", "single_choice", "multi_choice"].includes(
                    question.questionType
                  )) && (
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    // Apply consistent TextField styles
                    sx={textFieldStyles}
                    value={formData.answers[index] || ""}
                    onChange={(e) =>
                      handleTextAnswerChange(index, e.target.value)
                    }
                    multiline={question.questionType === "long_answer"} // Enable multiline for long answer
                    rows={question.questionType === "long_answer" ? 3 : 1} // Set rows for long answer
                    placeholder={`Enter your answer...`} // Placeholder text
                    // Note: Mui TextField required prop adds * visual, actual validation is in handler
                    required={question.isMandatory}
                  />
                )}
                {/* Message if choice question has no options */}
                {(question.questionType === "single_choice" ||
                  question.questionType === "multi_choice") &&
                  (!Array.isArray(question.options) ||
                    question.options.length === 0) && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ mt: 1, fontSize: "0.75rem" }}
                    >
                      Error: No options available for this question.
                    </Typography>
                  )}
              </Box>
            ))}
          </Box>
        )}

        {/* Message if no screening questions */}
        {filteredQuestions?.length === 0 && (
          <Box
            mb={4}
            sx={{
              textAlign: "center",
              py: 2,
              border: "1px dashed #ccc",
              borderRadius: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: 500,
                fontSize: "14px",
                color: "#404258",
              }}
            >
              No screening questions provided for this job.
            </Typography>
          </Box>
        )}

        {/* Apply Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={applyHandler}
            disabled={isApplyDisabled || submitting} // Add submitting to disabled condition
            sx={{
              borderRadius: 16,
              textTransform: "none",
              fontFamily: "Satoshi",
              fontWeight: 700,
              py: 1.5,
              bgcolor: applied ? "success.main" : "#3C7EFC",
              "&:hover": {
                bgcolor: applied ? "success.dark" : "#3C7EFC",
              },
              "&:disabled": { bgcolor: "#a0c3fc", color: "#fff" },
            }}
          >
            {submitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Submitting Application...
              </>
            ) : uploading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Uploading Resume...
              </>
            ) : (
              applyButtonText
            )}
          </Button>
      </Box>

      {/* Resume Upload Confirmation Dialog (Kept original style) */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Upload New Resume?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You currently have a resume uploaded. Uploading a new one will
            replace it. Do you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>{" "}
          {/* Keep original color */}
          <Button onClick={confirmUpload} color="primary" variant="contained">
            {" "}
            {/* Keep original color and variant */}
            Replace Resume
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications (Kept original style/placement) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000} // Original duration
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Original position
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          // Original Alert style might just be default or outlined, stick to simple Alert
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScreeningView;
