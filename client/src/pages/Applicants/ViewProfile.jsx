import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Typography,
  Paper,
  Divider,
  Grid,
  Stack,
  Snackbar, 
  Badge,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import TimelineIcon from "@mui/icons-material/Timeline";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LaunchIcon from "@mui/icons-material/Launch";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ViewProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.applicant || {};
  const ScreeningQues = location.state?.screeningAnswers || [];
  console.log(userData);
  const applicationId = location.state?.applicationId || "";
  const [expanded, setExpanded] = useState({});
  const [expandedExperience, setExpandedExperience] = useState({});

  const validStatuses = [
    "Application Viewed",
    "Shortlisted",
    "Interviewing",
    "Hired",
  ];
  const initialStatus = validStatuses.includes(location.state?.status)
    ? location.state?.status
    : "Application Viewed";

  const [currentStatus, setStatus] = useState(initialStatus);
  const statusFlow = {
    "Application Viewed": "Shortlist",
    Shortlisted: "Interview",
    Interviewing: "Hire",
  };

  const nextAction = statusFlow[currentStatus];

  const handleToggle = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleExperienceToggle = (index) => {
    setExpandedExperience((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleStatusUpdate = async () => {
    const statusMap = {
      Shortlist: "Shortlisted",
      Interview: "Interviewing",
      Hire: "Hired",
    };

    const statusToSend = statusMap[nextAction];

    if (!statusToSend) {
      alert("Invalid next action.");
      return;
    }

    try {
      const token = currentUser?.token;

      const res = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/application/update-single-status",
        {
          applicationId,
          status: statusToSend,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200 || res.data.success) {
        setStatus(statusToSend);
      } else {
        alert("Unable to update status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Unable to update status.");
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Application Viewed":
        return { color: "#F59E0B", bg: "#FEF3C7", text: "#92400E" };
      case "Shortlisted":
        return { color: "#3B82F6", bg: "#DBEAFE", text: "#1E40AF" };
      case "Interviewing":
        return { color: "#8B5CF6", bg: "#EDE9FE", text: "#5B21B6" };
      case "Hired":
        return { color: "#10B981", bg: "#D1FAE5", text: "#065F46" };
      default:
        return { color: "#6B7280", bg: "#F3F4F6", text: "#374151" };
    }
  };

  const statusConfig = getStatusConfig(currentStatus);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

// Reject handler
  const handleReject = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const token = currentUser?.token;
      const res = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/application/update-single-status",
        {
          applicationId,
          status: "Not Progressing",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200 || res.data.success) {
        setStatus("Not Progressing");
        setSnackbarOpen(true);
        setTimeout(() => navigate(-1), 2000); // Go back after 2s
      } else {
        alert("Unable to reject candidate.");
      }
    } catch (err) {
      console.error("Reject error:", err);
      alert("Unable to reject candidate.");
    }
  };

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            sx={{
              textTransform: "none",
              fontFamily: "Satoshi",
              fontWeight: 600,
              fontSize: "13px",
              color: "#374151",
              px: 2,
              py: 1,
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              backgroundColor: "#F9FAFB",
              "&:hover": {
                backgroundColor: "#F3F4F6",
                borderColor: "#D1D5DB",
              },
            }}
          >
            Back
          </Button>
        </Box>

        {/* Header with Status */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "28px",
                fontWeight: 700,
                fontFamily: "Satoshi",
                color: "#111827",
                letterSpacing: "-0.02em",
              }}
            >
              Candidate Profile
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "#E5E7EB" }} />
        </Box>

        <Grid container spacing={4}>
          {/* Left Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Profile Card */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 3,
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                bgcolor: "white",
              }}
            >
              {/* Profile Header */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Avatar
                  src={userData?.profileUrl}
                  sx={{
                    width: 88,
                    height: 88,
                    margin: "0 auto",
                    mb: 2,
                    border: "3px solid #F3F4F6",
                    fontSize: "32px",
                    fontWeight: 600,
                    bgcolor: "#6366F1",
                    color: "white",
                  }}
                >
                  {userData?.firstName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: 700,
                    fontFamily: "Satoshi",
                    color: "#111827",
                    mb: 1,
                    lineHeight: 1.2,
                  }}
                >
                  {userData?.firstName} {userData?.lastName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 500,
                    fontFamily: "Poppins",
                    color: "#6B7280",
                    mb: 1,
                  }}
                >
                  {userData?.currentDesignation}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    fontFamily: "Poppins",
                    color: "#9CA3AF",
                  }}
                >
                  {userData?.currentCompany}
                </Typography>
              </Box>

              {/* Key Stats */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 2,
                        bgcolor: "#F8FAFC",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 700,
                          fontFamily: "Satoshi",
                          color: "#111827",
                        }}
                      >
                        {userData?.experience || 0}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 500,
                          fontFamily: "Poppins",
                          color: "#6B7280",
                        }}
                      >
                        Years Exp.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 2,
                        bgcolor: "#F8FAFC",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 700,
                          fontFamily: "Satoshi",
                          color: "#111827",
                        }}
                      >
                        {userData?.experienceHistory?.length || 0}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 500,
                          fontFamily: "Poppins",
                          color: "#6B7280",
                        }}
                      >
                        Companies
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Contact Information */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    fontFamily: "Satoshi",
                    color: "#374151",
                    mb: 2,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Contact Information
                </Typography>

                <Stack spacing={2}>
                  {/* Email */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      bgcolor: "#F9FAFB",
                      borderRadius: "8px",
                    }}
                  >
                    <MailIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          fontFamily: "Poppins",
                          color: "#111827",
                          wordBreak: "break-all",
                        }}
                      >
                        {currentStatus === "Application Viewed"
                          ? "•••••••••••••••••"
                          : userData?.email}
                      </Typography>
                    </Box>
                    {currentStatus !== "Application Viewed" && (
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigator.clipboard.writeText(userData?.email)
                        }
                        sx={{
                          color: "#6B7280",
                          "&:hover": { color: "#374151" },
                        }}
                      >
                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Phone */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      bgcolor: "#F9FAFB",
                      borderRadius: "8px",
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          fontFamily: "Poppins",
                          color: "#111827",
                        }}
                      >
                        {currentStatus === "Application Viewed"
                          ? "•••••••••••••••••"
                          : userData?.contactNumber}
                      </Typography>
                    </Box>
                    {currentStatus !== "Application Viewed" && (
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigator.clipboard.writeText(userData?.contactNumber)
                        }
                        sx={{
                          color: "#6B7280",
                          "&:hover": { color: "#374151" },
                        }}
                      >
                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Location */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      bgcolor: "#F9FAFB",
                      borderRadius: "8px",
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        fontFamily: "Poppins",
                        color: "#111827",
                      }}
                    >
                      {userData?.currentLocation || "Not specified"}
                    </Typography>
                  </Box>

                  {/* LinkedIn */}
                  {userData?.linkedinLink && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        bgcolor: "#F9FAFB",
                        borderRadius: "8px",
                      }}
                    >
                      <LinkedInIcon sx={{ fontSize: 18, color: "#0A66C2" }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          component="a"
                          href={userData.linkedinLink}
                          target="_blank"
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            fontFamily: "Poppins",
                            color: "#0A66C2",
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          LinkedIn Profile
                        </Typography>
                      </Box>
                      <LaunchIcon sx={{ fontSize: 16, color: "#6B7280" }} />
                    </Box>
                  )}
                </Stack>

                {currentStatus === "Application Viewed" && (
                  <Typography
                    sx={{
                      mt: 2,
                      fontSize: "12px",
                      fontFamily: "Poppins",
                      color: "#9CA3AF",
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    Shortlist candidate to view contact details
                  </Typography>
                )}
              </Box>

              {/* Action Buttons */}
              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  onClick={() => {
                    if (userData?.cvUrl) {
                      window.open(userData.cvUrl, "_blank");
                    } else {
                      alert("Resume link not available...");
                    }
                  }}
                  sx={{
                    py: 1.5,
                    borderColor: "#D1D5DB",
                    color: "#374151",
                    fontFamily: "Satoshi",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#9CA3AF",
                      bgcolor: "#F9FAFB",
                    },
                  }}
                >
                  View Resume
                </Button>

                {currentStatus === "Hired" ? (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    disabled
                    sx={{
                      py: 1.5,
                      bgcolor: "#10B981",
                      fontFamily: "Satoshi",
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    Hired
                  </Button>
                ) : location.state?.status !== "Not Progressing" ? (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleStatusUpdate}
                      sx={{
                        py: 1.5,
                        bgcolor: "#6366F1",
                        fontFamily: "Satoshi",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "#5048E5",
                        },
                      }}
                    >
                      {nextAction}
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={handleReject}
                      sx={{
                        py: 1.5,
                        fontFamily: "Satoshi",
                        fontWeight: 600,
                        textTransform: "none",
                        borderColor: "#F87171",
                        color: "#B91C1C",
                        "&:hover": {
                          bgcolor: "#FEF2F2",
                          borderColor: "#DC2626",
                        },
                      }}
                    >
                      Reject
                    </Button>
                  </>
                ) : null}
              </Stack>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              {/* About Section */}
              <ProfileSection
                title="About"
                icon={
                  <PersonOutlineIcon sx={{ fontSize: 20, color: "#6B7280" }} />
                }
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Poppins",
                    color: "#374151",
                    lineHeight: 1.6,
                  }}
                >
                  {userData?.about ||
                    "No description provided by the candidate."}
                </Typography>
              </ProfileSection>

              {/* Professional Summary */}
              <ProfileSection
                title="Professional Summary"
                icon={
                  <BusinessCenterIcon sx={{ fontSize: 20, color: "#6B7280" }} />
                }
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <InfoField
                      label="Current Company"
                      value={`${userData?.currentCompany}` || "Not Provided"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField
                      label="Current Salary"
                      value={
                        `${userData?.currentSalary} LPA` || "Not disclosed"
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField
                      label="Current Designation"
                      value={
                        `${userData?.currentDesignation}` || "Not Provided"
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField
                      label="Current Location"
                      value={`${userData?.currentLocation}` || "Not Provided"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField
                      label="Open to Relocate"
                      value={userData?.openToRelocate || "Not specified"}
                    />
                  </Grid>
                </Grid>
              </ProfileSection>

              {/* Preferences Summary */}
              <ProfileSection
                title="Preferences"
                icon={
                  <BusinessCenterIcon sx={{ fontSize: 20, color: "#6B7280" }} />
                }
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <InfoField
                      label="Expected Salary"
                      value={
                        `${userData?.expectedMinSalary} LPA` || "Not specified"
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField
                      label="Work Type Preference"
                      value={
                        userData?.preferredWorkTypes?.join(", ") ||
                        "Not specified"
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField
                      label="Work Mode Preference"
                      value={
                        userData?.preferredWorkModes?.join(", ") ||
                        "Not specified"
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField
                      label="Preferred Locations"
                      value={
                        userData?.preferredLocations?.join(", ") ||
                        "Any location"
                      }
                    />
                  </Grid>
                </Grid>
              </ProfileSection>

              {/* Education */}
              {userData?.highestQualification?.length > 0 && (
                <ProfileSection
                  title="Education"
                  icon={
                    <SchoolOutlinedIcon
                      sx={{ fontSize: 20, color: "#6B7280" }}
                    />
                  }
                >
                  <Stack spacing={1}>
                    {userData.highestQualification.map((qual, index) => (
                      <Typography
                        key={index}
                        sx={{
                          fontSize: "14px",
                          fontFamily: "Poppins",
                          color: "#374151",
                        }}
                      >
                        • {qual}
                      </Typography>
                    ))}
                  </Stack>
                </ProfileSection>
              )}

              {/* Skills */}
              <ProfileSection
                title="Skills & Expertise"
                icon={<TimelineIcon sx={{ fontSize: 20, color: "#6B7280" }} />}
              >
                {userData?.skills?.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {userData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        sx={{
                          bgcolor: "#EEF2FF",
                          color: "#4338CA",
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          fontSize: "12px",
                          border: "1px solid #C7D2FE",
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#9CA3AF",
                      fontFamily: "Poppins",
                    }}
                  >
                    No skills specified
                  </Typography>
                )}
              </ProfileSection>

              {/* Experience History */}
              {userData?.experienceHistory?.length > 0 && (
                <ProfileSection
                  title="Experience History"
                  icon={
                    <WorkOutlineIcon sx={{ fontSize: 20, color: "#6B7280" }} />
                  }
                >
                  <Stack spacing={2}>
                    {userData.experienceHistory.map((exp, index) => (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          p: 3,
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          bgcolor: "white",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            cursor: exp.description ? "pointer" : "default",
                          }}
                          onClick={() =>
                            exp.description && handleExperienceToggle(index)
                          }
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontWeight: 600,
                                fontFamily: "Satoshi",
                                color: "#111827",
                                mb: 0.5,
                              }}
                            >
                              {exp.designation}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                fontFamily: "Poppins",
                                color: "#6366F1",
                                mb: 0.5,
                              }}
                            >
                              {exp.companyName}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                fontFamily: "Poppins",
                                color: "#6B7280",
                              }}
                            >
                              {new Date(exp.from).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}{" "}
                              -
                              {new Date(exp.to).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}
                            </Typography>
                          </Box>
                          {exp.description && (
                            <IconButton size="small" sx={{ color: "#6B7280" }}>
                              {expandedExperience[index] ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                          )}
                        </Box>
                        {expandedExperience[index] && exp.description && (
                          <Box
                            sx={{
                              mt: 2,
                              pt: 2,
                              borderTop: "1px solid #F3F4F6",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontFamily: "Poppins",
                                color: "#374151",
                                lineHeight: 1.6,
                              }}
                            >
                              {exp.description}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                </ProfileSection>
              )}

              {/* Screening Questions */}
              {ScreeningQues?.length > 0 && (
                <ProfileSection
                  title="Screening Questions"
                  icon={
                    <AssignmentTurnedInIcon
                      sx={{ fontSize: 20, color: "#6B7280" }}
                    />
                  }
                >
                  <Stack spacing={2}>
                    {ScreeningQues.map((item, index) => (
                      <Paper
                        key={item._id || index}
                        elevation={0}
                        sx={{
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "#F9FAFB",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          onClick={() => handleToggle(index)}
                        >
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 600,
                              fontFamily: "Satoshi",
                              color: "#111827",
                              flex: 1,
                              pr: 2,
                            }}
                          >
                            Q{index + 1}: {item.question}
                          </Typography>
                          <IconButton size="small" sx={{ color: "#6B7280" }}>
                            {expanded[index] ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </Box>
                        {expanded[index] && (
                          <Box sx={{ p: 3, bgcolor: "white" }}>
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontFamily: "Poppins",
                                color: "#374151",
                                lineHeight: 1.6,
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {item.answer}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                </ProfileSection>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Candidate Rejected"
      />
      </Box>
  );
};

// Professional Section Component
const ProfileSection = ({ title, icon, children }) => (
  <Paper
    elevation={0}
    sx={{
      border: "1px solid #E5E7EB",
      borderRadius: "12px",
      bgcolor: "white",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 3,
        pb: 2,
        borderBottom: "1px solid #F3F4F6",
      }}
    >
      {icon}
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 700,
          fontFamily: "Satoshi",
          color: "#111827",
        }}
      >
        {title}
      </Typography>
    </Box>
    <Box sx={{ p: 3 }}>{children}</Box>
  </Paper>
);

// Info Field Component
const InfoField = ({ label, value }) => (
  <Box>
    <Typography
      sx={{
        fontSize: "12px",
        fontWeight: 600,
        fontFamily: "Satoshi",
        color: "#6B7280",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        mb: 0.5,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: "14px",
        fontFamily: "Poppins",
        color: "#111827",
        fontWeight: 500,
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default ViewProfile;
