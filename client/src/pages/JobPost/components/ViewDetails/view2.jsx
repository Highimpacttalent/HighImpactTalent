import React, { useState, useEffect } from "react";
import Select from "react-select";
// import CreatableSelect from "react-select/creatable"; // Already using react-select for tags which supports creation
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
  MenuItem, // Not used with react-select
  Chip, // Not used with react-select
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
  Preview as PreviewIcon, // Not used
  LocationOn as LocationIcon, // Not used directly, but good for context
  Work as WorkIcon, // Not used directly
  School as SchoolIcon, // Not used directly
  Psychology as PsychologyIcon, // Not used directly
  Diversity3 as DiversityIcon, // Not used directly
  Star as StarIcon, // Not used directly
} from "@mui/icons-material";
import { createTheme, useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { skillsList } from "../../../../assets/mock"; // Assuming this path is correct
import {
  functionalAreasCategory,
  tagCategory,
  categoryOptions as categoryOptionsList,
  IndustryCategory,
} from "../../../../assets/functionalarea"; // Assuming this path is correct

// Helper styles (reusing concept from JobUploadPage for consistency if desired,
// but sticking to MUI sx props here as the original file did)
const formLabelStyle = {
  fontSize: "0.875rem", // 14px
  fontWeight: 500,
  color: "text.primary",
  mb: 0.5, // Reduced margin
  display: "block",
};

const sectionTitleStyle = {
  fontSize: "1.25rem", // 20px
  fontWeight: 600, // Adjusted to match MUI default h6 maybe? Or keep 700
  fontFamily: '"Satoshi", sans-serif', // Explicit font
  color: "text.primary", // Default text color
  mb: 2,
  mt: 1,
  display: "flex",
  alignItems: "center",
  gap: 1,
};


const theme = createTheme({
  palette: {
    primary: {
      main: "#3C7EFC", // Primary color from JobUploadPage
      light: "#64a2ff",
      dark: "#2d63cc",
    },
    secondary: {
       main: '#474E68', // Another color from JobUploadPage
       light: '#6d748c',
       dark: '#373a4e',
    },
    background: {
      default: "#f4f6f8", // Light grey background
      paper: "#ffffff",
    },
    text: {
        primary: '#404258', // Dark text color
        secondary: '#6b7280', // Lighter text color
    }
  },
  typography: {
    fontFamily:
      '"Satoshi", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontFamily: '"Satoshi", sans-serif',
      fontWeight: 700,
      color: '#474E68',
    },
     h5: {
       fontFamily: '"Satoshi", sans-serif',
       fontWeight: 600,
       color: '#474E68',
     },
    h6: {
      fontFamily: '"Satoshi", sans-serif', // Changed to Satoshi
      fontWeight: 700, // Changed to 700 for prominence
       color: '#3C7EFC', // Primary color for section titles
    },
    body1: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '1rem',
       color: '#404258',
    },
    body2: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '0.875rem',
       color: '#6b7280',
    },
      subtitle1: { // Used for subheadings like "Skills Required"
          fontFamily: '"Satoshi", sans-serif',
          fontWeight: 600,
          fontSize: '1rem',
          color: '#404258',
          mb: 1,
      }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)", // Softer shadow
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Matches JobUploadPage button radius concept
          textTransform: "none",
          fontWeight: 600,
          fontFamily: '"Satoshi", sans-serif',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
           '& .MuiInputBase-root': { // Apply styles to the input wrapper
               fontSize: '0.875rem', // 14px
           },
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
           "& input[type=number]": {
              "-moz-appearance": "textfield",
            },
            "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
              {
                "-webkit-appearance": "none",
                margin: 0,
              },
        },
      },
    },
     MuiInputLabel: { // Style label to match formLabelStyle visually
         styleOverrides: {
             root: {
                 fontSize: '0.875rem', // Match input font size
                  '&.Mui-focused': { // Keep color consistent when focused
                      color: '#3C7EFC',
                  },
             },
              shrink: { // When label shrinks (input filled), match formLabelStyle font weight
                 fontWeight: 500,
             }
         }
     },
    MuiSelect: { // This applies to MUI Select, but you're using react-select
       styleOverrides: {
         select: {
           borderRadius: 8,
           "& + .MuiOutlinedInput-notchedOutline": {
             borderRadius: 8,
           },
         },
       },
     },
     // Targeting React-Select components with MUI-like styles
     MuiOutlinedInput: { // Add style to match TextField border radius etc.
         styleOverrides: {
             root: {
                 borderRadius: 8,
                  fontSize: '0.875rem',
             }
         }
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
          backgroundColor: "#f8f8f8", // Slightly different background for summary
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
           boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)", // Subtle shadow for accordions
        },
      },
    },
  },
});

