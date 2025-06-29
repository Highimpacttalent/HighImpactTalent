import React, { useState } from "react";
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
  alpha,
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
} from "@mui/icons-material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

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

// Sample data for dropdowns
const skillsOptions = [
  // Programming Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  // Frameworks & Libraries
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express.js",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",
  // Design Tools
  "Figma",
  "Adobe XD",
  "Sketch",
  "Photoshop",
  "Illustrator",
  "InVision",
  "Canva",
  // Data Tools
  "Power BI",
  "Tableau",
  "Excel",
  "Google Analytics",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  // Soft Skills
  "Leadership",
  "Team Management",
  "Project Management",
  "Communication",
  "Problem Solving",
  "Critical Thinking",
  // Other Skills
  "Cloud Computing (AWS, Azure, GCP)",
  "DevOps",
  "Agile Methodologies",
  "Machine Learning",
  "Data Science",
  "UI/UX Design",
  "Content Writing",
  "Digital Marketing",
];

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
const visaStatusOptions = [
  "Citizen",
  "Permanent Resident",
  "H1B",
  "L1",
  "F1 OPT",
  "Work Permit Required",
  "EU Blue Card",
  "Dependent Visa",
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
  "Publications",
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
    handleSubmit(currentWork);
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
                />
                <IconButton
                  onClick={() => removeResponsibility(index)}
                  color="secondary"
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addResponsibility}
              variant="outlined"
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
      technologies: [],
      link: "",
      duration: "",
      type: "", // e.g., "Personal", "Team", "Open Source"
    }
  );

  React.useEffect(() => {
    setCurrentProject(
      project || {
        title: "",
        description: "",
        technologies: [],
        link: "",
        duration: "",
        type: "",
      }
    );
  }, [project, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechnologiesChange = (event, value) => {
    setCurrentProject((prev) => ({ ...prev, technologies: value }));
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
            <Autocomplete
              multiple
              options={skillsOptions} // Reusing skillsOptions for technologies
              value={currentProject.technologies}
              onChange={handleTechnologiesChange}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Technologies Used"
                  placeholder="e.g., React, Node.js, MongoDB"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiInputBase-root": {
                      paddingTop: "12px", // adjust as needed
                      minHeight: "60px", // prevent squeeze
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="link"
              label="Project Link (Optional)"
              fullWidth
              value={currentProject.link}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <WebsiteIcon sx={{ mr: 1, mt: 2.5, color: "#666" }} />
                ),
              }}
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
          <Grid item xs={12}>
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

// --- Main Form Component ---
export default function MasterResumeForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      linkedIn: "",
      github: "",
      website: "",
      address: "",
      city: "",
      state: "",
      country: "",
      dateOfBirth: null,
      nationality: "",
      willingToRelocate: false,
      workAuthorization: "",
    },
    careerSummary: {
      shortSummary: "",
      detailedObjective: "",
    },
    education: [],
    workExperience: [],
    projects: [],
    skills: {
      programming: [],
      frameworks: [],
      design: [],
      data: [],
      soft: [],
      languages: [],
      certifications: [],
    },
    publications: [],
    awards: [],
    volunteer: [],
  });

  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLinkedIn = (url) => {
    const linkedInRegex =
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return url === "" || linkedInRegex.test(url); // Allow empty string
  };

  const validateGitHub = (url) => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/;
    return url === "" || githubRegex.test(url); // Allow empty string
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

    if (activeStep === 0) {
      // Personal Info validation
      if (!formData.personalInfo.firstName)
        newErrors.firstName = "First name is required";
      if (!formData.personalInfo.lastName)
        newErrors.lastName = "Last name is required";
      if (!formData.personalInfo.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.personalInfo.email)) {
        newErrors.email = "Invalid email format";
      }
      if (
        formData.personalInfo.linkedIn &&
        !validateLinkedIn(formData.personalInfo.linkedIn)
      ) {
        newErrors.linkedIn = "Invalid LinkedIn URL format";
      }
      if (
        formData.personalInfo.github &&
        !validateGitHub(formData.personalInfo.github)
      ) {
        newErrors.github = "Invalid GitHub URL format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

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
    if (editIndex === -1) {
      handleArrayAdd(dialogType, item);
    } else {
      handleArrayEdit(dialogType, editIndex, item);
    }
    setOpenDialog(false);
  };

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
              label="Phone Number"
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
              label="LinkedIn URL"
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
              label="GitHub URL"
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
              label="Address Line 1"
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
              label="City"
              value={formData.personalInfo.city}
              onChange={(e) =>
                handleInputChange("personalInfo", "city", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="State / Province"
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
                <TextField {...params} label="Country" />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="filled">
              <InputLabel>Work Authorization</InputLabel>
              <Select
                value={formData.personalInfo.workAuthorization}
                onChange={(e) =>
                  handleInputChange(
                    "personalInfo",
                    "workAuthorization",
                    e.target.value
                  )
                }
                label="Work Authorization"
              >
                {visaStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.personalInfo.willingToRelocate}
                  onChange={(e) =>
                    handleInputChange(
                      "personalInfo",
                      "willingToRelocate",
                      e.target.checked
                    )
                  }
                  color="primary"
                />
              }
              label={
                <Typography sx={{ fontWeight: 500, color: "text.primary" }}>
                  Willing to Relocate
                </Typography>
              }
              sx={{ ".MuiFormControlLabel-label": { ml: 1 } }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderCareerSummary = () => (
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
              label="Short Summary (1-2 lines for quick overview)"
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
              label="Detailed Career Objective / Professional Statement"
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
                      {project.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >{`${project.duration} • ${project.type}`}</Typography>
                      {project.link && (
                        <Typography variant="body2" color="text.secondary">
                          <Link
                            href={project.link}
                            target="_blank"
                            rel="noopener"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 0.5,
                            }}
                          >
                            <WebsiteIcon fontSize="small" sx={{ mr: 0.5 }} />{" "}
                            {project.link}
                          </Link>
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
                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {project.technologies.map((tech, i) => (
                              <Chip
                                key={i}
                                label={tech}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
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

        <Grid container spacing={3}>
          {Object.entries(formData.skills).map(([category, skills]) => (
            <Grid item xs={12} md={6} key={category}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textTransform: "capitalize" }}
              >
                {category.replace(/([A-Z])/g, " $1").trim()}
              </Typography>
              <Autocomplete
                multiple
                options={skillsOptions}
                value={skills}
                onChange={(event, value) => {
                  setFormData((prev) => ({
                    ...prev,
                    skills: {
                      ...prev.skills,
                      [category]: value,
                    },
                  }));
                }}
                freeSolo
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      variant="filled"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`Add ${category
                      .replace(/([A-Z])/g, " $1")
                      .trim()} Skills`}
                    placeholder="Search and select skills..."
                  />
                )}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  // Placeholder components for other sections to maintain UI consistency
  const renderPublications = () => (
    <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" sx={{ color: "primary.main" }}>
            Publications
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              alert("Add Publication feature will be implemented here!")
            }
          >
            Add Publication
          </Button>
        </Box>
        <Box
          textAlign="center"
          py={4}
          sx={{
            border: "2px dashed #EBF2F7",
            borderRadius: "12px",
            bgcolor: "#FDFEFE",
          }}
        >
          <ArticleIcon sx={{ fontSize: 64, color: "#BDC3C7", mb: 2 }} />
          <Typography color="textSecondary">
            No publications added yet. Showcase your research and written works.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderAwards = () => (
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
            onClick={() => alert("Add Award feature will be implemented here!")}
          >
            Add Award
          </Button>
        </Box>
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
            No awards or honors added yet. Recognize your achievements!
          </Typography>
        </Box>
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
            onClick={() =>
              alert("Add Volunteer Work feature will be implemented here!")
            }
          >
            Add Volunteer Work
          </Button>
        </Box>
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
            No volunteer experiences added yet. Highlight your community
            involvement.
          </Typography>
        </Box>
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
        return renderPublications();
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
                disabled={activeStep === 0}
                variant="outlined"
                size="large"
                sx={{ minWidth: "120px" }}
              >
                Back
              </Button>
              <Button
                onClick={
                  activeStep === steps.length - 1
                    ? () => alert("Form completed!")
                    : handleNext
                }
                variant="contained"
                size="large"
                color="primary"
                sx={{ minWidth: "120px" }}
              >
                {activeStep === steps.length - 1 ? "Save Resume" : "Next"}
              </Button>
            </Box>
          </Paper>

          {/* Success Alert */}
          {activeStep === steps.length - 1 && (
            <Alert severity="success" sx={{ mt: 3 }}>
              Congratulations! You've completed your master resume. You can now
              use this to generate tailored resumes for specific job
              applications.
            </Alert>
          )}
        </Box>
      </Box>

      {/* Dialogs for adding/editing items */}
      {dialogType === "education" && (
        <AddEditEducationDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          education={editIndex !== -1 ? formData.education[editIndex] : null}
          handleSubmit={handleDialogSubmit}
          isEdit={editIndex !== -1}
        />
      )}
      {dialogType === "workExperience" && (
        <AddEditWorkExperienceDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          experience={
            editIndex !== -1 ? formData.workExperience[editIndex] : null
          }
          handleSubmit={handleDialogSubmit}
          isEdit={editIndex !== -1}
        />
      )}
      {dialogType === "projects" && (
        <AddEditProjectDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          project={editIndex !== -1 ? formData.projects[editIndex] : null}
          handleSubmit={handleDialogSubmit}
          isEdit={editIndex !== -1}
        />
      )}
    </ThemeProvider>
  );
}

// Simple Link component for project URLs
const Link = styled("a")({
  textDecoration: "none",
  color: premiumTheme.palette.primary.main,
  "&:hover": {
    textDecoration: "underline",
  },
});
