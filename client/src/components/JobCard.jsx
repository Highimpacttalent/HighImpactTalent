import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Divider,
  Chip,
  Box,
  Stack,
  Paper,
  useMediaQuery,
  useTheme,
  CircularProgress,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  LocationOnOutlined,
  LocationOn,
  Work,
  WorkOutlineOutlined,
  Business,
  Bookmark,
  BookmarkBorder,
  ReportProblem,
  CurrencyRupee,
  HomeWork,
  Warning,
} from "@mui/icons-material";
import { UpdateUser } from "../redux/userSlice";
import { AttachMoney } from "@mui/icons-material";

const JobCard = ({ job, flag = false, enable = false, profileComplete = null }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useSelector((state) => state.user);
  const [like, setLike] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const experience = user?.experience;
  const { minExperience, maxExperience } = job.experience || {};
  let noteligible = false;

  const isAlreadyApplied = user?.appliedJobs?.includes(job._id);

  // Profile completion check function
  const checkProfileCompletion = () => {
    if (!user) return { isComplete: false, percentage: 0, missingFields: [] };
    
    const profileFields = [
      "firstName",
      "lastName", 
      "email",
      "currentSalary",
      "currentCompany",
      "currentDesignation",
      "linkedinLink",
      "currentLocation",
      "experienceHistory",
      "cvUrl",
      "contactNumber",
      "skills",
      "educationDetails", 
      "experience",
      "preferredJobTypes", // mapped to preferredWorkTypes
      "preferredJobLocations", // mapped to preferredLocations
      "preferredWorkModes", // mapped to preferredWorkModes
      "expectedSalary", // mapped to expectedMinSalary
    ];

    let filledFieldsCount = 0;
    const missingFields = [];
    
    profileFields.forEach(field => {
      let fieldValue;
      let displayName;
      
      // Handle field mapping and display names
      switch(field) {
        case 'preferredJobTypes':
          fieldValue = user?.preferredWorkTypes;
          displayName = 'Preferred Job Types';
          break;
        case 'preferredJobLocations':
          fieldValue = user?.preferredLocations;
          displayName = 'Preferred Job Locations';
          break;
        case 'preferredWorkModes':
          fieldValue = user?.preferredWorkModes;
          displayName = 'Preferred Work Modes';
          break;
        case 'expectedSalary':
          fieldValue = user?.expectedMinSalary;
          displayName = 'Expected Salary';
          break;
        case 'contactNumber':
          fieldValue = user?.contactNumber;
          displayName = 'Contact Number';
          break;
        case 'educationDetails':
          fieldValue = user?.educationDetails;
          displayName = 'Education Details';
          break;
        case 'experienceHistory':
          fieldValue = user?.experienceHistory;
          displayName = 'Experience History';
          break;
        case 'currentSalary':
          fieldValue = user?.currentSalary;
          displayName = 'Current Salary';
          break;
        case 'currentCompany':
          fieldValue = user?.currentCompany;
          displayName = 'Current Company';
          break;
        case 'currentDesignation':
          fieldValue = user?.currentDesignation;
          displayName = 'Current Designation';
          break;
        case 'linkedinLink':
          fieldValue = user?.linkedinLink;
          displayName = 'LinkedIn Link';
          break;
        case 'currentLocation':
          fieldValue = user?.currentLocation;
          displayName = 'Current Location';
          break;
        default:
          fieldValue = user?.[field];
          displayName = field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
      }
      
      // Check if field is filled based on its type
      let isFilled = false;
      
      if (fieldValue !== null && fieldValue !== undefined) {
        if (Array.isArray(fieldValue)) {
          isFilled = fieldValue.length > 0;
        } else if (typeof fieldValue === 'object') {
          isFilled = Object.keys(fieldValue).length > 0;
        } else if (typeof fieldValue === 'string') {
          isFilled = fieldValue.toString().trim() !== "";
        } else if (typeof fieldValue === 'number') {
          isFilled = !isNaN(fieldValue) && fieldValue >= 0;
        }
      }
      
      if (isFilled) {
        filledFieldsCount += 1;
      } else {
        missingFields.push(displayName);
      }
    });

    const totalFields = profileFields.length;
    const profileCompletion = Math.round((filledFieldsCount / totalFields) * 100);
    
    return {
      isComplete: profileCompletion === 100,
      percentage: profileCompletion,
      missingFields
    };
  };

  // Use passed profileComplete prop or calculate it
  const profileStatus = profileComplete !== null ? 
    { isComplete: profileComplete } : 
    checkProfileCompletion();

  // if the candidate has _too little_ experience…
  if (minExperience != null && experience < minExperience) {
    noteligible = true;
  }

  // // …or the candidate has _too much_ (i.e. you only want juniors)…
  // if (maxExperience != null && experience > maxExperience) {
  //   noteligible = true;
  // }

  const formatExperience = (exp) => {
    if (exp?.minExperience === 0 && exp?.maxExperience) {
      return `0-${exp.maxExperience} years`;
    } else if (exp?.minExperience && exp?.maxExperience) {
      return `${exp.minExperience}-${exp.maxExperience} years`;
    } else if (exp?.minExperience) {
      return `${exp.minExperience}+ years`;
    } else if (exp?.maxExperience) {
      return `Up to ${exp.maxExperience} years`;
    }
    return "Not specified";
  };

  // Helper function to format salary text - ADDED THIS FUNCTION
  const getSalaryText = (salary) => {
    if (job.salaryConfidential) return "Confidential";
    if (!salary) return "Salary not specified";

    if (typeof salary === "object" && salary !== null) {
      const { minSalary, maxSalary } = salary;
      let salaryRange = "";

      if (minSalary !== undefined && maxSalary !== undefined) {
        salaryRange = `${minSalary.toLocaleString("en-IN")} LPA - ${maxSalary.toLocaleString("en-IN")} LPA`;
      } else if (minSalary !== undefined) {
        salaryRange = `${minSalary.toLocaleString("en-IN")} LPA+`;
      } else if (maxSalary !== undefined) {
        salaryRange = `Up to ${maxSalary.toLocaleString("en-IN")} LPA`;
      } else {
        return "Salary not specified";
      }

      return `${salaryRange} (${job.salaryCategory})`;
    }

    // Fallback for old data where salary might be a single number
    if (typeof salary === "number" || typeof salary === "string") {
      return `${Number(salary).toLocaleString("en-IN")} LPA (${job.salaryCategory})`;
    }

    return "Salary not specified";
  };

  useEffect(() => {
    setLike(user?.likedJobs?.includes(job._id));
  }, [user, job._id]);

  const handleLikeClick = async (e, jobId) => {
    e.stopPropagation();
    setSaving(true);
    try {
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/togglelike",
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setLike(!like);
        dispatch(UpdateUser(response.data.user));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setSaving(false); // Reset loading state after API call is complete
    }
  };

  const renderLikeButton = () => {
    if (saving) {
      return <CircularProgress size={24} />; // Show circular progress while loading
    }

    return like ? (
      <Bookmark color="primary" />
    ) : (
      <BookmarkBorder color="action" />
    );
  };

  // Match percentage display for desktop and mobile
  const renderMatchPercentage = () => {
    // Only show if user is logged in and matchPercentage exists
    if (!user?.token || job.matchPercentage === undefined) return null;

    const matchValue = job.matchPercentage || 0;

    return (
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "2px 8px",
          borderRadius: 1,
        }}
      >
        <Typography
          variant="caption"
          fontWeight="bold"
          color={
            matchValue > 75
              ? "success.main"
              : matchValue > 50
              ? "primary.main"
              : matchValue > 25
              ? "warning.main"
              : "text.secondary"
          }
        >
          {matchValue}% Match
        </Typography>
        <LinearProgress
          variant="determinate"
          value={matchValue}
          sx={{
            width: 60,
            height: 6,
            borderRadius: 3,
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              backgroundColor:
                matchValue > 75
                  ? "success.main"
                  : matchValue > 50
                  ? "primary.main"
                  : matchValue > 25
                  ? "warning.main"
                  : "text.secondary",
            },
          }}
        />
      </Box>
    );
  };

  // Function to render the apply button with proper state
  const renderApplyButton = () => {
    if (user?.token == null) {
      return (
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: 40, fontFamily: "Poppins" }}
          onClick={() =>
            navigate("/u-login", {
              state: { refer: `/job-detail/${job._id}` },
            })
          }
        >
          Login/Register To Apply
        </Button>
      );
    }

    if (user?.accountType !== "seeker") {
      return null;
    }

    const isDisabled = noteligible || isAlreadyApplied || !profileStatus.isComplete;

    const getButtonText = () => {
      if (isAlreadyApplied) return "Already Applied";
      if (!profileStatus.isComplete) return "Complete Profile to Apply";
      return "Apply Now";
    };

    const getTooltipText = () => {
      if (!profileStatus.isComplete) {
        return "Please complete your profile to apply for jobs";
      }
      if (noteligible) {
        return `This role requires minimum ${minExperience} years of experience`;
      }
      return "";
    };

    const button = (
      <Button
        variant="contained"
        color="primary"
        disabled={isDisabled}
        sx={{ 
          borderRadius: 40, 
          fontFamily: "Poppins",
          ...(isDisabled && {
            backgroundColor: "#f0f0f0",
            color: "#999"
          })
        }}
        onClick={() => {
          if (!profileStatus.isComplete) {
            navigate("/user-profile");
            return;
          }
          
          if (job?.applicationLink && job?.applicationLink.trim() !== "") {
            window.open(job.applicationLink, "_blank");
          } else {
            navigate("screening-questions", {
              state: {
                questions: job?.screeningQuestions ?? [],
                jobid: job?._id,
                companyid: job?.company?._id,
                userid: user?._id,
              },
            });
          }
        }}
      >
        {getButtonText()}
      </Button>
    );

    if (getTooltipText()) {
      return (
        <Tooltip title={getTooltipText()} arrow>
          {button}
        </Tooltip>
      );
    }

    return button;
  };

  const mobileView = (
    <Card
      sx={{
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "0px 0px 4px 0px #00000040",
        borderRadius: 2,
        position: "relative", // Add this for match percentage positioning
      }}
      onClick={() => navigate(`/job-detail/${job?._id}`)}
    >
      {/* Add match percentage to mobile view */}
      {/* {renderMatchPercentage()} */}

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Job Title */}
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
          sx={{ color: "#404258", mb: 1.5, fontFamily: "Poppins" }}
          color="#404258"
        >
          {job?.jobTitle}
        </Typography>
        {/* Company Name & Like Button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Business sx={{ color: "#404258" }} />
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="#404258"
              fontFamily="Poppins"
            >
              {job?.company?.name}
            </Typography>
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
              label={`${formatExperience(job.experience)}`}
              variant="contained"
              sx={{ color: "#474E68", fontWeight: "400" }}
            />
          </Box>
          <Chip
            icon={<CurrencyRupee sx={{ color: "#474E68" }} />}
            label={getSalaryText(job?.salary)} 
            variant="contained"
            sx={{ color: "#474E68", fontWeight: "400" }}
          />
        </Box>
      </CardContent>

      {/* Fixed Bottom Section */}
      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", pl: 2, pr: 2 }}
      >
        <Typography variant="caption" color="text.secondary">
          Posted {moment(job?.createdAt).fromNow()}
        </Typography>
        <IconButton onClick={(e) => handleLikeClick(e, job._id)}>
          {renderLikeButton()}
          <Typography gap={1}>Save</Typography>
        </IconButton>
      </CardActions>
    </Card>
  );

  const desktopView = (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderColor: "#75758",
        boxShadow: "0px 0px 4px 0px #00000040",
        borderRadius: 2,
        p: 0.5,
        position: "relative", // Needed for absolute positioning of match percentage
      }}
    >
      {/* Match percentage bar (top right) */}
      {/* {renderMatchPercentage()} */}

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Job Title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            gutterBottom
            sx={{ color: "#404258", fontFamily: "Poppins" }}
          >
            {job?.jobTitle}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={(e) => handleLikeClick(e, job._id)}
              sx={{
                display: "flex",
                alignItems: "center",
                color: like ? "primary.main" : "text.secondary",
              }}
            >
              {renderLikeButton()}
            </IconButton>

            <Typography variant="caption" color="#808195" fontSize={14}>
              Posted {moment(job?.createdAt).fromNow()}
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ mb: 1, mt: 0.5 }}
          >
            <Business sx={{ color: "#404258" }} />
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: "#404258", fontFamily: "Poppins" }}
            >
              {job?.company?.name}
            </Typography>
          </Box>
        </Box>

        {/* Job Details */}
        <Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
            <Chip
              icon={<LocationOnOutlined sx={{ color: "#474E68" }} />}
              label={job?.jobLocation}
              variant="contained"
              sx={{ color: "#474E68", fontWeight: "400" }}
            />
            <Chip
              icon={<WorkOutlineOutlined sx={{ color: "#474E68" }} />}
              label={`${formatExperience(job.experience)}`}
              variant="contained"
              sx={{ color: "#474E68", fontWeight: "400" }}
            />
            <Chip
              icon={<CurrencyRupee sx={{ color: "#474E68" }} />}
              label={getSalaryText(job?.salary)} 
              variant="contained"
              sx={{ color: "#474E68", fontWeight: "400" }}
            />
          </Stack>
        </Box>
      </CardContent>

      {/* Fixed Bottom Section */}
      <CardActions
        sx={{
          mt: "auto",
          display: "flex",
          justifyContent: "flex-start",
          gap: 1,
        }}
      >
        {/* View Button or Apply Button based on enable prop */}
        {enable !== true ? (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            sx={{ borderRadius: 40, fontFamily: "Poppins" }}
            to={`/job-detail/${job?._id}`}
          >
            View Details
          </Button>
        ) : (
          renderApplyButton()
        )}
      </CardActions>
      
      {/* Warning Messages */}
      {noteligible && (
        <Box sx={{ display: "flex", justifyContent: "flex-start", ml: 2, mt: 1, mb: 1 }}>
          <ReportProblem color="error" sx={{ mt: 0.5 }} />
          <Typography variant="body2" color="error" sx={{ px: 1, mt: 0.5 }}>
            We appreciate your interest, but this role requires a minimum of{" "}
            {minExperience} years of experience, while your profile currently shows{" "}
            {experience} years.
          </Typography>
        </Box>
      )}
      
      {user?.accountType === "seeker" && !profileStatus.isComplete && enable === true && (
        <Box sx={{ display: "flex", justifyContent: "flex-start", ml: 2, mt: 1, mb: 1 }}>
          <Warning color="warning" sx={{ mt: 0.5 }} />
          <Typography variant="body2" color="warning.main" sx={{ px: 1, mt: 0.5 }}>
            Complete your profile to apply for this job. 
            <Typography 
              component="span" 
              variant="body2" 
              sx={{ 
                color: "primary.main", 
                cursor: "pointer", 
                textDecoration: "underline",
                ml: 0.5
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/user-profile");
              }}
            >
              Complete now
            </Typography>
          </Typography>
        </Box>
      )}
    </Card>
  );

  return <Box>{isMobile || flag ? mobileView : desktopView}</Box>;
};

export default JobCard;