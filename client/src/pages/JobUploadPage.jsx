import React, { useState, useEffect } from "react";
import { apiRequest } from "../utils";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import { skillsList } from "../assets/mock";

const JobUploadPage = () => {
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customCity, setCustomCity] = useState("");
  const [filters, setFilters] = useState({
      skills: []
    });
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
    skills: filters.skills,
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/cities.csv");
        const text = await response.text();
        const rows = text.split("\n");
        const cityList = rows.slice(1).map((row) => row.trim()).filter(Boolean).sort();

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
    const selectedSkills = selectedOptions.map(option => option.value);
    
    // Update the filters state
    setFilters(prevFilters => ({
      ...prevFilters,
      skills: selectedSkills,
    }));
  
    // Update the formData state if needed
    setFormData(prevState => ({
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
        alert("Job Created Successfully. For Uploading more jobs visit Upload Jobs section.");
        navigate("/view-jobs");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded"
    >
      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">Job Title</label>
        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">
          Years of Experience
        </label>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select experience</option>
          {Array.from({ length: 15 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{`${i + 1}+`}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">
          Annual Salary (INR Lakh)
        </label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
        <div className="mb-4 mt-4">
          <label className="block text-gray-700 text-sm mb-2">Application Link</label>
          <input
            type="text"
            name="applicationLink"
            value={formData.applicationLink}
            onChange={handleChange}
            className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">
          Select Salary Category
        </label>
        <select
          name="salaryCategory"
          value={formData.salaryCategory}
          onChange={handleChange}
          className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select salary</option>
          <option value="On Experience">On Experience</option>
          <option value="Competitive">Competitive</option>
          <option value="Fixed">Fixed</option>
          <option value="Negotiable">Negotiable</option>
          <option value="Confidential">Confidential</option>
        </select>
      </div>

      {/* Work Type Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">Work Type</label>
        <select
          name="workType"
          value={formData.workType}
          onChange={handleChange}
          className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select work type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
          <option value="Temporary">Temporary</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">
          Job Location
        </label>
        <Select
          options={filteredCities}
          value={selectedCity}
          styles={customStyles}
          onChange={handleCityChange}
          onInputChange={(value) => setInputValue(value)}
          inputValue={inputValue}
          placeholder="Search or select a city..."
          isClearable
          isSearchable
          noOptionsMessage={() => (inputValue ? "No matching cities found" : "Start typing to search")}
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

      <div className="mb-4">
      <label className="block text-gray-700 text-sm mb-2">Skills</label>
            <Select
              isMulti
              options={skillsList.map(skill => ({ value: skill, label: skill }))}
              value={filters.skills.map(skill => ({ value: skill, label: skill }))}
              onChange={handleSkillsChange}
              styles={customStyles}
              placeholder="Select or type skills..."
            />
            </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">
          Job Description
        </label>
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="4"
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">
          Job Requirements
        </label>
        {formData.requirements.map((req, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              name="requirements"
              value={req}
              onChange={(e) => handleArrayChange(index, e)}
              className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addRequirement}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-2"
        >
          Add Requirement
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">
          Qualifications
        </label>
        {formData.qualifications.map((qual, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              name="qualifications"
              value={qual}
              onChange={(e) => handleArrayChange(index, e)}
              className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addQualification}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-2"
        >
          Add Qualification
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">
          Screening Questions
        </label>
        {formData.screeningQuestions.map((question, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              name="question"
              value={question.question}
              onChange={(e) => handleScreeningQuestionChange(index, e)}
              className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Question"
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="mandatory"
                checked={question.mandatory}
                onChange={(e) => handleScreeningQuestionChange(index, e)}
                className="mr-2 leading-tight"
              />
              <label className="text-gray-700 text-sm">Mandatory</label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addScreeningQuestion}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-2"
        >
          Add Screening Question
        </button>
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isLoading ? "Submitting...." : "Submit"}
      </button>
    </form>
  );
};

export default JobUploadPage;