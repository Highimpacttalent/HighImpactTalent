import React, { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
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
  Snackbar, // Using Snackbar for messages (can be success or error)
  alpha,
  Link, // Import Link for external URLs - Note: not used in the provided code
  CircularProgress, // Added for loading dialog
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CloudUpload as UploadIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as WebsiteIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Code as ProjectIcon,
  EmojiEvents as AwardIcon,
  Article as ArticleIcon,
  VolunteerActivism as VolunteerIcon,
  MilitaryTech as AchievementIcon, // Using MilitaryTech for Achievements
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
        variant: "filled", // Premium forms often use filled or standard with custom borders
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
          borderRadius: "16px", // Consistent large border radius for main containers
          boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.08)", // Softer, wider shadow
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "none", // Cards within the main paper should have no shadow
          border: "1px solid #EBF2F7", // Subtle border
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "#ECF0F1", // Light grey chip
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
          backgroundColor: "#FDFEFE", // Slightly off-white for list items
          borderRadius: "10px",
          marginBottom: "10px",
          padding: "15px 20px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.04)", // Subtle shadow for list items
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
          color: "#7F8C8D !important", // Default color
          fontWeight: 500,
          "&.Mui-active": {
            color: "#2C3E50 !important", // Active step color
            fontWeight: 600,
          },
          "&.Mui-completed": {
            color: "#34495E !important", // Completed step color
          },
        },
        iconContainer: {
          color: "#BDC3C7 !important", // Default icon color
          "&.Mui-active": {
            color: "#2C3E50 !important", // Active icon color
          },
          "&.Mui-completed": {
            color: "#27AE60 !important", // Completed icon color (Emerald Green)
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
          backgroundColor: "#27AE60", // Progress bar color (Emerald Green)
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
];

const steps = [
  "Personal Info",
  "Career Summary",
  "Education",
  "Work Experience",
  "Projects",
  "Skills",
  "Achievements", // Changed from Publications
  "Awards",
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
      endDate: "",
      gpa: "",
      description: "",
    }
  );

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
  }, [education, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEdu((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    handleSubmit(currentEdu);
    handleClose();
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
              value={currentEdu.university}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="filled">
              <InputLabel>Degree</InputLabel>
              <Select
                name="degree"
                value={currentEdu.degree}
                onChange={handleChange}
                label="Degree"
              >
                {degreeTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="field"
              label="Field of Study"
              fullWidth
              value={currentEdu.field}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="startDate"
              label="Start Date"
              type="month"
              fullWidth
              value={currentEdu.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="endDate"
              label="End Date (or Expected)"
              type="month"
              fullWidth
              value={currentEdu.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="gpa"
              label="GPA / Percentage (Optional)"
              fullWidth
              value={currentEdu.gpa}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Achievements / Coursework (Optional)"
              fullWidth
              multiline
              rows={3}
              value={currentEdu.description}
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
      endDate: "",
      isCurrent: false,
      responsibilities: [],
    }
  );

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
  }, [experience, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentWork((prev) => ({ ...prev, [name]: value }));
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
    setCurrentWork((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const removeResponsibility = (index) => {
    setCurrentWork((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = () => {
    // Remove empty responsibility strings before submitting
    const filteredResponsibilities = currentWork.responsibilities.filter(
      (resp) => resp.trim() !== ""
    );
    handleSubmit({ ...currentWork, responsibilities: filteredResponsibilities });
    handleClose();
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
              value={currentWork.role}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="company"
              label="Company Name"
              fullWidth
              value={currentWork.company}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="location"
              label="Location"
              fullWidth
              value={currentWork.location}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="filled">
              <InputLabel>Employment Type</InputLabel>
              <Select
                name="type"
                value={currentWork.type}
                onChange={handleChange}
                label="Employment Type"
              >
                {employmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="startDate"
              label="Start Date"
              type="month"
              fullWidth
              value={currentWork.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="endDate"
              label="End Date"
              type="month"
              fullWidth
              value={currentWork.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              disabled={currentWork.isCurrent}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentWork.isCurrent}
                  onChange={(e) =>
                    setCurrentWork((prev) => ({
                      ...prev,
                      isCurrent: e.target.checked,
                      endDate: e.target.checked ? "Present" : "",
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
                  value={resp}
                  onChange={(e) =>
                    handleResponsibilityChange(index, e.target.value)
                  }
                  placeholder={`Responsibility ${index + 1}`}
                  multiline
                  rows={1}
                />
                {currentWork.responsibilities.length > 1 && ( // Only show delete if more than one item
                   <IconButton
                   onClick={() => removeResponsibility(index)}
                   color="secondary"
                   size="small"
                   sx={{ ml: 1, flexShrink: 0 }}
                 >
                   <DeleteIcon fontSize="small"/>
                 </IconButton>
                )}
              </Box>
            ))}
             <Button
              startIcon={<AddIcon />}
              onClick={addResponsibility}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            >
              Add Responsibility
            </Button>
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
      skillsUsed: "", // Changed from technologies (array) to skillsUsed (string)
      duration: "",
      type: "", // e.g., "Personal", "Team", "Open Source"
    }
  );

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
  }, [project, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    handleSubmit(currentProject);
    handleClose();
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
              value={currentProject.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Project Description"
              fullWidth
              multiline
              rows={4}
              value={currentProject.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            {/* Changed Autocomplete for Technologies to TextField for Skills/Tools */}
            <TextField
              name="skillsUsed"
              label="Skills/Tools Used" // Changed label
              fullWidth
              value={currentProject.skillsUsed}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, MongoDB, Python, Figma (Separate with commas)"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="duration"
              label="Duration (e.g., 3 months, Jan 2023 - Mar 2023)"
              fullWidth
              value={currentProject.duration}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="type"
              label="Project Type (e.g., Personal, Team, Open Source)"
              fullWidth
              value={currentProject.type}
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

// --- New Dialog Components for simpler list items (Achievements, Awards, Volunteer) ---

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

    React.useEffect(() => {
      setText(item || "");
    }, [item, open]);

    const onSubmit = () => {
        if (text.trim()) { // Only submit if text is not empty
            handleSubmit(text.trim());
            handleClose();
            setText(""); // Reset for next add
        }
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
            onChange={(e) => setText(e.target.value)}
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
      phone: "",
      linkedIn: "", // Optional
      github: "", // Optional
      website: "", // Optional
      address: "",
      city: "",
      state: "",
      country: "",
      dateOfBirth: null, // Keeping this, though not currently used in render
      nationality: "", // Keeping this, though not currently used in render
      // Removed willingToRelocate
      // Removed workAuthorization
    },
    careerSummary: {
      shortSummary: "",
      detailedObjective: "",
    },
    education: [],
    workExperience: [],
    projects: [],
    skills: "", // Changed from object with arrays to a single string
    achievements: [], // Changed from publications, now an array of strings
    awards: [], // Now an array of strings
    volunteer: [], // Now an array of strings
  });

  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  // State for API call status and feedback
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success', 'error', 'info', 'warning'

  // Placeholder User ID - **Replace with actual user ID from auth**
  const currentUserId = user._id; // Example ID - use a real ID or derive from auth

  // Validation functions (kept as is)
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrlOptional = (url, regex) => {
    return url === "" || url === null || regex.test(url); // Allow empty string or null
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    const personalInfo = formData.personalInfo;

    if (activeStep === 0) {
      // Personal Info validation
      if (!personalInfo.firstName)
        newErrors.firstName = "First name is required";
      if (!personalInfo.lastName) newErrors.lastName = "Last name is required";
      if (!personalInfo.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(personalInfo.email)) {
        newErrors.email = "Invalid email format";
      }

      // URL validations (now optional, only validate if present)
      const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]+\/?$/; // Added underscore
      if (personalInfo.linkedIn && !validateUrlOptional(personalInfo.linkedIn, linkedInRegex)) {
        newErrors.linkedIn = "Invalid LinkedIn URL format";
      }

      const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-_]+\/?$/; // Added underscore
       if (personalInfo.github && !validateUrlOptional(personalInfo.github, githubRegex)) {
        newErrors.github = "Invalid GitHub URL format";
      }

       const websiteRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
        if (personalInfo.website && !validateUrlOptional(personalInfo.website, websiteRegex)) {
            newErrors.website = "Invalid website URL format";
        }
    }
    // Add validation for other steps here if needed before submitting

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Data handling functions
  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

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

  // For arrays of strings (Achievements, Awards, Volunteer)
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

  // Dialog functions (kept as is)
  const openAddDialog = (type) => {
    setDialogType(type);
    setEditIndex(-1); // Indicate adding new item
    setOpenDialog(true);
  };

  const openEditDialog = (type, index) => {
    setDialogType(type);
    setEditIndex(index); // Set index for editing
    setOpenDialog(true);
  };

  const handleDialogSubmit = (item) => {
    if (["education", "workExperience", "projects"].includes(dialogType)) {
      if (editIndex === -1) {
        handleArrayAdd(dialogType, item);
      } else {
        handleArrayEdit(dialogType, editIndex, item);
      }
    } else if (["achievements", "awards", "volunteer"].includes(dialogType)) {
         if (editIndex === -1) {
            handleStringArrayAdd(dialogType, item);
         } else {
            handleStringArrayEdit(dialogType, editIndex, item);
         }
    }
    setOpenDialog(false);
  };

  const getDialogProps = () => {
      const baseProps = {
          open: openDialog,
          handleClose: () => setOpenDialog(false),
          handleSubmit: handleDialogSubmit,
          isEdit: editIndex !== -1,
      };

      switch (dialogType) {
          case 'education':
              return {
                  ...baseProps,
                  education: editIndex !== -1 ? formData.education[editIndex] : null,
              };
          case 'workExperience':
              return {
                  ...baseProps,
                  experience: editIndex !== -1 ? formData.workExperience[editIndex] : null,
              };
          case 'projects':
              return {
                  ...baseProps,
                  project: editIndex !== -1 ? formData.projects[editIndex] : null,
              };
          case 'achievements':
              return {
                  ...baseProps,
                  item: editIndex !== -1 ? formData.achievements[editIndex] : null,
                  title: "Achievement",
                  label: "Achievement Description",
              };
          case 'awards':
              return {
                ...baseProps,
                item: editIndex !== -1 ? formData.awards[editIndex] : null,
                title: "Award",
                label: "Award Details",
              };
          case 'volunteer':
            return {
                ...baseProps,
                item: editIndex !== -1 ? formData.volunteer[editIndex] : null,
                title: "Volunteer Experience",
                label: "Volunteer Description",
            };
          default:
              return baseProps; // Should not happen
      }
  };

  // --- API Call Logic ---
  const handleSaveResume = async () => {
    // Perform final validation across all steps if needed
    // For simplicity, we'll just check the current step's validation here
    // and assume other steps don't have hard 'required' fields for now.
    // A more robust approach would validate the entire formData object.
    if (!validateCurrentStep()) {
        // Optionally scroll to the errors or show a specific message
        setSnackbarMessage("Please fix the highlighted errors in the current section.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return; // Stop if validation fails in the current step
     }

    // *** IMPORTANT: You should validate ALL required fields across ALL steps
    // before calling the API if you want to enforce data integrity.
    // This simple example only checks the current step's validation state 'errors'.


    if (!currentUserId) {
        setSnackbarMessage("Error: User ID is not available. Cannot save resume.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("User ID is missing, cannot save resume.");
        return; // Stop if user ID is missing
    }

    setIsLoading(true); // Start loading indicator

    // Construct the payload matching the backend schema expectations
    // Ensure keys match the Mongoose schema field names from the schema you provided!
    const payload = {
      user_id: currentUserId, // Add the user_id
      personalInfo: formData.personalInfo, // Matches schema field name
      careerSummary: formData.careerSummary, // Matches schema field name
      education: formData.education, // Matches schema field name
      workExperience: formData.workExperience, // Matches schema field name
      projects: formData.projects, // Matches schema field name
      skills: formData.skills, // This is the string from the form. Backend Controller converts it to array.
      achievements: formData.achievements, // Matches schema field name
      awards: formData.awards, // Matches schema field name
      volunteer: formData.volunteer, // Matches schema field name
    };

    console.log("Sending payload:", payload); // Log payload before sending

    try {
      const response = await fetch('https://highimpacttalent.onrender.com/api-v1/master-resume/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if your API is protected (recommended!)
          // 'Authorization': `Bearer YOUR_AUTH_TOKEN`, // Example
        },
        body: JSON.stringify(payload),
      });

      // Check for HTTP errors (status codes outside 2xx range)
      if (!response.ok) {
        let errorData = { message: `HTTP error! status: ${response.status}` };
        try {
             // Attempt to parse error details from the response body
            errorData = await response.json();
             // Log the specific errors if available from validation
            if(errorData.errors) {
                console.error("Validation Errors:", errorData.errors);
            } else if (errorData.field) {
                 console.error("Duplicate Field Error:", errorData.field);
            }
        } catch (parseError) {
            console.error("Failed to parse error response:", parseError);
            // Use a generic message if parsing fails
        }
        // Throw an error with the message from the server or a default
        throw new Error(errorData.message || `Failed to save resume: ${response.statusText}`);
      }

      // If the response is OK (2xx), parse the JSON
      const data = await response.json();
      console.log('Resume saved successfully:', data);

      // Show success message
      setSnackbarMessage(data.message || 'Resume saved successfully!');
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Navigation is handled by the useEffect hook when snackbarOpen and severity are 'success'

    } catch (error) {
      console.error('Error saving resume:', error);
      // Show error message
      setSnackbarMessage(error.message || 'An unexpected error occurred.'); // Use error.message for more detail
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false); // Turn off loading indicator
    }
  };

  // Effect to handle navigation after successful save and Snackbar closes
  useEffect(() => {
    if (snackbarOpen && snackbarSeverity === 'success') {
      // Set a timeout to navigate after the snackbar duration (2000ms)
      const timer = setTimeout(() => {
        // setSnackbarOpen(false); // Snackbar onClose handles hiding
        navigate('/'); // Navigate to the root route
      }, 2000); // 2 seconds
      // Cleanup the timer if the component unmounts or Snackbar state changes
      return () => clearTimeout(timer);
    }
  }, [snackbarOpen, snackbarSeverity, navigate]); // Dependencies

  // Handle Snackbar close event
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return; // Don't close on click away
    }
    setSnackbarOpen(false);
  };


  // Render functions (kept as is, added the fix for skills TextField)
  const renderPersonalInfo = () => ( /* ... existing JSX ... */
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
              value={formData.personalInfo.firstName}
              onChange={(e) =>
                handleInputChange("personalInfo", "firstName", e.target.value)
              }
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.personalInfo.lastName}
              onChange={(e) =>
                handleInputChange("personalInfo", "lastName", e.target.value)
              }
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.personalInfo.email}
              onChange={(e) =>
                handleInputChange("personalInfo", "email", e.target.value)
              }
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number (Optional)"
              value={formData.personalInfo.phone}
              onChange={(e) =>
                handleInputChange("personalInfo", "phone", e.target.value)
              }
              placeholder="+1 (555) 123-4567"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="LinkedIn URL (Optional)" // Label changed to optional
              value={formData.personalInfo.linkedIn}
              onChange={(e) =>
                handleInputChange("personalInfo", "linkedIn", e.target.value)
              }
              error={!!errors.linkedIn}
              helperText={errors.linkedIn}
              InputProps={{
                startAdornment: (
                  <LinkedInIcon sx={{ mr: 1, mt: 2.5, color: "#0077b5" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="GitHub URL (Optional)" // Label changed to optional
              value={formData.personalInfo.github}
              onChange={(e) =>
                handleInputChange("personalInfo", "github", e.target.value)
              }
               error={!!errors.github}
              helperText={errors.github}
              InputProps={{
                startAdornment: (
                  <GitHubIcon sx={{ mr: 1, mt: 2.5, color: "#333" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Personal Website / Portfolio URL (Optional)"
              value={formData.personalInfo.website}
              onChange={(e) =>
                handleInputChange("personalInfo", "website", e.target.value)
              }
               error={!!errors.website}
               helperText={errors.website}
              InputProps={{
                startAdornment: (
                  <WebsiteIcon sx={{ mr: 1, mt: 2.5, color: "#666" }} />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 1 (Optional)"
              value={formData.personalInfo.address}
              onChange={(e) =>
                handleInputChange("personalInfo", "address", e.target.value)
              }
              multiline
              rows={1}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="City (Optional)"
              value={formData.personalInfo.city}
              onChange={(e) =>
                handleInputChange("personalInfo", "city", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="State / Province (Optional)"
              value={formData.personalInfo.state}
              onChange={(e) =>
                handleInputChange("personalInfo", "state", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={countriesOptions}
              value={formData.personalInfo.country}
              onChange={(event, value) =>
                handleInputChange("personalInfo", "country", value)
              }
              renderInput={(params) => (
                <TextField {...params} label="Country (Optional)" />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderCareerSummary = () => ( /* ... existing JSX ... */
    <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "primary.main", mb: 3 }}
        >
          Career Objective & Summary
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Short Summary (1-2 lines for quick overview - Optional)"
              value={formData.careerSummary.shortSummary}
              onChange={(e) =>
                handleInputChange(
                  "careerSummary",
                  "shortSummary",
                  e.target.value
                )
              }
              multiline
              rows={2}
              helperText="A concise professional summary highlighting your key strengths and experience."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Detailed Career Objective / Professional Statement (Optional)"
              value={formData.careerSummary.detailedObjective}
              onChange={(e) =>
                handleInputChange(
                  "careerSummary",
                  "detailedObjective",
                  e.target.value
                )
              }
              multiline
              rows={5}
              helperText="Elaborate on your career goals, what you bring to a role, and your aspirations."
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderEducation = () => ( /* ... existing JSX ... */
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
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600 }}
                    >{`${edu.degree} in ${edu.field}`}</Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {edu.university}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >{`${edu.startDate} - ${edu.endDate}`}</Typography>
                      {edu.gpa && (
                        <Typography variant="body2" color="text.secondary">
                          GPA: {edu.gpa}
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
                    onClick={() => openEditDialog("education", index)}
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

  const renderWorkExperience = () => ( /* ... existing JSX ... */
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
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600 }}
                    >{`${work.role} at ${work.company}`}</Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {work.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">{`${
                        work.startDate
                      } - ${work.endDate || "Present"} • ${
                        work.type
                      }`}</Typography>
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
                    onClick={() => openEditDialog("workExperience", index)}
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

  const renderProjects = () => ( /* ... existing JSX ... */
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
                      {project.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >{`${project.duration} • ${project.type}`}</Typography>
                       {project.skillsUsed && ( // Display skillsUsed as plain text
                           <Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
                               <Box component="span" sx={{fontWeight: 600}}>Skills/Tools: </Box> {project.skillsUsed}
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
                    onClick={() => openEditDialog("projects", index)}
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

        {/* --- FIX IS HERE --- */}
        <TextField
          fullWidth
          label="Skills & Expertise"
          placeholder="e.g., JavaScript, React, Python, AWS, Figma, Leadership (Separate with commas)"
          value={formData.skills} // Value is correctly formData.skills (a string)
          // --- Directly update the skills string in state ---
          onChange={(e) => {
            setFormData(prev => ({
              ...prev,
              skills: e.target.value // Set the 'skills' field directly to the input string value
            }));
          }}
          // --- End FIX ---
          multiline
          rows={4}
          helperText="List your technical, soft, and domain-specific skills."
        />
      </CardContent>
    </Card>
  );

  const renderAchievements = () => ( /* ... existing JSX ... */
     <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" sx={{ color: "primary.main" }}>
            Achievements
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
             onClick={() => openAddDialog("achievements")} // Open simple text dialog
          >
            Add Achievement
          </Button>
        </Box>

        {formData.achievements.length === 0 ? (
          <Box
            textAlign="center"
            py={4}
            sx={{
              border: "2px dashed #EBF2F7",
              borderRadius: "12px",
              bgcolor: "#FDFEFE",
            }}
          >
            <AchievementIcon sx={{ fontSize: 64, color: "#BDC3C7", mb: 2 }} />
            <Typography color="textSecondary">
              Highlight your significant accomplishments and contributions.
            </Typography>
          </Box>
        ) : (
            <List>
                {formData.achievements.map((achievement, index) => (
                <ListItem
                    key={index}
                    divider={index < formData.achievements.length - 1}
                >
                    <ListItemText
                    primary={<Typography variant="body1" sx={{whiteSpace: 'pre-wrap'}}>{achievement}</Typography>}
                    />
                    <ListItemSecondaryAction>
                    <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => openEditDialog("achievements", index)}
                        sx={{ color: "primary.main" }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleStringArrayDelete("achievements", index)}
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

    const renderAwards = () => ( /* ... existing JSX ... */
      <Card elevation={0} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" sx={{ color: "primary.main" }}>
              Awards & Honors
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openAddDialog("awards")} // Open simple text dialog
            >
              Add Award
            </Button>
          </Box>
           {formData.awards.length === 0 ? (
            <Box
              textAlign="center"
              py={4}
              sx={{
                border: "2px dashed #EBF2F7",
                borderRadius: "12px",
                bgcolor: "#FDFEFE",
              }}
            >
              <AwardIcon sx={{ fontSize: 64, color: "#BDC3C7", mb: 2 }} />
              <Typography color="textSecondary">
                Recognize your significant awards, scholarships, and honors.
              </Typography>
            </Box>
          ) : (
              <List>
                  {formData.awards.map((award, index) => (
                  <ListItem
                      key={index}
                      divider={index < formData.awards.length - 1}
                  >
                      <ListItemText
                      primary={<Typography variant="body1" sx={{whiteSpace: 'pre-wrap'}}>{award}</Typography>}
                      />
                      <ListItemSecondaryAction>
                      <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => openEditDialog("awards", index)}
                          sx={{ color: "primary.main" }}
                      >
                          <EditIcon />
                      </IconButton>
                      <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleStringArrayDelete("awards", index)}
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

  const renderVolunteerWork = () => ( /* ... existing JSX ... */
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
             onClick={() => openAddDialog("volunteer")} // Open simple text dialog
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
                    primary={<Typography variant="body1" sx={{whiteSpace: 'pre-wrap'}}>{item}</Typography>}
                    />
                    <ListItemSecondaryAction>
                    <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => openEditDialog("volunteer", index)}
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
        return renderCareerSummary();
      case 2:
        return renderEducation();
      case 3:
        return renderWorkExperience();
      case 4:
        return renderProjects();
      case 5:
        return renderSkills();
      case 6:
        return renderAchievements(); // Render Achievements
      case 7:
        return renderAwards();
      case 8:
        return renderVolunteerWork();
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  const completionPercentage = ((activeStep + 1) / steps.length) * 100;

  return (
    <ThemeProvider theme={premiumTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "white", // Subtle gradient background
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
              minHeight: "600px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Render content based on active step */}
            <Box sx={{ p: 0 }}>{renderStepContent()}</Box>


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
                disabled={activeStep === 0 || isLoading} // Disable back button while loading
                variant="outlined"
                size="large"
                sx={{ minWidth: "120px" }}
              >
                Back
              </Button>
              <Button
                onClick={
                  activeStep === steps.length - 1
                    ? handleSaveResume // Call the save function on the last step
                    : handleNext // Otherwise, go to the next step
                }
                variant="contained"
                size="large"
                color="primary"
                disabled={isLoading} // Disable button while loading
                sx={{ minWidth: "120px" }}
              >
                {isLoading ? ( // Show loading indicator if loading
                   "Saving..." // Text changes to indicate saving
                ) : (
                    activeStep === steps.length - 1 ? "Save Resume" : "Next"
                )}
              </Button>
            </Box>
          </Paper>

           {/* Error Summary Alert (Optional, can use Snackbar instead) */}
           {/* {Object.keys(errors).length > 0 && (activeStep === 0) && (
               <Alert severity="error" sx={{ mt: 3 }}>
                   Please fix the errors in the current section before proceeding.
               </Alert>
           )} */}

        </Box>
      </Box>

      {/* Dialog Components (kept as is) */}
      {dialogType === "education" && <AddEditEducationDialog {...getDialogProps()} />}
      {dialogType === "workExperience" && <AddEditWorkExperienceDialog {...getDialogProps()} />}
      {dialogType === "projects" && <AddEditProjectDialog {...getDialogProps()} />}
      {dialogType === "achievements" && <AddEditSimpleTextDialog {...getDialogProps()} />}
      {dialogType === "awards" && <AddEditSimpleTextDialog {...getDialogProps()} />}
      {dialogType === "volunteer" && <AddEditSimpleTextDialog {...getDialogProps()} />}

       {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={snackbarSeverity === 'success' ? 2000 : 6000} // 2s for success, 6s for others
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position at top center
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          variant="filled" // Matches theme style
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

       {/* Optional Full-screen Loading Backdrop/Dialog */}
        {/* Removed the CircularProgress inside the dialog, the button handles loading */}
        {/* Keeping this here as an example if you want a full screen loader */}
        {/*
        <Dialog open={isLoading} sx={{ '& .MuiDialog-paper': { bgcolor: 'transparent', boxShadow: 'none' } }}>
            <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                 <CircularProgress color="primary" size={60} />
            </DialogContent>
        </Dialog>
        */}


    </ThemeProvider>
  );
}

// Simple Link component for project URLs (if needed elsewhere)
// Renamed to avoid conflict with MUI Link import
const LinkStyled = styled("a")(({ theme }) => ({ // Use theme if needed
  textDecoration: "none",
  color: theme.palette.primary.main,
  "&:hover": {
    textDecoration: "underline",
  },
}));