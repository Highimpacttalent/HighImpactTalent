import React, { useState, useEffect } from "react";
import { apiRequest } from "../../utils";
import { useNavigate } from "react-router-dom";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { useSelector } from "react-redux";
import {
  Box,
  TextField,
  Typography,
  // MenuItem, // Not used
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  // FormLabel, // Not used
  Button,
  CircularProgress,
  Grid, // Used for min/max fields
  Paper, // Used for Guidelines box
} from "@mui/material";
import Select from "react-select"; // Used for Location, Experience, Grad Year, Skills, Tags
import { skillsList } from "../../assets/mock"; // Assuming this list is for the Skills dropdown


// Helper styles - Based on original code's sx props
const formLabelStyle = {
  fontSize: "1rem", // 16px
  fontWeight: 500,
  fontFamily: "Satoshi",
  color: "#404258",
  mb: 1, // Reduced margin
  display: 'block',
};

const sectionTitleStyle = {
    fontSize: "1.25rem", // 20px
    fontWeight: 700,
    fontFamily: "Satoshi",
    color: "#3C7EFC",
    mb: 2,
    mt: 3, // Add margin top for sections
};

const textFieldStyle = { // Style for rounded text fields (like Job Title, Application Link, etc.)
   "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      fontSize: '0.875rem', // 14px
      minHeight: '42px', // Standard height similar to original Select
   },
    "& input[type=number]": {
      '-moz-appearance': 'textfield'
   },
   "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
      '-webkit-appearance': 'none',
      margin: 0
   }
};

const flatTextFieldStyle = { // Style for text areas / multiline fields (like JD, Req, Qual, Questions)
     "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      fontSize: '0.875rem',
   },
};

const customSelectStyle = { // Styles for react-select components
    control: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem",
      borderRadius: "8px", // Rounded corners
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
       minHeight: '42px', // Standard height
      "&:hover": {
        borderColor: "#d1d5db",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 12px', // Adjust horizontal padding inside the control
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      border: "1px solid #d1d5db",
       zIndex: 1000 // Ensure dropdown is above other content
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
      backgroundColor: '#e0e0e0',
      borderRadius: 16,
       margin: '2px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'black',
       fontSize: "0.875rem",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'black',
      borderRadius: 16,
      ':hover': {
        backgroundColor: '#c0c0c0',
        color: 'red',
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
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
         padding: '8px',
    }),
  };

const addRemoveButtonStyle = { // Style for Add/Remove text buttons
   mt: 1,
   cursor: "pointer",
   textTransform: "none",
   fontWeight: "bold",
   color: "primary.main", // Use primary color
   fontSize: '0.875rem',
   "&:hover": {
      textDecoration: "underline",
      bgcolor: 'transparent',
   },
};


