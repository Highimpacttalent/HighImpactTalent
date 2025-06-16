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
  Grid,
  Stack,
  Tooltip,
  Menu,
  MenuItem,
  Drawer,
  Divider,
  Badge
} from '@mui/material';
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
  Visibility,
  Phone,
  Email,
  CalendarToday,
  TrendingUp
} from '@mui/icons-material';
import {useTheme} from "@mui/material";
import {useMediaQuery} from "@mui/material";

const ApplicationCard = ({ app, navigate, markAsViewed }) => {
  const { applicant, matchScore, status, screeningAnswers } = app;
  const [showAll, setShowAll] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const skills = applicant.skills || [];
  const visibleSkills = showAll ? skills : skills.slice(0, 8);

  // Professional match color scheme
  const getMatchColor = (score) => {
    if (score >= 80) return { bg: "#f0f8f0", fg: "#2d5a2d", border: "#4a7c4a" };
    if (score >= 60) return { bg: "#fff8e1", fg: "#8b4513", border: "#daa520" };
    return { bg: "#fef2f2", fg: "#b91c1c", border: "#dc2626" };
  };
  const matchColor = getMatchColor(matchScore);

  const handleViewResume = () => {
    if (applicant?.cvUrl) {
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

  return (
    <Card sx={{ 
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: 2,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      mb: 2,
      '&:hover': {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        borderColor: '#d1d5db',
        transition: 'all 0.2s ease'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header Row */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3
        }}>
          {/* Left Side - Avatar and Basic Info */}
          <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <Avatar
              src={applicant.profileUrl}
              sx={{
                width: 60,
                height: 60,
                border: '2px solid #f3f4f6',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#374151',
                backgroundColor: '#f9fafb'
              }}
            >
              {applicant.firstName?.[0]}{applicant.lastName?.[0]}
            </Avatar>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    color: '#111827',
                    fontSize: '1.125rem',
                    lineHeight: 1.2
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
                    fontFamily: 'Satoshi, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 24
                  }}
                />
                
                <Chip
                  label={status}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#d1d5db',
                    color: '#6b7280',
                    fontFamily: 'Satoshi, sans-serif',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: 24
                  }}
                />
              </Box>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#4b5563',
                  fontFamily: 'Satoshi, sans-serif',
                  fontWeight: 500,
                  mb: 0.5
                }}
              >
                {applicant.currentDesignation} • {applicant.currentCompany}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: '#6b7280' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Work sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }}>
                    {applicant.experience} yrs exp
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }}>
                    {applicant.currentLocation}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MonetizationOn sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }}>
                    ₹{applicant.currentSalary}L - ₹{applicant.expectedMinSalary}L
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile ? (
              <>
                {applicant.linkedinLink && (
                  <Tooltip title="LinkedIn Profile">
                    <IconButton
                      href={applicant.linkedinLink}
                      target="_blank"
                      size="small"
                      sx={{ 
                        color: '#0077b5',
                        '&:hover': { backgroundColor: '#f0f8ff' }
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
                    textTransform: 'none',
                    fontFamily: 'Satoshi, sans-serif',
                    fontWeight: 600,
                    borderColor: '#d1d5db',
                    color: '#374151',
                    '&:hover': { 
                      borderColor: '#9ca3af',
                      backgroundColor: '#f9fafb'
                    },
                    minWidth: 100
                  }}
                >
                  Profile
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Download />}
                  onClick={handleViewResume}
                  sx={{ 
                    textTransform: 'none',
                    fontFamily: 'Satoshi, sans-serif',
                    fontWeight: 600,
                    backgroundColor: '#374151',
                    '&:hover': { backgroundColor: '#1f2937' },
                    minWidth: 100
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
                    <MenuItem component="a" href={applicant.linkedinLink} target="_blank">
                      <LinkedIn fontSize="small" sx={{ mr: 1, color: "#0077b5" }} />
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
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  color: '#374151',
                  mb: 1.5,
                  fontSize: '0.875rem'
                }}
              >
                Professional Details
              </Typography>
              <Stack spacing={1}>
                <DetailItem
                  icon={<Business sx={{ fontSize: 16, color: '#6b7280' }} />}
                  label="Current Company"
                  value={applicant.currentCompany || "N/A"}
                />
                <DetailItem
                  icon={<TrendingUp sx={{ fontSize: 16, color: '#6b7280' }} />}
                  label="Consulting Experience"
                  value={`${applicant.totalYearsInConsulting || 0} years`}
                />
                <DetailItem
                  icon={<School sx={{ fontSize: 16, color: '#6b7280' }} />}
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
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  color: '#374151',
                  mb: 1.5,
                  fontSize: '0.875rem'
                }}
              >
                Location & Preferences
              </Typography>
              <Stack spacing={1}>
                <DetailItem
                  icon={<LocationOn sx={{ fontSize: 16, color: '#6b7280' }} />}
                  label="Open to Relocate"
                  value={applicant.openToRelocate || "N/A"}
                />
                <DetailItem
                  icon={<LocationOn sx={{ fontSize: 16, color: '#6b7280' }} />}
                  label="Preferred Locations"
                  value={applicant.preferredLocations?.slice(0, 2).join(", ") || "Any"}
                />
                <DetailItem
                  icon={<Work sx={{ fontSize: 16, color: '#6b7280' }} />}
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
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  color: '#374151',
                  mb: 1.5,
                  fontSize: '0.875rem'
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
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        fontFamily: 'Satoshi, sans-serif',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        height: 24,
                        '&:hover': {
                          backgroundColor: '#e5e7eb'
                        }
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
                    fontFamily: 'Satoshi, sans-serif',
                    fontWeight: 600,
                    color: '#6366f1',
                    fontSize: '0.75rem',
                    p: 0,
                    minWidth: 'auto'
                  }}
                >
                  {showAll ? "Show Less" : `+${skills.length - 8} more`}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      {/* Resume Drawer */}
      <Drawer
        anchor="right"
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        PaperProps={{ 
          sx: { 
            width: { xs: "100%", sm: 600 },
            backgroundColor: '#ffffff'
          } 
        }}
      >
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: '1px solid #e5e7eb'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              color: '#111827'
            }}
          >
            Resume Preview
          </Typography>
          <IconButton 
            onClick={() => setResumeOpen(false)}
            size="small"
          >
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
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: 'Satoshi, sans-serif',
                color: '#6b7280'
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
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
    <Box sx={{ mt: 0.25 }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography 
        variant="caption" 
        sx={{ 
          color: '#9ca3af', 
          fontFamily: 'Satoshi, sans-serif',
          fontWeight: 500,
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          display: 'block',
          lineHeight: 1.2
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#374151',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500,
          fontSize: '0.8rem',
          lineHeight: 1.3,
          mt: 0.25
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

export default ApplicationCard;