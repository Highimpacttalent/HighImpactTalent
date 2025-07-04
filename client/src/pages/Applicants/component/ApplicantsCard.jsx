import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Grid,
  Stack,
  Tooltip,
  Menu,
  MenuItem,
  Drawer,
  Collapse,
  Divider,
  Badge,
} from "@mui/material";
import {
  Work,
  Business,
  MonetizationOn,
  LocationOn,
  School,
  LinkedIn,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Star,
  Download,
  ExpandMore,
  ExpandLess,
  Visibility,
  Phone,
  Email,
  CalendarToday,
  TrendingUp,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";
import axios from "axios";
import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";

const ApplicationCard = ({ app, navigate, markAsViewed, onStageSelect }) => {
  const { applicant, matchScore, status, screeningAnswers, cvUrl } = app;
  const [showAll, setShowAll] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const skills = applicant.skills || [];
  const [action, setAction] = useState(false);
  const displayedSkills = showAllSkills ? skills : skills.slice(0, 4);
  const possibleStages = [
    "Applied",
    "Application Viewed",
    "Shortlisted",
    "Interviewing",
    "Hired",
    "Not Progressing",
  ];

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const openActionsMenu = (e) => {
    e.stopPropagation();
    setActionsAnchorEl(e.currentTarget);
  };
  const closeActionsMenu = () => setActionsAnchorEl(null);
  const currentUser = useSelector((state) => state.user.user);

  const visibleSkills = showAll ? skills : skills.slice(0, 8);

  const handleStageSelect = async (selectedStage) => {
    setAction(true); // ✅ Set action state to true
    closeActionsMenu();
    if (status === selectedStage) return;

    try {
      await onStageSelect(app._id, selectedStage); // ✅ Call parent handler
    } catch (error) {
      console.error("Stage update failed:", error);
    } finally {
      setAction(false);
    }
  };

  // Professional match color scheme
  const getMatchColor = (score) => {
    if (score >= 80) return { bg: "#f0f8f0", fg: "#2d5a2d", border: "#4a7c4a" };
    if (score >= 60) return { bg: "#fff8e1", fg: "#8b4513", border: "#daa520" };
    return { bg: "#fef2f2", fg: "#b91c1c", border: "#dc2626" };
  };
  const matchColor = getMatchColor(matchScore);

  const handleViewResume = () => {
    if (cvUrl) {
      setResumeOpen(true);
    } else {
      alert("Resume link not available...");
    }
  };

  const handleViewProfile = () => {
    if (status === "Applied") markAsViewed(app._id);
    navigate("/view-profile", {
      state: { applicant, status, applicationId: app._id, screeningAnswers },
    });
  };

  if (isMobile) {
    return (
      <Card
        sx={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.08)",
          mb: 2,
          overflow: "hidden",
          "&:active": {
            transform: "scale(0.98)",
            transition: "transform 0.1s ease",
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header with gradient background */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #3C7EFC 100%)",
              p: 3,
              color: "white",
              position: "relative",
            }}
          >
            {/* Status and Match Score Badges */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                display: "flex",
                gap: 1,
              }}
            >
              <Chip
                label={`${matchScore}%`}
                size="small"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  backdropFilter: "blur(10px)",
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  height: 28,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              />
            </Box>

            {/* Avatar and Basic Info */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
              <Avatar
                src={applicant.profileUrl}
                sx={{
                  width: 72,
                  height: 72,
                  border: "3px solid rgba(255, 255, 255, 0.3)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {applicant.firstName?.[0]}
                {applicant.lastName?.[0]}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: isSmallMobile ? "1.1rem" : "1.25rem",
                    lineHeight: 1.2,
                    mb: 0.5,
                    color: "white",
                  }}
                >
                  {applicant.firstName} {applicant.lastName}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    mb: 1,
                  }}
                >
                  {applicant.currentDesignation}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.8rem",
                  }}
                >
                  {applicant.currentCompany}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Quick Stats Row */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 2,
                textAlign: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: "1rem",
                    mb: 0.25,
                  }}
                >
                  {applicant.experience}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Years Exp
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: "1rem",
                    mb: 0.25,
                  }}
                >
                  ₹{applicant.expectedMinSalary}L
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Expected
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: "1rem",
                    mb: 0.25,
                  }}
                >
                  {applicant.currentLocation?.split(",")[0]}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Location
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Skills Section */}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                color: "#1e293b",
                mb: 2,
                fontSize: "0.9rem",
              }}
            >
              Top Skills ({skills.length})
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {displayedSkills.map((skill, index) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  sx={{
                    backgroundColor: index < 2 ? "#e0f2fe" : "#f1f5f9",
                    color: index < 2 ? "#0277bd" : "#475569",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    height: 28,
                    border:
                      index < 2 ? "1px solid #b3e5fc" : "1px solid #e2e8f0",
                  }}
                />
              ))}
            </Box>

            {skills.length > 4 && (
              <Button
                size="small"
                onClick={() => setShowAllSkills(!showAllSkills)}
                sx={{
                  textTransform: "none",
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: 600,
                  color: "#6366f1",
                  fontSize: "0.8rem",
                  p: 0,
                  minWidth: "auto",
                }}
              >
                {showAllSkills
                  ? "Show Less"
                  : `+${skills.length - 4} more skills`}
              </Button>
            )}
          </Box>

          {/* Expandable Details */}
          <Box sx={{ borderTop: "1px solid #e2e8f0" }}>
            <Button
              fullWidth
              onClick={() => setExpandedDetails(!expandedDetails)}
              sx={{
                p: 2,
                textTransform: "none",
                color: "#475569",
                fontFamily: "Satoshi, sans-serif",
                fontWeight: 600,
                justifyContent: "space-between",
                "&:hover": { backgroundColor: "#f8fafc" },
              }}
              endIcon={expandedDetails ? <ExpandLess /> : <ExpandMore />}
            >
              More Details
            </Button>

            <Collapse in={expandedDetails}>
              <Box sx={{ p: 3, pt: 0, backgroundColor: "#f8fafc" }}>
                <Stack spacing={3}>
                  {/* Professional Details */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        color: "#1e293b",
                        mb: 1.5,
                        fontSize: "0.85rem",
                      }}
                    >
                      Professional Background
                    </Typography>
                    <Stack spacing={1.5}>
                      <MobileDetailItem
                        icon={
                          <TrendingUp sx={{ fontSize: 18, color: "#6366f1" }} />
                        }
                        label="Consulting Experience"
                        value={`${applicant.totalYearsInConsulting || 0} years`}
                      />
                      <MobileDetailItem
                        icon={
                          <School sx={{ fontSize: 18, color: "#6366f1" }} />
                        }
                        label="Education"
                        value={applicant.highestQualification?.[0] || "N/A"}
                      />
                    </Stack>
                  </Box>

                  {/* Location Preferences */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        color: "#1e293b",
                        mb: 1.5,
                        fontSize: "0.85rem",
                      }}
                    >
                      Preferences
                    </Typography>
                    <Stack spacing={1.5}>
                      <MobileDetailItem
                        icon={
                          <LocationOn sx={{ fontSize: 18, color: "#6366f1" }} />
                        }
                        label="Open to Relocate"
                        value={applicant.openToRelocate || "N/A"}
                      />
                      <MobileDetailItem
                        icon={<Work sx={{ fontSize: 18, color: "#6366f1" }} />}
                        label="Work Mode"
                        value={
                          applicant.preferredWorkModes?.join(", ") || "Any"
                        }
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Collapse>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              p: 3,
              backgroundColor: "#ffffff",
              borderTop: "1px solid #e2e8f0",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 2,
            }}
          >
            {applicant.linkedinLink && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => window.open(applicant.linkedinLink, "_blank")}
                sx={{
                  textTransform: "none",
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: 600,
                  borderColor: "#0077b5",
                  color: "#0077b5",
                  py: 1,
                  fontSize: "0.75rem",
                  "&:hover": {
                    borderColor: "#005885",
                    backgroundColor: "#f0f8ff",
                  },
                }}
              >
                <LinkedIn sx={{ fontSize: 16, mr: 0.5 }} />
                LinkedIn
              </Button>
            )}

            <Button
              variant="outlined"
              size="small"
              onClick={handleViewProfile}
              sx={{
                textTransform: "none",
                fontFamily: "Satoshi, sans-serif",
                fontWeight: 600,
                borderColor: "#6366f1",
                color: "#6366f1",
                py: 1,
                fontSize: "0.75rem",
                "&:hover": {
                  borderColor: "#4f46e5",
                  backgroundColor: "#f0f4ff",
                },
              }}
            >
              <Visibility sx={{ fontSize: 16, mr: 0.5 }} />
              Profile
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={handleViewResume}
              sx={{
                textTransform: "none",
                fontFamily: "Satoshi, sans-serif",
                fontWeight: 600,
                backgroundColor: "#1e293b",
                py: 1,
                fontSize: "0.75rem",
                "&:hover": { backgroundColor: "#0f172a" },
              }}
            >
              <Download sx={{ fontSize: 16, mr: 0.5 }} />
              Resume
            </Button>
          </Box>
        </CardContent>

        {/* Resume Drawer */}
        <Drawer
          anchor="bottom"
          open={resumeOpen}
          onClose={() => setResumeOpen(false)}
          PaperProps={{
            sx: {
              height: "90vh",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              backgroundColor: "#ffffff",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 3,
              borderBottom: "1px solid #e2e8f0",
              position: "sticky",
              top: 0,
              backgroundColor: "#ffffff",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                color: "#1e293b",
              }}
            >
              Resume Preview
            </Typography>
            <IconButton
              onClick={() => setResumeOpen(false)}
              sx={{
                backgroundColor: "#f1f5f9",
                "&:hover": { backgroundColor: "#e2e8f0" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {applicant.cvUrl ? (
            <Box sx={{ flex: 1, p: 2 }}>
              <iframe
                src={applicant.cvUrl}
                title="Resume Preview"
                width="100%"
                height="100%"
                style={{
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Satoshi, sans-serif",
                  color: "#64748b",
                }}
              >
                No resume available
              </Typography>
            </Box>
          )}
        </Drawer>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        mb: 2,
        "&:hover": {
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          borderColor: "#d1d5db",
          transition: "all 0.2s ease",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          {/* Left Side - Avatar and Basic Info */}
          <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
            <Avatar
              src={applicant.profileUrl}
              sx={{
                width: 60,
                height: 60,
                border: "2px solid #f3f4f6",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#374151",
                backgroundColor: "#f9fafb",
              }}
            >
              {applicant.firstName?.[0]}
              {applicant.lastName?.[0]}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    color: "#111827",
                    fontSize: "1.125rem",
                    lineHeight: 1.2,
                  }}
                >
                  {applicant.firstName} {applicant.lastName}
                </Typography>

                <Chip
                  label={`${matchScore}% Match`}
                  size="small"
                  sx={{
                    backgroundColor: matchColor.bg,
                    color: matchColor.fg,
                    border: `1px solid ${matchColor.border}`,
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    height: 24,
                  }}
                />

                <Chip
                  label={status}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "#d1d5db",
                    color: "#6b7280",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    height: 24,
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "#4b5563",
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                {applicant.currentDesignation} • {applicant.currentCompany}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  color: "#6b7280",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Work sx={{ fontSize: 14 }} />
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}
                  >
                    {applicant.experience} yrs exp
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 14 }} />
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}
                  >
                    {applicant.currentLocation}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <MonetizationOn sx={{ fontSize: 14 }} />
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}
                  >
                    Current Salary:{" "}
                    {applicant.currentSalary
                      ? `₹${applicant.currentSalary}L`
                      : "Not Specified"}{" "}
                    | Expected Min:{" "}
                    {applicant.expectedMinSalary
                      ? `₹${applicant.expectedMinSalary}L`
                      : "Not Specified"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isMobile ? (
              <>
                {applicant.linkedinLink && (
                  <Tooltip title="LinkedIn Profile">
                    <IconButton
                      href={applicant.linkedinLink}
                      target="_blank"
                      size="small"
                      sx={{
                        color: "#0077b5",
                        "&:hover": { backgroundColor: "#f0f8ff" },
                      }}
                    >
                      <LinkedIn fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Visibility />}
                  onClick={handleViewProfile}
                  sx={{
                    textTransform: "none",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 600,
                    borderColor: "#d1d5db",
                    color: "#374151",
                    "&:hover": {
                      borderColor: "#9ca3af",
                      backgroundColor: "#f9fafb",
                    },
                    minWidth: 100,
                  }}
                >
                  Profile
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={openActionsMenu}
                  disabled={action} // ✅ Disable button during loading
                  endIcon={
                    action ? (
                      <CircularProgress size={16} sx={{ color: "#6b7280" }} />
                    ) : (
                      <MoreVertIcon />
                    )
                  }
                  sx={{
                    textTransform: "none",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 600,
                    borderColor: "#d1d5db",
                    color: "#374151",
                    "&:hover": {
                      borderColor: "#9ca3af",
                      backgroundColor: "#f9fafb",
                    },
                    minWidth: 100,
                  }}
                >
                  {action ? "Loading..." : "Actions"}
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Download />}
                  onClick={handleViewResume}
                  sx={{
                    textTransform: "none",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 600,
                    backgroundColor: "#374151",
                    "&:hover": { backgroundColor: "#1f2937" },
                    minWidth: 100,
                  }}
                >
                  Resume
                </Button>
              </>
            ) : (
              <>
                <IconButton onClick={openMenu} size="small">
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  {applicant.linkedinLink && (
                    <MenuItem
                      component="a"
                      href={applicant.linkedinLink}
                      target="_blank"
                    >
                      <LinkedIn
                        fontSize="small"
                        sx={{ mr: 1, color: "#0077b5" }}
                      />
                      LinkedIn
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleViewProfile}>
                    <Visibility fontSize="small" sx={{ mr: 1 }} />
                    View Profile
                  </MenuItem>
                  <MenuItem onClick={handleViewResume}>
                    <Download fontSize="small" sx={{ mr: 1 }} />
                    View Resume
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Box>

        {/* Information Grid */}
        <Grid container spacing={3}>
          {/* Professional Details */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "#374151",
                  mb: 1.5,
                  fontSize: "0.875rem",
                }}
              >
                Professional Details
              </Typography>
              <Stack spacing={1}>
                <DetailItem
                  icon={<Business sx={{ fontSize: 16, color: "#6b7280" }} />}
                  label="Current Company"
                  value={applicant.currentCompany || "N/A"}
                />
                <DetailItem
                  icon={<TrendingUp sx={{ fontSize: 16, color: "#6b7280" }} />}
                  label="Consulting Experience"
                  value={`${applicant.totalYearsInConsulting || 0} years`}
                />
                <DetailItem
                  icon={<School sx={{ fontSize: 16, color: "#6b7280" }} />}
                  label="Education"
                  value={applicant.highestQualification?.[0] || "N/A"}
                />
              </Stack>
            </Box>
          </Grid>

          {/* Location & Preferences */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "#374151",
                  mb: 1.5,
                  fontSize: "0.875rem",
                }}
              >
                Location & Preferences
              </Typography>
              <Stack spacing={1}>
                <DetailItem
                  icon={<LocationOn sx={{ fontSize: 16, color: "#6b7280" }} />}
                  label="Open to Relocate"
                  value={applicant.openToRelocate || "N/A"}
                />
                <DetailItem
                  icon={<LocationOn sx={{ fontSize: 16, color: "#6b7280" }} />}
                  label="Preferred Locations"
                  value={
                    applicant.preferredLocations?.slice(0, 2).join(", ") ||
                    "Any"
                  }
                />
                <DetailItem
                  icon={<Work sx={{ fontSize: 16, color: "#6b7280" }} />}
                  label="Work Mode"
                  value={applicant.preferredWorkModes?.join(", ") || "Any"}
                />
              </Stack>
            </Box>
          </Grid>

          {/* Skills */}
          <Grid item xs={12} sm={12} md={6}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "#374151",
                  mb: 1.5,
                  fontSize: "0.875rem",
                }}
              >
                Key Skills ({skills.length})
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                {skills.length > 0 ? (
                  visibleSkills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{
                        backgroundColor: "#f3f4f6",
                        color: "#374151",
                        fontFamily: "Satoshi, sans-serif",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        height: 24,
                        "&:hover": {
                          backgroundColor: "#e5e7eb",
                        },
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No skills listed
                  </Typography>
                )}
              </Box>

              {skills.length > 8 && (
                <Button
                  size="small"
                  onClick={() => setShowAll(!showAll)}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 600,
                    color: "#6366f1",
                    fontSize: "0.75rem",
                    p: 0,
                    minWidth: "auto",
                  }}
                >
                  {showAll ? "Show Less" : `+${skills.length - 8} more`}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Menu
        anchorEl={actionsAnchorEl}
        open={Boolean(actionsAnchorEl)}
        onClose={closeActionsMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        // Optional: Add PaperProps to adjust menu width if needed
        PaperProps={{
          style: {
            width: "180px", // Example fixed width
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{ display: "block", px: 2, py: 1, color: "#6b7280" }}
        >
          Move to Stage:
        </Typography>
        <Divider sx={{ my: 0 }} />
        {/* Map over possible stages to create menu items */}
        {possibleStages.map((stage) => (
          <MenuItem
            key={stage}
            onClick={() => handleStageSelect(stage)} // Call handler on click
            disabled={status === stage} // Disable if already in this stage
          >
            {stage}
          </MenuItem>
        ))}
      </Menu>

      {/* Resume Drawer */}
      <Drawer
        anchor="right"
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 600 },
            backgroundColor: "#ffffff",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Resume Preview
          </Typography>
          <IconButton onClick={() => setResumeOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        {applicant.cvUrl ? (
          <Box sx={{ height: "100%", width: "100%" }}>
            <iframe
              src={applicant.cvUrl}
              title="Resume Preview"
              width="100%"
              height="100%"
              style={{ border: "none", minHeight: "100vh" }}
            />
          </Box>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Satoshi, sans-serif",
                color: "#6b7280",
              }}
            >
              No resume available
            </Typography>
          </Box>
        )}
      </Drawer>
    </Card>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
    <Box sx={{ mt: 0.25 }}>{icon}</Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{
          color: "#9ca3af",
          fontFamily: "Satoshi, sans-serif",
          fontWeight: 500,
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.025em",
          display: "block",
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "#374151",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontSize: "0.8rem",
          lineHeight: 1.3,
          mt: 0.25,
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

const MobileDetailItem = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      p: 2,
      backgroundColor: "#ffffff",
      borderRadius: 2,
      border: "1px solid #e2e8f0",
    }}
  >
    <Box
      sx={{
        p: 1,
        backgroundColor: "#f0f4ff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{
          color: "#64748b",
          fontFamily: "Satoshi, sans-serif",
          fontWeight: 500,
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          display: "block",
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "#1e293b",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: "0.85rem",
          lineHeight: 1.3,
          mt: 0.25,
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

export default ApplicationCard;