export default function JobEditForm() {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for redirection
  const jobId = location.state?.job?._id || location.pathname.split('/').pop(); // Try to get ID from state or URL
  const muiTheme = useTheme();

  // Options for React Select
  const [functionalAreaOptions, setFunctionalAreaOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [salaryCategoryOptions, setSalaryCategoryOptions] = useState([]);
  const [durationOptions, setDurationOptions] = useState([]);
  const [courseTypeOptions, setCourseTypeOptions] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);

   const screeningQuestionTypeOptions = [
    { value: 'yes/no', label: 'Yes/No' },
    { value: 'single_choice', label: 'Single Choice' },
    { value: 'multi_choice', label: 'Multi Choice' },
    { value: 'short_answer', label: 'Short Answer' },
    { value: 'long_answer', label: 'Long Answer' },
  ];


  // State for Job Data (Initialized with empty values)
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
    qualifications: [], // Changed to array [] as multi-select expects array
    screeningQuestions: [ // Updated structure
      {
        question: "",
        questionType: "short_answer", // Default type
        options: [], // Default empty array for options
        isMandatory: false,
        // _id will be added when fetching existing or on save for new
      },
    ],
    experience: { minExperience: "", maxExperience: "" },
    companyType: "", // Industry
    applicationLink: "",
    duration: "",
    graduationYear: { minBatch: "", maxBatch: "" },
    tags: [],
    courseType: "",
    diversityPreferences: {
      femaleCandidates: false,
      womenJoiningBackforce: false, // Typo fixed? -> womenJoiningBackWorkforce
      exDefencePersonnel: false,
      differentlyAbledCandidates: false,
      workFromHome: false,
    },
    category: "",
    functionalArea: "",
    isPremiumJob: false,
  });


  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true); // Loading for initial fetch
  const [saving, setSaving] = useState(false); // Loading for save/publish
  const [initialLoadError, setInitialLoadError] = useState(null);

  // Options arrays (matching backend enums or derived)
  const workTypes = [
    "Full-Time",
    "Part-Time",
    "Contract",
    "Temporary",
    // "Internship", // Added in UI options, but not backend schema. Kept for now.
  ];

  const workModes = ["Remote", "Hybrid", "Work From Office"];

  const statusOptions = ["live", "draft", "deleted", "paused"];
  const durationTypes = ["permanent", "contract", "temporary", "project-based"]; // Use lowercase matching backend
  const courseTypes = ["Full time", "Part time", "Distance Learning Program", "Executive Program", "Certification"];
  const salaryCategories = [
    "On Experience",
    "Competitive",
    "Fixed",
    "Negotiable",
    "Confidential",
  ];

  // Mapped options for React-Select from imported lists
   const categorySelectOptions = categoryOptionsList.map((cat) => ({
      value: cat, label: cat,
    }));

    const functionalAreaSelectOptions = functionalAreasCategory.map((area) => ({
      value: area, label: area,
    }));

    const tagSelectOptions = tagCategory.map((tag) => ({
      value: tag, label: tag,
    }));

    const industrySelectOptions = IndustryCategory.map((industry) => ({
      value: industry, label: industry,
    }));

    const workTypeSelectOptions = workTypes.map(type => ({ value: type, label: type }));
    const workModeSelectOptions = workModes.map(mode => ({ value: mode, label: mode }));
    const statusSelectOptions = statusOptions.map(status => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) })); // Capitalize for display
    const durationSelectOptions = durationTypes.map(dur => ({ value: dur, label: dur.charAt(0).toUpperCase() + dur.slice(1) }));
    const courseTypeSelectOptions = courseTypes.map(type => ({ value: type, label: type }));
     const salaryCategorySelectOptions = salaryCategories.map(cat => ({ value: cat, label: cat }));
    const skillSelectOptions = skillsList.map(skill => ({ value: skill, label: skill }));


   // Experience options for Min/Max Selects (1 to 50+)
   const experienceRangeOptions = Array.from({ length: 50 }, (_, i) => ({
     value: i + 1,
     label: `${i + 1}${i < 49 ? "" : "+"}`,
   }));

   // Batch Year options for Min/Max Selects
   const currentYear = new Date().getFullYear();
   const batchYearOptions = Array.from(
     { length: currentYear + 5 - 1970 + 1 },
     (_, i) => {
       const year = 1970 + i;
       return { value: year, label: year.toString() };
     }
   ).reverse(); // Show recent years first


  // React Select custom styles (Adjusted for consistency)
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
        display: 'none', // Hide the separator line
    }),
    dropdownIndicator: (provided) => ({ // Adjust padding
        ...provided,
        padding: '8px',
    }),
      clearIndicator: (provided) => ({ // Adjust padding
        ...provided,
        padding: '8px',
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
      // Use a generic apiRequest function if available, otherwise use fetch
      const response = await fetch(
        `https://highimpacttalent.onrender.com/api-v1/jobs/get-job-detail/${jobId}`
      );
      const result = await response.json();

      if (result.success && result.data) {
        const fetchedJob = result.data;

         // --- Data Processing to match state structure ---

        // Process salary (ensure numeric fields are strings for TextField values)
        const salaryState =
            fetchedJob.salary && typeof fetchedJob.salary === "object"
            ? {
                minSalary: String(fetchedJob.salary.minSalary ?? ""),
                maxSalary: String(fetchedJob.salary.maxSalary ?? ""),
              }
            : { minSalary: "", maxSalary: "" };


        // Process experience
        const experienceState =
           fetchedJob.experience && typeof fetchedJob.experience === "object"
            ? {
                minExperience: String(fetchedJob.experience.minExperience ?? ""),
                maxExperience: String(fetchedJob.experience.maxExperience ?? ""),
              }
            : { minExperience: "", maxExperience: "" };


        // Process graduation year
        const graduationYearState =
          fetchedJob.graduationYear && typeof fetchedJob.graduationYear === "object"
            ? {
                minBatch: String(fetchedJob.graduationYear.minBatch ?? ""),
                maxBatch: String(fetchedJob.graduationYear.maxBatch ?? ""),
              }
            : { minBatch: "", maxBatch: "" };

        // Process diversity preferences (handle older data that might miss fields)
        const diversityPreferencesState =
          fetchedJob.diversityPreferences && typeof fetchedJob.diversityPreferences === "object"
            ? {
                femaleCandidates: fetchedJob.diversityPreferences.femaleCandidates ?? false,
                // Check for potential typo in backend name as per your initial state
                womenJoiningBackWorkforce: fetchedJob.diversityPreferences.womenJoiningBackWorkforce ?? fetchedJob.diversityPreferences.womenJoiningBackforce ?? false,
                exDefencePersonnel: fetchedJob.diversityPreferences.exDefencePersonnel ?? false,
                differentlyAbledCandidates: fetchedJob.diversityPreferences.differentlyAbledCandidates ?? false,
                workFromHome: fetchedJob.diversityPreferences.workFromHome ?? false,
              }
            : { // Default all to false if the object is missing
                femaleCandidates: false,
                womenJoiningBackWorkforce: false,
                exDefencePersonnel: false,
                differentlyAbledCandidates: false,
                workFromHome: false,
              };

        // Process requirements (ensure array and filter nulls/empty, add empty if necessary for UI)
        const fetchedRequirements = Array.isArray(fetchedJob.requirements)
          ? fetchedJob.requirements.filter((req) => req !== null && req !== undefined)
          : [];
         // Add one empty string if the array is empty, so there's always an input field
        const requirementsState = fetchedRequirements.length === 0 ? [""] : fetchedRequirements;


        // Process qualifications (ensure array and filter nulls/empty)
         const qualificationsState = Array.isArray(fetchedJob.qualifications)
           ? fetchedJob.qualifications.filter((qual) => qual !== null && qual !== undefined)
           : []; // qualifications is a multi-select, so empty array is fine


        // Process screening questions (ensure array, filter invalid, map to new structure)
        const fetchedScreeningQuestions = Array.isArray(fetchedJob.screeningQuestions)
          ? fetchedJob.screeningQuestions.filter(q => q && typeof q === 'object' && q.question) // Filter out null/invalid objects
          : [];

        const screeningQuestionsState = fetchedScreeningQuestions.map(q => ({
            _id: q._id, // Keep _id for existing questions
            question: q.question || "",
            questionType: q.questionType || "short_answer", // Default type if missing
            options: Array.isArray(q.options) ? q.options.filter(opt => opt !== null && opt !== undefined) : [], // Ensure options is array and filter nulls
            isMandatory: q.isMandatory ?? false, // Default to false if missing
        }));

         // If no valid screening questions are fetched, add one empty one for UI
         if(screeningQuestionsState.length === 0) {
             screeningQuestionsState.push({
                  question: "",
                  questionType: "short_answer",
                  options: [],
                  isMandatory: false,
             });
         }


        // Process skills and tags (ensure arrays)
        const skillsState = Array.isArray(fetchedJob.skills) ? fetchedJob.skills : [];
        const tagsState = Array.isArray(fetchedJob.tags) ? fetchedJob.tags : [];

        // --- Update State ---
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
          companyType: fetchedJob.companyType || "", // Industry
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
      console.error("Fetch error:", err); // Log the actual error
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
  }, [jobId]); // Re-fetch if jobId changes

  // --- Generic Input/Select Handlers ---
   const handleInputChange = (field, value) => {
        setJobData((prev) => ({ ...prev, [field]: value }));
    };

    const handleRangeInputChange = (field, type, value) => {
      // Allow empty string or valid number
      const numValue = value === "" ? "" : Number(value);

      // Basic validation: prevent setting non-numeric or negative values (except empty string)
      if (value !== "" && (isNaN(numValue) || numValue < 0)) {
        console.warn(`Invalid input for ${field} ${type}:`, value);
        return; // Do not update state for invalid input
      }
       setJobData((prevState) => ({
          ...prevState,
          [field]: {
             ...prevState[field],
             [type]: value // Keep as string initially for TextField
          },
       }));
    };

    const handleRangeSelectChange = (field, type, selectedOption) => {
       const value = selectedOption ? selectedOption.value : "";
       setJobData((prevState) => ({
          ...prevState,
          [field]: {
             ...prevState[field],
             [type]: value === "" ? "" : Number(value), // Ensure number or empty string
          },
       }));
    };


    const handleMultiSelectChange = (fieldName, selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setJobData(prevState => ({
            ...prevState,
            [fieldName]: values,
        }));
    };

     const handleNestedCheckboxChange = (field, subField, checked) => {
         setJobData(prevState => ({
             ...prevState,
             [field]: {
                 ...prevState[field],
                 [subField]: checked
             }
         }));
     };


  // Handle changes in simple string array fields (requirements, qualifications)
  const handleArrayChange = (field, index, value) => {
    setJobData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  // Add items to simple string array fields (requirements, qualifications)
  const addArrayItem = (field) => {
    if (Array.isArray(jobData[field])) {
      // Prevent adding if the last item is empty
      if (jobData[field].length > 0 && jobData[field][jobData[field].length - 1].trim() === "") {
          // Optionally show a message to the user
          setNotification({ open: true, message: `Please fill the last ${field} before adding a new one.`, severity: "warning" });
          return;
      }
      setJobData((prev) => ({
        ...prev,
        [field]: [...prev[field], ""], // Add empty string
      }));
    }
  };

  // Remove items from simple string array fields (requirements, qualifications)
  const removeArrayItem = (field, index) => {
    if (Array.isArray(jobData[field])) {
       // Allow removing only if more than 1 item OR if it's the only item but has content
       if (jobData[field].length > 1 || (jobData[field].length === 1 && jobData[field][0].trim() !== "")) {
            const updatedArray = jobData[field].filter((_, i) => i !== index);
            // If the array becomes empty, add one empty field back for display consistency
            if (updatedArray.length === 0) {
                setJobData((prev) => ({ ...prev, [field]: [""] }));
            } else {
                 setJobData((prev) => ({ ...prev, [field]: updatedArray }));
            }
        }
    }
  };


  // --- Handlers for Screening Questions Structure ---

  // Handle changes to properties *within* a specific screening question object
  const handleScreeningQuestionObjectChange = (index, updatedQuestion) => {
    setJobData(prevState => {
      const updatedQuestions = [...prevState.screeningQuestions];
      updatedQuestions[index] = updatedQuestion;
      return { ...prevState, screeningQuestions: updatedQuestions };
    });
  };

  // Handle change to an option text within a specific screening question
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setJobData(prevState => {
      const updatedQuestions = [...prevState.screeningQuestions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];
      updatedOptions[optionIndex] = value;
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions,
      };
      return { ...prevState, screeningQuestions: updatedQuestions };
    });
  };

  // Add an option to a specific screening question
  const handleAddOption = (questionIndex) => {
    setJobData(prevState => {
      const updatedQuestions = [...prevState.screeningQuestions];
      const currentOptions = updatedQuestions[questionIndex].options;
       // Add only if the last option is not empty or if the array is empty
      if (currentOptions.length === 0 || currentOptions[currentOptions.length - 1].trim() !== "") {
         updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            options: [...currentOptions, ""], // Add a new empty option string
         };
          return { ...prevState, screeningQuestions: updatedQuestions };
      } else {
         setNotification({ open: true, message: "Please fill the last option before adding a new one.", severity: "warning" });
         return prevState; // Return previous state if validation fails
      }
    });
  };

  // Remove an option from a specific screening question
  const handleRemoveOption = (questionIndex, optionIndexToRemove) => {
     setJobData(prevState => {
       const updatedQuestions = [...prevState.screeningQuestions];
       const currentOptions = updatedQuestions[questionIndex].options;

        // Only allow removing if there's more than one option, OR it's the last option but has content
        if (currentOptions.length > 1 || (currentOptions.length === 1 && currentOptions[0].trim() !== "")) {
             const updatedOptions = currentOptions.filter((_, index) => index !== optionIndexToRemove);

             // If removing the last option results in an empty array, add one empty option field back for UI consistency
             updatedQuestions[questionIndex] = {
               ...updatedQuestions[questionIndex],
               options: updatedOptions.length === 0 ? [""] : updatedOptions,
             };
            return { ...prevState, screeningQuestions: updatedQuestions };
        } else {
             // Optionally alert or do nothing if trying to remove the last empty option
            // setNotification({ open: true, message: "Cannot remove the last option if it's empty.", severity: "warning" });
            return prevState; // Return previous state
        }
     });
  };


  // Add a new empty screening question
  const addScreeningQuestion = () => {
     // Prevent adding more than 10 questions (arbitrary limit if needed, or based on backend)
     // Let's assume 10 is a reasonable limit for frontend
     if (jobData.screeningQuestions.length >= 10) {
        setNotification({ open: true, message: "You can add a maximum of 10 screening questions.", severity: "warning" });
        return;
     }

     // Add only if the last question is not empty (text) OR is a choice type with options
     const lastQuestion = jobData.screeningQuestions[jobData.screeningQuestions.length - 1];
     const isLastQuestionValid = !lastQuestion || // Allow adding if the list is empty (handled by fetch)
                               (lastQuestion.question.trim() !== "" ||
                                (['single_choice', 'multi_choice'].includes(lastQuestion.questionType) &&
                                 lastQuestion.options.filter(opt => opt.trim() !== "").length > 0));


     if (isLastQuestionValid) {
        setJobData(prevState => ({
            ...prevState,
            screeningQuestions: [
                ...prevState.screeningQuestions,
                 { question: "", questionType: "short_answer", options: [], isMandatory: false }, // New empty question object
            ],
        }));
     } else {
       setNotification({ open: true, message: "Please fill the last screening question before adding a new one.", severity: "warning" });
     }
  };


   // Remove a screening question
   const removeScreeningQuestion = (indexToRemove) => {
      // Allow removing only if more than 1 question, OR if it's the last question but has content
      const questions = jobData.screeningQuestions;
      const canRemove = questions.length > 1 || (questions.length === 1 && (questions[0].question.trim() !== "" || (['single_choice', 'multi_choice'].includes(questions[0].questionType) && questions[0].options.filter(opt => opt.trim() !== "").length > 0)));

      if(canRemove) {
         setJobData(prevState => {
             const updatedQuestions = prevState.screeningQuestions.filter((_, index) => index !== indexToRemove);
             // If the array becomes empty, add one empty question back for display
             if (updatedQuestions.length === 0) {
                 return {
                     ...prevState,
                     screeningQuestions: [
                          { question: "", questionType: "short_answer", options: [], isMandatory: false },
                     ],
                 };
             }
             return { ...prevState, screeningQuestions: updatedQuestions };
         });
      } else {
         // Optionally alert or do nothing if trying to remove the last empty question
         // setNotification({ open: true, message: "Cannot remove the last question if it's empty.", severity: "warning" });
      }
   };


  // Prepare data for API calls
  const prepareDataForSave = () => {

    // Basic Frontend Validation before preparing data
    const requiredFields = [
      "jobTitle",
      "jobLocation",
      "jobDescription",
      "workType",
      "workMode",
      "category",
      "functionalArea",
      "salaryCategory",
      "courseType",
    ];
     for (const field of requiredFields) {
        const value = jobData[field];
         if (typeof value === "string" && value.trim() === "") {
            setNotification({ open: true, message: `Required field is missing: ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}.`, severity: "error" });
            return null; // Indicate validation failure
         }
         if (Array.isArray(value) && value.length === 0 && field !== 'requirements') { // Requirements can be empty if not added
             setNotification({ open: true, message: `Required multi-select field needs at least one selection: ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}.`, severity: "error" });
             return null; // Indicate validation failure
         }
          if (value === null) {
            setNotification({ open: true, message: `Required select field is missing: ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}.`, severity: "error" });
            return null; // Indicate validation failure
         }
    }

     // Validate min/max ranges
     const validateRange = (field, label) => {
        const minVal = jobData[field][`min${field.replace(/./, c => c.toUpperCase())}`];
        const maxVal = jobData[field][`max${field.replace(/./, c => c.toUpperCase())}`];
        // Only check if both are provided and not empty
        if ( minVal !== "" && minVal !== null && maxVal !== "" && maxVal !== null && Number(minVal) > Number(maxVal) ) {
            setNotification({ open: true, message: `Minimum ${label} cannot be greater than maximum ${label}.`, severity: "error" });
            return false;
        }
        return true;
     };

     if (!validateRange("salary", "salary")) return null;
     if (!validateRange("experience", "experience")) return null;
     if (!validateRange("graduationYear", "batch year")) return null;


     // Validate screening questions
     const validScreeningQuestions = jobData.screeningQuestions.filter(q => {
        const hasText = q.question.trim() !== "";
        const hasValidOptions = (q.questionType === 'single_choice' || q.questionType === 'multi_choice') ?
                                 q.options.filter(opt => opt.trim() !== "").length > 0 : true; // Other types don't require options
        const hasType = !!q.questionType; // Should always be true with default value/select

        return hasText && hasValidOptions && hasType;
     });

     if (validScreeningQuestions.length === 0) {
        setNotification({ open: true, message: "Please add at least one screening question with text and valid options (if applicable).", severity: "error" });
        return null; // Indicate validation failure
     }


    // Clean up arrays
    const cleanedRequirements = jobData.requirements
      .map((req) => req.trim())
      .filter((req) => req !== "");
    const cleanedQualifications = jobData.qualifications // Qualifications is multi-select, already handled
      .map((qual) => qual.trim()) // Ensure any strings from fetch/manual input are trimmed
      .filter((qual) => qual !== "");

    const cleanedScreeningQuestions = jobData.screeningQuestions
      .filter((q) => q.question.trim() !== "") // Only include questions with text
      .map((q) => {
        const baseQuestion = {
          question: q.question.trim(),
          questionType: q.questionType,
          isMandatory: q.isMandatory,
        };
        // Add _id only if it exists (for existing questions)
        if (q._id) {
          baseQuestion._id = q._id;
        }

        // Include options only for choice types, filtered for empty strings
        if (q.questionType === 'single_choice' || q.questionType === 'multi_choice') {
            baseQuestion.options = q.options.map(opt => opt.trim()).filter(opt => opt !== "");
        } else {
             // Ensure options is an empty array for other types
            baseQuestion.options = [];
        }
         return baseQuestion;
      })
       // Final filter to remove choice questions that ended up with no options after trimming
      .filter(q => {
          if(q.questionType === 'single_choice' || q.questionType === 'multi_choice') {
              return q.options.length > 0;
          }
          return true; // Keep non-choice questions if they had text
      });


    // Convert number strings back to numbers or null
     const formatNumberField = (value) => value === "" ? null : Number(value);

    const salaryToSend = {
        minSalary: formatNumberField(jobData.salary.minSalary),
        maxSalary: formatNumberField(jobData.salary.maxSalary),
    };
    const experienceToSend = {
        minExperience: formatNumberField(jobData.experience.minExperience),
        maxExperience: formatNumberField(jobData.experience.maxExperience),
    };
    const graduationYearToSend = {
        minBatch: formatNumberField(jobData.graduationYear.minBatch),
        maxBatch: formatNumberField(jobData.graduationYear.maxBatch),
    };


     // Clean up diversity preferences - remove fields if all are false? No, send them as boolean.
     // Ensure object exists even if all are false.

    return {
      jobId: jobId, // Include jobId for the update endpoint
      jobTitle: jobData.jobTitle.trim(),
      jobLocation: jobData.jobLocation.trim(),
      salary: salaryToSend,
      salaryConfidential: jobData.salaryConfidential,
      salaryCategory: jobData.salaryCategory,
      status: jobData.status,
      workType: jobData.workType,
      workMode: jobData.workMode,
      jobDescription: jobData.jobDescription.trim(),
      skills: jobData.skills.map(s => s.trim()).filter(s => s !== ""), // Ensure skills are trimmed/filtered
      requirements: cleanedRequirements,
      qualifications: cleanedQualifications,
      screeningQuestions: cleanedScreeningQuestions,
      experience: experienceToSend,
      companyType: jobData.companyType.trim(), // Industry
      applicationLink: jobData.applicationLink.trim(),
      duration: jobData.duration,
      graduationYear: graduationYearToSend,
      tags: jobData.tags.map((t) => t.trim()).filter((t) => t !== ""), // Ensure tags are trimmed/filtered
      courseType: jobData.courseType,
      diversityPreferences: jobData.diversityPreferences, // Send the object as is
      category: jobData.category,
      functionalArea: jobData.functionalArea,
      isPremiumJob: jobData.isPremiumJob,
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
    if (!dataToSend) {
      // Validation failed in prepareDataForSave, notification is already set
      return;
    }

    setSaving(true); // Use saving state for buttons
    setError(null); // Clear previous error

    try {
      const response = await fetch(`https://highimpacttalent.onrender.com/api-v1/jobs/update-job`, { // Using specific update endpoint
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
           // Assuming token is needed for authenticated updates
           "Authorization": `Bearer ${localStorage.getItem('token')}`, // Replace with actual token logic
        },
        body: JSON.stringify(dataToSend),
      });

       // Check for network errors first
       if (!response.ok) {
           const errorText = await response.text(); // Get raw error text
           console.error("API Error Response:", response.status, errorText);
            try {
                const errorJson = JSON.parse(errorText);
                 throw new Error(errorJson.message || `API Error: ${response.status}`);
            } catch {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }
       }

      const result = await response.json();
      if (result.success) {
        setNotification({
          open: true,
          message: result.message || "Job updated successfully!",
          severity: "success",
        });
        // Re-fetch data to get potential backend updates (like new screening question IDs)
        fetchJobData();
      } else {
        // Backend returned success: false
        const errorMessage = result.message || "Failed to update job.";
        setError(errorMessage);
        setNotification({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      }
    } catch (err) {
      // Catch network errors or errors thrown from parsing response
      console.error("Submission Error:", err);
      const errorMessage = err.message || "An error occurred while updating job.";
      setError(errorMessage);
      setNotification({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Publish job
  const handlePublish = async () => {
     // Perform validation before publishing
     const dataToSend = prepareDataForSave();
     if (!dataToSend) {
       // Validation failed in prepareDataForSave, notification is already set
       return;
     }

     // Check if status is already live
      if (jobData.status === 'live') {
          setNotification({ open: true, message: "Job is already published.", severity: "info" });
          return;
      }

    dataToSend.status = "live"; // Set status to live for publishing

    setSaving(true); // Use saving state for buttons
    setError(null); // Clear previous error

    try {
       // Assuming update-job endpoint handles status change
      const response = await fetch(`https://highimpacttalent.onrender.com/api-v1/jobs/update-job`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${localStorage.getItem('token')}`, // Replace with actual token logic
        },
        body: JSON.stringify(dataToSend),
      });

       if (!response.ok) {
           const errorText = await response.text();
           console.error("API Error Response:", response.status, errorText);
           try {
                const errorJson = JSON.parse(errorText);
                 throw new Error(errorJson.message || `API Error: ${response.status}`);
            } catch {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }
       }

      const result = await response.json();

      if (result.success) {
        setNotification({
          open: true,
          message: result.message || "Job published successfully!",
          severity: "success",
        });
         // Update local state and re-fetch
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
      console.error("Publish Error:", err);
      const errorMessage = err.message || "An error occurred while publishing job.";
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

  // Loading state for initial fetch
  if (loading && !initialLoadError) { // Only show loader if loading and no initial error
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

  // Error state for initial fetch
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


  // Render the form once data is loaded and no initial error
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: "linear-gradient(135deg, #3C7EFC 0%, #64a2ff 100%)", // Use primary gradient
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

          {/* Loading/Error state for Save/Publish */}
          {saving && ( // Show saving loader only when saving/publishing
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
          {error && !initialLoadError && ( // Show general error if not initial load error
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
                  <Typography variant="h6" sx={{...sectionTitleStyle, mt: 0}}>
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
                         size="small"
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
                        variant="outlined"
                         size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {/* <LocationIcon color="primary" /> */} {/* Removed icon as TextField doesn't take icon prop directly */}
                            </InputAdornment>
                          ),
                        }}
                         InputLabelProps={{ shrink: jobData.jobLocation !== "" }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                       <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ ...formLabelStyle }}>
                            Industry
                          </Typography>
                           <Select
                             options={industrySelectOptions}
                             value={industrySelectOptions.find(
                                 (opt) => opt.value === jobData.companyType
                             )}
                             onChange={(selectedOption) =>
                                 handleInputChange(
                                     "companyType",
                                     selectedOption ? selectedOption.value : ""
                                 )
                             }
                             placeholder="Select Industry..."
                             isClearable
                             isSearchable
                             styles={customSelectStyle}
                           />
                       </Box>
                    </Grid>

                     <Grid item xs={12} md={4}>
                       <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ ...formLabelStyle }}>
                            Work Type <span style={{color: 'red'}}>*</span>
                          </Typography>
                           <Select
                             options={workTypeSelectOptions}
                             value={workTypeSelectOptions.find(
                                 (opt) => opt.value === jobData.workType
                             )}
                             onChange={(selectedOption) =>
                                 handleInputChange(
                                     "workType",
                                     selectedOption ? selectedOption.value : ""
                                 )
                             }
                             placeholder="Select Work Type..."
                             isClearable
                             isSearchable
                             styles={customSelectStyle}
                              required // Frontend required hint
                           />
                       </Box>
                    </Grid>

                     <Grid item xs={12} md={4}>
                        <Box sx={{ mb: 2 }}>
                           <Typography variant="body2" sx={{ ...formLabelStyle }}>
                             Work Mode <span style={{color: 'red'}}>*</span>
                           </Typography>
                           <Select
                             options={workModeSelectOptions}
                             value={workModeSelectOptions.find(
                                 (opt) => opt.value === jobData.workMode
                             )}
                             onChange={(selectedOption) =>
                                 handleInputChange(
                                     "workMode",
                                     selectedOption ? selectedOption.value : ""
                                 )
                             }
                             placeholder="Select Work Mode..."
                             isClearable
                             isSearchable
                             styles={customSelectStyle}
                              required // Frontend required hint
                           />
                       </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                       <Box sx={{ mb: 2 }}>
                           <Typography variant="body2" sx={{ ...formLabelStyle }}>
                             Status
                           </Typography>
                           <Select
                             options={statusSelectOptions}
                             value={statusSelectOptions.find(
                                 (opt) => opt.value === jobData.status
                             )}
                             onChange={(selectedOption) =>
                                 handleInputChange(
                                     "status",
                                     selectedOption ? selectedOption.value : ""
                                 )
                             }
                             placeholder="Select Status..."
                             isClearable={false} // Status is required
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
                  <Typography variant="h6" sx={{...sectionTitleStyle}}>
                    Salary Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                       <TextField
                         fullWidth
                         label="Minimum Salary (INR Lakh)"
                         type="number"
                         value={jobData.salary.minSalary}
                         onChange={(e) =>
                           handleRangeInputChange("salary", "minSalary", e.target.value)
                         }
                         InputProps={{
                           startAdornment: (
                             <InputAdornment position="start">₹</InputAdornment>
                           ),
                         }}
                         InputLabelProps={{ shrink: jobData.salary.minSalary !== "" }}
                          size="small"
                           disabled={jobData.salaryConfidential}
                       />
                     </Grid>

                     <Grid item xs={12} md={6}>
                       <TextField
                         fullWidth
                         label="Maximum Salary (INR Lakh)"
                         type="number"
                         value={jobData.salary.maxSalary}
                         onChange={(e) =>
                           handleRangeInputChange("salary", "maxSalary", e.target.value)
                         }
                         InputProps={{
                           startAdornment: (
                             <InputAdornment position="start">₹</InputAdornment>
                           ),
                         }}
                         InputLabelProps={{ shrink: jobData.salary.maxSalary !== "" }}
                          size="small"
                           disabled={jobData.salaryConfidential}
                       />
                     </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ ...formLabelStyle }}
                        >
                          Salary Category <span style={{color: 'red'}}>*</span>
                        </Typography>
                        <Select
                          options={salaryCategorySelectOptions}
                          value={salaryCategorySelectOptions.find(
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
                           required // Frontend required hint
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}> {/* Align vertically */}
                      <FormControlLabel
                        control={
                          <Switch
                            checked={jobData.salaryConfidential}
                            onChange={(e) => {
                               handleInputChange("salaryConfidential", e.target.checked);
                               // Clear salary if marking confidential
                               if (e.target.checked) {
                                   setJobData(prevState => ({
                                       ...prevState,
                                       salary: { minSalary: "", maxSalary: "" }
                                   }));
                               }
                            }}
                            color="primary"
                             size="small"
                          />
                        }
                        label={<Typography variant="body2" sx={{ fontSize: "0.875rem" }}>Don't show salary to candidates</Typography>}
                         sx={{ m: 0 }} // Remove default label margin
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Job Description */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{...sectionTitleStyle}}>
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
                    variant="outlined"
                     size="small"
                  />
                </Box>
              </Paper>

              {/* Expandable Sections */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{...sectionTitleStyle, mt: 0, mb: 0}}>
                    Skills & Requirements
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                       <Typography variant="subtitle1" sx={{ mb: 1 }}>
                         Skills Required <span style={{color: 'red'}}>*</span>
                       </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Select or type key skills necessary for this role.
                        </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Select
                          isMulti
                          options={skillSelectOptions}
                          value={skillSelectOptions.filter((opt) =>
                            jobData.skills.includes(opt.value)
                          )}
                          onChange={(selectedOptions) =>
                            handleMultiSelectChange("skills", selectedOptions)
                          }
                          placeholder="Select or type skills..."
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                           required // Frontend required hint
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Requirements
                      </Typography>
                       <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        List specific requirements or prerequisites for candidates.
                      </Typography>
                      {jobData.requirements.map((req, index) => (
                        <Box
                          key={`req-${index}`}
                          sx={{
                            display: "flex",
                            gap: 1,
                            mb: 2,
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" sx={{ minWidth: 24, flexShrink: 0, textAlign: 'right', color: 'text.primary' }}>{index + 1}.</Typography>
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
                             variant="outlined"
                          />
                          <IconButton
                            color="error"
                            onClick={() =>
                              removeArrayItem("requirements", index)
                            }
                             // Disable if only one item AND that item is empty
                            disabled={jobData.requirements.length === 1 && jobData.requirements[0].trim() === ""}
                            size="small"
                             sx={{ flexShrink: 0 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        onClick={() => addArrayItem("requirements")}
                        startIcon={<AddIcon />}
                        size="small"
                         // Disable if the last item is empty
                        disabled={ jobData.requirements.length > 0 && jobData.requirements[ jobData.requirements.length - 1 ].trim() === ""}
                      >
                        Add Requirement
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Educational Qualifications <span style={{color: 'red'}}>*</span>
                      </Typography>
                       <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Select the minimum qualifications needed.
                      </Typography>
                      <Select
                        isMulti
                        options={[ // Example options, customize as needed
                           { value: "High School", label: "High School" },
                           { value: "Associate Degree", label: "Associate Degree" },
                           { value: "Bachelor's", label: "Bachelor's" },
                           { value: "Master's", label: "Master's" },
                           { value: "MBA", label: "MBA" },
                           { value: "CA", label: "CA" },
                           { value: "PhD", label: "PhD" },
                            { value: "Diploma", label: "Diploma" },
                            { value: "Certification", label: "Certification" },
                        ]}
                        value={jobData.qualifications.map(qual => ({ value: qual, label: qual }))}
                        onChange={(selectedOptions) => handleMultiSelectChange('qualifications', selectedOptions)}
                        placeholder="Select qualifications..."
                        isClearable
                        isSearchable
                        styles={customSelectStyle}
                         required // Frontend required hint
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Screening Questions <span style={{color: 'red'}}>*</span>
                      </Typography>
                       <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.875rem" }}>
                        Add questions candidates must answer. Specify type and options for multiple choice.
                      </Typography>

                       <Typography
                         variant="body2"
                         sx={{ mb: 2, fontWeight: "bold", fontSize: "0.875rem", color: 'text.primary' }}
                       >
                         Added Questions ({jobData.screeningQuestions.filter(q => q.question.trim() !== "").length}/{10})
                       </Typography>

                      {/* Screening Questions List (Updated) */}
                      {jobData.screeningQuestions.map((sq, index) => (
                        <Box
                          key={sq._id || `new-${index}`} // Use _id if available, fallback to index
                          sx={{
                            border: "1px solid #eee",
                            p: 2,
                            mb: 3, // Increased margin bottom
                            borderRadius: 2,
                            position: 'relative' // For absolute positioning of remove button
                          }}
                        >
                           {/* Remove Question Button (Positioned top right) */}
                            {/* Show remove if there is more than 1 question OR if it's the only question but has content/options */}
                          {(jobData.screeningQuestions.length > 1 || (jobData.screeningQuestions.length === 1 && (sq.question.trim() !== "" || (['single_choice', 'multi_choice'].includes(sq.questionType) && sq.options.filter(opt => opt.trim() !== "").length > 0)))) && (
                             <IconButton
                               size="small"
                               color="error"
                               onClick={() => removeScreeningQuestion(index)}
                               sx={{
                                 position: 'absolute',
                                 top: 8,
                                 right: 8,
                                 p: '4px',
                                 bgcolor: 'white',
                                 zIndex: 1, // Ensure it's clickable
                                 '&:hover': { bgcolor: '#f9f9f9' }
                               }}
                             >
                               X
                             </IconButton>
                           )}

                          {/* Question Text Field */}
                          <Box mb={2} pr={4}> {/* Add padding-right to avoid conflict with remove button */}
                             <Typography variant="body2" sx={{ ...formLabelStyle }}>Question Text <span style={{color: 'red'}}>*</span></Typography>
                              <TextField
                                fullWidth
                                label={`Question ${index + 1}`}
                                size="small"
                                value={sq.question}
                                onChange={(e) =>
                                  handleScreeningQuestionObjectChange(index, { ...sq, question: e.target.value })
                                }
                                 variant="outlined"
                                 required // Frontend required hint
                              />
                          </Box>

                          {/* Question Type Select */}
                          <Box mb={2}>
                            <Typography variant="body2" sx={{ ...formLabelStyle }}>Question Type <span style={{color: 'red'}}>*</span></Typography>
                            <Select
                              options={screeningQuestionTypeOptions}
                              value={screeningQuestionTypeOptions.find(opt => opt.value === sq.questionType)}
                              onChange={(selectedOption) => {
                                const newType = selectedOption ? selectedOption.value : 'short_answer'; // Default if cleared
                                 const updatedQuestion = { ...sq, questionType: newType };

                                 // Clear options if changing TO a type that doesn't use options
                                 if (newType !== 'single_choice' && newType !== 'multi_choice') {
                                     updatedQuestion.options = [];
                                 } else if (updatedQuestion.options.length === 0) {
                                     // If changing FROM non-choice TO single/multi AND options were empty, add one blank option
                                      updatedQuestion.options = [""];
                                 }

                                handleScreeningQuestionObjectChange(index, updatedQuestion);
                              }}
                              placeholder="Select Type"
                              isClearable={false} // Type is mandatory
                              isSearchable={false}
                              styles={customSelectStyle}
                               required // Frontend required hint
                            />
                          </Box>

                          {/* Mandatory Checkbox */}
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={sq.isMandatory}
                                onChange={(e) =>
                                  handleScreeningQuestionObjectChange(index, { ...sq, isMandatory: e.target.checked })
                                }
                                color="primary"
                                size="small"
                              />
                            }
                            label={<Typography variant="body2" sx={{ fontSize: "0.875rem" }}>Mandatory</Typography>}
                            sx={{ mt: 1, mb: 1 }}
                          />

                          {/* Options Input (Conditional Rendering) */}
                          {(sq.questionType === 'single_choice' || sq.questionType === 'multi_choice') && (
                            <Box mt={2} pl={2}> {/* Indent options */}
                              <Typography variant="body2" sx={{ ...formLabelStyle, mb: 1 }}>Options <span style={{color: 'red'}}>*</span></Typography>
                               <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: "0.75rem" }}>
                                Provide options for candidates to select. At least one non-empty option is required.
                              </Typography>
                              {/* Ensure at least one option field is shown if options array is empty for UI */}
                              {(sq.options.length === 0 ? [""] : sq.options).map((option, optIndex) => (
                                <Box key={`sq-${index}-opt-${optIndex}`} display="flex" alignItems="center" mb={1} gap={1}>
                                   <Typography variant="body2" sx={{ minWidth: 16, flexShrink: 0, textAlign: 'right', color: 'text.primary' }}>{optIndex + 1}.</Typography>
                                   <TextField
                                     fullWidth
                                     size="small"
                                     variant="outlined"
                                     value={option}
                                     onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                     placeholder={`Option ${optIndex + 1}`}
                                   />
                                   {/* Show remove only if more than 1 option OR it's the only option but has text */}
                                  {(sq.options.length > 1 || (sq.options.length === 1 && option.trim() !== "")) && (
                                     <IconButton
                                       size="small"
                                       color="error"
                                       onClick={() => handleRemoveOption(index, optIndex)}
                                       sx={{ flexShrink: 0 }}
                                     >
                                       <DeleteIcon fontSize="small" />
                                     </IconButton>
                                   )}
                                </Box>
                              ))}
                              {/* Add option button - Show only if the last option is not empty */}
                               {(sq.options.length === 0 || sq.options[sq.options.length - 1]?.trim() !== "") ? (
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
                                 // Optionally disable or hide if the last option is empty
                                 <Button
                                   variant="text"
                                   disabled
                                   startIcon={<AddIcon />}
                                   size="small"
                                    sx={{ mt: 0.5, color: '#ccc' }}
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
                         // Disable if 10 questions added OR if the last question is empty
                        disabled={ jobData.screeningQuestions.length >= 10 || (jobData.screeningQuestions.length > 0 && jobData.screeningQuestions[jobData.screeningQuestions.length - 1].question.trim() === "" && !(['single_choice', 'multi_choice'].includes(jobData.screeningQuestions[jobData.screeningQuestions.length - 1].questionType) && jobData.screeningQuestions[jobData.screeningQuestions.length - 1].options.filter(opt => opt.trim() !== "").length > 0)) }
                      >
                        Add Screening Question
                      </Button>
                    </Grid>


                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{...sectionTitleStyle, mt: 0, mb: 0}}>
                    Experience & Education
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                     <Grid item xs={12} md={6}>
                       <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ ...formLabelStyle }}>
                            Minimum Experience (Years)
                          </Typography>
                           <Select
                             options={experienceRangeOptions}
                             value={
                                 jobData.experience.minExperience !== "" ?
                                 experienceRangeOptions.find(opt => opt.value === Number(jobData.experience.minExperience)) : null
                             }
                             onChange={(selectedOption) =>
                                 handleRangeSelectChange("experience", "minExperience", selectedOption)
                             }
                             placeholder="Select Min Experience..."
                             isClearable
                             isSearchable
                             styles={customSelectStyle}
                           />
                       </Box>
                     </Grid>

                     <Grid item xs={12} md={6}>
                       <Box sx={{ mb: 2 }}>
                           <Typography variant="body2" sx={{ ...formLabelStyle }}>
                             Maximum Experience (Years)
                           </Typography>
                           <Select
                             options={experienceRangeOptions}
                              value={
                                 jobData.experience.maxExperience !== "" ?
                                 experienceRangeOptions.find(opt => opt.value === Number(jobData.experience.maxExperience)) : null
                             }
                             onChange={(selectedOption) =>
                                 handleRangeSelectChange("experience", "maxExperience", selectedOption)
                             }
                             placeholder="Select Max Experience..."
                             isClearable
                             isSearchable
                             styles={customSelectStyle}
                           />
                       </Box>
                     </Grid>


                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 0.5, fontWeight: 500 }}
                        >
                          Duration
                        </Typography>
                        <Select
                          options={durationSelectOptions}
                          value={durationSelectOptions.find(
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
                          variant="body2"
                          sx={{ ...formLabelStyle }}
                        >
                          Course Type <span style={{color: 'red'}}>*</span>
                        </Typography>
                        <Select
                          options={courseTypeSelectOptions}
                          value={courseTypeSelectOptions.find(
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
                           required // Frontend required hint
                        />
                      </Box>
                    </Grid>

                     <Grid item xs={12} md={6}>
                       <Box sx={{ mb: 2 }}>
                           <Typography variant="body2" sx={{ ...formLabelStyle }}>
                             Minimum Graduation Year Batch
                           </Typography>
                           <Select
                             options={batchYearOptions}
                             value={
                                 jobData.graduationYear.minBatch !== "" ?
                                 batchYearOptions.find(opt => opt.value === Number(jobData.graduationYear.minBatch)) : null
                             }
                             onChange={(selectedOption) =>
                                 handleRangeSelectChange("graduationYear", "minBatch", selectedOption)
                             }
                             placeholder="Select Min Batch..."
                             isClearable
                             isSearchable
                             styles={customSelectStyle}
                           />
                       </Box>
                     </Grid>

                     <Grid item xs={12} md={6}>
                       <Box sx={{ mb: 2 }}>
                           <Typography variant="body2" sx={{ ...formLabelStyle }}>
                             Maximum Graduation Year Batch
                           </Typography>
                           <Select
                             options={batchYearOptions}
                             value={
                                 jobData.graduationYear.maxBatch !== "" ?
                                 batchYearOptions.find(opt => opt.value === Number(jobData.graduationYear.maxBatch)) : null
                             }
                             onChange={(selectedOption) =>
                                 handleRangeSelectChange("graduationYear", "maxBatch", selectedOption)
                             }
                             placeholder="Select Max Batch..."
                             isClearable
                             isSearchable
                             styles={customSelectStyle}
                           />
                       </Box>
                     </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{...sectionTitleStyle, mt: 0, mb: 0}}>
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
                     {/* Ensure keys match backend and handle potential typo */}
                    {Object.entries(jobData.diversityPreferences).map(
                      ([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={value}
                                onChange={(e) =>
                                  handleNestedCheckboxChange(
                                    "diversityPreferences",
                                    key, // Pass the actual key
                                    e.target.checked
                                  )
                                }
                                color="primary"
                                 size="small"
                              />
                            }
                            label={<Typography variant="body2" sx={{ fontSize: "0.875rem" }}>{key
                                 .replace(/([A-Z])/g, " $1") // Add space before capital letters
                                 .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                                 .replace('Backforce', 'Backforce') // Keep as is if backend typo exists
                                 .replace('Back Workforce', 'Back Workforce') // Correct if backend uses Workforce
                              }</Typography>}
                             sx={{ m: 0 }}
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
                  sx={{...sectionTitleStyle, mt: 0}}
                >
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
                     size="small"
                     variant="outlined"
                  />

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ ...formLabelStyle }}
                    >
                      Category <span style={{color: 'red'}}>*</span>
                    </Typography>
                    <Select
                      options={categorySelectOptions}
                      value={categorySelectOptions.find(
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
                       required // Frontend required hint
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                       variant="body2"
                      sx={{ ...formLabelStyle }}
                    >
                      Functional Area <span style={{color: 'red'}}>*</span>
                    </Typography>
                    <Select
                      options={functionalAreaSelectOptions}
                      value={functionalAreaSelectOptions.find(
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
                       required // Frontend required hint
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Tags
                    </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Add relevant tags to improve job visibility.
                     </Typography>
                    <Select // Using React-Select, replace with CreatableSelect if free text input needed
                          isMulti
                          options={tagSelectOptions}
                          value={tagSelectOptions.filter((opt) =>
                            jobData.tags.includes(opt.value)
                          )}
                          onChange={(selectedOptions) =>
                            handleMultiSelectChange("tags", selectedOptions)
                          }
                          placeholder="Select tags..."
                          isClearable
                          isSearchable
                          styles={customSelectStyle}
                           // If you want free text tags, use CreatableSelect here instead of Select
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
                    disabled={saving || loading} // Disable if saving or initial loading
                  >
                    {saving && jobData.status !== 'live' ? (
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    ) : (
                       <SaveIcon />
                    )}
                    {saving && jobData.status !== 'live' ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={handlePublish}
                    size="large"
                     // Disable if saving, loading, or already live
                    disabled={saving || loading || jobData.status === "live"}
                  >
                    {saving && jobData.status === 'live' ? (
                       <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    ) : (
                      <StarIcon /> // Use StarIcon for Publish
                    )}
                    {saving && jobData.status === 'live' ? "Publishing..." : jobData.status === "live" ? "Published (Live)" : "Publish Job"}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Notification Snackbar */}
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