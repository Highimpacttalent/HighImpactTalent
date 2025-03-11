import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { CustomButton, JobCard, ListBox } from "../../components";
import { Grid, } from "@mui/material";

import {
  Box,
  Paper,InputBase,
  Typography,
  IconButton
} from "@mui/material";
import { MdLocationOn } from "react-icons/md";
import {
  Accordion,
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

const mobileView = () => {
  const { user } = useSelector((state) => state.user);

  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
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
    <div className="bg-gray-50 min-h-screen border-red-200" style={{padding:isMobile?10:40}}>
      <Box sx={{display:"flex",flexDirection: "column",gap:2}}>
      


<Box>
  {/* Search Bar */}
  <Box sx={{ mx: "auto", mt: 3, px: 2, display: "flex", justifyContent: "center" }}>
  <Box
    sx={{
      display: "flex",
      flexDirection: "column", // Stack inputs vertically
      alignItems: "center",
      p: 2,
      width: "100%",
      mx: "auto",
      gap: 2, // Adds spacing between inputs
    }}
  >
    {/* Job Title Input */}
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", p: 1, borderRadius: "12px", boxShadow: 1, bgcolor: "#F5F5F5" }}>
      <IconButton sx={{ color: "gray" }}>
        <AiOutlineSearch fontSize="24px" />
      </IconButton>
      <InputBase
        sx={{ flex: 1, fontSize: "1rem", ml: 1 }}
        placeholder="Job title or keywords"
        value={searchKeyword}
        onChange={handleInputChange}
      />
    </Box>

    {/* Location Input */}
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", p: 1, borderRadius: "12px", boxShadow: 1, bgcolor: "#F5F5F5" }}>
      <IconButton sx={{ color: "gray" }}>
        <MdLocationOn fontSize="24px" />
      </IconButton>
      <InputBase
        sx={{ flex: 1, fontSize: "1rem", ml: 1 }}
        placeholder="Location (City, State, or Zip)"
        value={jobLocation}
        onChange={handleLocationChange}
      />
    </Box>

    {/* Search Button */}
    <Button
      variant="contained"
      sx={{
        borderRadius: "25px",
        backgroundColor: "#1A73E8",
        color: "white",
        px: 4,
        py: 1.5,
        textTransform: "none",
        fontSize: "1rem",
        fontWeight: "bold",
        width: "100%",
        "&:hover": { backgroundColor: "#1669D8" },
      }}
    >
      Search Jobs
    </Button>
  </Box>
</Box>


  {/* Main Content */}
  <div className="max-w-6xl mx-auto mt-6 px-5">
    {/* Filters & Sorting */}
    <div className="flex flex-wrap items-center gap-4">
      {/* Sorting Dropdown */}
      <ListBox sort={sort} setSort={setSort} />

      {/* Experience Filter */}
      <div className="relative">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 px-5 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
        >
          Experience
        </button>

        {/* Filter Dropdown */}
        {showFilters && (
          <div className="absolute top-12 left-0 w-64 bg-white shadow-lg rounded-lg z-10 p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Experience Level
            </h3>
            {["All", "1-2 years", "2-6 years", "Over 6 years"].map((label, index) => (
              <div
                key={index}
                onClick={() => handleCheckboxChange(index)}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition ${selectedCheckbox === index ? "bg-blue-100 border-l-4 border-blue-500" : "hover:bg-gray-100"}`}
              >
                <input
                  type="checkbox"
                  checked={selectedCheckbox === index}
                  onChange={() => {}}
                  className="hidden"
                />
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liked Jobs Toggle */}
      <button
        onClick={() => {
          setShowLikedJobs((prevState) => !prevState);
          filterLikedJobs();
        }}
        className={`p-2 px-5 rounded-full shadow-md transition ${
          showLikedJobs ? "bg-blue-700 text-white" : "bg-white text-gray-700 border border-gray-300"
        } hover:bg-blue-600 hover:text-white`}
      >
        {showLikedJobs ? "All Jobs" : "Saved Jobs"}
      </button>
    </div>

    <Box display="flex" flexDirection="column" alignItems="center" mt={6} gap={2}>
  {filteredJobs && filteredJobs.length > 0 ? (
    <Grid container justifyContent="center" spacing={3}>
      {filteredJobs.map((job, index) => (
        <Grid item key={index} xs={12} sm={10} md={9}>
          <Box>
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

    {/* Load More Button */}
    {numPage > page && !isFetching && (
      <div className="flex items-center justify-center pt-10">
        <CustomButton
          title="Load More"
          containerStyles="py-3 px-8 text-lg font-semibold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-700 hover:text-white transition"
          onClick={() => setPage((prevPage) => prevPage + 1)}
        />
      </div>
    )}
  </div>
  </Box>
  </Box>
</div>

  );
};

export default mobileView;