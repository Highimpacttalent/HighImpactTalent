import React from "react";
import {
  Card,
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
} from "@mui/material";
import {
  LinkedIn,
  LocationOn,
  Work,
  School,
  MonetizationOn,
  Business,
  CalendarToday,
  Domain,
  Info as InfoIcon,
} from "@mui/icons-material";

const ApplicationCard = ({ app, navigate, markAsViewed }) => {
  const { applicant, matchScore, status } = app;

  // Determine match chip colors
  const getMatchColor = (score) => {
    if (score > 75) return { bg: "#e8f5e9", fg: "#2e7d32" };
    if (score > 50) return { bg: "#fff3e0", fg: "#f57c00" };
    return { bg: "#ffebee", fg: "#d32f2f" };
  };
  const matchColor = getMatchColor(matchScore);

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 6, mb: 2 }}>
      {/* Header */}
      <CardHeader
        avatar={
          <Avatar
            src={applicant.profileUrl}
            sx={{ width: 60, height: 60, border: "2px solid #3f51b5" }}
          >
            {applicant.firstName?.[0]}
            {applicant.lastName?.[0]}
          </Avatar>
        }
        title={
          <Typography variant="h6" fontWeight={700}>
            {applicant.firstName} {applicant.lastName}
          </Typography>
        }
        subheader={
          <Chip
            label={`${matchScore}% Match`}
            size="small"
            sx={{
              backgroundColor: matchColor.bg,
              color: matchColor.fg,
              fontWeight: 600,
              ml: 1,
            }}
          />
        }
        action={
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
          </Box>
        }
        sx={{ pb: 1 }}
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
                icon={<Domain fontSize="small" />}
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

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                Key Skills
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {applicant.skills?.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    sx={{ fontSize: "0.75rem" }}
                  />
                )) || <Typography variant="body2">No skills</Typography>}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {icon}
    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 110 }}>
      {label}:
    </Typography>
    <Typography variant="body2" fontWeight={500} sx={{ fontSize: "0.9rem" }}>
      {value}
    </Typography>
  </Box>
);

export default ApplicationCard;
