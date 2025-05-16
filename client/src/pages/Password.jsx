import React, { useState, useEffect } from "react";
import { IconButton, TextField, Button, InputAdornment, Typography, Box, Modal, CircularProgress ,Link} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSelector } from "react-redux";


const PasswordChange = () => {
  const { user } = useSelector((state) => state.user);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(user?.email || "");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();
  const [showPassword,setShowPassword] = useState(false);

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
    <Box sx={{  display: "flex",flexDirection:"column",alignItems:"center", justifyContent: "center", bgcolor: "#fff",p:2 }}>
      <Typography textAlign="center" gutterBottom color="#24252C" fontWeight={700} fontFamily={"Satoshi"} fontSize={"24px"} mt={8}>
        {step === 1 ? "Change Your Password" : step === 2 ? "Enter OTP" : "Set New Password"}
      </Typography>
    <Box sx={{  background: "#fff",mt:4,display:"flex",alignItems:"center",justifyContent:"center"}}>

      {step === 1 && (
        <Box>
          <Typography  gutterBottom color="#24252C" fontWeight={700} fontFamily={"Satoshi"} fontSize={"16px"} >
          Email Address
      </Typography>
          <TextField
            fullWidth
            placeholder="abc@gmail.com"
            variant="outlined"
            value={email}
            disabled={!!user?.email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 18,
                "&.Mui-disabled": {
                  "& .MuiInputBase-input": {
                    color: "black", // Ensures text color is black when disabled
                    "-webkit-text-fill-color": "black", // Override default grey color
                  },
                },
              },
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
                mt:2,
                mb:2
              }}
            >
              By changing Password, you agree to the{" "}
              <Link href="/t&c">Terms & Conditions</Link> and
              <Link href="/privacy-policy"> Privacy Policy</Link> of High Impact
              Talent
            </Typography>
          <Button fullWidth variant="contained"  disabled={!email } onClick={() => setStep(2)} sx={{borderRadius:16,mb:16,textTransform:"none",fontFamily:"Satoshi",bgColor:"#3C7EFC"}}>
            Submit
          </Button>
        </Box>
      )}

      {step === 2 && (
        <Box>
          <Typography textAlign="center" sx={{fontFamily:"Satoshi",color:"#808195",fontWeight:"500",}}>
           We have sent The OTP to  {email}. Please check and enter the otp below to verify your account
          </Typography>
          <Typography
              textAlign="center"
              sx={{
                fontFamily: "Satoshi",
                color: "#FF6B6B",
                fontSize: "12px",
                fontStyle: "italic",
                mt: 1,
              }}
            >
              Note: Please check your junk or spam folder if you don’t see the email in your inbox.
            </Typography>
          <TextField
            fullWidth
            placeholder="please enter the otp here"
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 18,
              },
            }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button fullWidth variant="link" sx={{ mt: 4,fontFamily:"Satoshi",color:"#474E68",fontWeight:"500",textTransform:"none" }}>
          Didn’t Receive Code?  <Box component="span" sx={{ color: "#3C7EFC", ml: 1 }}  onClick={sendOtp}>
    Resend Code
  </Box>
          </Button>
          <Button fullWidth variant="contained" color="primary" onClick={handleOtpSubmit} sx={{ mt: 2,borderRadius:16,mb:8,textTransform:"none",fontFamily:"Satoshi",fontSize:"16px" }}>
          {loading && <CircularProgress size={20} sx={{ color: "white",  }} />}
            Verify OTP
          </Button>
        </Box>
      )}

      {step === 3 && (
        <Box>
          <Typography  gutterBottom color="#24252C" fontWeight={700} fontFamily={"Satoshi"} fontSize={"16px"} >
          New Password *
      </Typography>
          <TextField
            fullWidth
            placeholder="enter your new password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 18,
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
          <Typography  gutterBottom color="#24252C" fontWeight={700} fontFamily={"Satoshi"} fontSize={"16px"} sx={{mt:2}} >
          Confirm Password *
      </Typography>
          <TextField
            fullWidth
            placeholder="confirm your password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 18,
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
          {error && <Typography color="error">{error}</Typography>}
          <Button fullWidth variant="contained" color="primary" onClick={handlePasswordChange} sx={{ borderRadius:16,fontFamily:"Satoshi",textTransform:"none",mb:8,mt:4 }}>
            Change Password
          </Button>
        </Box>
      )}

      <Modal open={successModal} onClose={() => setSuccessModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 3, textAlign: "center" }}>
          <Typography sx={{fontFamily:"Poppins",fontWeight:500,fontSize:"20px"}} color="success">Your Password has been changed successfully!</Typography>
        </Box>
      </Modal>
    </Box>
    </Box>
  );
};

export default PasswordChange;
