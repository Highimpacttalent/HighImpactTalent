import { useState } from "react";
import {
  CardHeader,
  Avatar,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  CardContent,
  Button,
  Stack,
  Tooltip,
  Drawer,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  LinkedIn,
  LocationOn,
  Work,
  School,
  MonetizationOn,
  Business,
  Info as InfoIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

const ApplicationCard = ({ app, navigate, markAsViewed }) => {
  const { applicant, matchScore, status } = app;
  const [showAll, setShowAll] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);


  const skills = applicant.skills || [];
  const visibleSkills = showAll ? skills : skills.slice(0, 5);

  // Determine match chip colors
  const getMatchColor = (score) => {
    if (score > 75) return { bg: "#e8f5e9", fg: "#2e7d32" };
    if (score > 50) return { bg: "#fff3e0", fg: "#f57c00" };
    return { bg: "#ffebee", fg: "#d32f2f" };
  };
  const matchColor = getMatchColor(matchScore);

  const handleViewResume = () => {
    if (applicant?.cvUrl) {
      setResumeOpen(true);
    } else {
      alert("Resume link not available...");
    }
  };

  return (
    <>
      <Box sx={{ p: 2, borderRadius: 3, mb: 2, border: "2px solid #e0e0e0" }}>
        {/* Header */}
        <CardHeader
      sx={{
        pb: 1,
        "& .MuiCardHeader-content": {
          flex: 1,
          ml: isMobile ? 0 : 2,
        },
      }}
      avatar={
        <Avatar
          src={applicant.profileUrl}
          sx={{
            width: isMobile ? 48 : 60,
            height: isMobile ? 48 : 60,
            border: "2px solid",
            borderColor: theme.palette.primary.main,
          }}
        >
          {applicant.firstName?.[0]}
          {applicant.lastName?.[0]}
        </Avatar>
      }
      title={
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: 1,
          }}
        >
          <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={700}>
            {applicant.firstName} {applicant.lastName}
          </Typography>
          <Chip
            label={`${matchScore}% Match`}
            size="small"
            sx={{
              backgroundColor: matchColor.bg,
              color: matchColor.fg,
              fontWeight: 600,
            }}
          />
        </Box>
      }
      action={
        isMobile ? (
          <>
            <IconButton onClick={openMenu}>
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
                  onClick={closeMenu}
                >
                  <LinkedIn fontSize="small" sx={{ mr: 1, color: "#0077b5" }} />
                  LinkedIn
                </MenuItem>
              )}
              <MenuItem onClick={() => {
                if (status === "Applied") markAsViewed(app._id);
                navigate("/view-profile", {
                  state: { applicant, status, applicationId: app._id },
                });
              }}>View Profile</MenuItem>
              <MenuItem onClick={() => { handleViewResume(); closeMenu(); }}>
                View Resume
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {applicant.linkedinLink && (
              <Tooltip title="LinkedIn Profile">
                <IconButton
                  href={applicant.linkedinLink}
                  target="_blank"
                  sx={{ color: "#0077b5" }}
                >
                  <LinkedIn />
                </IconButton>
              </Tooltip>
            )}
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                if (status === "Applied") markAsViewed(app._id);
                navigate("/view-profile", {
                  state: { applicant, status, applicationId: app._id },
                });
              }}
              sx={{ textTransform: "none" }}
            >
              View Profile
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleViewResume}
              sx={{ textTransform: "none" }}
            >
              View Resume
            </Button>
          </Box>
        )
      }
    />

        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={2}>
            {/* Basic Info */}
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={1}>
                <InfoRow
                  icon={<Work fontSize="small" />}
                  label="Designation"
                  value={applicant.currentDesignation || "N/A"}
                />
                <InfoRow
                  icon={<Business fontSize="small" />}
                  label="Company"
                  value={applicant.currentCompany || "N/A"}
                />
                <InfoRow
                  icon={<MonetizationOn fontSize="small" />}
                  label="Current Salary"
                  value={
                    applicant.currentSalary
                      ? `₹${applicant.currentSalary}K`
                      : "N/A"
                  }
                />
                <InfoRow
                  icon={<MonetizationOn fontSize="small" />}
                  label="Expected Salary"
                  value={
                    applicant.expectedMinSalary
                      ? `₹${applicant.expectedMinSalary}K`
                      : "N/A"
                  }
                />
              </Stack>
            </Grid>

            {/* Experience & Consulting */}
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={1}>
                <InfoRow
                  icon={<InfoIcon fontSize="small" />}
                  label="Total Exp"
                  value={`${applicant.experience} yrs`}
                />
                <InfoRow
                  icon={<Business fontSize="small" />}
                  label="Consulting"
                  value={`${applicant.totalYearsInConsulting || 0} yrs`}
                />
                <InfoRow
                  icon={<LocationOn fontSize="small" />}
                  label="Location"
                  value={applicant.currentLocation}
                />
                <InfoRow
                  icon={<LocationOn fontSize="small" />}
                  label="Relocate"
                  value={applicant.openToRelocate}
                />
              </Stack>
            </Grid>

            {/* Skills & Preferences */}
            <Grid item xs={12} sm={12} md={4}>
              <Stack spacing={1}>
                <InfoRow
                  icon={<School fontSize="small" />}
                  label="Education"
                  value={applicant.highestQualification?.join(", ") || "N/A"}
                />
                <InfoRow
                  icon={<LocationOn fontSize="small" />}
                  label="Preferred Loc"
                  value={applicant.preferredLocations?.join(", ") || "Any"}
                />
                <InfoRow
                  icon={<Business fontSize="small" />}
                  label="Work Type"
                  value={applicant.preferredWorkTypes?.join(", ") || "Any"}
                />
                <InfoRow
                  icon={<Business fontSize="small" />}
                  label="Work Mode"
                  value={applicant.preferredWorkModes?.join(", ") || "Any"}
                />
              </Stack>
            </Grid>

            {/* Key Skills */}
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 0.5 }}
                >
                  Key Skills
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {skills.length > 0 ? (
                    visibleSkills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2">No skills</Typography>
                  )}
                </Box>

                {skills.length > 6 && (
                  <Button
                    size="small"
                    onClick={() => setShowAll((prev) => !prev)}
                    sx={{ mt: 1, textTransform: "none", fontSize: "0.75rem" }}
                  >
                    {showAll ? "View Less" : "View More"}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Box>

      {/* Resume Drawer */}
      <Drawer
        anchor="right"
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 600 } } }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Typography variant="h6">Resume Preview</Typography>
          <IconButton onClick={() => setResumeOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
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
          <Box sx={{ p: 4 }}>
            <Typography>No resume to display.</Typography>
          </Box>
        )}
      </Drawer>
    </>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {icon}
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontSize: "0.9rem", fontFamily: "Satoshi, sans-serif" }}
    >
      {label}:
    </Typography>
    <Typography
      variant="body2"
      fontWeight={500}
      sx={{ fontSize: "0.9rem",fontFamily: "Poppins, sans-serif" }}
    >
      {value}
    </Typography>
  </Box>
);

export default ApplicationCard;
