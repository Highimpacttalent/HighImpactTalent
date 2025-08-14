import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import JobCard from "./component/MobJobcard";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
//import { FaSortAmountDown } from "react-icons/fa";
import { Grid } from "@mui/material";

import {
  Box,
  InputBase,
  Typography,
  IconButton,
  Pagination,
  Menu,
  MenuItem,
  Chip,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { MdLocationOn } from "react-icons/md";
import { FaSortAmountDown } from "react-icons/fa";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//import SwapVertIcon from "@mui/icons-material/SwapVert";
//import InfoIcon from "@mui/icons-material/Info";
import { apiRequest } from "../../utils";
import Loader from "../Landing/LandingMain/loader";
import NoJobFound from "./NoJob";
import { useSelector } from "react-redux";

const mobileView = () => {
  const { user } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (value) => {
    handleClose();
    switch (value) {
      case "All Jobs":
        setSort("All Jobs");
        setSelectedTab(0);
        break;
      case "Recommended":
        setSort("Recommended");
        setSelectedTab(1);
        break;
      case "Newest": // ← handle "Newest" explicitly
        setSort("Newest");
        setSelectedTab(0);
        break;
      case "Saved":
        setSort("Saved");
        setSelectedTab(2);
        break;
      case "Salary (High to Low)":
        setSort("Salary (High to Low)");
        setSelectedTab(3);
        break;
    }
    setPage(1);
  };

  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState(0);
  const explist = ["0-100", "1-2", "2-6", "6-100"];
  const location = useLocation();
  const navigate = useNavigate();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const Statelocation = useLocation();
  const { searchKeywordProp, searchLocationProp } = Statelocation.state || {};
  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  // Changed to match desktop implementation - separate input tracking from actual query states
  const [searchKeyword, setSearchKeyword] = useState(searchKeywordProp || "");
  const [searchLocation, setSearchLocation] = useState(
    searchLocationProp || ""
  );
  // These will only update when search button is clicked
  const [searchQuery, setSearchQuery] = useState(searchKeywordProp || "");
  const [searchLocationQuery, setSearchLocationQuery] = useState(
    searchLocationProp || ""
  );

  const [selectedTab, setSelectedTab] = useState(0);
  const [experienceFilter, setExperienceFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState([]);
  const [workModeFilter, setWorkModeFilter] = useState([]);
  const [workTypeFilter, setWorkTypeFilter] = useState([]);
  const [salaryRangeFilter, setSalaryRangeFilter] = useState([]);
  const [datePostedFilter, setDatePostedFilter] = useState([]);
  const [jobLocation, setJobLocation] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Set all accordion panels to collapsed by default
  const [expandedAccordions, setExpandedAccordions] = useState({
    experience: false,
    workMode: false,
    workType: false,
    location: false,
    salary: false,
    datePosted: false,
  });

  const toggleFilterDrawer = (open) => setFilterDrawerOpen(open);
  const toggleSortDrawer = (open) => setSortDrawerOpen(open);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const workModeOptions = ["Remote", "Hybrid", "Work From Office"];
  const workTypeOptions = ["Full-Time", "Part-Time", "Contract", "Temporary"];
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
    searchLoc,
    exp,
    sort,
    pageNum,
    workMode,
    workType,
    locations,
    salary,
    datePosted,
    isRecommended,
  }) => {
    const params = new URLSearchParams();

    if (query) params.append("query", query);
    if (searchLoc) params.append("searchLocation", searchLoc);
    if (exp && exp.length > 0) params.append("exp", exp.join(","));
    if (sort) params.append("sort", sort);
    if (pageNum) params.append("page", pageNum);
    if (workMode && workMode.length > 0)
      params.append("workMode", workMode.join(","));
    if (workType && workType.length > 0)
      params.append("workType", workType.join(","));
    if (locations && locations.length > 0)
      params.append("location", locations.join(","));
    if (salary && salary.length > 0) params.append("salary", salary.join(","));
    if (datePosted && datePosted.length > 0)
      params.append("datePosted", datePosted.join(","));
    if (selectedTab) params.append("isRecommended", true);

    return `${location.pathname}?${params.toString()}`;
  };

  const fetchJobs = async () => {
    setIsFetching(true);
    let locationsForAPI = [...locationFilter];
    if (locationsForAPI.includes("Others")) {
      locationsForAPI = locationsForAPI.filter((loc) => loc !== "Others");
    }
    const newURL = updateURL({
      query: searchQuery,
      searchLoc: searchLocationQuery, // Updated to use searchLocationQuery
      exp: experienceFilter,
      sort: sort,
      pageNum: page,
      workMode: workModeFilter,
      workType: workTypeFilter,
      locations: locationsForAPI,
      salary: salaryRangeFilter,
      datePosted: datePostedFilter,
    });
    const token = user?.token || localStorage.getItem("authToken");
    try {
      const res = await apiRequest({
        url: "/jobs" + newURL,
        method: "POST",
        token: token,
        data: { skills: user?.skills || [] },
      });

      // Handle "Others" filter here if selected
      let processedData = res?.data;

      if (locationFilter.includes("Others")) {
        // Filter to include only jobs whose locations are NOT in the topCities list (excluding "Others")
        const regularCities = topCities.filter((city) => city !== "Others");
        processedData = processedData.filter((job) => {
          // If the job location doesn't match any of the regular cities, include it
          return !regularCities.some((city) =>
            job.jobLocation.toLowerCase().includes(city.toLowerCase())
          );
        });
      }

      setData(processedData);
      setFilteredJobs(processedData);
      setNumPage(res?.numOfPage);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [
    page,
    sort,
    searchQuery, // This will only change when search button is clicked
    searchLocationQuery, // This will only change when search button is clicked
    experienceFilter,
    locationFilter,
    workModeFilter,
    workTypeFilter,
    salaryRangeFilter,
    datePostedFilter,
    selectedTab,
  ]);

  // Handle search on Enter key press for both inputs
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  // Handle search button click - this will trigger the API call
  const handleSearchClick = () => {
    setSearchQuery(searchKeyword);
    setSearchLocationQuery(searchLocation);
    setPage(1);
  };

  // New function to clear search query
  const handleClearSearchQuery = () => {
    setSearchQuery("");
    setSearchKeyword("");
    setPage(1);
  };

  // New function to clear search location
  const handleClearSearchLocation = () => {
    setSearchLocationQuery("");
    setSearchLocation("");
    setPage(1);
  };

  // New function to clear all search terms
  const handleClearAllSearch = () => {
    setSearchQuery("");
    setSearchLocationQuery("");
    setSearchKeyword("");
    setSearchLocation("");
    setPage(1);
  };

  const handleResetFilters = () => {
    setExperienceFilter([]);
    setWorkModeFilter([]);
    setWorkTypeFilter([]);
    setLocationFilter([]);
    setSalaryRangeFilter([]);
    setDatePostedFilter([]);
    setPage(1);
  };

  // Handle accordion expansion
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordions({
      ...expandedAccordions,
      [panel]: isExpanded,
    });
  };

  const handleMultipleSelection = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const getActiveFilterCount = () => {
    return (
      experienceFilter.length +
      workModeFilter.length +
      workTypeFilter.length +
      locationFilter.length +
      salaryRangeFilter.length +
      datePostedFilter.length
    );
  };

  const FilterOption = ({ label, value, state, setState }) => {
    const isChecked = state.includes(value);

    const handleChange = () => {
      if (isChecked) {
        setState(state.filter((item) => item !== value));
      } else {
        setState([...state, value]);
      }
    };

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          p: 1,
          borderRadius: "4px",
        }}
        onClick={() => handleMultipleSelection(value, state, setState)}
      >
        <FormControlLabel
          control={<Checkbox checked={isChecked} onChange={handleChange} />}
        />
        <Typography variant="body1" color="#404258" fontFamily="Poppins">
          {label}
        </Typography>
      </Box>
    );
  };

  return (
    <div
      className="bg-white min-h-screen border-red-200"
      style={{ padding: isMobile ? 10 : 40 }}
    >
      <Loader isLoading={isFetching} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          {/* Search Bar */}
          <Box
            sx={{
              mx: "auto",
              mt: 3,
              display: "flex",
              justifyContent: "center",
            }}
          >
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  p: 1,
                  borderBottom: 1,
                }}
              >
                <IconButton sx={{ color: "gray" }}>
                  <AiOutlineSearch fontSize="24px" />
                </IconButton>
                <InputBase
                  sx={{ flex: 1, fontSize: "1rem", ml: 1 }}
                  placeholder="Job title or keywords"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </Box>

              {/* Location Input */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  p: 1,
                  borderBottom: 1,
                }}
              >
                <IconButton sx={{ color: "gray" }}>
                  <MdLocationOn fontSize="24px" />
                </IconButton>
                <InputBase
                  sx={{ flex: 1, fontSize: "1rem", ml: 1 }}
                  placeholder="Location (City, State, or Zip)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
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

          {/* Search Result Chips - Added from desktop version */}
          {(searchQuery || searchLocationQuery) && (
            <Box sx={{ mt: 2, px: 2 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1, fontSize: "0.875rem" }}
                >
                  Active searches:
                </Typography>

                {searchQuery && (
                  <Chip
                    label={`Title: "${searchQuery}"`}
                    onDelete={handleClearSearchQuery}
                    deleteIcon={<CloseIcon />}
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "0.75rem",
                      "& .MuiChip-deleteIcon": {
                        color: "primary.main",
                        fontSize: "16px",
                      },
                    }}
                  />
                )}

                {searchLocationQuery && (
                  <Chip
                    label={`Location: "${searchLocationQuery}"`}
                    onDelete={handleClearSearchLocation}
                    deleteIcon={<CloseIcon />}
                    variant="outlined"
                    color="secondary"
                    size="small"
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "0.75rem",
                      "& .MuiChip-deleteIcon": {
                        color: "secondary.main",
                        fontSize: "16px",
                      },
                    }}
                  />
                )}

                {searchQuery && searchLocationQuery && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleClearAllSearch}
                    sx={{
                      textTransform: "none",
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      minWidth: "auto",
                      px: 1,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    Clear all
                  </Button>
                )}
              </Stack>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "6vh",
              mt: 1,
              justifyContent: "center",
            }}
          >
            <Box
              display="flex"
              sx={{
                height: "100%",
                justifyContent: "space-between",
                width: "87%",
              }}
            >
              <Button
                sx={{
                  color: "#404258",
                  fontFamily: "Poppins",
                  fontWeight: "500",
                }}
                onClick={() => toggleFilterDrawer(true)}
              >
                <FilterListIcon sx={{ mr: 0.25 }} />
                <Typography sx={{ fontFamily: "Poppins", fontWeight: "500" }}>
                  Filters
                </Typography>
              </Button>
              <Box sx={{ mt: 1 }}>
                <Button
                  sx={{
                    color: "#404258",
                    fontFamily: "Poppins",
                    fontWeight: "500",
                  }}
                  onClick={handleClick}
                >
                  <FaSortAmountDown style={{ marginRight: 4 }} />
                  <Typography sx={{ fontFamily: "Poppins", fontWeight: "500" }}>
                    Sort
                  </Typography>
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem onClick={() => handleSelect("All Jobs")}>
                    All Jobs
                  </MenuItem>
                  <MenuItem onClick={() => handleSelect("Recommended")}>
                    Recommended
                  </MenuItem>
                  <MenuItem onClick={() => handleSelect("Newest")}>
                    Newest First
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSelect("Salary (High to Low)")}
                  >
                    Salary (High to Low)
                  </MenuItem>
                  <MenuItem onClick={() => handleSelect("Saved")}>
                    Saved Jobs
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Box>

          {/* Filter Drawer */}
          <Drawer
            anchor="left"
            open={filterDrawerOpen}
            onClose={() => toggleFilterDrawer(false)}
          >
            <Box sx={{ width: 300, p: 2 }}>
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  color="#404258"
                  gutterBottom
                  sx={{ fontFamily: "Poppins", fontWeight: "600" }}
                >
                  All Filters{" "}
                  {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
                </Typography>
                {getActiveFilterCount() > 0 && (
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleResetFilters}
                    sx={{ textTransform: "none" }}
                  >
                    Reset
                  </Button>
                )}
              </Box>
              {/* Experience Filter */}
              <Accordion
                expanded={expandedAccordions.experience}
                onChange={handleAccordionChange("experience")}
                sx={{ mb: 2, boxShadow: "none" }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" color="#404258" fontFamily="Satoshi, sans-serif">
                    Experience (in years) {experienceFilter.length > 0 && `(${experienceFilter.length})`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        label="Min Experience"
                        type="number"
                        value={minExperience}
                        onChange={(e) => setMinExperience(e.target.value)}
                        sx={{ flex: 1 }}
                        InputProps={{
                          endAdornment: <InputAdornment position="end"></InputAdornment>,
                        }}
                      />
                      <TextField
                        label="Max Experience"
                        type="number"
                        value={maxExperience}
                        onChange={(e) => setMaxExperience(e.target.value)}
                        sx={{ flex: 1 }}
                        InputProps={{
                          endAdornment: <InputAdornment position="end"></InputAdornment>,
                        }}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (minExperience && maxExperience) {
                          const range = `${minExperience}-${maxExperience}`;
                          if (!experienceFilter.includes(range)) {
                            setExperienceFilter([...experienceFilter, range]);
                          }
                        }
                      }}
                      sx={{ alignSelf: 'flex-end' }}
                    >
                      Add Range
                    </Button>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {experienceFilter.map((range) => (
                        <Chip
                          key={range}
                          label={range.includes('-') ? `${range} years` : `${range}+ years`}
                          onDelete={() => setExperienceFilter(experienceFilter.filter(r => r !== range))}
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Salary Filter */}
              <Accordion
                expanded={expandedAccordions.salary}
                onChange={handleAccordionChange("salary")}
                sx={{ mb: 2, boxShadow: "none" }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" color="#404258" fontFamily="Satoshi, sans-serif">
                    Salary Range (in LPA) {salaryRangeFilter.length > 0 && `(${salaryRangeFilter.length})`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        label="Min Salary"
                        type="number"
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                        sx={{ flex: 1 }}
                        InputProps={{
                          endAdornment: <InputAdornment position="end"></InputAdornment>,
                        }}
                      />
                      <TextField
                        label="Max Salary"
                        type="number"
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                        sx={{ flex: 1 }}
                        InputProps={{
                          endAdornment: <InputAdornment position="end"></InputAdornment>,
                        }}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (minSalary && maxSalary) {
                          const range = `${minSalary}-${maxSalary}`;
                          if (!salaryRangeFilter.includes(range)) {
                            setSalaryRangeFilter([...salaryRangeFilter, range]);
                          }
                        }
                      }}
                      sx={{ alignSelf: 'flex-end' }}
                    >
                      Add Range
                    </Button>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {salaryRangeFilter.map((range) => (
                        <Chip
                          key={range}
                          label={`${range} LPA`}
                          onDelete={() => setSalaryRangeFilter(salaryRangeFilter.filter(r => r !== range))}
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
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
                    Work Mode{" "}
                    {workModeFilter.length > 0 && `(${workModeFilter.length})`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {workModeOptions.map((mode) => (
                      <FilterOption
                        key={mode}
                        label={mode}
                        value={mode}
                        state={workModeFilter}
                        setState={setWorkModeFilter}
                      />
                    ))}
                  </Box>
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
                    Work Type{" "}
                    {workTypeFilter.length > 0 && `(${workTypeFilter.length})`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {workTypeOptions.map((type) => (
                      <FilterOption
                        key={type}
                        label={type}
                        value={type}
                        state={workTypeFilter}
                        setState={setWorkTypeFilter}
                      />
                    ))}
                  </Box>
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
                    Location{" "}
                    {locationFilter.length > 0 && `(${locationFilter.length})`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {topCities.map((city) => (
                      <FilterOption
                        key={city}
                        label={city}
                        value={city}
                        state={locationFilter}
                        setState={setLocationFilter}
                      />
                    ))}
                  </Box>
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
                    Date Posted{" "}
                    {datePostedFilter.length > 0 &&
                      `(${datePostedFilter.length})`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {datePostedOptions.map((date) => (
                      <FilterOption
                        key={date}
                        label={date}
                        value={date}
                        state={datePostedFilter}
                        setState={setDatePostedFilter}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Drawer>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-5">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={2}
              gap={2}
            >
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
                <NoJobFound />
              )}
            </Box>

            {/* Pagination */}
            <Box
              display="flex"
              justifyContent="center"
              mt={4}
              sx={{
                overflowX: "auto", // allow scroll if it overflows
                pb: 1, // space for scrollbar on some devices
                "&::-webkit-scrollbar": {
                  // hide scrollbar on WebKit without breaking UX
                  display: "none",
                },
              }}
            >
              <Pagination
                count={numPage}
                page={page}
                onChange={(_, value) => {
                  setPage(value);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                color="primary"
                shape="rounded"
                size="medium"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "#404258",
                    "&:hover": {
                      backgroundColor: "rgba(60, 126, 252, 1)",
                    },
                  },
                  "& .Mui-selected": {
                    backgroundColor: "rgba(60, 126, 252, 1) !important",
                    color: "white !important",
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                  },
                  mb: 4,
                }}
              />
            </Box>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default mobileView;
