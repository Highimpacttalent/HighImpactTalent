import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { AiOutlineMail, AiOutlinePlus } from "react-icons/ai";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { FiPhoneCall } from "react-icons/fi";
import { HiLocationMarker } from "react-icons/hi";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useMediaQuery, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector, useDispatch } from "react-redux";
import AlertModal from "../../../components/Alerts/view.jsx";
import { UpdateUser } from "../../../redux/userSlice";
import axios from "axios";
import Select from "react-select";

const WRAP_AT = 16;
function EmailWithBreak({ email }) {
  if (!email) return null;
  if (email.length <= WRAP_AT) {
    return <>{email}</>;
  }
  const first = email.slice(0, WRAP_AT);
  const second = email.slice(WRAP_AT);
  return (
    <>
      {first}
      <br />
      {second}
    </>
  );
}

const LocationDropdown = ({ value, onChange, isRequired = false }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customCity, setCustomCity] = useState("");

  // Fetch cities from CSV
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
      onChange("");
    } else {
      setIsOtherSelected(false);
      setSelectedCity(selectedOption);
      onChange(selectedOption?.value || "");
    }
  };

  // Handle custom city input
  const handleCustomCityChange = (e) => {
    const value = e.target.value;
    setCustomCity(value);
    onChange(value);
  };

  // Prepare city options with "Other" at the bottom
  const filteredCities = [
    ...cities
      .filter((city) => city.toLowerCase().includes(inputValue.toLowerCase()))
      .map((city) => ({ value: city, label: city })),
    { value: "Other", label: "Other" },
  ];

  // Custom styles for Select component
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: 2,
      width: "100%",
      fontSize: "0.875rem",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: 0,
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

  return (
    <div>
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
          inputValue ? "No matching cities found" : "Start typing to search"
        }
        required={isRequired}
      />

      {isOtherSelected && (
        <div className="mt-2">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter your city"
            value={customCity}
            onChange={handleCustomCityChange}
            required={isRequired}
          />
        </div>
      )}
    </div>
  );
};

const UserInfoCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(user?.profileUrl || "");
  const fileInputRef = useRef(null);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    email: user?.email ?? "",
    contactNumber: user?.contactNumber ?? "",
    currentLocation: user?.currentLocation?.toUpperCase() ?? "",
    profileUrl: user?.profileUrl ?? "",
  });

  const handleLocationChange = (location) => {
    setUpdatedUserInfo({ ...updatedUserInfo, currentLocation: location });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setUpdatedUserInfo({ ...updatedUserInfo, [e.target.name]: e.target.value });
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png)$/)) {
      console.log("Invalid file type:", file.type);
      setAlert({
        open: true,
        type: "warning",
        title: "Warning",
        message: "Please upload an image file (JPEG, JPG, or PNG)!",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAlert({
        open: true,
        type: "warning",
        title: "Warning",
        message: "Image size should be less than 2MB!",
      });
      return;
    }

    setUploadingProfilePic(true);

    try {
      const formData = new FormData();
      formData.append("profilePic", file);

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
        setProfilePic(response.data.url);
        dispatch(UpdateUser({ ...user, profileUrl: response.data.url }));
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

  // Updated profile fields to include all required fields (same as desktop version)
  const profileFields = [
    "firstName",
    //"lastName",
    "email",
    "currentSalary",
    "currentCompany",
    "currentDesignation",
    "linkedinLink",
    "currentLocation",
    "experienceHistory",
    "cvUrl",
    "contactNumber", 
    "skills", 
    "educationDetails", 
    "experience", 
    "preferredJobTypes", // (mapped to preferredWorkTypes)
    "preferredJobLocations", //  (mapped to preferredLocations)
    "preferredWorkModes", // (mapped to preferredWorkModes)
    "expectedSalary", // (mapped to expectedMinSalary)
  ];

  console.log(user);
  
  // Updated calculation to properly handle all field types (same as desktop version)
  let filledFieldsCount = 0;
  
  profileFields.forEach(field => {
    let fieldValue;
    
    // Handle field mapping for different property names
    switch(field) {
      case 'preferredJobTypes':
        fieldValue = user?.preferredWorkTypes;
        break;
      case 'preferredJobLocations':
        fieldValue = user?.preferredLocations;
        break;
      case 'preferredWorkModes':
        fieldValue = user?.preferredWorkModes;
        break;
      case 'expectedSalary':
        fieldValue = user?.expectedMinSalary;
        break;
      default:
        fieldValue = user?.[field];
    }
    
    // Check if field is filled based on its type
    if (fieldValue !== null && fieldValue !== undefined) {
      if (Array.isArray(fieldValue)) {
        // For arrays (skills, educationDetails, experienceHistory, preferredLocations, etc.)
        if (fieldValue.length > 0) {
          filledFieldsCount += 1;
        }
      } else if (typeof fieldValue === 'object') {
        // For objects - check if it has meaningful content
        if (Object.keys(fieldValue).length > 0) {
          filledFieldsCount += 1;
        }
      } else if (typeof fieldValue === 'string') {
        // For strings - check if not empty after trimming
        if (fieldValue.toString().trim() !== "") {
          filledFieldsCount += 1;
        }
      } else if (typeof fieldValue === 'number') {
        // For numbers - consider filled if it's a valid number
        if (!isNaN(fieldValue) && fieldValue >= 0) {
          filledFieldsCount += 1;
        }
      }
    }
  });

  const totalFields = profileFields.length;
  const profileCompletion = Math.round((filledFieldsCount / totalFields) * 100);

  const handleSaveClick = async () => {
    if (
      !updatedUserInfo.contactNumber ||
      updatedUserInfo.contactNumber.trim() === ""
    ) {
      setAlert({
        open: true,
        type: "warning",
        title: "Missing Phone Number",
        message: "Please enter your phone number before saving your profile.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/user/updateUserPersonnel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            email: updatedUserInfo.email,
            contactNumber: updatedUserInfo.contactNumber,
            currentLocation: updatedUserInfo.currentLocation,
            profileUrl: profilePicUrl,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        dispatch(
          UpdateUser({
            ...updatedUserInfo,
            profileUrl: profilePicUrl,
          })
        );
        setIsEditing(false);
      } else {
        console.error("Error updating user:", result.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Updated missing fields calculation (same as desktop version)
  const missingFields = [];
  
  profileFields.forEach(field => {
    let fieldValue;
    let displayName;
    
    // Handle field mapping and display names
    switch(field) {
      case 'preferredJobTypes':
        fieldValue = user?.preferredWorkTypes;
        displayName = 'Preferred Job Types';
        break;
      case 'preferredJobLocations':
        fieldValue = user?.preferredLocations;
        displayName = 'Preferred Job Locations';
        break;
      case 'preferredWorkModes':
        fieldValue = user?.preferredWorkModes;
        displayName = 'Preferred Work Modes';
        break;
      case 'expectedSalary':
        fieldValue = user?.expectedMinSalary;
        displayName = 'Expected Salary';
        break;
      case 'contactNumber':
        fieldValue = user?.contactNumber;
        displayName = 'Contact Number';
        break;
      case 'educationDetails':
        fieldValue = user?.educationDetails;
        displayName = 'Education Details';
        break;
      case 'experienceHistory':
        fieldValue = user?.experienceHistory;
        displayName = 'Experience History';
        break;
      case 'currentSalary':
        fieldValue = user?.currentSalary;
        displayName = 'Current Salary';
        break;
      case 'currentCompany':
        fieldValue = user?.currentCompany;
        displayName = 'Current Company';
        break;
      case 'currentDesignation':
        fieldValue = user?.currentDesignation;
        displayName = 'Current Designation';
        break;
      case 'linkedinLink':
        fieldValue = user?.linkedinLink;
        displayName = 'LinkedIn Link';
        break;
      case 'currentLocation':
        fieldValue = user?.currentLocation;
        displayName = 'Current Location';
        break;
      default:
        fieldValue = user?.[field];
        displayName = field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
    }
    
    // Check if field is missing based on its type
    let isMissing = true;
    
    if (fieldValue !== null && fieldValue !== undefined) {
      if (Array.isArray(fieldValue)) {
        isMissing = fieldValue.length === 0;
      } else if (typeof fieldValue === 'object') {
        isMissing = Object.keys(fieldValue).length === 0;
      } else if (typeof fieldValue === 'string') {
        isMissing = fieldValue.toString().trim() === "";
      } else if (typeof fieldValue === 'number') {
        isMissing = isNaN(fieldValue) || fieldValue < 0;
      }
    }
    
    if (isMissing) {
      missingFields.push(displayName);
    }
  });

  const mobileView = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={3}
      sx={{
        width: { xs: "95%", sm: "85%", md: "70%", lg: "60%" },
        minWidth: { xs: "320px", sm: "400px" },
        margin: "auto",
        border: "3px solid #00000040",
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
      }}
    >
      <AlertModal
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
      
      {/* Profile Image - Centered at top */}
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Avatar
          src={profilePicUrl || user?.profileUrl}
          alt="Profile"
          sx={{
            width: { xs: 90, sm: 100, md: 110 },
            height: { xs: 90, sm: 100, md: 110 },
            transition: "0.3s",
          }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="upload-input"
          ref={fileInputRef}
          onChange={handleProfilePicUpload}
          disabled={uploadingProfilePic}
        />
        <Box
          component="label"
          htmlFor="upload-input"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "white",
            borderRadius: "50%",
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 3,
            cursor: uploadingProfilePic ? "not-allowed" : "pointer",
            opacity: uploadingProfilePic ? 0.7 : 1,
            transition: "opacity 0.3s",
            "&:hover": { opacity: 1 },
          }}
        >
          {uploadingProfilePic ? (
            <CircularProgress size={20} />
          ) : (
            <AiOutlinePlus size={20} color="#3C7EFC" />
          )}
        </Box>
      </Box>

      {/* User Name - Centered */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          textTransform: "capitalize",
          color: "#404258",
          fontWeight: 700,
          textAlign: "center",
          fontFamily: "Satoshi",
          fontSize: { xs: 20, sm: 22, md: 24 },
        }}
      >
        {user?.firstName + " " + user?.lastName}
      </Typography>

      {/* User Info - Stacked vertically */}
      <Box
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 1.5, 
          width: "100%",
          alignItems: "center"
        }}
      >
        {/* Email */}
        <Typography
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          color="#404258"
          fontWeight="400"
          fontSize="0.9rem"
          sx={{ wordBreak: "break-word", textAlign: "center" }}
        >
          <AiOutlineMail /> <EmailWithBreak email={updatedUserInfo.email} />
        </Typography>

        {/* Contact */}
        {isEditing ? (
          <PhoneInput
            defaultCountry="IN"
            value={updatedUserInfo.contactNumber}
            maxLength={15}
            onChange={(phone) => {
              handleChange({
                target: {
                  name: "contactNumber",
                  value: phone,
                },
              });
            }}
            className="rounded-full px-4 py-2.5 border focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderRadius: 50, border: "1px solid #24252C" }}
          />
        ) : (
          <Typography
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            color="#404258"
            fontWeight="400"
            fontSize="0.9rem"
          >
            <FiPhoneCall /> {updatedUserInfo.contactNumber}
          </Typography>
        )}

        {/* Location */}
        {isEditing ? (
          <Box sx={{ width: "100%", maxWidth: "300px" }}>
            <LocationDropdown
              value={updatedUserInfo.currentLocation}
              onChange={handleLocationChange}
            />
          </Box>
        ) : (
          <Typography
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            color="#404258"
            fontWeight="400"
            fontSize="0.9rem"
            sx={{ wordBreak: "break-word", textAlign: "center" }}
          >
            <HiLocationMarker /> {updatedUserInfo.currentLocation}
          </Typography>
        )}

        {/* Edit & Save Button - Below location */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 1,
          }}
        >
          {isEditing ? (
            <Button
              variant="contained"
              size="medium"
              onClick={handleSaveClick}
              sx={{ 
                bgcolor: "#3C7EFC", 
                color: "white", 
                borderRadius: 16,
                px: 3,
                py: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" }
              }}
              disabled={loading || uploadingProfilePic}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Save Changes"
              )}
            </Button>
          ) : (
            <Box
              sx={{
                color: "#3C7EFC",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: 500,
                "&:hover": {
                  opacity: 0.8,
                }
              }}
              onClick={handleEditClick}
            >
              <EditIcon sx={{ color: "#3C7EFC", fontSize: "1.1rem" }} />
              <Typography
                sx={{
                  color: "#3C7EFC",
                  fontSize: "inherit",
                  fontWeight: "inherit",
                }}
              >
                Edit Profile
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Profile Progress Bar */}
      <Box
        sx={{
          width: "100%",
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 2.5 },
          borderRadius: 3,
          border: "1px solid #00000040",
          bgcolor: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1 }}>
          {profileCompletion === 100 ? (
            <Typography
              sx={{ 
                fontFamily: "Poppins", 
                fontWeight: 500, 
                fontSize: { xs: 12, sm: 14 },
                color: "#2e7d32",
                textAlign: "center"
              }}
            >
              Your profile is complete and ready to land you an amazing role!
            </Typography>
          ) : (
            <>
              <Typography
                sx={{ 
                  fontFamily: "Poppins", 
                  fontWeight: 500, 
                  fontSize: { xs: 12, sm: 14 },
                  mb: 0.5,
                  textAlign: "center"
                }}
              >
                Your Profile is {profileCompletion}% Complete
              </Typography>
              <LinearProgress
                variant="determinate"
                value={profileCompletion}
                sx={{ 
                  width: "100%", 
                  height: 8, 
                  borderRadius: 4,
                  mb: 0.5,
                  bgcolor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: profileCompletion < 50 ? "#f44336" : profileCompletion < 80 ? "#ff9800" : "#4caf50",
                  }
                }}
              />
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: { xs: 10, sm: 12 },
                  color: "#666",
                  textAlign: "center",
                }}
              >
                Complete your profile to unlock job applications
              </Typography>
            </>
          )}
        </Box>

        {/* Info Tooltip */}
        {profileCompletion < 100 && (
          <Tooltip
            title={
              <Box sx={{ maxWidth: 250 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  To reach 100%, please add:
                </Typography>
                <Box component="ul" sx={{ margin: 0, paddingLeft: "20px", fontSize: "0.8rem" }}>
                  {missingFields.slice(0, 8).map((field) => (
                    <Box component="li" key={field} sx={{ mb: 0.3 }}>
                      {field}
                    </Box>
                  ))}
                  {missingFields.length > 8 && (
                    <Box component="li" sx={{ fontStyle: "italic", color: "#666" }}>
                      ...and {missingFields.length - 8} more fields
                    </Box>
                  )}
                </Box>
              </Box>
            }
            placement="top"
            arrow
          >
            <IconButton sx={{ ml: 1, p: 0.5 }}>
              <InfoOutlinedIcon sx={{ fontSize: "1.2rem", color: "#666" }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  return <Box sx={{ width: "100%" }}>{mobileView}</Box>;
};

export default UserInfoCard;