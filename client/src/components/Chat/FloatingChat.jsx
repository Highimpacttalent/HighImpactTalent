import { useState, useEffect } from "react";
import { Box, IconButton, Paper, Typography, Button, Avatar, TextField, CircularProgress, Stack } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import RobotFaceIcon from "@mui/icons-material/SmartToy";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SupportOptions = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("welcome");
  const [userData, setUserData] = useState({ issue: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [hasRequiredInfo, setHasRequiredInfo] = useState(false);
  const [storedUser, setStoredUser] = useState(null);
  const [whatsAppOptionsOpen, setWhatsAppOptionsOpen] = useState(false);
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

  const openWhatsApp = () => {
    const whatsappNumber = "918332052215"; 
    
    // Get current user information
    const currentUser = JSON.parse(localStorage.getItem("userInfo")) || user || {};
    
    // Prepare message with user info if available
    let message;
    if (currentUser.email) {
      const userName = currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : "User";
      message = `Hello, my name is ${userName}. I need assistance with `;
    } else {
      message = "Hello, I need assistance with ";
    }
    
    // Make sure the message is properly encoded for URL parameters
    const encodedMessage = encodeURIComponent(message);
    
    // Detect mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile - use whatsapp:// protocol for native app only
      // Using the proper format for WhatsApp deep linking on mobile
      window.location.href = `whatsapp://send/?phone=${whatsappNumber}&text=${encodedMessage}`;
    } else {
      // For desktop, provide two options in the component
      setWhatsAppOptionsOpen(true);
    }
  };

  return (
    <Box position="fixed" bottom={20} right={20} zIndex={1000} textAlign="center">
      {!open && !whatsAppOptionsOpen && (
        <Stack spacing={2} alignItems="center">
          {/* WhatsApp Button */}
          <Box>
            <IconButton
              onClick={openWhatsApp}
              sx={{
                bgcolor: "#25D366", 
                color: "white",
                boxShadow: 4,
                width: 60,
                height: 60,
                borderRadius: "50%",
                transition: "0.3s",
                "&:hover": { bgcolor: "#128C7E" }, 
              }}
            >
              <WhatsAppIcon fontSize="large" />
            </IconButton>
            <Typography fontSize="14px" fontWeight="bold" mt={1} color="gray">
              WhatsApp
            </Typography>
          </Box>

          {/* Chat Button */}
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
              Live Chat
            </Typography>
          </Box>
        </Stack>
      )}

      {/* WhatsApp Options Dialog for Desktop */}
      {whatsAppOptionsOpen && (
        <Paper sx={{ width: 250, p: 2, boxShadow: 5, borderRadius: 3, bgcolor: "white", border: "2px solid #25D366" }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: "#25D366", mr: 1 }}>
                <WhatsAppIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="bold">WhatsApp</Typography>
            </Box>
            <IconButton size="small" onClick={() => setWhatsAppOptionsOpen(false)}><CloseIcon /></IconButton>
          </Box>

          <Typography variant="body2" mt={2} mb={2} textAlign="center">
            Choose how you want to open WhatsApp
          </Typography>

          <Stack spacing={2}>
            <Button 
              variant="contained" 
              fullWidth
              startIcon={<WhatsAppIcon />}
              onClick={() => {
                const whatsappNumber = "918332052215";
                const currentUser = JSON.parse(localStorage.getItem("userInfo")) || user || {};
                let message = currentUser.email 
                  ? `Hello, my name is ${currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : "User"}. I need assistance with `
                  : "Hello, I need assistance with ";
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://web.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodedMessage}`, '_blank');
                setWhatsAppOptionsOpen(false);
              }}
              sx={{ bgcolor: "#25D366", "&:hover": { bgcolor: "#128C7E" } }}
            >
              WhatsApp Web
            </Button>
            <Button 
              variant="outlined" 
              fullWidth
              startIcon={<WhatsAppIcon />}
              onClick={() => {
                const whatsappNumber = "918332052215";
                const currentUser = JSON.parse(localStorage.getItem("userInfo")) || user || {};
                let message = currentUser.email 
                  ? `Hello, my name is ${currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : "User"}. I need assistance with `
                  : "Hello, I need assistance with ";
                const encodedMessage = encodeURIComponent(message);
                window.location.href = `whatsapp://send/?phone=${whatsappNumber}&text=${encodedMessage}`;
                setWhatsAppOptionsOpen(false);
              }}
              sx={{ color: "#25D366", borderColor: "#25D366", "&:hover": { borderColor: "#128C7E", color: "#128C7E" } }}
            >
              WhatsApp Desktop App
            </Button>
          </Stack>
        </Paper>
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

export default SupportOptions;