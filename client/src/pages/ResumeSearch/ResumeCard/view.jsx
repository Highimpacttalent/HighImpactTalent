import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Button,
  IconButton,
  Grid,
  Stack,
  Tooltip,
  Drawer,
  Collapse,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  WorkOutline as WorkOutlineIcon,
  Business as BusinessIcon,
  MonetizationOn as MonetizationOnIcon,
  LocationOn as LocationOnIcon,
  School as SchoolIcon,
  LinkedIn as LinkedInIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckRounded as CheckRoundedIcon,
  CloseRounded as CloseRoundedIcon,
} from "@mui/icons-material";

// --- Helper function for highlighting keywords (from your example) ---
export const escapeRegExp = (s = "") =>
  String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function highlight(text, keywords) {
  const str = String(text ?? "");
  if (!keywords || keywords.length === 0) return str;

  const tokens = Array.isArray(keywords)
    ? keywords.map((k) => String(k || "").trim()).filter(Boolean)
    : String(keywords)
        .split(/[\s,]+/)
        .map((k) => k.trim())
        .filter(Boolean);

  if (!tokens.length) return str;
  tokens.sort((a, b) => b.length - a.length);

  const pattern = tokens.map(escapeRegExp).join("|");
  const parts = str.split(new RegExp(`(${pattern})`, "gi"));

  return parts.map((part, idx) =>
    tokens.some((t) => part.toLowerCase().includes(t.toLowerCase())) ? (
      <Box
        component="span"
        key={idx}
        sx={{ backgroundColor: "#fff59d", borderRadius: 1 }}
      >
        {part}
      </Box>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

// --- Helper component for structured details (from your example) ---
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
          display: "block",
          lineHeight: 1.2,
          mb:1.5
        }}
      >
        {label}
      </Typography>
      <Box>
        {/* value can be string or node */}
        {typeof value === "string" ? (
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
        ) : (
          value
        )}
      </Box>
    </Box>
  </Box>
);

export default function ProfessionalResumeCard({
  resume = {},
  onShortlist,
  onReject,
  onViewProfile,
  filterKeywords = [],
}) {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // --- Data Normalization ---
  const isRAG = resume && resume.retrieval_score !== undefined;
  const name = isRAG
    ? resume.personal_info?.name || "N/A"
    : resume.name || "N/A";
  const role = isRAG
    ? resume.professional_profile?.current_role
    : resume.currentJobRole;
  // const company = isRAG ? resume.professional_profile?.current_company : resume.currentCompany; // no longer used as main display
  const location = isRAG ? resume.personal_info?.location : resume.location;
  const experience = isRAG
    ? resume.professional_profile?.total_experience_stated
    : resume.experience;
  const education = isRAG ? resume.education || [] : resume.education || [];
  const skills = isRAG ? resume.skills || [] : resume.technicalSkills || [];
  const work = resume?.work_experience.slice(0,3) || [];
  const matchPercent = isRAG
    ? Math.round((resume.retrieval_score || 0) * 100)
    : resume.matchPercent ?? null;
  const resumeUrl =
    resume?.metadata?.resume_url || resume?.applicant?.cvUrl || null;
  const linkedinUrl = resume.personal_info?.contact?.linkedin;
  const salary = resume.salary || resume.expectedSalary;
  const displayedEducation = expandedDetails ? education : education.slice(0, 3);

  const getInitials = (nameStr) => {
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewProfileClick = () => {
    if (onViewProfile) onViewProfile(resume);
    setResumeOpen(true);
  };

  const formatMonthYear = (dateStr) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  };

  // -- Match Score Color Logic (from your example) ---
  const getMatchColor = (score) => {
    if (score >= 80) return { bg: "#f0f8f0", fg: "#2d5a2d", border: "#4a7c4a" };
    if (score >= 60) return { bg: "#fff8e1", fg: "#8b4513", border: "#daa520" };
    return { bg: "#fef2f2", fg: "#b91c1c", border: "#dc2626" };
  };
  const matchColor = getMatchColor(matchPercent);

  const EducationNode = (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
    {education.length ? (
      displayedEducation.map((ed, idx) => (
        <Box
          key={idx}
          sx={{ display: "flex", gap: 0.25, flexDirection: "column" }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              color: "#0f172a",
              fontSize: "0.9rem",
              lineHeight: 1.1,
              mb: 0.25, // tighten space below title
            }}
          >
            {ed.degree || ed.institution || "—"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >

            {ed.class_of && (
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontFamily: "Satoshi, sans-serif",
                  fontSize: "0.72rem",
                  lineHeight: 1,
                }}
              >
                Class of {ed.class_of}
              </Typography>
            )}

            {ed.year && (
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontFamily: "Satoshi, sans-serif",
                  fontSize: "0.72rem",
                  lineHeight: 1,
                }}
              >
                {ed.year}
              </Typography>
            )}
          </Box>

          {ed.specialization && (
            <Typography
              variant="body2"
              sx={{
                color: "#475569",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.82rem",
                lineHeight: 1.18,
                mt: 0.25, // small gap but compact
              }}
            >
              {ed.specialization}
            </Typography>
          )}
        </Box>
      ))
    ) : (
      <Typography
        variant="body2"
        sx={{ color: "#374151", fontFamily: "Poppins, sans-serif" }}
      >
        No education provided
      </Typography>
    )}

    {/* show toggle if many entries */}
    {education.length > 3 && (
      <Box sx={{ mt: 0.5 }}>
        <Button
          size="small"
          onClick={() => setExpandedDetails(!expandedDetails)}
          sx={{
            textTransform: "none",
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 600,
            color: "#6366f1",
            fontSize: "0.75rem",
            p: 0,
          }}
          endIcon={
            expandedDetails ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )
          }
        >
          {expandedDetails ? "Show less" : `Show ${education.length - 3} more`}
        </Button>
      </Box>
    )}
  </Box>
);
// UPDATED WorkExperienceNode (more compact spacing)
const WorkExperienceNode = (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
    {work.length ? (
      work.map((w, idx) => (
        <Box
          key={idx}
          sx={{ display: "flex", gap: 0.25, flexDirection: "column" }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              color: "#0f172a",
              fontSize: "0.9rem",
              lineHeight: 1.1,
              mb: 0.25,
            }}
          >
            {w.role || "—"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#2563eb",
                fontWeight: 600,
                fontFamily: "Satoshi, sans-serif",
                fontSize: "0.72rem",
                lineHeight: 1,
              }}
            >
              {w.company || "—"}
            </Typography>
            {w.duration && (
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontFamily: "Satoshi, sans-serif",
                  fontSize: "0.72rem",
                  lineHeight: 1,
                }}
              >
                {w.duration}
              </Typography>
            )}
          </Box>
        </Box>
      ))
    ) : (
      <Typography
        variant="body2"
        sx={{ color: "#374151", fontFamily: "Poppins, sans-serif" }}
      >
        No work experience provided
      </Typography>
    )}
  </Box>
);

  // --- MOBILE VIEW JSX ---
  if (isMobile) {
    const displayedExperiences = expandedDetails ? work : work.slice(0, 2);

    return (
      <Card
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          border: "1px solid #E6EEF8",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(16,24,40,0.06)",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box
            sx={{ display: "flex", gap: 2, alignItems: "center", px: 2, py: 2 }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                border: "2px solid #E6EEF8",
                bgcolor: "#F8FAFC",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: 700,
              }}
              onClick={handleViewProfileClick}
            >
              {getInitials(name)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                onClick={handleViewProfileClick}
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
                {highlight(name, filterKeywords)}
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
                {highlight(role || "—", filterKeywords)}{" "}
                {work[0] ? `• ${work[0].company}` : ""}
              </Typography>
              {matchPercent !== null && (
                <Box sx={{ mt: 0.75 }}>
                  <Chip
                    label={`${matchPercent}% match`}
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
              )}
            </Box>
          </Box>
          <Divider sx={{ borderColor: "#EEF3F8" }} />

          {/* Experience History */}
          <Box sx={{ px: 2, py: 2, backgroundColor: "#fff" }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#0f172a",
                mb: 1,
              }}
            >
              Experience History
            </Typography>
            {displayedExperiences.length > 0 ? (
              <Stack spacing={1}>
                {displayedExperiences.map((exp, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 1.25,
                      borderRadius: 1,
                      border: "1px solid #F1F5F9",
                      backgroundColor: "#FBFDFF",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "#0f172a",
                      }}
                    >
                      {exp.role || "—"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        color: "#2563eb",
                        fontWeight: 600,
                      }}
                    >
                      {exp.company || "—"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.78rem", color: "#64748b" }}>
                      {exp.duration || "N/A"}
                    </Typography>
                  </Paper>
                ))}
                {work.length > 2 && (
                  <Button
                    onClick={() => setExpandedDetails(!expandedDetails)}
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
                    endIcon={
                      expandedDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />
                    }
                  >
                    {expandedDetails
                      ? "Show less"
                      : `Show ${work.length - 2} more`}
                  </Button>
                )}
              </Stack>
            ) : (
              <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                No experience history provided
              </Typography>
            )}
          </Box>
          <Divider sx={{ borderColor: "#EEF3F8" }} />

          {/* Quick Stats */}
          <Box sx={{ px: 2, py: 2, backgroundColor: "#ffffff" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 1,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                  {experience || "—"}y
                </Typography>
                <Typography
                  sx={{ fontSize: "0.72rem", color: "#64748b", mt: 0.25 }}
                >
                  Experience
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                  {salary ? `₹${salary}L` : "N/A"}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.72rem", color: "#64748b", mt: 0.25 }}
                >
                  Salary
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                  {location || "—"}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.72rem", color: "#64748b", mt: 0.25 }}
                >
                  Location
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ borderColor: "#EEF3F8" }} />

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              px: 2,
              py: 2,
              backgroundColor: "#ffffff",
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={handleViewProfileClick}
              startIcon={<DownloadIcon />}
              sx={{
                textTransform: "none",
                borderColor: "#E6EEF8",
                color: "#0f172a",
                fontWeight: 700,
              }}
              size="small"
            >
              Resume
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => onShortlist(resume._id)}
              sx={{
                textTransform: "none",
                backgroundColor: "#10B981",
                "&:hover": { backgroundColor: "#059669" },
                fontWeight: 700,
              }}
              size="small"
            >
              Shortlist
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // --- DESKTOP VIEW JSX ---
  return (
    <Card
      sx={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        "&:hover": {
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          borderColor: "#d1d5db",
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
          {/* Left: Basic Info */}
          <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#f0f4ff",
                color: "#3b82f6",
                fontWeight: 600,
              }}
              onClick={handleViewProfileClick}
            >
              {getInitials(name)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Typography
                  variant="h6"
                  onClick={handleViewProfileClick}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    color: "#111827",
                    fontSize: "1.125rem",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "#1f2937",
                    },
                  }}
                >
                  {highlight(name, filterKeywords)}
                </Typography>
                {matchPercent !== null && (
                  <Chip
                    label={`${matchPercent}% Match`}
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
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#4b5563",
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: 500,
                }}
              >
                {highlight(role || "—", filterKeywords)}{" "}
                {work[0] ? `• ${work[0].company}` : ""}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  color: "#6b7280",
                  mt: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <WorkOutlineIcon sx={{ fontSize: 14 }} />
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}
                  >
                    {experience}y Exp
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 14 }} />
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}
                  >
                    {location}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Right: Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {linkedinUrl && (
              <Tooltip title="LinkedIn Profile">
                <IconButton
                  href={linkedinUrl}
                  target="_blank"
                  size="small"
                  sx={{
                    color: "#0077b5",
                    "&:hover": { backgroundColor: "#f0f8ff" },
                  }}
                >
                  <LinkedInIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Button
              variant="contained"
              size="small"
              onClick={handleViewProfileClick}
              sx={{
                textTransform: "none",
                fontFamily: "Satoshi, sans-serif",
                fontWeight: 600,
                backgroundColor: "#374151",
                "&:hover": { backgroundColor: "#1f2937" },
              }}
            >
              Resume
            </Button>
          </Box>
        </Box>

        {/* Details Grid */}
        <Grid container spacing={3}>
          {/* <-- UPDATED: show full mapped work experience instead of single Current Company --> */}
          <Grid item xs={12} md={4}>
            <DetailItem
              icon={<BusinessIcon sx={{ fontSize: 16, color: "#6b7280" }} />}
              label="Work Experience"
              value={WorkExperienceNode}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <DetailItem
              icon={<SchoolIcon sx={{ fontSize: 16, color: "#6b7280" }} />}
              label="Education"
              value={EducationNode}
            />
          </Grid>

          <Grid item xs={12} md={4}>
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
                {(expandedDetails ? skills : skills.slice(0, 5)).map(
                  (skill) => (
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
                      }}
                    />
                  )
                )}
                {skills.length > 5 && (
                  <Button
                    size="small"
                    onClick={() => setExpandedDetails(!expandedDetails)}
                    sx={{
                      textTransform: "none",
                      fontFamily: "Satoshi, sans-serif",
                      fontWeight: 600,
                      color: "#6366f1",
                      fontSize: "0.75rem",
                      p: 0,
                      minWidth: "auto",
                    }}
                  >
                    {expandedDetails
                      ? "Show Less"
                      : `+${skills.length - 5} more`}
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      {/* --- Resume Drawer --- */}
      <Drawer
        anchor="right"
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "70%", md: "50%" },
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
        {resumeUrl ? (
          <Box
            component="iframe"
            src={resumeUrl}
            title="Resume Preview"
            sx={{ height: "100%", width: "100%", border: "none" }}
          />
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography
              variant="body1"
              sx={{ fontFamily: "Satoshi, sans-serif", color: "#6b7280" }}
            >
              No resume available
            </Typography>
          </Box>
        )}
      </Drawer>
    </Card>
  );
}
