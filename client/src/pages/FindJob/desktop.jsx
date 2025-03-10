import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { CustomButton, JobCard, ListBox } from "../../components";
import { Grid, } from "@mui/material";
import { MdLocationOn } from "react-icons/md";
import {
  Box,
  Typography,
} from "@mui/material";
import {
  Accordion,
  Paper,
  IconButton,
  Tab, 
  Tabs,
  Divider,
  InputBase,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Button,
  Modal
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import { apiRequest } from "../../utils";
import { useSelector } from "react-redux";

const desktopView = () => {
  const { user } = useSelector((state) => state.user);

  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [tab,setTab] = useState (0);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [filterJobTypes, setFilterJobTypes] = useState([]);
  const [filterExp, setFilterExp] = useState("");
  const [expVal, setExpVal] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState(0);
  const explist = ["0-100", "1-2", "2-6", "6-100"];
  const location = useLocation();
  const navigate = useNavigate();
  const [showLikedJobs, setShowLikedJobs] = useState(false);
  const [likedJobs, setLikedJobs] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
const [openFilterModal, setOpenFilterModal] = useState(false);


  const updateURL = ({ query, cmpLoc, exp, sort, pageNum, location }) => {
    const params = new URLSearchParams();

    if (query) params.append("query", query);
    if (cmpLoc) params.append("location", cmpLoc);
    if (exp) params.append("exp", exp);
    if (sort) params.append("sort", sort);
    if (pageNum) params.append("page", pageNum);

    return `${location.pathname}?${params.toString()}`;
  };
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredJobs, setFilteredJobs] = useState();

  // Handle change in search input
  const handleInputChange = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    if (keyword === "") {
      setFilteredJobs(data);
    } else {
      const lowerCaseKeyword = keyword.toLowerCase();
      const filtered = data.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(lowerCaseKeyword) ||
          job.jobDescription.toLowerCase().includes(lowerCaseKeyword)
      );
      setFilteredJobs(filtered);
    }
  };
  const fetchJobs = async () => {
    setIsFetching(true);
    const newURL = updateURL({
      query: searchQuery,
      cmpLoc: jobLocation,
      exp: explist[selectedCheckbox],
      sort: sort,
      pageNum: page,
      location: location,
    });
    try {
      const res = await apiRequest({
        url: "/jobs" + newURL,
        method: "GET",
      });
      setData(res?.data);
      console.log(res?.data);
      setFilteredJobs(res?.data);
      setNumPage(res?.numOfPage);
      setRecordCount(res?.total);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsFetching(false);
    }
  };
  const [showFilters, setShowFilters] = useState(false);
  
  const handleCheckboxChange = (index) => {
    setSelectedCheckbox(index === selectedCheckbox ? 0 : index);
    setShowFilters(false);
  };
  const filterLikedJobs = () => {
    if (showLikedJobs) {
      setFilteredJobs(data);
    } else {
      // Show all jobs
      const likedJobIds = new Set(user.likedJobs);
      console.log(likedJobIds);
      // Filter jobs to include only those that are in the liked jobs
      const likedJobsData = data.filter((job) => likedJobIds.has(job._id));
      setFilteredJobs(likedJobsData);
      console.log(likedJobsData);
    }
  };


  const handleChange = (category, option) => {
    setSelectedFilters((prev) => {
      const updatedCategory = prev[category] ? [...prev[category]] : [];
      if (updatedCategory.includes(option)) {
        return {
          ...prev,
          [category]: updatedCategory.filter((item) => item !== option),
        };
      } else {
        return {
          ...prev,
          [category]: [...updatedCategory, option],
        };
      }
    });
  };
  

  useEffect(() => {
    fetchJobs();
  }, [sort, filterJobTypes, selectedCheckbox, filterExp, page]);

  const handleLocationChange = (e) => {
    const keyword = e.target.value;
    setJobLocation(keyword);
    if (keyword === "") {
      setFilteredJobs(data);
    } else {
      const lowerCaseKeyword = keyword.toLowerCase();
      const filtered = data.filter(
        (job) =>
          job.jobLocation.toLowerCase().includes(lowerCaseKeyword) ||
          job.jobLocation.toLowerCase().includes(lowerCaseKeyword)
      );
      setFilteredJobs(filtered);
    }
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh",  p: isMobile ? 1 : 5 }}>
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

    <Box>
      {/* Search Bar */}
      <Box sx={{  mx: "auto", mt: 3, px: 2 }}>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            borderRadius: "50px",
            boxShadow: 3,
            width: "100%",
            maxWidth: 1000,
            mx: "auto",
          }}
        >
          {/* Job Title Search */}
          <IconButton sx={{ color: "gray" }}>
            <AiOutlineSearch fontSize="24px" />
          </IconButton>
          <InputBase
            sx={{ flex: 1, fontSize: "1.1rem", ml: 1 }}
            placeholder="Job title"
            value={searchKeyword}
            onChange={handleInputChange}
          />

          {/* Divider */}
          <Divider orientation="vertical" flexItem sx={{  mx: 1 }} />

          {/* Location Search */}
          <IconButton sx={{ color: "gray" }}>
            <MdLocationOn fontSize="24px" />
          </IconButton>
          <InputBase
            sx={{ flex: 1, fontSize: "1.1rem", ml: 1 }}
            placeholder="Location"
            value={jobLocation}  // Corrected value
            onChange={handleLocationChange}  // Corrected function
          />

          {/* Search Button */}
          <Button
            variant="contained"
            sx={{
              borderRadius: "50px",
              backgroundColor: "#1A73E8",
              color: "white",
              px: 3,
              ml: 1,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#1669D8" },
            }}
          >
            Search
          </Button>
        </Paper>
      </Box>

      <Box sx={{width:"25%",mt:4}}>
     <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered sx={{ "& .MuiTab-root": { fontFamily: "Poppins, sans-serif",fontWeight:"600" } }} >
        <Tab label="Jobs for You" value={0}/>
        <Tab label="My Jobs" value={1}/>
      </Tabs>
      </Box>


      {/* Main Content */}
      {tab === 0 && (<Box sx={{
         maxWidth: "xl", mx: "auto", mt: 2.5, px: 2, display: "flex", gap: 3 }}>
  {/* Left Section - Filters & Sorting */}
  <Box sx={{ width: "25%" ,p: 2, }}>
    {/* Sorting Dropdown */}
    <ListBox sort={sort} setSort={setSort} />

    {/* Experience Filter */}
    <Box sx={{ position: "relative", mt: 2 }}>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => setShowFilters(!showFilters)}
      >
        Experience
      </Button>

      {showFilters && (
        <Paper sx={{ position: "absolute", top: 48, left: 0, width: "100%", p: 2, boxShadow: 3 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Experience Level
          </Typography>
          {["All", "1-2 years", "2-6 years", "Over 6 years"].map((label, index) => (
            <Box
              key={index}
              onClick={() => handleCheckboxChange(index)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                borderRadius: 1,
                cursor: "pointer",
                transition: "background 0.3s",
                bgcolor: selectedCheckbox === index ? "primary.light" : "transparent",
                borderLeft: selectedCheckbox === index ? 4 : 0,
                borderColor: "primary.main",
                ":hover": { bgcolor: "grey.100" }
              }}
            >
              <input type="checkbox" checked={selectedCheckbox === index} readOnly hidden />
              {label}
            </Box>
          ))}
        </Paper>
      )}
    </Box>

    {/* Liked Jobs Toggle */}
    <Button
      variant={showLikedJobs ? "contained" : "outlined"}
      color="primary"
      fullWidth
      sx={{ mt: 2 }}
      onClick={() => {
        setShowLikedJobs((prevState) => !prevState);
        filterLikedJobs();
      }}
    >
      {showLikedJobs ? "All Jobs" : "Saved Jobs"}
    </Button>
  </Box>

  {/* Right Section - Job Cards */}
  <Box sx={{ flex: 0.95,p:2 }}>
    {filteredJobs && filteredJobs.length > 0 ? (
      <Grid container spacing={3} gap={2}>
        {filteredJobs.map((job, index) => (
            <JobCard job={job} />
        ))}
      </Grid>
    ) : (
      <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
        No jobs found. Try a different search.
      </Typography>
    )}

    {/* Load More Button */}
    {numPage > page && !isFetching && (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 5 }}>
        <Button variant="outlined" color="primary" onClick={() => setPage((prevPage) => prevPage + 1)}>
          Load More
        </Button>
      </Box>
    )}
  </Box>
</Box>)}
      
    </Box>
  </Box>
</Box>

  );
};

export default desktopView;