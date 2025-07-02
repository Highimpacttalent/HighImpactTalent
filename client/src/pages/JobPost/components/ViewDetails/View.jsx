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
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Diversity3 as DiversityIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { createTheme, useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { skillsList } from "../../../../assets/mock";
import {
  functionalAreasCategory,
  tagCategory,
  categoryOptions as categoryOptionsList,
  IndustryCategory,
  cities,
} from "../../../../assets/functionalarea";
import { useSelector } from "react-redux";

const formLabelStyle = {
  fontSize: "0.875rem", // 14px
  fontWeight: 500,
  color: "text.primary",
  mb: 1, // Reduced margin
  display: "block",
  ml: 1,
};

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
  const navigate = useNavigate();
  const jobId = location.state?.job?._id;
  const token = useSelector((state) => state.user.user.token);
  const muiTheme = useTheme();
  const [saving, setSaving] = useState(false);
  // Define initial state matching required fields and structure
  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobLocation: "", // Kept as TextField based on original edit UI
    salary: { minSalary: "", maxSalary: "" }, // Kept as TextFields based on original edit UI
    salaryConfidential: false,
    salaryCategory: "", // Changed to Select
    status: "draft", // Changed to Select
    workType: "", // Changed to Select
    workMode: "", // Changed to Select
    jobDescription: "",
    skills: [], // Multi-select
    qualifications: [], // Multi-select based on UploadJob example
    screeningQuestions: [
      {
        question: "",
        questionType: "short_answer",
        options: [],
        isMandatory: false,
      },
    ], // Structure based on UploadJob example
    experience: { minExperience: "", maxExperience: "" }, // Kept as TextFields based on original edit UI
    companyType: "", // Acts as Industry, changed to Select based on UploadJob example
    applicationLink: "",
    graduationYear: { minBatch: "", maxBatch: "" }, // Kept as TextFields based on original edit UI
    tags: [], // Creatable Multi-select
    diversityPreferences: {
      femaleCandidates: false,
      womenJoiningBackforce: false, // Assuming this key based on initial code
      exDefencePersonnel: false,
      differentlyAbledCandidates: false,
      workFromHome: false,
    },
    category: "", // Changed to Select
    functionalArea: "", // Changed to Select
    isPremiumJob: false, // Switch
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoadError, setInitialLoadError] = useState(null);

  // Options for React Selects
  const [functionalAreaOptions, setFunctionalAreaOptions] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [salaryCategoryOptions, setSalaryCategoryOptions] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [qualificationsSelectOptions] = useState([
    { value: "Bachelor's", label: "Bachelor's" },
    { value: "Master", label: "Master" },
    { value: "MBA", label: "MBA" },
    { value: "CA", label: "CA" },
    // Add other relevant qualifications if needed
  ]);

  const screeningQuestionTypeOptions = [
    { value: "yes/no", label: "Yes/No" },
    { value: "single_choice", label: "Single Choice" },
    { value: "multi_choice", label: "Multi Choice" },
    { value: "short_answer", label: "Short Answer" },
    { value: "long_answer", label: "Long Answer" },
  ];

  // Lists for deriving Select options
  const workTypesList = [
    "Full-Time",
    "Part-Time",
    "Contract",
    "Temporary",
    "Internship",
  ];
  const workModeList = ["Remote", "Hybrid", "Work From Office"];
  const statusOptionsList = ["live", "draft", "deleted", "paused"];
  const salaryCategoriesList = [
    "On Experience",
    "Competitive",
    "Fixed",
    "Negotiable",
    "Confidential",
  ];

  // React Select custom styles
  const customSelectStyle = {
    control: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem", // 14px
      borderRadius: "8px", // Rounded corners
      borderColor: state.isFocused ? "#3C7EFC" : "#d1d5db", // Match primary color
      boxShadow: state.isFocused ? "0 0 0 2px rgba(60, 126, 252, 0.5)" : "none", // Subtle shadow
      minHeight: "42px", // Standard height
      "&:hover": {
        borderColor: "#d1d5db", // Keep hover neutral or match focus
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 12px", // Adjust horizontal padding
    }),
    indicatorSeparator: () => ({
      display: "none", // Hide the separator line
    }),
    dropdownIndicator: (provided) => ({
      // Adjust padding
      ...provided,
      padding: "8px",
    }),
    clearIndicator: (provided) => ({
      // Adjust padding
      ...provided,
      padding: "8px",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      border: "1px solid #d1d5db",
      zIndex: 1000,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3C7EFC" : "white",
      color: state.isSelected ? "white" : "black", // Use black for options text
      "&:hover": {
        backgroundColor: "#f0f0f0", // Light hover background
        color: "black",
      },
      fontSize: "0.875rem",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#e0e0e0", // Light grey chips
      borderRadius: 16,
      margin: "2px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "black",
      fontSize: "0.875rem",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "black",
      borderRadius: 16,
      ":hover": {
        backgroundColor: "#c0c0c0",
        color: "red",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#a0a0a0",
      fontSize: "0.875rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
      fontSize: "0.875rem",
    }),
  };

  // Initialize Options for React Selects
  useEffect(() => {
    setFunctionalAreaOptions(
      functionalAreasCategory.map((area) => ({ label: area, value: area }))
    );
    setCategoryOptions(
      categoryOptionsList.map((cat) => ({ label: cat, value: cat }))
    );
    setSalaryCategoryOptions(
      salaryCategoriesList.map((cat) => ({ label: cat, value: cat }))
    );
    // Sort skills alphabetically
    setSkillOptions(
      skillsList
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((skill) => ({ label: skill, value: skill }))
    );
    setTagOptions(
      tagCategory
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((tag) => ({ label: tag, value: tag }))
    );
    setIndustryOptions(
      IndustryCategory.slice()
        .sort((a, b) => a.localeCompare(b))
        .map((industry) => ({ label: industry, value: industry }))
    );
    setCitiesOptions(
      cities
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((city) => ({ label: city, value: city }))
    );
  }, []);

  // Fetch job data
  const fetchJobData = async () => {
    if (!jobId) {
      setLoading(false);
      setInitialLoadError("Job ID is missing. Cannot fetch job details.");
      setNotification({
        open: true,
        message: "Job ID is missing. Cannot fetch job details.",
        severity: "error",
      });
      return;
    }
    setLoading(true);
    setError(null);
    setInitialLoadError(null);

    try {
      if (!token) {
        setLoading(false);
        setInitialLoadError(
          "Authentication token missing. Please log in again."
        );
        setNotification({
          open: true,
          message: "Authentication token missing. Please log in again.",
          severity: "error",
        });
        // Optionally redirect to login
        // navigate("/login");
        return;
      }

      const response = await fetch(
        `https://highimpacttalent.onrender.com/api-v1/jobs/get-job-detail/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to fetch job data: ${response.status} - ${response.statusText}`;
        try {
          const errorJson = await response.json();
          errorMessage = errorJson.message || errorMessage;
        } catch {
          /* ignore */
        }
        console.error(
          "Fetch API Error Response:",
          response.status,
          errorMessage
        );
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const fetchedJob = result.data;

        // Map fetched data to state structure, ensuring correct types and defaults
        setJobData({
          jobTitle: fetchedJob.jobTitle || "",
          jobLocation: fetchedJob.jobLocation || "",
          salary: {
            // Handle object or single number
            minSalary:
              (typeof fetchedJob.salary === "object"
                ? fetchedJob.salary?.minSalary
                : fetchedJob.salary) !== undefined && fetchedJob.salary !== null
                ? String(
                    typeof fetchedJob.salary === "object"
                      ? fetchedJob.salary.minSalary
                      : fetchedJob.salary
                  )
                : "",
            maxSalary:
              typeof fetchedJob.salary === "object" &&
              fetchedJob.salary?.maxSalary !== undefined &&
              fetchedJob.salary.maxSalary !== null
                ? String(fetchedJob.salary.maxSalary)
                : "",
          },
          salaryConfidential: fetchedJob.salaryConfidential ?? false,
          salaryCategory: fetchedJob.salaryCategory || "",
          status: fetchedJob.status || "draft",
          workType: fetchedJob.workType || "",
          workMode: fetchedJob.workMode || "",
          jobDescription: fetchedJob.jobDescription || "",
          skills: Array.isArray(fetchedJob.skills)
            ? fetchedJob.skills.filter((s) => s !== null && s !== undefined)
            : [],
          qualifications: Array.isArray(fetchedJob.qualifications)
            ? fetchedJob.qualifications.filter(
                (q) => q !== null && q !== undefined
              )
            : [], // Array of strings for multi-select
          screeningQuestions: (Array.isArray(fetchedJob.screeningQuestions)
            ? fetchedJob.screeningQuestions.filter(
                (q) => q && typeof q === "object" && q.question
              )
            : []
          ) // Filter invalid objects
            .map((q) => ({
              // Map to required structure
              _id: q._id, // Keep ID for existing questions
              question: q.question || "",
              questionType: screeningQuestionTypeOptions.some(
                (opt) => opt.value === q.questionType
              )
                ? q.questionType
                : "short_answer",
              options:
                Array.isArray(q.options) &&
                (q.questionType === "single_choice" ||
                  q.questionType === "multi_choice")
                  ? q.options.filter((opt) => opt !== null && opt !== undefined)
                  : [], // Filter null options for choice types
              isMandatory: q.isMandatory ?? false,
            }))
            .map((q) => {
              // Add empty option field for choice types if none exist after filtering
              if (
                ["single_choice", "multi_choice"].includes(q.questionType) &&
                q.options.length === 0
              ) {
                return { ...q, options: [""] };
              }
              return q;
            })
            .filter(
              (q) =>
                q.question.trim() !== "" ||
                !["single_choice", "multi_choice"].includes(q.questionType) ||
                (Array.isArray(q.options) &&
                  q.options.filter((opt) => opt.trim() !== "").length > 0)
            ), // Final filter to remove invalid choice questions
          experience: {
            // Handle object or single number
            minExperience:
              (typeof fetchedJob.experience === "object"
                ? fetchedJob.experience?.minExperience
                : fetchedJob.experience) !== undefined &&
              fetchedJob.experience !== null
                ? String(
                    typeof fetchedJob.experience === "object"
                      ? fetchedJob.experience.minExperience
                      : fetchedJob.experience
                  )
                : "",
            maxExperience:
              typeof fetchedJob.experience === "object" &&
              fetchedJob.experience?.maxExperience !== undefined &&
              fetchedJob.experience.maxExperience !== null
                ? String(fetchedJob.experience.maxExperience)
                : "",
          },
          companyType: fetchedJob.companyType || "", // Industry string
          applicationLink: fetchedJob.applicationLink || "",
          graduationYear: {
            minBatch:
              fetchedJob.graduationYear?.minBatch !== undefined &&
              fetchedJob.graduationYear?.minBatch !== null
                ? String(fetchedJob.graduationYear.minBatch)
                : "",
            maxBatch:
              fetchedJob.graduationYear?.maxBatch !== undefined &&
              fetchedJob.graduationYear?.maxBatch !== null
                ? String(fetchedJob.graduationYear.maxBatch)
                : "",
          },
          tags: Array.isArray(fetchedJob.tags)
            ? fetchedJob.tags.filter((t) => t !== null && t !== undefined)
            : [],
          diversityPreferences: {
            // Ensure object exists and has boolean defaults
            femaleCandidates:
              fetchedJob.diversityPreferences?.femaleCandidates ?? false,
            // Check for both possible backend keys
            womenJoiningBackforce:
              fetchedJob.diversityPreferences?.womenJoiningBackforce ??
              fetchedJob.diversityPreferences?.womenJoiningBackWorkforce ??
              false,
            exDefencePersonnel:
              fetchedJob.diversityPreferences?.exDefencePersonnel ?? false,
            differentlyAbledCandidates:
              fetchedJob.diversityPreferences?.differentlyAbledCandidates ??
              false,
            workFromHome:
              fetchedJob.diversityPreferences?.workFromHome ?? false,
          },
          category: fetchedJob.category || "",
          functionalArea: fetchedJob.functionalArea || "",
          isPremiumJob: fetchedJob.isPremiumJob ?? false,
        });

        // Add one empty screening question field if the filtered list is still empty
        setJobData((prev) => {
          if (prev.screeningQuestions.length === 0) {
            return {
              ...prev,
              screeningQuestions: [
                {
                  question: "",
                  questionType: "short_answer",
                  options: [],
                  isMandatory: false,
                },
              ],
            };
          }
          return prev;
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
      console.error("Fetch Error:", err);
      const errorMessage =
        err.message || "An error occurred while fetching job data.";
      setError(errorMessage);
      setInitialLoadError(errorMessage);
      setNotification({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  // --- State Update Handlers ---

  // Generic handler for text, number, boolean fields and nested number objects
  const handleInputChange = (field, value) => {
    if (
      field.startsWith("salary.") ||
      field.startsWith("experience.") ||
      field.startsWith("graduationYear.")
    ) {
      setJobData((prev) => {
        const [parent, child] = field.split(".");
        // Allow empty string, otherwise ensure it's a string representation of the number
        const numValue = value === "" ? "" : String(value);

        // Optional: Add inline validation for number inputs if desired,
        // but primary number validation is in prepareDataForSave
        if (numValue !== "" && isNaN(Number(numValue))) {
          // Prevent updating state with non-numeric input
          setNotification({
            open: true,
            message: "Please enter a valid number.",
            severity: "warning",
          });
          return prev;
        }
        if (numValue !== "" && Number(numValue) < 0) {
          setNotification({
            open: true,
            message: "Value cannot be negative.",
            severity: "warning",
          });
          return prev;
        }

        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: numValue,
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

  // Handler for React-Select fields (single or multi)
  const handleSelectChange = (field, selectedOptions) => {
    if (Array.isArray(selectedOptions)) {
      // Multi-select
      const values = selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [];
      setJobData((prev) => ({ ...prev, [field]: values }));
    } else {
      // Single select
      const value = selectedOptions ? selectedOptions.value : "";
      setJobData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle changes in dynamic text array fields (requirements)
  const handleArrayChange = (field, index, value) => {
    setJobData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  // Add items to dynamic text array fields (requirements)
  const addArrayItem = (field) => {
    // Default value "" is handled implicitly
    if (Array.isArray(jobData[field])) {
      // Prevent adding if the last item is empty for requirements
      if (
        field === "requirements" &&
        jobData[field].length > 0 &&
        jobData[field][jobData[field].length - 1].trim() === ""
      ) {
        setNotification({
          open: true,
          message: `Please fill the last ${field.slice(
            0,
            -1
          )} before adding a new one.`,
          severity: "warning",
        });
        return;
      }

      setJobData((prev) => ({
        ...prev,
        [field]: [...prev[field], ""],
      }));
    }
  };

  // Remove items from dynamic text array fields (requirements)
  const removeArrayItem = (field, index) => {
    if (Array.isArray(jobData[field])) {
      // Prevent removing the last item for requirements
      if (field === "requirements" && jobData[field].length <= 1) {
        // setNotification({ open: true, message: "You must have at least one requirement.", severity: "warning" });
        return;
      }
      setJobData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  // --- Screening Questions Handlers ---

  // Handle changes to properties *within* a specific screening question object
  const handleScreeningQuestionObjectChange = (index, updatedQuestion) => {
    setJobData((prevState) => {
      const updatedQuestions = [...prevState.screeningQuestions];
      updatedQuestions[index] = updatedQuestion;
      return { ...prevState, screeningQuestions: updatedQuestions };
    });
  };

  // Handle change to an option text within a specific screening question
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setJobData((prevState) => {
      const updatedQuestions = [...prevState.screeningQuestions];
      // Ensure options array exists and is mutable
      const currentOptions = Array.isArray(
        updatedQuestions[questionIndex].options
      )
        ? [...updatedQuestions[questionIndex].options]
        : [];
      currentOptions[optionIndex] = value; // Update the specific option string
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: currentOptions, // Update options array in the question object
      };
      return { ...prevState, screeningQuestions: updatedQuestions };
    });
  };

  // Add an option to a specific screening question
  const handleAddOption = (questionIndex) => {
    setJobData((prevState) => {
      const updatedQuestions = [...prevState.screeningQuestions];
      // Ensure options array exists and is mutable
      const currentOptions = Array.isArray(
        updatedQuestions[questionIndex].options
      )
        ? [...updatedQuestions[questionIndex].options]
        : [];

      // Add only if the last option is not empty or if the array is empty
      if (
        currentOptions.length === 0 ||
        (currentOptions.length > 0 &&
          currentOptions[currentOptions.length - 1]?.trim() !== "")
      ) {
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          options: [...currentOptions, ""], // Add a new empty option string
        };
        return { ...prevState, screeningQuestions: updatedQuestions };
      } else {
        setNotification({
          open: true,
          message: "Please fill the last option before adding a new one.",
          severity: "warning",
        });
        return prevState; // Return previous state if validation fails
      }
    });
  };

  // Remove an option from a specific screening question
  const handleRemoveOption = (questionIndex, optionIndexToRemove) => {
    setJobData((prevState) => {
      const updatedQuestions = [...prevState.screeningQuestions];
      // Ensure options array exists and is mutable
      const currentOptions = Array.isArray(
        updatedQuestions[questionIndex].options
      )
        ? [...updatedQuestions[questionIndex].options]
        : [];

      // Only allow removing if there's more than one option, OR it's the last option but has content
      if (
        currentOptions.length > 1 ||
        (currentOptions.length === 1 && currentOptions[0]?.trim() !== "")
      ) {
        const updatedOptions = currentOptions.filter(
          (_, index) => index !== optionIndexToRemove
        );

        // If removing the last option results in an empty array, add one empty option field back for UI consistency
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          options: updatedOptions.length === 0 ? [""] : updatedOptions,
        };
        return { ...prevState, screeningQuestions: updatedQuestions };
      } else {
        return prevState; // Do nothing if trying to remove the last empty option
      }
    });
  };

  // Add a new empty screening question
  const addScreeningQuestion = () => {
    // Count questions that have at least some text or valid options (for choice types)
    const currentValidQuestions = jobData.screeningQuestions.filter(
      (q) =>
        q.question.trim() !== "" ||
        (["single_choice", "multi_choice"].includes(q.questionType) &&
          Array.isArray(q.options) &&
          q.options.filter((opt) => opt.trim() !== "").length > 0)
    ).length;

    if (currentValidQuestions >= 10) {
      setNotification({
        open: true,
        message: "You can add a maximum of 10 screening questions.",
        severity: "warning",
      });
      return;
    }

    // Add only if the last question is valid (has text or valid options if choice type)
    const lastQuestion =
      jobData.screeningQuestions[jobData.screeningQuestions.length - 1];

    const isLastQuestionValid =
      !lastQuestion || // Should not happen with initial state, but defensive
      lastQuestion.question.trim() !== "" ||
      (["single_choice", "multi_choice"].includes(lastQuestion.questionType) &&
        Array.isArray(lastQuestion.options) &&
        lastQuestion.options.filter((opt) => opt.trim() !== "").length > 0);

    if (isLastQuestionValid) {
      setJobData((prevState) => ({
        ...prevState,
        screeningQuestions: [
          ...prevState.screeningQuestions,
          {
            question: "",
            questionType: "short_answer",
            options: [],
            isMandatory: false,
          }, // New empty question object
        ],
      }));
    } else {
      setNotification({
        open: true,
        message:
          "Please fill the last screening question before adding a new one.",
        severity: "warning",
      });
    }
  };

  // Remove a screening question
  const removeScreeningQuestion = (indexToRemove) => {
    // Allow removing only if more than 1 question, OR if it's the last question but has content
    const questions = jobData.screeningQuestions;
    const questionToRemove = questions[indexToRemove];

    // A question is considered "removable" if it's not the *only* question OR
    // if it is the only question but contains some form of meaningful input (text or valid options)
    const canRemoveLast =
      questions.length === 1 &&
      (questionToRemove.question.trim() !== "" ||
        (["single_choice", "multi_choice"].includes(
          questionToRemove.questionType
        ) &&
          Array.isArray(questionToRemove.options) &&
          questionToRemove.options.filter((opt) => opt.trim() !== "").length >
            0));

    const canRemove = questions.length > 1 || canRemoveLast;

    if (canRemove) {
      setJobData((prevState) => {
        const updatedQuestions = prevState.screeningQuestions.filter(
          (_, index) => index !== indexToRemove
        );
        // If the array becomes empty, add one empty question back for display
        if (updatedQuestions.length === 0) {
          return {
            ...prevState,
            screeningQuestions: [
              {
                question: "",
                questionType: "short_answer",
                options: [],
                isMandatory: false,
              },
            ],
          };
        }
        return { ...prevState, screeningQuestions: updatedQuestions };
      });
    } else {
      // Do nothing if trying to remove the last empty question
    }
  };

  // --- Validation and Data Preparation ---

  const prepareDataForSave = () => {
    // --- Frontend Validation ---
    const requiredFields = [
      "jobTitle",
      "jobDescription",
      "workType",
      "workMode",
      "category",
      "functionalArea",
      "salaryCategory",
      "qualifications", // Multi-select qualifications are required
    ];

    for (const field of requiredFields) {
      const value = jobData[field];

      if (typeof value === "string" && value.trim() === "") {
        setNotification({
          open: true,
          message: `Required field is missing or empty: ${field
            .replace(/([A-Z])/g, " $1")
            .trim()
            .toLowerCase()}.`,
          severity: "error",
        });
        return null;
      }
      if (Array.isArray(value) && value.length === 0) {
        setNotification({
          open: true,
          message: `Required multi-select field needs at least one selection: ${field
            .replace(/([A-Z])/g, " $1")
            .trim()
            .toLowerCase()}.`,
          severity: "error",
        });
        return null;
      }
      if (value === null) {
        setNotification({
          open: true,
          message: `Required select field is missing: ${field
            .replace(/([A-Z])/g, " $1")
            .trim()
            .toLowerCase()}.`,
          severity: "error",
        });
        return null;
      }
    }

    // Validate min/max ranges
    const validateRange = (field, label) => {
      const minVal =
        jobData[field][
          `min${field
            .replace(/./, (c) => c.toUpperCase())
            .replace("Graduation", "Batch")}`
        ];
      const maxVal =
        jobData[field][
          `max${field
            .replace(/./, (c) => c.toUpperCase())
            .replace("Graduation", "Batch")}`
        ];

      // Only check if both are provided (not empty string or null) AND min > max
      if (
        minVal !== "" &&
        minVal !== null &&
        maxVal !== "" &&
        maxVal !== null &&
        Number(minVal) > Number(maxVal)
      ) {
        setNotification({
          open: true,
          message: `Minimum ${label} cannot be greater than maximum ${label}.`,
          severity: "error",
        });
        return false;
      }
      if (minVal > 1000 || maxVal > 1000) {
        setNotification({
          open: true,
          message: `${label} values cannot exceed 1000.`,
          severity: "error",
        });
        return false;
      }
      return true;
    };
    const Salaryvalid = (field, label) => {
      const minVal =
        jobData[field][
          `min${field
            .replace(/./, (c) => c.toUpperCase())
            .replace("Graduation", "Batch")}`
        ];
      const maxVal =
        jobData[field][
          `max${field
            .replace(/./, (c) => c.toUpperCase())
            .replace("Graduation", "Batch")}`
        ];

      // Only check if both are provided (not empty string or null) AND min > max
      if (
        minVal !== "" &&
        minVal !== null &&
        maxVal !== "" &&
        maxVal !== null &&
        Number(minVal) > Number(maxVal)
      ) {
        setNotification({
          open: true,
          message: `Minimum ${label} cannot be greater than maximum ${label}.`,
          severity: "error",
        });
        return false;
      }
      if (minVal <= 0 || maxVal <= 0) {
        setNotification({
          open: true,
          message: `${label} values cannot be 0.`,
          severity: "error",
        });
        return false;
      }
      return true;
    };

    if (!validateRange("salary", "salary")) return null;
    if (!validateRange("experience", "experience")) return null;
    if (!validateRange("graduationYear", "batch year")) return null;
    if (!Salaryvalid("salary", "salary")) return null;

    // Validate screening questions
    const validScreeningQuestions = jobData.screeningQuestions.filter((q) => {
      const hasText = q.question.trim() !== "";
      const hasValidOptions =
        q.questionType === "single_choice" || q.questionType === "multi_choice"
          ? Array.isArray(q.options) &&
            q.options.filter((opt) => opt.trim() !== "").length > 0
          : true;
      const hasType = !!q.questionType;

      return hasText && hasValidOptions && hasType;
    });

    if (validScreeningQuestions.length === 0) {
      setNotification({
        open: true,
        message:
          "Please add at least one screening question with text and valid options (if applicable).",
        severity: "error",
      });
      return null;
    }

    const cleanedQualifications = jobData.qualifications
      .map((q) => String(q)?.trim())
      .filter((qual) => qual !== "");

    const cleanedSkills = jobData.skills
      .map((s) => String(s)?.trim())
      .filter((s) => s !== "");
    const cleanedTags = jobData.tags
      .map((t) => String(t)?.trim())
      .filter((t) => t !== "");

    // Filter out invalid screening questions and clean up their options
    const cleanedScreeningQuestions = jobData.screeningQuestions
      .filter((q) => q.question?.trim() !== "") // Only include questions with text
      .map((q) => {
        const baseQuestion = {
          // Use optional chaining for safety
          question: q.question?.trim() || "",
          questionType: q.questionType || "short_answer", // Ensure type
          isMandatory: q.isMandatory ?? false,
        };
        if (q._id) {
          baseQuestion._id = q._id;
        }

        if (
          q.questionType === "single_choice" ||
          q.questionType === "multi_choice"
        ) {
          baseQuestion.options = (Array.isArray(q.options) ? q.options : [])
            .map((opt) => String(opt)?.trim())
            .filter((opt) => opt !== "");
        } else {
          baseQuestion.options = [];
        }
        return baseQuestion;
      })
      // Final filter to remove choice questions that ended up with no options
      .filter((q) => {
        if (
          q.questionType === "single_choice" ||
          q.questionType === "multi_choice"
        ) {
          return q.options.length > 0;
        }
        return q.question.trim() !== ""; // Keep non-choice if it had text
      });

    // Convert number strings back to numbers or null
    const formatNumberField = (value) => (value === "" ? null : Number(value));

    const salaryToSend = {
      minSalary: formatNumberField(jobData.salary.minSalary),
      maxSalary: formatNumberField(jobData.salary.maxSalary),
    };
    if (salaryToSend.minSalary === null && salaryToSend.maxSalary === null) {
      // Decide if you send an empty object, null, or omit the key
      // Omitting keys for null values seems reasonable
      delete salaryToSend.minSalary;
      delete salaryToSend.maxSalary;
    }

    const experienceToSend = {
      minExperience: formatNumberField(jobData.experience.minExperience),
      maxExperience: formatNumberField(jobData.experience.maxExperience),
    };
    if (
      experienceToSend.minExperience === null &&
      experienceToSend.maxExperience === null
    ) {
      delete experienceToSend.minExperience;
      delete experienceToSend.maxExperience;
    }

    const graduationYearToSend = {
      minBatch: formatNumberField(jobData.graduationYear.minBatch),
      maxBatch: formatNumberField(jobData.graduationYear.maxBatch),
    };
    if (
      graduationYearToSend.minBatch === null &&
      graduationYearToSend.maxBatch === null
    ) {
      delete graduationYearToSend.minBatch;
      delete graduationYearToSend.maxBatch;
    }

    const dataToSend = {
      jobId: jobId,
      jobTitle: jobData.jobTitle.trim(),
      jobLocation: jobData.jobLocation?.trim() || "", // Handle null location gracefully
      salary: salaryToSend,
      salaryConfidential: jobData.salaryConfidential,
      salaryCategory: jobData.salaryCategory,
      status: jobData.status,
      workType: jobData.workType,
      workMode: jobData.workMode,
      jobDescription: jobData.jobDescription.trim(),
      skills: cleanedSkills,
      qualifications: cleanedQualifications,
      screeningQuestions: cleanedScreeningQuestions,
      experience: experienceToSend,
      companyType: jobData.companyType?.trim() || "", // Industry, handle null gracefully
      applicationLink: jobData.applicationLink?.trim() || "",
      graduationYear: graduationYearToSend,
      tags: cleanedTags,
      diversityPreferences: jobData.diversityPreferences,
      category: jobData.category,
      functionalArea: jobData.functionalArea,
      isPremiumJob: jobData.isPremiumJob,
    };

    console.log("Prepared Data for Save:", dataToSend);
    return dataToSend;
  };

  // Save job
  const handleSave = async () => {
    if (!jobId) {
      setNotification({
        open: true,
        message: "Not able to load job data can you try after Login again.",
        severity: "error",
      });
      return;
    }

    const dataToSend = prepareDataForSave();
    if (!dataToSend) {
      return;
    } // Validation failed

    setSaving(true);
    setError(null);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      if (!token) {
        setNotification({
          open: true,
          message: "Authentication token missing. Please log in again.",
          severity: "error",
        });
        // navigate("/login"); // Consider redirecting
        return;
      }

      const response = await fetch(
        `https://highimpacttalent.onrender.com/api-v1/jobs/update-job`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to update job: ${response.status} - ${response.statusText}`;
        try {
          const errorJson = await response.json();
          errorMessage = errorJson.message || errorMessage;
        } catch {
          /* ignore */
        }
        console.error("API Error Response:", response.status, errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success) {
        setNotification({
          open: true,
          message: result.message || "Job updated successfully!",
          severity: "success",
        });
        fetchJobData(); // Re-fetch to get latest data including potential new IDs
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
      console.error("Submission Error:", err);
      const errorMessage =
        err.message || "An error occurred while updating job.";
      setError(errorMessage);
      setNotification({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Publish job
  const handlePublish = async () => {
    const dataToSend = prepareDataForSave();
    if (!dataToSend) {
      return;
    } // Validation failed

    if (jobData.status === "live") {
      setNotification({
        open: true,
        message: "Job is already published.",
        severity: "info",
      });
      return;
    }

    dataToSend.status = "live";

    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setNotification({
          open: true,
          message: "Authentication token missing. Please log in again.",
          severity: "error",
        });
        // navigate("/login"); // Consider redirecting
        return;
      }

      const response = await fetch(
        `https://highimpacttalent.onrender.com/api-v1/jobs/update-job`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to publish job: ${response.status} - ${response.statusText}`;
        try {
          const errorJson = await response.json();
          errorMessage = errorJson.message || errorMessage;
        } catch {
          /* ignore */
        }
        console.error("API Error Response:", response.status, errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success) {
        setNotification({
          open: true,
          message: result.message || "Job published successfully!",
          severity: "success",
        });
        setJobData((prev) => ({ ...prev, status: "live" })); // Update state immediately
        fetchJobData(); // Re-fetch to be sure
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
      console.error("Publish Error:", err);
      const errorMessage =
        err.message || "An error occurred while publishing job.";
      setError(errorMessage);
      setNotification({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Handle notification close
  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // --- Render Logic ---

  // Show loading state for initial fetch
  if (loading && !initialLoadError) {
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

  // Show error state for initial fetch failure
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
      <Box sx={{ bgcolor: "white", minHeight: "100vh", py: 4 }}>
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

          {/* Error Alert for Save/Publish */}
          {error && (
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
                      <Typography variant="body2" sx={{ ...formLabelStyle }}>
                        Job Title<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        value={jobData.jobTitle}
                        onChange={(e) =>
                          handleInputChange("jobTitle", e.target.value)
                        }
                        required
                        variant="outlined"
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ ...formLabelStyle }}>
                        Job Location
                      </Typography>

                      <Select
                        options={citiesOptions}
                        value={
                          citiesOptions.find(
                            (opt) => opt.value === jobData.jobLocation
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange("jobLocation", selectedOption)
                        }
                        placeholder="Select Location..."
                        isClearable
                        isSearchable
                        styles={customSelectStyle}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" sx={{ ...formLabelStyle }}>
                          Industry<span style={{ color: "red" }}>*</span>
                        </Typography>
                        <Select
                          options={industryOptions}
                          value={
                            jobData.companyType
                              ? industryOptions.find(
                                  (opt) => opt.value === jobData.companyType
                                )
                              : null
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange("companyType", selectedOption)
                          }
                          placeholder="Select Industry..."
                          isClearable
                          isSearchable
                          required
                          styles={customSelectStyle}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box>
                        <Typography variant="body2" sx={{ ...formLabelStyle }}>
                          Work Type <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <Select
                          options={workTypesList.map((wt) => ({
                            value: wt,
                            label: wt,
                          }))}
                          value={
                            workTypesList
                              .map((wt) => ({ value: wt, label: wt }))
                              .find(
                                (opt) =>
                                  opt.value?.toLowerCase() ===
                                  jobData?.workType?.toLowerCase()
                              ) || null
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange("workType", selectedOption)
                          }
                          placeholder="Work Type"
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                          required
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box>
                        <Typography variant="body2" sx={{ ...formLabelStyle }}>
                          Work Mode<span style={{ color: "red" }}>*</span>
                        </Typography>
                        <Select
                          options={workModeList.map((wm) => ({
                            value: wm,
                            label: wm,
                          }))}
                          value={
                            workModeList
                              .map((wm) => ({ value: wm, label: wm }))
                              .find(
                                (opt) =>
                                  opt.value?.toLowerCase() ===
                                  jobData?.workMode?.toLowerCase()
                              ) || null
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange("workMode", selectedOption)
                          }
                          placeholder="Work Mode"
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                          required
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box>
                        <Typography variant="body2" sx={{ ...formLabelStyle }}>
                          Status
                        </Typography>
                        <Select
                          options={statusOptionsList.map((s) => ({
                            value: s,
                            label: s,
                          }))}
                          value={
                            statusOptionsList
                              .map((s) => ({ value: s, label: s }))
                              .find(
                                (opt) =>
                                  opt.value?.toLowerCase() ===
                                  jobData?.status?.toLowerCase()
                              ) || null
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange("status", selectedOption)
                          }
                          placeholder="Status"
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                        />
                      </Box>
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
                      <Typography variant="body2" sx={{ ...formLabelStyle }}>
                        Minimum Salary<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={jobData.salary.minSalary}
                        onChange={(e) =>
                          handleInputChange("salary.minSalary", e.target.value)
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                          inputProps: { min: 0 },
                        }}
                        InputLabelProps={{ shrink: !!jobData.salary.minSalary }}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ ...formLabelStyle }}>
                        Maximum Salary<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={jobData.salary.maxSalary}
                        onChange={(e) =>
                          handleInputChange("salary.maxSalary", e.target.value)
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                          inputProps: {
                            min:
                              jobData.salary.minSalary !== ""
                                ? Number(jobData.salary.minSalary)
                                : 0,
                          },
                        }}
                        InputLabelProps={{ shrink: !!jobData.salary.maxSalary }}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" sx={{ ...formLabelStyle }}>
                          Salary Category{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <Select
                          options={salaryCategoryOptions}
                          value={
                            salaryCategoryOptions.find(
                              (opt) => opt.value === jobData.salaryCategory
                            ) || null
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange("salaryCategory", selectedOption)
                          }
                          placeholder="Select Salary Category..."
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                          required
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Job Description */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Job Description<span style={{ color: "red" }}>*</span>
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={jobData.jobDescription}
                    onChange={(e) =>
                      handleInputChange("jobDescription", e.target.value)
                    }
                    required
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: !!jobData.jobDescription }}
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
                    Skills
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="body2" sx={{ ...formLabelStyle }}>
                          Skills Required{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <Select
                          isMulti
                          options={skillOptions}
                          value={skillOptions.filter((opt) =>
                            jobData.skills.includes(opt.value)
                          )}
                          onChange={(selectedOptions) =>
                            handleSelectChange("skills", selectedOptions)
                          }
                          placeholder="Select or type skills..."
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                          required
                        />
                      </Box>
                    </Grid>

                    {/* Qualifications (Multi-Select) */}
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="body2" sx={{ ...formLabelStyle }}>
                          Educational Qualifications{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <Select
                          isMulti
                          options={qualificationsSelectOptions}
                          value={qualificationsSelectOptions.filter((opt) =>
                            jobData.qualifications.includes(opt.value)
                          )}
                          onChange={(selectedOptions) =>
                            handleSelectChange(
                              "qualifications",
                              selectedOptions
                            )
                          }
                          placeholder="Select qualifications..."
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                          required
                        />
                      </Box>
                    </Grid>

                    {/* Screening Questions */}
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ ...formLabelStyle }}>
                        Screening Questions{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, fontSize: "0.875rem" }}
                      >
                        Add questions candidates must answer. Specify type and
                        options for multiple choice.
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mb: 2,
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          color: "text.primary",
                        }}
                      >
                        Added Questions (
                        {
                          jobData.screeningQuestions.filter(
                            (q) => q.question?.trim() !== ""
                          ).length
                        }
                        /{10})
                      </Typography>

                      {/* Screening Questions List */}
                      {(jobData.screeningQuestions.length === 0
                        ? [
                            {
                              question: "",
                              questionType: "short_answer",
                              options: [],
                              isMandatory: false,
                            },
                          ]
                        : jobData.screeningQuestions
                      ).map((sq, index) => (
                        <Box
                          key={sq._id || `new-${index}`}
                          sx={{
                            border: "1px solid #eee",
                            p: 2,
                            mb: 3,
                            borderRadius: 2,
                            position: "relative",
                          }}
                        >
                          {/* Remove Question Button */}
                          {(jobData.screeningQuestions.length > 1 ||
                            (jobData.screeningQuestions.length === 1 &&
                              (sq.question?.trim() !== "" ||
                                (["single_choice", "multi_choice"].includes(
                                  sq.questionType
                                ) &&
                                  Array.isArray(sq.options) &&
                                  sq.options.filter((opt) => opt?.trim() !== "")
                                    .length > 0)))) && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeScreeningQuestion(index)}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                p: "4px",
                                bgcolor: "white",
                                zIndex: 1,
                                "&:hover": { bgcolor: "#f9f9f9" },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}

                          {/* Question Text Field */}
                          <Box
                            mb={2}
                            pr={
                              jobData.screeningQuestions.length > 1 ||
                              (jobData.screeningQuestions.length === 1 &&
                                (sq.question?.trim() !== "" ||
                                  (["single_choice", "multi_choice"].includes(
                                    sq.questionType
                                  ) &&
                                    Array.isArray(sq.options) &&
                                    sq.options.filter(
                                      (opt) => opt?.trim() !== ""
                                    ).length > 0)))
                                ? 4
                                : 0
                            }
                          >
                            <Typography
                              variant="body2"
                              sx={{ ...formLabelStyle }}
                            >
                              Question Text{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Typography>
                            <TextField
                              fullWidth
                              placeholder={`Question ${index + 1}`}
                              size="small"
                              value={sq.question}
                              onChange={(e) =>
                                handleScreeningQuestionObjectChange(index, {
                                  ...sq,
                                  question: e.target.value,
                                })
                              }
                              variant="outlined"
                              required
                              InputLabelProps={{ shrink: !!sq.question }}
                            />
                          </Box>

                          {/* Question Type Select */}
                          <Box mb={2}>
                            <Typography
                              variant="body2"
                              sx={{ ...formLabelStyle }}
                            >
                              Question Type{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Typography>
                            <Select
                              options={screeningQuestionTypeOptions}
                              value={
                                screeningQuestionTypeOptions.find(
                                  (opt) => opt.value === sq.questionType
                                ) || null
                              }
                              onChange={(selectedOption) => {
                                const newType = selectedOption
                                  ? selectedOption.value
                                  : "short_answer";
                                const updatedQuestion = {
                                  ...sq,
                                  questionType: newType,
                                };
                                if (
                                  newType !== "single_choice" &&
                                  newType !== "multi_choice"
                                ) {
                                  updatedQuestion.options = [];
                                } else if (
                                  updatedQuestion.options.length === 0
                                ) {
                                  updatedQuestion.options = [""];
                                }
                                handleScreeningQuestionObjectChange(
                                  index,
                                  updatedQuestion
                                );
                              }}
                              placeholder="Select Type"
                              isClearable={false}
                              isSearchable={false}
                              styles={customSelectStyle}
                              required
                            />
                          </Box>

                          {/* Mandatory Checkbox */}
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={sq.isMandatory}
                                onChange={(e) =>
                                  handleScreeningQuestionObjectChange(index, {
                                    ...sq,
                                    isMandatory: e.target.checked,
                                  })
                                }
                                color="primary"
                                size="small"
                              />
                            }
                            label={
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "0.875rem" }}
                              >
                                Mandatory
                              </Typography>
                            }
                            sx={{ mt: 1, mb: 1 }}
                          />

                          {/* Options Input (Conditional) */}
                          {(sq.questionType === "single_choice" ||
                            sq.questionType === "multi_choice") && (
                            <Box mt={2} pl={2}>
                              <Typography
                                variant="body2"
                                sx={{ ...formLabelStyle, mb: 1 }}
                              >
                                Options <span style={{ color: "red" }}>*</span>
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1, fontSize: "0.75rem" }}
                              >
                                Provide options for candidates to select. At
                                least one non-empty option is required.
                              </Typography>
                              {(Array.isArray(sq.options) &&
                              sq.options.length > 0
                                ? sq.options
                                : [""]
                              ).map((option, optIndex) => (
                                <Box
                                  key={`sq-${index}-opt-${optIndex}`}
                                  display="flex"
                                  alignItems="center"
                                  mb={1}
                                  gap={1}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      minWidth: 16,
                                      flexShrink: 0,
                                      textAlign: "right",
                                      color: "text.primary",
                                    }}
                                  >
                                    {optIndex + 1}.
                                  </Typography>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    value={option}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        index,
                                        optIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Option ${optIndex + 1}`}
                                    InputLabelProps={{ shrink: !!option }}
                                  />
                                  {Array.isArray(sq.options) &&
                                    sq.options.length > 1 && (
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                          handleRemoveOption(index, optIndex)
                                        }
                                        sx={{ flexShrink: 0 }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                </Box>
                              ))}
                              {(Array.isArray(sq.options) &&
                                sq.options.length > 0 &&
                                sq.options[sq.options.length - 1]?.trim() !==
                                  "") ||
                              (Array.isArray(sq.options) &&
                                sq.options.length === 0) ? (
                                <Button
                                  variant="text"
                                  onClick={() => handleAddOption(index)}
                                  startIcon={<AddIcon />}
                                  size="small"
                                  sx={{ mt: 0.5 }}
                                >
                                  Add Option
                                </Button>
                              ) : (
                                <Button
                                  variant="text"
                                  disabled
                                  startIcon={<AddIcon />}
                                  size="small"
                                  sx={{ mt: 0.5, color: "#ccc" }}
                                >
                                  Add Option
                                </Button>
                              )}
                            </Box>
                          )}
                        </Box>
                      ))}
                      {/* Add Screening Question Button */}
                      <Button
                        variant="outlined"
                        onClick={addScreeningQuestion}
                        startIcon={<AddIcon />}
                        size="small"
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
                      <Typography variant="body2" sx={{ ...formLabelStyle }}>
                        Minimum Experience (Years)<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        required
                        type="number"
                        value={jobData.experience.minExperience}
                        onChange={(e) =>
                          handleInputChange(
                            "experience.minExperience",
                            e.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: !!jobData.experience.minExperience,
                        }}
                        size="small"
                        inputProps={{ min: 0 }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ ...formLabelStyle }}>
                        Maximum Experience (Years)<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={jobData.experience.maxExperience}
                        required
                        onChange={(e) =>
                          handleInputChange(
                            "experience.maxExperience",
                            e.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: !!jobData.experience.maxExperience,
                        }}
                        size="small"
                        inputProps={{
                          min:
                            jobData.experience.minExperience !== ""
                              ? Number(jobData.experience.minExperience)
                              : 0,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ ...formLabelStyle }}>
                        Minimum Graduation Year Batch
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={jobData.graduationYear.minBatch}
                        onChange={(e) =>
                          handleInputChange(
                            "graduationYear.minBatch",
                            e.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: !!jobData.graduationYear.minBatch,
                        }}
                        size="small"
                        inputProps={{
                          min: 1900,
                          max: new Date().getFullYear() + 5,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ ...formLabelStyle }}>
                        Maximum Graduation Year Batch
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={jobData.graduationYear.maxBatch}
                        onChange={(e) =>
                          handleInputChange(
                            "graduationYear.maxBatch",
                            e.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: !!jobData.graduationYear.maxBatch,
                        }}
                        size="small"
                        inputProps={{
                          min:
                            jobData.graduationYear.minBatch !== ""
                              ? Number(jobData.graduationYear.minBatch)
                              : 1900,
                          max: new Date().getFullYear() + 5,
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
                                size="small"
                              />
                            }
                            label={
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "0.875rem" }}
                              >
                                {key === "womenJoiningBackforce"
                                  ? "Women joining back workforce"
                                  : key
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) =>
                                        str.toUpperCase()
                                      )}
                              </Typography>
                            }
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
                    InputLabelProps={{ shrink: !!jobData.applicationLink }}
                    size="small"
                  />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ ...formLabelStyle }}>
                      Category<span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Select
                      options={categoryOptions}
                      value={
                        categoryOptions.find(
                          (opt) => opt.value === jobData.category
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        handleSelectChange("category", selectedOption)
                      }
                      placeholder="Select Category..."
                      isClearable
                      isSearchable
                      styles={customSelectStyle}
                      required
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ ...formLabelStyle }}>
                      Functional Area <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Select
                      options={functionalAreaOptions}
                      value={
                        functionalAreaOptions.find(
                          (opt) => opt.value === jobData.functionalArea
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        handleSelectChange("functionalArea", selectedOption)
                      }
                      placeholder="Select Functional Area..."
                      isClearable
                      isSearchable
                      styles={customSelectStyle}
                      required
                    />
                  </Box>

                  {/* Tags (Creatable Multi-select) */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ ...formLabelStyle }}>
                      Tags (Add multiple)
                    </Typography>
                    <CreatableSelect
                      isMulti
                      options={tagOptions}
                      value={jobData.tags.map((tag) => ({
                        value: tag,
                        label: tag,
                      }))}
                      onChange={(selectedOptions) =>
                        handleSelectChange("tags", selectedOptions)
                      }
                      placeholder="Select or create tags..."
                      isClearable
                      isSearchable
                      styles={customSelectStyle}
                    />
                  </Box>
                </Box>

                {/* Is Premium Job Switch */}
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={jobData.isPremiumJob}
                        onChange={(e) =>
                          handleInputChange("isPremiumJob", e.target.checked)
                        }
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                        Make this a Premium Job Post
                      </Typography>
                    }
                  />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Save Changes Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={
                      saving ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    onClick={handleSave}
                    size="large"
                    disabled={saving || loading || initialLoadError !== null}
                  >
                    {saving && !error ? "Saving..." : "Save Changes"}
                  </Button>

                  {/* Publish Job Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={
                      saving ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : jobData.status === "live" ? null : (
                        <AddIcon />
                      )
                    }
                    onClick={handlePublish}
                    size="large"
                    disabled={
                      saving ||
                      loading ||
                      initialLoadError !== null ||
                      jobData.status === "live"
                    }
                  >
                    {saving && !error && jobData?.status === "live"
                      ? "Publishing..."
                      : jobData.status === "live"
                      ? "Published"
                      : "Publish Job"}
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
