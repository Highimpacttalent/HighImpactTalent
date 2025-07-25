import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../../utils";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Loading } from "../../components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertModal from "../../components/Alerts/view";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { UpdateUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { skillsList } from "../../assets/mock";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "../../assets/CreateAccount/UserDetails.svg";
import { Margin } from "@mui/icons-material";
const UserInfoForm = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const defaultValues = location.state?.parsedData?.data || {};
  const navigate = useNavigate();
  const refer = location.state?.refer || "/find-jobs";

  // State variables
  const [loading, setLoading] = useState(false);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  // alongside formData in your useState
  const [expErrors, setExpErrors] = useState({
    companyName: "",
    designation: "",
    from: "",
    to: "",
  });
  const [eduErrors, setEduErrors] = useState({
    institute: "",
    specialization: "",
    course: "",
    from: "",
    to: "",
  });

  const [phoneValue, setPhoneValue] = useState(
    defaultValues?.PersonalInformation?.contactNumber || ""
  );
  const [error, setError] = useState("");
  const [SalErr, setSalErr] = useState({
    salary: "",
  });
  const [MSalErr, setMSalErr] = useState({
    salary: "",
  });
  const [profilePic, setProfilePic] = useState(user?.profileUrl || "");
  const [profilePicUrl, setProfilePicUrl] = useState(user?.profileUrl || "");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [filters, setFilters] = useState({
    skills: defaultValues.skills || [],
  });
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  // Form data state
  const [formData, setFormData] = useState({
    currentCompany: defaultValues?.ProfessionalDetails?.currentCompany || "",
    currentDesignation:
      defaultValues?.ProfessionalDetails?.currentDesignation || "",
    linkedinLink: defaultValues?.PersonalInformation?.linkedinLink || "",
    experience: defaultValues?.ProfessionalDetails?.noOfYearsExperience
      ? Math.ceil(defaultValues?.ProfessionalDetails?.noOfYearsExperience)
      : "",
    about: defaultValues?.ProfessionalDetails?.about || "",
    salary: "",
    contactNumber: defaultValues?.PersonalInformation?.contactNumber || "",
    location: "",
    openToRelocate: "Yes",
    isItConsultingCompany: "Yes",
    joinConsulting: "",
    dateOfBirth: defaultValues?.PersonalInformation?.dateOfBirth || "",
    profilePic: defaultValues?.PersonalInformation?.profilePic || "",
    skills: filters.skills,
    expectedMinSalary: "",
    preferredLocations: [],
    preferredWorkTypes: [],
    preferredWorkModes: [],
    highestQualification: [],
    lastConsultingCompany: "",
    lastConsultingCustomCompany: "",
    totalYearsInConsulting: "",
    expCompanyName: "",
    expDesignation: "",
    expFrom: "",
    expTo: "",
    expDescription: "",
    experienceHistory: [],
    educationInstitute: "",
    educationCourse: "",
    educationSpecialization: "",
    educationStart: "",
    educationEnd: "",
    educationDetails: [],
  });

  // Fetch cities from CSV
  useEffect(() => {
    const fetchCities = async () => {
      try {
        // Use axios or fetch relative to the public directory
        const response = await axios.get("/cities.csv");
        const text = response.data;
        const rows = text.split("\n");
        const cityList = rows
          .slice(1) // Skip header row
          .map((row) => row.trim())
          .filter(Boolean) // Remove empty rows
          .sort(); // Sort alphabetically
        const uniqueCities = [...new Set(cityList)];
        setCities(uniqueCities);

        // now that we have cities, validate the default location
        const defaultLoc =
          location.state?.parsedData?.data?.PersonalInformation?.location;
        if (defaultLoc && uniqueCities.includes(defaultLoc)) {
          setFormData((prev) => ({ ...prev, location: defaultLoc }));
          setSelectedCity(defaultLoc);
        }
      } catch (error) {
        console.error("Error loading cities:", error);
        setCities([]);
      }
    };
    fetchCities();
  }, []);

  // Handle city selection
  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setFormData((prev) => ({
      ...prev,
      location: selectedOption?.value || "",
    }));
  };

  // Handle skills change
  const handleSkillsChange = (selectedOptions) => {
    const selectedSkills = selectedOptions.map((option) => option.value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      skills: selectedSkills,
    }));
    setFormData((prevState) => ({
      ...prevState,
      skills: selectedSkills,
    }));
  };

  // Handle phone number change
  const handlePhoneNumberChange = (value) => {
    if (value) {
      setPhoneValue(value);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // update the data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // only validate salary here
    if (name === "salary") {
      if (value === "") {
        setSalErr((prev) => ({ ...prev, salary: "Salary is required." }));
      } else {
        const num = Number(value);
        if (isNaN(num)) {
          setSalErr((prev) => ({ ...prev, salary: "Must be a number." }));
        } else if (num < 1) {
          setSalErr((prev) => ({ ...prev, salary: "Minimum is 1." }));
        } else if (num > 1000) {
          setSalErr((prev) => ({
            ...prev,
            salary: "Cannot exceed 1000. Please mention in INR Lakhs & not INR",
          }));
        } else {
          setSalErr((prev) => ({ ...prev, salary: "" }));
        }
      }
    }
    if (name === "expectedMinSalary") {
      if (value === "") {
      } else {
        const num = Number(value);
        if (isNaN(num)) {
          setMSalErr((prev) => ({ ...prev, salary: "Must be a number." }));
        } else if (num < 1) {
          setMSalErr((prev) => ({ ...prev, salary: "Minimum is 1." }));
        } else if (num > 1000) {
          setMSalErr((prev) => ({ ...prev, salary: "Cannot exceed 1000." }));
        } else {
          setMSalErr((prev) => ({ ...prev, salary: "" }));
        }
      }
    }
  };

  // Handle company dropdown change
  const handlelastCompanyChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      lastConsultingCompany: value,
      // Reset custom company when selecting a new option
      customCompany: "",
    }));
  };
  // Handle custom company input
  const handlelastCustomCompanyChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      lastConsultingCustomCompany: value,
    }));
  };

  // Handle profile picture upload
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)$/)) {
      setAlert({
        open: true,
        type: "warning",
        title: "Warning",
        message: "Please upload an image file (JPEG, JPG, or PNG)!",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAlert({
        open: true,
        type: "warning",
        title: "Warning",
        message: "Image size should be less than 2MB",
      });
      return;
    }

    setUploadingProfilePic(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("profilePic", file);

      // Upload to server
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.success) {
        setProfilePicUrl(response.data.url);
        setFormData((prev) => ({ ...prev, profilePic: response.data.url }));
        setProfilePic(URL.createObjectURL(file));
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Profile picture upload error:", error);
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to upload profile picture. Please try again.",
      });
    } finally {
      setUploadingProfilePic(false);
    }
  };

  // Remove one experience by its index
  const handleDeleteExperience = (idx) => {
    setFormData((prev) => ({
      ...prev,
      experienceHistory: prev.experienceHistory.filter((_, i) => i !== idx),
    }));
  };

  const handleAddExperience = () => {
    const { expCompanyName, expDesignation, expFrom, expTo, expDescription } =
      formData;
    const errs = { companyName: "", designation: "", from: "", to: "" };
    let hasError = false;

    if (!expCompanyName) {
      errs.companyName = "Company is required.";
      hasError = true;
    }
    if (!expDesignation) {
      errs.designation = "Designation is required.";
      hasError = true;
    }
    if (!expFrom) {
      errs.from = "Start date is required.";
      hasError = true;
    }
    if (!expTo) {
      errs.to = "End date is required.";
      hasError = true;
    }
    if (expFrom && expTo && expFrom > expTo) {
      errs.to = "'To' must be same or after 'From'.";
      hasError = true;
    }

    setExpErrors(errs);
    if (hasError) return;

    // append, then reset inputs & errors
    setFormData((prev) => ({
      ...prev,
      experienceHistory: [
        ...prev.experienceHistory,
        {
          companyName: expCompanyName,
          designation: expDesignation,
          from: expFrom,
          to: expTo,
          description: expDescription || "",
        },
      ],
      expCompanyName: "",
      expDesignation: "",
      expFrom: "",
      expTo: "",
      expDescription: "",
    }));
    setExpErrors({ companyName: "", designation: "", from: "", to: "" });
  };

  const handleAddEducation = () => {
  const {
    educationInstitute,
    educationCourse,
    educationSpecialization,
    educationStart,
    educationEnd,
  } = formData;

  const errors = { institute: "", course: "", from: "", to: "" };
  let hasError = false;

  if (!educationInstitute) {
    errors.institute = "Institute name is required.";
    hasError = true;
  }

  if (!educationCourse) {
    errors.course = "Course name is required.";
    hasError = true;
  }

  if (!educationStart) {
    errors.from = "Start year is required.";
    hasError = true;
  }

  if (!educationEnd) {
    errors.to = "End year is required.";
    hasError = true;
  }

  if (educationStart && educationEnd && educationStart > educationEnd) {
    errors.to = "'End Year' must be after 'Start Year'.";
    hasError = true;
  }

  setEduErrors(errors);
  if (hasError) return;

  // Add entry and clear form fields
  setFormData((prev) => ({
    ...prev,
    educationDetails: [
      ...prev.educationDetails,
      {
        institute: educationInstitute,
        course: educationCourse,
        specialization: educationSpecialization,
        from: educationStart,
        to: educationEnd,
      },
    ],
    educationInstitute: "",
    educationCourse: "",
    educationSpecialization: "",
    educationStart: "",
    educationEnd: "",
  }));

  // Clear errors
  setEduErrors({ institute: "", course: "", from: "", to: "" });
};


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const ConsultingCompany =
      formData.lastConsultingCompany === "Other"
        ? formData.lastConsultingCustomCompany
        : formData.lastConsultingCompany;

    const updatedFormData = {
      ...formData,
      experience: Number(formData.experience),
      educationDetails: formData.educationDetails,
      contactNumber: phoneValue,
      profilePic: profilePicUrl,
      skills: filters.skills,
      expectedMinSalary: formData.expectedMinSalary,
      preferredLocations: formData.preferredLocations,
      preferredWorkTypes: formData.preferredWorkTypes,
      preferredWorkModes: formData.preferredWorkModes,
      lastConsultingCompany: ConsultingCompany,
      highestQualification: ["Bachelors"],
      experienceHistory: formData.experienceHistory,
    };

    // Remove the temporary customCompany field before submission
    delete updatedFormData.customCompany;

    setLoading(true);

    try {
      const res = await apiRequest({
        url: "user/update-user",
        method: "PUT",
        data: updatedFormData,
        token: user?.token,
      });

      if (res) {
        setAlert({
          open: true,
          type: "success",
          title: "Success",
          message: "Profile updated successfully",
        });

        console.log("res", res);
        dispatch(UpdateUser(res.user)); // Assuming the response contains the updated user object

        // Delay navigation by 2 seconds (2000 milliseconds)
        setTimeout(() => {
          navigate(refer); // Navigate after successful update
        }, 2000);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to upload profile picture. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Custom styles for Select components
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: 4,
      width: "100%",
      fontSize: "0.875rem",
      borderRadius: 50,
      border: "1px solid #24252C",
      boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
      minHeight: "48px",
      maxHeight: "120px",
      overflowY: "auto",
    }),

    valueContainer: (provided) => ({
      ...provided,
      display: "flex",
      flexWrap: "wrap",
      gap: "4px",
      overflowY: "auto",
      maxHeight: "80px",
      padding: "4px 8px",
    }),

    multiValue: (provided) => ({
      ...provided,
      margin: "2px",
      borderRadius: "999px", // ← apply only curve
    }),

    multiValueLabel: (provided) => ({
      ...provided,
      borderRadius: "999px", // ← rounded inner label too
    }),

    multiValueRemove: (provided) => ({
      ...provided,
      borderRadius: "999px", // ← rounded remove icon
    }),

    menu: (provided) => ({
      ...provided,
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      border: "1px solid #d1d5db",
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : "white",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: "#f3f4f6",
      },
    }),
  };

  // Prepare city options with "Other" at the bottom
  const filteredCities = [
    ...cities
      .filter((city) => city.toLowerCase().includes(inputValue.toLowerCase()))
      .map((city) => ({ value: city, label: city })),
    { value: "Other", label: "Other" },
  ];

  return (
    <Box sx={{ padding: "2rem", bgcolor: "white" }}>
      <AlertModal
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography
          sx={{
            fontFamily: "Satoshi",
            fontSize: "28px",
            fontWeight: 600,
            color: "#24252C",
            textAlign: "center",
            mt: 4,
          }}
        >
          You're Now Part of an{" "}
          <span
            style={{
              fontFamily: "Satoshi",
              fontSize: "28px",
              fontWeight: 600,
              color: "#3C7EFC",
            }}
          >
            Exclusive Talent
          </span>{" "}
          Network
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "16px",
              fontWeight: 400,
              color: "#808195",
              width: { sx: "100%", xs: "100%", lg: "70%", md: "70%" },
              textAlign: "center",
            }}
          >
            Save Time, Land Faster! Fill a few details to get more personalized
            recommendations
          </Typography>
        </Box>
        <Box sx={{ p: 3, mb: 2 }}>
          <img src={Image} alt="Hero./" />
        </Box>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              border: "1px solid #0000004D",
              borderRadius: 4,
              width: { xs: "100%", sm: "100%", lg: "80%", md: "80%" },
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                color: "#24252C",
                fontFamily: "Satoshi",
                fontWeight: 700,
                p: 2,
                fontSize: "20px",
              }}
            >
              Work Details
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                  sm: "center",
                  lg: "space-between",
                  md: "space-between",
                },
                flexDirection: {
                  xs: "column",
                  sm: "column",
                  lg: "row",
                  md: "row",
                },
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" },
                  p: 2,
                }}
              >
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Current Company <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Experience <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                    required
                  >
                    <option value="">Select experience</option>
                    {Array.from({ length: 15 }, (_, i) => (
                      <option key={i + 1} value={(i + 1).toString()}>{`${
                        i + 1
                      }+`}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Enter Skills <span style={{ color: "red" }}>*</span>
                  </label>
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
                    styles={customStyles}
                    placeholder="Select or type skills..."
                  />
                </div>
                {/* Preferred Work Mode (Multi-select) */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Educational Qualifications{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    isMulti
                    options={[
                      { value: "Bachelor's", label: "Bachelor's" },
                      { value: "Master", label: "Master" },
                      { value: "MBA", label: "MBA" },
                      { value: "CA", label: "CA" },
                    ]}
                    value={formData.highestQualification.map((mode) => ({
                      value: mode,
                      label: mode,
                    }))}
                    onChange={(selectedOptions, { action, option }) => {
                      const workModes = selectedOptions.map(
                        (option) => option.value
                      );
                      setFormData((prev) => ({
                        ...prev,
                        highestQualification: workModes,
                      }));

                      // Close dropdown after selection
                      document.activeElement.blur();
                    }}
                    styles={customStyles}
                    placeholder="Select qualifications..."
                    closeMenuOnSelect={true}
                    required
                  />
                </div>
              </Box>
              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" },
                  p: 2,
                }}
              >
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Current Designation <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="currentDesignation"
                    value={formData.currentDesignation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Current Salary (INR Lakhs){" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    min={1}
                    max={1000}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                    required
                  />

                  {SalErr.salary && (
                    <p className="mt-1 ml-1 text-sm text-red-600" role="alert">
                      {SalErr.salary}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Are you open to relocation ?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  {/* Radio Buttons */}
                  <label className="flex items-center gap-2 ml-2 mb-2">
                    <input
                      type="radio"
                      name="openToRelocate"
                      value="Yes"
                      checked={formData.openToRelocate === "Yes"}
                      onChange={handleChange}
                      className="accent-blue-500"
                    />
                    <span
                      style={{
                        color: "#24252C",
                        fontFamily: "Satoshi",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      Yes
                    </span>
                  </label>

                  <label className="flex items-center gap-2 ml-2">
                    <input
                      type="radio"
                      name="openToRelocate"
                      value="No"
                      checked={formData.openToRelocate === "No"}
                      onChange={handleChange}
                      className="accent-blue-500"
                    />
                    <span
                      style={{
                        color: "#24252C",
                        fontFamily: "Satoshi",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      No
                    </span>
                  </label>
                </div>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* --- Experience History --- */}
        {formData.experienceHistory.length > 0 && (
          <Box mt={3} sx={{ px: 18, pb: 2 }}>
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Your Entries:
            </Typography>

            {formData.experienceHistory.map((e, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "#F9FAFB",
                  borderRadius: 2,
                  p: 2,
                  mb: 1,
                }}
              >
                <Box>
                  <Typography sx={{ fontFamily: "Satoshi", fontWeight: 500 }}>
                    {e.designation} at {e.companyName}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: 12,
                      color: "#6B7280",
                    }}
                  >
                    {e.from} — {e.to}
                  </Typography>
                  {e.description && (
                    <Typography
                      sx={{ fontFamily: "Poppins", fontSize: 12, mt: 0.5 }}
                    >
                      {e.description}
                    </Typography>
                  )}
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteExperience(i)}
                  sx={{ color: "#EF4444" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* --- Experience History (styled like Consulting Background) --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              border: "1px solid #0000004D",
              borderRadius: 4,
              width: { xs: "100%", sm: "100%", lg: "80%", md: "80%" },
              flexDirection: "column",
            }}
          >
            {/* Section Heading */}
            <Typography
              sx={{
                color: "#24252C",
                fontFamily: "Satoshi",
                fontWeight: 700,
                p: 2,
                fontSize: "20px",
              }}
            >
              Experience History
            </Typography>

            {/* Form Rows */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                justifyContent: { lg: "space-between" },
                width: "100%",
              }}
            >
              {/* Left Column */}
              <Box sx={{ width: { xs: "100%", lg: "48%" }, p: 2 }}>
                <div className="mb-6">
                  <label
                    className="block mb-2 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Company Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="expCompanyName"
                    value={formData.expCompanyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                  />
                  {expErrors.companyName && (
                    <Typography
                      sx={{
                        color: "red",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        mt: 0.5,
                        ml: 2,
                      }}
                    >
                      {expErrors.companyName}
                    </Typography>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    className="block mb-2 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    From <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="month"
                    name="expFrom"
                    value={formData.expFrom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                  />
                  {expErrors.from && (
                    <Typography
                      sx={{
                        color: "red",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        mt: 0.5,
                        ml: 2,
                      }}
                    >
                      {expErrors.from}
                    </Typography>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    className="block mb-2 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    name="expDescription"
                    value={formData.expDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    style={{ borderRadius: 16, border: "1px solid #24252C" }}
                  />
                </div>
              </Box>

              {/* Right Column */}
              <Box sx={{ width: { xs: "100%", lg: "48%" }, p: 2 }}>
                <div className="mb-6">
                  <label
                    className="block mb-2 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Designation <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="expDesignation"
                    value={formData.expDesignation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                  />
                  {expErrors.designation && (
                    <Typography
                      sx={{
                        color: "red",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        mt: 0.5,
                        ml: 2,
                      }}
                    >
                      {expErrors.designation}
                    </Typography>
                  )}
                </div>
                <div className="mb-6">
                  <label
                    className="block mb-2 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    To <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="month"
                    name="expTo"
                    value={formData.expTo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                  />
                  {expErrors.to && (
                    <Typography
                      sx={{
                        color: "red",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        mt: 0.5,
                        ml: 2,
                      }}
                    >
                      {expErrors.to}
                    </Typography>
                  )}
                </div>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    px: 2,
                    pt: 2,
                  }}
                >
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 sm:px-10 md:px-16  sm:w-auto rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    onClick={handleAddExperience}
                    sx={{ textTransform: "none" }}
                  >
                    Add Experience
                  </button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/*Education List */}
        {formData.educationDetails.length > 0 && (
          <Box mt={3} sx={{ px: 18, pb: 2 }}>
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Your Entries:
            </Typography>

            {formData.educationDetails.map((edu, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "#F9FAFB",
                  borderRadius: 2,
                  p: 2,
                  mb: 1,
                }}
              >
                <Box>
                  <Typography sx={{ fontFamily: "Satoshi", fontWeight: 500 }}>
                    {edu.course} in {edu.specialization} at {edu.institute}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: 12,
                      color: "#6B7280",
                    }}
                  >
                    {edu.from} — {edu.to}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      educationDetails: prev.educationDetails.filter(
                        (_, idx) => idx !== i
                      ),
                    }))
                  }
                  sx={{ color: "#EF4444" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Education Details Section */}
        {/* --- Education Details --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              border: "1px solid #0000004D",
              borderRadius: 4,
              width: { xs: "100%", sm: "100%", lg: "80%", md: "80%" },
              flexDirection: "column",
            }}
          >
            {/* Section Heading */}
            <Typography
              sx={{
                color: "#24252C",
                fontFamily: "Satoshi",
                fontWeight: 700,
                p: 2,
                fontSize: "20px",
              }}
            >
              Education Details
            </Typography>

            {/* Form Rows */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                justifyContent: { lg: "space-between" },
                width: "100%",
              }}
            >
              {/* Left Column */}
              <Box sx={{ width: { xs: "100%", lg: "48%" }, p: 2 }}>
                <div className="mb-6">
                  <label
                    className="block mb-2 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Institute Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="educationInstitute"
                    value={formData.educationInstitute}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                  />
                  {eduErrors.institute && (
                    <Typography
                      sx={{
                        color: "red",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        mt: 0.5,
                        ml: 2,
                      }}
                    >
                      {eduErrors.institute}
                    </Typography>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    className="block mb-2 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Start Year <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="month"
                    name="educationStart"
                    value={formData.educationStart}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                  />
                   {eduErrors.from && (
                    <Typography
                      sx={{
                        color: "red",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        mt: 0.5,
                        ml: 2,
                      }}
                    >
                      {eduErrors.from}
                    </Typography>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    className="block mb-2 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="educationSpecialization"
                    value={formData.educationSpecialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                  />
                  {eduErrors.specialization && (
                    <Typography
                      sx={{
                        color: "red",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        mt: 0.5,
                        ml: 2,
                      }}
                    >
                      {eduErrors.specialization}
                    </Typography>
                  )}
                </div>
              </Box>

              {/* Right Column */}
              <Box sx={{ width: { xs: "100%", lg: "48%" }, p: 2 }}>

                

                <div className="mb-6">
                  <label
                    className="block mb-2 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Course Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="educationCourse"
                    value={formData.educationCourse}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                  />
                  {eduErrors.course && (
                    <Typography
                      sx={{
                        color: "red",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        mt: 0.5,
                        ml: 2,
                      }}
                    >
                      {eduErrors.course}
                    </Typography>
                  )}
                </div>                

                <div className="mb-6">
                  <label
                    className="block mb-2 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    End Year <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="month"
                    name="educationEnd"
                    value={formData.educationEnd}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                  />
                  {eduErrors.to && (
                    <Typography
                      sx={{
                        color: "red",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        mt: 0.5,
                        ml: 2,
                      }}
                    >
                      {eduErrors.to}
                    </Typography>
                  )}
                </div>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    px: 2,
                    pt: 2,
                  }}
                >
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 sm:px-10 md:px-16  sm:w-auto rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    onClick={handleAddEducation}
                  >
                    Add Education
                  </button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Consulting Questions */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              border: "1px solid #0000004D",
              borderRadius: 4,
              width: { xs: "100%", sm: "100%", lg: "80%", md: "80%" },
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                color: "#24252C",
                fontFamily: "Satoshi",
                fontWeight: 700,
                p: 2,
                fontSize: "20px",
              }}
            >
              Consulting Background
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                  sm: "center",
                  lg: "space-between",
                  md: "space-between",
                },
                flexDirection: {
                  xs: "column",
                  sm: "column",
                  lg: "row",
                  md: "row",
                },
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" },
                  p: 2,
                }}
              >
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Do you have a Consulting Background?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  {/* Radio Buttons */}
                  <label className="flex items-center gap-2 ml-2 mb-2">
                    <input
                      type="radio"
                      name="hasConsultingBackground"
                      value="Yes"
                      checked={formData.hasConsultingBackground === "Yes"}
                      onChange={handleChange}
                      className="accent-blue-500"
                    />
                    <span
                      style={{
                        color: "#24252C",
                        fontFamily: "Satoshi",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      Yes
                    </span>
                  </label>

                  <label className="flex items-center gap-2 ml-2">
                    <input
                      type="radio"
                      name="hasConsultingBackground"
                      value="No"
                      checked={formData.hasConsultingBackground === "No"}
                      onChange={handleChange}
                      className="accent-blue-500"
                    />
                    <span
                      style={{
                        color: "#24252C",
                        fontFamily: "Satoshi",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      No
                    </span>
                  </label>
                </div>
                {formData.hasConsultingBackground === "Yes" && (
                  <div className="mb-6">
                    <label
                      className="block mb-4 ml-2"
                      style={{
                        fontFamily: "Satoshi",
                        fontWeight: 500,
                        fontSize: "16px",
                        color: "#24252C",
                      }}
                    >
                      When did you first join Consulting?{" "}
                    </label>
                    <select
                      name="joinConsulting"
                      value={formData.joinConsulting}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      style={{ borderRadius: 50, border: "1px solid #24252C" }}
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="Lateral">Lateral</option>
                      <option value="Out of campus">Out of Campus</option>
                    </select>
                  </div>
                )}
              </Box>

              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" },
                  p: 2,
                }}
              >
                {formData.hasConsultingBackground === "Yes" && (
                  <>
                    <div className="mb-6">
                      <label
                        className="block mb-4 ml-2"
                        style={{
                          fontFamily: "Satoshi",
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "#24252C",
                        }}
                      >
                        Last/Current Consulting Company{" "}
                      </label>
                      <select
                        name="lastConsultingCompany"
                        value={formData.lastConsultingCompany}
                        onChange={handlelastCompanyChange}
                        className="w-full px-4 py-3 pr-12 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        style={{
                          borderRadius: 50,
                          border: "1px solid #24252C",
                        }}
                      >
                        <option value="">Select your Company</option>
                        <option value="McKinsey & Company">
                          McKinsey & Company
                        </option>
                        <option value="Boston Consulting Group">
                          Boston Consulting Group
                        </option>
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
                        <option value="Capgemini E.L.I.T.E.">
                          Capgemini E.L.I.T.E.
                        </option>
                        <option value="ZS Associates">ZS Associates</option>
                        <option value="Roland Berger">Roland Berger</option>
                        <option value="Alvarez & Marsal">
                          Alvarez & Marsal
                        </option>
                        <option value="Parthenon Group">Parthenon Group</option>
                        <option value="Siemens Management Consulting">
                          Siemens Management Consulting
                        </option>
                        <option value="Arthur D. Little">
                          Arthur D. Little
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {formData.lastConsultingCompany === "Other" && (
                      <div className="mb-6">
                        <label
                          className="block text-gray-700 text-sm font-semibold mb-4 ml-2"
                          style={{
                            fontFamily: "Satoshi",
                            fontWeight: 500,
                            fontSize: "16px",
                            color: "#24252C",
                          }}
                        >
                          Other Company Name
                        </label>
                        <input
                          type="text"
                          name="lastConsultingCompany"
                          value={formData.lastConsultingCustomCompany}
                          onChange={handlelastCustomCompanyChange}
                          placeholder="Please Specify Company name...."
                          className="w-full px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{
                            borderRadius: 50,
                            border: "1px solid #24252C",
                          }}
                        />
                      </div>
                    )}

                    <div className="mb-6 mt-9">
                      <label
                        className="block mb-4 ml-2"
                        style={{
                          fontFamily: "Satoshi",
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "#24252C",
                        }}
                      >
                        Total Experience in Consulting{" "}
                      </label>
                      <select
                        name="totalYearsInConsulting"
                        value={formData.totalYearsInConsulting}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-12 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        style={{
                          borderRadius: 50,
                          border: "1px solid #24252C",
                        }}
                        required
                      >
                        <option value="">Select experience</option>
                        {Array.from({ length: 15 }, (_, i) => (
                          <option key={i + 1} value={(i + 1).toString()}>{`${
                            i + 1
                          }+`}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              border: "1px solid #0000004D",
              borderRadius: 4,
              width: { xs: "100%", sm: "100%", lg: "80%", md: "80%" },
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                color: "#24252C",
                fontFamily: "Satoshi",
                fontWeight: 700,
                p: 2,
                fontSize: "20px",
              }}
            >
              Personal Details
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                  sm: "center",
                  lg: "space-between",
                  md: "space-between",
                },
                flexDirection: {
                  xs: "column",
                  sm: "column",
                  lg: "row",
                  md: "row",
                },
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" },
                  p: 2,
                }}
              >
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Mobile Number <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="rounded-lg">
                    <PhoneInput
                      defaultCountry="IN"
                      value={phoneValue}
                      onChange={handlePhoneNumberChange}
                      maxLength={15}
                      required
                      className="rounded-full px-4 py-2.5 border w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderRadius: 50, border: "1px solid #24252C" }}
                    />

                    {error && (
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    LinkedIn Profile Link{" "}
                    <span style={{ color: "grey" }}>
                      (link starting with https)
                    </span>
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="url"
                    name="linkedinLink"
                    value={formData.linkedinLink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Upload Profile Picture
                  </label>

                  {/* Dropzone Container */}
                  <Box sx={{ px: 1 }}>
                    <div
                      className="w-full border-2 border-dashed border-black rounded-lg px-6 py-12 text-center cursor-pointer hover:bg-blue-50 transition"
                      onClick={() =>
                        document.getElementById("profilePic").click()
                      }
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleProfilePicUpload({
                          target: { files: e.dataTransfer.files },
                        });
                      }}
                      style={{ borderRadius: 16 }}
                    >
                      <input
                        type="file"
                        id="profilePic"
                        name="profilePic"
                        accept="image/jpeg, image/jpg, image/png"
                        onChange={handleProfilePicUpload}
                        className="hidden"
                      />

                      <p
                        className="text-gray-500"
                        style={{
                          color: "#808195",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                        }}
                      >
                        Drag and Drop your image or
                      </p>
                      <Button
                        sx={{
                          px: 2,
                          py: 1,
                          border: 2,
                          color: "#3C7EFC",
                          textTransform: "none",
                          mt: 2,
                          borderRadius: 16,
                        }}
                      >
                        <span
                          style={{
                            color: "#24252C",
                            fontWeight: "700",
                            fontFamily: "Satoshi",
                          }}
                        >
                          Choose an image
                        </span>
                      </Button>

                      {uploadingProfilePic && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                          <div className="bg-blue-600 h-2.5 rounded-full animate-pulse"></div>
                        </div>
                      )}

                      {profilePic && (
                        <div className="mt-4">
                          <p
                            className="text-gray-500"
                            style={{
                              color: "#808195",
                              fontFamily: "Poppins",
                              fontSize: "14px",
                            }}
                          >
                            Preview
                          </p>
                          <img
                            src={profilePic}
                            alt="Profile Preview"
                            className="w-32 h-32 rounded-full object-cover mt-2 mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  </Box>
                </div>
              </Box>
              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" },
                  p: 2,
                }}
              >
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Date of Birth <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Current Location <span style={{ color: "red" }}>*</span>
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
                    noOptionsMessage={() =>
                      inputValue
                        ? "No matching cities found"
                        : "Start typing to search"
                    }
                    required // Required based on *
                    name="location"
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    About You
                  </label>{" "}
                  <Box sx={{ px: 2 }}>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      placeholder="Add a short summary about yourself"
                      className="w-full text-sm outline-none resize-none h-44"
                      required
                      style={{
                        borderRadius: 16,
                        border: "2px dashed #24252C",
                        textAlign: "center", // horizontally centers text
                        padding: "1rem", // vertical space to push text downward
                        backgroundColor: "transparent",
                      }}
                    />
                  </Box>
                </div>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Add this after the Personal Details section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              border: "1px solid #0000004D",
              borderRadius: 4,
              width: { xs: "100%", sm: "100%", lg: "80%", md: "80%" },
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                color: "#24252C",
                fontFamily: "Satoshi",
                fontWeight: 700,
                p: 2,
                fontSize: "20px",
              }}
            >
              Preferences
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                  sm: "center",
                  lg: "space-between",
                  md: "space-between",
                },
                flexDirection: {
                  xs: "column",
                  sm: "column",
                  lg: "row",
                  md: "row",
                },
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" },
                  p: 2,
                }}
              >
                {/* Expected Minimum Salary */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Expected Minimum Salary (INR Lakhs){" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="expectedMinSalary"
                    value={formData.expectedMinSalary}
                    min={1}
                    max={1000}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 50, border: "1px solid #24252C" }}
                    required
                  />
                  {MSalErr.salary && (
                    <p className="mt-1 ml-1 text-sm text-red-600" role="alert">
                      {MSalErr.salary}
                    </p>
                  )}
                </div>

                {/* Preferred Work Types (Multi-select) */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Preferred Work Type <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    isMulti
                    options={[
                      { value: "Full-Time", label: "Full-Time" },
                      { value: "Part-Time", label: "Part-Time" },
                      { value: "Contract", label: "Contract" },
                      { value: "Temporary", label: "Temporary" },
                    ]}
                    value={formData.preferredWorkTypes.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    onChange={(selectedOptions, { action, option }) => {
                      const workTypes = selectedOptions.map(
                        (option) => option.value
                      );
                      setFormData((prev) => ({
                        ...prev,
                        preferredWorkTypes: workTypes,
                      }));

                      // Close dropdown after selection
                      document.activeElement.blur();
                    }}
                    styles={customStyles}
                    placeholder="Select work type..."
                    closeMenuOnSelect={true}
                    required
                  />
                </div>
              </Box>

              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" },
                  p: 2,
                }}
              >
                {/* Preferred Locations (Multi-select with exactly 5) */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Preferred Locations (Select exactly 5){" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    isMulti
                    options={cities.map((city) => ({
                      value: city,
                      label: city,
                    }))}
                    value={formData.preferredLocations.map((loc) => ({
                      value: loc,
                      label: loc,
                    }))}
                    onChange={(selectedOptions, { action, option }) => {
                      // Check if user is trying to add a 6th option
                      if (selectedOptions.length > 5) {
                        // Show error message only when attempting to exceed limit
                        alert("You can select a maximum of 5 locations");

                        // Keep only the first 5 selections
                        const limitedOptions = selectedOptions.slice(0, 5);
                        setFormData((prev) => ({
                          ...prev,
                          preferredLocations: limitedOptions.map(
                            (option) => option.value
                          ),
                        }));
                      } else {
                        // Update normally if within limit
                        const locations = selectedOptions.map(
                          (option) => option.value
                        );
                        setFormData((prev) => ({
                          ...prev,
                          preferredLocations: locations,
                        }));
                      }

                      // Close dropdown after selection
                      document.activeElement.blur();
                    }}
                    styles={customStyles}
                    placeholder="Select preferred locations..."
                    closeMenuOnSelect={true}
                    required
                    isOptionDisabled={() =>
                      formData.preferredLocations.length >= 5
                    }
                  />
                </div>

                {/* Preferred Work Mode (Multi-select) */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#24252C",
                    }}
                  >
                    Preferred Work Mode <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    isMulti
                    options={[
                      { value: "Remote", label: "Remote" },
                      { value: "Hybrid", label: "Hybrid" },
                      { value: "Work From Office", label: "Work From Office" },
                    ]}
                    value={formData.preferredWorkModes.map((mode) => ({
                      value: mode,
                      label: mode,
                    }))}
                    onChange={(selectedOptions, { action, option }) => {
                      const workModes = selectedOptions.map(
                        (option) => option.value
                      );
                      setFormData((prev) => ({
                        ...prev,
                        preferredWorkModes: workModes,
                      }));

                      // Close dropdown after selection
                      document.activeElement.blur();
                    }}
                    styles={customStyles}
                    placeholder="Select work mode..."
                    closeMenuOnSelect={true}
                    required
                  />
                </div>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              mt: 4,
              width: { xs: "100%", sm: "100%", lg: "90%", md: "90%" },
              mb: 10,
            }}
          >
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 w-full sm:w-auto rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              disabled={loading || uploadingProfilePic}
              style={{ borderRadius: 50 }}
            >
              <span
                style={{
                  color: "white",
                  fontFamily: "Satoshi",
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              >
                {loading ? <Loading /> : "Save Details"}
              </span>
            </button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default UserInfoForm;
