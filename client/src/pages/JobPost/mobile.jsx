import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import JobCardRecriter from "./components/JobCardR";
import SearchIcon from "@mui/icons-material/Search";

const JobPosted = () => {
  const [searchTerm, setSearchTerm] = useState();
  const [sortOrder, setSortOrder] = useState("Sort by");
  const { user } = useSelector((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchJobs = async () => {
    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/companies/get-company-joblisting",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ id: user?._id }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setJobs(data.companies.jobPosts);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs
  .filter((job) =>
    searchTerm
      ? job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  )
  .sort((a, b) => {
    if (sortOrder === "oldest") return 1;
    if (sortOrder === "newest") return -1;
    return 0; // No sorting if "Sort by"
  });


  return (
    <Box sx={{ bgcolor: "white", p: 2 }}>
      {/* Search and Sort Controls */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "space-between",
          alignItems: "center",
          py:4
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: "100%", sm: "48%" },
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              height: 40, // sets fixed height
              padding: 0, // optional: remove internal spacing
            },
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "#888", mr: 1, ml: 1 }} />,
            sx: { borderRadius: 2 },
          }}
        />
        <TextField
          select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          sx={{
            width: { xs: "100%", sm: "48%" },
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              height: 40, // match TextField height
              padding: 0,
              color: "#00000099",
            },
          }}
          InputProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <MenuItem value="Sort by">Sort by</MenuItem>
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="oldest">Oldest First</MenuItem>
        </TextField>
      </Box>
      <Box sx={{mt:2,mb:4,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      <Typography
        sx={{
          color: "#000000CC",
          fontFamily: "Poppins",
          fontWeight: 500,
          px:0.5,
          fontSize: "18px",
        }}
      >
        Jobs by Recruiter
      </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      <Button
          variant="contained"
          sx={{
            bgcolor: "#3C7EFC",
            fontFamily: "Satoshi",
            fontWeight: 700,
            fontSize: "16px",
            textTransform: "none",
            borderRadius:12
          }}
          onClick={() => {
            navigate("/upload-a-job");
          }}
        >
          + Post Job
        </Button>
        </Box>
      </Box>
      
        
      
      <div className="flex flex-col md:flex-row h-screen text-gray-900">
        {/* Job List */}
        <div
          className={`md:w-1/2 transition-all ${
            selectedJob ? "md:w-1/2" : "md:w-full"
          } overflow-y-auto`}
        >
          {loading ? (
            <p className="text-center text-blue-600">Loading jobs...</p>
          ) : (
            filteredJobs.map((job) => (
              <Box sx={{ mb: 2 }}>
                <JobCardRecriter
                  job={job}
                  setSelectedJob={setSelectedJob}
                  selectedJob={selectedJob}
                  fetchJobs={fetchJobs}
                ></JobCardRecriter>
              </Box>
            ))
          )}
        </div>
      </div>
    </Box>
  );
};

export default JobPosted;
