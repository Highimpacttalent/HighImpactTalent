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
  Alert,
  AlertTitle,
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
import { UpdateUser } from "../../../redux/userSlice";
import { AttachMoney } from "@mui/icons-material";

const JobCard = ({ job, flag = false, enable = false, profileComplete = false }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useSelector((state) => state.user);
  const [like, setLike] = useState(false);
  const navigate = useNavigate();
  const experience = user.experience;

  let noteligible = false;

  const isAlreadyApplied = user?.appliedJobs?.includes(job._id);

  const checkProfileCompletion = () => {
    const profileFields = [
      "firstName",
      //"lastName", 
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
      "preferredJobTypes",
      "preferredJobLocations",
      "preferredWorkModes",
      "expectedSalary",
    ];

    let filledFieldsCount = 0;
    const missingFields = [];
    
    profileFields.forEach(field => {
      let fieldValue;
      let displayName;
      
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

  const profileStatus = user?.token && user?.accountType === "seeker" ? checkProfileCompletion() : { isComplete: true, percentage: 100, missingFields: [] };

  if (job?.experience?.minExperience && experience < job.experience.minExperience) {
    noteligible = true;
  } else if (job?.experience && typeof job.experience === 'number' && experience < job.experience) {
    noteligible = true;
  }

  useEffect(() => {
    setLike(user?.likedJobs?.includes(job._id));
  }, [user, job._id]);

  const handleLikeClick = async (e, jobId) => {
    e.stopPropagation();
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
    }
  };

  const getSalaryText = (salary, salaryCategory, salaryConfidential) => {
    if (salaryConfidential) return "Confidential";
    if (!salary) return "Salary not specified";

    if (typeof salary === "object" && salary !== null) {
      const { minSalary, maxSalary } = salary;
      let salaryRange = "";

      if (minSalary !== undefined && maxSalary !== undefined) {
        salaryRange = `${Number(minSalary).toLocaleString("en-IN")}LPA - ${Number(maxSalary).toLocaleString("en-IN")}LPA`;
      } else if (minSalary !== undefined) {
        salaryRange = `${Number(minSalary).toLocaleString("en-IN")}+`;
      } else if (maxSalary !== undefined) {
        salaryRange = `Up to ${Number(maxSalary).toLocaleString("en-IN")}`;
      } else {
        return "Salary not specified";
      }
      return `${salaryRange} (${salaryCategory})`;
    }

    if (typeof salary === "number" || typeof salary === "string") {
      return `${Number(salary).toLocaleString("en-IN")} (${salaryCategory})`;
    }

    return "Salary not specified";
  };

  const getExperienceText = (exp) => {
    if (!exp) return "Not specified";

    if (typeof exp === 'object' && exp !== null) {
      const { minExperience, maxExperience } = exp;

      if (minExperience !== undefined && maxExperience !== undefined) {
        return `${minExperience}-${maxExperience} years`;
      } else if (minExperience !== undefined) {
        return `${minExperience}+ years`;
      } else if (maxExperience !== undefined) {
        return `Up to ${maxExperience} years`;
      }
    }

    if (typeof exp === 'number' || typeof exp === 'string') {
      return `${exp}+ years`;
    }

    return "Not specified";
  };

  const mobileView = (
    <Box>
      {enable && user?.token && user?.accountType === "seeker" && !profileStatus.isComplete && (
        <Alert 
          severity="warning" 
          icon={<Warning />}
          sx={{ 
            mb: 2, 
            borderRadius: 2,
            border: "1px solid #ed6c02",
            bgcolor: "#fff3e0",
            "& .MuiAlert-message": {
              width: "100%"
            }
          }}
        >
          <AlertTitle sx={{ fontWeight: "bold", color: "#e65100", fontSize: "0.9rem" }}>
            Complete Your Profile to Apply
          </AlertTitle>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ mb: 1.5, color: "#e65100", fontSize: "0.8rem" }}>
              Your profile is {profileStatus.percentage}% complete.
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/user-profile")}
              sx={{
                bgcolor: "#ed6c02",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.75rem",
                "&:hover": {
                  bgcolor: "#e65100"
                }
              }}
            >
              Complete Profile
            </Button>
          </Box>
        </Alert>
      )}

      <Card sx={{
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "0px 0px 4px 0px #00000040",
        borderRadius: 2,
      }}
      >
        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Typography fontWeight={600} gutterBottom sx={{ color: "#24252C", mb: 1.5, fontFamily: "Poppins" }} >
            {job?.jobTitle}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Business color="#404258" />
              <Typography fontWeight={500} sx={{ color: "#24252C", fontFamily: "Poppins" }}>
                {job?.company?.name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap" }} gap={1}>
            <Box sx={{ display: "flex" }} gap={0.5}>
              <Chip
                icon={<LocationOnOutlined sx={{ color: "#474E68" }} />}
                label={job?.jobLocation}
                variant="contained"
                sx={{ color: "#474E68", fontWeight: "400", bgcolor: "EAEAEA", fontFamily: "Poppins" }}
              />
              <Chip
                icon={<WorkOutlineOutlined sx={{ color: "#474E68" }} />}
                label={getExperienceText(job?.experience)}
                variant="contained"
                sx={{ color: "#474E68", fontWeight: "400", bgcolor: "EAEAEA", fontFamily: "Poppins" }}
              />
            </Box>
            <Chip
              icon={<CurrencyRupee sx={{ color: "#474E68" }} />}
              label={getSalaryText(job?.salary, job?.salaryCategory, job?.salaryConfidential)}
              variant="contained"
              sx={{
                color: "#EAEAEA",
                fontWeight: "400",
                p: 1,
                "& .MuiChip-label": {
                  fontSize: "14px",
                  color: "#474E68",
                },
              }}
            />
          </Box>
        </CardContent>

        <CardActions
          sx={{
            mt: "auto",
            display: "flex",
            justifyContent: "flex-start",
            gap: 1,
          }}
        >
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
          ) : user?.token == null ? (
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 40, fontFamily: "Poppins" }}
              onClick={() => navigate("/u-login", { state: { refer: `/job-detail/${job._id}` } })}
            >
              Login/Register To Apply
            </Button>
          ) : user?.accountType === "seeker" ? (
            <Button
              variant="contained"
              color="primary"
              disabled={noteligible || isAlreadyApplied || !profileStatus.isComplete}
              sx={{ 
                borderRadius: 40, 
                fontFamily: "Poppins",
                ...((!profileStatus.isComplete && !noteligible && !isAlreadyApplied) && {
                  bgcolor: "#EAEAEA",
                  color: "#474E68",
                  "&:hover": {
                    bgcolor: "#DADADA"
                  },
                  "&:disabled": {
                    bgcolor: "#EAEAEA",
                    color: "#474E68",
                    opacity: 1
                  }
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
              {isAlreadyApplied 
                ? "Already Applied" 
                : !profileStatus.isComplete 
                  ? "Complete Profile to Apply"
                  : "Apply Now"}
            </Button>
          ) : null}
        </CardActions>



        {noteligible && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", ml: 2, mt: 1 }}>
            <ReportProblem color="error" sx={{ mb: 1 }} />
            <Typography color="error" sx={{ px: 1, mt: 0.5, fontSize: "12px" }}>
              We appreciate your interest, but this role requires a minimum of {job?.experience?.minExperience || job?.experience} years of experience, and your profile currently shows {experience} years.
            </Typography>
          </Box>
        )}

        <CardActions sx={{ display: "flex", justifyContent: "space-between", pl: 2, pr: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Posted {moment(job?.createdAt).fromNow()}
          </Typography>
          <IconButton onClick={(e) => handleLikeClick(e, job._id)}>
            {like ? <Bookmark color="primary" /> : <BookmarkBorder color="action" />}
            <Typography gap={1}>Save</Typography>
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  );

  return <Box> {mobileView} </Box>;
};

export default JobCard;