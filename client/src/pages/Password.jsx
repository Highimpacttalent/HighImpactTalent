import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Checkbox, FormControlLabel, Typography, Box, Modal, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PasswordChange = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();

  // Generate a random OTP (0-9999) and send it when the component is first loaded
  useEffect(() => {
    if (step === 2) {
      sendOtp();
    }
  }, [step]);

  const sendOtp = async () => {
    const randomOtp = Math.floor(Math.random() * 10000); // Random 4-digit OTP
    setGeneratedOtp(randomOtp);

    try {
      setLoading(true);
      const response = await fetch("https://highimpacttalent.onrender.com/api-v1/sendmail/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: randomOtp }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const handleOtpSubmit = () => {
    if (otp !== generatedOtp.toString()) {
      setError("Incorrect OTP. Please try again.");
    } else {
      setError("");
      setStep(3); // Move to password input step
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://highimpacttalent.onrender.com/api-v1/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.message || "Password change failed");
      }

      setSuccessModal(true);
      setTimeout(() => {
        setSuccessModal(false);
        navigate("/find-jobs"); // Redirect after success
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f9fafb" }}>
    <Container maxWidth="sm" sx={{ mt: 5, p: 3, border: "1px solid #ccc", borderRadius: 2, background: "#fff", boxShadow: 3 }}>
      <Typography variant="h5" textAlign="center" gutterBottom color="primary" fontWeight={600}>
        {step === 1 ? "Change Your Password" : step === 2 ? "Enter OTP" : "Set New Password"}
      </Typography>

      {step === 1 && (
        <Box>
          <TextField
            fullWidth
            label="Email ID"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <FormControlLabel
            control={<Checkbox checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />}
            label="I accept all Terms and Conditions"
          />
          <Button fullWidth variant="contained" color="primary" disabled={!email || !termsAccepted} onClick={() => setStep(2)}>
            Submit
          </Button>
        </Box>
      )}

      {step === 2 && (
        <Box>
          <Typography variant="body1" textAlign="center">
            OTP has been sent to <b>{email}</b>
          </Typography>
          <TextField
            fullWidth
            label="Enter OTP"
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button fullWidth variant="contained" color="primary" onClick={handleOtpSubmit} sx={{ mt: 2 }}>
            Verify OTP
          </Button>
          <Button fullWidth variant="text" onClick={sendOtp} sx={{ mt: 1 }}>
            Resend OTP
          </Button>
        </Box>
      )}

      {step === 3 && (
        <Box>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button fullWidth variant="contained" color="primary" onClick={handlePasswordChange} sx={{ mt: 2 }}>
            Change Password
          </Button>
        </Box>
      )}

      {loading && <CircularProgress sx={{ display: "block", mx: "auto", mt: 3 }} />}

      <Modal open={successModal} onClose={() => setSuccessModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 300, p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 3, textAlign: "center" }}>
          <Typography variant="h6">Password Changed Successfully!</Typography>
        </Box>
      </Modal>
    </Container>
    </Box>
  );
};

export default PasswordChange;
