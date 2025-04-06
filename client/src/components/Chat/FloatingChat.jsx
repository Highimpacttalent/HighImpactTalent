import { useState, useEffect } from "react";
import { Box, IconButton, Paper, Typography, Button, Avatar, TextField, CircularProgress } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import RobotFaceIcon from "@mui/icons-material/SmartToy";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AskJarvis = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("welcome");
  const [userData, setUserData] = useState({ issue: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [hasRequiredInfo, setHasRequiredInfo] = useState(false);
  const [storedUser, setStoredUser] = useState(null);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    // Check both localStorage and Redux store for user info
    const checkUserInfo = () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || user;
      if (userInfo && userInfo.email) {
        setHasRequiredInfo(true);
        setStoredUser(userInfo);
      } else {
        setHasRequiredInfo(false);
      }
    };

    checkUserInfo();
    
    // Add listener for storage changes to detect login/logout
    const handleStorageChange = () => {
      checkUserInfo();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]); // Add user from Redux as dependency

  const toggleChat = () => {
    // Re-check immediately before opening
    const currentUser = JSON.parse(localStorage.getItem("userInfo")) || user;
    if (!currentUser?.email) {
      navigate("/contact-us");
      return;
    }
    
    setOpen(!open);
    setStep("welcome");
    setUserData({ issue: "" });
    setError("");
    setSuccessMessage("");
  };

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!userData.issue || userData.issue.trim().length < 10) {
      setError("Please describe your issue in at least 10 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentUser = JSON.parse(localStorage.getItem("userInfo")) || user;
      const requestData = {
        subject: "User Issue Reporting",
        name: `${currentUser.firstName} ${currentUser.lastName || ''}`.trim(),
        email: currentUser.email,
        message: `Issue: ${userData.issue}`,
      };

      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/sendmail/contactus",
        requestData
      );

      if (response.data.success) {
        setSuccessMessage("Thank you! Our team will contact you soon.");
        setStep("thankYou");
      }
    } catch (error) {
      setError("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box position="fixed" bottom={20} right={20} zIndex={1000} textAlign="center">
      {!open && (
        <Box>
          <IconButton
            color="primary"
            onClick={toggleChat}
            sx={{
              bgcolor: "white",
              boxShadow: 4,
              width: 60,
              height: 60,
              borderRadius: "50%",
              transition: "0.3s",
              "&:hover": { bgcolor: "#00b4d8" },
            }}
          >
            <RobotFaceIcon fontSize="large" />
          </IconButton>
          <Typography fontSize="14px" fontWeight="bold" mt={1} color="gray">
            Need Help?
          </Typography>
        </Box>
      )}

      {open && storedUser?.email && (
        <Paper sx={{ width: 350, p: 2, boxShadow: 5, borderRadius: 3, bgcolor: "white", border: "2px solid #00b4d8" }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: "#00b4d8", mr: 1 }}>
                <RobotFaceIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="bold">Ask Jarvis</Typography>
            </Box>
            <IconButton size="small" onClick={toggleChat}><CloseIcon /></IconButton>
          </Box>

          <Box height={250} overflow="auto" mt={2} p={1} bgcolor="#f3f4f6" borderRadius={1}>
            {step === "welcome" && (
              <>
                <Typography><strong>Jarvis:</strong> Hello {storedUser.firstName}, are you facing any problem?</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  We'll contact you at {storedUser.email}
                </Typography>
                <Button variant="contained" sx={{ mt: 2, width: "100%" }} onClick={() => setStep("getIssue")}>
                  Need Help
                </Button>
              </>
            )}

            {step === "getIssue" && (
              <>
                <Typography><strong>Jarvis:</strong> Please describe your issue:</Typography>
                <TextField 
                  fullWidth 
                  multiline 
                  rows={4} 
                  sx={{ mt: 2 }} 
                  onChange={(e) => handleChange("issue", e.target.value)}
                  error={!!error}
                  helperText={error}
                />
                <Button
                  variant="contained"
                  sx={{ mt: 2, width: "100%" }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                </Button>
              </>
            )}

            {step === "thankYou" && (
              <>
                <Typography><strong>Jarvis:</strong> {successMessage}</Typography>
                <Typography variant="body2" mt={1}>
                  {/* We've received your request and will contact you soon. */}
                </Typography>
                <Button variant="contained" sx={{ mt: 2, width: "100%" }} onClick={toggleChat}>
                  Close Chat
                </Button>
              </>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AskJarvis;