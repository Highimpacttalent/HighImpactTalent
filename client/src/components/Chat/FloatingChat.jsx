import { useState } from "react";
import { Box, IconButton, Paper, Typography, Button, Avatar, TextField, CircularProgress } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import RobotFaceIcon from "@mui/icons-material/SmartToy";
import axios from "axios";

const AskJarvis = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("welcome");
  const [userData, setUserData] = useState({ name: "", issue: "", email: "", contact: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleChat = () => {
    setOpen(!open);
    setStep("welcome");
    setUserData({ name: "", issue: "", email: "", contact: "" });
    setError("");
    setSuccessMessage("");
  };

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const requestData = {
      subject: "User Issue Reporting",
      name: userData.name,
      email: userData.email,
      message: `Phone: ${userData.contact}, Issue: ${userData.issue}`,
    };

    try {
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

      {open && (
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
                <Typography><strong>Jarvis:</strong> Are you facing any problem? Need help?</Typography>
                <Button variant="contained" sx={{ mt: 2, width: "100%" }} onClick={() => setStep("getName")}>
                  Need Help
                </Button>
              </>
            )}

            {step === "getName" && (
              <>
                <Typography><strong>Jarvis:</strong> Tell us your good name.</Typography>
                <TextField fullWidth size="small" sx={{ mt: 2 }} onChange={(e) => handleChange("name", e.target.value)} />
                <Button variant="contained" sx={{ mt: 2, width: "100%" }} onClick={() => setStep("getIssue")}>
                  Next
                </Button>
              </>
            )}

            {step === "getIssue" && (
              <>
                <Typography><strong>Jarvis:</strong> Hi {userData.name}, tell us about the issue you are facing.</Typography>
                <TextField fullWidth multiline rows={2} sx={{ mt: 2 }} onChange={(e) => handleChange("issue", e.target.value)} />
                <Button variant="contained" sx={{ mt: 2, width: "100%" }} onClick={() => setStep("getEmail")}>
                  Next
                </Button>
              </>
            )}

            {step === "getEmail" && (
              <>
                <Typography><strong>Jarvis:</strong> Please provide your email ID.</Typography>
                <TextField fullWidth size="small" sx={{ mt: 2 }} onChange={(e) => handleChange("email", e.target.value)} />
                {error && <Typography color="error">{error}</Typography>}
                <Button
                  variant="contained"
                  sx={{ mt: 2, width: "100%" }}
                  onClick={() => {
                    if (!validateEmail(userData.email)) {
                      setError("Invalid email format");
                    } else {
                      setError("");
                      setStep("getContact");
                    }
                  }}
                >
                  Next
                </Button>
              </>
            )}

            {step === "getContact" && (
              <>
                <Typography><strong>Jarvis:</strong> Please provide your contact number.</Typography>
                <TextField fullWidth size="small" sx={{ mt: 2 }} onChange={(e) => handleChange("contact", e.target.value)} />
                {error && <Typography color="error">{error}</Typography>}
                <Button
                  variant="contained"
                  sx={{ mt: 2, width: "100%" }}
                  onClick={() => {
                    if (!validatePhone(userData.contact)) {
                      setError("Invalid phone number.");
                    } else {
                      setError("");
                      handleSubmit();
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                </Button>
              </>
            )}

            {step === "thankYou" && (
              <>
                <Typography><strong>Jarvis:</strong> {successMessage || "Thank you! Our team will contact you soon."}</Typography>
                <Button variant="contained" sx={{ mt: 2, width: "100%" }} onClick={toggleChat}>
                  End Chat
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
