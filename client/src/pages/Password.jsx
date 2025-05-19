import React, { useState, useEffect } from "react";
import { IconButton, TextField, Button, InputAdornment, Typography, Box, Modal, CircularProgress, Link } from "@mui/material";
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
  const [showPassword, setShowPassword] = useState(false);
  
  // Password strength states
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordGuide, setShowPasswordGuide] = useState(false);
  
  // Password validation criteria states
  const [lengthValid, setLengthValid] = useState(false);
  const [uppercaseValid, setUppercaseValid] = useState(false);
  const [lowercaseValid, setLowercaseValid] = useState(false);
  const [numberValid, setNumberValid] = useState(false);
  const [specialCharValid, setSpecialCharValid] = useState(false);

  // Generate a random OTP (0-9999) and send it when the component is first loaded
  useEffect(() => {
    if (step === 2) {
      sendOtp();
    }
  }, [step]);

  // Check password strength whenever password changes
  useEffect(() => {
    if (newPassword) {
      checkPasswordStrength(newPassword);
      setShowPasswordGuide(true);
    } else {
      setPasswordStrength("");
      setPasswordError("");
      setShowPasswordGuide(false);
    }
  }, [newPassword]);

  const checkPasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Update individual criteria states
    setLengthValid(lengthCriteria);
    setUppercaseValid(uppercaseCriteria);
    setLowercaseValid(lowercaseCriteria);
    setNumberValid(numberCriteria);
    setSpecialCharValid(specialCharCriteria);

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

  const handleEmailCheck = async () => {
    if (!email) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/user/check-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      

      if (res.ok && data.success && data.exists) {
        setError("");
        setStep(2);
      } else if (res.ok && data.success && !data.exists) {  
        setError("That email isn't registered with us.");
      } else {
        throw new Error(data.message || "Email check failed");
      }
    } catch (err) {
      setError(err.message);
    } finally{ 
      setLoading(false);
    }
  };

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

    if (passwordStrength === "Weak Password") {
      setError("Please use a stronger password before proceeding.");
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
        navigate("/u-login"); // Redirect after success
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  // Function to get color based on validation status
  const getValidationColor = (isValid) => isValid ? "#4CAF50" : "#808195";

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
      {error &&  <Typography
              textAlign="center"
              sx={{
                fontFamily: "Satoshi",
                color: "#FF6B6B",
                fontSize: "12px",
                fontStyle: "italic",
                mt: 1,
                mb:1
              }}
            >We couldn't find an account associated with that email address. Please double-check and try again.</Typography>}
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
            
          <Button fullWidth variant="contained"  disabled={!email } onClick={handleEmailCheck} sx={{borderRadius:16,mb:16,textTransform:"none",fontFamily:"Satoshi",bgColor:"#3C7EFC"}}>
           {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Submit"
              )}
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
              Note: Please check your junk or spam folder if you don't see the email in your inbox.
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
          Didn't Receive Code?  <Box component="span" sx={{ color: "#3C7EFC", ml: 1 }}  onClick={sendOtp}>
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
          <Typography gutterBottom color="#24252C" fontWeight={700} fontFamily={"Satoshi"} fontSize={"16px"} >
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
          
          {/* Password strength indicator */}
          {passwordStrength && (
            <Box sx={{ mt: 1, mb: 1 }}>
              <Typography 
                sx={{ 
                  fontFamily: "Satoshi", 
                  fontWeight: 600, 
                  fontSize: "14px",
                  color: passwordStrength === "Strong Password" 
                    ? "#4CAF50" 
                    : passwordStrength === "Medium Password" 
                      ? "#FF9800" 
                      : "#F44336" 
                }}
              >
                {passwordStrength}
              </Typography>
              
              {passwordError && (
                <Typography
                  sx={{
                    fontFamily: "Satoshi",
                    color: "#FF6B6B",
                    fontSize: "12px",
                    fontStyle: "italic",
                  }}
                >
                  {passwordError}
                </Typography>
              )}
            </Box>
          )}
          
          {/* Password guidelines */}
          {showPasswordGuide && (
            <Box sx={{ mt: 1, mb: 2, p: 2, bgcolor: "#F5F5F5", borderRadius: 2 }}>
              <Typography sx={{ fontFamily: "Satoshi", fontWeight: 600, fontSize: "14px", mb: 1 }}>
                A strong password typically includes:
              </Typography>
              <Typography sx={{ fontFamily: "Satoshi", fontSize: "14px", color: getValidationColor(lengthValid), mb: 0.5 }}>
                • At least 8 characters
              </Typography>
              <Typography sx={{ fontFamily: "Satoshi", fontSize: "14px", color: getValidationColor(uppercaseValid), mb: 0.5 }}>
                • Uppercase letters
              </Typography>
              <Typography sx={{ fontFamily: "Satoshi", fontSize: "14px", color: getValidationColor(lowercaseValid), mb: 0.5 }}>
                • Lowercase letters
              </Typography>
              <Typography sx={{ fontFamily: "Satoshi", fontSize: "14px", color: getValidationColor(numberValid), mb: 0.5 }}>
                • At least one number
              </Typography>
              <Typography sx={{ fontFamily: "Satoshi", fontSize: "14px", color: getValidationColor(specialCharValid) }}>
                • At least one special character (e.g. !@#$%)
              </Typography>
            </Box>
          )}
          
          <Typography gutterBottom color="#24252C" fontWeight={700} fontFamily={"Satoshi"} fontSize={"16px"} sx={{mt:2}} >
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
          
          {/* Password match error */}
          {confirmPassword && newPassword !== confirmPassword && (
            <Typography
              sx={{
                fontFamily: "Satoshi",
                color: "#FF6B6B",
                fontSize: "12px",
                fontStyle: "italic",
                mt: 1,
              }}
            >
              Passwords do not match
            </Typography>
          )}
          
          {error && (
            <Typography 
              sx={{
                fontFamily: "Satoshi",
                color: "#FF6B6B",
                fontSize: "14px",
                fontWeight: 500,
                mt: 2,
              }}
            >{error}</Typography>
          )}
          
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            onClick={handlePasswordChange} 
            disabled={passwordStrength === "Weak Password" || newPassword !== confirmPassword || !newPassword}
            sx={{ 
              borderRadius: 16,
              fontFamily: "Satoshi",
              textTransform: "none",
              mb: 8,
              mt: 4 
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Change Password"
            )}
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