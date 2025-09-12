import moment from "moment";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Stack,
  useMediaQuery,
  useTheme,
  Button,
  Collapse,
} from "@mui/material";
import {
  LocationOnOutlined,
  WorkOutlineOutlined,
  Business,
  CurrencyRupee,
  CheckCircle,
  RadioButtonUnchecked,
  Visibility,
  Assignment,
  Person,
  WorkOutline,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const AppliedJobMenuCard = ({ job, flag = false, enable = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showAllStatuses, setShowAllStatuses] = useState(false);

  // Define all possible statuses in order
  const allStatuses = [
    { key: "APPLIED", label: "Applied", icon: <CheckCircle /> },
    { key: "APPLICATION VIEWED", label: "Application Viewed", icon: <Visibility /> },
    { key: "SHORTLISTED", label: "Shortlisted", icon: <Assignment /> },
    { key: "INTERVIEWING", label: "Interviewed", icon: <Person /> },
    { key: "HIRED", label: "Hired", icon: <WorkOutline /> },
  ];

  const getCurrentStatusIndex = () => {
    const currentStatus = job?.status?.toUpperCase();
    return allStatuses.findIndex(status => status.key === currentStatus);
  };

  const currentStatusIndex = getCurrentStatusIndex();
  const currentStatus = job?.status?.toUpperCase();

  const StatusIndicator = ({ status, isActive, isCompleted, showIcon = true }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 0.5,
        px: 1,
      }}
    >
      {showIcon && (
        <Box
          sx={{
            color: isActive ? "#4caf50" : isCompleted ? "#4caf50" : "#9e9e9e",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isActive || isCompleted ? status.icon : <RadioButtonUnchecked fontSize="small" />}
        </Box>
      )}
      <Typography
        variant="body2"
        sx={{
          color: isActive ? "#4caf50" : isCompleted ? "#666" : "#9e9e9e",
          fontWeight: isActive ? 600 : 400,
          fontFamily: "Poppins",
        }}
      >
        {status.label}
      </Typography>
    </Box>
  );

  const JobCard = (
    <Box
      sx={{
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        border: "1px solid #00000040",
        borderRadius: 4,
        p: 0.5,
        backgroundColor: "#fff",
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Job Title */}
        <Typography
          fontWeight={600}
          gutterBottom
          sx={{ color: "#24252C", fontFamily: "Poppins", fontSize: "18px" }}
        >
          {job?.job?.jobTitle || "Position"}
        </Typography>
        
        {/* Company Name */}
        <Typography
          fontWeight={500}
          gutterBottom
          sx={{
            color: "#666",
            mb: 1.5,
            fontFamily: "Poppins",
            fontSize: "14px",
          }}
        >
          {job?.job?.hide ? "Confidential Company" : job?.company?.name} • {job?.job?.jobLocation || "City, state"}
        </Typography>

        {/* Job Details Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
          <Chip
            label={
              job?.job?.salaryConfidential || job?.job?.salaryCategory === "Confidential"
                ? "Confidential"
                : job?.job?.salary
                  ? `${job.job.salary.minSalary} - ${job.job.salary.maxSalary} LPA (${job.job.salaryCategory})`
                  : "Salary not specified"
            }
            variant="outlined"
            size="small"
            sx={{ 
              color: "#666", 
              fontWeight: "400",
              backgroundColor: "#f5f5f5",
              border: "none",
              borderRadius: 2,
            }}
          />
          <Chip
            label={job?.job?.workType || "Full time"}
            variant="outlined"
            size="small"
            sx={{ 
              color: "#666", 
              fontWeight: "400",
              backgroundColor: "#f5f5f5",
              border: "none",
              borderRadius: 2,
            }}
          />
          <Chip
              label={
                job?.job?.experience?.minExperience !== undefined && 
                job?.job?.experience?.maxExperience !== undefined
                  ? `${job.job.experience.minExperience}-${job.job.experience.maxExperience} years experience`
                  : job?.job?.experience?.minExperience !== undefined
                  ? `${job.job.experience.minExperience}+ years experience`
                  : job?.job?.experience?.maxExperience !== undefined
                  ? `Up to ${job.job.experience.maxExperience} years experience`
                  : "Experience not specified"
              }
              variant="outlined"
              size="small"
              sx={{ 
                color: "#666", 
                fontWeight: "400",
                backgroundColor: "#f5f5f5",
                border: "none",
                borderRadius: 2,
              }}
            />
        </Box>

        {/* Status Section */}
        <Box sx={{ mb: 2 }}>
          {/* Current Status - Always Visible */}
          <StatusIndicator
            status={allStatuses[currentStatusIndex] || { label: currentStatus || "Applied", key: currentStatus }}
            isActive={true}
            isCompleted={false}
          />

          {/* Expandable Status List */}
          <Collapse in={showAllStatuses}>
            <Box sx={{ mt: 1, pl: 2 }}>
              {allStatuses.map((status, index) => {
                if (index === currentStatusIndex) return null; // Skip current status as it's shown above
                
                const isCompleted = index < currentStatusIndex;
                const isActive = false;
                
                return (
                  <StatusIndicator
                    key={status.key}
                    status={status}
                    isActive={isActive}
                    isCompleted={isCompleted}
                  />
                );
              })}
            </Box>
          </Collapse>


        </Box>
      </CardContent>

      {/* Fixed Bottom Section */}
      <CardActions
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          pl: 2, 
          pr: 2,
          pt: 0,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {moment(job?.job?.createdAt).fromNow() || "25 minutes ago"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setShowAllStatuses(!showAllStatuses)}
          size="small"
          sx={{
            backgroundColor: "#2196f3",
            color: "white",
            textTransform: "none",
            fontFamily: "Poppins",
            borderRadius: 2,
            px: 2,
            "&:hover": {
              backgroundColor: "#1976d2",
            },
          }}
        >
         {showAllStatuses ? "Hide Details" : "View Details"}
        </Button>
      </CardActions>
    </Box>
  );

  return <Box>{JobCard}</Box>;
};

export default AppliedJobMenuCard;