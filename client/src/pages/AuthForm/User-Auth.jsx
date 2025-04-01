import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Login } from "../../redux/userSlice"; // Adjust import path if needed
import { apiRequest } from "../../utils"; // Ensure you have an API request utility
import Heroimg from "../../assets/CreateAccount/Heroimg.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const UserSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") checkPasswordStrength(value);
    if (name === "confirmPassword") {
      setPasswordError(value !== form.password ? "Passwords do not match" : "");
    }
    if (name === "email") {
      setEmailError(
        emailRegex.test(value) ? "" : "Please enter a valid email address."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password.length < 5) {
      alert("Password must be at least 5 characters long.");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await apiRequest({
        url: "/user/register",
        method: "POST",
        data: form,
      });

      if (res.success) {
        const userData = { token: res.token, ...res.user };
        dispatch(Login(userData));
        localStorage.setItem("userInfo", JSON.stringify(userData));
        navigate("/userinformation");
      } else {
        alert(res.message || "Error while registering");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Something went wrong. Please try again.");
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
        px: 10,
      }}
    >
      <Box sx={{ width: "50%", mt: 4, p: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "700",
            mb: 3,
            fontFamily: "Satoshi",
            color: "#24252C",
            fontSize: "32px",
          }}
        >
          One Click Closer to a{" "}
          <span
            style={{
              fontWeight: "700",
              fontFamily: "Satoshi",
              color: "#3C7EFC",
            }}
          >
            Game-Changing{" "}
          </span>{" "}
          Opportunity!
        </Typography>
        <Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "90%" }}>
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                color: "#24252C",
                fontWeight: "500",
                mb: 1,
              }}
            >
              Name
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 16,
                    height: 50,
                  },
                }}
              />
              <TextField
                fullWidth
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 16,
                    height: 50,
                  },
                }}
              />
            </Box>
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
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              error={!!passwordError}
              helperText={passwordError}
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
              <Link href="/u-login" underline="hover">
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Divider sx={{ border: "1px solid #A3A3A3", height: "76%", mt: 18 }} />
      </Box>
      <Box sx={{ p: 4, mt: 16, ml: 6 }}>
        <img src={Heroimg} alt="Hero" style={{ height: "550px" }} />
      </Box>
    </Box>
  );
};

export default UserSignUp;
