import React, { useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    FormControlLabel,
    Checkbox,
    Link,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs from "dayjs"
import { apiRequest } from "../../utils";
import { useDispatch } from "react-redux";
import { Login } from "../../redux/userSlice";

const RecruiterSignup = () => {
  const [form, setForm] = useState({
    email: "",
    companyName: "",
    recruiterName: "",
    mobileNumber: "",
    role: "company",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;  // Basic validation for 10-digit phone number

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
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    if (name === "password") checkPasswordStrength(value);
    if (name === "confirmPassword" && value !== form.password) {
      setPasswordError("Passwords do not match");
    } else {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 5) {
      alert("Password must be at least 5 characters long.");
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

    setLoading(true);
    setModalMessage("Informing Team...");

    const sendMailPayload = {
      email: form.email,
      companyName: form.companyName,
      recruiterName: form.recruiterName,
      mobileNumber: form.mobileNumber,
      password: form.password,
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

      setModalMessage("Registering User...");
      
      const newData = { 
        companyName: form.companyName,
        recruiterName: form.recruiterName,
        mobileNumber: form.mobileNumber,
        email: form.email, 
        password: form.password, 
        copmanyType: form.role 
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
        setSuccessModalOpen(true);
        setTimeout(() => {
          setSuccessModalOpen(false);
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
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center",  padding: 3 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: { xs: "90%", sm: "50%", md: "40%" } }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
          Start your talent hunt today! 🚀
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth type="email" label="Email Address" name="email" value={form.email} onChange={handleChange} margin="normal" required error={!!emailError} helperText={emailError} />
          <TextField fullWidth label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Recruiter Name" name="recruiterName" value={form.recruiterName} onChange={handleChange} margin="normal" required />
          <TextField 
            fullWidth 
            label="Mobile Number" 
            name="mobileNumber" 
            value={form.mobileNumber} 
            onChange={handleChange} 
            margin="normal" 
            required 
            error={!!mobileError} 
            helperText={mobileError}
            inputProps={{ maxLength: 10 }}
          />
          <FormControl component="fieldset" sx={{ my: 2 }}>
            <FormLabel component="legend">Select an Option:</FormLabel>
            <RadioGroup row name="role" value={form.role} onChange={handleChange}>
              <FormControlLabel value="company" control={<Radio />} label="Company" />
              <FormControlLabel value="hiringAgency" control={<Radio />} label="Hiring Agency" />
            </RadioGroup>
          </FormControl>
          <TextField fullWidth type="password" label="Password" name="password" value={form.password} onChange={handleChange} margin="normal" required error={!!passwordError} helperText={passwordError} />
          <TextField fullWidth type="password" label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} margin="normal" required error={!!passwordError} helperText={passwordError} />
          <Typography sx={{ textAlign: "right", color: passwordStrength === "Strong" ? "green" : passwordStrength === "Medium" ? "orange" : "red", fontWeight: "bold" }}>
            {passwordStrength}
          </Typography>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.5, fontSize: "1rem", fontWeight: "bold" }} disabled={loading}>
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Register"}
          </Button>
          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account? <Link href="/r-login" underline="hover">Login</Link>
          </Typography>
        </Box>
      </Paper>
      {/* Loading Modal */}
      <Dialog open={loading}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#1976D2" }}>
          Please Wait
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", p: 3 }}>
          <CircularProgress sx={{ color: "#1976D2", mb: 2 }} />
          <Typography variant="body1" sx={{ color: "#555" }}>
            We are creating your account. This may take a few seconds...
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#4CAF50" }}>
          🎉 Registration Successful!
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", p: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: "#4CAF50", mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            Your account has been created!
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: "#555" }}>
            Our team will contact you shortly for job postings. Stay tuned!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button 
            onClick={() => setSuccessModalOpen(false)} 
            sx={{ backgroundColor: "#4CAF50", color: "white", px: 4, py: 1.2, "&:hover": { backgroundColor: "#388E3C" } }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruiterSignup;