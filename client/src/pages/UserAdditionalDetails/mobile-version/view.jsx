import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../../../utils"; // Assuming this utility is correctly implemented
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Loading } from "../../../components"; // Assuming Loading component exists
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { UpdateUser } from "../../../redux/userSlice"; // Assuming Redux slice is used
import AlertModal from "../../../components/Alerts/view";
import { useDispatch } from "react-redux";
import { skillsList } from "../../../assets/mock"; // Assuming mock data exists
import { Box, Button, Typography } from "@mui/material";
import Image from "../../../assets/CreateAccount/UserDetails.svg"; // Assuming image asset exists
// import { Margin } from "@mui/icons-material"; // Margin import seems unused, removed

const UserInfoForm = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const defaultValues = location.state?.parsedData?.data || {};
  const refer = location.state?.refer || "/find-jobs"; // Default values for editing

  const navigate = useNavigate();

  // --- State Variables ---
  const [loading, setLoading] = useState(false);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [phoneValue, setPhoneValue] = useState(
    defaultValues?.PersonalInformation?.contactNumber || ""
  );
  const [error, setError] = useState(""); // Assuming error state is used elsewhere or can be expanded
  const [profilePic, setProfilePic] = useState(user?.profileUrl || ""); // Preview URL
  const [profilePicUrl, setProfilePicUrl] = useState(user?.profileUrl || ""); // Final URL to submit
  const [cities, setCities] = useState([]);
  const [SalErr, setSalErr] = useState({
    salary: "",
  });
  const [MSalErr, setMSalErr] = useState({
    salary: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });
  const [selectedCity, setSelectedCity] = useState(null);
  const [inputValue, setInputValue] = useState(""); // For city search input
  const [filters, setFilters] = useState({
    // Used for skills, keeping it consistent
    skills: defaultValues.skills || [],
  });

  // Form data state - Holds ALL form data across stages
  const [formData, setFormData] = useState({
    currentCompany: defaultValues?.ProfessionalDetails?.currentCompany || "",
    customCompany: "", // For storing the custom company input temporarily
    currentDesignation:
      defaultValues?.ProfessionalDetails?.currentDesignation || "",
    linkedinLink: defaultValues?.PersonalInformation?.linkedinLink || "",
    experience: defaultValues?.ProfessionalDetails?.noOfYearsExperience
      ? Math.ceil(
          defaultValues?.ProfessionalDetails?.noOfYearsExperience
        ).toString() // Ensure string for select value
      : "",
    about: defaultValues?.ProfessionalDetails?.about || "",
    salary: defaultValues?.ProfessionalDetails?.currentSalary || "", // Added default for salary
    contactNumber: defaultValues?.PersonalInformation?.contactNumber || "",
    location: "",
    openToRelocate: "Yes", // Default to Yes
    // isItConsultingCompany: defaultValues?.ProfessionalDetails?.isItConsultingCompany || "Yes", // This field was in original state but not in UI, removing or clarifying needed. Assuming removed for UI purposes.
    joinConsulting: "",
    dateOfBirth: defaultValues?.PersonalInformation?.dateOfBirth || "",
    profilePic: defaultValues?.PersonalInformation?.profilePic || "",
    skills: filters.skills,
    expectedMinSalary: "", // Added default
    preferredLocations: [], // Added default
    preferredWorkTypes: [], // Default to Full-Time
    preferredWorkModes: [], // Default to Remote
    highestQualification: [], // Default to Bachelors
    lastConsultingCompany: "",
    lastConsultingCustomCompany: "", // For storing the custom consulting company input temporarily
    totalYearsInConsulting: "",
    hasConsultingBackground: "", // Added consulting background Yes/No
  });

  // --- Stage Management State ---
  const [currentStage, setCurrentStage] = useState(0); // Start at the first stage (0)
  const totalStages = 4; // Number of content stages (Work, Personal, Pref, Consulting)

  // --- Effects ---
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

  // Update formData's contactNumber when phoneValue changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, contactNumber: phoneValue }));
  }, [phoneValue]);

  // Update formData's profilePic when profilePicUrl changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, profilePic: profilePicUrl }));
  }, [profilePicUrl]);

  // Update formData's skills when filters.skills changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, skills: filters.skills }));
  }, [filters.skills]);

  // --- Handlers ---
  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setFormData((prev) => ({
      ...prev,
      location: selectedOption?.value || "",
    }));
  };

  // Handle skills change using react-select
  const handleSkillsChange = (selectedOptions) => {
    const selectedSkills = selectedOptions.map((option) => option.value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      skills: selectedSkills,
    }));
    // The useEffect above will update formData based on filters.skills
  };

  // Handle phone number change
  const handlePhoneNumberChange = (value) => {
    setPhoneValue(value || ""); // Update phoneValue state
  };

  // Handle form field changes for standard inputs (text, number, date, select)
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
          setSalErr((prev) => ({ ...prev, salary: "Cannot exceed 1000." }));
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

  // Handle custom company input for Last Consulting Company
  const handlelastCustomCompanyChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      lastConsultingCustomCompany: value, // Store in lastConsultingCustomCompany
    }));
  };

  // Handle company dropdown change for Last Consulting Company
  const handlelastCompanyChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      lastConsultingCompany: value, // Store selected value in lastConsultingCompany
      lastConsultingCustomCompany:
        value === "Other" ? formData.lastConsultingCustomCompany : "", // Keep customCompany if 'Other' is selected again
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
      // Create form data for upload
      const uploadFormData = new FormData(); // Use a new FormData object for the upload
      uploadFormData.append("profilePic", file);

      // Upload to server
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/upload-image",
        uploadFormData, // Use the upload specific FormData
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.success) {
        setProfilePicUrl(response.data.url); // Set the URL received from the backend
        setProfilePic(URL.createObjectURL(file)); // Set the local preview URL
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
      setProfilePic(user?.profileUrl || ""); // Revert preview on error
      setProfilePicUrl(user?.profileUrl || ""); // Revert URL on error
    } finally {
      setUploadingProfilePic(false);
    }
  };

  // Handle form submission - Called only on the final stage's submit button click
  const handleSubmit = async (e) => {
    // Prevent default browser submission to handle it manually after validation
    e.preventDefault();

    // Check validity for the final stage before proceeding with API call
    const form = e.target;
    if (!form.checkValidity()) {
      // Browser will show validation messages. We don't need a custom alert here on submit.
      console.log("Final stage validation failed.");
      return;
    }

    const finalConsultingCompany =
      formData.hasConsultingBackground === "Yes" &&
      formData.lastConsultingCompany === "Other"
        ? formData.lastConsultingCustomCompany
        : formData.lastConsultingCompany;

    const updatedFormData = {
      ...formData,
      lastConsultingCompany: finalConsultingCompany, // Use custom location if 'Other' was selected
      experience: Number(formData.experience), // Convert experience to number
      salary: Number(formData.salary), // Convert salary to number
      expectedMinSalary: Number(formData.expectedMinSalary), // Convert salary to number
      contactNumber: phoneValue, // Use the state from PhoneInput
      profilePic: profilePicUrl, // Use the uploaded profile pic URL
      skills: filters.skills, // Use skills from filters state (which is kept in sync with formData)
      // Ensure preferred arrays are not empty if required by backend - Validation handles the "at least one" part now
      preferredWorkTypes: formData.preferredWorkTypes,
      preferredWorkModes: formData.preferredWorkModes,
      highestQualification: formData.highestQualification,
      // Add other consulting fields if present in formData
      hasConsultingBackground: formData.hasConsultingBackground,
      joinConsulting:
        formData.hasConsultingBackground === "Yes"
          ? formData.joinConsulting
          : "",
      totalYearsInConsulting:
        formData.hasConsultingBackground === "Yes"
          ? Number(formData.totalYearsInConsulting)
          : 0, // Convert to number if Yes, else 0
    };

    // Remove temporary custom fields before submission
    delete updatedFormData.customCompany;
    delete updatedFormData.lastConsultingCustomCompany; // Remove temporary field

    console.log("Submitting form data:", updatedFormData); // Log data being sent

    setLoading(true);

    try {
      const res = await apiRequest({
        url: "/user/update-user", // Ensure this URL is correct based on your apiRequest utility
        method: "PUT",
        data: updatedFormData,
        token: user?.token,
      });

      if (res?.success) {
        // Check for success property in the response
        setAlert({
          open: true,
          type: "success",
          title: "Success",
          message: "Profile updated successfully...",
        });
        console.log("res", res);
        dispatch(UpdateUser(res.user)); // Assuming the response contains the updated user object
        setTimeout(() => {
          navigate(refer); // Navigate after successful update
        }, 2000);
      } else {
        // Handle backend validation errors or specific messages
        const errorMessage = res?.message || "Update failed. Please try again.";
        setError(errorMessage); // Set error state to display
        setAlert({
          open: true,
          type: "error",
          title: "Error",
          message: "Some error occurred. Please try again.",
        });
        console.error("API Error:", res);
        // Optionally stay on the current stage or navigate back
      }
    } catch (error) {
      console.error("Form submission error:", error);
      const apiErrorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred during submission.";
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to update Details.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Next button click with validation
  const handleNext = (event) => {
    // Prevent default button click action
    event.preventDefault();
    const form = event.currentTarget.form;

    // Check validity for the current stage
    // We can't use form.checkValidity() alone because it checks the whole form,
    // even invisible fields. We need to find elements within the current stage.
    // A simpler approach that adheres to "no UI change" is to let the browser's
    // validation UI trigger, which checkValidity() does, and *only* advance
    // the stage if it returns true. The browser's default message *is* the message.
    // The user might perceive "Please fill out this field" as the required message.

    // Trigger HTML5 validation for currently visible fields
    if (form.checkValidity()) {
      // If valid, move to the next stage
      setCurrentStage((prev) => prev + 1);
      // Optional: Scroll to the top of the form or stage for better UX
      // form.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If validation fails, the browser will automatically highlight
      // the invalid fields and show default validation messages
      // (e.g., "Please fill out this field").
      // We don't need a separate alert here as per the instruction
      // to not change the UI/styling, the browser's UI is the default.
      console.log(
        "Validation failed for current stage. Browser will show messages."
      );
      // Find the first invalid element and focus it for better UX
      const firstInvalidElement = form.querySelector(":invalid");
      if (firstInvalidElement) {
        firstInvalidElement.focus();
      }
    }
  };

  // --- Styles ---
  // Custom styles for React-Select components - Reverted to match original snippet
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: 4, // Reverted to 4 as in original
      width: "100%",
      fontSize: "0.875rem",
      borderRadius: 50,
      border: "1px solid #24252C", // Reverted to 1px solid #24252C as in original
      boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none", // Reverted ring effect
      "&:hover": {
        borderColor: "#d1d5db",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      paddingLeft: 16, // Reverted to 16 as in original
      paddingRight: 16, // Reverted to 16 as in original
    }),
    menu: (provided) => ({
      ...provided,
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      border: "1px solid #d1d5db",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : "white", // Reverted hover/focus color logic
      color: state.isSelected ? "white" : "black", // Reverted text color logic
      "&:hover": {
        backgroundColor: "#f3f4f6", // Reverted hover background
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#e0e7ff", // Keep from last version for better appearance
      borderRadius: 20,
      padding: "2px 8px",
      margin: "2px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#24252C", // Keep from last version for better appearance
      fontSize: "0.875rem",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#24252C", // Keep from last version for better appearance
      cursor: "pointer",
      "&:hover": {
        color: "#ef4444",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#808195", // Keep from last version for better appearance
      fontSize: "0.875rem",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      paddingLeft: 0,
      paddingRight: 8,
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
  };

  // Common styles for the main Box containers around each stage section - Reverted to match original snippet
  const stageBoxStyles = {
    display: "flex",
    borderRadius: 4, // Reverted border-radius
    width: { xs: "100%", sm: "100%", lg: "80%", md: "80%" },
    flexDirection: "column",
    mx: "auto",
    mt: 4,
  };

  // Common styles for the title Typography - Reverted to match original snippet
  const titleStyles = {
    color: "#24252C",
    fontFamily: "Satoshi",
    fontWeight: 700,
    p: 1, // Reverted padding
    fontSize: "24px", // Reverted font size
  };

  // Common styles for the inner Box row holding the two columns of fields - Match original
  const innerRowStyles = {
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
  };

  // Common styles for the column Box holding form fields within the row - Match original
  const columnStyles = {
    width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" },
    mt: 1,
    p: 1, // Reverted padding
  };

  // Input/Select/Textarea shared base styles - Derived from original classes
  const baseInputStyles = {
    width: "100%",
    fontSize: "0.875rem", // text-sm
    outline: "none", // focus:outline-none
  };

  // Styles for inputs/selects with rounded-full and border
  const roundedInputStyles = {
    ...baseInputStyles,
    borderRadius: 50, // rounded-full
    border: "1px solid #24252C", // border + border-#24252C
    padding: "12px 18px", // px-4 py-3 (roughly)
    // Added specific style for select appearance
    " select&": {
      // Apply only to <select> elements using this style object
      appearance: "none", // appearance-none
      paddingRight: "calc(18px + 1.5rem)", // Add space for the default arrow if browser adds one
    },
    // Added ring/border color on focus to match original Tailwind focus styles
    "&:focus": {
      borderColor: "#3b82f6", // focus:ring-blue-500 -> border-blue-500
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)", // focus:ring-2 focus:ring-blue-500
    },
  };

  const roundedSelectStyles = {
    ...baseInputStyles,
    borderRadius: 50, // full pill shape
    border: "1px solid #24252C", // custom border color
    padding: "12px 18px", // vertical + horizontal padding
    appearance: "none", // remove native styling
    WebkitAppearance: "none", // for Safari
    MozAppearance: "none", // for Firefox

    backgroundRepeat: "no-repeat",
    backgroundSize: "6px 6px",
    backgroundPosition: "right 16px center", // adjust arrow position

    // ensure text never runs under the arrow
    paddingRight: "2.5rem",

    // focus state styling
    "&:focus": {
      borderColor: "#3b82f6", // blue border
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)", // blue ring
      outline: "none",
    },
  };

  // Styles for custom city input (rounded-lg, px-4 py-2 border)
  const customCityInputStyles = {
    ...baseInputStyles,
    borderRadius: 8, // rounded-lg
    border: "1px solid #24252C", // border
    padding: "8px 18px", // px-4 py-2 (roughly)
    // Added ring/border color on focus
    "&:focus": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
    },
  };

  // Styles for About You textarea (rounded-lg px-6 py-12, dashed border, text-center)
  const aboutTextareaStyles = {
    ...baseInputStyles,
    borderRadius: 16, // Reverted to 16 based on original px
    border: "2px dashed #24252C", // border-2 border-dashed border-black
    textAlign: "center", // text-center
    padding: "48px 24px", // px-6 py-12 (roughly)
    height: "11rem", // h-44
    resize: "none", // resize-none
    // Added ring/border color on focus
    "&:focus": {
      borderColor: "#3b82f6", // Or maybe '#24252C' depending on desired focus style for dashed border? Let's keep blue ring for consistency.
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
    },
  };

  // Prepare city options with "Other" at the bottom
  const filteredCities = [
    ...cities
      .filter((city) => city.toLowerCase().includes(inputValue.toLowerCase()))
      .map((city) => ({ value: city, label: city })),
    { value: "Other", label: "Other" },
  ];

  // --- Conditional Rendering of Stages ---
  const renderStage = () => {
    switch (currentStage) {
      case 0: // Work Details
        return (
          <Box sx={stageBoxStyles}>
            <Typography sx={titleStyles}>Work Details</Typography>
            <Box sx={innerRowStyles}>
              <Box sx={columnStyles}>
                {/* Current Company */}
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
                {/* Experience */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
                      color: "#24252C",
                    }}
                  >
                    Experience <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    name="experience"
                    options={[
                      { value: "", label: "Select experience" },
                      ...Array.from({ length: 15 }, (_, i) => {
                        const val = (i + 1).toString();
                        return { value: val, label: `${val}+` };
                      }),
                    ]}
                    value={
                      formData.experience
                        ? {
                            value: formData.experience,
                            label: `${formData.experience}+`,
                          }
                        : { value: "", label: "Select experience" }
                    }
                    onChange={(option) =>
                      handleChange({
                        target: {
                          name: "experience",
                          value: option ? option.value : "",
                        },
                      })
                    }
                    styles={customStyles}
                    placeholder="Select experience"
                    isClearable={false}
                  />
                </div>
                {/* Skills */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
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
                      // Use filters.skills for select value
                      value: skill,
                      label: skill,
                    }))}
                    onChange={handleSkillsChange} // Update filters state
                    styles={customStyles} // Use customStyles for React-Select
                    placeholder="Select or type skills..."
                    required // Required based on *
                    name="skills"
                  />
                </div>
                {/* Educational Qualifications */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
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
                    value={formData.highestQualification.map((qual) => ({
                      // Use formData for value
                      value: qual,
                      label: qual,
                    }))}
                    onChange={(selectedOptions) => {
                      // Update formData directly
                      const qualifications = selectedOptions.map(
                        (option) => option.value
                      );
                      setFormData((prev) => ({
                        ...prev,
                        highestQualification: qualifications,
                      }));
                    }}
                    styles={customStyles} // Use customStyles for React-Select
                    placeholder="Select qualifications..."
                    closeMenuOnSelect={false} // Keep menu open for multi-select
                    required // Required based on *
                    name="highestQualification"
                  />
                </div>
              </Box>
              <Box sx={columnStyles}>
                {/* Current Designation */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
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
                    style={roundedInputStyles} // Apply rounded styles
                    required // Required based on *
                  />
                </div>
                {/* Current Salary */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
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
                {/* Open to Relocation */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
                      color: "#24252C",
                    }}
                  >
                    Are you open to relocation ?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  {/* Radio Buttons */}
                  {/* Add 'required' to at least one radio button in the group */}
                  <label className="flex items-center gap-2 ml-2 mb-2">
                    <input
                      type="radio"
                      name="openToRelocate"
                      value="Yes"
                      checked={formData.openToRelocate === "Yes"}
                      onChange={handleChange}
                      className="accent-blue-500"
                      required // Required based on *
                    />
                    <span
                      style={{
                        color: "#24252C",
                        fontFamily: "Satoshi",
                        fontWeight: 500,
                        fontSize: "18px", // Reverted font size
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
                      // The 'required' attribute on one radio makes the group required
                    />
                    <span
                      style={{
                        color: "#24252C",
                        fontFamily: "Satoshi",
                        fontWeight: 500,
                        fontSize: "18px", // Reverted font size
                      }}
                    >
                      No
                    </span>
                  </label>
                </div>
              </Box>
            </Box>
          </Box>
        );

      case 1: // Consulting Background
        return (
          <Box sx={stageBoxStyles}>
            <Typography sx={titleStyles}>Consulting Background</Typography>
            <Box sx={innerRowStyles}>
              <Box sx={columnStyles}>
                {/* Do you have a Consulting Background? */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
                      color: "#24252C",
                    }}
                  >
                    Do you have a Consulting Background?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  {/* Radio Buttons */}
                  {/* Add 'required' to at least one radio button in the group */}
                  <label className="flex items-center gap-2 ml-2 mb-2">
                    <input
                      type="radio"
                      name="hasConsultingBackground"
                      value="Yes"
                      checked={formData.hasConsultingBackground === "Yes"}
                      onChange={handleChange}
                      className="accent-blue-500"
                      required // Required based on *
                    />
                    <span
                      style={{
                        color: "#24252C",
                        fontFamily: "Satoshi",
                        fontWeight: 500,
                        fontSize: "18px", // Reverted font size
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
                      // The 'required' attribute on one radio makes the group required
                    />
                    <span
                      style={{
                        color: "#24252C",
                        fontFamily: "Satoshi",
                        fontWeight: 500,
                        fontSize: "18px", // Reverted font size
                      }}
                    >
                      No
                    </span>
                  </label>
                </div>

                {/* When did you first join Consulting? (Conditional, NOT required) */}
                {formData.hasConsultingBackground === "Yes" && (
                  <div className="mb-1">
                    <label
                      className="block mb-4 ml-2"
                      style={{
                        fontFamily: "Satoshi",
                        fontWeight: 500,
                        fontSize: "18px", // Reverted font size
                        color: "#24252C",
                      }}
                    >
                      When did you first join Consulting? {/* No * */}
                    </label>
                    <Select
                      name="joinConsulting"
                      options={[
                        { value: "", label: "Select an option" },
                        { value: "Lateral", label: "Lateral" },
                        { value: "Out of campus", label: "Out of Campus" },
                      ]}
                      value={
                        formData.joinConsulting
                          ? {
                              value: formData.joinConsulting,
                              label: formData.joinConsulting,
                            }
                          : { value: "", label: "Select an option" }
                      }
                      onChange={(option) =>
                        handleChange({
                          target: {
                            name: "joinConsulting",
                            value: option ? option.value : "",
                          },
                        })
                      }
                      styles={customStyles}
                      placeholder="Select an option"
                      isClearable={false}
                    />
                  </div>
                )}
              </Box>
              <Box sx={columnStyles}>
                {/* Last/Current Consulting Company (Conditional, NOT required) */}
                {formData.hasConsultingBackground === "Yes" && (
                  <>
                    <div className="mb-1">
                      <label
                        className="block mb-4 ml-2"
                        style={{
                          fontFamily: "Satoshi",
                          fontWeight: 500,
                          fontSize: "18px", // Reverted font size
                          color: "#24252C",
                        }}
                      >
                        Last/Current Consulting Company {/* No * */}
                      </label>
                      <Select
                        name="lastConsultingCompany"
                        options={[
                          { value: "", label: "Select your Company" },
                          {
                            value: "McKinsey & Company",
                            label: "McKinsey & Company",
                          },
                          {
                            value: "Boston Consulting Group",
                            label: "Boston Consulting Group",
                          },
                          { value: "Bain & Company", label: "Bain & Company" },
                          { value: "Deloitte", label: "Deloitte" },
                          { value: "Accenture", label: "Accenture" },
                          { value: "Kearney", label: "Kearney" },
                          { value: "EY", label: "EY" },
                          { value: "PwC", label: "PwC" },
                          { value: "KPMG", label: "KPMG" },
                          { value: "TSMG", label: "TSMG" },
                          { value: "Strategy&", label: "Strategy&" },
                          { value: "Oliver Wyman", label: "Oliver Wyman" },
                          { value: "IBM", label: "IBM" },
                          {
                            value: "Capgemini E.L.I.T.E.",
                            label: "Capgemini E.L.I.T.E.",
                          },
                          { value: "ZS Associates", label: "ZS Associates" },
                          { value: "Roland Berger", label: "Roland Berger" },
                          {
                            value: "Alvarez & Marsal",
                            label: "Alvarez & Marsal",
                          },
                          {
                            value: "Parthenon Group",
                            label: "Parthenon Group",
                          },
                          {
                            value: "Siemens Management Consulting",
                            label: "Siemens Management Consulting",
                          },
                          {
                            value: "Arthur D. Little",
                            label: "Arthur D. Little",
                          },
                          { value: "Other", label: "Other" },
                        ]}
                        value={
                          formData.lastConsultingCompany
                            ? {
                                value: formData.lastConsultingCompany,
                                label: formData.lastConsultingCompany,
                              }
                            : { value: "", label: "Select your Company" }
                        }
                        onChange={(option) =>
                          handlelastCompanyChange({
                            target: {
                              name: "lastConsultingCompany",
                              value: option ? option.value : "",
                            },
                          })
                        }
                        styles={customStyles}
                        placeholder="Select your Company"
                        isClearable={false}
                      />
                    </div>
                    {/* Custom Last Consulting Company input if "Other" is selected (Conditional, NOT required) */}
                    {formData.lastConsultingCompany === "Other" && (
                      <div className="mb-1">
                        <label
                          className="block text-gray-700 text-sm font-semibold mb-4 ml-2"
                          style={{
                            fontFamily: "Satoshi",
                            fontWeight: 500,
                            fontSize: "18px", // Reverted font size
                            color: "#24252C",
                          }}
                        >
                          Other Consulting Company Name {/* No * */}
                        </label>
                        <input
                          type="text"
                          name="lastConsultingCustomCompany" // Note: Use lastConsultingCustomCompany state
                          value={formData.lastConsultingCustomCompany}
                          onChange={handlelastCustomCompanyChange}
                          placeholder="Please Specify Company name...."
                          style={roundedInputStyles} // Apply rounded styles
                          // Not required
                        />
                      </div>
                    )}
                    {/* Total Experience in Consulting (Conditional, NOT required) */}
                    <div className="mb-6 mt-9">
                      {" "}
                      {/* Kept mt-9 for spacing */}
                      <label
                        className="block mb-4 ml-2"
                        style={{
                          fontFamily: "Satoshi",
                          fontWeight: 500,
                          fontSize: "18px", // Reverted font size
                          color: "#24252C",
                        }}
                      >
                        Total Experience in Consulting {/* No * */}
                      </label>
                      <Select
                        name="totalYearsInConsulting"
                        options={Array.from({ length: 15 }, (_, i) => {
                          const years = (i + 1).toString();
                          return {
                            value: years,
                            label: `${years} year${years > 1 ? "s" : ""}`,
                          };
                        })}
                        value={
                          formData.totalYearsInConsulting
                            ? {
                                value: formData.totalYearsInConsulting,
                                label: `${formData.totalYearsInConsulting} ${
                                  formData.totalYearsInConsulting === "1"
                                    ? "year"
                                    : "years"
                                }`,
                              }
                            : null
                        }
                        onChange={(option) =>
                          handleChange({
                            target: {
                              name: "totalYearsInConsulting",
                              value: option ? option.value : "",
                            },
                          })
                        }
                        styles={customStyles}
                        placeholder="Select experience"
                        isClearable={false}
                      />
                    </div>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        );

      case 2: // Personal Details
        return (
          <Box sx={stageBoxStyles}>
            <Typography sx={titleStyles}>Personal Details</Typography>
            <Box sx={innerRowStyles}>
              <Box sx={columnStyles}>
                {/* Mobile Number */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
                      color: "#24252C",
                    }}
                  >
                    Mobile Number <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="rounded-lg">
                    {" "}
                    {/* Reverted to rounded-lg class */}
                    {/* PhoneInput required prop handles validation */}
                    <PhoneInput
                      defaultCountry="IN"
                      value={phoneValue} // Use phoneValue state
                      onChange={handlePhoneNumberChange} // Update phoneValue state
                      maxLength={15}
                      required // Required based on *
                      className="rounded-full px-4 py-2.5 border w-full focus:outline-none focus:ring-2 focus:ring-blue-500" // Reverted to original classes
                      style={{ borderRadius: 50, border: "1px solid #24252C" }} // Reverted to original inline styles
                    />
                    {error && ( // Assuming error state is relevant here
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                  </div>
                </div>
                {/* LinkedIn Profile Link */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
                      color: "#24252C",
                    }}
                  >
                    LinkedIn Profile Link{" "}
                    <span style={{ color: "grey", fontSize: "18px" }}>
                      (link starting with https)
                    </span>
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="url" // Use type url for better validation
                    name="linkedinLink"
                    value={formData.linkedinLink}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    style={roundedInputStyles} // Apply rounded styles
                    required // Required based on *
                  />
                </div>
                {/* Profile Picture Upload - NOT required */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
                      color: "#24252C",
                    }}
                  >
                    Upload Profile Picture {/* No * */}
                  </label>
                  <Box sx={{ px: 1 }}>
                    {" "}
                    {/* Added px:1 for inner padding as in original */}
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
                      style={{ borderRadius: 16 }} // Apply border-radius from original
                    >
                      <input
                        type="file"
                        id="profilePic"
                        name="profilePic"
                        accept="image/jpeg, image/jpg, image/png"
                        onChange={handleProfilePicUpload}
                        className="hidden"
                        // Not required
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
                          borderColor: "#3C7EFC", // Ensure border color from original
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
                      {profilePic && ( // Show preview if profilePic state is set
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
              <Box sx={columnStyles}>
                {/* Date of Birth */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
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
                    max={new Date().toISOString().split("T")[0]} // Prevent future dates
                    style={roundedInputStyles} // Apply rounded styles
                    required // Required based on *
                  />
                </div>
                {/* Current Location */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
                      color: "#24252C",
                    }}
                  >
                    Current Location <span style={{ color: "red" }}>*</span>
                  </label>
                  {/* Select required prop checks if a value is selected */}
                  <Select
                    options={filteredCities}
                    value={selectedCity} // Use selectedCity state
                    styles={customStyles} // Use customStyles for React-Select
                    onChange={handleCityChange} // Update selectedCity and formData.location
                    onInputChange={(value) => setInputValue(value)} // Update inputValue for filtering
                    inputValue={inputValue} // Control the input value
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
                {/* About You - NOT required */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
                      color: "#24252C",
                    }}
                  >
                    About You {/* No * */}
                  </label>{" "}
                  <Box sx={{ px: 2 }}>
                    {" "}
                    {/* Added px:2 for inner padding as in original */}
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      placeholder="Add a short summary about yourself"
                      className="w-full text-sm outline-none resize-none h-44" // Reverted to original classes
                      style={aboutTextareaStyles} // Apply styles derived from original classes
                      // Not required
                    />
                  </Box>
                </div>
              </Box>
            </Box>
          </Box>
        );

      case 3: // Preferences
        return (
          <Box sx={stageBoxStyles}>
            <Typography sx={titleStyles}>Preferences</Typography>
            <Box sx={innerRowStyles}>
              <Box sx={columnStyles}>
                {/* Expected Minimum Salary */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
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
                    onChange={handleChange}
                    style={roundedInputStyles} // Apply rounded styles
                    required // Required based on *
                    min="0" // Keep min attribute
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
                      fontSize: "18px", // Reverted font size
                      color: "#24252C",
                    }}
                  >
                    Preferred Work Type <span style={{ color: "red" }}>*</span>
                  </label>
                  {/* Select required prop checks if value array is non-empty */}
                  <Select
                    isMulti
                    options={[
                      { value: "Full-Time", label: "Full-Time" },
                      { value: "Part-Time", label: "Part-Time" },
                      { value: "Contract", label: "Contract" },
                      { value: "Temporary", label: "Temporary" },
                    ]}
                    value={formData.preferredWorkTypes.map((type) => ({
                      // Use formData
                      value: type,
                      label: type,
                    }))}
                    onChange={(selectedOptions) => {
                      // Update formData
                      const workTypes = selectedOptions.map(
                        (option) => option.value
                      );
                      setFormData((prev) => ({
                        ...prev,
                        preferredWorkTypes: workTypes,
                      }));
                    }}
                    styles={customStyles} // Use customStyles for React-Select
                    placeholder="Select work type..."
                    closeMenuOnSelect={false} // Keep menu open for multi-select
                    required // Required based on *
                    name="preferredWorkTypes"
                  />
                </div>
              </Box>
              <Box sx={columnStyles}>
                {/* Preferred Locations (Multi-select with max 5) */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
                      color: "#24252C",
                    }}
                  >
                    Preferred Locations (Select up to 5){" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  {/* Select required prop checks if value array is non-empty. Max 5 is handled in onChange */}
                  <Select
                    isMulti
                    options={cities.map((city) => ({
                      // Use full cities list
                      value: city,
                      label: city,
                    }))}
                    value={formData.preferredLocations.map((loc) => ({
                      // Use formData
                      value: loc,
                      label: loc,
                    }))}
                    onChange={(selectedOptions) => {
                      // Check if user is trying to add a 6th option
                      if (selectedOptions.length > 5) {
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
                    }}
                    styles={customStyles} // Use customStyles for React-Select
                    placeholder="Select preferred locations..."
                    closeMenuOnSelect={false} // Keep menu open for multi-select
                    required // Required based on * (checks for at least 1 selected)
                    name="preferredLocations"
                    isOptionDisabled={() =>
                      formData.preferredLocations.length >= 5
                    } // Re-added as in first snippet
                  />
                </div>
                {/* Preferred Work Mode (Multi-select) */}
                <div className="mb-6">
                  <label
                    className="block mb-4 ml-2"
                    style={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "18px", // Reverted font size
                      color: "#24252C",
                    }}
                  >
                    Preferred Work Mode <span style={{ color: "red" }}>*</span>
                  </label>
                  {/* Select required prop checks if value array is non-empty */}
                  <Select
                    isMulti
                    options={[
                      { value: "Remote", label: "Remote" },
                      { value: "Hybrid", label: "Hybrid" },
                      { value: "Work From Office", label: "Work From Office" },
                    ]}
                    value={formData.preferredWorkModes.map((mode) => ({
                      // Use formData
                      value: mode,
                      label: mode,
                    }))}
                    onChange={(selectedOptions) => {
                      // Update formData
                      const workModes = selectedOptions.map(
                        (option) => option.value
                      );
                      setFormData((prev) => ({
                        ...prev,
                        preferredWorkModes: workModes,
                      }));
                    }}
                    styles={customStyles} // Use customStyles for React-Select
                    placeholder="Select work mode..."
                    closeMenuOnSelect={false} // Keep menu open for multi-select
                    required // Required based on *
                    name="preferredWorkModes"
                  />
                </div>
              </Box>
            </Box>
          </Box>
        );

      default:
        return null; // Should not happen
    }
  };

  return (
    <Box sx={{ padding: "1rem", bgcolor: "white", minHeight: "100vh" }}>
      {" "}
      {/* Added minHeight */}
      {/* Header Section */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <AlertModal
          open={alert.open}
          onClose={() => setAlert({ ...alert, open: false })}
          type={alert.type}
          title={alert.title}
          message={alert.message}
        />
        <Typography
          sx={{
            fontFamily: "Satoshi",
            fontSize: "26px",
            fontWeight: 600,
            color: "#24252C",
            textAlign: "center",
            mt: 4,
            px: 1,
          }}
        >
          Power up your{" "}
          <span
            style={{
              fontFamily: "Satoshi",
              fontSize: "26px",
              fontWeight: 600,
              color: "#3C7EFC",
            }}
          >
            Talent Profile
          </span>
        </Typography>
      </Box>
      {/* Progress Bar */}
      <Box
        sx={{
          width: { xs: "92%", sm: "90%", lg: "80%", md: "80%" },
          mx: "auto",
          mt: 4,
          mb: 4,
          bgcolor: "#E0E0E0",
          borderRadius: 5,
          height: "10px",
        }}
      >
        <Box
          sx={{
            width: `${((currentStage + 1) / totalStages) * 100}%`, // +1 because stages are 0-indexed, totalStages is count
            bgcolor: "#3C7EFC",
            borderRadius: 5,
            height: "100%",
            transition: "width 0.5s ease-in-out", // Smooth transition for the bar
          }}
        />
      </Box>
      {/* Form Stages */}
      {/* Ensure the form element wraps ALL stages and buttons */}
      <form onSubmit={handleSubmit}>
        {renderStage()} {/* Render the current stage */}
        {/* Navigation Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: currentStage === 0 ? "flex-end" : "space-between", // Align 'Next' to end on first page
            width: { xs: "100%", sm: "100%", lg: "80%", md: "80%" },
            mx: "auto",
            mt: 4,
            mb: 10,
            gap: 2, // Add gap between buttons
            px: { xs: 2, md: 0 }, // Add horizontal padding on small screens
          }}
        >
          {/* Previous Button */}
          {currentStage > 0 && ( // Only show Previous button if not on the first stage
            <Button
              variant="outlined"
              onClick={() => setCurrentStage((prev) => prev - 1)}
              sx={{
                // Reverted button styles to match original px/py/border/color
                px: 4,
                py: 1,
                border: 2, // Matches original 2px border
                color: "#3C7EFC",
                borderColor: "#3C7EFC",
                textTransform: "none",
                borderRadius: 50, // Matches original rounded-full
                fontSize: "18px", // Matches original font size
                fontWeight: 700, // Matches original font weight
                fontFamily: "Satoshi", // Matches original font family
              }}
            >
              Previous
            </Button>
          )}

          {/* Next / Submit Button */}
          {currentStage < totalStages - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext} // Use the handleNext function with validation
              sx={{
                // Reverted button styles to match original px/py/border/color
                bgcolor: "#3C7EFC", // Matches original bg-blue-500 equivalent
                "&:hover": { bgcolor: "#306CE0" }, // Matches hover:bg-blue-700 equivalent
                color: "white", // text-white
                px: 6, // Matches original px-6
                py: 1, // Matches original py-2
                borderRadius: 50, // Matches original rounded-full
                textTransform: "none", // Matches original text-transform: none
                fontSize: "18px", // Matches original font size
                fontWeight: 700, // Matches original font weight
                fontFamily: "Satoshi", // Matches original font family
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit" // This is the submit button on the last stage
              variant="contained"
              disabled={loading || uploadingProfilePic}
              sx={{
                // Reverted button styles to match original px/py/border/color/width
                bgcolor: "#3C7EFC", // Matches original bg-blue-500 equivalent
                "&:hover": { bgcolor: "#306CE0" }, // Matches hover:bg-blue-700 equivalent
                color: "white", // text-white
                // px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 - This is complex, let's use a fixed px for simplicity or try a common responsive approach
                px: 4, // Attempt to match responsive padding
                py: 1, // Matches original py-2
                borderRadius: 50, // Matches original rounded-full
                textTransform: "none", // Matches original text-transform: none
                fontSize: "18px", // Matches original font size
                fontWeight: 700, // Matches original font weight
                fontFamily: "Satoshi", // Matches original font family
                width: { xs: "100%", sm: "auto" }, // w-full sm:w-auto
              }}
            >
              {loading ? <Loading /> : "Save Details"}
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default UserInfoForm;
