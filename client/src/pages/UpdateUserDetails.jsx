import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { Widget } from "@uploadcare/react-widget";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

const UpdateUserForm = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [value, setValue] = useState("");
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const widgetApi = useRef();
  const profileWidgetApi = useRef(null);
  const [profilePic, setProfilePic] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [cities, setCities] = useState([]); 
  const [selectedCity, setSelectedCity] = useState(null); 
  const [inputValue, setInputValue] = useState(""); 
  const [isOtherSelected, setIsOtherSelected] = useState(false); 
  const [customCity, setCustomCity] = useState(""); 
  const [formData, setFormData] = useState({
    job: "",
    company: "",
    currentCompany: "",
    currentDesignation: "",
    linkedinLink: "",
    experience: "",
    about: "",
    salary: "",
    contactNumber: "",
    location: "",
    relocate: "no",
    joinConsulting: "",
    dateOfBirth: "",
    profilePic: null,
    resume: null,
  });

  const navigate = useNavigate();

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.token) {
        setFetchError("No authentication token found. Please login again.");
        return;
      }

      try {
        setLoading(true);
        const res = await apiRequest({
          url: "user/get",
          method: "GET",
          token: user.token,
        });

        console.log("API Response:", res);

        if (res?.success && res?.user) {
          const userData = res.user;

          setFormData({
            job: userData?.job ?? "",
            company: userData?.company ?? "",
            currentCompany: userData?.currentCompany ?? "",
            currentDesignation: userData?.currentDesignation ?? "",
            linkedinLink: userData?.linkedinLink ?? "",
            experience: userData?.experience ?? "",
            about: userData?.about ?? "",
            salary: userData?.currentSalary ?? "",
            location: userData?.currentLocation ?? "",
            relocate: userData?.openToRelocate ?? "no",
            joinConsulting: userData?.joinConsulting ?? "",
            dateOfBirth: userData?.dateOfBirth ? userData.dateOfBirth.split('T')[0] : "",
          });

          setValue(userData?.contactNumber || "");
          setProfilePic(userData?.profileUrl || null);
          setFileUrl(userData?.cvUrl || "");
          if (userData?.currentLocation) {
            setSelectedCity({
              value: userData.currentLocation,
              label: userData.currentLocation,
            });
          }
          setInitialDataLoaded(true);
          setFetchError(null);
        } else {
          throw new Error(res?.message || "Invalid response format from server");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setFetchError(
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch user data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.token]);

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

   // Handle city selection
   const handleCityChange = (selectedOption) => {
    if (selectedOption?.value === "Other") {
      setIsOtherSelected(true);
      setSelectedCity(null);
    } else {
      setIsOtherSelected(false);
      setSelectedCity(selectedOption);
      setFormData((prevState) => ({
        ...prevState,
        location: selectedOption ? selectedOption.value : "",
      }));
    }
  };

  // Handle custom city input
  const handleCustomCityChange = (e) => {
    setCustomCity(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      location: e.target.value,
    }));
  };

  // Prepare city options with "Other" at the bottom
  const filteredCities = [
    ...cities
      .filter((city) => city.toLowerCase().includes(inputValue.toLowerCase()))
      .map((city) => ({ value: city, label: city })),
    { value: "Other", label: "Other" }, // Always at the bottom
  ];

  // Custom styles for react-select
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

  const handlePhoneNumberChange = (inputValue) => {
    if (inputValue && inputValue.length <= 13) {
      setValue(inputValue);
    }
  };

  const handleChange = (e) => {
    const { name, value: inputValue } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));
  };

  const handleUpload = async (fileInfo) => {
    if (!fileInfo) return;

    try {
      if (fileInfo.name) {
        const fileExtension = fileInfo.name.split('.').pop().toLowerCase();
        const validExtensions = ["pdf", "doc", "docx"];
        const validMimeTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (validExtensions.includes(fileExtension) && validMimeTypes.includes(fileInfo.mimeType)) {
          setFileUrl(fileInfo.cdnUrl);

          if (!user?.token) {
            throw new Error("No authentication token found");
          }

          const data = { url: fileInfo.cdnUrl };
          await axios.post(
            "https://highimpacttalent.onrender.com/api-v1/user/upload-resume",
            data,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          throw new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed.");
        }
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert(error.message || "Failed to upload resume. Please try again.");
      if (widgetApi.current) {
        widgetApi.current.value(null);
      }
    }
  };

  const handleUploadCareChange = (file) => {
    try {
      if (file?.cdnUrl) {
        setProfilePic(file.cdnUrl);
      } else {
        throw new Error("Invalid file upload response");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
    }
  };

  const openUploadDialog = () => {
    try {
      if (!widgetApi.current) {
        throw new Error("widgetApi is not initialized or is null.");
      }

      widgetApi.current.openDialog(null, {
        accept: ".pdf,.doc,.docx", // Allow PDF, DOC, DOCX only
      });
    } catch (error) {
      console.error("Error opening upload dialog:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      alert("Please login to update your profile");
      navigate("/login");
      return;
    }

    // Validate required fields
    const requiredFields = ["currentDesignation"];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Create update payload with only changed fields
    const changedFields = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== "" && formData[key] !== null) {
        changedFields[key] = formData[key];
      }
    });

    // Add additional fields
    if (value) changedFields.contactNumber = value;
    if (profilePic) changedFields.profilePic = profilePic;
    if (fileUrl) changedFields.resume = fileUrl;

    if (typeof changedFields.experience === 'string' && changedFields.experience !== "") {
      changedFields.experience = Number(changedFields.experience);
    }

    setLoading(true);
    try {
      const res = await apiRequest({
        url: "user/update-user",
        method: "PUT",
        data: changedFields,
        token: user.token,
      });

      console.log("Update response:", res);

      if (res) {
        alert("Profile successfully updated");
        navigate("/user-profile");
      } else {
        throw new Error(res?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="text-gray-700 mb-4">{fetchError}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading && !initialDataLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
                  <option key={i + 1} value={i + 1}>{`${i + 1}+`}</option>
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
                  inputMode="numeric" // Restrict input to numbers on mobile devices
                  maxLength={11}
                  required
                />
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
                <option value="Lateral">Lateral</option>
                <option value="Out of campus">Out of campus</option>
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

            <div className="mb-6">
              <h2 className="text-sm font-semibold">Upload Your Resume</h2>
              <button
                onClick={openUploadDialog}
                type="button"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-2 hover:bg-blue-600"
              >
                Upload PDF Resume
              </button>
              <Widget
                publicKey="8eeb05a138df98a3c92f"
                ref={widgetApi}
                onChange={handleUpload}
                style={{ display: "none" }}
                validators={[
                  fileInfo => {
                    const allowedTypes = [
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ];
                    if (!allowedTypes.includes(fileInfo.mimeType)) {
                      return false;
                    }
                  }
                ]}
                required
              />
              {fileUrl && (
                <div className="mt-4">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Your Resume
                  </a>
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
            {loading ? "Loading..." : "Update Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserForm;