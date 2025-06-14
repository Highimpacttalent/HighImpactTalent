import React, { useState, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { ThemeProvider } from "@mui/material";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Chip,
  FormControlLabel,
  Checkbox,
  Divider,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Alert,
  Snackbar,
  Switch,
  CircularProgress,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Diversity3 as DiversityIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { createTheme, useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import { skillsList } from "../../../../assets/mock";
import {
  functionalAreasCategory,
  tagCategory,
  categoryOptions as categoryOptionsList,
  IndustryCategory,
} from "../../../../assets/functionalarea";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily:
      '"Satoshi", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontFamily: '"Satoshi", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Satoshi", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Poppins", sans-serif',
    },
    body2: {
      fontFamily: '"Poppins", sans-serif',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(25, 118, 210, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          fontFamily: '"Satoshi", sans-serif',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: 8,
          "& + .MuiOutlinedInput-notchedOutline": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          borderRadius: "12px 12px 0 0",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "8px 0",
          },
        },
      },
    },
  },
});

export default function JobEditForm() {
  const location = useLocation();
  const jobId = location.state?.job._id;
  const muiTheme = useTheme();

  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobLocation: "",
    salary: { minSalary: "", maxSalary: "" },
    salaryConfidential: false,
    salaryCategory: "",
    status: "draft",
    workType: "",
    workMode: "",
    jobDescription: "",
    skills: [],
    requirements: [""],
    qualifications: [""],
    screeningQuestions: [],
    experience: { minExperience: "", maxExperience: "" },
    companyType: "",
    applicationLink: "",
    duration: "",
    graduationYear: { minBatch: "", maxBatch: "" },
    tags: [],
    courseType: "",
    diversityPreferences: {
      femaleCandidates: false,
      womenJoiningBackforce: false,
      exDefencePersonnel: false,
      differentlyAbledCandidates: false,
      workFromHome: false,
    },
    category: "",
    functionalArea: "",
    isPremiumJob: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoadError, setInitialLoadError] = useState(null);

  // Options for React Select
  const [functionalAreaOptions, setFunctionalAreaOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [salaryCategoryOptions, setSalaryCategoryOptions] = useState([]);
  const [durationOptions, setDurationOptions] = useState([]);
  const [courseTypeOptions, setCourseTypeOptions] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);

  // Options for other dropdowns
  const workTypes = [
    "Full-Time",
    "Part-Time",
    "Contract",
    "Temporary",
    "Internship",
  ].map((wt) => ({
    value: wt,
    label: wt,
  }));

  const workMode = ["Remote", "Hybrid", "Work From Office"].map((wt) => ({
    value: wt,
    label: wt,
  }));
  const statusOptions = ["live", "draft", "deleted", "paused"].map((wt) => ({
    value: wt,
    label: wt,
  }));
  const durationTypes = ["Permanent", "Contract", "Temporary", "Project-based"];
  const courseTypes = ["Full time", "Part time", "Distance Learning Program", "Executive Program", "Certification"];
  const salaryCategories = [
    // Renamed from salaryOptions
    "On Experience",
    "Competitive",
    "Fixed",
    "Negotiable",
    "Confidential",
  ];

  const tagOptions = tagCategory.map((tag) => ({
  value: tag,
  label: tag,
}));

  // React Select custom styles
  const customSelectStyle = {
    control: (base) => ({
      ...base,
      minHeight: "56px",
      borderRadius: "8px",
      borderColor: muiTheme.palette.mode === "light" ? "#c4c4c4" : "#555",
      "&:hover": {
        borderColor: muiTheme.palette.primary.main,
      },
    }),
    input: (base) => ({
      ...base,
      color: muiTheme.palette.text.primary,
    }),
    singleValue: (base) => ({
      ...base,
      color: muiTheme.palette.text.primary,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: muiTheme.palette.background.paper,
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? muiTheme.palette.primary.main
        : isFocused
        ? muiTheme.palette.action.hover
        : undefined,
      color: isSelected ? "#fff" : muiTheme.palette.text.primary,
      "&:active": {
        backgroundColor: muiTheme.palette.primary.light,
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: muiTheme.palette.text.secondary,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: muiTheme.palette.primary.light,
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#fff",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#fff",
      ":hover": {
        backgroundColor: muiTheme.palette.primary.dark,
        color: "#fff",
      },
    }),
  };

  // Initialize React Select options
  useEffect(() => {
    setFunctionalAreaOptions(
      functionalAreasCategory.map((area) => ({ label: area, value: area }))
    );
    setCategoryOptions(
      categoryOptionsList.map((cat) => ({ label: cat, value: cat }))
    );
    setSalaryCategoryOptions(
      salaryCategories.map((cat) => ({ label: cat, value: cat }))
    );
    setDurationOptions(
      durationTypes.map((dur) => ({ label: dur, value: dur }))
    );
    setCourseTypeOptions(
      courseTypes.map((type) => ({ label: type, value: type }))
    );
    setSkillOptions(
      skillsList.map((skill) => ({ label: skill, value: skill }))
    );
  }, []);

  // Fetch job data
  const fetchJobData = async () => {
    if (!jobId) {
      setLoading(false);
      setInitialLoadError("Job ID is missing. Cannot fetch job details.");
      return;
    }
    setLoading(true);
    setError(null);
    setInitialLoadError(null);

    try {
      const response = await fetch(
        `https://highimpacttalent.onrender.com/api-v1/jobs/get-job-detail/${jobId}`
      );
      const result = await response.json();

      if (result.success && result.data) {
        const fetchedJob = result.data;

        // Process salary
        let salaryState = { minSalary: "", maxSalary: "" };
        if (fetchedJob.salary !== undefined && fetchedJob.salary !== null) {
          if (
            typeof fetchedJob.salary === "object" &&
            fetchedJob.salary !== null
          ) {
            salaryState.minSalary =
              fetchedJob.salary.minSalary !== undefined &&
              fetchedJob.salary.minSalary !== null
                ? String(fetchedJob.salary.minSalary)
                : "";
            salaryState.maxSalary =
              fetchedJob.salary.maxSalary !== undefined &&
              fetchedJob.salary.maxSalary !== null
                ? String(fetchedJob.salary.maxSalary)
                : "";
          } else {
            salaryState.minSalary = String(fetchedJob.salary);
          }
        }

        // Process experience
        let experienceState = { minExperience: "", maxExperience: "" };
        if (
          fetchedJob.experience !== undefined &&
          fetchedJob.experience !== null
        ) {
          if (
            typeof fetchedJob.experience === "object" &&
            fetchedJob.experience !== null
          ) {
            experienceState.minExperience =
              fetchedJob.experience.minExperience !== undefined &&
              fetchedJob.experience.minExperience !== null
                ? String(fetchedJob.experience.minExperience)
                : "";
            experienceState.maxExperience =
              fetchedJob.experience.maxExperience !== undefined &&
              fetchedJob.experience.maxExperience !== null
                ? String(fetchedJob.experience.maxExperience)
                : "";
          } else {
            experienceState.minExperience = String(fetchedJob.experience);
          }
        }

        // Process graduation year
        const graduationYearState =
          fetchedJob.graduationYear &&
          typeof fetchedJob.graduationYear === "object" &&
          fetchedJob.graduationYear !== null
            ? {
                minBatch:
                  fetchedJob.graduationYear.minBatch !== undefined &&
                  fetchedJob.graduationYear.minBatch !== null
                    ? String(fetchedJob.graduationYear.minBatch)
                    : "",
                maxBatch:
                  fetchedJob.graduationYear.maxBatch !== undefined &&
                  fetchedJob.graduationYear.maxBatch !== null
                    ? String(fetchedJob.graduationYear.maxBatch)
                    : "",
              }
            : { minBatch: "", maxBatch: "" };

        // Process diversity preferences
        const diversityPreferencesState =
          fetchedJob.diversityPreferences &&
          typeof fetchedJob.diversityPreferences === "object" &&
          fetchedJob.diversityPreferences !== null
            ? {
                femaleCandidates:
                  fetchedJob.diversityPreferences.femaleCandidates ?? false,
                womenJoiningBackforce:
                  fetchedJob.diversityPreferences.womenJoiningBackforce ??
                  false,
                exDefencePersonnel:
                  fetchedJob.diversityPreferences.exDefencePersonnel ?? false,
                differentlyAbledCandidates:
                  fetchedJob.diversityPreferences.differentlyAbledCandidates ??
                  false,
                workFromHome:
                  fetchedJob.diversityPreferences.workFromHome ?? false,
              }
            : {
                femaleCandidates: false,
                womenJoiningBackforce: false,
                exDefencePersonnel: false,
                differentlyAbledCandidates: false,
                workFromHome: false,
              };

        // Process requirements and qualifications
        const fetchedRequirements = Array.isArray(fetchedJob.requirements)
          ? fetchedJob.requirements.filter((req) => req !== null)
          : [];
        const requirementsState =
          fetchedRequirements.length > 0 &&
          fetchedRequirements.some((req) => req.trim() !== "")
            ? fetchedRequirements
            : [""];

        const fetchedQualifications = Array.isArray(fetchedJob.qualifications)
          ? fetchedJob.qualifications.filter((qual) => qual !== null)
          : [];
        const qualificationsState =
          fetchedQualifications.length > 0 &&
          fetchedQualifications.some((qual) => qual.trim() !== "")
            ? fetchedQualifications
            : [""];

        // Process screening questions
        const screeningQuestionsState = Array.isArray(
          fetchedJob.screeningQuestions
        )
          ? fetchedJob.screeningQuestions
              .filter(
                (q) => q && typeof q === "object" && q.question !== undefined
              )
              .map((q) => ({
                question: q.question || "",
                isMandatory: q.isMandatory ?? false,
                _id: q._id,
              }))
          : [];

        // Process skills and tags
        const skillsState = Array.isArray(fetchedJob.skills)
          ? fetchedJob.skills
          : [];
        const tagsState = Array.isArray(fetchedJob.tags) ? fetchedJob.tags : [];

        setJobData({
          jobTitle: fetchedJob.jobTitle || "",
          jobLocation: fetchedJob.jobLocation || "",
          salary: salaryState,
          salaryConfidential: fetchedJob.salaryConfidential ?? false,
          salaryCategory: fetchedJob.salaryCategory || "",
          status: fetchedJob.status || "draft",
          workType: fetchedJob.workType || "",
          workMode: fetchedJob.workMode || "",
          jobDescription: fetchedJob.jobDescription || "",
          skills: skillsState,
          requirements: requirementsState,
          qualifications: qualificationsState,
          screeningQuestions: screeningQuestionsState,
          experience: experienceState,
          companyType: fetchedJob.companyType || "",
          applicationLink: fetchedJob.applicationLink || "",
          duration: fetchedJob.duration || "",
          graduationYear: graduationYearState,
          tags: tagsState,
          courseType: fetchedJob.courseType || "",
          diversityPreferences: diversityPreferencesState,
          category: fetchedJob.category || "",
          functionalArea: fetchedJob.functionalArea || "",
          isPremiumJob: fetchedJob.isPremiumJob ?? false,
        });

        setNotification({
          open: true,
          message: "Job data loaded successfully!",
          severity: "success",
        });
      } else {
        const errorMessage = result.message || "Failed to fetch job data.";
        setError(errorMessage);
        setInitialLoadError(errorMessage);
        setNotification({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      }
    } catch (err) {
      const errorMessage = "An error occurred while fetching job data.";
      setError(errorMessage);
      setInitialLoadError(errorMessage);
      setNotification({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobData();
  }, [jobId]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (
      field.startsWith("salary.") ||
      field.startsWith("experience.") ||
      field.startsWith("graduationYear.")
    ) {
      setJobData((prev) => {
        const [parent, child] = field.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value === "" ? "" : String(value),
          },
        };
      });
    } else if (field.startsWith("diversityPreferences.")) {
      setJobData((prev) => {
        const [parent, child] = field.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };
      });
    } else if (field === "salaryConfidential" || field === "isPremiumJob") {
      setJobData((prev) => ({ ...prev, [field]: value }));
    } else {
      setJobData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle changes in array fields
  const handleArrayChange = (field, index, value) => {
    setJobData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  // Add items to array fields
  const addArrayItem = (field, defaultValue = "") => {
    if (Array.isArray(jobData[field])) {
      if (
        (field === "requirements" || field === "qualifications") &&
        jobData[field].length > 0 &&
        jobData[field][jobData[field].length - 1].trim() === ""
      ) {
        return;
      }
      if (
        field === "screeningQuestions" &&
        jobData[field].length > 0 &&
        jobData[field][jobData[field].length - 1].question.trim() === ""
      ) {
        return;
      }

      setJobData((prev) => ({
        ...prev,
        [field]: [...prev[field], defaultValue],
      }));
    }
  };

  // Remove items from array fields
  const removeArrayItem = (field, index) => {
    if (Array.isArray(jobData[field])) {
      if (
        (field === "requirements" || field === "qualifications") &&
        jobData[field].length <= 1
      ) {
        return;
      }
      setJobData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  // Handle tag operations
  const handleTagAdd = () => {
    const tag = tagInput.trim();
    if (tag && !jobData.tags.includes(tag)) {
      setJobData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setJobData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle screening questions
  const handleScreeningQuestionChange = (index, field, value) => {
    setJobData((prev) => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const addScreeningQuestion = () => {
    addArrayItem("screeningQuestions", { question: "", isMandatory: false });
  };

  const removeScreeningQuestion = (index) => {
    removeArrayItem("screeningQuestions", index);
  };

  // Prepare data for API calls
  const prepareDataForSave = () => {
    // Clean up arrays
    const cleanedRequirements = jobData.requirements
      .map((req) => req.trim())
      .filter((req) => req !== "");
    const cleanedQualifications = jobData.qualifications
      .map((qual) => qual.trim())
      .filter((qual) => qual !== "");
    const cleanedScreeningQuestions = jobData.screeningQuestions
      .filter((q) => q.question.trim() !== "")
      .map((q) => ({
        question: q.question.trim(),
        isMandatory: q.isMandatory,
        ...(q._id && { _id: q._id }),
      }));

    // Convert numbers
    const salaryToSend = {
      minSalary:
        jobData.salary.minSalary === ""
          ? null
          : Number(jobData.salary.minSalary),
      maxSalary:
        jobData.salary.maxSalary === ""
          ? null
          : Number(jobData.salary.maxSalary),
    };
    const experienceToSend = {
      minExperience:
        jobData.experience.minExperience === ""
          ? null
          : Number(jobData.experience.minExperience),
      maxExperience:
        jobData.experience.maxExperience === ""
          ? null
          : Number(jobData.experience.maxExperience),
    };
    const graduationYearToSend = {
      minBatch:
        jobData.graduationYear.minBatch === ""
          ? null
          : Number(jobData.graduationYear.minBatch),
      maxBatch:
        jobData.graduationYear.maxBatch === ""
          ? null
          : Number(jobData.graduationYear.maxBatch),
    };

    return {
      jobId: jobId,
      ...jobData,
      salary: salaryToSend,
      experience: experienceToSend,
      graduationYear: graduationYearToSend,
      requirements: cleanedRequirements,
      qualifications: cleanedQualifications,
      screeningQuestions: cleanedScreeningQuestions,
      skills: jobData.skills,
      tags: jobData.tags.map((t) => t.trim()).filter((t) => t !== ""),
      applicationLink: jobData.applicationLink.trim(),
      jobDescription: jobData.jobDescription.trim(),
      jobTitle: jobData.jobTitle.trim(),
      jobLocation: jobData.jobLocation.trim(),
      companyType: jobData.companyType.trim(),
      salaryCategory: jobData.salaryCategory,
      workType: jobData.workType.trim(),
      workMode: jobData.workMode.trim(),
      duration: jobData.duration,
      courseType: jobData.courseType,
      category: jobData.category.trim(),
      functionalArea: jobData.functionalArea.trim(),
    };
  };

  // Save job
  const handleSave = async () => {
    if (!jobId) {
      setNotification({
        open: true,
        message: "Cannot save: Job ID is missing.",
        severity: "error",
      });
      return;
    }
    const dataToSend = prepareDataForSave();

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://highimpacttalent.onrender.com/api-v1/jobs/update-job", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      if (result.success) {
        setNotification({
          open: true,
          message: result.message || "Job updated successfully!",
          severity: "success",
        });
        fetchJobData();
      } else {
        const errorMessage = result.message || "Failed to update job.";
        setError(errorMessage);
        setNotification({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      }
    } catch (err) {
      const errorMessage = "An error occurred while updating job.";
      setError(errorMessage);
      setNotification({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Publish job
  const handlePublish = async () => {
    if (!jobId) {
      setNotification({
        open: true,
        message: "Cannot publish: Job ID is missing.",
        severity: "error",
      });
      return;
    }
    const dataToSend = {
      ...prepareDataForSave(),
      status: "live",
    };

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/jobs/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const result = await response.json();

      if (result.success) {
        setNotification({
          open: true,
          message: result.message || "Job published successfully!",
          severity: "success",
        });
        setJobData((prev) => ({ ...prev, status: "live" }));
        fetchJobData();
      } else {
        const errorMessage = result.message || "Failed to publish job.";
        setError(errorMessage);
        setNotification({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      }
    } catch (err) {
      const errorMessage = "An error occurred while publishing job.";
      setError(errorMessage);
      setNotification({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Handle notification close
  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Loading state
  if (loading && (!jobData.jobTitle || initialLoadError === null)) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6">Loading Job Data...</Typography>
      </Box>
    );
  }

  // Error state
  if (initialLoadError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          p: 3,
        }}
      >
        <Alert severity="error">{initialLoadError}</Alert>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              color: "white",
            }}
          >
            <Typography variant="h4" sx={{ mb: 1 }}>
              Edit Job Details
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Updating job post: {jobData.jobTitle || "(No Title)"}
            </Typography>
          </Paper>

          {loading && !initialLoadError && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                my: 2,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
          {error && !initialLoadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Main Form */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                {/* Basic Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <WorkIcon color="primary" />
                    Basic Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        value={jobData.jobTitle}
                        onChange={(e) =>
                          handleInputChange("jobTitle", e.target.value)
                        }
                        required
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={jobData.jobLocation}
                        onChange={(e) =>
                          handleInputChange("jobLocation", e.target.value)
                        }
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Company Type"
                        value={jobData.companyType}
                        onChange={(e) =>
                          handleInputChange("companyType", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth required>
                        <Select
                          options={workTypes}
                          value={workTypes.find(
                            (opt) =>
                              opt.value.toLowerCase() ===
                              jobData?.workType?.toLowerCase()
                          )}
                          onChange={(selectedOption) =>
                            handleInputChange(
                              "workType",
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          placeholder="Work Type"
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth required>
                        <Select
                          options={workMode}
                          value={workMode.find(
                            (opt) =>
                              opt.value.toLowerCase() ===
                              jobData?.workMode?.toLowerCase()
                          )}
                          onChange={(selectedOption) =>
                            handleInputChange(
                              "workMode",
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          placeholder="Work Mode"
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <Select
                          options={statusOptions}
                          value={statusOptions.find(
                            (opt) =>
                              opt.value.toLowerCase() ===
                              jobData?.status?.toLowerCase()
                          )}
                          onChange={(selectedOption) =>
                            handleInputChange(
                              "status",
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          placeholder="Status"
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Salary Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Salary Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Minimum Salary"
                        type="number"
                        value={jobData.salary.minSalary}
                        onChange={(e) =>
                          handleInputChange("salary.minSalary", e.target.value)
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          shrink: jobData.salary.minSalary !== "",
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Maximum Salary"
                        type="number"
                        value={jobData.salary.maxSalary}
                        onChange={(e) =>
                          handleInputChange("salary.maxSalary", e.target.value)
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          shrink: jobData.salary.maxSalary !== "",
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{ mb: 0.5, fontWeight: 500 }}
                        >
                          Salary Category
                        </Typography>
                        <Select
                          options={salaryCategoryOptions}
                          value={salaryCategoryOptions.find(
                            (opt) => opt.value === jobData.salaryCategory
                          )}
                          onChange={(selectedOption) =>
                            handleInputChange(
                              "salaryCategory",
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          placeholder="Select Salary Category..."
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={jobData.salaryConfidential}
                            onChange={(e) =>
                              handleInputChange(
                                "salaryConfidential",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        }
                        label="Keep Salary Confidential"
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Job Description */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Job Description
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Job Description"
                    value={jobData.jobDescription}
                    onChange={(e) =>
                      handleInputChange("jobDescription", e.target.value)
                    }
                    required
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  />
                </Box>
              </Paper>

              {/* Expandable Sections */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <PsychologyIcon color="primary" />
                    Skills & Requirements
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Skills Required
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Select
                          isMulti
                          options={skillOptions}
                          value={skillOptions.filter((opt) =>
                            jobData.skills.includes(opt.value)
                          )}
                          onChange={(selectedOptions) =>
                            handleInputChange(
                              "skills",
                              selectedOptions
                                ? selectedOptions.map((opt) => opt.value)
                                : []
                            )
                          }
                          placeholder="Select or type skills..."
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                        />
                        
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Requirements
                      </Typography>
                      {jobData.requirements.map((req, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            gap: 1,
                            mb: 2,
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            value={req}
                            onChange={(e) =>
                              handleArrayChange(
                                "requirements",
                                index,
                                e.target.value
                              )
                            }
                            placeholder={`Requirement ${index + 1}`}
                          />
                          <IconButton
                            color="error"
                            onClick={() =>
                              removeArrayItem("requirements", index)
                            }
                            disabled={jobData.requirements.length === 1}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        onClick={() => addArrayItem("requirements", "")}
                        startIcon={<AddIcon />}
                        size="small"
                        disabled={
                          jobData.requirements.length > 0 &&
                          jobData.requirements[
                            jobData.requirements.length - 1
                          ].trim() === ""
                        }
                      >
                        Add Requirement
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Qualifications
                      </Typography>
                      {jobData.qualifications.map((qual, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            gap: 1,
                            mb: 2,
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            value={qual}
                            onChange={(e) =>
                              handleArrayChange(
                                "qualifications",
                                index,
                                e.target.value
                              )
                            }
                            placeholder={`Qualification ${index + 1}`}
                          />
                          <IconButton
                            color="error"
                            onClick={() =>
                              removeArrayItem("qualifications", index)
                            }
                            disabled={jobData.qualifications.length === 1}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        onClick={() => addArrayItem("qualifications", "")}
                        startIcon={<AddIcon />}
                        size="small"
                        disabled={
                          jobData.qualifications.length > 0 &&
                          jobData.qualifications[
                            jobData.qualifications.length - 1
                          ].trim() === ""
                        }
                      >
                        Add Qualification
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Screening Questions
                      </Typography>
                      {jobData.screeningQuestions.map((sq, index) => (
                        <Box
                          key={sq._id || `new-${index}`}
                          sx={{
                            border: "1px solid #eee",
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={8}>
                              <TextField
                                fullWidth
                                label={`Question ${index + 1}`}
                                size="small"
                                value={sq.question}
                                onChange={(e) =>
                                  handleScreeningQuestionChange(
                                    index,
                                    "question",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid item xs={8} sm={3}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={sq.isMandatory}
                                    onChange={(e) =>
                                      handleScreeningQuestionChange(
                                        index,
                                        "isMandatory",
                                        e.target.checked
                                      )
                                    }
                                    color="primary"
                                    size="small"
                                  />
                                }
                                label="Mandatory"
                              />
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              sm={1}
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <IconButton
                                color="error"
                                onClick={() => removeScreeningQuestion(index)}
                                size="small"
                                disabled={
                                  jobData.screeningQuestions.length <= 0
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        onClick={addScreeningQuestion}
                        startIcon={<AddIcon />}
                        size="small"
                        disabled={
                          jobData.screeningQuestions.length > 0 &&
                          jobData.screeningQuestions[
                            jobData.screeningQuestions.length - 1
                          ].question.trim() === ""
                        }
                      >
                        Add Screening Question
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <SchoolIcon color="primary" />
                    Experience & Education
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Minimum Experience (Years)"
                        type="number"
                        value={jobData.experience.minExperience}
                        onChange={(e) =>
                          handleInputChange(
                            "experience.minExperience",
                            e.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: jobData.experience.minExperience !== "",
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Maximum Experience (Years)"
                        type="number"
                        value={jobData.experience.maxExperience}
                        onChange={(e) =>
                          handleInputChange(
                            "experience.maxExperience",
                            e.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: jobData.experience.maxExperience !== "",
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{ mb: 0.5, fontWeight: 500 }}
                        >
                          Duration
                        </Typography>
                        <Select
                          options={durationOptions}
                          value={durationOptions.find(
                            (opt) => opt.value === jobData.duration
                          )}
                          onChange={(selectedOption) =>
                            handleInputChange(
                              "duration",
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          placeholder="Select Duration..."
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{ mb: 0.5, fontWeight: 500 }}
                        >
                          Course Type
                        </Typography>
                        <Select
                          options={courseTypeOptions}
                          value={courseTypeOptions.find(
                            (opt) => opt.value === jobData.courseType
                          )}
                          onChange={(selectedOption) =>
                            handleInputChange(
                              "courseType",
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          placeholder="Select Course Type..."
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Minimum Graduation Year Batch"
                        type="number"
                        value={jobData.graduationYear.minBatch}
                        onChange={(e) =>
                          handleInputChange(
                            "graduationYear.minBatch",
                            e.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: jobData.graduationYear.minBatch !== "",
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Maximum Graduation Year Batch"
                        type="number"
                        value={jobData.graduationYear.maxBatch}
                        onChange={(e) =>
                          handleInputChange(
                            "graduationYear.maxBatch",
                            e.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: jobData.graduationYear.maxBatch !== "",
                        }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <DiversityIcon color="primary" />
                    Diversity & Inclusion
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Encourage diverse applications by highlighting your
                    commitment to inclusive hiring
                  </Typography>

                  <Grid container spacing={2}>
                    {Object.entries(jobData.diversityPreferences).map(
                      ([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={value}
                                onChange={(e) =>
                                  handleInputChange(
                                    `diversityPreferences.${key}`,
                                    e.target.checked
                                  )
                                }
                                color="primary"
                              />
                            }
                            label={key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          />
                        </Grid>
                      )
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 3, position: "sticky", top: 20 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <StarIcon color="primary" />
                  Job Settings
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Application Link"
                    value={jobData.applicationLink}
                    onChange={(e) =>
                      handleInputChange("applicationLink", e.target.value)
                    }
                    placeholder="https://"
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: jobData.applicationLink !== "" }}
                  />

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{ mb: 0.5, fontWeight: 500 }}
                    >
                      Category
                    </Typography>
                    <Select
                      options={categoryOptions}
                      value={categoryOptions.find(
                        (opt) => opt.value === jobData.category
                      )}
                      onChange={(selectedOption) =>
                        handleInputChange(
                          "category",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      placeholder="Select Category..."
                      isClearable
                      isSearchable
                      styles={customSelectStyle}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{ mb: 0.5, fontWeight: 500 }}
                    >
                      Functional Area
                    </Typography>
                    <Select
                      options={functionalAreaOptions}
                      value={functionalAreaOptions.find(
                        (opt) => opt.value === jobData.functionalArea
                      )}
                      onChange={(selectedOption) =>
                        handleInputChange(
                          "functionalArea",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      placeholder="Select Functional Area..."
                      isClearable
                      isSearchable
                      styles={customSelectStyle}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Tags (Add multiple)
                    </Typography>
                    <Select
                          isMulti
                          options={tagOptions}
                          value={tagOptions.filter((opt) =>
                            jobData.tags.includes(opt.value)
                          )}
                          onChange={(selectedOptions) =>
                            handleInputChange(
                              "tags",
                              selectedOptions
                                ? selectedOptions.map((opt) => opt.value)
                                : []
                            )
                          }
                          placeholder="Select tags..."
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                        />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    size="large"
                    disabled={loading || initialLoadError !== null}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={handlePublish}
                    size="large"
                    disabled={
                      loading ||
                      initialLoadError !== null ||
                      jobData.status === "live"
                    }
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : jobData.status === "live" ? (
                      "Published"
                    ) : (
                      "Publish Job"
                    )}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
