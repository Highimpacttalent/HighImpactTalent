import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Paper ,Grid} from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../utils";
import TopJobCard from "./TopJobCard/view";
import { JobCard } from "../../../components";

const Landing2 = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [topJobs, setTopJobs] = useState([]);
  const [recJobs, setRecJobs] = useState([]);

  useEffect(() => {
    const fetchTopJobs = async () => {
      const res = await apiRequest({url:"/jobs/jobs-by-salary", mathod: "GET"});
      setTopJobs(res.data);
      console.log(topJobs);
    };
    fetchTopJobs();

    const fetchRecJobs = async () => {
      const res = await apiRequest({url:"/jobs/jobs-recommend", method: "POST", data: {skills: user?.skills || []}});
      setRecJobs(res.data);
      console.log(topJobs);
    };
    fetchRecJobs();
  }
  , []);
  
  return (
    <Box display="flex" flexDirection="column" bgcolor="white">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Satoshi",
            fontWeight: "700",
            fontSize: "32px",
            color: "#474E68",
          }}
        >
          Act Fast, Stay Ahead. Land Your Next{" "}
          <span
            style={{
              color: "#3C7EFC",
              fontSize: "32px",
              fontWeight: "700",
              fontFamily: "Satoshi",
            }}
          >
            Big Role
          </span>{" "}
          Now!
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          ml:4
        }}
      >
        <Box>
          <Tabs
            value={0}
            indicatorColor="primary" // Keeps text as it is (no uppercase transformation)
            textColor= "#474E68"
          >
            <Tab label="Top Jobs for You" sx={{
              fontFamily: "Satoshi",
              fontSize: "18px",
              fontWeight: "700",
              textTransform: "none",
              textColor:"#474E68"
            }}/>
          </Tabs>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" mt={2} gap={2}>
  {topJobs && topJobs.length > 0 ? (
    <Grid container spacing={3} sx={{mt:2,mb:10}}>
      {topJobs.map((job, index) => (
        <Grid item key={index}>
          <Box>
          <TopJobCard job={job}/>
          </Box>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Typography variant="h6" color="textSecondary" align="center">
      No jobs found. Try a different search.
    </Typography>
  )}
</Box>
        <Box>
          <Tabs
            value={0}
            indicatorColor="primary" // Keeps text as it is (no uppercase transformation)
            textColor= "#474E68"
          >
            <Tab label="Recommended Jobs for You" sx={{
              fontFamily: "Satoshi",
              fontSize: "18px",
              fontWeight: "700",
              textTransform: "none",
              textColor:"#474E68"
            }}/>
          </Tabs>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" mt={2} gap={2}>
  {recJobs && recJobs.length > 0 ? (
    <Grid container spacing={3} sx={{mt:2,mb:10}}>
      {recJobs.map((job, index) => (
        <Grid item key={index}>
          <Box sx={{width:"60%"}}>
          <JobCard job={job}/>
          </Box>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Typography variant="h6" color="textSecondary" align="center">
      No jobs found. Try a different search.
    </Typography>
  )}
</Box>
      </Box>
    </Box>
  );
};

export default Landing2;
