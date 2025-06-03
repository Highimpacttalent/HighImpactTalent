import { useState, useEffect } from "react";
import { Box, IconButton, Paper, Typography, Button, Avatar, TextField, CircularProgress, Stack, Fade, Slide, Divider } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SendIcon from "@mui/icons-material/Send";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatbotAvatar from "../../assets/ChatbotAvatar.png"; 

const PremiumChatbot = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentStep, setCurrentStep] = useState("welcome");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ issue: "" });
  const [storedUser, setStoredUser] = useState(null);
  const [hasRequiredInfo, setHasRequiredInfo] = useState(false);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
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
    
    const handleStorageChange = () => {
      checkUserInfo();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  const addMessage = (content, isBot = true, delay = 0) => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        content,
        isBot,
        timestamp: new Date()
      }]);
    }, delay);
  };

  const initializeChat = () => {
    const firstName = storedUser?.firstName || "there";
    const welcomeMessages = [
      `Hey ${firstName}! 👋 Koustubh here, your career concierge.`,
      "I'm here to make your hiring journey as smooth as your morning coffee ☕",
      "What brings you to our corner of the talent universe today?"
    ];

    setMessages([]);
    welcomeMessages.forEach((msg, index) => {
      addMessage(msg, true, index * 1500);
    });

    setTimeout(() => {
      addMessage("", false, 0); // Placeholder for user input
      setCurrentStep("listening");
    }, welcomeMessages.length * 1500 + 500);
  };

  const toggleChat = () => {
    const currentUser = JSON.parse(localStorage.getItem("userInfo")) || user;
    if (!currentUser?.email) {
      openWhatsApp();
      return;
    }
    
    setOpen(!open);
    if (!open) {
      setTimeout(initializeChat, 300);
    } else {
      setMessages([]);
      setCurrentStep("welcome");
      setCurrentInput("");
      setUserData({ issue: "" });
    }
  };

  const handleUserMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage = currentInput.trim();
    setCurrentInput("");
    
    // Add user message
    addMessage(userMessage, false);

    // Remove the input placeholder
    setMessages(prev => prev.filter(msg => msg.content !== ""));

    // Bot responses based on conversation flow
    if (currentStep === "listening") {
      setTimeout(() => {
        addMessage("Ah, I see! 🤔 Let me put on my problem-solving cape...", true);
      }, 800);

      setTimeout(() => {
        addMessage("Could you paint me a clearer picture? The more details you share, the better I can assist you.", true);
      }, 2300);

      setTimeout(() => {
        addMessage("", false);
        setCurrentStep("gathering");
        setUserData({...userData, issue: userMessage});
      }, 3800);

    } else if (currentStep === "gathering") {
      setUserData({...userData, issue: userData.issue + " " + userMessage});
      
      setTimeout(() => {
        addMessage("Perfect! 🎯 I've got all the intel I need.", true);
      }, 800);

      setTimeout(() => {
        addMessage("I'm connecting you with our talent wizards who'll work their magic on your request.", true);
      }, 2300);

      setTimeout(() => {
        handleSubmit(userData.issue + " " + userMessage);
      }, 3500);
    }
  };

  const handleSubmit = async (fullIssue) => {
    setLoading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem("userInfo")) || user;
      const requestData = {
        subject: "Premium Support Request - Talent Acquisition",
        name: `${currentUser.firstName} ${currentUser.lastName || ''}`.trim(),
        email: currentUser.email,
        message: `Career Consultation Request:\n\n${fullIssue}\n\nClient: ${currentUser.firstName} ${currentUser.lastName || ''}\nEmail: ${currentUser.email}`,
      };

      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/sendmail/contactus",
        requestData
      );

      if (response.data.success) {
        setTimeout(() => {
          addMessage("🎉 Mission accomplished! Your request has been delivered to our expert team.", true);
        }, 1000);

        setTimeout(() => {
          addMessage(`We'll reach out to you at ${currentUser.email} faster than you can say 'dream job'!`, true);
        }, 2500);

        setTimeout(() => {
          addMessage("Anything else I can help you conquer today?", true);
        }, 4000);

        setCurrentStep("completed");
      }
    } catch (error) {
      setTimeout(() => {
        addMessage("Oops! Seems like our digital wires got crossed. Mind giving it another shot?", true);
      }, 1000);
      
      setTimeout(() => {
        addMessage("", false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const whatsappNumber = "918332052215";
    const message = "Hello, I need assistance with ";
    const encoded = encodeURIComponent(message);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const url = isMobile
      ? // native app
        `whatsapp://send?phone=${whatsappNumber}&text=${encoded}`
      : // universal link (works desktop & mobile web)
        `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encoded}`;

    window.open(url, "_blank");
  };

  const MessageBubble = ({ message, isBot }) => (
    <Fade in={true} timeout={600}>
      <Box
        display="flex"
        justifyContent={isBot ? "flex-start" : "flex-end"}
        mb={2}
        alignItems="flex-end"
      >
        {isBot && (
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 32,
              height: 32,
              mr: 1,
              fontSize: "14px"
            }}
          >
            K
          </Avatar>
        )}
        <Paper
          sx={{
            p: 2,
            maxWidth: "75%",
            bgcolor: isBot ? "#f8f9fa" : "#1976d2",
            color: isBot ? "#333" : "white",
            borderRadius: isBot ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: isBot ? "1px solid #e0e0e0" : "none"
          }}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
            {message.content}
          </Typography>
        </Paper>
        {!isBot && (
          <Avatar
            sx={{
              bgcolor: "#666",
              width: 32,
              height: 32,
              ml: 1,
              fontSize: "14px"
            }}
          >
            {storedUser?.firstName?.charAt(0) || "U"}
          </Avatar>
        )}
      </Box>
    </Fade>
  );

  return (
    <Box position="fixed" bottom={20} right={20} zIndex={1000} textAlign="center">
      {!open && (
        <Box>
          <IconButton
            onClick={toggleChat}
            sx={{
              width: 120,
              height: 120,
            }}
          >
            <img src={ChatbotAvatar} alt="" />
          </IconButton>
          <Typography 
            fontSize="12px" 
            fontWeight="600" 
            mt={1} 
            color="black"
            fontFamily="Satoshi, sans-serif"
            sx={{ letterSpacing: "0.5px" }}
          >
            Facing an issue?<br/> Ask Koustubh for help
          </Typography>
        </Box>
      )}

      {/* Main Chat Interface */}
      {open && storedUser?.email && (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Paper sx={{ 
            width: {md:380,lg:380,sm: 300, xs: 300}, 
            height: 520,
            boxShadow: "0 12px 48px rgba(0,0,0,0.15)",
            borderRadius: 4, 
            bgcolor: "white",
            border: "2px solid #1976d2",  
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Header */}
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="space-between"
              p={3}
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                color: "white",
                borderRadius: "14px 14px 0 0"
              }}
            >
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2, width: 44, height: 44 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="700">
                    Koustubh
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Career Concierge • Online
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                size="small" 
                onClick={toggleChat}
                sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Messages Area */}
            <Box 
              flex={1}
              overflow="auto" 
              p={2}
              sx={{
                bgcolor: "#fafafa",
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: 3 }
              }}
            >
              {messages.map((message) => (
                message.content && <MessageBubble key={message.id} message={message} isBot={message.isBot} />
              ))}
              
              {loading && (
                <Box display="flex" justifyContent="center" my={2}>
                  <CircularProgress size={24} sx={{ color: "#1976d2" }} />
                </Box>
              )}
            </Box>

            {/* Input Area */}
            {(currentStep === "listening" || currentStep === "gathering") && (
              <Box sx={{ bgcolor: "white", borderTop: "1px solid #e0e0e0" }}>
                <Box p={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      fullWidth
                      placeholder="Type your message..."
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 6,
                          bgcolor: "#f8f9fa"
                        }
                      }}
                    />
                    <IconButton
                      onClick={handleUserMessage}
                      disabled={!currentInput.trim()}
                      sx={{
                        bgcolor: "#1976d2",
                        color: "white",
                        width: 40,
                        height: 40,
                        "&:hover": { bgcolor: "#1565c0" },
                        "&:disabled": { bgcolor: "#ccc" }
                      }}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* WhatsApp Quick Connect */}
                <Box>
                  <Divider sx={{ borderColor: "#e8f4fd" }} />
                  <Box p={2} sx={{ bgcolor: "#f8fbff" }}>
                    <Button
                      onClick={openWhatsApp}
                      startIcon={<FlashOnIcon sx={{ color: "#ff9800" }} />}
                      endIcon={<WhatsAppIcon sx={{ color: "#25D366" }} />}
                      fullWidth
                      variant="outlined"
                      sx={{
                        py: 1.2,
                        borderRadius: 3,
                        fontWeight: "600",
                        fontSize: "13px",
                        color: "#1976d2",
                        borderColor: "#e3f2fd",
                        bgcolor: "white",
                        textTransform: "none",
                        boxShadow: "0 2px 8px rgba(25, 118, 210, 0.1)",
                        "&:hover": { 
                          bgcolor: "#e3f2fd", 
                          borderColor: "#1976d2",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)"
                        },
                        transition: "all 0.3s ease"
                      }}
                    >
                      Something Urgent? Connect via WhatsApp
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Action Buttons for Completed State */}
            {currentStep === "completed" && (
              <Box sx={{ bgcolor: "white", borderTop: "1px solid #e0e0e0" }}>
                <Box p={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={toggleChat}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: "600",
                      color: "#1976d2",
                      borderColor: "#1976d2",
                      mb: 1
                    }}
                  >
                    Close Chat
                  </Button>
                </Box>
                
                {/* WhatsApp Quick Connect for Completed State */}
                <Box>
                  <Divider sx={{ borderColor: "#e8f4fd" }} />
                  <Box p={2} sx={{ bgcolor: "#f8fbff" }}>
                    <Button
                      onClick={openWhatsApp}
                      startIcon={<FlashOnIcon sx={{ color: "#ff9800" }} />}
                      endIcon={<WhatsAppIcon sx={{ color: "#25D366" }} />}
                      fullWidth
                      variant="outlined"
                      sx={{
                        py: 1.2,
                        borderRadius: 3,
                        fontWeight: "600",
                        fontSize: "13px",
                        color: "#1976d2",
                        borderColor: "#e3f2fd",
                        bgcolor: "white",
                        textTransform: "none",
                        boxShadow: "0 2px 8px rgba(25, 118, 210, 0.1)",
                        "&:hover": { 
                          bgcolor: "#e3f2fd", 
                          borderColor: "#1976d2",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)"
                        },
                        transition: "all 0.3s ease"
                      }}
                    >
                      Need More Help? Connect via WhatsApp
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
        </Slide>
      )}
    </Box>
  );
};

export default PremiumChatbot;