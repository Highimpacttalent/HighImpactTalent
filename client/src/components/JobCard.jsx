import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { Card, CardContent, CardActions, Typography, Button, IconButton, Divider, Chip, Box } from "@mui/material";
import { LocationOn, Work, FavoriteBorder, Favorite, Business } from "@mui/icons-material";
import { UpdateUser } from "../redux/userSlice";

const JobCard = ({ job }) => {
  const dispatch = useDispatch();
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

  return (
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
            {like ? <Favorite color="error" /> : <FavoriteBorder color="action" />}
          </IconButton>
        </Box>

        {/* Job Title */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
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
          <Typography variant="body2" color="text.secondary">
            Salary: {job.salaryConfidential ? "Confidential" : `₹${job.salary.toLocaleString()} (${job.salaryCategory})`}
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
};

export default JobCard;
