import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { Widget } from "@uploadcare/react-widget";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Loading } from "../components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom"; 
import Select from "react-select";
import { skillsList } from "../assets/mock";

const UserInfoForm = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const defaultValues = location.state?.formData?.data || {};
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [value, setValue] = useState(defaultValues.contactnumber || "");
  const [error, setError] = useState("");
  const widgetApi = useRef();
  const profileWidgetApi = useRef(null);
  const [profilePic, setProfilePic] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customCity, setCustomCity] = useState("");
  const [filters, setFilters] = useState({
    skills: location.state?.skills || []
  });
  const [formData, setFormData] = useState({
    job: "",
    company: "",
    currentCompany: defaultValues.currentCompany || "",
    currentDesignation: defaultValues.currentDesignation || "",
    linkedinLink: defaultValues.linkedinLink || "",
    experience: defaultValues.noOfYearsExperience ? Math.ceil(defaultValues.noOfYearsExperience)  : "", 
    about: defaultValues.about || "",
    salary: defaultValues.salary || "",
    contactNumber: defaultValues.contactnumber || "",
    location: defaultValues.location || "",
    relocate: "no",
    joinConsulting: defaultValues.joinConsulting || "",
    dateOfBirth: defaultValues.dateOfBirth || "",
    profilePic: null,
    skills: filters.skills,
  });

  // Fetch cities from CSV (or any other source)
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

  // Handle city selection
  const handleCityChange = (selectedOption) => {
    if (selectedOption?.value === "Other") {
      setIsOtherSelected(true);
      setSelectedCity(null);
      // Clear the jobLocation when switching to Other
      setFormData(prev => ({...prev, location: ""}));
    } else {
      setIsOtherSelected(false);
      setSelectedCity(selectedOption);
      // Set the jobLocation when a city is selected
      setFormData(prev => ({...prev, location: selectedOption?.value || ""}));
    }
  };

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
  
  const handleCustomCityChange = (e) => {
    setCustomCity(e.target.value);
    // Update formData with the custom city
    setFormData(prev => ({...prev, jobLocation: e.target.value}));
  };

  // Prepare city options with "Other" at the bottom
  const filteredCities = [
    ...cities
      .filter((city) => city.toLowerCase().includes(inputValue.toLowerCase()))
      .map((city) => ({ value: city, label: city })),
    { value: "Other", label: "Other" }, // Always at the bottom
  ];

  const handlePhoneNumberChange = (inputValue) => {
    if (inputValue) {
      setValue(inputValue);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevState => {
      const newState = {
        ...prevState,
        [name]: value,
      };
      
      if (name === "job" && value !== "Other") {
        newState.company = value;
      }
      
      return newState;
    });
  };


  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profilePic) {
      alert("Profile picture is required.");
      return;
    }

    // Add resume URL to form data
    const updatedFormData = {
      ...formData,
      experience: Number(formData.experience),
      contactNumber: value,
      profilePic: profilePic,
      skills: filters.skills,
    };

    setLoading(true);
    
    try {
      const res = await apiRequest({
        url: "user/update-user",
        method: "PUT",
        data: updatedFormData,
        token: user?.token,
      });

      if (res) {
        alert("Profile updated successfully");
        navigate("/find-jobs");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (fileInfo) => {
    // Reset state and validate input
    setFileUrl("");
    setUploadingResume(true);
    
    if (!fileInfo || !fileInfo.cdnUrl) {
      console.error("Invalid file information received");
      alert("Upload failed. Please try again.");
      setUploadingResume(false);
      return;
    }

    try {
      // Set the URL first
      setFileUrl(fileInfo.cdnUrl);
      
      // Make API call
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/upload-resume",
        { url: fileInfo.cdnUrl },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data) {
        throw new Error("No response from server");
      }
      
    } catch (error) {
      console.error("Resume upload error:", error);
      alert("Failed to save resume. Please try again.");
      setFileUrl("");
      if (widgetApi.current) {
        widgetApi.current.value(null);
      }
    } finally {
      setUploadingResume(false);
    }
  };

  const openUploadDialog = () => {
    try {
      if (!widgetApi.current) {
        throw new Error("widgetApi is not initialized or is null.");
      }

      widgetApi.current.openDialog(null, {
        accept: ".pdf,.doc,.docx",
      });
    } catch (error) {
      console.error("Error opening upload dialog:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleUploadCareChange = (file) => {
    if (file) {
      setProfilePic(file.cdnUrl);
    }
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

  useEffect(() => {
    console.log(user);
  }, []);


  return (
    <div className="flex justify-center py-8 px-4 bg-gray-100">
      <form onSubmit={handleSubmit} className="max-w-4xl w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Last/Current Consulting Company
              </label>
              <select
                name="job"
                value={formData.job}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your Company</option>
                <option value="McKinsey & Company">McKinsey & Company</option>
                <option value="Boston Consulting Group">Boston Consulting Group</option>
                <option value="Bain & Company">Bain & Company</option>
                <option value="Deloitte">Deloitte</option>
                <option value="Accenture">Accenture</option>
                <option value="Kearney">Kearney</option>
                <option value="EY">EY</option>
                <option value="PwC">PwC</option>
                <option value="KPMG">KPMG</option>
                <option value="TSMG">TSMG</option>
                <option value="Strategy&">Strategy&</option>
                <option value="Oliver Wyman">Oliver Wyman</option>
                <option value="IBM">IBM</option>
                <option value="Capgemini E.L.I.T.E.">Capgemini E.L.I.T.E.</option>
                <option value="ZS Associates">ZS Associates</option>
                <option value="Roland Berger">Roland Berger</option>
                <option value="Alvarez & Marsal">Alvarez & Marsal</option>
                <option value="Parthenon Group">Parthenon Group</option>
                <option value="Siemens Management Consulting">Siemens Management Consulting</option>
                <option value="Arthur D. Little">Arthur D. Little</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {formData.job === "Other" && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Other Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Please Specify Company name...."
                  className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Current Company (if not in consulting)</label>
              <input
                type="text"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                placeholder="Enter current company"
                className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Current Designation</label>
              <input
                type="text"
                name="currentDesignation"
                value={formData.currentDesignation}
                onChange={handleChange}
                placeholder="Enter current designation"
                className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">LinkedIn Link</label>
              <input
                type="url"
                name="linkedinLink"
                value={formData.linkedinLink}
                onChange={handleChange}
                placeholder="Enter LinkedIn profile link"
                className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Current Salary (INR Lakhs)</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select experience</option>
                {Array.from({ length: 15 }, (_, i) => (
                  <option key={i + 1} value={(i + 1).toString()}>{`${i + 1}+`}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
      <label className="block text-gray-700 text-sm font-semibold mb-2">Current Location</label>
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
          />
        </div>
      )}
    </div>


          </div>

          {/* Right Column */}
          <div>

          <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">About/Summary</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Write about your experience"
                className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
                required
              ></textarea>
            </div>
            <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Skills</label>
            <Select
              isMulti
              options={skillsList.map(skill => ({ value: skill, label: skill }))}
              value={filters.skills.map(skill => ({ value: skill, label: skill }))}
              onChange={handleSkillsChange}
              styles={customStyles}
              placeholder="Select or type skills..."
            />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]} // Restrict future dates
                className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Contact Number</label>
              <div className="border rounded-lg px-3 py-3">
                <PhoneInput
                  placeholder="Enter phone number"
                  defaultCountry="IN"
                  value={value}
                  onChange={handlePhoneNumberChange}
                  maxLength={15}
                  required
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">When did you first join Consulting?</label>
              <select
                name="joinConsulting"
                value={formData.joinConsulting}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select consulting type</option>
                <option value="lateral">Lateral</option>
                <option value="out of campus">Out of campus</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Open to Relocation?</label>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="relocate"
                  value="yes"
                  checked={formData.relocate === "yes"}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
                <span className="mr-4">Yes</span>
                <input
                  type="radio"
                  name="relocate"
                  value="no"
                  checked={formData.relocate === "no"}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
                <span>No</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Upload Profile Picture</label>
              <button className="bg-blue-500 rounded-lg cursor-pointer" type="button">
                <Widget
                  publicKey="8eeb05a138df98a3c92f"
                  ref={profileWidgetApi}
                  onChange={handleUploadCareChange}
                  imagesOnly
                  clearable
                  tabs="file"
                  required
                />
              </button>
              {profilePic && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Preview:</p>
                  <img
                    src={profilePic}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full object-cover mt-2"
                  />
                </div>
              )}
            </div>

          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInfoForm;