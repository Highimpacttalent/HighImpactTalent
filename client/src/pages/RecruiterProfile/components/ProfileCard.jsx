import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  CircularProgress,
  Chip,
  MenuItem,
  Divider,
} from "@mui/material";
import { AiOutlineMail, AiOutlinePlus, AiOutlineDown } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import JobCardRecriter from "./JobCardR";
import { useMediaQuery, useTheme } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

const UserInfoCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Jobs");

  // Fetch Jobs from API
  const fetchJobs = async () => {
    setLoading(true);
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
        const jobPosts = data.companies.jobPosts || [];
        setJobs(jobPosts);
        setFilteredJobs(jobPosts); // default: all
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

  // Handle Filter Selection
  const handleSortOptionClick = (status) => {
    setSelectedFilter(status);
    setSortMenuOpen(false);

    if (status === "All Jobs") {
      setFilteredJobs(jobs);
    } else {
      const statusKey = status.toLowerCase().split(" ")[0]; // live, paused, deleted
      const sorted = jobs.filter(
        (job) => job.status?.toLowerCase() === statusKey
      );
      setFilteredJobs(sorted);
    }
  };
  const desktopView = (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      {/* Left Section */}
      <Box sx={{ width: "20%" }}>
        {/* Recruiter Info */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            display="flex"
            alignItems="center"
            gap={1}
            color="#404258"
            fontWeight="700"
            mb={0.25}
          >
            Recruiter Name
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              fontFamily: "Satoshi",
              fontSize: { xs: 20, md: 25, lg: 30 },
              color: "#24252C",
              mb: 1,
            }}
          >
            {user?.recruiterName?.toUpperCase() || "Not Available"}
          </Typography>
        </Box>

        {/* Contact Details */}
        <Box sx={{ mt: 2 }}>
          <Typography
            display="flex"
            alignItems="center"
            gap={1}
            color="#404258"
            fontWeight="700"
            mb={0.5}
          >
            Contact Details
          </Typography>
          <Typography
            display="flex"
            alignItems="center"
            gap={1}
            color="#24252C"
            fontWeight="700"
          >
            <AiOutlineMail /> {user.email}
          </Typography>
          <Typography
            display="flex"
            alignItems="center"
            gap={1}
            color="#24252C"
            fontWeight="700"
          >
            <FiPhoneCall /> +91 {user.mobileNumber}
          </Typography>
        </Box>

        {/* Company Details */}
        <Box sx={{ mt: 2 }}>
          <Typography
            display="flex"
            alignItems="center"
            gap={1}
            color="#404258"
            fontWeight="700"
            mb={0.5}
          >
            Company Details
          </Typography>
          <Typography
            display="flex"
            alignItems="center"
            gap={1}
            color="#24252C"
            fontWeight="700"
          >
            Name: {user.name}
          </Typography>
          <Typography
            display="flex"
            alignItems="center"
            gap={1}
            color="#24252C"
            fontWeight="700"
          >
            Type: {user.copmanyType}
          </Typography>
        </Box>
      </Box>

      {/* Vertical Divider */}
      <Divider
        orientation="vertical"
        flexItem
        sx={{ mx: 2, borderWidth: 1, borderColor: "#24252C" }}
      />

      {/* Right Section */}
      <Box sx={{ width: "70%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#404258", fontWeight: "700" }}>
            Jobs Posted
          </Typography>

          <Box sx={{ position: "relative" }}>
            <Button
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#404258",
                fontWeight: "700",
                borderColor: "#404258",
                borderRadius: 16,
              }}
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
            >
              {selectedFilter} <AiOutlineDown />
            </Button>

            {sortMenuOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  boxShadow: 2,
                  mt: 1,
                  width: "150px",
                  zIndex: 10,
                }}
              >
                <MenuItem onClick={() => handleSortOptionClick("All Jobs")}>
                  All Jobs
                </MenuItem>
                <MenuItem onClick={() => handleSortOptionClick("Live Jobs")}>
                  Live Jobs
                </MenuItem>
                <MenuItem onClick={() => handleSortOptionClick("Paused Jobs")}>
                  Paused Jobs
                </MenuItem>
                <MenuItem onClick={() => handleSortOptionClick("Deleted Jobs")}>
                  Deleted Jobs
                </MenuItem>
              </Box>
            )}
          </Box>
        </Box>

        {/* Jobs Listing */}
        {loading ? (
          <Typography>Loading jobs...</Typography>
        ) : filteredJobs.length === 0 ? (
          <Typography>No jobs found for selected filter.</Typography>
        ) : (
          filteredJobs.map((job) => (
            <Box key={job._id} sx={{ mb: 2 }}>
              <JobCardRecriter job={job} fetchJobs={fetchJobs} />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
  const mobileView = (
    <Box
      sx={{
        border: "1px solid #D9D9D9",
        mt: 2,
        py: 2,
        px: 1.5,
        borderRadius: 4,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box>
          <Typography
            sx={{
              color: "black",
              fontFamily: "Poppins",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            {user.recruiterName}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              color: "#000000AD",
              fontFamily: "Poppins",
              fontWeight: 500,
              fontSize: "15px",
              mt: 1,
            }}
          >
            {user.name}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{ color: "#00000080", fontFamily: "Poppins", fontSize: "15px" }}
          >
            {user.copmanyType}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2,mb:2,gap:2 }}>
          <Chip variant="outlined" label={
            <Typography sx={{color:"#00000080",fontFamily:"Poppins",fontSize:"14px"}}>
              {user.email}
            </Typography>
          } />
          <Chip variant="outlined" label={
            <Typography sx={{color:"#00000080",fontFamily:"Poppins",fontSize:"14px"}}>
              {user.mobileNumber}
            </Typography>
          }/>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100%" }}>{isMobile ? mobileView : desktopView}</Box>
  );
};

export default UserInfoCard;
