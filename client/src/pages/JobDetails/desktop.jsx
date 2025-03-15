import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiRequest } from "../../utils";
import moment from "moment";
import JobCard from "../../components/JobCard";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  Grid,
  Stack,
  CircularProgress,
} from "@mui/material";
import { AiOutlineSafetyCertificate } from "react-icons/ai";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getJobDetails = async () => {
      setIsFetching(true);
      try {
        const res = await apiRequest({
          url: `/jobs/get-job-detail/${id}`,
          method: "GET",
        });
        if (res?.data) {
          setJob(res.data);
          setSimilarJobs(res.similarJobs);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (id) getJobDetails();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  if (isFetching || !job) {
    return (
      <CircularProgress sx={{ display: "block", mx: "auto", mt: 5, mb: 5 }} />
    );
  }
  

  return (
    <Box sx={{  mx: "auto", p: 3, bgcolor: "#fff" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} >
        <Box sx={{mt:2,mb:2}}>
        <JobCard job={job} enable={true}/>
        </Box>
          <Box sx={{ p: 1.5  }}>

            <Typography variant="h6" sx={{ fontWeight: "bold",fontFamily:"Poppins",color:"#404258",ml:1.5 }}>
             About the Job
            </Typography>
            <Box sx={{borderRadius:2.5,p:2.5,mt:2,boxShadow:"0px 0px 4px 0px #00000040"}}>
            <Typography sx={{fontWeight:"700",color:"#404258",mb:2,fontFamily:"Poppins"}}>Job Description:</Typography>
            <Typography sx={{color:"#474E68",fontFamily:"sans-serif"}}>{job?.jobDescription}</Typography>

            {job?.requirements?.length > 0 && (
              <Box mt={2}>
                <Typography sx={{fontWeight:"700",color:"#404258",mb:2,fontFamily:"Poppins"}}>Requirements:</Typography>
                <ul>
                  {job.requirements.length > 0 &&
                  job.requirements.some((req) => req.trim() !== "") ? (
                    job.requirements
                      .filter((req) => req.trim() !== "")
                      .map((req, index) => <Typography sx={{color:"#474E68",fontFamily:"sans-serif"}}>{index + 1}.{" "}{req}</Typography>)
                  ) : (
                    <Stack>
                    <Typography sx={{color:"#474E68",fontFamily:"sans-serif"}}>No requirement mentioned by the company.</Typography>
                    </Stack>
                  )}
                </ul>
              </Box>
            )}

            {job?.qualifications?.some((qual) => qual.trim() !== "") ? (
              <Box mt={2}>
                <Typography sx={{fontWeight:"700",color:"#404258",mb:2,fontFamily:"Poppins"}}>Qualifications:</Typography>
                <ol>
                  {job.qualifications.map(
                    (qual, index) =>
                      qual.trim() && (
                        <Typography sx={{color:"#474E68",fontFamily:"sans-serif"}}>
                          {index + 1}. {qual}
                        </Typography>
                      )
                  )}
                </ol>
              </Box>
            ) : (
              <>
                <Typography sx={{fontWeight:"700",color:"#404258",mb:2,fontFamily:"Poppins"}}>
                  Qualifications:
                </Typography>
                <Typography sx={{color:"#474E68",fontFamily:"sans-serif"}}>
                  No qualification mentioned by company.
                </Typography>
              </>
            )}
            </Box>

          </Box>
        </Grid>

        <Grid item xs={12} md={4} sx={{mt:2.5}}>
          <Typography
            variant="h6"
            color="textSecondary"
            mb={2}
            sx={{ fontWeight: "bold" }}
          >
            Similar Job Posts
          </Typography>
          <Grid container spacing={2}>
            {similarJobs.slice(0, 6).map((job, index) => (
              <Grid item xs={12} key={index}>
                <JobCard job={job} flag={true} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobDetail;