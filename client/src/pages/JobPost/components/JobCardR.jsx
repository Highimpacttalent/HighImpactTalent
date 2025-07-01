import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Button,
  Avatar,
  CircularProgress,
  Menu, 
  MenuItem, 
  IconButton,
  Divider 
} from "@mui/material";
import moment from "moment";
import { 
  LocationOnOutlined, 
  WorkOutlineOutlined, 
  CurrencyRupee,
  MoreVert,
  Edit,
  PlayArrow,
  Pause,
  Delete,
  Visibility
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";

function JobCardRecriter({ job, fetchJobs }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [progress, setProgress] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleActionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
  };

  const handleActionSelect = (action) => {
    handleActionsClose();
    
    switch (action) {
      case 'edit':
        navigate("/view-job-post", { state: { job } });
        break;
      case 'live':
        handleStatusUpdate("live");
        break;
      case 'pause':
        handleStatusUpdate("paused");
        break;
      case 'delete':
        handleStatusUpdate("deleted");
        break;
      default:
        break;
    }
  };

  const canViewApplications = job.status === "live" || job.status === "paused";

  const handleTitleClick = () => {
    if (canViewApplications) {
      navigate(`/applicant/${job._id}`);
    }
  };

  const navigate = useNavigate();
  const handleStatusUpdate = async (newStatus) => {
    try {
      setProgress(true);
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/jobs/update-status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: job._id,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchJobs(); // Refresh the job list after successful update
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    } finally {
      setProgress(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'live': return '#4CAF50';
      case 'paused': return '#FF9800';
      case 'draft': return '#9E9E9E';
      case 'deleted': return '#F44336';
      default: return '#9E9E9E';
    }
  };  

  const getStatusLabel = (status) => {
    return status?.toUpperCase() || 'UNKNOWN';
  };

  // Helper function to format experience text
  const getExperienceText = (experience) => {
    if (!experience) return "Experience not specified";
    
    // If experience is an object with min/max
    if (typeof experience === 'object' && experience !== null) {
      const { minExperience, maxExperience } = experience;
      
      if (minExperience !== undefined && maxExperience !== undefined) {
        return `${minExperience}-${maxExperience} years experience`;
      } else if (minExperience !== undefined) {
        return `${minExperience}+ years experience`;
      } else if (maxExperience !== undefined) {
        return `Up to ${maxExperience} years experience`;
      }
    }
    
    // If experience is a number or string (fallback for old data)
    if (typeof experience === 'number' || typeof experience === 'string') {
      return `${experience}+ years experience`;
    }
    
    return "Experience not specified";
  };

  const desktopView = (
    <div>
      <Box
      sx={{
        width: "100%",
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        p: 3,
        bgcolor: "white",
      }}
    >
      <Stack spacing={2.5}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                color: "#24252C",
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: 1.3,
                mb: 0.5,
                cursor: canViewApplications ? "pointer" : "default",
                "&:hover": canViewApplications ? {
                  color: "#3C7EFC",
                  textDecoration: "underline"
                } : {}
              }}
              onClick={handleTitleClick}
            >
              {job.jobTitle}
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Typography
                sx={{
                  color: "#6B7280",
                  fontFamily: "Poppins",
                  fontSize: "13px",
                  fontWeight: 400
                }}
              >
                Posted {moment(job?.createdAt).fromNow()}
              </Typography>
              
              {job?.status && (
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: `${getStatusColor(job.status)}20`,
                    border: `1px solid ${getStatusColor(job.status)}40`
                  }}
                >
                  <Typography
                    sx={{
                      color: getStatusColor(job.status),
                      fontFamily: "Poppins",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.5px"
                    }}
                  >
                    {getStatusLabel(job.status)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Actions Menu */}
          {job.status !== "deleted" && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {canViewApplications && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Visibility sx={{ fontSize: "16px !important" }} />}
                  sx={{
                    borderColor: "#3C7EFC",
                    color: "#3C7EFC",
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    fontFamily: "Satoshi",
                    fontWeight: 600,
                    fontSize: "13px",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#3C7EFC",
                      bgcolor: "#3C7EFC08"
                    }
                  }}
                  onClick={() => navigate(`/applicant/${job._id}`)}
                >
                  View Applications
                </Button>
              )}
              
              <IconButton
                onClick={handleActionsClick}
                sx={{
                  color: "#6B7280",
                  "&:hover": {
                    bgcolor: "#F3F4F6"
                  }
                }}
              >
                <MoreVert />
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleActionsClose}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    minWidth: 160,
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                    border: "1px solid #E5E7EB"
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem 
                  onClick={() => handleActionSelect('edit')}
                  sx={{ 
                    fontFamily: "Satoshi", 
                    fontSize: "14px",
                    py: 1,
                    px: 2
                  }}
                >
                  <Edit sx={{ mr: 1.5, fontSize: "18px", color: "#6B7280" }} />
                  Edit Job
                </MenuItem>
                
                {(job.status === "draft" || job.status === "paused") && (
                  <MenuItem 
                    onClick={() => handleActionSelect('live')}
                    sx={{ 
                      fontFamily: "Satoshi", 
                      fontSize: "14px",
                      py: 1,
                      px: 2
                    }}
                  >
                    <PlayArrow sx={{ mr: 1.5, fontSize: "18px", color: "#6B7280" }} />
                    Make it Live
                  </MenuItem>
                )}
                
                {job.status === "live" && (
                  <MenuItem 
                    onClick={() => handleActionSelect('pause')}
                    sx={{ 
                      fontFamily: "Satoshi", 
                      fontSize: "14px",
                      py: 1,
                      px: 2
                    }}
                  >
                    <Pause sx={{ mr: 1.5, fontSize: "18px", color: "#6B7280" }} />
                    Pause Job
                  </MenuItem>
                )}
                
                <Divider sx={{ my: 0.5 }} />
                
                <MenuItem 
                  onClick={() => handleActionSelect('delete')}
                  sx={{ 
                    fontFamily: "Satoshi", 
                    fontSize: "14px",
                    py: 1,
                    px: 2,
                    color: "#EF4444"
                  }}
                >
                  <Delete sx={{ mr: 1.5, fontSize: "18px", color: "#EF4444" }} />
                  Delete Job
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>

        {/* Job Details Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            icon={<LocationOnOutlined sx={{ color: "#6B7280 !important", fontSize: "16px !important" }} />}
            label={job?.jobLocation}
            variant="outlined"
            sx={{ 
              color: "#374151", 
              fontWeight: "500",
              fontFamily: "Poppins",
              fontSize: "13px",
              borderColor: "#D1D5DB",
              bgcolor: "#F9FAFB"
            }}
          />
          <Chip
            icon={<WorkOutlineOutlined sx={{ color: "#6B7280 !important", fontSize: "16px !important" }} />}
            label={getExperienceText(job?.experience)}
            variant="outlined"
            sx={{ 
              color: "#374151", 
              fontWeight: "500",
              fontFamily: "Poppins",
              fontSize: "13px",
              borderColor: "#D1D5DB",
              bgcolor: "#F9FAFB"
            }}
          />
          <Chip
            icon={<CurrencyRupee sx={{ color: "#6B7280 !important", fontSize: "16px !important" }} />}
            label={
              job.salaryConfidential
                ? "Confidential"
                : `${Number(job.salary.maxSalary||job.salary).toLocaleString("en-IN")} (${
                        job.salaryCategory
                      }) LPA`
            }
            variant="outlined"
            sx={{ 
              color: "#374151", 
              fontWeight: "500",
              fontFamily: "Poppins",
              fontSize: "13px",
              borderColor: "#D1D5DB",
              bgcolor: "#F9FAFB"
            }}
          />
        </Box>

        {/* Skills Section */}
        <Box>
          {job.skills && job.skills.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {job.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  variant="filled"
                  size="small"
                  sx={{
                    bgcolor: "#EEF2FF",
                    color: "#4F46E5",
                    fontWeight: "500",
                    fontFamily: "Poppins",
                    fontSize: "12px",
                    borderRadius: 1.5,
                    height: "26px"
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography
              sx={{
                color: "#9CA3AF",
                fontStyle: "italic",
                fontFamily: "Satoshi",
                fontSize: "13px"
              }}
            >
              No skills provided
            </Typography>
          )}
        </Box>

        {/* Footer Info */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          pt: 1,
          borderTop: "1px solid #F3F4F6"
        }}>
          <Typography
            sx={{ 
              color: "#6B7280", 
              fontFamily: "Poppins", 
              fontSize: "14px",
              fontWeight: 500
            }}
          >
            {job.totalApplications} {job.totalApplications === 1 ? 'Application' : 'Applications'}
          </Typography>
        </Box>
      </Stack>
    </Box>
    </div>
  );

  const mobileView = (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: { md: "50%", lg: "50%", xs: "100%", sm: "100%" },
            border: "1px solid #00000040",
            p: 3,
            borderRadius: 4,
          }}
        >
          <Stack>
            {/* Avatar always top-left */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "flex-start",
                mb: { xs: 4 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <Avatar
                    sx={{
                      bgcolor: "#D9D9D9",
                      width: 40,
                      height: 40,
                      fontSize: "1.5rem",
                      mr: { xs: 2, sm: 4 },
                    }}
                  >
                    {job.jobTitle.charAt(0)}
                  </Avatar>
                </Box>
                {/* Name */}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    sx={{
                      color: "#24252C",
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontSize: "16px",
                    }}
                  >
                    {job.jobTitle}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "12px",
                      color: "#00A824E5",
                    }}
                  >
                    {moment(job?.createdAt).fromNow()}
                  </Typography>
                </Box>
              </Box>
              <Box>
                {job.status !== "deleted" && (
                  <Typography
                    sx={{
                      py: 0.25,
                      color: "#558CB9",
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontSize: "14px",
                      borderRadius: 2,
                    }}
                    onClick={() => navigate("/view-job-post", { state: { job } })}
                  >
                    Edit Details
                  </Typography>
                )}
              </Box>
            </Box>
            {/* Job Details */}
            <Box sx={{ display: "flex", flexWrap: "wrap" }} gap={1}>
              <Box sx={{ display: "flex" }} gap={0.5}>
                <Chip
                  icon={<LocationOnOutlined sx={{ color: "#474E68" }} />}
                  label={job?.jobLocation}
                  variant="contained"
                  sx={{ color: "#474E68", fontWeight: "400" }}
                />
                <Chip
                  icon={<WorkOutlineOutlined sx={{ color: "#474E68" }} />}
                  label={getExperienceText(job?.experience)}
                  variant="contained"
                  sx={{ color: "#474E68", fontWeight: "400" }}
                />
              </Box>
              <Chip
                icon={<CurrencyRupee sx={{ color: "#474E68" }} />}
                label={
                  job.salaryConfidential
                    ? "Confidential"
                    : `${Number(job.salary.maxSalary||job.salary).toLocaleString("en-IN")} (${
                        job.salaryCategory
                      }) LPA`
                }
                variant="contained"
                sx={{ color: "#474E68", fontWeight: "400" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
                mt: 3,
              }}
            >
              {(job.status === "live" || job.status === "paused") && (
                <Typography
                  sx={{
                    color: "#2F6DE0",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/applicant/${job._id}`)}
                >
                  <RemoveRedEyeIcon fontSize="25px" /> View applications
                </Typography>
              )}
              {job?.status && (
                <Typography sx={{ color: "#474E68", fontFamily: "Poppins" }}>
                  Job Status:{" "}
                  <span style={{ textTransform: "uppercase" }}>
                    {job.status}
                  </span>
                </Typography>
              )}
            </Box>
            {job.status !== "deleted" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  mt: 2,
                  gap: 2,
                }}
              >
                {job.status !== "deleted" && progress ? (
                  <CircularProgress size={24} sx={{ color: "#9E0000" }} />
                ) : (
                  job.status !== "deleted" && (
                    <DeleteIcon
                      onClick={() => handleStatusUpdate("deleted")}
                      sx={{ color: "#9E0000" }}
                    />
                  )
                )}

                {(job.status === "draft" || job.status === "paused") && (
                  <Button
                    variant="contained"
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: 50,
                      fontFamily: "Satoshi",
                      fontWeight: 700,
                      fontSize: {
                        md: "16px",
                        lg: "16px",
                        xs: "12px",
                        sm: "12px",
                      },
                      textTransform: "none",
                    }}
                    disabled={progress}
                    onClick={() => handleStatusUpdate("live")}
                  >
                    Make it Live
                  </Button>
                )}
                {job.status === "live" && (
                  <Button
                    variant="contained"
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: 50,
                      fontFamily: "Satoshi",
                      fontWeight: 700,
                      fontSize: {
                        md: "16px",
                        lg: "16px",
                        xs: "12px",
                        sm: "12px",
                      },
                      textTransform: "none",
                    }}
                    disabled={progress}
                    onClick={() => handleStatusUpdate("paused")}
                  >
                    Pause Job
                  </Button>
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </div>
  );

  return <Box>{isMobile ? mobileView : desktopView}</Box>;
}

export default JobCardRecriter;