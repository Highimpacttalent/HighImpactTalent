import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Paper ,Grid,IconButton,Divider,InputBase,Button} from "@mui/material";
import { AiOutlineSearch } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../utils";
import TopJobCard from "./TopJobCard/view";
import { JobCard } from "../../../components";
import ProfileNotify from "./ProfileNotify/view.jsx"
import Loader from "../LandingMain/loader.jsx";
const Landing2 = () => {
  const { user } = useSelector((state) => state.user);
  const [searchKeyword, setSearchKeyword] = useState();
  const [searchLocation ,setSearchLocation] = useState();
  const navigate = useNavigate();
  const [topJobs, setTopJobs] = useState([]);
  const [recJobs, setRecJobs] = useState([]);
  const [loader, setLoader] = useState(false);
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
      try {
        const res = await apiRequest({
          url: "/jobs/jobs-by-salary",
          mathod: "GET",
        });
        setTopJobs(res.data);
      } catch (error) {
        console.error("Error fetching top jobs:", error);
      }
    };
  
    const fetchRecJobs = async () => {
      try {
        const res = await apiRequest({
          url: "/jobs/jobs-recommend",
          method: "POST",
          data: { skills: user?.skills || [] },
        });
        setRecJobs(res.data);
      } catch (error) {
        console.error("Error fetching recommended jobs:", error);
      }
    };
  
    const fetchData = async () => {
      setLoader(true);
      await Promise.all([fetchTopJobs(), fetchRecJobs()]);
      setLoader(false);
    };
  
    fetchData();
  }, []);
  
  
  return (
    <Box display="flex" flexDirection="column" bgcolor="white">
      <Loader isLoading={loader} />
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
    mt: 6,
    px: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Paper
    sx={{
      display: "flex",
      alignItems: "center",
      p: 1,
      borderRadius: "50px",
      boxShadow: 3,
      width: "100%",
      maxWidth: 1000,
      flexGrow: 1, // Allows it to take full width
    }}
  >
    <IconButton sx={{ color: "gray" }}>
      <AiOutlineSearch fontSize="24px" />
    </IconButton>
    <InputBase
      sx={{ flex: 1, fontSize: "1.1rem", ml: 1 }}
      placeholder="Search by Job Title"
      value={searchKeyword}
      onChange={(e) => {
        setSearchKeyword(e.target.value);
        setSearchQuery(e.target.value);
      }}
    />
    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
    <IconButton sx={{ color: "gray" }}>
      <MdLocationOn fontSize="24px" />
    </IconButton>
    <InputBase
      sx={{ flex: 1, fontSize: "1.1rem", ml: 1 }}
      placeholder="Enter Location"
      value={searchLocation}
      onChange={(e) => setSearchLocation(e.target.value)}
    />
  </Paper>

  {/* Ensure the button is adjacent to the Paper */}
  <Button
    variant="contained"
    sx={{
      borderRadius: "50px",
      backgroundColor: "#1A73E8",
      color: "white",
      px: 3,
      py:1.7,
      textTransform: "none",
      fontSize: "1rem",
      fontWeight: "bold",
      height: "100%", // Make button same height as Paper
      ml: -12, // Negative margin to bring it closer
      "&:hover": { backgroundColor: "#1669D8" },
    }}
    onClick={handleSearch}
  >
    Search
  </Button>
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
<Box sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
  <Box sx={{width:"80%"}}>
<ProfileNotify />
</Box>
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
  <Grid container spacing={3} sx={{ mt: 2, mb: 10 }}>
    {recJobs.map((job, index) => (
      <Grid item xs={12} key={index}> {/* Ensures one card per line */}
        <Box sx={{width:"80%"}}>
          <JobCard job={job} />
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
