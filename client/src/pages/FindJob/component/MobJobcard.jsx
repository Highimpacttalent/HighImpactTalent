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
  Divider,
  Chip,
  Box,
  Stack,
  Paper,
  useMediaQuery,
  useTheme,
  CircularProgress,
  LinearProgress,
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
} from "@mui/icons-material";
import { UpdateUser } from "../../../redux/userSlice";
const JobCard = ({ job, flag = false, enable = false }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useSelector((state) => state.user);
  const [like, setLike] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const experience = user?.experience;
  let noteligible = false;

  if (job?.experience && job?.experience > experience) {
    noteligible = true;
  }
  if (job?.experience?.minExperience && job?.experience.minExperience > experience) {
    noteligible = true;
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
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
          <Box sx={{ ml: 2, flexGrow: 1 }}>
            {/* Job Title */}
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{ color: "#404258", mb: 0.5, fontFamily: "Poppins" }}
              color="#404258"
            >
              {job?.jobTitle}
            </Typography>
            {/* Company Name & Like Button */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Business color="#404258" />
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
              label={`${job?.experience?.minExperience || job?.experience }+ years experience`}
              variant="contained"
              sx={{ color: "#474E68", fontWeight: "400" }}
            />
          </Box>
          <Chip
            icon={<CurrencyRupee sx={{ color: "#474E68" }} />}
            label={
              (job.salaryConfidential || job.salaryCategory === "Confidential")
                ? "Confidential"
                : `${Number(job.salary.maxSalary || job.salary).toLocaleString(
                    "en-IN"
                  )} (${job.salaryCategory}) LPA`
            }
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

  return <Box>{mobileView}</Box>;
};

export default JobCard;
