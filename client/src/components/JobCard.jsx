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
} from "@mui/material";
import {
  LocationOnOutlined,
  LocationOn,
  Work,
  WorkOutlineOutlined,
  Business,
  Bookmark,
  BookmarkBorder,
  CurrencyRupee,
  HomeWork,
} from "@mui/icons-material";
import { UpdateUser } from "../redux/userSlice";
import { AttachMoney } from "@mui/icons-material";

const JobCard = ({ job }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useSelector((state) => state.user);
  const [like, setLike] = useState(false);

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

  const mobileView = (
    <Card sx={{ 
      maxWidth: 400, 
      display: "flex", 
      flexDirection: "column", 
      height: "100%", 
      boxShadow: 3, 
      borderRadius: 2, 
      transition: "0.3s", 
      '&:hover': { boxShadow: 6 } 
    }}>
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Company Name & Like Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Business color="primary" />
            <Typography variant="subtitle1" fontWeight={600}>
              {job?.company?.name}
            </Typography>
          </Box>
          <IconButton onClick={(e) => handleLikeClick(e, job._id)}>
            {like ? <Bookmark color="primary" /> : <BookmarkBorder color="action" />}
          </IconButton>
        </Box>

        {/* Job Title */}
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "#404258" }} color="#404258">
          {job?.jobTitle}
        </Typography>

        {/* Job Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", height: 40 }}>
          {job.jobDescription !== "- " ? job?.jobDescription : "No description Provided"}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* Job Details */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
            <LocationOn color="primary" sx={{ mr: 1 }} /> {job?.jobLocation}
          </Typography>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
            <Work color="primary" sx={{ mr: 1 }} /> {job?.experience}+ years experience
          </Typography>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
            <CurrencyRupee color="primary" sx={{ mr: 1 }} /> 
            {job.salaryConfidential ? "Confidential" : `${job.salary.toLocaleString()} (${job.salaryCategory})`}
          </Typography>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
           <HomeWork workType={job?.workType} /> 
          </Typography>
        </Box>
      </CardContent>

      {/* Fixed Bottom Section */}
      <CardActions sx={{ mt: "auto", display: "flex", justifyContent: "space-between", p: 2}}>
        <Typography variant="caption" color="text.secondary">
          Posted {moment(job?.createdAt).fromNow()}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to={`/job-detail/${job?._id}`}
        >
          View
        </Button>
      </CardActions>
    </Card>
  );

  const desktopView = (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderColor:"#75758",
        boxShadow: "0px 0px 4px 0px #00000040",
        borderRadius: 2,
        p:0.5
      }}
    >
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
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "#404258" }}>
            {job?.jobTitle}
          </Typography>

          <Box sx={{display:"flex",alignItems:"center"}}>

          <IconButton
          onClick={(e) => handleLikeClick(e, job._id)}
          sx={{
            display: "flex",
            alignItems: "center",
            color: like ? "primary.main" : "text.secondary", // Changes color dynamically
          }}
        >
          {like ? (
            <Bookmark color="primary" />
          ) : (
            <BookmarkBorder color="action" />
          )}
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
            <Business color="primary" sx={{ color: "#404258" }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#404258" }}>
              {job?.company?.name}
            </Typography>
          </Box>
        </Box>

        {/* Job Details */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
            <Chip
              icon={<LocationOnOutlined sx={{color:"#474E68"}}/>}
              label={job?.jobLocation}
              variant="contained" 
              sx={{color:"#474E68",fontWeight:"400"}}
            />
            <Chip
              icon={<WorkOutlineOutlined sx={{color:"#474E68"}}/>}
              label={`${job?.experience}+ years experience`}
              variant="contained"
              sx={{color:"#474E68",fontWeight:"400"}}
            />
            <Chip
              icon={<CurrencyRupee sx={{color:"#474E68"}}/>}
              label={
                job.salaryConfidential
                  ? "Confidential"
                  : `${job.salary.toLocaleString()} (${job.salaryCategory})`
              }
              variant="contained"
              sx={{color:"#474E68",fontWeight:"400"}}
            />
          </Stack>
        </Box>

        {/* Job Description */}
        <Typography
          variant="body2"
          color="#474E68"
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, // Adjust line limit
            WebkitBoxOrient: "vertical",
          }}
        >
          {job.jobDescription && job.jobDescription !== "- "
            ? job.jobDescription.split(" ").slice(0, 150).join(" ") + "..."
            : "No description provided"}
        </Typography>
      </CardContent>

      {/* Fixed Bottom Section */}
      <CardActions
        sx={{
          mt: "auto",
          display: "flex",
          justifyContent: "flex-start", // Aligns buttons to the right
          gap: 1,
        }}
      >

        {/* View Button */}
        <Button
          variant="contained"
          color="primary"
          component={Link}  
          sx={{borderRadius:40,fontFamily:"Poppins"}}
          to={`/job-detail/${job?._id}`}
        >
          Continue Applying
        </Button>
      </CardActions>
    </Card>
  );

  return <Box>{isMobile ? mobileView : desktopView}</Box>;
};

export default JobCard;