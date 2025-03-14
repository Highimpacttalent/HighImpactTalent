import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  InputBase, 
  IconButton, 
  Button, 
  Grid, 
  FormControlLabel, 
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { apiRequest } from "../../utils";
import { useSelector } from "react-redux";
import { JobCard, ListBox } from "../../components";

const DesktopView = () => {
  const { user } = useSelector((state) => state.user);

  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [experienceFilter, setExperienceFilter] = useState("");
  const [showLikedJobs, setShowLikedJobs] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
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

  // Top 15 cities for location filter
  const topCities = [
    "Bangalore", "Mumbai", "Hyderabad", "Ahmedabad", "Pune",
    "Delhi", "Gurgaon", "Chennai", "Noida", "Kochi",
    "Kolkata", "others"
  ];

  const experienceOptions = [
    { value: "0-2", label: "0-2 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "6-8", label: "6-8 years" },
    { value: "9-11", label: "9-11 years" },
    { value: "11+", label: "Over 11 years" }
  ];

  const workModeOptions = ["Remote", "Hybrid", "Work From Office"];
  const workTypeOptions = ["Full-Time", "Part-Time", "Contract", "Temporary"];
  const salaryRangeOptions = ["0-50000", "50000-100000", "100000-150000", "150000-200000"];
  const datePostedOptions = ["Last 24 hours", "Last one week", "Last one month"];

  const location = useLocation();

  // Handle accordion expansion
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordions({
      ...expandedAccordions,
      [panel]: isExpanded
    });
  };

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

  // Fetch jobs with filters
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
        method: "GET",
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

  // Handle location input change
  const handleLocationChange = (e) => {
    const keyword = e.target.value;
    setJobLocation(keyword);
    if (keyword === "") {
      setFilteredJobs(data);
    } else {
      const lowerCaseKeyword = keyword.toLowerCase();
      const filtered = data.filter((job) =>
        job.jobLocation.toLowerCase().includes(lowerCaseKeyword)
      );
      setFilteredJobs(filtered);
    }
  };

  // Handle experience filter change
  const handleExperienceChange = (event) => {
    setExperienceFilter(event.target.value);
  };

  // Filter liked jobs
  const filterLikedJobs = () => {
    if (showLikedJobs) {
      setFilteredJobs(data);
    } else {
      const likedJobIds = new Set(user.likedJobs);
      const likedJobsData = data.filter((job) => likedJobIds.has(job._id));
      setFilteredJobs(likedJobsData);
    }
  };

  // Fetch jobs when filters change
  useEffect(() => {
    fetchJobs();
  }, [sort, experienceFilter, page, workMode, workType, salaryRange, datePosted]);

  // Handle search button click
  const handleSearchClick = () => {
    fetchJobs();
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", p: 5 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Search Bar */}
        <Box sx={{ mx: "auto", mt: 3, px: 2 }}>
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
            <IconButton sx={{ color: "gray" }}>
              <AiOutlineSearch fontSize="24px" />
            </IconButton>
            <InputBase
              sx={{ flex: 1, fontSize: "1.1rem", ml: 1 }}
              placeholder="Job title"
              value={searchKeyword}
              onChange={handleInputChange}
            />
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <IconButton sx={{ color: "gray" }}>
              <MdLocationOn fontSize="24px" />
            </IconButton>
            <InputBase
              sx={{ flex: 1, fontSize: "1.1rem", ml: 1 }}
              placeholder="Location"
              value={jobLocation}
              onChange={handleLocationChange}
            />
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
              onClick={handleSearchClick}
            >
              Search
            </Button>
          </Paper>
        </Box>

        {/* Main Content */}
        <Box sx={{ maxWidth: "xl", mx: "auto", mt: 6, px: 2, display: "flex", gap: 3 }}>
          {/* Left Section - Filters */}
          <Box sx={{ width: "25%", p: 2 }}>
            {/* Sorting Dropdown */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Sort By
              </Typography>
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="Newest">Newest</MenuItem>
                  <MenuItem value="Oldest">Oldest</MenuItem>
                  <MenuItem value="A-Z">A-Z</MenuItem>
                  <MenuItem value="Z-A">Z-A</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Experience Filter */}
            <Accordion 
              expanded={expandedAccordions.experience} 
              onChange={handleAccordionChange('experience')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" color="textSecondary">Experience</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth size="small">
                  <Select
                    value={experienceFilter}
                    onChange={handleExperienceChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Experience filter' }}
                  >
                    <MenuItem value="">All Experience Levels</MenuItem>
                    {experienceOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
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
              onChange={handleAccordionChange('workMode')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" color="textSecondary">Work Mode</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {workModeOptions.map((mode) => (
                  <FormControlLabel
                    key={mode}
                    control={
                      <Checkbox
                        checked={workMode === mode}
                        onChange={() => setWorkMode(workMode === mode ? "" : mode)}
                      />
                    }
                    label={mode}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Work Type Filter */}
            <Accordion 
              expanded={expandedAccordions.workType} 
              onChange={handleAccordionChange('workType')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" color="textSecondary">Work Type</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {workTypeOptions.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={workType === type}
                        onChange={() => setWorkType(workType === type ? "" : type)}
                      />
                    }
                    label={type}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Location Filter */}
            <Accordion 
              expanded={expandedAccordions.location} 
              onChange={handleAccordionChange('location')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" color="textSecondary">Location</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth size="small">
                  <Select
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Location filter' }}
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    {topCities.map((city) => (
                      <MenuItem key={city} value={city}>
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
              onChange={handleAccordionChange('salary')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" color="textSecondary">Salary Range</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {salaryRangeOptions.map((range) => (
                  <FormControlLabel
                    key={range}
                    control={
                      <Checkbox
                        checked={salaryRange === range}
                        onChange={() => setSalaryRange(salaryRange === range ? "" : range)}
                      />
                    }
                    label={`$${range.split('-')[0]} - $${range.split('-')[1]}`}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Date Posted Filter */}
            <Accordion 
              expanded={expandedAccordions.datePosted} 
              onChange={handleAccordionChange('datePosted')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" color="textSecondary">Date Posted</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth size="small">
                  <Select
                    value={datePosted}
                    onChange={(e) => setDatePosted(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Date posted filter' }}
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
          <Box sx={{ flex: 0.95, p: 2 }}>
            {filteredJobs && filteredJobs.length > 0 ? (
              <Grid container spacing={3} gap={2}>
                {filteredJobs.map((job, index) => (
                  <JobCard key={index} job={job} />
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
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setPage((prevPage) => prevPage + 1)}
                >
                  Load More
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DesktopView;