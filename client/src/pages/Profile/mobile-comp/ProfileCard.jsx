import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { AiOutlineMail, AiOutlinePlus } from "react-icons/ai";
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
      //borderRadius: 0,
      //border: state.isFocused? "1px black" :"none",
      // boxShadow: state.isFocused ? "black" : "none",
      // "&:hover": {
      //   borderColor: "#d1d5db",
      // },
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

  const profileFields = [
    "firstName",
    "lastName",
    "email",
    "currentSalary",
    "currentCompany",
    "currentDesignation",
    "linkedinLink",
    "currentLocation",
    "experienceHistory",
    "cvUrl",
  ];

  console.log(user);
  let filledFieldsCount = profileFields.reduce((count, field) => {
    if (user[field] && user[field].toString().trim() !== "") {
      return count + 1;
    }
    return count;
  }, 0);

  // Add 1 to count if skills exist and are not empty
  if (user.skills && Array.isArray(user.skills) && user.skills.length > 0) {
    filledFieldsCount += 1;
  }

  // Update total fields count to include skills
  const totalFields = profileFields.length + 1;

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

  const mobileView = (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems="center"
      justifyContent="space-evenly"
      flexWrap="wrap"
      gap={2}
      sx={{
        maxWidth: "90%",
        width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
        margin: "auto",
        border: "3px solid #00000040",
        p: 2,
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
      {/* Profile Image */}
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Avatar
          src={profilePicUrl || user?.profileUrl}
          alt="Profile"
          sx={{
            width: { xs: 80, md: 80, lg: 100 },
            height: { xs: 80, md: 80, lg: 100 },
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

      {/* User Info */}
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            textTransform: "capitalize",
            mb: 1,
            color: "#404258",
            fontWeight: 700,
            textAlign: "center",
            fontFamily: "Satoshi",
            fontSize: { xs: 20, md: 25, lg: 30 },
          }}
        >
          {user?.firstName + " " + user?.lastName}
        </Typography>

        <Box
          textAlign="center"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Email */}
          <Typography
            display="flex"
            alignItems="center"
            gap={1}
            color="#404258"
            fontWeight="400"
          >
            <AiOutlineMail /> <EmailWithBreak email={updatedUserInfo.email} />
          </Typography>

          {/* Contact */}
          {isEditing ? (
            <PhoneInput
              defaultCountry="IN"
              value={updatedUserInfo.contactNumber}
              maxLength={15} // value like "+919876543210"
              onChange={(phone) => {
                handleChange({
                  target: {
                    name: "contactNumber",
                    value: phone, // already includes country code like +91
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
              gap={1}
              color="#404258"
              fontWeight="400"
            >
              <FiPhoneCall /> {updatedUserInfo.contactNumber}
            </Typography>
          )}

          {/* Location */}
          {isEditing ? (
            <Box sx={{ width: "250px" }}>
              <LocationDropdown
                value={updatedUserInfo.currentLocation}
                onChange={handleLocationChange}
              />
            </Box>
          ) : (
            <Typography
              display="flex"
              alignItems="center"
              gap={1}
              color="#404258"
              fontWeight="400"
            >
              <HiLocationMarker /> {updatedUserInfo.currentLocation}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Edit & Save Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mr: 5.5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isEditing ? (
          <Button
            variant="contained"
            size="small"
            onClick={handleSaveClick}
            sx={{ bgcolor: "#3C7EFC", color: "white", borderRadius: 16 }}
            disabled={loading || uploadingProfilePic}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Save"
            )}
          </Button>
        ) : (
          <Typography
            sx={{
              color: "#3C7EFC",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            onClick={handleEditClick}
          >
            <EditIcon sx={{ color: "#3C7EFC" }} /> Edit Profile
          </Typography>
        )}
      </Box>
    </Box>
  );

  return <Box sx={{ width: "100%" }}>{mobileView}</Box>;
};

export default UserInfoCard;
