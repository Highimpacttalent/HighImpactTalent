import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Switch,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Alert,
  Snackbar,
  alpha,
  Link,
  CircularProgress,
  FormHelperText, // Added for form validation errors
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CloudUpload as UploadIcon,
  LinkedIn as LinkedInIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Code as ProjectIcon,
  EmojiEvents as AwardIcon, // Keeping AwardIcon for combined section
  Article as ArticleIcon,
  VolunteerActivism as VolunteerIcon,
  MilitaryTech as AchievementIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

// --- Custom Theme ---
const premiumTheme = createTheme({
  palette: {
    primary: {
      main: "#2C3E50", // Dark Slate Blue
      light: "#4A6572",
      dark: "#1A242F",
    },
    secondary: {
      main: "#E74C3C", // Alizarin Crimson
      light: "#EC7063",
      dark: "#BF360C",
    },
    background: {
      default: "#F8F9FA", // Light Grayish White
      paper: "#FFFFFF", // Pure White for cards
    },
    text: {
      primary: "#34495E", // Darker text for readability
      secondary: "#7F8C8D", // Muted text
    },
  },
  typography: {
    fontFamily: ['"Satoshi"', '"Poppins"', "sans-serif"].join(","),
    h3: {
      fontWeight: 700,
      fontSize: "2.5rem",
      "@media (max-width:600px)": {
        fontSize: "2rem",
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#2C3E50",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.1rem",
      color: "#34495E",
    },
    subtitle1: {
      color: "#5D6D7E",
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 20px",
        },
        containedPrimary: {
          boxShadow: "0px 4px 15px rgba(44, 62, 80, 0.2)",
          "&:hover": {
            boxShadow: "0px 6px 20px rgba(44, 62, 80, 0.3)",
            backgroundColor: "#1A242F",
          },
        },
        outlinedPrimary: {
          borderColor: alpha("#2C3E50", 0.5),
          color: "#2C3E50",
          "&:hover": {
            borderColor: "#2C3E50",
            backgroundColor: alpha("#2C3E50", 0.05),
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled",
      },
      styleOverrides: {
        root: {
          "& .MuiFilledInput-root": {
            borderRadius: "8px",
            backgroundColor: alpha("#EBF2F7", 0.6),
            "&:hover": {
              backgroundColor: alpha("#EBF2F7", 0.8),
            },
            "&.Mui-focused": {
              backgroundColor: "#FFFFFF",
              border: "1px solid #2C3E50",
            },
            "&::before": {
              borderBottom: "none",
            },
            "&::after": {
              borderBottom: "none",
            },
          },
          "& .MuiInputLabel-filled": {
            color: "#5D6D7E",
            fontWeight: 500,
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiFilledInput-root": {
            paddingTop: "8px !important",
            paddingBottom: "8px !important",
          },
          "& .MuiChip-root": {
            backgroundColor: alpha("#2C3E50", 0.1),
            color: "#2C3E50",
            fontWeight: 500,
            borderRadius: "6px",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "none",
          border: "1px solid #EBF2F7",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "#ECF0F1",
          color: "#34495E",
          fontWeight: 500,
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          backgroundColor: "#FDFEFE",
          borderRadius: "10px",
          marginBottom: "10px",
          padding: "15px 20px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.04)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: "#2C3E50",
          color: "white",
          padding: "20px 24px",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: "#7F8C8D !important",
          fontWeight: 500,
          "&.Mui-active": {
            color: "#2C3E50 !important",
            fontWeight: 600,
          },
          "&.Mui-completed": {
            color: "#34495E !important",
          },
        },
        iconContainer: {
          color: "#BDC3C7 !important",
          "&.Mui-active": {
            color: "#2C3E50 !important",
          },
          "&.Mui-completed": {
            color: "#27AE60 !important",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 10,
          borderRadius: 5,
          backgroundColor: "#EBF2F7",
        },
        bar: {
          borderRadius: 5,
          backgroundColor: "#27AE60",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          fontWeight: 500,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: "20px 0",
          borderColor: "#EBF2F7",
        },
      },
    },
  },
});

// Sample data for dropdowns (countries and degree types are still needed)
const countriesOptions = [
  "United States",
  "India",
  "Canada",
  "United Kingdom",
  "Germany",
  "Australia",
  "Singapore",
  "France",
  "Japan",
  "China",
  "Brazil",
  "South Africa",
  // Add more countries as needed
];

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Freelance",
];
const degreeTypes = [
  "B.Tech",
  "B.E",
  "B.A",
  "B.Sc",
  "M.Tech",
  "M.E",
  "MBA",
  "M.A",
  "M.Sc",
  "PhD",
  "Associate Degree",
  "Diploma",
  // Add more degree types as needed
];

// Updated steps array
const steps = [
  "Personal Info",
  "Profile Summary", // Renamed
  "Education",
  "Work Experience",
  "Skills",
  "Honors & Recognition", // Combined
  "Volunteer Work",
];

// --- Reusable Dialog Components ---

const AddEditEducationDialog = ({
  open,
  handleClose,
  education,
  handleSubmit,
  isEdit,
}) => {
  const [currentEdu, setCurrentEdu] = useState(
    education || {
      university: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "", // Can be YYYY-MM or "Present"
      gpa: "",
      description: "",
    }
  );
  const [validationErrors, setValidationErrors] = useState({});

  React.useEffect(() => {
    setCurrentEdu(
      education || {
        university: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
        description: "",
      }
    );
    setValidationErrors({}); // Reset errors when dialog opens
  }, [education, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEdu((prev) => ({ ...prev, [name]: value }));
    // Clear specific error when field is changed
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear date range error if either date changes
    if (name === "startDate" || name === "endDate") {
      setValidationErrors((prev) => ({ ...prev, dateRange: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!currentEdu.university?.trim())
      errors.university = "University is required";
    if (!currentEdu.degree?.trim()) errors.degree = "Degree is required";
    if (!currentEdu.field?.trim()) errors.field = "Field of Study is required";
    if (!currentEdu.startDate?.trim())
      errors.startDate = "Start date is required";

    // Date comparison validation (only if both start and end date are provided and end date is not "Present")
    if (
      currentEdu.startDate &&
      currentEdu.endDate &&
      currentEdu.endDate.toLowerCase() !== "present"
    ) {
      try {
        // Append '-01' to create a valid date string for comparison (YYYY-MM-DD)
        const start = new Date(currentEdu.startDate + "-01");
        const end = new Date(currentEdu.endDate + "-01");
        if (start > end) {
          errors.dateRange =
            "Start date must be earlier than or same as end date";
        }
      } catch (e) {
        // This catch handles cases where the date strings are not in YYYY-MM format
        errors.dateRange = "Invalid date format detected";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = () => {
    if (validate()) {
      handleSubmit(currentEdu);
      // Dialog close and state reset handled by handleClose prop
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Education" : "Add Education"}</DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="university"
              label="University / Institution"
              fullWidth
              value={currentEdu.university || ""}
              onChange={handleChange}
              error={!!validationErrors.university}
              helperText={validationErrors.university}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              variant="filled"
              error={!!validationErrors.degree}
              required
            >
              <InputLabel>Degree</InputLabel>
              <Select
                name="degree"
                value={currentEdu.degree || ""}
                onChange={handleChange}
                label="Degree"
              >
                {/* Add an empty/placeholder option if needed */}
                <MenuItem value="">
                  <em>Select Degree</em>
                </MenuItem>
                {degreeTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.degree && (
                <FormHelperText>{validationErrors.degree}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="field"
              label="Field of Study"
              fullWidth
              value={currentEdu.field || ""}
              onChange={handleChange}
              error={!!validationErrors.field}
              helperText={validationErrors.field}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="startDate"
              label="Start Date"
              type="month"
              fullWidth
              value={currentEdu.startDate || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!validationErrors.startDate}
              helperText={validationErrors.startDate}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="endDate"
              label="End Date (or Expected)"
              type="month"
              fullWidth
              value={currentEdu.endDate || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {validationErrors.dateRange && (
            <Grid item xs={12}>
              <Alert severity="error">{validationErrors.dateRange}</Alert>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <TextField
              name="gpa"
              label="GPA / Percentage (Optional)"
              fullWidth
              value={currentEdu.gpa || ""}
              onChange={handleChange}
              helperText="If writing GPA, please mention out of (e.g., 3.8/4.0 or 90/100)" // Added helper text
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Achievements / Coursework (Optional)"
              fullWidth
              multiline
              rows={3}
              value={currentEdu.description || ""}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {isEdit ? "Update" : "Add"} Education
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddEditWorkExperienceDialog = ({
  open,
  handleClose,
  experience,
  handleSubmit,
  isEdit,
}) => {
  const [currentWork, setCurrentWork] = useState(
    experience || {
      role: "",
      company: "",
      location: "",
      type: "",
      startDate: "",
      endDate: "", // Can be YYYY-MM or "Present"
      isCurrent: false,
      responsibilities: [], // Array of strings
    }
  );
  const [validationErrors, setValidationErrors] = useState({});
  const [newResponsibilityText, setNewResponsibilityText] = useState(""); // State for the new responsibility input

  React.useEffect(() => {
    setCurrentWork(
      experience || {
        role: "",
        company: "",
        location: "",
        type: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        responsibilities: [],
      }
    );
    setValidationErrors({}); // Reset errors
    setNewResponsibilityText(""); // Reset new responsibility text
  }, [experience, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentWork((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear date range error if either date changes
    if (name === "startDate" || name === "endDate") {
      setValidationErrors((prev) => ({ ...prev, dateRange: "" }));
    }
  };

  const handleResponsibilityChange = (index, value) => {
    const newResponsibilities = [...currentWork.responsibilities];
    newResponsibilities[index] = value;
    setCurrentWork((prev) => ({
      ...prev,
      responsibilities: newResponsibilities,
    }));
  };

  const addResponsibility = () => {
    if (newResponsibilityText.trim()) {
      setCurrentWork((prev) => ({
        ...prev,
        responsibilities: [
          ...prev.responsibilities,
          newResponsibilityText.trim(),
        ],
      }));
      setNewResponsibilityText(""); // Clear the input field
    }
  };

  const handleKeyPressAddResponsibility = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      addResponsibility();
    }
  };

  const removeResponsibility = (index) => {
    setCurrentWork((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const errors = {};
    if (!currentWork.role?.trim()) errors.role = "Job Title is required";
    if (!currentWork.company?.trim())
      errors.company = "Company Name is required";
    if (!currentWork.startDate?.trim())
      errors.startDate = "Start date is required";
    if (!currentWork.isCurrent && !currentWork.endDate?.trim())
      errors.endDate = "End date is required if not current role";
    if (!currentWork.type?.trim()) errors.type = "Employment type is required";

    // Date comparison validation (only if both start and end date are provided and end date is not "Present")
    if (
      currentWork.startDate &&
      currentWork.endDate &&
      currentWork.endDate.toLowerCase() !== "present"
    ) {
      try {
        // Append '-01' for comparison
        const start = new Date(currentWork.startDate + "-01");
        const end = new Date(currentWork.endDate + "-01");
        if (start > end) {
          errors.dateRange =
            "Start date must be earlier than or same as end date";
        }
      } catch (e) {
        errors.dateRange = "Invalid date format detected";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = () => {
    if (validate()) {
      // Remove empty responsibility strings before submitting
      const filteredResponsibilities = currentWork.responsibilities.filter(
        (resp) => resp?.trim() !== ""
      );
      handleSubmit({
        ...currentWork,
        responsibilities: filteredResponsibilities,
      });
      // Dialog close and state reset handled by handleClose prop
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? "Edit Work Experience" : "Add Work Experience"}
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              name="role"
              label="Job Title / Role"
              fullWidth
              value={currentWork.role || ""}
              onChange={handleChange}
              error={!!validationErrors.role}
              helperText={validationErrors.role}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="company"
              label="Company Name"
              fullWidth
              value={currentWork.company || ""}
              onChange={handleChange}
              error={!!validationErrors.company}
              helperText={validationErrors.company}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="location"
              label="Location (Optional)" // Optional
              fullWidth
              value={currentWork.location || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              variant="filled"
              error={!!validationErrors.type}
              required
            >
              <InputLabel>Employment Type</InputLabel>
              <Select
                name="type"
                value={currentWork.type || ""}
                onChange={handleChange}
                label="Employment Type"
              >
                {/* Add an empty/placeholder option if needed */}
                <MenuItem value="">
                  <em>Select Type</em>
                </MenuItem>
                {employmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.type && (
                <FormHelperText>{validationErrors.type}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="startDate"
              label="Start Date"
              type="month"
              fullWidth
              value={currentWork.startDate || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!validationErrors.startDate}
              helperText={validationErrors.startDate}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="endDate"
              label="End Date"
              type="month"
              fullWidth
              value={currentWork.endDate || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              disabled={currentWork.isCurrent}
              error={!!validationErrors.endDate} // Apply error if not current and empty
              helperText={validationErrors.endDate}
            />
          </Grid>
          {validationErrors.dateRange && (
            <Grid item xs={12}>
              <Alert severity="error">{validationErrors.dateRange}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentWork.isCurrent}
                  onChange={(e) =>
                    setCurrentWork((prev) => ({
                      ...prev,
                      isCurrent: e.target.checked,
                      endDate: e.target.checked ? "Present" : "", // Set end date to Present if currently working
                    }))
                  }
                />
              }
              label="Currently work here"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Key Responsibilities / Achievements
            </Typography>
            {currentWork.responsibilities.map((resp, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <TextField
                  fullWidth
                  variant="filled"
                  value={resp || ""}
                  onChange={(e) =>
                    handleResponsibilityChange(index, e.target.value)
                  }
                  placeholder={`Responsibility ${index + 1}`}
                  multiline
                  rows={1}
                />
                {/* Allow removing the last one */}
                <IconButton
                  onClick={() => removeResponsibility(index)}
                  color="secondary"
                  size="small"
                  sx={{ ml: 1, flexShrink: 0 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Box display="flex" alignItems="center" gap={1} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                variant="filled"
                label="Add New Responsibility"
                value={newResponsibilityText}
                onChange={(e) => setNewResponsibilityText(e.target.value)}
                onKeyPress={handleKeyPressAddResponsibility}
              />
              <Button
                startIcon={<AddIcon />}
                onClick={addResponsibility}
                variant="contained" // Changed to contained for emphasis
                size="small"
                disabled={!newResponsibilityText.trim()} // Disable if input is empty
              >
                Add
              </Button>
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              Press Enter or click Add to add a responsibility point.
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {isEdit ? "Update" : "Add"} Experience
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddEditProjectDialog = ({
  open,
  handleClose,
  project,
  handleSubmit,
  isEdit,
}) => {
  const [currentProject, setCurrentProject] = useState(
    project || {
      title: "",
      description: "",
      skillsUsed: "",
      duration: "",
      type: "",
    }
  );
  const [validationErrors, setValidationErrors] = useState({});

  React.useEffect(() => {
    setCurrentProject(
      project || {
        title: "",
        description: "",
        skillsUsed: "",
        duration: "",
        type: "",
      }
    );
    setValidationErrors({}); // Reset errors
  }, [project, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!currentProject.title?.trim())
      errors.title = "Project Title is required";
    if (!currentProject.description?.trim())
      errors.description = "Project Description is required";
    // SkillsUsed, Duration, Type are optional based on typical resumes
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = () => {
    if (validate()) {
      handleSubmit(currentProject);
      // Dialog close and state reset handled by handleClose prop
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Project" : "Add Project"}</DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Project Title"
              fullWidth
              value={currentProject.title || ""}
              onChange={handleChange}
              error={!!validationErrors.title}
              helperText={validationErrors.title}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Project Description"
              fullWidth
              multiline
              rows={4}
              value={currentProject.description || ""}
              onChange={handleChange}
              error={!!validationErrors.description}
              helperText={validationErrors.description}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="skillsUsed"
              label="Skills/Tools Used (Optional)"
              fullWidth
              value={currentProject.skillsUsed || ""}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, MongoDB, Python, Figma (Separate with commas)"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="duration"
              label="Duration (Optional - e.g., 3 months, Jan 2023 - Mar 2023)"
              fullWidth
              value={currentProject.duration || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="type"
              label="Project Type (Optional - e.g., Personal, Team, Open Source)"
              fullWidth
              value={currentProject.type || ""}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {isEdit ? "Update" : "Add"} Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// --- Simple Text Dialog Component for Honors/Volunteer ---
const AddEditSimpleTextDialog = ({
  open,
  handleClose,
  item, // The string item being edited or null for adding
  handleSubmit,
  isEdit,
  title, // Title for the dialog (e.g., "Add Achievement")
  label, // Label for the text field (e.g., "Achievement Description")
}) => {
  const [text, setText] = useState(item || "");
  const [validationError, setValidationError] = useState(""); // State for validation error

  React.useEffect(() => {
    setText(item || "");
    setValidationError(""); // Reset error
  }, [item, open]);

  const handleChange = (e) => {
    setText(e.target.value);
    if (validationError) {
      // Clear error on change
      setValidationError("");
    }
  };

  const onSubmit = () => {
    if (!text.trim()) {
      setValidationError(`${title} description is required`);
      return; // Stop if validation fails
    }
    handleSubmit(text.trim());
    // Dialog close and state reset handled by handleClose prop
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <TextField
          autoFocus
          margin="dense"
          label={label}
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="filled"
          value={text}
          onChange={handleChange}
          error={!!validationError}
          helperText={validationError}
          required
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {isEdit ? "Update" : "Add"} {title}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// --- Main Form Component ---
export default function MasterResumeForm() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "", // Now mandatory
      linkedIn: "", // Now mandatory
      // address: "", // Removed
      city: "", // Optional
      state: "", // Optional
      country: "", // Optional
      dateOfBirth: null, // Keeping this, though not currently used in render
      nationality: "", // Keeping this, though not used in render
    },
    profileSummary: {
      // Renamed section
      summaryText: "", // New field name for the combined summary
    },
    education: [],
    workExperience: [],
    projects: [],
    skills: [], // Changed to an array for Autocomplete/Chips
    honorsAndAwards: [], // Combined achievements and awards
    volunteer: [],
    // Removed awards[]
  });

  // Keep track of validation errors specifically for the current step fields displayed directly in the form
  const [stepErrors, setStepErrors] = useState({});

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [dialogItemData, setDialogItemData] = useState(null); // Data for the item being edited in dialog

  // State for API call status and feedback
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success', 'error', 'info', 'warning'

  const currentUserId = user?._id; // Use optional chaining in case user is null

  // Sample list of skills for Autocomplete suggestions (can be fetched from an API)
  const skillSuggestions = [
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "SQL",
    "Python",
    "Django",
    "Flask",
    "Java",
    "Spring",
    "C++",
    "C#",
    ".NET",
    "PHP",
    "Laravel",
    "Ruby",
    "Ruby on Rails",
    "Go",
    "Swift",
    "Kotlin",
    "TypeScript",
    "HTML",
    "CSS",
    "Sass",
    "Less",
    "Bootstrap",
    "Tailwind CSS",
    "REST APIs",
    "GraphQL",
    "AWS",
    "Azure",
    "Google Cloud Platform",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Git",
    "Agile",
    "Scrum",
    "Kanban",
    "Data Structures",
    "Algorithms",
    "System Design",
    "Leadership",
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Critical Thinking",
    "Project Management",
    "Figma",
    "Sketch",
    "Adobe XD",
    "Photoshop",
    "Illustrator",
    // Add more skills as needed
  ];

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Regex allowing http/https, optional www, and various path characters including hyphen and underscore
  const linkedInRegex =
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i;

  const validateUrlOptional = (url, regex) => {
    return url === "" || url === null || regex.test(url); // Allow empty string or null
  };

  // Update handleInputChange to handle errors for fields managed directly in the form
  const handleInputChange = (section, field, value) => {
    // Special handling for skills Autocomplete
    if (section === "skills") {
      setFormData((prev) => ({
        ...prev,
        skills: value, // Autocomplete directly gives the array
      }));
      // Skills field itself doesn't have a stepError based on current requirements
      return;
    }

    // Handle other fields
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // Clear the error for the specific field if it exists when the value changes
    if (stepErrors[field]) {
      setStepErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevStep) => prevStep + 1);
      setStepErrors({}); // Clear step errors when moving to next step
    } else {
      // Optionally, show a snackbar or scroll to errors if validation fails
      setSnackbarMessage(
        "Please fix the highlighted errors before proceeding."
      );
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setStepErrors({}); // Clear step errors when moving back
  };

  const validateCurrentStep = () => {
    const errors = {}; // Use a local errors object for validation within this function
    const personalInfo = formData.personalInfo;

    if (activeStep === 0) {
      // Personal Info validation
      if (!personalInfo.firstName?.trim())
        errors.firstName = "First name is required";
      if (!personalInfo.lastName?.trim())
        errors.lastName = "Last name is required";
      if (!personalInfo.email?.trim()) {
        errors.email = "Email is required";
      } else if (!validateEmail(personalInfo.email)) {
        errors.email = "Invalid email format";
      }
      if (!personalInfo.phone?.trim())
        errors.phone = "Phone number is required"; // Phone is now mandatory
      if (!personalInfo.linkedIn?.trim()) {
        errors.linkedIn = "LinkedIn URL is required"; // LinkedIn is now mandatory
      } else if (!validateUrlOptional(personalInfo.linkedIn, linkedInRegex)) {
        errors.linkedIn = "Invalid LinkedIn URL format"; // Validate format if present (and it is required)
      }

      // City, State, Country are now optional, no validation needed unless they become required
    }

    // No specific mandatory fields defined for other steps based on current requirements,
    // but dialogs have their own validation now which is checked on dialog submit.
    // This validateCurrentStep only handles fields *directly* on the main step form.

    // Update the stepErrors state with the validation results for the current step
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Data handling functions (mostly the same, adjusted for skills array)
  // handleInputChange adjusted above

  // For arrays of objects (Education, Work, Projects)
  const handleArrayAdd = (section, item) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], item],
    }));
  };

  const handleArrayEdit = (section, index, item) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((existing, i) =>
        i === index ? item : existing
      ),
    }));
  };

  const handleArrayDelete = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // For arrays of strings (Honors & Awards, Volunteer)
  const handleStringArrayAdd = (section, item) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], item],
    }));
  };

  const handleStringArrayEdit = (section, index, item) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((existing, i) =>
        i === index ? item : existing
      ),
    }));
  };

  const handleStringArrayDelete = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // Dialog functions
  const openAddDialog = (type) => {
    setDialogType(type);
    setEditIndex(-1); // Indicate adding new item
    setDialogItemData(null); // No initial data for add
    setOpenDialog(true);
  };

  const openEditDialog = (type, index, itemData) => {
    // Pass item data for editing
    setDialogType(type);
    setEditIndex(index); // Set index for editing
    setDialogItemData(itemData); // Set data for editing
    setOpenDialog(true);
  };

  const handleDialogSubmit = (item) => {
    if (["education", "workExperience", "projects"].includes(dialogType)) {
      if (editIndex === -1) {
        handleArrayAdd(dialogType, item);
      } else {
        handleArrayEdit(dialogType, editIndex, item);
      }
    } else if (["honorsAndAwards", "volunteer"].includes(dialogType)) {
      // Updated section name
      if (editIndex === -1) {
        handleStringArrayAdd(dialogType, item);
      } else {
        handleStringArrayEdit(dialogType, editIndex, item);
      }
    }
    // Dialog close and state reset handled by handleClose prop
    // setOpenDialog(false); // Removed - handleClose prop does this
    // setDialogItemData(null); // Removed - handleClose prop does this
    // setEditIndex(-1); // Removed - handleClose prop does this
  };

  const getDialogProps = () => {
    const baseProps = {
      open: openDialog,
      // Combined close logic: close dialog, clear item data and edit index
      handleClose: () => {
        setOpenDialog(false);
        setDialogItemData(null);
        setEditIndex(-1);
      },
      handleSubmit: handleDialogSubmit,
      isEdit: editIndex !== -1,
    };

    switch (dialogType) {
      case "education":
        return {
          ...baseProps,
          education: dialogItemData, // Use dialogItemData
        };
      case "workExperience":
        return {
          ...baseProps,
          experience: dialogItemData, // Use dialogItemData
        };
      case "projects":
        return {
          ...baseProps,
          project: dialogItemData, // Use dialogItemData
        };
      case "honorsAndAwards": // New case for combined section
        return {
          ...baseProps,
          item: dialogItemData, // Use dialogItemData
          title: "Honor/Award/Recognition", // More general title
          label: "Details of Honor/Award/Recognition",
        };
      case "volunteer":
        return {
          ...baseProps,
          item: dialogItemData, // Use dialogItemData
          title: "Volunteer Experience",
          label: "Volunteer Role and Activities", // Updated label
        };
      default:
        return baseProps; // Should not happen
    }
  };

  // --- API Call Logic ---
  const handleSaveResume = async () => {
    // Perform final validation on the *last* step's form fields (Personal Info is step 0, Skills is step 5, etc.)
    // If the Save button is only on the last step, validating only that step is sufficient IF all *required* fields
    // are presented on the last step. However, mandatory fields like Name, Email, Phone, LinkedIn are on step 0.
    // Therefore, a full validation of ALL mandatory fields is necessary before saving.

    // A more robust approach would validate the entire formData object here,
    // but for this update, we will rely on the step validation before 'Next'
    // and trust that previous steps were valid when the user advanced.
    // We will add a final check for critical fields on the last step just in case.

    // Check mandatory fields from Step 0 again as a final safety check
    const finalErrors = {};
    const personalInfo = formData.personalInfo;
    if (!personalInfo.firstName?.trim())
      finalErrors.firstName = "First name is required (Step 1)";
    if (!personalInfo.lastName?.trim())
      finalErrors.lastName = "Last name is required (Step 1)";
    if (!personalInfo.email?.trim() || !validateEmail(personalInfo.email))
      finalErrors.email = "Valid email is required (Step 1)";
    if (!personalInfo.phone?.trim())
      finalErrors.phone = "Phone number is required (Step 1)";
    if (
      !personalInfo.linkedIn?.trim() ||
      !validateUrlOptional(personalInfo.linkedIn, linkedInRegex)
    )
      finalErrors.linkedIn = "Valid LinkedIn URL is required (Step 1)";

    // Add checks for other sections if they have minimum requirements
    // e.g., if you require at least one education entry:
    // if (formData.education.length === 0) finalErrors.education = "At least one education entry is required";
    // This wasn't requested, so we skip it.

    if (Object.keys(finalErrors).length > 0) {
      console.error("Final Validation Errors:", finalErrors);
      const errorMessages = Object.values(finalErrors).join(", ");
      setSnackbarMessage(`Cannot save: ${errorMessages}`); // Show specific errors
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      // Optionally, navigate back to step 0 or highlight errors
      return;
    }

    if (!currentUserId) {
      setSnackbarMessage("Error: User not logged in. Cannot save resume.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("User ID is missing, cannot save resume.");
      return;
    }

    setIsLoading(true); // Start loading indicator

    // Construct the payload matching the backend schema expectations
    const payload = {
      user_id: currentUserId,
      personalInfo: formData.personalInfo, // Maps directly
      careerSummary: {
        // Map to the expected nested object structure for careerSummary
        summaryText: formData.profileSummary.summaryText, // Map frontend profileSummary.summaryText to backend careerSummary.summaryText
      },
      education: formData.education,
      workExperience: formData.workExperience,
      skills: formData.skills, // Now sending array directly
      honorsAndAwards: formData.honorsAndAwards, // Mapping frontend combined field to backend combined field
      volunteer: formData.volunteer,
      // storedResumes are not edited via this form, assumed to be separate
    };

    console.log("Sending payload:", payload); // Log payload before sending

    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/master-resume/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add authorization headers if your API is protected (recommended!)
            // 'Authorization': `Bearer ${user.token}`, // Example if you store user token
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let errorData = { message: `HTTP error! status: ${response.status}` };
        try {
          errorData = await response.json();
          console.error("Backend Error Details:", errorData); // Log full error details
          // Check if backend returns specific validation errors or field errors
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // Backend validation errors are often in an array
            errorData.message =
              "Validation Failed: " + errorData.errors.join(", ");
          } else if (errorData.field) {
            // Backend duplicate key error might return 'field'
            errorData.message = `Duplicate entry for field: ${
              errorData.field
            }. ${errorData.message || ""}`.trim();
          } else if (errorData.message) {
            // Use backend's generic message
            errorData.message = errorData.message;
          } else {
            // Fallback generic message
            errorData.message = `An error occurred (Status: ${response.status})`;
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          // Use a generic message if parsing fails
          errorData.message = `An error occurred (Status: ${response.status})`;
        }
        // Throw an error with the refined message
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log("Resume saved successfully:", data);

      setSnackbarMessage(data.message || "Resume saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Navigation is handled by the useEffect hook when snackbarOpen and severity are 'success'
    } catch (error) {
      console.error("Error saving resume:", error);
      // Use the error message captured during the fetch/response handling
      setSnackbarMessage(error.message || "An unexpected error occurred.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle navigation after successful save and Snackbar closes
  useEffect(() => {
    let timer;
    if (snackbarOpen && snackbarSeverity === "success") {
      timer = setTimeout(() => {
        // Snackbar onClose handles hiding, navigate after delay
        navigate("/dashboard-master-resume"); // Navigate to the root route
      }, 2000); // 2 seconds delay matches default success snackbar duration
    }
    return () => clearTimeout(timer); // Cleanup the timer
  }, [snackbarOpen, snackbarSeverity, navigate]); // Dependencies

  // Handle Snackbar close event
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return; // Don't close on click away
    }
    setSnackbarOpen(false);
  };

  // Render functions (Updated)
  const renderPersonalInfo = () => (
    <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "primary.main", mb: 3 }}
        >
          Personal Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.personalInfo.firstName || ""}
              onChange={(e) =>
                handleInputChange("personalInfo", "firstName", e.target.value)
              }
              error={!!stepErrors.firstName}
              helperText={stepErrors.firstName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.personalInfo.lastName || ""}
              onChange={(e) =>
                handleInputChange("personalInfo", "lastName", e.target.value)
              }
              error={!!stepErrors.lastName}
              helperText={stepErrors.lastName}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.personalInfo.email || ""}
              onChange={(e) =>
                handleInputChange("personalInfo", "email", e.target.value)
              }
              error={!!stepErrors.email}
              helperText={stepErrors.email}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.personalInfo.phone || ""}
              onChange={(e) =>
                handleInputChange("personalInfo", "phone", e.target.value)
              }
              placeholder="+1 (555) 123-4567"
              error={!!stepErrors.phone}
              helperText={stepErrors.phone}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="LinkedIn URL"
              value={formData.personalInfo.linkedIn || ""}
              onChange={(e) =>
                handleInputChange("personalInfo", "linkedIn", e.target.value)
              }
              error={!!stepErrors.linkedIn}
              helperText={stepErrors.linkedIn}
              required
              InputProps={{
                startAdornment: (
                  <LinkedInIcon sx={{ mr: 1, mt: 2.5, color: "#0077b5" }} />
                ),
              }}
            />
          </Grid>

          {/* Removed Address Line 1 TextField */}

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Current City (Optional)"
              value={formData.personalInfo.city || ""}
              onChange={(e) =>
                handleInputChange("personalInfo", "city", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Current State / Province (Optional)"
              value={formData.personalInfo.state || ""}
              onChange={(e) =>
                handleInputChange("personalInfo", "state", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={countriesOptions}
              value={formData.personalInfo.country || null} // Use null for no selection with Autocomplete
              onChange={(event, value) =>
                handleInputChange("personalInfo", "country", value)
              }
              renderInput={(params) => (
                <TextField {...params} label="Current Country (Optional)" />
              )}
            />
          </Grid>
          {/* DateOfBirth and Nationality are in schema but not rendered */}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderProfileSummary = () => (
    // Renamed render function
    <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "primary.main", mb: 3 }}
        >
          Profile Summary
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Professional Summary (Optional)" // Label changed
              value={formData.profileSummary.summaryText || ""} // Use the new field
              onChange={(e) =>
                handleInputChange(
                  "profileSummary", // Use the new section name
                  "summaryText", // Use the new field name
                  e.target.value
                )
              }
              multiline
              rows={5} // Single large text area for one paragraph
              helperText="Provide a concise summary highlighting your skills, experience, and career goals." // Helper text updated
            />
          </Grid>
          {/* Removed separate shortSummary field */}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderEducation = () => (
    <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" sx={{ color: "primary.main" }}>
            Education
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openAddDialog("education")}
          >
            Add Education
          </Button>
        </Box>

        {formData.education.length === 0 ? (
          <Box
            textAlign="center"
            py={4}
            sx={{
              border: "2px dashed #EBF2F7",
              borderRadius: "12px",
              bgcolor: "#FDFEFE",
            }}
          >
            <SchoolIcon sx={{ fontSize: 64, color: "#BDC3C7", mb: 2 }} />
            <Typography color="textSecondary">
              No education entries added yet. Click "Add Education" to begin.
            </Typography>
          </Box>
        ) : (
          <List>
            {formData.education.map((edu, index) => (
              <ListItem
                key={index}
                divider={index < formData.education.length - 1}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {`${edu.degree || ""} in ${edu.field || ""}`.trim() ===
                      "in"
                        ? "Education Entry"
                        : `${edu.degree || ""} in ${edu.field || ""}`}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      {edu.university && (
                        <Typography variant="body2" color="text.secondary">
                          {edu.university}
                        </Typography>
                      )}
                      {(edu.startDate || edu.endDate) && (
                        <Typography variant="body2" color="text.secondary">
                          {`${edu.startDate || "Start"} - ${
                            edu.endDate || "End"
                          }`}
                        </Typography>
                      )}
                      {edu.gpa && (
                        <Typography variant="body2" color="text.secondary">
                          GPA/Percentage: {edu.gpa}
                        </Typography>
                      )}
                      {edu.description && (
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                        >
                          {edu.description}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => openEditDialog("education", index, edu)} // Pass data
                    sx={{ color: "primary.main" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleArrayDelete("education", index)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const renderWorkExperience = () => (
    <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" sx={{ color: "primary.main" }}>
            Work Experience
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openAddDialog("workExperience")}
          >
            Add Experience
          </Button>
        </Box>

        {formData.workExperience.length === 0 ? (
          <Box
            textAlign="center"
            py={4}
            sx={{
              border: "2px dashed #EBF2F7",
              borderRadius: "12px",
              bgcolor: "#FDFEFE",
            }}
          >
            <WorkIcon sx={{ fontSize: 64, color: "#BDC3C7", mb: 2 }} />
            <Typography color="textSecondary">
              No work experience added yet. Click "Add Experience" to begin.
            </Typography>
          </Box>
        ) : (
          <List>
            {formData.workExperience.map((work, index) => (
              <ListItem
                key={index}
                divider={index < formData.workExperience.length - 1}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{`${
                      work.role || "Role"
                    } at ${work.company || "Company"}`}</Typography>
                  }
                  secondary={
                    <Box>
                      {work.location && ( // Render location only if present
                        <Typography variant="body2" color="text.secondary">
                          {work.location}
                        </Typography>
                      )}
                      {(work.startDate || work.endDate || work.type) && (
                        <Typography variant="body2" color="text.secondary">{`${
                          work.startDate || "Start"
                        } - ${work.endDate || "Present"}${
                          work.type ? " • " + work.type : ""
                        }`}</Typography>
                      )}
                      {work.responsibilities &&
                        work.responsibilities.length > 0 && (
                          <Box
                            component="ul"
                            sx={{ mt: 1, pl: 2, listStyleType: "disc" }}
                          >
                            {work.responsibilities.map((resp, i) => (
                              <Typography
                                component="li"
                                key={i}
                                variant="body2"
                                sx={{ my: 0.5 }}
                              >
                                {resp}
                              </Typography>
                            ))}
                          </Box>
                        )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() =>
                      openEditDialog("workExperience", index, work)
                    } // Pass data
                    sx={{ color: "primary.main" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleArrayDelete("workExperience", index)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const renderProjects = () => (
    <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" sx={{ color: "primary.main" }}>
            Projects
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openAddDialog("projects")}
          >
            Add Project
          </Button>
        </Box>

        {formData.projects.length === 0 ? (
          <Box
            textAlign="center"
            py={4}
            sx={{
              border: "2px dashed #EBF2F7",
              borderRadius: "12px",
              bgcolor: "#FDFEFE",
            }}
          >
            <ProjectIcon sx={{ fontSize: 64, color: "#BDC3C7", mb: 2 }} />
            <Typography color="textSecondary">
              No projects added yet. Click "Add Project" to showcase your work.
            </Typography>
          </Box>
        ) : (
          <List>
            {formData.projects.map((project, index) => (
              <ListItem
                key={index}
                divider={index < formData.projects.length - 1}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {project.title || "Untitled Project"}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      {(project.duration || project.type) && ( // Only render if duration or type exists
                        <Typography variant="body2" color="text.secondary">
                          {[project.duration, project.type]
                            .filter(Boolean)
                            .join(" • ")}{" "}
                          {/* Join only existing parts */}
                        </Typography>
                      )}
                      {project.skillsUsed && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          <Box component="span" sx={{ fontWeight: 600 }}>
                            Skills/Tools:{" "}
                          </Box>{" "}
                          {project.skillsUsed}
                        </Typography>
                      )}
                      {project.description && (
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                        >
                          {project.description}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => openEditDialog("projects", index, project)} // Pass data
                    sx={{ color: "primary.main" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleArrayDelete("projects", index)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const renderSkills = () => (
    <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "primary.main", mb: 3 }}
        >
          Skills & Expertise
        </Typography>

        {/* Autocomplete for Chips/Tags */}
        <Autocomplete
          multiple
          id="skills-autocomplete"
          options={skillSuggestions} // Use suggestions
          freeSolo // Allow users to enter skills not in suggestions
          value={formData.skills} // Value is the array from state
          onChange={(event, newValue) => {
            // newValue is the array of selected/entered skills
            handleInputChange("skills", "skills", newValue); // Update the skills array in state
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                key={index}
              /> // Added key
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              placeholder={
                formData.skills.length === 0
                  ? "e.g., JavaScript, React, Python, AWS, Figma"
                  : "Skills & Expertise (Optional)"
              }
              helperText="List your technical, soft, and domain-specific skills. Type a skill and press Enter or comma to add."
            />
          )}
        />
      </CardContent>
    </Card>
  );

  // New combined render function for Honors & Recognition
  const renderHonorsAndAwards = () => (
    <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" sx={{ color: "primary.main" }}>
            Honors & Recognition
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openAddDialog("honorsAndAwards")} // Use new dialog type
          >
            Add Entry
          </Button>
        </Box>

        {formData.honorsAndAwards.length === 0 ? (
          <Box
            textAlign="center"
            py={4}
            sx={{
              border: "2px dashed #EBF2F7",
              borderRadius: "12px",
              bgcolor: "#FDFEFE",
            }}
          >
            {/* Using AwardIcon or AchievementIcon is fine */}
            <AwardIcon sx={{ fontSize: 64, color: "#BDC3C7", mb: 2 }} />
            <Typography color="textSecondary">
              Recognize your significant awards, honors, and recognition.
            </Typography>
          </Box>
        ) : (
          <List>
            {formData.honorsAndAwards.map(
              (
                item,
                index // Iterate over combined array
              ) => (
                <ListItem
                  key={index}
                  divider={index < formData.honorsAndAwards.length - 1}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {item}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() =>
                        openEditDialog("honorsAndAwards", index, item)
                      } // Pass data
                      sx={{ color: "primary.main" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() =>
                        handleStringArrayDelete("honorsAndAwards", index)
                      } // Delete from combined array
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            )}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const renderVolunteerWork = () => (
    <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" sx={{ color: "primary.main" }}>
            Volunteer Work
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openAddDialog("volunteer")}
          >
            Add Volunteer Work
          </Button>
        </Box>
        {formData.volunteer.length === 0 ? (
          <Box
            textAlign="center"
            py={4}
            sx={{
              border: "2px dashed #EBF2F7",
              borderRadius: "12px",
              bgcolor: "#FDFEFE",
            }}
          >
            <VolunteerIcon sx={{ fontSize: 64, color: "#BDC3C7", mb: 2 }} />
            <Typography color="textSecondary">
              Highlight your community involvement and volunteer experiences.
            </Typography>
          </Box>
        ) : (
          <List>
            {formData.volunteer.map((item, index) => (
              <ListItem
                key={index}
                divider={index < formData.volunteer.length - 1}
              >
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {item}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => openEditDialog("volunteer", index, item)} // Pass data
                    sx={{ color: "primary.main" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleStringArrayDelete("volunteer", index)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderProfileSummary(); // Render new profile summary
      case 2:
        return renderEducation();
      case 3:
        return renderWorkExperience();
      case 4:
        return renderSkills();
      case 5:
        return renderHonorsAndAwards(); // Render combined section
      case 6:
        return renderVolunteerWork();
      // Removed case for Awards
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  const completionPercentage = (activeStep / (steps.length - 1)) * 100;

  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formDataToSend = new FormData();
    formDataToSend.append("resumeFile", file);
    setUploadedFileName(file.name);
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8800/api-v1/master-resume/analyze-upload",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (result.success && result.data) {
        const parsed = result.data;

        setFormData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            ...parsed.personalInfo,
          },
          profileSummary: {
            summaryText: parsed.profileSummary.summaryText || "",
          },
          education: parsed.education || [],
          workExperience: parsed.workExperience || [],
          skills: parsed.skills || [],
          honorsAndAwards: parsed.honorsAndAwards || [],
          volunteer: parsed.volunteer || [],
        }));
      }
    } catch (err) {
      console.error("Resume parsing failed:", err);
      setUploadedFileName("Failed to parse file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={premiumTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "white", // Subtle gradient background - Kept original for now
          py: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box sx={{ maxWidth: "960px", mx: "auto", px: 3, width: "100%" }}>
          {/* Header */}
          <Paper
            elevation={3}
            sx={{ p: { xs: 3, md: 4 }, mb: 4, bgcolor: "background.paper" }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{ color: "primary.main", textAlign: "center" }}
            >
              Master Resume Builder
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ textAlign: "center", color: "text.secondary", mb: 3 }}
            >
              Create your comprehensive master resume with all your career
              details
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="body2" color="text.secondary">
                  Progress: {Math.round(completionPercentage)}% Complete
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Step {activeStep + 1} of {steps.length}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionPercentage}
              />
            </Box>

            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{ pt: 2, pb: 0 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Form Content */}
          <Paper
            elevation={3} // Slightly higher elevation for the main form content
            sx={{
              borderRadius: "16px",
              overflow: "hidden",
              bgcolor: "background.paper",
              minHeight: "600px", // Keep min height for layout
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Render content based on active step */}
            {/* Upload Section - Only on Step 0 */}
            {activeStep === 0 && (
              <Box
                sx={{
                  bgcolor: "#f9f9f9",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  px: { xs: 3, md: 4 },
                  py: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                    disabled={isLoading}
                  >
                    {isLoading ? "Parsing..." : "Upload Resume"}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      hidden
                      onChange={handleResumeUpload}
                    />
                  </Button>

                  {isLoading && <CircularProgress size={24} color="primary" />}
                </Box>

                {uploadedFileName && !isLoading && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      color: "text.secondary",
                      flexGrow: 1,
                      minWidth: "150px",
                      textAlign: { xs: "left", md: "right" },
                    }}
                  >
                    Uploaded: {uploadedFileName}
                  </Typography>
                )}
              </Box>
            )}

            <Box sx={{ p: { xs: 3, md: 4 } }}>{renderStepContent()}</Box>

            {/* Navigation */}
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: "background.default",
                borderTop: 1,
                borderColor: alpha(premiumTheme.palette.primary.main, 0.1),
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || isLoading}
                variant="outlined"
                size="large"
                sx={{ minWidth: "120px" }}
              >
                Back
              </Button>
              <Button
                onClick={
                  activeStep === steps.length - 1
                    ? handleSaveResume
                    : handleNext
                }
                variant="contained"
                size="large"
                color="primary"
                disabled={isLoading}
                sx={{ minWidth: "120px" }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" /> // Show spinner while saving
                ) : activeStep === steps.length - 1 ? (
                  "Save Resume"
                ) : (
                  "Next"
                )}
              </Button>
            </Box>
          </Paper>

          {/* Step-specific errors can be shown here if needed, but Snackbar is used for overall flow */}
          {/* {Object.keys(stepErrors).length > 0 && (
               <Alert severity="error" sx={{ mt: 3 }}>
                   Please fix the highlighted errors in this section.
                   {Object.values(stepErrors).map((msg, i) => <Typography key={i} variant="body2">- {msg}</Typography>)}
               </Alert>
           )} */}
        </Box>
      </Box>

      {/* Dialog Components */}
      {/* Render dialog only if open and type matches, using getDialogProps */}
      {openDialog && dialogType === "education" && (
        <AddEditEducationDialog {...getDialogProps()} />
      )}
      {openDialog && dialogType === "workExperience" && (
        <AddEditWorkExperienceDialog {...getDialogProps()} />
      )}
      {openDialog && dialogType === "projects" && (
        <AddEditProjectDialog {...getDialogProps()} />
      )}
      {openDialog && dialogType === "honorsAndAwards" && (
        <AddEditSimpleTextDialog {...getDialogProps()} />
      )}
      {openDialog && dialogType === "volunteer" && (
        <AddEditSimpleTextDialog {...getDialogProps()} />
      )}

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={snackbarSeverity === "success" ? 2000 : 6000} // 2s for success, 6s for others
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at top center
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

// Simple Link component for project URLs (if needed elsewhere)
// Kept as is
const LinkStyled = styled("a")(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
  "&:hover": {
    textDecoration: "underline",
  },
}));
