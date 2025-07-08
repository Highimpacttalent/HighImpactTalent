import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  TextField,
  Grid,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Fade,
  Backdrop,
  Tooltip,
  Container,
} from "@mui/material";
import {
  AutoAwesome,
  PersonOutline,
  WorkOutline,
  VisibilityOutlined,
  DownloadOutlined,
  AddCircleOutline,
  SmartToyOutlined,
  RocketLaunchOutlined,
  Close,
  CheckCircle,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [jdModalOpen, setJdModalOpen] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [storedResumes, setStoredResumes] = useState([]);
  const [profileComplete, setProfileComplete] = useState(0);

  const calculateProfileCompletion = (data) => {
    if (!data) return 0;

    let totalFields = 7;
    let filledFields = 0;

    if (data.education?.length > 0) filledFields++;
    if (data.workExperience?.length > 0) filledFields++;
    if (data.projects?.length > 0) filledFields++;
    if (data.skills?.length > 0) filledFields++;
    if (data.achievements?.length > 0) filledFields++;
    if (data.awards?.length > 0) filledFields++;
    if (data.volunteer?.length > 0) filledFields++;

    return Math.floor((filledFields / totalFields) * 100);
  };

  const fetchResume = async () => {
    try {
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/master-resume/fetch-id",
        { userId: user._id }
      );
      const data = response.data;
      setResumeData(data);
      setStoredResumes(data.storedResumes || []);
      setProfileComplete(calculateProfileCompletion(data));
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch resume data", error);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  // Mock user data - replace with actual user data
  const userData = {
    name: user.firstName + " " + user.lastName,
    profileComplete: profileComplete,
  };

  const handleJdSubmit = async () => {
    if (!jobDescription.trim()) return;

    setIsGenerating(true);

    try {
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/master-resume/ai-tailored-resume",
        {
          user_id: user._id,
          jobDescription: jobDescription.trim(),
        }
      );

      const { pdfUrl } = response.data;
      setGeneratedPdfUrl(pdfUrl);
      setIsGenerating(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error generating AI resume:", error);
      setIsGenerating(false);
    }
  };

  const handleCloseModal = () => {
    if (!isGenerating) {
      setJdModalOpen(false);
      setJobDescription("");
      setGeneratedPdfUrl("");
      fetchResume(); // re-fetch resumes
    }
  };

  const handleResumeView = (url) => {
    window.open(url, "_blank");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ bgcolor: "white" }}>
      <Container maxWidth="lg" sx={{ py: 4, bgcolor: "white" }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mr: 3,
                bgcolor: "#1976d2",
                fontSize: "1.5rem",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {getInitials(userData.name)}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "#1976d2",
                  mb: 0.5,
                }}
              >
                Welcome, {userData.name}!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Ready to create your next AI-powered resume?
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => (window.location.href = "/master-resume")}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonOutline sx={{ fontSize: 32, mr: 2 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Master Resume
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Satoshi, sans-serif",
                    opacity: 0.9,
                    mb: 2,
                  }}
                >
                  Complete your profile and manage your core information
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={userData.profileComplete}
                    sx={{
                      flexGrow: 1,
                      mr: 2,
                      bgcolor: "rgba(255,255,255,0.2)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "white",
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    {userData.profileComplete}%
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  onClick={() => (window.location.href = "/master-resume")}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 600,
                    background: "white",
                    color: "#1976d2",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                border: "2px solid #1976d2",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(25,118,210,0.15)",
                },
              }}
              onClick={() => setJdModalOpen(true)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AutoAwesome sx={{ fontSize: 32, mr: 2, color: "#1976d2" }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      color: "#1976d2",
                    }}
                  >
                    Generate AI Resume
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontFamily: "Satoshi, sans-serif",
                    mb: 2,
                  }}
                >
                  Create a tailored resume based on job description using AI
                </Typography>
                <Chip
                  label="AI Powered"
                  icon={<SmartToyOutlined />}
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#1976d2",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 500,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Previous Resumes Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              mb: 3,
              color: "#1976d2",
            }}
          >
            Your AI-Generated Resumes
          </Typography>

          {storedResumes.length === 0 ? (
            <Paper
              elevation={1}
              sx={{
                p: 6,
                textAlign: "center",
                bgcolor: "#f8f9fa",
                border: "2px dashed #e0e0e0",
              }}
            >
              <WorkOutline sx={{ fontSize: 64, color: "#bdbdbd", mb: 2 }} />
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  mb: 1,
                }}
              >
                No resumes yet
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Create your first AI-powered resume by entering a job
                description
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {storedResumes.map((resume, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#e3f2fd",
                            color: "#1976d2",
                            width: 40,
                            height: 40,
                            mr: 2,
                          }}
                        >
                          <WorkOutline />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 600,
                              fontSize: "1rem",
                              color: "#1976d2",
                            }}
                          >
                            {resume.resumeName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontFamily: "Satoshi, sans-serif" }}
                          >
                            Resume #{index + 1}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontFamily: "Satoshi, sans-serif",
                          mb: 2,
                        }}
                      >
                        Saved resume accessible below
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Resume">
                          <IconButton
                            size="small"
                            onClick={() => window.open(resume.link, "_blank")}
                            sx={{
                              bgcolor: "#e3f2fd",
                              color: "#1976d2",
                              "&:hover": {
                                bgcolor: "#bbdefb",
                              },
                            }}
                          >
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Resume">
                          <IconButton
                            size="small"
                            component="a"
                            href={resume.link}
                            download
                            sx={{
                              bgcolor: "#e8f5e8",
                              color: "#4caf50",
                              "&:hover": {
                                bgcolor: "#c8e6c9",
                              },
                            }}
                          >
                            <DownloadOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Job Description Modal */}
        <Modal
          open={jdModalOpen}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={jdModalOpen}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" },
                maxWidth: 600,
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 24,
                p: 4,
                maxHeight: "90vh",
                overflow: "auto",
              }}
            >
              {!isGenerating && !showSuccess && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <AutoAwesome
                      sx={{ fontSize: 32, mr: 2, color: "#1976d2" }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        color: "#1976d2",
                        flexGrow: 1,
                      }}
                    >
                      Create AI Resume
                    </Typography>
                    <IconButton
                      onClick={handleCloseModal}
                      sx={{ color: "text.secondary" }}
                    >
                      <Close />
                    </IconButton>
                  </Box>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      fontFamily: "Satoshi, sans-serif",
                      mb: 3,
                    }}
                  >
                    Paste the job description below and our AI will create a
                    tailored resume that matches the requirements perfectly.
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    variant="outlined"
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        fontFamily: "Satoshi, sans-serif",
                      },
                    }}
                  />

                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleCloseModal}
                      sx={{
                        fontFamily: "Satoshi, sans-serif",
                        textTransform: "none",
                        px: 3,
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleJdSubmit}
                      disabled={!jobDescription.trim()}
                      startIcon={<RocketLaunchOutlined />}
                      sx={{
                        fontFamily: "Satoshi, sans-serif",
                        textTransform: "none",
                        px: 3,
                        background:
                          "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                      }}
                    >
                      Generate AI Resume
                    </Button>
                  </Box>
                </>
              )}

              {isGenerating && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "#e3f2fd",
                        animation: "pulse 2s infinite",
                      }}
                    >
                      <SmartToyOutlined
                        sx={{ fontSize: 40, color: "#1976d2" }}
                      />
                    </Avatar>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      mb: 2,
                      color: "#1976d2",
                    }}
                  >
                    AI is crafting your resume...
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontFamily: "Satoshi, sans-serif",
                      mb: 3,
                    }}
                  >
                    Analyzing job requirements and tailoring your experience
                  </Typography>
                  <LinearProgress
                    sx={{
                      mb: 2,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "#e3f2fd",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#1976d2",
                      },
                    }}
                  />
                </Box>
              )}

              {showSuccess && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CheckCircle
                    sx={{
                      fontSize: 80,
                      color: "#4caf50",
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      mb: 2,
                      color: "#4caf50",
                    }}
                  >
                    Resume Generated Successfully!
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: "Satoshi, sans-serif", mb: 2 }}
                  >
                    Your AI-powered resume is ready to view
                  </Typography>

                  {generatedPdfUrl && (
                    <Button
                      variant="contained"
                      onClick={() => window.open(generatedPdfUrl, "_blank")}
                      sx={{
                        fontFamily: "Satoshi, sans-serif",
                        textTransform: "none",
                        px: 4,
                        background: "#1976d2",
                        "&:hover": { background: "#125ea4" },
                      }}
                    >
                      View Resume
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Fade>
        </Modal>

        <style jsx>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
        `}</style>
      </Container>
    </Box>
  );
};

export default Dashboard;
