import React, { useState, useEffect } from "react";
import { apiRequest } from "../../utils";
import { useNavigate } from "react-router-dom";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner"; // Not used
import { useSelector } from "react-redux";
import {
  Box,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
  CircularProgress,
  Grid,
  IconButton, // Import IconButton for removing items
} from "@mui/material";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { skillsList } from "../../assets/mock"; // Assuming this exists
import {
  functionalAreasCategory,
  tagCategory,
  categoryOptions as categoryOptionsList, // Renamed categoryOptions import
  IndustryCategory,
} from "../../assets/functionalarea"; // Assuming this exists

// Helper styles - Based on original code's sx props
const formLabelStyle = {
  fontSize: "1rem", // 16px
  fontWeight: 500,
  fontFamily: "Satoshi",
  color: "#404258",
  mb: 1, // Reduced margin
  display: "block",
};

const sectionTitleStyle = {
  fontSize: "1.25rem", // 20px
  fontWeight: 700,
  fontFamily: "Satoshi",
  color: "#3C7EFC",
  mb: 2,
  mt: 3, // Add margin top for sections
};

const textFieldStyle = {
  // Style for rounded text fields (like Job Title, Application Link, etc.)
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    fontSize: "0.875rem", // 14px
    minHeight: "42px", // Standard height similar to original Select
  },
  "& input[type=number]": {
    "-moz-appearance": "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    {
      "-webkit-appearance": "none",
      margin: 0,
    },
};

const flatTextFieldStyle = {
  // Style for text areas / multiline fields (like JD, Req, Qual, Questions)
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    fontSize: "0.875rem",
  },
};

