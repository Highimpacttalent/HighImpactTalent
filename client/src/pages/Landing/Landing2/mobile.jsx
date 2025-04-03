import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Paper ,Grid,IconButton,InputBase, Divider, Button} from "@mui/material";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../utils";
import TopJobCard from "./TopJobCard/view";
import { JobCard } from "../../../components";
import ProfileNotify from "./ProfileNotify/mobile.jsx"

const Landing2 = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [topJobs, setTopJobs] = useState([]);
  const [recJobs, setRecJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState();
  const [searchLocation ,setSearchLocation] = useState();

  
  const handleSearch = () => {
    navigate("/find-jobs", {
      state: {
        searchKeywordProp: searchKeyword,
        searchLocationProp: searchLocation
      },
    });
  };


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
            fontSize: "24px",
            color: "#474E68",
            textAlign:"center",
            px:1
          }}
        >
          Act Fast, Stay Ahead. Land Your Next{" "}
          <span
            style={{
              color: "#3C7EFC",
              fontSize: "24px",
              fontWeight: "700",
              fontFamily: "Satoshi",
              textAlign:"center"
            }}
          >
            Big Role
          </span>{" "}
          Now!
        </Typography>
      </Box>
      {/* Search Bar */}
  <Box sx={{  mt: 1, display: "flex", justifyContent: "center" }}>
  <Box
    sx={{
      display: "flex",
      flexDirection: "column", // Stack inputs vertically
      alignItems: "center",
      p: 4,
      width: "100%",
      mx: "auto",
      gap: 2, 
    }}
  >
    {/* Job Title Input */}
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", p: 1,borderBottom:"1px solid #A3A3A3"}}>
      <IconButton sx={{ color: "gray" }}>
        <AiOutlineSearch fontSize="24px" />
      </IconButton>
      <InputBase
        sx={{ flex: 1, fontSize: "1rem", ml: 1 }}
        placeholder="Search job title/keyword"
        value={searchKeyword}
        onChange={(e) => {
          setSearchKeyword(e.target.value);
          setSearchQuery(e.target.value);
        }}
      />
    </Box>

    {/* Location Input */}
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", p: 1,borderBottom:"1px solid #A3A3A3"}}>
      <IconButton sx={{ color: "gray" }}>
        <MdLocationOn fontSize="24px" />
      </IconButton>
      <InputBase
        sx={{ flex: 1, fontSize: "1rem", ml: 1 }}
        placeholder="Enter Location"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
      />
    </Box>

    {/* Search Button */}
    <Button
      variant="contained"
      sx={{
        borderRadius: 16,
        backgroundColor: "#1A73E8",
        color: "white",
        px: 4,
        py: 1.5,
        textTransform: "none",
        fontSize: "18px",
        fontWeight: "700",
        fontFamily:"Satoshi",
        width: "100%",
        "&:hover": { backgroundColor: "#1669D8" },
      }}
      onClick={handleSearch}
    >
      Search
    </Button>
  </Box>
</Box>
       <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          p:1
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
<ProfileNotify />
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
          <Box >
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
