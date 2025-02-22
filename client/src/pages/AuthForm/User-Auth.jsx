import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Login } from "../../redux/userSlice"; // Adjust import path if needed
import { apiRequest } from "../../utils"; // Ensure you have an API request utility

const UserSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const checkPasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (lengthCriteria && uppercaseCriteria && lowercaseCriteria && numberCriteria && specialCharCriteria) {
      setPasswordStrength("Strong");
      setPasswordError("");
    } else if (lengthCriteria && (uppercaseCriteria || lowercaseCriteria) && numberCriteria) {
      setPasswordStrength("Medium");
      setPasswordError("Consider adding special characters for a stronger password.");
    } else {
      setPasswordStrength("Weak");
      setPasswordError("Password should include uppercase, lowercase, number, and special character.");
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
      setEmailError(emailRegex.test(value) ? "" : "Please enter a valid email address.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!form.termsAccepted) {
      alert("You must agree to the terms and conditions");
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
        navigate("/user-additional-details");
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          width: { xs: "90%", sm: "50%", md: "40%" },
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
        >
          Start your Job hunt today! 🚀
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
            error={!!passwordError}
            helperText={passwordError || passwordStrength}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            error={!!passwordError}
            helperText={passwordError}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="termsAccepted"
                checked={form.termsAccepted}
                onChange={handleChange}
                color="primary"
              />
            }
            label="I agree to all Terms and Conditions"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              background: "#2575fc",
              "&:hover": { background: "#1e5dd9" },
            }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link href="/u-login" underline="hover">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserSignUp;
