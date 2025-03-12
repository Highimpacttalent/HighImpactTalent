import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Paper, Typography, Button, Avatar } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import RobotFaceIcon from "@mui/icons-material/SmartToy";

const AskJarvis = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("welcome");
  const navigate = useNavigate();

  const toggleChat = () => {
    setOpen(!open);
    setStep("welcome"); // Reset to welcome screen when reopening
  };

  return (
    <Box position="fixed" bottom={20} right={20} zIndex={1000} textAlign="center">
      {/* Floating Assistant Button */}
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
            Ask Jarvis
          </Typography>
        </Box>
      )}

      {/* Chat Window */}
      {open && (
        <Paper
          sx={{
            width: 350,
            p: 2,
            boxShadow: 5,
            borderRadius: 3,
            bgcolor: "white",
            border: "2px solid #00b4d8",
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: "#00b4d8", mr: 1 }}>
                <RobotFaceIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="bold">
                Ask Jarvis
              </Typography>
            </Box>
            <IconButton size="small" onClick={toggleChat}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages Based on Step */}
          <Box
            height={250}
            overflow="auto"
            mt={2}
            p={1}
            bgcolor="#f3f4f6"
            borderRadius={1}
            sx={{ scrollbarWidth: "thin", scrollbarColor: "#ccc #f3f4f6" }}
          >
            {step === "welcome" && (
              <>
                <Typography>
                  <strong>Jarvis:</strong> Welcome to <b>High Impact Talent</b>! Your best place for hiring and getting hired.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2, width: "100%", bgcolor: "#00b4d8", "&:hover": { bgcolor: "#0096c7" } }}
                  onClick={() => setStep("userType")}
                >
                  Need Help?
                </Button>
              </>
            )}

            {step === "userType" && (
              <>
                <Typography>
                  <strong>Jarvis:</strong> Are you a <b>User</b> or a <b>Recruiter</b>?
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2, width: "100%", bgcolor: "#00b4d8", "&:hover": { bgcolor: "#0096c7" } }}
                  onClick={() => setStep("userOptions")}
                >
                  I am a User 👤
                </Button>
                <Button
                  variant="contained"
                  sx={{ mt: 2, width: "100%", bgcolor: "#0077b6", "&:hover": { bgcolor: "#005f87" } }}
                  onClick={() => setStep("recruiterOptions")}
                >
                  I am a Recruiter 💼
                </Button>
              </>
            )}

            {/* User Options */}
            {step === "userOptions" && (
              <>
                <Typography>
                  <strong>Jarvis:</strong> What are you looking for?
                </Typography>
                {[
                  { label: "Find Job Page", path: "/find-jobs" },
                  { label: "Application Status Page", path: "/application-tracking" },
                  { label: "Companies List Page", path: "/companies" },
                  { label: "Login/Register Page", path: "/u-login" },
                  { label: "Edit Profile", path: "/user-profile" },
                  { label: "Change Password", path: "/password" },
                  { label: "Blog Page", path: "/blog" },
                  { label: "Other Issues (Report)", path: "/contact-us" },
                ].map((option) => (
                  <Button
                    key={option.label}
                    variant="outlined"
                    sx={{ mt: 1, width: "100%" }}
                    onClick={() => navigate(option.path)}
                  >
                    {option.label}
                  </Button>
                ))}
              </>
            )}

            {/* Recruiter Options */}
            {step === "recruiterOptions" && (
              <>
                <Typography>
                  <strong>Jarvis:</strong> Let me help you, tell me what are you searching for?
                </Typography>
                {[
                  { label: "Upload Job", path: "/upload-a-job" },
                  { label: "View Responses on Posted Job", path: "/view-jobs" },
                  { label: "Resume Search", path: "/resumesearch" },
                  { label: "Login/Register", path: "/r-login" },
                  { label: "Change Password", path: "/password" },
                  { label: "Facing Any Other Issue? Report It", path: "/contact-us" },
                ].map((option) => (
                  <Button
                    key={option.label}
                    variant="outlined"
                    sx={{ mt: 1, width: "100%" }}
                    onClick={() => navigate(option.path)}
                  >
                    {option.label}
                  </Button>
                ))}
              </>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AskJarvis;
