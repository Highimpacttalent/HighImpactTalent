import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { CustomButton, JobCard, ListBox } from "../../components";
import FilterListIcon from '@mui/icons-material/FilterList'
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
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  Drawer,
  Button,
  Modal
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import InfoIcon from "@mui/icons-material/Info";
import { apiRequest } from "../../utils";
import NoJobFound from "./NoJob";
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
  const [isFetching, setIsFetching] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState(0);
  const explist = ["0-100", "1-2", "2-6", "6-100"];
  const location = useLocation();
  const navigate = useNavigate();
  const [experienceFilter, setExperienceFilter] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [workMode, setWorkMode] = useState("");
    const [workType, setWorkType] = useState("");
    const [salaryRange, setSalaryRange] = useState("");
    const [datePosted, setDatePosted] = useState("");
    const [locations, setLocations] = useState([]);
    const [expandedAccordions, setExpandedAccordions] = useState({
      experience: true,
      workMode: true,
      workType: true,
      location: true,
      salary: true,
      datePosted: true
    });

  const toggleFilterDrawer = (open) => setFilterDrawerOpen(open);
  const toggleSortDrawer = (open) => setSortDrawerOpen(open);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

const experienceOptions = [
  { value: "0-2", label: "0-2 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "6-8", label: "6-8 years" },
  { value: "9-11", label: "9-11 years" },
  { value: "11+", label: "Over 11 years" },
];
const workModeOptions = ["Remote", "Hybrid", "Work From Office"];
  const workTypeOptions = ["Full-Time", "Part-Time", "Contract", "Temporary"];
  const salaryRangeOptions = ["0-10", "11-20", "21-30", "31-40"];
  const datePostedOptions = [
    "Last 24 hours",
    "Last one week",
    "Last one month",
  ];

  const topCities = [
    "Bangalore",
    "Mumbai",
    "Hyderabad",
    "Ahmedabad",
    "Pune",
    "Delhi",
    "Gurgaon",
    "Chennai",
    "Noida",
    "Kochi",
    "Kolkata",
    "others",
  ];


 // Update URL with filters
 const updateURL = ({
  query,
  cmpLoc,
  exp,
  sort,
  pageNum,
  workMode,
  workType,
  salary,
  datePosted,
}) => {
  const params = new URLSearchParams();

  if (query) params.append("query", query);
  if (cmpLoc) params.append("location", cmpLoc);
  if (exp) params.append("exp", exp);
  if (sort) params.append("sort", sort);
  if (pageNum) params.append("page", pageNum);
  if (workMode) params.append("workMode", workMode);
  if (workType) params.append("workType", workType);
  if (salary) params.append("salary", salary);
  if (datePosted) params.append("datePosted", datePosted);

  return `${location.pathname}?${params.toString()}`;
};

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredJobs, setFilteredJobs] = useState();

  const fetchJobs = async () => {
    setIsFetching(true);
    const newURL = updateURL({
      query: searchQuery,
      cmpLoc: jobLocation,
      exp: experienceFilter,
      sort: sort,
      pageNum: page,
      workMode: workMode,
      workType: workType,
      salary: salaryRange,
      datePosted: datePosted,
    });
    try {
      const res = await apiRequest({
        url: "/jobs" + newURL,
        method: "POST",
      });
      setData(res?.data);
      setFilteredJobs(res?.data);
      setNumPage(res?.numOfPage);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Handle search input change
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


  // Handle accordion expansion
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordions({
      ...expandedAccordions,
      [panel]: isExpanded
    });
  };

// Handle experience filter change
  const handleExperienceChange = (event) => {
    setExperienceFilter(event.target.value);
  };

  // Fetch jobs when filters change
  useEffect(() => {
    fetchJobs();
  }, [sort, experienceFilter, page, workMode, workType, salaryRange, datePosted]);


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

  // Handle search button click
  const handleSearchClick = () => {
    fetchJobs();
  };

  return (
    <div className="bg-gray-50 min-h-screen border-red-200" style={{padding:isMobile?10:40}}>
      <Box sx={{display:"flex",flexDirection: "column",gap:2}}>
      


<Box>
  {/* Search Bar */}
  <Box sx={{ mx: "auto", mt: 3, display: "flex", justifyContent: "center" }}>
  <Box
    sx={{
      display: "flex",
      flexDirection: "column", // Stack inputs vertically
      alignItems: "center",
      p: 2,
      width: "100%",
      mx: "auto",
      gap: 2, 
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
      onClick={handleSearchClick}
    >
      Search Jobs
    </Button>
  </Box>
</Box>
    <Box sx={{display:"flex",alignItems:"center",height:"6vh",mt:1,justifyContent:"flex-end"}}>
      <Box display="flex" sx={{height:"100%",justifyContent:"space-between",width:"95%"}}>
          <Button sx={{color:"#404258",fontFamily:"Poppins",fontWeight:"500"}} onClick={() => toggleFilterDrawer(true)}>
            <FilterListIcon sx={{mr:0.25}}/>
            <Typography sx={{fontFamily:"Poppins",fontWeight:"500"}}>Filters</Typography>
          </Button>
        </Box>
        </Box>

         {/* Filter Drawer */}
         <Drawer anchor="left" open={filterDrawerOpen} onClose={() => toggleFilterDrawer(false)}>
      <Box sx={{ width: 300,p:2 }}>
        <Typography variant="h6" sx={{ mb: 1,mt:1,color:"#404258",
              fontFamily:"Satoshi, sans-serif" }}>
          All Filters
        </Typography>

        {/* Experience Filter */}
        <Accordion
          expanded={expandedAccordions.experience}
          onChange={handleAccordionChange("experience")}
          sx={{ mb: 2, boxShadow: "none" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              variant="h6"
              color="#404258"
              fontFamily="Satoshi, sans-serif"
            >
              Experience
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={experienceFilter}
                onChange={handleExperienceChange}
                displayEmpty
                inputProps={{ "aria-label": "Experience filter" }}
                sx={{ color: "#404258", fontFamily: "Poppins" }}
              >
                <MenuItem
                  value=""
                  sx={{ color: "#404258", fontFamily: "Poppins" }}
                >
                  All Experience Levels
                </MenuItem>
                {experienceOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{ color: "#404258", fontFamily: "Poppins" }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Work Mode Filter */}
        <Accordion
          expanded={expandedAccordions.workMode}
          onChange={handleAccordionChange("workMode")}
          sx={{ mb: 2, boxShadow: "none" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              variant="h6"
              color="#404258"
              fontFamily="Satoshi, sans-serif"
            >
              Work Mode
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {workModeOptions.map((mode) => (
              <FormControlLabel
                key={mode}
                control={
                  <Checkbox
                    checked={workMode === mode}
                    onChange={() => setWorkMode(workMode === mode ? "" : mode)}
                    color="#404258"
                  />
                }
                label={mode}
                componentsProps={{
                  typography: {
                    sx: { color: "#404258", fontFamily: "Poppins" },
                  },
                }}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Work Type Filter */}
        <Accordion
          expanded={expandedAccordions.workType}
          onChange={handleAccordionChange("workType")}
          sx={{ mb: 2, boxShadow: "none" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              variant="h6"
              color="#404258"
              fontFamily="Satoshi, sans-serif"
            >
              Work Type
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {workTypeOptions.map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={workType === type}
                    onChange={() => setWorkType(workType === type ? "" : type)}
                    sx={{ color: "#404258" }}
                  />
                }
                label={type}
                componentsProps={{
                  typography: {
                    sx: { color: "#404258", fontFamily: "Poppins" },
                  },
                }}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Location Filter */}
        <Accordion
          expanded={expandedAccordions.location}
          onChange={handleAccordionChange("location")}
          sx={{ mb: 2, boxShadow: "none" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              variant="h6"
              color="#404258"
              fontFamily="Satoshi, sans-serif"
            >
              Location
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Location filter" }}
                sx={{ color: "#404258", fontFamily: "Poppins" }}
              >
                <MenuItem
                  value=""
                  sx={{ color: "#404258", fontFamily: "Poppins" }}
                >
                  All Locations
                </MenuItem>
                {topCities.map((city) => (
                  <MenuItem
                    key={city}
                    value={city}
                    sx={{ color: "#404258", fontFamily: "Poppins" }}
                  >
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Salary Filter */}
        <Accordion
          expanded={expandedAccordions.salary}
          onChange={handleAccordionChange("salary")}
          sx={{ mb: 2, boxShadow: "none" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              variant="h6"
              color="#404258"
              fontFamily="Satoshi, sans-serif"
            >
              Salary Range
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {salaryRangeOptions.map((range) => (
              <FormControlLabel
                key={range}
                control={
                  <Checkbox
                    checked={salaryRange === range}
                    onChange={() =>
                      setSalaryRange(salaryRange === range ? "" : range)
                    }
                  />
                }
                label={`${range.split("-")[0]} - ${range.split("-")[1]} lakhs`}
                componentsProps={{
                  typography: {
                    sx: { color: "#404258", fontFamily: "Poppins" },
                  },
                }}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Date Posted Filter */}
        <Accordion
          expanded={expandedAccordions.datePosted}
          onChange={handleAccordionChange("datePosted")}
          sx={{ mb: 2, boxShadow: "none" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              variant="h6"
              color="#404258"
              fontFamily="Satoshi, sans-serif"
            >
              Date Posted
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={datePosted}
                onChange={(e) => setDatePosted(e.target.value)}
                displayEmpty
                sx={{ color: "#404258", fontFamily: "Poppins" }}
              >
                <MenuItem value="">Any Time</MenuItem>
                {datePostedOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => toggleFilterDrawer(false)}>
          Apply Filters
        </Button>
      </Box>
    </Drawer>

  {/* Main Content */}
  <div className="max-w-6xl mx-auto px-5">

    <Box display="flex" flexDirection="column" alignItems="center" mt={2} gap={2}>
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
    <NoJobFound/>
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