const JobUploadPage = () => {
  const { user } = useSelector((state) => state.user);
  const [analysing, setAnalysing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // State for City Select/Input
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customCity, setCustomCity] = useState("");

  // Options arrays (matching backend enums or derived)
  const salaryCategoryOptions = [ // Renamed from salaryOptions
    "On Experience", "Competitive", "Fixed", "Negotiable", "Confidential",
  ];
  const workTypeOptions = ["Full-Time", "Part-Time", "Contract", "Temporary"];
  const workModeOptions = ["Work From Office", "Remote", "Hybrid"];
  const courseTypeOptions = [ // Based on backend enum
    { value: "Full time", label: "Full time" },
    { value: "Part time", label: "Part time" },
    { value: "Distance Learning Program", label: "Distance Learning Program" },
    { value: "Executive Program", label: "Executive Program" },
    { value: "Certification", label: "Certification" },
  ];

  // Experience options for Min/Max Selects (1 to 50+)
  const experienceRangeOptions = Array.from({ length: 50 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}${i < 49 ? '' : '+'}`, // Add '+' to the last option (50+)
  }));

   // Batch Year options for Min/Max Selects
  const currentYear = new Date().getFullYear();
  const batchYearOptions = Array.from({ length: (currentYear + 5) - 1970 + 1 }, (_, i) => {
      const year = 1970 + i;
      return { value: year, label: year.toString() };
  }).reverse(); // Show recent years first


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
    qualifications: [""], // [string]
    screeningQuestions: [{ question: "", isMandatory: false }], // [{ question: string, isMandatory: boolean }]
    applicationLink: "", // string
    skills: [], // [string]
    graduationYear: { minBatch: "", maxBatch: "" }, // object
    tags: [], // [string]
    courseType: "", // string (enum)
    diversityPreferences: { // object
      femaleCandidates: false,
      womenJoiningBackWorkforce: false,
      exDefencePersonnel: false,
      differentlyAbledCandidates: false,
      workFromHome: false,
    },
    category: "", // string
    functionalArea: "", // string
    isPremiumJob: false, // boolean
     // duration: "permanent", // default in schema, not required in form
     // postingDate: new Date(), // default in schema, not required in form
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

   // Handler for Checkboxes (top-level and nested diversity)
   const handleCheckboxChange = (e) => {
       const { name, checked } = e.target;
       if (name.startsWith("diversityPreferences.")) {
            setFormData(prevState => ({
            ...prevState,
            diversityPreferences: {
                ...prevState.diversityPreferences,
                [name.split('.')[1]]: checked, // Update nested boolean
            }
            }));
       } else {
           setFormData({ ...formData, [name]: checked }); // Update top-level boolean
       }
   };

   // Handler for React-Select for Min/Max Range fields (experience, graduationYear)
   const handleRangeSelectChange = (field, type, selectedOption) => {
       // selectedOption is { value: ..., label: ... } or null
       const value = selectedOption ? selectedOption.value : "";
       setFormData(prevState => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                [type]: value === "" ? "" : Number(value), // Ensure number or empty string
            },
        }));
   };

    // Handler for TextField based Min/Max Range fields (salary)
   const handleRangeInputChange = (field, type, value) => {
        // Allow empty string or valid number
        const numValue = value === "" ? "" : Number(value);

        // Basic validation: prevent setting non-numeric or negative values (except empty string)
        if (value !== "" && (isNaN(numValue) || numValue < 0)) {
            console.warn(`Invalid input for ${field} ${type}:`, value);
            return; // Do not update state for invalid input
        }

        setFormData(prevState => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                [type]: numValue,
            },
        }));
   };


  // Handler for React-Select Multi-Select fields (Skills, Tags)
  const handleMultiSelectChange = (fieldName, selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prevState => ({
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
      setFormData({ ...formData, jobLocation: selectedOption ? selectedOption.value : "" });
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


  // Handle JD Analysis (Updated to use isMandatory and filter empty results)
  const handleAnalysis = async () => {
    if (!formData.jobDescription.trim()) {
      alert("Please enter Job Description to analyze.");
      return;
    }
    setAnalysing(true);
    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/ai/analyse-jd",
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
          requirements: Array.isArray(data.requirements) ? data.requirements.filter(r => r.trim() !== '') : [],
          qualifications: Array.isArray(data.qualifications) ? data.qualifications.filter(q => q.trim() !== '') : [],
          screeningQuestions: Array.isArray(data.screeningQuestions)
            ? data.screeningQuestions.filter(q => q.trim() !== '').map((q) => ({
                question: q,
                isMandatory: false, // Default mandatory to false based on analysis output
              }))
            : [],
        }));
        alert("Job Description analyzed successfully! Requirements, Qualifications, and Screening Questions have been populated.");
      } else {
        console.error("Analysis failed:", data.message || data);
        alert(`Analysis failed: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error calling analyse-jd API:", err);
      alert("An error occurred during JD analysis.");
    } finally {
      setAnalysing(false);
    }
  };


  // Handle dynamic array field changes (requirements, qualifications) - Kept
  const handleArrayChange = (fieldName, index, value) => {
    const updatedArray = [...formData[fieldName]];
    updatedArray[index] = value;
    setFormData({ ...formData, [fieldName]: updatedArray });
  };

  // Add item to dynamic array fields (requirements, qualifications) - Kept, added check for last item
  const addArrayItem = (fieldName) => {
     // Add only if the last item is not empty
     const lastItem = formData[fieldName][formData[fieldName].length - 1];
     if (!lastItem || lastItem.trim() !== '') {
         setFormData({ ...formData, [fieldName]: [...formData[fieldName], ""] });
     } else {
         console.log(`Please fill the last ${fieldName.slice(0, -1)} first.`);
     }
  };

    // Remove item from dynamic array fields
   const removeArrayItem = (fieldName, index) => {
       const updatedArray = formData[fieldName].filter((_, i) => i !== index);
       setFormData({ ...formData, [fieldName]: updatedArray });
   };


  // Handle screening question changes (question text or isMandatory checkbox) - Updated field name
  const handleScreeningQuestionChange = (index, fieldName, value) => {
    const updatedQuestions = [...formData.screeningQuestions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [fieldName]: value,
    };
    setFormData({ ...formData, screeningQuestions: updatedQuestions });
  };

   // Add screening question - Kept, updated structure and added limit
  const addScreeningQuestion = () => {
     // Prevent adding more than 10 questions (as seen in image hint)
     if (formData.screeningQuestions.length >= 10) {
          alert("You can add a maximum of 10 screening questions.");
          return;
     }
      // Add only if the last question is not empty
     const lastQuestion = formData.screeningQuestions[formData.screeningQuestions.length - 1]?.question;
     if (!lastQuestion || lastQuestion.trim() !== '') {
         setFormData({
            ...formData,
            screeningQuestions: [
            ...formData.screeningQuestions,
            { question: "", isMandatory: false },
            ],
         });
     } else {
        console.log("Please fill the last question first.");
     }
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Basic Validation (based on backend required fields and image *'s)
    // Backend required: jobTitle, jobLocation, jobDescription, workType, workMode
    // Image * implies required: jobTitle, Location, Experience, Job Description, Category, Functional Area, Annual Salary, Graduation Year, Course Type, Screening Questions
    // Let's make all of these required for robust frontend validation
    const requiredFields = ['jobTitle', 'jobLocation', 'jobDescription', 'workType', 'workMode', 'category', 'functionalArea', 'salaryCategory', 'courseType'];
     for (const field of requiredFields) {
         const value = formData[field];
         if (value === "" || value === null || (typeof value === 'string' && value.trim() === '')) {
             alert(`Please fill out the required field: ${field}`);
             // Optional: Add logic to focus the problematic field
             return;
         }
     }

     // Check if at least one requirement and qualification is added (if arrays are empty, they won't pass backend validation if required)
     if (formData.requirements.filter(r => r.trim() !== '').length === 0) {
         alert("Please add at least one job requirement.");
         return;
     }
     if (formData.qualifications.filter(q => q.trim() !== '').length === 0) {
         alert("Please add at least one qualification.");
         return;
     }

     // Check if at least one screening question is added (if array is empty, it won't pass backend validation if required)
      if (formData.screeningQuestions.filter(q => q.question.trim() !== '').length === 0) {
           alert("Please add at least one screening question.");
           return;
      }

    // Validation for min/max ranges: ensure min <= max if both are provided and not empty
    const validateRange = (field, label) => {
        const minVal = formData[field][`min${field.replace('graduation', 'Batch').replace(/./, c => c.toUpperCase())}`];
        const maxVal = formData[field][`max${field.replace('graduation', 'Batch').replace(/./, c => c.toUpperCase())}`];

        // Check if both are provided (not empty string or null) AND min > max
        if (minVal !== "" && minVal !== null && maxVal !== "" && maxVal !== null && Number(minVal) > Number(maxVal)) {
            alert(`Minimum ${label} cannot be greater than maximum ${label}.`);
            // Optional: Add logic to focus the problematic fields
            return false;
        }
        return true;
    };

    if (!validateRange('salary', 'salary')) return;
    if (!validateRange('experience', 'experience')) return;
    if (!validateRange('graduationYear', 'batch year')) return;


    // Prepare data for submission - clean up empty strings in nested objects and filter empty array items
     const submissionData = { ...formData };

     // Remove empty strings/nulls from number fields within nested objects if backend expects only numbers
     // Backend controller uses `...(salary && !salaryConfidential && { salary })` etc., which means if the object exists,
     // it will include it. If minSalary/maxSalary are "", the backend schema's Number type might cast them to null or 0,
     // or it might fail validation if `required` is true for the nested number (it's not in your schema).
     // Sending empty strings for optional numbers is usually safe with Mongoose defaults/optional fields.
     // However, filtering out empty values makes the payload cleaner. Let's filter empty strings.

     if (submissionData.salary.minSalary === "") delete submissionData.salary.minSalary; else submissionData.salary.minSalary = Number(submissionData.salary.minSalary);
     if (submissionData.salary.maxSalary === "") delete submissionData.salary.maxSalary; else submissionData.salary.maxSalary = Number(submissionData.salary.maxSalary);
     // If salary object is empty after removing min/max, check if backend expects it removed.
     // Backend controller keeps the object even if empty `{}`. Let's keep the object if it has at least one key remaining.
      if (Object.keys(submissionData.salary).length === 0) delete submissionData.salary;


     if (submissionData.experience.minExperience === "") delete submissionData.experience.minExperience; else submissionData.experience.minExperience = Number(submissionData.experience.minExperience);
     if (submissionData.experience.maxExperience === "") delete submissionData.experience.maxExperience; else submissionData.experience.maxExperience = Number(submissionData.experience.maxExperience);
      if (Object.keys(submissionData.experience).length === 0) delete submissionData.experience;

     if (submissionData.graduationYear.minBatch === "") delete submissionData.graduationYear.minBatch; else submissionData.graduationYear.minBatch = Number(submissionData.graduationYear.minBatch);
     if (submissionData.graduationYear.maxBatch === "") delete submissionData.graduationYear.maxBatch; else submissionData.graduationYear.maxBatch = Number(submissionData.graduationYear.maxBatch);
      if (Object.keys(submissionData.graduationYear).length === 0) delete submissionData.graduationYear;


     // Filter out empty strings from requirements and qualifications arrays
     submissionData.requirements = submissionData.requirements.filter(req => req.trim() !== '');
     submissionData.qualifications = submissionData.qualifications.filter(qual => qual.trim() !== '');
     // Filter out screening questions with empty text
     submissionData.screeningQuestions = submissionData.screeningQuestions.filter(q => q.question.trim() !== '');
     // Tags are handled by react-select, already an array of strings


     console.log("Submitting Data:", submissionData);
     setIsLoading(true);

    try {
      const res = await apiRequest({
        url: "/jobs/upload-job",
        token: user?.token,
        data: submissionData,
        method: "POST",
      });

      if (res.success) { // Backend response has 'success' boolean
        console.log("success", res);
        alert("Job Created Successfully. For Uploading more jobs visit Upload Jobs section.");
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
        bgcolor: "#f3f4f6", // Light grey background
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      {/* Header Title */}
       <Box
        sx={{
           width: { md: "70%", lg: "70%", xs: "90%", sm: "90%" },
           mb: 4,
           mt: 2,
        }}
      >
         <Typography
           sx={{
             textAlign: "left",
             fontSize: { xs: "1.5rem", sm: "1.8rem" },
             fontWeight: 700,
             fontFamily: "Satoshi",
             color: "#474E68",
           }}
         >
           Post a New Job
         </Typography>
      </Box>

      {/* Main Content Area - Form and Guidelines */}
      <Box
        sx={{
           width: { md: "70%", lg: "70%", xs: "90%", sm: "90%" },
           display: 'flex',
           flexDirection: { xs: 'column', md: 'row' },
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
                backgroundColor: "white",
                p: { xs: 2, md: 4 },
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
           {/* Section: Basic Details */}
           <Typography sx={{ ...sectionTitleStyle, mt: 0 }}>Basic Details</Typography>

            {/* Job Title */}
            <div className="mb-4">
                <Typography sx={{ ...formLabelStyle }}>Enter Job Title <span style={{ color: "red" }}>*</span></Typography>
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
                <Typography sx={{ ...formLabelStyle }}>Years of experience <span style={{ color: "red" }}>*</span></Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Select
                            options={experienceRangeOptions}
                            value={formData.experience.minExperience !== "" ? experienceRangeOptions.find(opt => opt.value === formData.experience.minExperience) : null} // Find selected option object
                            onChange={(selectedOption) => handleRangeSelectChange('experience', 'minExperience', selectedOption)}
                            placeholder="Select Min"
                            isClearable
                             styles={customSelectStyle}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                         <Select
                            options={experienceRangeOptions}
                             value={formData.experience.maxExperience !== "" ? experienceRangeOptions.find(opt => opt.value === formData.experience.maxExperience) : null} // Find selected option object
                            onChange={(selectedOption) => handleRangeSelectChange('experience', 'maxExperience', selectedOption)}
                            placeholder="Select Max"
                            isClearable
                            styles={customSelectStyle}
                         />
                    </Grid>
                </Grid>
            </div>

            {/* Skills Required Multi-Select - Placed here as per original form's order */}
                <div className="mb-4">
                    <Typography sx={{ ...formLabelStyle }}>Skills Required<span style={{ color: "red" }}>*</span></Typography>
                    <Select
                        isMulti
                        options={skillsList.map((skill) => ({ value: skill, label: skill }))}
                        value={formData.skills.map((skill) => ({ value: skill, label: skill }))}
                        onChange={(selectedOptions) => handleMultiSelectChange('skills', selectedOptions)}
                        styles={customSelectStyle}
                        placeholder="Select or type skills..."
                    />
                </div>

            {/* Job Description with Analysis Button */}
             <div className="mb-4">
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                    flexWrap="wrap"
                >
                    <Typography sx={{ ...formLabelStyle, mb: { xs: 1, sm: 0 } }}>
                        Job Description<span style={{ color: "red" }}>*</span>
                    </Typography>
                    {analysing ? (
                    <Box display="flex" alignItems="center">
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        <Typography variant="body2" color="textSecondary" sx={{fontSize: '0.875rem'}}>Analyzing...</Typography>
                    </Box>
                    ) : (
                    <Button
                        variant="text"
                        size="small"
                        sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        fontFamily: "Satoshi",
                        color: "blue",
                        textTransform: "none",
                        }}
                        startIcon={<DocumentScannerIcon fontSize="small" />}
                        onClick={handleAnalysis}
                        disabled={analysing || !formData.jobDescription.trim()}
                    >
                        Analyse JD
                    </Button>
                    )}
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
                Work Type<span style={{ color: "red" }}>*</span>
              </Typography>
              <RadioGroup
                row
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                 sx={{ '& .MuiFormControlLabel-root': { mr: { xs: 1, sm: 3 } } }}
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
                Work Mode<span style={{ color: "red" }}>*</span>
              </Typography>
              <RadioGroup
                row
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                 sx={{ '& .MuiFormControlLabel-root': { mr: { xs: 1, sm: 3 } } }}
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

               {/* Job Location */}
             <div className="mb-4">
                <Typography sx={{ ...formLabelStyle }}>Job Location <span style={{ color: "red" }}>*</span></Typography>
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
                    inputValue ? "No matching cities found" : "Start typing to search"
                    }
                    // React-select doesn't have a standard 'required' prop; validation is in handleSubmit
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
                <Typography sx={{ ...formLabelStyle }}>Annual Salary (INR Lakh) <span style={{ color: "red" }}>*</span></Typography>
                <Grid container spacing={2}>
                     <Grid item xs={12} sm={6}>
                         <TextField
                            type="number"
                            name="minSalary"
                            placeholder="Min salary (in lakhs)"
                            value={formData.salary.minSalary}
                            onChange={(e) => handleRangeInputChange('salary', 'minSalary', e.target.value)}
                            fullWidth
                            size="small"
                            variant="outlined"
                             inputProps={{ min: 0,max:1000 }}
                             sx={{ ...textFieldStyle }}
                         />
                     </Grid>
                      <Grid item xs={12} sm={6}>
                         <TextField
                            type="number"
                            name="maxSalary"
                            placeholder="Max salary (in lakhs)"
                            value={formData.salary.maxSalary}
                            onChange={(e) => handleRangeInputChange('salary', 'maxSalary', e.target.value)}
                            fullWidth
                            size="small"
                            variant="outlined"
                             inputProps={{ min: 0,max: 1000 }} // Assuming max salary is capped at 1000 lakhs
                             sx={{ ...textFieldStyle }}
                         />
                     </Grid>
                </Grid>

                 {/* Salary Confidential Checkbox */}
                 <FormControlLabel
                        control={
                          <Checkbox
                            name="salaryConfidential"
                            checked={formData.salaryConfidential}
                            onChange={handleCheckboxChange}
                            size="small"
                          />
                        }
                        label={<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Don't show this to candidates</Typography>}
                        sx={{ mt: 1 }}
                      />
                </div>

                 <div className="mb-4">
                          <Typography
                            sx={{
                              fontSize: "16px",
                              fontWeight: 500,
                              fontFamily: "Satoshi",
                              color: "#404258",
                              mb: 1,
                            }}
                          >
                            Salary Category<span style={{ color: "red" }}>*</span>
                          </Typography>
                
                          <RadioGroup
                            row
                            name="salaryCategory"
                            value={formData.salaryCategory}
                            onChange={handleChange}
                          >
                            {salaryCategoryOptions.map((option) => (
                              <FormControlLabel
                                key={option}
                                value={option}
                                control={<Radio size="small" />}
                                label={
                                  <span style={{ fontSize: "0.75rem", color: "#374151" }}>
                                    {option}
                                  </span>
                                }
                              />
                            ))}
                          </RadioGroup>
                        </div>


             {/* Section: Targeting */}
             <Typography sx={{ ...sectionTitleStyle }}>Targeting</Typography>

             {/* Company Type - Added as per backend schema */}
            <div className="mb-4">
                <Typography sx={{ ...formLabelStyle }}>Industry</Typography> {/* Not required in image or backend */}
                <TextField
                    type="text"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    variant="outlined"
                    sx={{ ...textFieldStyle }}
                />
            </div>

             {/* Category and Functional Area (Side by Side) */}
             <Grid container spacing={2} className="mb-4">
                <Grid item xs={12} sm={6}>
                     <Typography sx={{ ...formLabelStyle }}>Category<span style={{ color: "red" }}>*</span></Typography>
                    <TextField
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        required
                        variant="outlined"
                         sx={{ ...textFieldStyle }}
                    />
                </Grid>
                 <Grid item xs={12} sm={6}>
                     <Typography sx={{ ...formLabelStyle }}>Functional Area<span style={{ color: "red" }}>*</span></Typography>
                     <TextField
                        type="text"
                        name="functionalArea"
                        value={formData.functionalArea}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        required
                        variant="outlined"
                         sx={{ ...textFieldStyle }}
                     />
                 </Grid>
             </Grid>

                 {/* Tags Multi-Select */}
                <div className="mb-4">
                    <Typography sx={{ ...formLabelStyle }}>Tags</Typography>
                    <Select
                        isMulti
                        options={[]} // Allow any tag to be created
                        value={formData.tags.map((tag) => ({ value: tag, label: tag }))}
                        onChange={(selectedOptions) => handleMultiSelectChange('tags', selectedOptions)}
                        styles={customSelectStyle}
                        placeholder="Add job tag..."
                        isCreatable={true}
                    />
                </div>

                   {/* Section: Education Details */}


                 {/* Course Type Radio Group */}
               <Typography sx={{ ...sectionTitleStyle, mt: 0 }}>Eduaction</Typography>
                <div className="mb-4">
                     <Typography sx={{ ...formLabelStyle }}>Course Type <span style={{ color: "red" }}>*</span></Typography>
                     <RadioGroup
                        row
                        name="courseType"
                        value={formData.courseType}
                        onChange={handleChange}
                         sx={{ '& .MuiFormControlLabel-root': { mr: { xs: 1, sm: 3 } }, flexWrap: 'wrap' }} // Allow wrapping
                      >
                        {courseTypeOptions.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio size="small" />}
                            label={
                               <Typography sx={{ fontSize: "0.875rem", color: "#374151" }}>
                                {option.label}
                              </Typography>
                            }
                          />
                        ))}
                      </RadioGroup>
                </div>

                 {/* Graduation Year Range (Min - Max Batch) - Using Selects matching image & backend structure */}
                 <div className="mb-4">
                    <Typography sx={{ ...formLabelStyle }}>Graduation Year <span style={{ color: "red" }}>*</span></Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                             <Select
                                options={batchYearOptions}
                                value={formData.graduationYear.minBatch !== "" ? batchYearOptions.find(opt => opt.value === formData.graduationYear.minBatch) : null}
                                onChange={(selectedOption) => handleRangeSelectChange('graduationYear', 'minBatch', selectedOption)}
                                placeholder="Min Batch"
                                isClearable
                                styles={customSelectStyle}
                             />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                             <Select
                                options={batchYearOptions}
                                value={formData.graduationYear.maxBatch !== "" ? batchYearOptions.find(opt => opt.value === formData.graduationYear.maxBatch) : null}
                                onChange={(selectedOption) => handleRangeSelectChange('graduationYear', 'maxBatch', selectedOption)}
                                placeholder="Max Batch"
                                isClearable
                                styles={customSelectStyle}
                             />
                         </Grid>
                    </Grid>
                 </div>

                 {/* Requirements and Qualifications (Dynamic Lists) - Placed after Targeting as per image grouping */}
                <div className="mb-4 mt-4">
                    <Typography sx={{ ...formLabelStyle }}>
                        Job Requirements<span style={{ color: "red" }}>*</span>
                    </Typography>
                     {(formData.requirements.length === 0 ? [""] : formData.requirements).map((req, index) => (
                        <Box key={`req-${index}`} display="flex" alignItems="center" mb={2}>
                            <Typography variant="body2" sx={{ minWidth: 24, fontWeight: "bold", mr: 1, flexShrink: 0 }}>
                                {index + 1}.
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                name="requirements"
                                value={req}
                                onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                                placeholder={`Requirement ${index + 1}`}
                                sx={{ ...flatTextFieldStyle, mr: 1 }}
                            />
                             {(formData.requirements.length > 1 || (formData.requirements.length === 1 && req.trim() !== '')) && (
                                <Button variant="outlined" color="error" size="small" onClick={() => removeArrayItem("requirements", index)}
                                     sx={{ minWidth: 'auto', p: '4px', borderRadius: 16, borderColor: 'error.main', color: 'error.main', '&:hover': { borderColor: 'error.main', bgcolor: 'rgba(244, 67, 54, 0.04)' } }}>
                                   X
                                </Button>
                            )}
                        </Box>
                    ))}
                     <Button variant="text" onClick={() => addArrayItem("requirements")} sx={{ ...addRemoveButtonStyle }}>
                        Add Requirement
                    </Button>
                </div>

                <div className="mb-4">
                    <Typography sx={{ ...formLabelStyle }}>
                        Qualifications Required<span style={{ color: "red" }}>*</span>
                    </Typography>
                    {(formData.qualifications.length === 0 ? [""] : formData.qualifications).map((qual, index) => (
                        <Box key={`qual-${index}`} display="flex" alignItems="center" mb={2}>
                            <Typography variant="body2" sx={{ minWidth: 24, fontWeight: "bold", mr: 1, flexShrink: 0 }}>
                                {index + 1}.
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                name="qualifications"
                                value={qual}
                                onChange={(e) => handleArrayChange("qualifications", index, e.target.value)}
                                placeholder={`Qualification ${index + 1}`}
                                 sx={{ ...flatTextFieldStyle, mr: 1 }}
                            />
                              {(formData.qualifications.length > 1 || (formData.qualifications.length === 1 && qual.trim() !== '')) && (
                                <Button variant="outlined" color="error" size="small" onClick={() => removeArrayItem("qualifications", index)}
                                     sx={{ minWidth: 'auto', p: '4px', borderRadius: 16, borderColor: 'error.main', color: 'error.main', '&:hover': { borderColor: 'error.main', bgcolor: 'rgba(244, 67, 54, 0.04)' } }}>
                                   X
                                </Button>
                            )}
                        </Box>
                    ))}
                     <Button variant="text" onClick={() => addArrayItem("qualifications")} sx={{ ...addRemoveButtonStyle }}>
                        Add Qualification
                    </Button>
                </div>



                 {/* Section: Applications (Keeping it minimal as per image's basic sectioning) */}
             <Typography sx={{ ...sectionTitleStyle }}>Applications</Typography>

             {/* Screening Questions Dynamic List */}
            <div className="mb-4">
                <Typography sx={{ ...formLabelStyle }}>
                    Screening Questions<span style={{ color: "red" }}>*</span>
                </Typography>
                 <Typography variant="body2" color="textSecondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                    You can ask some questions before the candidates apply to your job!
                </Typography>

                <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold', fontSize: '0.875rem' }}>
                     Added Questions ({formData.screeningQuestions.filter(q => q.question.trim() !== '').length}/{10})
                </Typography>

                {/* Ensure at least one empty field if the array is empty */}
                {(formData.screeningQuestions.length === 0 ? [{ question: "", isMandatory: false }] : formData.screeningQuestions).map((question, index) => (
                    <Box key={`sq-${index}`} mb={2} sx={{ border: '1px dashed #ccc', p: 2, borderRadius: 1 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Typography
                                variant="body2"
                                sx={{ minWidth: 24, fontWeight: "bold", mr: 1, flexShrink: 0 }}
                            >
                                {index + 1}.
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                name="question"
                                value={question.question}
                                onChange={(e) => handleScreeningQuestionChange(index, "question", e.target.value)}
                                placeholder={`Question ${index + 1}`}
                                label={`Question ${index + 1}`}
                                sx={{ ...flatTextFieldStyle, mr: 1 }}
                            />
                            {(formData.screeningQuestions.length > 1 || (formData.screeningQuestions.length === 1 && question.question.trim() !== '')) && (
                                <Button
                                     variant="outlined"
                                     color="error"
                                     size="small"
                                     onClick={() => removeArrayItem("screeningQuestions", index)}
                                     sx={{
                                        minWidth: 'auto',
                                        p: '4px',
                                        borderRadius: 16,
                                         borderColor: 'error.main',
                                         color: 'error.main',
                                        '&:hover': {
                                            borderColor: 'error.main',
                                            bgcolor: 'rgba(244, 67, 54, 0.04)',
                                        }
                                     }}
                                > X </Button>
                            )}
                        </Box>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isMandatory"
                                    checked={question.isMandatory}
                                    onChange={(e) => handleScreeningQuestionChange(index, "isMandatory", e.target.checked)}
                                    size="small"
                                />
                            }
                            label={<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Mandatory</Typography>}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                ))}
                <Button
                    variant="text"
                    onClick={addScreeningQuestion}
                    disabled={formData.screeningQuestions.length >= 10}
                    sx={{ ...addRemoveButtonStyle }}
                >
                    Add Question
                </Button>
            </div>

            {/* Diversity Preferences Checkboxes */}
                <div className="mb-4">
                    <Typography sx={{ ...formLabelStyle }}>Diversity Preferences</Typography>
                     <FormGroup row sx={{flexWrap: 'wrap', gap: 0}}> {/* Use FormGroup with row/wrap and gap */}
                         <FormControlLabel
                            control={<Checkbox size="small" checked={formData.diversityPreferences.femaleCandidates} onChange={handleCheckboxChange} name="diversityPreferences.femaleCandidates" />}
                            label={<Typography variant="body2" sx={{fontSize: '0.875rem'}}>Female Candidates</Typography>}
                             sx={{m:0}} // Remove default margin
                          />
                           <FormControlLabel
                            control={<Checkbox size="small" checked={formData.diversityPreferences.womenJoiningBackWorkforce} onChange={handleCheckboxChange} name="diversityPreferences.womenJoiningBackWorkforce" />}
                            label={<Typography variant="body2" sx={{fontSize: '0.875rem'}}>Women joining back workforce</Typography>}
                             sx={{m:0}}
                          />
                          <FormControlLabel
                            control={<Checkbox size="small" checked={formData.diversityPreferences.exDefencePersonnel} onChange={handleCheckboxChange} name="diversityPreferences.exDefencePersonnel" />}
                            label={<Typography variant="body2" sx={{fontSize: '0.875rem'}}>Ex-Defence Personnel</Typography>}
                             sx={{m:0}}
                          />
                           <FormControlLabel
                            control={<Checkbox size="small" checked={formData.diversityPreferences.differentlyAbledCandidates} onChange={handleCheckboxChange} name="diversityPreferences.differentlyAbledCandidates" />}
                            label={<Typography variant="body2" sx={{fontSize: '0.875rem'}}>Differently Abled Candidates</Typography>}
                             sx={{m:0}}
                          />
                           <FormControlLabel
                            control={<Checkbox size="small" checked={formData.diversityPreferences.workFromHome} onChange={handleCheckboxChange} name="diversityPreferences.workFromHome" />}
                            label={<Typography variant="body2" sx={{fontSize: '0.875rem'}}>Work From Home (Flexible)</Typography>}
                             sx={{m:0}}
                          />
                     </FormGroup>
                </div>


                {/* Application Link (Optional) */}
                <div className="mb-4 mt-4">
                    <Typography sx={{ ...formLabelStyle }}>Application Link (if any)</Typography>
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
                <Box sx={{ mt: 4, mb: 4, p: 2, bgcolor: '#eaf2ff', border: '1px solid #3C7EFC', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                     <FormControlLabel
                         control={
                           <Checkbox
                             name="isPremiumJob"
                             checked={formData.isPremiumJob}
                             onChange={handleCheckboxChange}
                             size="medium"
                             sx={{ color: '#3C7EFC', '&.Mui-checked': { color: '#3C7EFC' } }}
                           />
                         }
                         label={
                             <Typography sx={{ fontWeight: 700, color: '#3C7EFC', fontSize: '1rem' }}>
                                 Make this a Premium Job Post <br/> <span style={{fontWeight: 400, fontSize: '0.875rem'}}>Post as Premium Job for 3x More Applicants!</span>
                             </Typography>
                         }
                        sx={{ mr: 0 }}
                       />
                </Box>


                {/* Form Buttons - Post Job, Cancel */}
                <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            flexGrow: 1,
                            maxWidth: { xs: '100%', sm: 200 }, // Make full width on small, limit on sm+
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: "bold",
                            boxShadow: "none",
                            borderRadius: 50,
                            fontFamily: "Satoshi",
                            py: 1.5,
                            bgcolor: '#3C7EFC',
                            '&:hover': { bgcolor: '#3C7EFC' },
                            '&:disabled': { bgcolor: '#a0c3fc', color: '#fff' },
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
                            maxWidth: { xs: '100%', sm: 120 },
                            textTransform: "none",
                            fontWeight: "bold",
                            borderRadius: 50,
                            fontFamily: "Satoshi",
                            py: 1.5,
                            color: '#404258',
                            borderColor: '#d1d5db',
                            '&:hover': { borderColor: '#a0a0a0', bgcolor: '#f0f0f0' },
                        }}
                    >
                        Cancel
                    </Button>
                </Box>

        </Box>

         {/* Guidelines Box - Positioned next to form on medium+ screens */}
         <Box sx={{ width: { md: '300px' }, flexShrink: 0, mt: { xs: 0, md: '4rem' } }}> {/* Add top margin on md+ to align with first section */}
             <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'white' }}>
                 <Typography sx={{ fontSize: "1rem", fontWeight: 700, fontFamily: "Satoshi", color: "#66bb6a", mb: 2 }}>
                     Few guidelines
                 </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#555', mb: 1 }}>
                     • Proper formatting of the text/content of the posting with clear spaces and standard bullets (-) to be used.
                 </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#555', mb: 1 }}>
                     • No short forms/abbreviations to be used in the text.
                 </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#555', mb: 1 }}>
                     • No spelling mistakes in the content.
                 </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#555' }}>
                     • JD should be concise and crisp - to the point.
                 </Typography>
             </Paper>
         </Box>

      </Box>
    </Box>
  );
};

export default JobUploadPage;