const customSelectStyle = {
  // Styles for react-select components
  control: (provided, state) => ({
    ...provided,
    fontSize: "0.875rem",
    borderRadius: "8px", // Rounded corners
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
    minHeight: "42px", // Standard height
    "&:hover": {
      borderColor: "#d1d5db",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 12px", // Adjust horizontal padding inside the control
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    border: "1px solid #d1d5db",
    zIndex: 1000, // Ensure dropdown is above other content
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#3b82f6" : "white",
    color: state.isSelected ? "white" : "black",
    "&:hover": {
      backgroundColor: "#f0f0f0",
      color: "black",
    },
    fontSize: "0.875rem",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e0e0e0",
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
  indicatorSeparator: (provided) => ({
    display: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "8px",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: "8px",
  }),
};

const addRemoveButtonStyle = {
  // Style for Add/Remove text buttons
  mt: 1,
  cursor: "pointer",
  textTransform: "none",
  fontWeight: "bold",
  color: "primary.main", // Use primary color
  fontSize: "0.875rem",
  "&:hover": {
    textDecoration: "underline",
    bgcolor: "transparent",
  },
};

const JobUploadPage = () => {
  const { user } = useSelector((state) => state.user);
  const [analysing, setAnalysing] = useState(false);
  const [salaryErrors, setSalaryErrors] = useState({
    minSalary: "",
    maxSalary: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // State for City Select/Input
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customCity, setCustomCity] = useState("");

  // Options arrays (matching backend enums or derived)
  const salaryCategoryOptions = [
    "On Experience",
    "Competitive",
    "Fixed",
    "Negotiable",
    "Confidential",
  ];
  const workTypeOptions = ["Full-Time", "Part-Time", "Contract", "Temporary"];
  const workModeOptions = ["Work From Office", "Remote", "Hybrid"];

  const screeningQuestionTypeOptions = [
    { value: "yes/no", label: "Yes/No" },
    { value: "single_choice", label: "Single Choice" },
    { value: "multi_choice", label: "Multi Choice" },
    { value: "short_answer", label: "Short Answer" },
    { value: "long_answer", label: "Long Answer" },
  ];

  // Experience options for Min/Max Selects (1 to 50+)
  const experienceRangeOptions = Array.from({ length: 50 }, (_, i) => ({
    value: i,
    label: `${i}${i < 49 ? "" : "+"}`,
  }));

  // Batch Year options for Min/Max Selects
  const currentYear = new Date().getFullYear();
  const batchYearOptions = Array.from(
    { length: currentYear + 5 - 1970 + 1 },
    (_, i) => {
      const year = 1970 + i;
      return { value: year, label: year.toString() };
    }
  ).reverse();

  // Mapped options for React-Select from imported lists
  const categorySelectOptions = categoryOptionsList.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const functionalAreaSelectOptions = functionalAreasCategory.map((area) => ({
    value: area,
    label: area,
  }));

  const tagSelectOptions = tagCategory.map((tag) => ({
    value: tag,
    label: tag,
  }));

  const industrySelectOptions = IndustryCategory.map((industry) => ({
    value: industry,
    label: industry,
  }));

  // Initial formData state matching backend schema and original fields
  const [formData, setFormData] = useState({
    jobTitle: "", // string
    companyType: "", // string
    jobLocation: "", // string (set from city select/custom)
    salary: { minSalary: "", maxSalary: "" }, // object
    salaryCategory: "", // string
    salaryConfidential: false, // boolean
    workType: "", // string (enum)
    workMode: "", // string (enum)
    experience: { minExperience: "", maxExperience: "" }, // object
    jobDescription: "", // string
    requirements: [""], // [string]
    qualifications: [], // [string] - Using Multi-select now
    screeningQuestions: [
      {
        question: "",
        questionType: "short_answer", // Default type
        options: [], // Default empty array for options
        isMandatory: false,
      },
    ], // Array of screening question objects
    applicationLink: "", // string
    skills: [], // [string]
    graduationYear: { minBatch: "", maxBatch: "" }, // object
    tags: [], // [string]
    diversityPreferences: {
      // object
      femaleCandidates: false,
      womenJoiningBackWorkforce: false,
      exDefencePersonnel: false,
      differentlyAbledCandidates: false,
      workFromHome: false,
    },
    category: "", // string - Now handled by Select
    functionalArea: "", // string - Now handled by Select
    isPremiumJob: false, // boolean
  });

  // Fetch Cities Effect (Kept)
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/cities.csv"); // Adjust path if needed
        const text = await response.text();
        const rows = text.split("\n");
        const cityList = rows
          .slice(1) // Skip header
          .map((row) => row.trim())
          .filter(Boolean)
          .sort();
        setCities([...new Set(cityList)]);
      } catch (error) {
        console.error("Error loading cities:", error);
        setCities([]);
      }
    };
    fetchCities();
  }, []);

  // Generic handler for simple text/number/single-select/radio fields
  // Modified to also handle react-select single value changes by expecting an 'event-like' object
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for Checkboxes (top-level and nested diversity)
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name.startsWith("diversityPreferences.")) {
      setFormData((prevState) => ({
        ...prevState,
        diversityPreferences: {
          ...prevState.diversityPreferences,
          [name.split(".")[1]]: checked, // Update nested boolean
        },
      }));
    } else {
      setFormData({ ...formData, [name]: checked }); // Update top-level boolean
    }
  };

  // Handler for React-Select for Min/Max Range fields (experience, graduationYear)
  const handleRangeSelectChange = (field, type, selectedOption) => {
    // selectedOption is { value: ..., label: ... } or null
    const value = selectedOption ? selectedOption.value : "";
    setFormData((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        [type]: value === "" ? "" : Number(value), // Ensure number or empty string
      },
    }));
  };

  // Handler for TextField based Min/Max Range fields (salary)
  const handleRangeInputChange = (field, type, value) => {
    const numValue = value === "" ? "" : Number(value);

    // Prevent invalid values
    if (value !== "" && (isNaN(numValue) || numValue < 0)) {
      console.warn(`Invalid input for ${field} ${type}:`, value);
      return;
    }

    // Update the form data first
    const updatedFormData = {
      ...formData,
      [field]: {
        ...formData[field],
        [type]: numValue,
      },
    };

    setFormData(updatedFormData);

    // Validation: for salary only
    if (field === "salary") {
      const otherField = type === "minSalary" ? "maxSalary" : "minSalary";
      const currentMin =
        type === "minSalary" ? numValue : updatedFormData.salary.minSalary;
      const currentMax =
        type === "maxSalary" ? numValue : updatedFormData.salary.maxSalary;

      const newErrors = { ...salaryErrors };

      // Max cap validation
      if (numValue > 1000) {
        newErrors[type] = "Cannot exceed 1000. Please mention in INR Lakhs & not INR";
      } else {
        newErrors[type] = "";
      }

      // Min > Max check
      if (
        currentMin !== "" &&
        currentMax !== "" &&
        Number(currentMin) > Number(currentMax)
      ) {
        newErrors.minSalary = "Min salary cannot be greater than max salary";
        newErrors.maxSalary = "Max salary cannot be less than min salary";
      } else {
        // Clear if previously errored and now valid
        if (
          newErrors.minSalary === "Min salary cannot be greater than max salary"
        )
          newErrors.minSalary = "";
        if (newErrors.maxSalary === "Max salary cannot be less than min salary")
          newErrors.maxSalary = "";
      }

      setSalaryErrors(newErrors);
    }
  };

  // Handler for React-Select Multi-Select fields (Skills, Tags, Qualifications)
  const handleMultiSelectChange = (fieldName, selectedOptions) => {
    // selectedOptions is an array of { value: ..., label: ... } or null/empty array on clear
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: values,
    }));
  };

  // Handle city selection (Kept from original)
  const handleCityChange = (selectedOption) => {
    if (selectedOption?.value === "Other") {
      setIsOtherSelected(true);
      setSelectedCity(null);
      setFormData({ ...formData, jobLocation: "" }); // Clear jobLocation
      setCustomCity(""); // Clear custom city when switching to Other
    } else {
      setIsOtherSelected(false);
      setSelectedCity(selectedOption);
      setFormData({
        ...formData,
        jobLocation: selectedOption ? selectedOption.value : "",
      });
      if (selectedOption) setCustomCity(""); // Clear custom city if a city is selected
    }
  };

  // Handle custom city input (Kept from original)
  const handleCustomCityChange = (e) => {
    const cityValue = e.target.value;
    setCustomCity(cityValue);
    setFormData({ ...formData, jobLocation: cityValue });
  };

  // Prepare city options with "Other" at the bottom (Kept from original)
  const filteredCities = [
    ...cities
      .filter((city) => city.toLowerCase().includes(inputValue.toLowerCase()))
      .map((city) => ({ value: city, label: city })),
    { value: "Other", label: "Other" },
  ];

  // Handle JD Analysis (Updated to populate new screening question structure)
  const handleAnalysis = async () => {
    if (!formData.jobDescription.trim()) {
      alert("Please enter Job Description to analyze.");
      return;
    }
    setAnalysing(true);
    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/ai/analyse-jd", // Verify this endpoint
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription: formData.jobDescription }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setFormData((f) => ({
          ...f,
          requirements: Array.isArray(data.requirements)
            ? data.requirements.filter((r) => r.trim() !== "")
            : [],
          qualifications: Array.isArray(data.qualifications)
            ? data.qualifications.filter((q) => q.trim() !== "")
            : [],
          // Map analysis questions to the new structure
          screeningQuestions: Array.isArray(data.screeningQuestions)
            ? data.screeningQuestions
                .filter((q) => q.trim() !== "")
                .map((q) => ({
                  question: q,
                  questionType: "short_answer", // Default type from analysis
                  options: [], // Analysis doesn't provide options
                  isMandatory: false, // Default mandatory to false
                }))
            : [
                {
                  question: "",
                  questionType: "short_answer",
                  options: [],
                  isMandatory: false,
                },
              ], // Ensure at least one empty question if analysis returns none
        }));
        alert(
          "Job Description analyzed successfully! Requirements, Qualifications, and Screening Questions have been populated."
        );
      } else {
        console.error("Analysis failed:", data.message || data);
        alert(`Analysis failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error calling analyse-jd API:", err);
      alert("An error occurred during JD analysis.");
    } finally {
      setAnalysing(false);
    }
  };

  // Handle dynamic array field changes (requirements) - Qualifications now uses Multi-select
  const handleArrayChange = (fieldName, index, value) => {
    const updatedArray = [...formData[fieldName]];
    updatedArray[index] = value;
    setFormData({ ...formData, [fieldName]: updatedArray });
  };

  // Add item to dynamic array fields (requirements)
  const addArrayItem = (fieldName) => {
    // Add only if the last item is not empty
    const lastItem = formData[fieldName][formData[fieldName].length - 1];
    if (!lastItem || lastItem.trim() !== "") {
      setFormData({ ...formData, [fieldName]: [...formData[fieldName], ""] });
    } else {
      console.log(`Please fill the last ${fieldName.slice(0, -1)} first.`); // Or show a user-facing message
    }
  };

  // Remove item from dynamic array fields (requirements)
  const removeArrayItem = (fieldName, index) => {
    const updatedArray = formData[fieldName].filter((_, i) => i !== index);
    // If requirements become empty, add one empty field for display
    if (fieldName === "requirements" && updatedArray.length === 0) {
      setFormData({
        ...formData,
        [fieldName]: [""],
      });
    } else {
      setFormData({ ...formData, [fieldName]: updatedArray });
    }
  };

  // --- New/Updated Handlers for Screening Questions Structure ---

  // Handle changes to properties *within* a specific screening question object
  const handleScreeningQuestionObjectChange = (index, updatedQuestion) => {
    setFormData((prevState) => {
      const updatedQuestions = [...prevState.screeningQuestions];
      updatedQuestions[index] = updatedQuestion;
      return { ...prevState, screeningQuestions: updatedQuestions };
    });
  };

  // Add a new empty screening question
  const addScreeningQuestion = () => {
    // Prevent adding more than 10 questions (as seen in image hint)
    const currentValidQuestions = formData.screeningQuestions.filter(
      (q) => q.question.trim() !== ""
    );
    if (currentValidQuestions.length >= 10) {
      alert("You can add a maximum of 10 screening questions.");
      return;
    }

    // Add only if the last question is not empty (text) OR is a choice type with options
    const lastQuestion =
      formData.screeningQuestions[formData.screeningQuestions.length - 1];
    const isLastQuestionValid =
      lastQuestion &&
      (lastQuestion.question.trim() !== "" ||
        (["single_choice", "multi_choice"].includes(
          lastQuestion.questionType
        ) &&
          lastQuestion.options.filter((opt) => opt.trim() !== "").length > 0));

    // Add only if the current array is empty or the last question is valid/has content
    if (formData.screeningQuestions.length === 0 || isLastQuestionValid) {
      setFormData((prevState) => ({
        ...prevState,
        screeningQuestions: [
          ...prevState.screeningQuestions,
          {
            question: "",
            questionType: "short_answer",
            options: [],
            isMandatory: false,
          },
        ],
      }));
    } else {
      // Optional: Alert user to fill the last question before adding a new one
      // alert("Please fill the last screening question before adding a new one.");
      console.log(
        "Please fill the last screening question before adding a new one."
      );
    }
  };

  // Remove a screening question
  const removeScreeningQuestion = (indexToRemove) => {
    setFormData((prevState) => {
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
  };

  // Handle change to an option text within a specific screening question
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setFormData((prevState) => {
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
    setFormData((prevState) => {
      const updatedQuestions = [...prevState.screeningQuestions];
      const currentOptions = updatedQuestions[questionIndex].options;
      // Add only if the last option is not empty or if the array is empty
      if (
        currentOptions.length === 0 ||
        currentOptions[currentOptions.length - 1].trim() !== ""
      ) {
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          options: [...currentOptions, ""], // Add a new empty option string
        };
      } else {
        // Optional: Alert user to fill the last option first
        // alert("Please fill the last option before adding a new one.");
        console.log("Please fill the last option before adding a new one.");
      }
      return { ...prevState, screeningQuestions: updatedQuestions };
    });
  };

  // Remove an option from a specific screening question
  const handleRemoveOption = (questionIndex, optionIndexToRemove) => {
    setFormData((prevState) => {
      const updatedQuestions = [...prevState.screeningQuestions];
      const updatedOptions = updatedQuestions[questionIndex].options.filter(
        (_, index) => index !== optionIndexToRemove
      );

      // If removing the last option, keep one empty option field for UI consistency
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions.length === 0 ? [""] : updatedOptions,
      };
      return { ...prevState, screeningQuestions: updatedQuestions };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Basic Validation (based on backend required fields and image *'s)
    const requiredFields = [
      "jobTitle",
      "jobDescription",
      "workType",
      "workMode",
      "category",
      "functionalArea",
      "salaryCategory",
    ];
    for (const field of requiredFields) {
      const value = formData[field];
      // Check for empty string for text/select fields
      if (typeof value === "string" && value.trim() === "") {
        alert(
          `Please select or fill out the required field: ${field
            .replace(/([A-Z])/g, " $1")
            .trim()
            .toLowerCase()}`
        ); // Improve field name in alert
        return;
      }
      // Check for empty array for multi-selects now marked as required (like qualifications)
      if (Array.isArray(value) && value.length === 0) {
        alert(
          `Please select at least one option for required field: ${field
            .replace(/([A-Z])/g, " $1")
            .trim()
            .toLowerCase()}`
        );
        return;
      }
      // Check for null for react-select single value (shouldn't happen if value is bound to string)
      if (value === null) {
        alert(
          `Please select a value for required field: ${field
            .replace(/([A-Z])/g, " $1")
            .trim()
            .toLowerCase()}`
        );
        return;
      }
    }

    // Validation for min/max ranges: ensure min <= max if both are provided and not empty
    const validateRange = (field, label) => {
      const minVal =
        formData[field][
          `min${field
            .replace("graduation", "Batch")
            .replace(/./, (c) => c.toUpperCase())}`
        ];
      const maxVal =
        formData[field][
          `max${field
            .replace("graduation", "Batch")
            .replace(/./, (c) => c.toUpperCase())}`
        ];

      // Check if both are provided (not empty string or null) AND min > max
      if (
        minVal !== "" &&
        minVal !== null &&
        maxVal !== "" &&
        maxVal !== null &&
        Number(minVal) > Number(maxVal)
      ) {
        alert(`Minimum ${label} cannot be greater than maximum ${label}.`);
        return false;
      }
      return true;
    };

    if (!validateRange("salary", "salary")) return;
    if (!validateRange("experience", "experience")) return;
    if (!validateRange("graduationYear", "batch year")) return;

    // Validation for screening questions
    const validScreeningQuestions = formData.screeningQuestions.filter((q) => {
      // Question must have text
      const hasText = q.question.trim() !== "";

      // If it's a choice type, it must have at least one non-empty option
      const hasValidOptions =
        q.questionType === "single_choice" || q.questionType === "multi_choice"
          ? q.options.filter((opt) => opt.trim() !== "").length > 0
          : true; // Other types don't require options

      // Also ensure a question type is selected (should be covered by default, but defensive)
      const hasType = !!q.questionType;

      return hasText && hasValidOptions && hasType;
    });

    if (validScreeningQuestions.length === 0) {
      alert(
        "Please add at least one screening question with text and valid options (if applicable)."
      );
      return;
    }

    // Prepare data for submission - clean up empty strings in nested objects and filter invalid questions/options
    const submissionData = { ...formData };

    // Clean up number fields in nested objects (handle empty strings and convert to number)
    const cleanupRangeField = (obj, field) => {
      const minKey = `min${field.replace(/./, (c) => c.toUpperCase())}`;
      const maxKey = `max${field.replace(/./, (c) => c.toUpperCase())}`;

      if (obj && obj[field]) {
        // Check if the nested object exists
        if (obj[field][minKey] === "") delete obj[field][minKey];
        else obj[field][minKey] = Number(obj[field][minKey]);

        if (obj[field][maxKey] === "") delete obj[field][maxKey];
        else obj[field][maxKey] = Number(obj[field][maxKey]);

        // If both min and max were empty/deleted, remove the parent object too
        if (Object.keys(obj[field]).length === 0) delete obj[field];
      }
    };

    cleanupRangeField(submissionData, "salary");
    cleanupRangeField(submissionData, "experience");
    cleanupRangeField(submissionData, "graduationYear");

    // Filter out empty strings from requirements and qualifications arrays
    submissionData.requirements = submissionData.requirements.filter(
      (req) => req.trim() !== ""
    );
    submissionData.qualifications = submissionData.qualifications.filter(
      (qual) => qual.trim() !== ""
    );

    // Filter out screening questions and clean up their options
    submissionData.screeningQuestions = formData.screeningQuestions
      .filter((q) => q.question.trim() !== "") // Keep questions with text
      .map((q) => {
        // For choice types, filter out empty options
        if (
          q.questionType === "single_choice" ||
          q.questionType === "multi_choice"
        ) {
          return {
            ...q,
            options: q.options.filter((opt) => opt.trim() !== ""),
          };
        }
        // For other types, ensure options array is empty
        return {
          ...q,
          options: [],
        };
      })
      .filter((q) => {
        // Double check: If it's a choice type, ensure it still has options after filtering
        if (
          q.questionType === "single_choice" ||
          q.questionType === "multi_choice"
        ) {
          return q.options.length > 0;
        }
        return true; // Other types are fine as long as they had text
      });

    console.log("Submitting Data:", submissionData);
    setIsLoading(true);

    try {
      const res = await apiRequest({
        url: "/jobs/upload-job", // Ensure this is correct
        token: user?.token,
        data: submissionData,
        method: "POST",
      });

      if (res.success) {
        console.log("success", res);
        alert(
          "Job Created Successfully. For Uploading more jobs visit Upload Jobs section."
        );
        navigate("/view-jobs"); // Redirect on success
      } else {
        console.log("failed", res);
        alert(res.message || "Failed to create job. Please try again.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("An error occurred during submission. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box
      sx={{
        bgcolor: "white", // Light grey background
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Main Content Area - Form and Guidelines */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center", 
          gap: { xs: 3, md: 4 },
          mb: 6,
        }}
      >
        {/* Job Upload Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flexGrow: 1,
            minWidth: 0,
            maxWidth: { xs: "100%", md: "70%" },
            backgroundColor: "white",
            p: { xs: 2, md: 4 },
            borderRadius: 2,
          }}
        >
          {/* Page Title */}
          <Box
            sx={{
              width: { md: "70%", lg: "70%", xs: "90%", sm: "90%" },
              mb: 4,
              mt: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "24px",
                fontFamily: "Satoshi",
                fontWeight: 700,
                color: "#474E68",
              }}
            >
              Your next{" "}
              <span
                style={{
                  fontSize: "24px",
                  fontFamily: "Satoshi",
                  fontWeight: 700,
                  color: "#3C7EFC",
                }}
              >
                {" "}
                best hire{" "}
              </span>
              is just a job post away!
            </Typography>
          </Box>
          {/* Section: Basic Details */}
          <Typography sx={{ ...sectionTitleStyle, mt: 0 }}>
            Basic Details
          </Typography>

          {/* Job Title */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>
              Enter Job Title <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              fullWidth
              size="small"
              required // Frontend required
              variant="outlined"
              sx={{ ...textFieldStyle }}
              placeholder="Write a name that appropriately describes the job title, e.g. Software Engineer, Data Scientist, etc."
            />
          </div>

          {/* Years of Experience Range (Min - Max) - Using Selects matching image & backend structure */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>
              Years of experience <span style={{ color: "red" }}>*</span>
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Select
                  options={experienceRangeOptions}
                  value={
                    formData.experience.minExperience !== ""
                      ? experienceRangeOptions.find(
                          (opt) =>
                            opt.value === formData.experience.minExperience
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleRangeSelectChange(
                      "experience",
                      "minExperience",
                      selectedOption
                    )
                  }
                  placeholder="Select Min"
                  isClearable
                  styles={customSelectStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Select
                  options={
                    formData.experience.minExperience !== ""
                      ? experienceRangeOptions.filter(
                          (opt) =>
                            opt.value >= formData.experience.minExperience
                        )
                      : experienceRangeOptions
                  }
                  value={
                    formData.experience.maxExperience !== ""
                      ? experienceRangeOptions.find(
                          (opt) =>
                            opt.value === formData.experience.maxExperience
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleRangeSelectChange(
                      "experience",
                      "maxExperience",
                      selectedOption
                    )
                  }
                  placeholder="Select Max"
                  isClearable
                  styles={customSelectStyle}
                />
              </Grid>
            </Grid>
          </div>

          {/* Skills Required Multi-Select - Placed here as per original form's order */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>
              Skills Required <span style={{ color: "red" }}>*</span>
            </Typography>
            <Select
              isMulti
              options={skillsList
                .slice() // Create a copy to avoid mutating the original array
                .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
                .map((skill) => ({
                  value: skill,
                  label: skill,
                }))}
              value={formData.skills.map((skill) => ({
                value: skill,
                label: skill,
              }))}
              onChange={(selectedOptions) =>
                handleMultiSelectChange("skills", selectedOptions)
              }
              styles={customSelectStyle}
              placeholder="Select or type skills..."
            />
          </div>

          {/* Job Description with Analysis Button (Moved analysis button near JD) */}
          <div className="mb-4">
            <Box
              display="flex"
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              mb={1}
              flexDirection={{ xs: "column", sm: "row" }}
            >
              <Typography sx={{ ...formLabelStyle, mb: { xs: 1, sm: 0 } }}>
                Job Description <span style={{ color: "red" }}>*</span>
              </Typography>
            </Box>
            <TextField
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              multiline
              rows={5}
              sx={{ ...flatTextFieldStyle }}
              fullWidth
              required
              variant="outlined"
              size="small"
              placeholder="Write a detailed job description that includes responsibilities, expectations, and any other relevant information."
            />
          </div>

          <Typography sx={{ ...sectionTitleStyle }}>Location & Type</Typography>
          {/* Work Type Radio Group */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>
              Work Type <span style={{ color: "red" }}>*</span>
            </Typography>
            <RadioGroup
              row
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              sx={{
                "& .MuiFormControlLabel-root": { mr: { xs: 1, sm: 3 } },
                flexWrap: "wrap",
              }}
            >
              {workTypeOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio size="small" />}
                  label={
                    <Typography sx={{ fontSize: "0.875rem", color: "#374151" }}>
                      {option}
                    </Typography>
                  }
                />
              ))}
            </RadioGroup>
          </div>

          {/* Work Mode Radio Group */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>
              Work Mode <span style={{ color: "red" }}>*</span>
            </Typography>
            <RadioGroup
              row
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              sx={{
                "& .MuiFormControlLabel-root": { mr: { xs: 1, sm: 3 } },
                flexWrap: "wrap",
              }}
            >
              {workModeOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio size="small" />}
                  label={
                    <Typography sx={{ fontSize: "0.875rem", color: "#374151" }}>
                      {option}
                    </Typography>
                  }
                />
              ))}
            </RadioGroup>
          </div>

          {/* Job Location - Kept existing react-select implementation */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>Job Location (Optional — skip this if you're hiring for a remote position)</Typography>
            <Select
              options={filteredCities}
              value={selectedCity}
              styles={customSelectStyle}
              onChange={handleCityChange}
              onInputChange={(value) => setInputValue(value)}
              inputValue={inputValue}
              placeholder="Select Location..."
              isClearable
              isSearchable
              noOptionsMessage={({ inputValue }) =>
                inputValue
                  ? "No matching cities found"
                  : "Start typing to search"
              }
            />
            {isOtherSelected && (
              <Box mt={2}>
                <TextField
                  type="text"
                  placeholder="Enter your city"
                  value={customCity}
                  onChange={handleCustomCityChange}
                  fullWidth
                  size="small"
                  required={isOtherSelected} // Make required only if "Other" is selected
                  variant="outlined"
                  sx={{ ...textFieldStyle }}
                />
              </Box>
            )}
          </div>

          <Typography sx={{ ...sectionTitleStyle }}>Compensation</Typography>
          {/* Annual Salary Range (Min - Max) + Confidential Checkbox - Using TextFields */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>
              Annual Salary (INR Lakh) <span style={{ color: "red" }}>*</span>
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  name="minSalary"
                  placeholder="Min salary (in lakhs)"
                  value={formData.salary.minSalary}
                  onChange={(e) =>
                    handleRangeInputChange(
                      "salary",
                      "minSalary",
                      e.target.value
                    )
                  }
                  fullWidth
                  size="small"
                  variant="outlined"
                  inputProps={{ min: 0, max: 1000 }}
                  sx={{ ...textFieldStyle }}
                  error={!!salaryErrors.minSalary}
                  helperText={salaryErrors.minSalary}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  name="maxSalary"
                  placeholder="Max salary (in lakhs)"
                  value={formData.salary.maxSalary}
                  onChange={(e) =>
                    handleRangeInputChange(
                      "salary",
                      "maxSalary",
                      e.target.value
                    )
                  }
                  fullWidth
                  size="small"
                  variant="outlined"
                  inputProps={{ min: 0, max: 1000 }}
                  sx={{ ...textFieldStyle }}
                  error={!!salaryErrors.maxSalary}
                  helperText={salaryErrors.maxSalary}
                />
              </Grid>
            </Grid>
          </div>

          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>
              Salary Category <span style={{ color: "red" }}>*</span>
            </Typography>
            <RadioGroup
              row
              name="salaryCategory"
              value={formData.salaryCategory}
              onChange={handleChange}
              sx={{
                "& .MuiFormControlLabel-root": { mr: { xs: 1, sm: 3 } },
                flexWrap: "wrap",
              }}
            >
              {salaryCategoryOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio size="small" />}
                  label={
                    <Typography sx={{ fontSize: "0.875rem", color: "#374151" }}>
                      {option}
                    </Typography>
                  }
                />
              ))}
            </RadioGroup>
          </div>

          {/* Section: Targeting */}
          <Typography sx={{ ...sectionTitleStyle }}>Targeting</Typography>

          {/* Company Type - Added as per backend schema */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>
              Industry <span style={{ color: "red" }}>*</span>
            </Typography>{" "}
            {/* Not required in image or backend */}
            <Select
              options={industrySelectOptions}
              value={
                formData.companyType
                  ? industrySelectOptions.find(
                      (opt) => opt.value === formData.companyType
                    )
                  : null
              }
              onChange={(selectedOption) =>
                handleChange({
                  target: {
                    name: "companyType",
                    value: selectedOption ? selectedOption.value : "",
                  },
                })
              }
              placeholder="Select Industry..."
              isClearable
              isSearchable
              styles={customSelectStyle}
              // Required validation handled in handleSubmit
            />
          </div>

          {/* Category and Functional Area (Side by Side) - Now using Select */}
          <Grid container spacing={2} className="mb-4">
            <Grid item xs={12} sm={6}>
              <Typography sx={{ ...formLabelStyle }}>
                Category <span style={{ color: "red" }}>*</span>
              </Typography>
              <Select
                options={categorySelectOptions}
                value={
                  formData.category
                    ? categorySelectOptions.find(
                        (opt) => opt.value === formData.category
                      )
                    : null
                }
                onChange={(selectedOption) =>
                  handleChange({
                    target: {
                      name: "category",
                      value: selectedOption ? selectedOption.value : "",
                    },
                  })
                }
                placeholder="Select Category..."
                isClearable
                isSearchable
                styles={customSelectStyle}
                // Required validation handled in handleSubmit
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ ...formLabelStyle }}>
                Functional Area <span style={{ color: "red" }}>*</span>
              </Typography>
              <Select
                options={functionalAreaSelectOptions}
                value={
                  formData.functionalArea
                    ? functionalAreaSelectOptions.find(
                        (opt) => opt.value === formData.functionalArea
                      )
                    : null
                }
                onChange={(selectedOption) =>
                  handleChange({
                    target: {
                      name: "functionalArea",
                      value: selectedOption ? selectedOption.value : "",
                    },
                  })
                }
                placeholder="Select Functional Area..."
                isClearable
                isSearchable
                styles={customSelectStyle}
                // Required validation handled in handleSubmit
              />
            </Grid>
          </Grid>

          {/* Tags Multi-Select - Now using CreatableSelect with predefined options */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>Tags</Typography>
            <CreatableSelect
              isMulti
              options={tagSelectOptions} // Use the mapped tag list as base options
              value={formData.tags.map((tag) => ({ value: tag, label: tag }))} // Map current tags array
              onChange={(selectedOptions) =>
                handleMultiSelectChange("tags", selectedOptions)
              }
              styles={customSelectStyle}
              placeholder="Select or create tags..."
              // isCreatable={true} is default for CreatableSelect
            />
          </div>

          {/* Section: Education Details */}
          <Typography sx={{ ...sectionTitleStyle }}>Education</Typography>

          {/* Educational Qualifications Multi-Select (Kept as is from your code) */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>
              Educational Qualifications <span style={{ color: "red" }}>*</span>
            </Typography>
            <Select
              isMulti
              // Options seem specific here, maybe based on common degree types?
              options={[
                { value: "Bachelor's", label: "Bachelor's" },
                { value: "Master", label: "Master" },
                { value: "MBA", label: "MBA" },
                { value: "CA", label: "CA" },
                // Add other qualifications here if needed based on actual list
              ]}
              value={formData.qualifications.map((qual) => ({
                value: qual,
                label: qual,
              }))}
              // Use the generic multi-select handler
              onChange={(selectedOptions) =>
                handleMultiSelectChange("qualifications", selectedOptions)
              }
              styles={customSelectStyle}
              placeholder="Select qualifications..."
              closeMenuOnSelect={false} // Keep menu open for multiple selections
              required // Validation handled in handleSubmit
            />
          </div>

          {/* Graduation Year Range (Min - Max Batch) - Using Selects matching image & backend structure */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>
              Graduation Year <span style={{ color: "red" }}>*</span>
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Select
                  options={batchYearOptions}
                  value={
                    formData.graduationYear.minBatch !== ""
                      ? batchYearOptions.find(
                          (opt) =>
                            opt.value === formData.graduationYear.minBatch
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleRangeSelectChange(
                      "graduationYear",
                      "minBatch",
                      selectedOption
                    )
                  }
                  placeholder="Min Batch"
                  isClearable
                  styles={customSelectStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Select
                  options={
                    formData.graduationYear.minBatch
                      ? batchYearOptions.filter(
                          (opt) => opt.value >= formData.graduationYear.minBatch
                        )
                      : batchYearOptions
                  }
                  value={
                    formData.graduationYear.maxBatch !== ""
                      ? batchYearOptions.find(
                          (opt) =>
                            opt.value === formData.graduationYear.maxBatch
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleRangeSelectChange(
                      "graduationYear",
                      "maxBatch",
                      selectedOption
                    )
                  }
                  placeholder="Max Batch"
                  isClearable
                  styles={customSelectStyle}
                />
              </Grid>
            </Grid>
          </div>

          {/* Section: Applications */}
          <Typography sx={{ ...sectionTitleStyle }}>Applications</Typography>

          {/* Screening Questions Dynamic List */}

          {/* Screening Questions Dynamic List (Updated for multi-type) */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>
              Screening Questions <span style={{ color: "red" }}>*</span>
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mb: 2, fontSize: "0.875rem" }}
            >
              Add questions candidates must answer before applying. Choose the
              type and add options for single/multi-choice questions.
            </Typography>

            <Typography
              variant="body2"
              sx={{ mb: 2, fontSize: "0.875rem" ,color:"textSecondary"}}
            >
              Added Questions (
              {
                formData.screeningQuestions.filter(
                  (q) => q.question.trim() !== ""
                ).length
              }
              /{10})
            </Typography>

            {/* Ensure at least one empty field if the array is empty - map iterates */}
            {formData.screeningQuestions.map((question, index) => (
              <Box
                key={`sq-${index}`} // Use index for key as _id might not be present until save
                mb={3} // Increased margin bottom for separation
                sx={{
                  border: "1px dashed #ccc",
                  p: 2,
                  borderRadius: 1,
                  position: "relative",
                }} // Added relative for positioning remove button
              >
                {/* Remove Question Button (Positioned top right) */}
                {/* Show remove if there is more than 1 question OR if it's the only question but has content */}
                {(formData.screeningQuestions.length > 1 ||
                  (formData.screeningQuestions.length === 1 &&
                    (question.question.trim() !== "" ||
                      question.options.filter((opt) => opt.trim() !== "")
                        .length > 0))) && (
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
                      "&:hover": { bgcolor: "#f9f9f9" },
                    }}
                  >
                    X
                  </IconButton>
                )}

                {/* Question Text Field */}
                <Box mb={2}>
                  <Typography
                    variant="body2"
                    sx={{ ...formLabelStyle, mb: 0.5 }}
                  >
                    Question Text <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    name="question"
                    value={question.question}
                    onChange={(e) =>
                      handleScreeningQuestionObjectChange(index, {
                        ...question,
                        question: e.target.value,
                      })
                    }
                    placeholder={`Enter Question ${index + 1} text`}
                    label={`Question ${index + 1}`}
                    sx={{ ...flatTextFieldStyle }}
                    required // Frontend required
                  />
                </Box>

                {/* Question Type Select */}
                <Box mb={2}>
                  <Typography
                    variant="body2"
                    sx={{ ...formLabelStyle, mb: 0.5 }}
                  >
                    Question Type <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <Select
                    options={screeningQuestionTypeOptions}
                    value={screeningQuestionTypeOptions.find(
                      (opt) => opt.value === question.questionType
                    )} // Find current value object
                    onChange={(selectedOption) => {
                      const newType = selectedOption
                        ? selectedOption.value
                        : "short_answer"; // Default if cleared
                      const updatedQuestion = {
                        ...question,
                        questionType: newType,
                      };

                      // Clear options if the new type doesn't use them
                      if (
                        newType !== "single_choice" &&
                        newType !== "multi_choice"
                      ) {
                        updatedQuestion.options = [];
                      } else if (updatedQuestion.options.length === 0) {
                        // If changing TO single/multi and options are empty, add one blank option for input
                        updatedQuestion.options = [""];
                      }

                      handleScreeningQuestionObjectChange(
                        index,
                        updatedQuestion
                      );
                    }}
                    placeholder="Select Type"
                    isClearable={false} // Type is mandatory
                    styles={customSelectStyle}
                    required // Frontend required
                  />
                </Box>

                {/* Mandatory Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isMandatory"
                      checked={question.isMandatory}
                      onChange={(e) =>
                        handleScreeningQuestionObjectChange(index, {
                          ...question,
                          isMandatory: e.target.checked,
                        })
                      }
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      Mandatory
                    </Typography>
                  }
                  sx={{ mt: 1 }}
                />

                {/* Options Input (Conditional Rendering) */}
                {(question.questionType === "single_choice" ||
                  question.questionType === "multi_choice") && (
                  <Box mt={2} pl={2}>
                    {" "}
                    {/* Indent options */}
                    <Typography
                      variant="body2"
                      sx={{ ...formLabelStyle, mb: 1 }}
                    >
                      Options <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 1, fontSize: "0.75rem" }}
                    >
                      Provide options for candidates to select. At least one
                      non-empty option is required.
                    </Typography>
                    {/* Ensure at least one option field is shown if options array is empty for UI */}
                    {(question.options.length === 0
                      ? [""]
                      : question.options
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
                            handleOptionChange(index, optIndex, e.target.value)
                          }
                          placeholder={`Option ${optIndex + 1}`}
                          sx={{ ...flatTextFieldStyle }}
                        />
                        {/* Show remove only if more than 1 option OR it's the only option but has text */}
                        {(question.options.length > 1 ||
                          (question.options.length === 1 &&
                            option.trim() !== "")) && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveOption(index, optIndex)}
                            sx={{ flexShrink: 0 }}
                          >
                            X
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    {/* Add option button - Show only if the last option is not empty */}
                    {question.options.length === 0 ||
                    question.options[question.options.length - 1]?.trim() !==
                      "" ? (
                      <Button
                        variant="text"
                        onClick={() => handleAddOption(index)}
                        sx={{ ...addRemoveButtonStyle, mt: 0.5 }}
                      >
                        Add Option
                      </Button>
                    ) : (
                      // Optionally disable or hide if the last option is empty
                      <Button
                        variant="text"
                        disabled // Disable if the last option is empty
                        sx={{ ...addRemoveButtonStyle, color: "#ccc", mt: 0.5 }}
                      >
                        Add Option
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            ))}
            <Button
              variant="text"
              onClick={addScreeningQuestion}
              disabled={
                formData.screeningQuestions.filter(
                  (q) =>
                    q.question.trim() !== "" ||
                    (["single_choice", "multi_choice"].includes(
                      q.questionType
                    ) &&
                      q.options.filter((opt) => opt.trim() !== "").length > 0)
                ).length >= 10
              } // Disable if 10 valid questions added
              sx={{ ...addRemoveButtonStyle }}
            >
              Add Question
            </Button>
          </div>

          {/* Diversity Preferences Checkboxes */}
          <div className="mb-4">
            <Typography sx={{ ...formLabelStyle }}>
              Diversity Preferences
            </Typography>
            <FormGroup row sx={{ flexWrap: "wrap", gap: 0 }}>
              {" "}
              {/* Use FormGroup with row/wrap and gap */}
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={formData.diversityPreferences.femaleCandidates}
                    onChange={handleCheckboxChange}
                    name="diversityPreferences.femaleCandidates"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    Female Candidates
                  </Typography>
                }
                sx={{ m: 0, mr: 2 }} // Add right margin for spacing
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={
                      formData.diversityPreferences.womenJoiningBackWorkforce
                    }
                    onChange={handleCheckboxChange}
                    name="diversityPreferences.womenJoiningBackWorkforce"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    Women joining back workforce
                  </Typography>
                }
                sx={{ m: 0, mr: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={formData.diversityPreferences.exDefencePersonnel}
                    onChange={handleCheckboxChange}
                    name="diversityPreferences.exDefencePersonnel"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    Ex-Defence Personnel
                  </Typography>
                }
                sx={{ m: 0, mr: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={
                      formData.diversityPreferences.differentlyAbledCandidates
                    }
                    onChange={handleCheckboxChange}
                    name="diversityPreferences.differentlyAbledCandidates"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    Differently Abled Candidates
                  </Typography>
                }
                sx={{ m: 0, mr: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={formData.diversityPreferences.workFromHome}
                    onChange={handleCheckboxChange}
                    name="diversityPreferences.workFromHome"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    Work From Home (Flexible)
                  </Typography>
                }
                sx={{ m: 0, mr: 2 }}
              />
            </FormGroup>
          </div>

          {/* Application Link (Optional) */}
          <div className="mb-4 mt-4">
            <Typography sx={{ ...formLabelStyle }}>
              Application Link (if any)
            </Typography>
            <TextField
              type="text"
              name="applicationLink"
              value={formData.applicationLink}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              sx={{ ...textFieldStyle }}
            />
          </div>

          {/* Is Premium Job Checkbox */}
          {/* <Box
            sx={{
              mt: 4,
              mb: 4,
              p: 2,
              border: "1px solid #3C7EFC",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  name="isPremiumJob"
                  checked={formData.isPremiumJob}
                  onChange={handleCheckboxChange}
                  size="medium"
                  sx={{
                    color: "#3C7EFC",
                    "&.Mui-checked": { color: "#3C7EFC" },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#3C7EFC",
                    fontSize: "1rem",
                    fontFamily: "Satoshi",
                  }}
                >
                  Make this a Premium Job Post <br />{" "}
                  <span style={{ fontWeight: 400, fontSize: "0.875rem" }}>
                    Post as Premium Job for 3x More Applicants!
                  </span>
                </Typography>
              }
              sx={{ mr: 0 }}
            />
          </Box> */}

          {/* Form Buttons - Post Job, Cancel */}
          <Box sx={{ display: "flex", gap: 2, mt: 4, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                flexGrow: 1,
                maxWidth: { xs: "100%", sm: 200 }, // Make full width on small, limit on sm+
                color: "#fff",
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "none",
                borderRadius: 50,
                fontFamily: "Satoshi",
                py: 1.5,
                bgcolor: "#3C7EFC",
                "&:hover": { bgcolor: "#3C7EFC" },
                "&:disabled": { bgcolor: "#a0c3fc", color: "#fff" },
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Posting...
                </>
              ) : (
                "Post Job"
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                flexGrow: 1,
                maxWidth: { xs: "100%", sm: 120 },
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 50,
                fontFamily: "Satoshi",
                py: 1.5,
                color: "#404258",
                borderColor: "#d1d5db",
                "&:hover": { borderColor: "#a0a0a0", bgcolor: "#f0f0f0" },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        {/* Guidelines Box - Positioned next to form on medium+ screens */}
        {/* Guidelines Box - Positioned next to form on medium+ screens */}
        <Box
          sx={{
            display: 'none',
            width: "40%",
            flexShrink: 0,
            mt: { xs: 0, md: "4rem" },
            py: 4,
          }}
        >
          {" "}
          {/* Add top margin on md+ to align with first section */}
          <Box sx={{ p: 3, borderRadius: 2, bgcolor: "white" }}>
            {/* >>>>> NEW WITTY & IMPACTFUL CONTENT STARTS HERE <<<<< */}
            <Typography
              sx={{
                ...sectionTitleStyle,
                mt: 0,
              }}
            >
              Why High Impact Talent? {/* Changed headline */}
            </Typography>

            {/* Add the impactful main statement */}
            <Typography
              variant="h6" // Use h6 variant for semantic meaning, adjust sx for visual style
              sx={{
                fontSize: "1.25rem", // Slightly larger than body, smaller than h5 typically
                fontWeight: 800, // Extra bold for impact
                fontFamily: "Satoshi",
                color: "#474E68", // A strong, but not black, color
                mb: 2,
              }}
            >
              “Hire game-changers, not just resumes.” {/* Impactful quote */}
            </Typography>

            {/* Replace the guideline bullet points with benefit points */}
            {/* Use a Box with component="ul" for semantic list */}
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              {" "}
              {/* pl for list padding */}
              <Typography component="li" sx={formLabelStyle}>
                Connect with talent already vetted for excellence.{" "}
                {/* Benefit 1 */}
              </Typography>
              <Typography component="li" sx={formLabelStyle}>
                Accelerate your search – find your next hire faster.{" "}
                {/* Benefit 2 */}
              </Typography>
              <Typography component="li" sx={formLabelStyle}>
                Access a network where the top 2% stand out.{" "}
                {/* Benefit 3 (exclusivity/quality) */}
              </Typography>
              <Typography component="li" sx={formLabelStyle}>
                Build a team that doesn't just perform, it transforms.{" "}
                {/* Benefit 4 (impact) */}
              </Typography>
            </Box>

            {/* Add the concluding call to action/statement */}
            <Typography
              variant="body1"
              sx={{
                fontSize: "0.9rem", // Slightly larger than list items
                fontWeight: 600, // Semi-bold for emphasis
                fontFamily: "Satoshi",
                color: "#333",
              }}
            >
              Ready for hiring that makes an impact? Post your job below.{" "}
              {/* Closing statement */}
            </Typography>
            {/* >>>>> NEW WITTY & IMPACTFUL CONTENT ENDS HERE <<<<< */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default JobUploadPage;
