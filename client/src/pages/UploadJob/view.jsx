import React, { useState, useEffect } from "react";
import { apiRequest } from "../../utils";
import { useNavigate } from "react-router-dom";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { useSelector } from "react-redux";
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  Button,
  CircularProgress, // Added missing import
} from "@mui/material";
import { skillsList } from "../../assets/mock";
import Select from "react-select";

const JobUploadPage = () => {
  const { user } = useSelector((state) => state.user);
  const [analysing, setAnalysing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customCity, setCustomCity] = useState("");
  const [filters, setFilters] = useState({
    skills: [],
  });
  const salaryOptions = [
    "On Experience",
    "Competitive",
    "Fixed",
    "Negotiable",
    "Confidential",
  ];

  const workTypeOptions = ["Full-Time", "Part-Time", "Contract", "Temporary"];
  const workModeOptions = ["Work From Office", "Remote", "Hybrid"];
  const [formData, setFormData] = useState({
    jobTitle: "",
    experience: "",
    salary: "",
    salaryCategory: "",
    salaryConfidential: false,
    jobLocation: "",
    jobDescription: "",
    applicationLink: "",
    requirements: [""],
    qualifications: [""],
    screeningQuestions: [{ question: "", mandatory: false }],
    workType: "",
    workMode: "",
    skills: filters.skills,
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/cities.csv");
        const text = await response.text();
        const rows = text.split("\n");
        const cityList = rows
          .slice(1)
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

  const handleSkillsChange = (selectedOptions) => {
    // Extract the values from the selected options
    const selectedSkills = selectedOptions.map((option) => option.value);

    // Update the filters state
    setFilters((prevFilters) => ({
      ...prevFilters,
      skills: selectedSkills,
    }));

    // Update the formData state if needed
    setFormData((prevState) => ({
      ...prevState,
      skills: selectedSkills,
    }));
  };

  // Handle city selection
  const handleCityChange = (selectedOption) => {
    if (selectedOption?.value === "Other") {
      setIsOtherSelected(true);
      setSelectedCity(null);
      // Clear jobLocation when switching to "Other"
      setFormData({ ...formData, jobLocation: "" });
    } else {
      setIsOtherSelected(false);
      setSelectedCity(selectedOption);
      // Update jobLocation in formData when a city is selected
      if (selectedOption) {
        setFormData({ ...formData, jobLocation: selectedOption.value });
      } else {
        setFormData({ ...formData, jobLocation: "" });
      }
    }
  };

  //Call JD Analyser 
  const handleAnalysis = async () => {
    setAnalysing(true);
    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/ai/analyse-jd",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobDescription: formData.jobDescription }),
        }
      );
      const data = await response.json();

      if (data.success) {
        // overwrite your arrays so the form auto-fills
        setFormData((f) => ({
          ...f,
          requirements: data.requirements,
          qualifications: data.qualifications,
          screeningQuestions: data.screeningQuestions.map((q) => ({
            question: q,
            mandatory: false,
          })),
        }));
      } else {
        console.error("Analysis failed:", data.message || data);
      }
    } catch (err) {
      console.error("Error calling analyse-jd API:", err);
    } finally {
      setAnalysing(false);
    }
  };

  // Handle custom city input
  const handleCustomCityChange = (e) => {
    const cityValue = e.target.value;
    setCustomCity(cityValue);
    // Update jobLocation in formData with custom city value
    setFormData({ ...formData, jobLocation: cityValue });
  };

  // Prepare city options with "Other" at the bottom
  const filteredCities = [
    ...cities
      .filter((city) => city.toLowerCase().includes(inputValue.toLowerCase()))
      .map((city) => ({ value: city, label: city })),
    { value: "Other", label: "Other" }, // Always at the bottom
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fixed handler for experience select
  const handleExpChange = (selectedOption) => {
    setFormData({
      ...formData,
      experience: selectedOption ? selectedOption.value : "",
    });
  };

  const handleArrayChange = (index, e) => {
    const { name, value } = e.target;
    const updatedArray = [...formData[name]];
    updatedArray[index] = value;
    setFormData({ ...formData, [name]: updatedArray });
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ""] });
  };

  const addQualification = () => {
    setFormData({
      ...formData,
      qualifications: [...formData.qualifications, ""],
    });
  };

  const addScreeningQuestion = () => {
    setFormData({
      ...formData,
      screeningQuestions: [
        ...formData.screeningQuestions,
        { question: "", mandatory: false },
      ],
    });
  };

  const handleScreeningQuestionChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedQuestions = [...formData.screeningQuestions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData({ ...formData, screeningQuestions: updatedQuestions });
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "0.5rem",
      fontSize: "0.875rem",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#d1d5db",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      border: "1px solid #d1d5db",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : "white",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: "white",
        color: "black",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "black",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (!formData.jobLocation) {
      alert("Please select or enter a job location");
      return;
    }

    // Convert string values to numbers
    const submissionData = {
      ...formData,
      experience: Number(formData.experience),
      salary: Number(formData.salary),
      skills: filters.skills,
    };

    console.log(submissionData);
    setIsLoading(true);

    try {
      const res = await apiRequest({
        url: "/jobs/upload-job",
        token: user?.token,
        data: submissionData,
        method: "POST",
      });

      if (res.status === "failed") {
        console.log("failed", res);
        alert(res.message || "Failed to create job. Please try again.");
      } else {
        console.log("success", res);
        alert(
          "Job Created Successfully. For Uploading more jobs visit Upload Jobs section."
        );
        navigate("/view-jobs");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const experienceOptions = Array.from({ length: 15 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}+`,
  }));

  return (
    <Box
      sx={{
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: {
            md: "70%", // on small screens
            lg: "70%", // on small-medium screens
            xs: "90%", // on medium+
            sm: "90%", // on large+
          },
          mt: "5%",
          mb: 6,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
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
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: {
            md: "70%", // on small screens
            lg: "70%", // on small-medium screens
            xs: "90%", // on medium+
            sm: "90%", // on large+
          },
          mb: 6,
          backgroundColor: "white", // equivalent to bg-white
        }}
      >
        <div className="mb-4">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "#404258",
              mb: 2,
            }}
          >
            Enter Job Title <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            fullWidth
            size="small"
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 16,
              },
            }}
          />
        </div>

        {/* Work Type Dropdown */}
        <div className="mb-4">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "#404258",
              mb: 2,
            }}
          >
            Work Type<span style={{ color: "red" }}>*</span>
          </Typography>

          <RadioGroup
            row
            name="workType"
            value={formData.workType}
            onChange={handleChange}
          >
            {workTypeOptions.map((option) => (
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

        <div className="mb-4">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "#404258",
              mb: 2,
            }}
          >
            Experience in years <span style={{ color: "red" }}>*</span>
          </Typography>
          {/* Fixed experience dropdown */}
          <Select
            options={experienceOptions}
            value={
              formData.experience
                ? {
                    value: formData.experience,
                    label: `${formData.experience}+`,
                  }
                : null
            }
            onChange={handleExpChange}
            placeholder="Select experience"
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: 50,
                minHeight: 42,
              }),
            }}
          />
        </div>

        <div className="mb-4">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "#404258",
              mb: 2,
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
            {salaryOptions.map((option) => (
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

        <div className="mb-4">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "#404258",
              mb: 2,
            }}
          >
            Annual Salary (INR Lakh) <span style={{ color: "red" }}>*</span>
          </Typography>

          <TextField
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            fullWidth
            size="small"
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 16,
              },
            }}
          />
        </div>

        <div className="mb-4">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "#404258",
              mb: 2,
            }}
          >
            Job Location<span style={{ color: "red" }}>*</span>
          </Typography>

          <Select
            options={filteredCities}
            fullWidth
            value={selectedCity}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: 50,
                minHeight: 42,
              }),
            }}
            onChange={handleCityChange}
            onInputChange={(value) => setInputValue(value)}
            inputValue={inputValue}
            placeholder="Search or select a city..."
            isClearable
            isSearchable
            noOptionsMessage={() =>
              inputValue ? "No matching cities found" : "Start typing to search"
            }
          />

          {isOtherSelected && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                className="px-4 py-2 border rounded-lg w-full"
                placeholder="Enter your city"
                value={customCity}
                onChange={handleCustomCityChange}
                required={isOtherSelected}
              />
            </div>
          )}
        </div>

        {/* Work Mode Dropdown */}
        <div className="mb-4">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "#404258",
              mb: 2,
            }}
          >
            Work Mode<span style={{ color: "red" }}>*</span>
          </Typography>

          <RadioGroup
            row
            name="workMode"
            value={formData.workMode}
            onChange={handleChange}
          >
            {workModeOptions.map((option) => (
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

        <div className="mb-4">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "#404258",
              mb: 2,
            }}
          >
            Skills Required<span style={{ color: "red" }}>*</span>
          </Typography>

          <Select
            isMulti
            options={skillsList.map((skill) => ({
              value: skill,
              label: skill,
            }))}
            value={filters.skills.map((skill) => ({
              value: skill,
              label: skill,
            }))}
            onChange={handleSkillsChange}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: 50,
                minHeight: 48,
              }),
            }}
            placeholder="Select or type skills..."
          />
        </div>

        <div className="mb-4">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                fontFamily: "Satoshi",
                color: "#404258",
              }}
            >
              Job Description<span style={{ color: "red" }}>*</span>
            </Typography>
    {analysing ? (
          <CircularProgress size={24} />
        ) : (
          <Button
            variant="text"
            size="small"
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "blue",
              textTransform: "none",
            }}
            startIcon={<DocumentScannerIcon />}
            onClick={handleAnalysis}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 5,
              },
            }}
            fullWidth
            required
            variant="outlined"
            size="small"
          />
        </div>

        <div className="mb-4">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "#404258",
              mb: 2,
            }}
          >
            Job Requirements<span style={{ color: "red" }}>*</span>
          </Typography>

          {formData.requirements.map((req, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <Typography
                variant="body2"
                sx={{ minWidth: 24, fontWeight: "bold", mr: 1 }}
              >
                {index + 1}.
              </Typography>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                name="requirements"
                value={req}
                onChange={(e) => handleArrayChange(index, e)}
                placeholder={`Requirement ${index + 1}`}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          ))}
          <Typography
            variant="body2"
            color="primary"
            sx={{
              mt: 2,
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": {
                color: "primary.dark",
              },
            }}
            onClick={addRequirement}
          >
            Add Requirement
          </Typography>
        </div>

        <div className="mb-4">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "#404258",
              mb: 2,
            }}
          >
            Qualifications Required<span style={{ color: "red" }}>*</span>
          </Typography>

          {formData.qualifications.map((qual, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <Typography
                variant="body2"
                sx={{ minWidth: 24, fontWeight: "bold", mr: 1 }}
              >
                {index + 1}.
              </Typography>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                name="qualifications"
                value={qual}
                onChange={(e) => handleArrayChange(index, e)}
                placeholder={`Qualification ${index + 1}`}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          ))}
          <Typography
            variant="body2"
            color="primary"
            sx={{
              mt: 2,
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": {
                color: "primary.dark",
              },
            }}
            onClick={addQualification}
          >
            Add Qualification
          </Typography>
        </div>

        <div className="mb-4">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "#404258",
              mb: 2,
            }}
          >
            Screening Questions<span style={{ color: "red" }}>*</span>
          </Typography>

          {formData.screeningQuestions.map((question, index) => (
            <Box key={index} mb={3}>
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <Typography
                  variant="body2"
                  sx={{ minWidth: 24, fontWeight: "bold", mr: 1 }}
                >
                  {index + 1}.
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  name="question"
                  value={question.question}
                  onChange={(e) => handleScreeningQuestionChange(index, e)}
                  placeholder={`Question ${index + 1}`}
                  label={`Question ${index + 1}`}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    name="mandatory"
                    checked={question.mandatory}
                    onChange={(e) => handleScreeningQuestionChange(index, e)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">Mandatory</Typography>}
                sx={{ mt: 1 }}
              />
            </Box>
          ))}
          <Typography
            variant="body2"
            color="primary"
            sx={{
              mt: 2,
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": {
                color: "primary.dark",
              },
            }}
            onClick={addScreeningQuestion}
          >
            Add Question
          </Typography>
        </div>

        <div className="mb-4 mt-4">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Satoshi",
              color: "#404258",
              mb: 2,
            }}
          >
            Application Link (if any)
          </Typography>

          <TextField
            type="text"
            name="applicationLink"
            value={formData.applicationLink}
            onChange={handleChange}
            fullWidth
            size="small"
            variant="outlined" // Removed required prop
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 16,
              },
            }}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{
            color: "#fff",
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: "none",
            mt: 2,
            mb: 8,
            borderRadius: 50,
            fontFamily: "Satoshi",
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
              Uploading...
            </>
          ) : (
            "Upload Job"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default JobUploadPage;
