import React, { useState,useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
  Link,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Heroimg from "../../assets/CreateAccount/HeroImg.svg";
import dayjs from "dayjs";
import { apiRequest } from "../../utils";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Login } from "../../redux/userSlice";
import ReactSelect from "react-select";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const RecruiterSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    companyName: "",
    recruiterName: "",
    mobileNumber: "",
    role: "company",
    password: "",
    confirmPassword: "",
    profilePic: null,
    designation: "",
    location: "",
    numberOfEmployees: "",
    organizationType: "",
  });
  const dispatch = useDispatch();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);

  // Prepare city options with "Other" at the bottom
  const filteredCities = [
    ...cities
      .filter((city) => city.toLowerCase().includes(inputValue.toLowerCase()))
      .map((city) => ({ value: city, label: city })),
    { value: "Other", label: "Other" }, // Always at the bottom
  ];

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/; // Basic validation for 10-digit phone number

  // Enum options for dropdowns
  const numberOfEmployeesOptions = [
    "1-10",
    "11-50", 
    "51-200",
    "201-500",
    "501-1000",
    "1001-5000",
    "5001-10000",
    "10000+"
  ];

  const organizationTypeOptions = [
    "Startup",
    "Public",
    "Private", 
    "Government",
    "Non-Profit",
    "MNC",
    "SME",
    "Indian MNC",
    "Other",
    "Consultant"
  ];

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)$/)) {
      alert("Please upload an image file (JPEG, JPG, or PNG)");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    setUploadingProfilePic(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("profilePic", file);

      // Upload to server
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/upload-company-logo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setProfilePicUrl(response.data.url);
        setForm((prev) => ({ ...prev, profilePic: response.data.url }));
        setProfilePic(URL.createObjectURL(file));
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Profile picture upload error:", error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setUploadingProfilePic(false);
    }
  };

  const checkPasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      lengthCriteria &&
      uppercaseCriteria &&
      lowercaseCriteria &&
      numberCriteria &&
      specialCharCriteria
    ) {
      setPasswordStrength("Strong Password");
      setPasswordError("");
    } else if (
      lengthCriteria &&
      (uppercaseCriteria || lowercaseCriteria) &&
      numberCriteria
    ) {
      setPasswordStrength("Medium Password");
      setPasswordError(
        "Consider adding special characters for a stronger password."
      );
    } else {
      setPasswordStrength("Weak Password");
      setPasswordError(
        "Password should include uppercase, lowercase, number, and special character."
      );
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "0.45rem",
      fontSize: "0.875rem",
      borderRadius: "2rem",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    if (name === "password") checkPasswordStrength(value);
    if (name === "confirmPassword" && value !== form.password) {
      setPasswordError("Passwords do not match");
    } else if (name === "confirmPassword" && value === form.password) {
      setPasswordError("");
    }
    if (name === "email") {
      if (!emailRegex.test(value)) {
        setEmailError("Please enter a valid email address.");
      } else {
        setEmailError("");
      }
    }
    if (name === "mobileNumber") {
      if (!phoneRegex.test(value)) {
        setMobileError("Please enter a valid 10-digit mobile number.");
      } else {
        setMobileError("");
      }
    }
  };

  const handleCityChange = (selectedOption) => {
      setSelectedCity(selectedOption);
      // Update location in formData when a city is selected
      if (selectedOption) {
        setForm({ ...form, location: selectedOption.value });
      } else {
        setForm({ ...form, location: "" });
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation checks
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!phoneRegex.test(form.mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!form.recruiterName) {
      alert("Recruiter name is required.");
      return;
    }
    if (!form.designation) {
      alert("Designation is required.");
      return;
    }
    if (!form.location) {
      alert("Company location is required.");
      return;
    }
    if (!form.numberOfEmployees) {
      alert("Number of employees is required.");
      return;
    }
    if (!form.organizationType) {
      alert("Organization type is required.");
      return;
    }

    setLoading(true);

    const sendMailPayload = {
      email: form.email,
      companyName: form.companyName,
      recruiterName: form.recruiterName,
      mobileNumber: form.mobileNumber,
      password: form.password,
      designation: form.designation,
      location: form.location,
      numberOfEmployees: form.numberOfEmployees,
      organizationType: form.organizationType,
      date: dayjs().format("YYYY-MM-DD"),
      time: dayjs().format("HH:mm"),
    };

    try {
      const mailResponse = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/sendmail/sendEmail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sendMailPayload),
        }
      );
      const mailData = await mailResponse.json();

      if (!mailData.success) {
        alert(mailData.message || "Failed to inform team");
        setLoading(false);
        return;
      }

      const newData = {
        companyName: form.companyName,
        recruiterName: form.recruiterName,
        mobileNumber: form.mobileNumber,
        email: form.email,
        password: form.password,
        copmanyType: form.role,
        profileUrl: profilePicUrl,
        designation: form.designation,
        location: form.location,
        numberOfEmployees: form.numberOfEmployees,
        organizationType: form.organizationType,
      };

      const registerData = await apiRequest({
        url: "companies/register",
        method: "POST",
        data: newData,
      });

      if (registerData.success) {
        const userData = { token: registerData?.token, ...registerData?.user };
        dispatch(Login(userData));
        localStorage.setItem("userInfo", JSON.stringify(userData));
        setTimeout(() => {
          navigate("/endlogin");
        }, 2000);
      } else {
        alert(registerData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "white",
        display: "flex",
        padding: 3,
        px: { md: 10, lg: 10, xs: 4, sm: 4 },
      }}
    >
      
      <Box
        sx={{
          display: { xs: "none", sm: "none", md: "flex",lg: "flex" },
          width: { md: "50%", lg: "50%" },
          flexgrow: 1,
          p: { md: 3, lg: 3, xs: 0, sm: 0 },
          ml: 6,
          mt: 4,
        }}
      >
        <img src={Heroimg} alt="Hero" style={{ height: "550px" }} />
      </Box>
      <Box
        sx={{
          width: { md: "40%", lg: "40%", xs: "100%", sm: "100%" },
          mt: 4,
          p: { md: 4, lg: 4, xs: 0, sm: 0 },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "700",
            mb: 3,
            fontFamily: "Satoshi",
            color: "#24252C",
            fontSize: "20px",
          }}
        >
          Lets create your account
        </Typography>

        <Box>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Recruiter Name */}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
              }}
            >
              Recruiter Name
            </Typography>
            <TextField
              fullWidth
              name="recruiterName"
              value={form.recruiterName}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                  height: 50,
                },
              }}
            />

            {/* Email Address */}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
                mt: 3,
              }}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              type="email"
              name="email"
              placeholder="Enter your email here"
              value={form.email}
              onChange={handleChange}
              required
              error={!!emailError}
              helperText={emailError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                  height: 50,
                },
              }}
            />

            {/* Mobile Number */}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
                mt: 3,
              }}
            >
              Mobile Number
            </Typography>
            <TextField
              fullWidth
              type="text"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              required
              error={!!mobileError}
              helperText={mobileError}
              inputProps={{ maxLength: 10 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                  height: 50,
                },
              }}
            />

            {/* Designation */}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
                mt: 3,
              }}
            >
              Designation
            </Typography>
            <TextField
              fullWidth
              type="text"
              name="designation"
              placeholder="Enter your designation"
              value={form.designation}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                  height: 50,
                },
              }}
            />

            {/* Company Category */}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
                mt: 3,
              }}
            >
              Company Category
            </Typography>
            <FormControl component="fieldset" sx={{ my: 1 }}>
              <RadioGroup
                row
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="company"
                  control={<Radio />}
                  label="Company"
                />
                <FormControlLabel
                  value="hiringAgency"
                  control={<Radio />}
                  label="Hiring Agency"
                />
              </RadioGroup>
            </FormControl>

            {/* Company Name */}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
                mt: 3,
              }}
            >
              Company Name
            </Typography>
            <TextField
              fullWidth
              type="text"
              name="companyName"
              placeholder="Enter your company name"
              value={form.companyName}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                  height: 50,
                },
              }}
            />

            {/* Company Location */}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
                mt: 3,
              }}
            >
              Company Location
            </Typography>
            <ReactSelect
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

            {/* Number of Employees */}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
                mt: 3,
              }}
            >
              Number of Employees
            </Typography>
            <FormControl fullWidth required>
              <Select
                name="numberOfEmployees"
                value={form.numberOfEmployees}
                onChange={handleChange}
                displayEmpty
                sx={{
                  borderRadius: 16,
                  height: 50,
                }}
              >
                <MenuItem value="" disabled>
                  Select number of employees
                </MenuItem>
                {numberOfEmployeesOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Organization Type */}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
                mt: 3,
              }}
            >
              Organization Type
            </Typography>
            <FormControl fullWidth required>
              <Select
                name="organizationType"
                value={form.organizationType}
                onChange={handleChange}
                displayEmpty
                sx={{
                  borderRadius: 16,
                  height: 50,
                }}
              >
                <MenuItem value="" disabled>
                  Select organization type
                </MenuItem>
                {organizationTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Company Logo */}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
                mt: 3,
              }}
            >
              Company Logo
            </Typography>
            <Box sx={{ mt: 2 }}>
              <div
                className="w-full border-2 border-dashed border-black rounded-lg px-6 py-12 text-center cursor-pointer hover:bg-blue-50 transition"
                onClick={() => document.getElementById("profilePic").click()}
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

            {/* Password */}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mt: 2,
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              placeholder="Enter your password here"
              onChange={handleChange}
              margin="normal"
              required
              error={!!passwordError}
              helperText={passwordError || passwordStrength}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                  height: 50,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              error={!!passwordError && form.confirmPassword !== ""}
              helperText={form.confirmPassword !== "" && form.confirmPassword !== form.password ? "Passwords do not match" : ""}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 16,
                  height: 50,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Typography
              sx={{
                fontFamily: "Satoshi",
                color: "#808195",
                fontWeight: "500",
                fontSize: "14px",
                px: 2,
                py: 1,
              }}
            >
              By creating account, you agree to the{" "}
              <Link href="/t&c">Terms & Conditions</Link> and
              <Link href="/privacy-policy"> Privacy Policy</Link> of High Impact
              Talent
            </Typography>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: "16px",
                background: "#2575fc",
                "&:hover": { background: "#1e5dd9" },
                borderRadius: 16,
                textTransform: "none",
                fontFamily: "Satoshi",
                fontWeight: "700",
              }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
            <Typography
              align="center"
              sx={{
                mt: 2,
                fontFamily: "Satoshi",
                fontWeight: "700",
                color: "#808195",
              }}
            >
              Have an account?{" "}
              <Link href="/r-login" underline="hover">
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      
    </Box>
  );
};

export default RecruiterSignup;