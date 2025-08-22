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
  Paper
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
  Check,
  Info as InfoIcon,
  QuestionAnswerOutlined,
  Download,
  ExpandMore,
  ExpandLess,
  Visibility,
  TrendingUp,
  SchoolOutlined as SchoolOutlinedIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";
import PersonOutline from "@mui/icons-material/PersonOutline";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DownloadIcon from "@mui/icons-material/Download";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ScreeningModal from "./ScreeningModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";


export const escapeRegExp = (s = "") =>
  String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function highlight(text, keywords) {
  const str = String(text ?? "");
  if (!keywords) return str;

  // normalize keywords -> array of non-empty tokens
  let tokens = [];
  if (Array.isArray(keywords)) {
    tokens = keywords.map((k) => String(k || "").trim()).filter(Boolean);
  } else {
    tokens = String(keywords)
      .split(/[\s,]+/)
      .map((k) => k.trim())
      .filter(Boolean);
  }

  if (!tokens.length) return str;

  // sort by length desc so longer matches come first
  tokens.sort((a, b) => b.length - a.length);

  // create regex to match even partial words
  const pattern = tokens.map(escapeRegExp).join("|");
  const parts = str.split(new RegExp(`(${pattern})`, "gi"));

  return parts.map((part, idx) =>
    tokens.some((t) => part.toLowerCase().includes(t.toLowerCase())) ? (
      <span
        key={idx}
        style={{
          backgroundColor: "#fff59d",
          padding: "0 4px",
          borderRadius: 4,
          display: "inline-block",
        }}
      >
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}



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



const formatMonthYear = (value) => {
  if (!value) return "Present";
  try {
    // If value is like "2021-06" or "2021-06-01" this will work
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  } catch (e) {
    return value;
  }
};




const ApplicationCard = ({ app, navigate, markAsViewed, onStageSelect, filterKeywords = [] }) => {
  const { applicant, matchPercentage, status, screeningAnswers, cvUrl } = app;
  const [showAll, setShowAll] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [screeningModalOpen, setScreeningModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [expandedExperience, setExpandedExperience] = useState({});
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

  const handleExperienceToggle = (index) => {
    setExpandedExperience((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
  const matchColor = getMatchColor(matchPercentage);

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
      state: { applicant, status, applicationId: app._id, screeningAnswers, filterKeywords },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

 if (isMobile) {
  // fallback source (keeps your existing applicant usage intact)
  const doHighlight = typeof highlight === "function" ? highlight : (t) => t;

  const [showExperiences, setShowExperiences] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // normalize data
  const profileSource = applicant || {};
  const fullName = `${profileSource.firstName || ""} ${profileSource.lastName || ""}`.trim();
  const designation = profileSource.currentDesignation || "";
  const company = profileSource.currentCompany || "";
  const avatarUrl = profileSource.profileUrl || "";
  const experienceYears = profileSource.experience ?? profileSource.years ?? "";
  const salary = profileSource.currentSalary ? `₹${profileSource.currentSalary}L` : "N/A";
  const location = (profileSource.currentLocation || "").split?.(",")?.[0] || "";
  const skills = Array.isArray(profileSource.skills) ? profileSource.skills : (profileSource.skillsString ? profileSource.skillsString.split(",").map(s=>s.trim()) : []);
  const expHistory = Array.isArray(profileSource.experienceHistory) ? profileSource.experienceHistory : [];

  const formatMonthYear = (dateOrString) => {
    if (!dateOrString) return "";
    const d = new Date(dateOrString);
    if (isNaN(d)) return String(dateOrString);
    return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  };

  // show top two experiences, expand to show all
  const displayedExperiences = showExperiences ? expHistory : expHistory.slice(0, 2);

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        border: "1px solid #E6EEF8",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(16,24,40,0.06)",
        mb: 2,
        overflow: "hidden",
        fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header - compact, professional */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", px: 2, py: 2 }}>
          <Avatar
            src={avatarUrl}
            onClick={handleViewProfile}
            sx={{
              width: 64,
              height: 64,
              border: "2px solid #E6EEF8",
              bgcolor: "#F8FAFC",
              cursor: "pointer",
              fontSize: "1.1rem",
              fontWeight: 700,
            }}
          >
            {(!avatarUrl && fullName) ? fullName.split(" ").map(n=>n[0]).slice(0,2).join("") : ""}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              onClick={handleViewProfile}
              sx={{
                fontWeight: 700,
                fontSize: "1.05rem",
                lineHeight: 1.15,
                color: "#0f172a",
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {doHighlight(fullName, filterKeywords)}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.85rem",
                color: "#334155",
                fontWeight: 600,
                mt: 0.5,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {doHighlight(designation || "—", filterKeywords)}
              {company ? ` • ${company}` : ""}
            </Typography>

            {/* match badge small */}
            <Box sx={{ mt: 0.75 }}>
              <Chip
                label={`${matchPercentage}% match`}
                size="small"
                sx={{
                  backgroundColor: "#EAF2FF",
                  color: "#0353A4",
                  fontWeight: 700,
                  borderRadius: 1,
                  fontSize: "0.72rem",
                }}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#EEF3F8" }} />

        {/* Experience History (TOP) */}
        <Box sx={{ px: 2, py: 2, backgroundColor: "#fff" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a", mb: 1 }}>
            Experience History
          </Typography>

          {displayedExperiences.length === 0 ? (
            <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
              No experience history provided
            </Typography>
          ) : (
            <Stack spacing={1}>
              {displayedExperiences.map((exp, idx) => (
                <Paper
                  key={exp._id || idx}
                  elevation={0}
                  sx={{
                    p: 1.25,
                    borderRadius: 1,
                    border: "1px solid #F1F5F9",
                    backgroundColor: "#FBFDFF",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {exp.designation || "—"}
                      </Typography>
                      <Typography sx={{ fontSize: "0.82rem", color: "#2563eb", fontWeight: 600 }}>
                        {exp.companyName || "—"}
                      </Typography>
                      <Typography sx={{ fontSize: "0.78rem", color: "#64748b" }}>
                        {formatMonthYear(exp.from)} — {exp.to ? formatMonthYear(exp.to) : "Present"}
                      </Typography>
                    </Box>
                    {/* small icon area (work icon) */}
                    <Box sx={{ display: "flex", alignItems: "center", color: "#94a3b8" }}>
                      <WorkOutlineIcon fontSize="small" />
                    </Box>
                  </Box>
                </Paper>
              ))}

              {/* Expand control */}
              {expHistory.length > 2 && (
                <Button
                  onClick={() => setShowExperiences((s) => !s)}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    mt: 0.5,
                    px: 1,
                    textTransform: "none",
                    color: "#2563eb",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                  }}
                  endIcon={showExperiences ? <ExpandLess /> : <ExpandMore />}
                >
                  {showExperiences ? "Show less" : `Show ${expHistory.length - 2} more`}
                </Button>
              )}
            </Stack>
          )}
        </Box>

        <Divider sx={{ borderColor: "#EEF3F8" }} />

        {/* Quick Stats Row */}
        <Box sx={{ px: 2, py: 2, backgroundColor: "#ffffff" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>{experienceYears ?? "—"}</Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#64748b", mt: 0.25 }}>Years Exp</Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>{salary}</Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#64748b", mt: 0.25 }}>Salary</Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>{location || "—"}</Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#64748b", mt: 0.25 }}>Location</Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#EEF3F8" }} />

        

        <Divider sx={{ borderColor: "#EEF3F8" }} />

        {/* Expandable More Details: Education, Preferences etc */}
        <Box sx={{ px: 2, pt: 1, pb: 2 }}>
          <Button
            fullWidth
            onClick={() => setShowMoreDetails((s) => !s)}
            sx={{
              textTransform: "none",
              color: "#334155",
              fontWeight: 700,
              display: "flex",
              justifyContent: "space-between",
            }}
            endIcon={showMoreDetails ? <ExpandLess /> : <ExpandMore />}
          >
            {showMoreDetails ? "Hide Details" : "More Details"}
          </Button>

          <Collapse in={showMoreDetails}>
            <Box sx={{ mt: 1 }}>
              {/* Education */}
              {Array.isArray(profileSource.educationDetails) && profileSource.educationDetails.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a", mb: 1 }}>
                    Education
                  </Typography>
                  <Stack spacing={1}>
                    {profileSource.educationDetails.map((edu, i) => (
                      <Paper key={edu._id || i} elevation={0} sx={{ p: 1.25, borderRadius: 1, border: "1px solid #F1F5F9" }}>
                        <Typography sx={{ fontWeight: 700 }}>{edu.courseName || edu.instituteName}</Typography>
                        <Typography sx={{ color: "#64748b", fontSize: "0.82rem" }}>
                          {edu.instituteName} {edu.specialization ? `• ${edu.specialization}` : ""}
                        </Typography>
                        <Typography sx={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                          {edu.startYear || ""} {edu.endYear ? ` - ${edu.endYear}` : ""}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Additional preferences / summary */}
              {profileSource.summary && (
                <Box sx={{ mt: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a", mb: 1 }}>
                    Summary
                  </Typography>
                  <Typography sx={{ color: "#475569", fontSize: "0.9rem" }}>{profileSource.summary}</Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </Box>

        <Divider sx={{ borderColor: "#EEF3F8" }} />

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1.5, px: 2, py: 2, backgroundColor: "#ffffff" }}>
          {profileSource.linkedinLink && (
            <Button
              variant="outlined"
              fullWidth
              onClick={() => window.open(profileSource.linkedinLink, "_blank")}
              startIcon={<LinkedInIcon />}
              sx={{
                textTransform: "none",
                borderColor: "#E6EEF8",
                color: "#0f172a",
                fontWeight: 700,
              }}
              size="small"
            >
              LinkedIn
            </Button>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleViewResume}
            startIcon={<DownloadIcon />}
            sx={{
              textTransform: "none",
              backgroundColor: "#0f172a",
              "&:hover": { backgroundColor: "#0b1220" },
              fontWeight: 700,
            }}
            size="small"
          >
            Resume
          </Button>
        </Box>
      </CardContent>
    </Card>)
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
                    ml: 3,
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "#1f2937",
                    },
                  }}
                  onClick={handleViewProfile} // Navigate to profile on click
                >
                  {highlight(`${applicant.firstName || ""} ${applicant.lastName || ""}`, filterKeywords)}
                </Typography>
                <Chip
                  label={`${matchPercentage}% Match`}
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
                }}
              >
                {highlight(applicant.currentDesignation || "", filterKeywords)}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#4b5563",
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                {highlight(applicant.currentCompany || "", filterKeywords)}
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
                    {applicant.experience}y
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
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isMobile ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                {/* Top row - LinkedIn, Screening, Actions, Resume */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
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
                    startIcon={<QuestionAnswerOutlined />}
                    onClick={() => setScreeningModalOpen(true)}
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
                    Screening
                  </Button>

                  <Tooltip title="Reject">
                    <IconButton
                      onClick={() => handleStageSelect("Not Progressing")}
                      sx={{
                        backgroundColor: "#FFF",
                        border: "2px solid #F87171",
                        color: "#EF4444",
                        borderRadius: "0.25rem", // Square with slightly rounded corners
                        width: "30px",
                        height: "30px",
                        "&:hover": {
                          backgroundColor: "#FEF2F2",
                          color: "#B91C1C",
                          borderColor: "#DC2626",
                        },
                      }}
                    >
                      <CloseRounded />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Shortlist">
                    <IconButton
                      onClick={() => handleStageSelect("Shortlisted")}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        border: "2px solid #10B981",
                        color: "#10B981",
                        borderRadius: "0.25rem",
                        width: "30px",
                        height: "30px",
                        "&:hover": {
                          backgroundColor: "#F0FDF4",
                        },
                      }}
                    >
                      <CheckRounded />
                    </IconButton>
                  </Tooltip>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={openActionsMenu}
                    disabled={action}
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
                    startIcon={<Visibility />}
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
                </Box>
              </Box>
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
            <Box
              sx={{
                height: "100%",
                pr: { md: 3 },
                position: "relative",
              }}
            >
              {/* Simulated divider */}
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  width: "2px",
                  height: "100%", // Takes more of the full height
                  backgroundColor: "#e5e7eb",
                  display: { xs: "none", md: "block" },
                }}
              />
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
                  label="Highest Education"
                  value={applicant.highestQualification?.[0] || "N/A"}
                />
              </Stack>
            </Box>
          </Grid>

          {/* Location & Preferences */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                height: "100%",
                pr: { md: 3 },
                position: "relative",
              }}
            >
              {/* Simulated divider */}
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  width: "2px",
                  height: "100%", // Takes more of the full height
                  backgroundColor: "#e5e7eb",
                  display: { xs: "none", md: "block" },
                }}
              />
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
                      label={highlight(skill, filterKeywords)}
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
      <ScreeningModal
        open={screeningModalOpen}
        onClose={() => setScreeningModalOpen(false)}
        answers={screeningAnswers}
      />
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
