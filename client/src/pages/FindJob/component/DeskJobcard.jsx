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
  Avatar,
  Chip,
  Box,
  Stack,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  LocationOnOutlined,
  WorkOutlineOutlined,
  Business,
  Done,
  Bookmark,
  BookmarkBorder,
  CurrencyRupee,
} from "@mui/icons-material";
import { UpdateUser } from "../../../redux/userSlice";

const JobCard = ({ job, flag = false }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useSelector((state) => state.user);
  const [like, setLike] = useState(false);
  const [saving, setSaving] = useState(false);
  const userExperience = user?.experience || 0; // Renamed to avoid conflict with job.experience

  const isAlreadyApplied = user?.appliedJobs?.includes(job._id);

  let noteligible = false;

  // Check if job experience requires min or max, and compare with user's experience
  if (job.experience) {
    if (typeof job.experience === 'object' && job.experience !== null) {
      const { minExperience, maxExperience } = job.experience;
      if (minExperience !== undefined && userExperience < minExperience) {
        noteligible = true;
      }
      // If a maxExperience is defined for the job and user's experience exceeds it (e.g., job for juniors)
      // You might want to uncomment this based on your specific eligibility logic
      // if (maxExperience !== undefined && userExperience > maxExperience) {
      //   noteligible = true;
      // }
    } else if (typeof job.experience === 'number' && userExperience < job.experience) {
      // Fallback for old data where job.experience might be just a number (minimum)
      noteligible = true;
    }
  }


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

  // Helper function to format experience text
  const getExperienceText = (exp) => {
    if (!exp) return "Not specified";

    // If experience is an object with min/max
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

    // If experience is a number or string (fallback for old data, assuming it's a minimum)
    if (typeof exp === 'number' || typeof exp === 'string') {
      return `${exp}+ years`;
    }

    return "Not specified";
  };

  // Helper function to format salary text
  const getSalaryText = (salary, salaryCategory, salaryConfidential) => {
    if (salaryConfidential) return "Confidential";
    if (!salary) return "Salary not specified";

    // Check if salary is an object (with minSalary, maxSalary)
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

    // Fallback for old data where salary might be a single number or string
    if (typeof salary === "number" || typeof salary === "string") {
      return `${Number(salary).toLocaleString("en-IN")} (${salaryCategory})`;
    }

    return "Salary not specified";
  };

  const desktopView = (
    <Card
      sx={{
        display: "flex",
        border: "1px solid #00000040",
        borderRadius: "20px",
        p: 1,
        position: "relative", // Needed for absolute positioning of match percentage
      }}
    >
      {/* Match percentage bar (top right) */}
      {/* {renderMatchPercentage()} */}
      <Box sx={{ mr: 1, pt: 3, ml: 0.5 }}>
        <Avatar
          src={job?.company?.profileUrl || undefined}
          sx={{
            width: 50,
            height: 50,
            backgroundColor: job?.company?.profileUrl
              ? "transparent"
              : "#10B981",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            color: "#FFFFFF",
          }}
        >
          {!job?.company?.profileUrl &&
            job?.company?.name?.charAt(0).toUpperCase()}
        </Avatar>
      </Box>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
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
              fontWeight={600}
              sx={{ fontSize: "20px", color: "#24252C", fontFamily: "Poppins" }}
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

              <Typography fontFamily={"Poppins"} color="#808195" fontSize={14}>
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
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
              <Typography
                fontWeight={500}
                sx={{
                  fontSize: "16px",
                  color: "#474E68",
                  fontFamily: "Poppins",
                }}
              >
                {job?.company?.name}
              </Typography>
              {isAlreadyApplied && (
                <Chip
                  label="Applied"
                  icon={<Done sx={{ fontSize: 14 }} />} // Add a checkmark icon
                  size="small"
                  sx={{
                    ml: 1,
                    fontFamily: "Poppins",
                    fontSize: "12px",
                    backgroundColor: "#E8F5E9",
                    color: "#1B5E20",
                    fontWeight: 500,
                    ".MuiChip-icon": {
                      color: "#1B5E20",
                      fontSize: "14px",
                    },
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Job Details */}
          <Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
              <Chip
                icon={<LocationOnOutlined sx={{ color: "#474E68" }} />}
                label={job?.jobLocation}
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
              <Chip
                icon={<WorkOutlineOutlined sx={{ color: "#474E68" }} />}
                label={getExperienceText(job?.experience)}
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
              <Chip
                icon={<CurrencyRupee sx={{ color: "#474E68" }} />}
                label={getSalaryText(job?.salary, job?.salaryCategory, job?.salaryConfidential)} // UPDATED HERE
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
            </Stack>
          </Box>
          <Box>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ mb: 0, mt: 1 }}
            >
              {/* Skill Chips */}
              {job?.skills?.slice(0, 3).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  variant="contained"
                  sx={{
                    p: 0.5,
                    backgroundColor: "#E3EDFF",
                    "& .MuiChip-label": {
                      fontSize: "14px",
                      fontFamily: "Poppins",
                      color: "#474E68",
                      fontWeight: 500,
                    },
                  }}
                />
              ))}

              {job?.skills?.length > 3 && (
                <Chip
                  label={`+${job.skills.length - 3} more`}
                  variant="contained"
                  sx={{
                    color: "#E3EDFF",
                    fontWeight: "400",
                    p: 1,
                    backgroundColor: "#F0F4FA",
                    "& .MuiChip-label": {
                      fontSize: "14px",
                      color: "#474E68",
                      fontStyle: "italic",
                    },
                  }}
                />
              )}
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
          <Button
            variant="contained"
            color="primary"
            component={Link}
            sx={{
              borderRadius: 20,
              fontFamily: "Poppins",
              px: 2.5,
              py: 1.5,
              textTransform: "none",
            }}
            to={`/job-detail/${job?._id}`}
          >
            View Details
          </Button>
        </CardActions>
      </Box>
    </Card>
  );

  return <Box>{desktopView}</Box>;
};

export default JobCard;