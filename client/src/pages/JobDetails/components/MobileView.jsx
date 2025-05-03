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
import { AttachMoney } from "@mui/icons-material";

const JobCard = ({ job,flag = false,enable = false }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useSelector((state) => state.user);
  const [like, setLike] = useState(false);
  const navigate = useNavigate();
  const experience = user.experience;
  let noteligible = false;
  console.log(job?.experience, typeof(job?.experience), typeof(user.experience))
    if(job?.experience && job?.experience > experience){
      console.log("Ho")
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

  const mobileView = (
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
        {/* Job Title */}
        <Typography fontWeight={600} gutterBottom sx={{ color: "#24252C" ,mb:1.5,fontFamily:"Poppins"}} >
          {job?.jobTitle}
        </Typography>
        {/* Company Name & Like Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <Business color= "#404258" />
            <Typography fontWeight={500} sx={{ color: "#24252C" ,fontFamily:"Poppins"}}>
              {job?.company?.name}
            </Typography>
          </Box>
          
        </Box>

        {/* Job Details */}
        <Box sx={{ display:"flex",flexWrap:"wrap"}} gap={1}>
          <Box sx={{display:"flex"}} gap={0.5}>
            <Chip
              icon={<LocationOnOutlined sx={{color:"#474E68"}}/>}
              label={job?.jobLocation}
              variant="contained" 
              sx={{color:"#474E68",fontWeight:"400",bgcolor:"EAEAEA",fontFamily:"Poppins"}}
            />
            <Chip
              icon={<WorkOutlineOutlined sx={{color:"#474E68"}}/>}
              label={`${job?.experience}+ years experience`}
              variant="contained"
              sx={{color:"#474E68",fontWeight:"400",bgcolor:"EAEAEA",fontFamily:"Poppins"}}
            />
            </Box>
            <Chip
              icon={<CurrencyRupee sx={{color:"#474E68"}}/>}
              label={
                job.salaryConfidential
                  ? "Confidential"
                  : `${job.salary.toLocaleString()} (${job.salaryCategory})`
              }
              variant="contained"
              sx={{color:"#474E68",fontWeight:"400",bgcolor:"EAEAEA",fontFamily:"Poppins"}}
            />
           </Box>

        {/* Job Description */}
        {/* <Typography 
          variant="body2" 
          color="#474E68" 
          sx={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", height: 40 }}>
          {job.jobDescription !== "- " ? job?.jobDescription : "No description Provided"}
        </Typography> */}
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
        {/* View Button */}
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
            onClick={() => navigate("/u-login")}
          >
            Login/Register To Apply
          </Button>
        ) : user?.accountType === "seeker" ? (
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 40, fontFamily: "Poppins" }}
            onClick={() => {
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
            Apply Now
          </Button>
        ) : null}
      </CardActions>

            {noteligible && (
                    <Box sx={{display:"flex",justifyContent:"flex-start",ml:2,mt:1}}>
                    <ReportProblem color="error" sx={{mb:1}}/>
                    <Typography variant="body2" color="error" sx={{ px:1,mt:0.5 }}>
                      You are not eligible for this job
                    </Typography>
                    </Box>
                  )}

      {/* Fixed Bottom Section */}
      <CardActions sx={{ display: "flex", justifyContent: "space-between", pl: 2,pr:2}}>
        <Typography variant="caption" color="text.secondary">
          Posted {moment(job?.createdAt).fromNow()}
        </Typography>
        <IconButton onClick={(e) => handleLikeClick(e, job._id)}>
            {like ? <Bookmark color="primary" /> : <BookmarkBorder color="action" />}
          <Typography gap={1}>Save</Typography>
          </IconButton>
      </CardActions>

    </Card>
  );


  return <Box> {mobileView} </Box>;
};

export default JobCard;