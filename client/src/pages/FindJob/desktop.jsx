import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Typography,
  Paper,
  Divider,
  InputBase,
  IconButton,
  Button,
  Grid,
  Tabs,
  Tab,
  Accordion,
  Menu,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiRequest } from "../../utils"; // Ensure this utility is correctly set up for API calls
import { useSelector } from "react-redux";
import NoJobFound from "./NoJob";
import JobCard from "./component/DeskJobcard";
import Loader from "../Landing/LandingMain/loader";
import { FaSortAmountDown } from "react-icons/fa";

const DesktopView = () => {
  const { user } = useSelector((state) => state.user);
  const Statelocation = useLocation();
  const { searchKeywordProp, searchLocationProp } = Statelocation.state || {};

  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  // Search states - separate tracking states from actual query states
  const [searchKeyword, setSearchKeyword] = useState(searchKeywordProp || "");
  const [searchLocation, setSearchLocation] = useState(
    searchLocationProp || ""
  );
  // These will only update when the search button is clicked
  const [searchQuery, setSearchQuery] = useState(searchKeywordProp || "");
  const [searchLocationQuery, setSearchLocationQuery] = useState(
    searchLocationProp || ""
  );

  const [experienceFilter, setExperienceFilter] = useState([]);
  const [workModeFilter, setWorkModeFilter] = useState([]);
  const [workTypeFilter, setWorkTypeFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState([]);
  const [salaryRangeFilter, setSalaryRangeFilter] = useState([]);
  const [datePostedFilter, setDatePostedFilter] = useState([]);

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

  const [expandedAccordions, setExpandedAccordions] = useState({
    experience: false,
    workMode: false,
    workType: false,
    location: false,
    salary: false,
    datePosted: false,
  });

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
    "Others",
  ];

  const workModeOptions = ["Remote", "Hybrid", "Work From Office"];
  const workTypeOptions = ["Full-Time", "Part-Time", "Contract", "Temporary"];

  const datePostedOptions = [
    "Last 24 hours",
    "Last one week",
    "Last one month",
    "Any Time",
  ];

  const location = useLocation();

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
      searchLoc: searchLocationQuery, // Use searchLocationQuery instead of searchLocation
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
      window.scrollTo(0, 0);
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

  const handleSearchClick = () => {
    setSearchQuery(searchKeyword);
    setSearchLocationQuery(searchLocation);
    setPage(1);
  };

  // Handle search on Enter key press for both inputs
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
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

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      setSort("Newest");
    } else if (newValue === 1) {
      setSort("Saved");
    }
    setPage(1);
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
    <Box sx={{ bgcolor: "white", minHeight: "100vh", p: 5 }}>
      <Loader isLoading={isFetching} />
      {/* Search Bar */}
      <Box sx={{ mx: "auto", mt: 3, px: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #00000040",
            borderRadius: "50px",
            height: "50px",
            width: "100%",
            maxWidth: 1100,
            mx: "auto",
          }}
        >
          <IconButton sx={{ color: "gray", ml: 1 }}>
            <SearchOutlinedIcon fontSize="24px" />
          </IconButton>
          <InputBase
            sx={{ flex: 1, fontSize: "1.1rem", ml: 1 }}
            placeholder="Job title"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <IconButton sx={{ color: "gray" }}>
            <RoomOutlinedIcon fontSize="24px" />
          </IconButton>
          <InputBase
            sx={{ flex: 1, fontSize: "1.1rem", ml: 1 }}
            placeholder="Location"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="contained"
            sx={{
              borderRadius: "50px",
              backgroundColor: "#1A73E8",
              color: "white",
              px: 3,
              height: "100%",
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
        </Box>

        {/* Search Result Chips */}
        {(searchQuery || searchLocationQuery) && (
          <Box sx={{ mt: 2, maxWidth: 1100, mx: "auto" }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Active searches:
              </Typography>

              {searchQuery && (
                <Chip
                  label={`Title: "${searchQuery}"`}
                  onDelete={handleClearSearchQuery}
                  deleteIcon={<CloseIcon />}
                  variant="outlined"
                  color="primary"
                  sx={{
                    fontFamily: "Poppins",
                    "& .MuiChip-deleteIcon": {
                      color: "primary.main",
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
                  sx={{
                    fontFamily: "Poppins",
                    "& .MuiChip-deleteIcon": {
                      color: "secondary.main",
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
                    fontSize: "0.875rem",
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
      </Box>

      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          mt: 6,
          px: { md: 4, xs: 2, sm: 2 },
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <Box>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="#474E68"
          >
            <Tab
              label="All Jobs"
              value={0}
              sx={{
                fontFamily: "Satoshi",
                fontSize: "18px",
                fontWeight: "700",
                textTransform: "none",
                textColor: "#474E68",
                indicatorColor: "primary",
                mr: 2,
                "&::after":
                  selectedTab == 0
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "3px",
                        backgroundColor: "#3C7EFC",
                        zIndex: 1,
                      }
                    : {},
              }}
            />
            {/* Only show Saved Jobs if user is logged in */}
            {user?._id && (
              <Tab
                label="Saved Jobs"
                value={1}
                sx={{
                  fontFamily: "Satoshi",
                  fontSize: "18px",
                  fontWeight: "700",
                  textTransform: "none",
                  textColor: "#474E68",
                  indicatorColor: "primary",
                  "&::after":
                    selectedTab == 1
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: "3px",
                          backgroundColor: "#3C7EFC",
                          zIndex: 1,
                        }
                      : {},
                }}
              />
            )}
          </Tabs>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          mt: 4,
          px: 2,
          display: "flex",
          gap: 3,
        }}
      >
        {/* Left Section - Filters */}
        <Box sx={{ width: "25%", p: 2 }}>
          {/* Filter Header */}
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
              <Typography
                variant="h6"
                color="#404258"
                fontFamily="Satoshi, sans-serif"
              >
                Experience (in years){" "}
                {experienceFilter.length > 0 && `(${experienceFilter.length})`}
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
                      endAdornment: (
                        <InputAdornment position="end"></InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Max Experience"
                    type="number"
                    value={maxExperience}
                    onChange={(e) => setMaxExperience(e.target.value)}
                    sx={{ flex: 1 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end"></InputAdornment>
                      ),
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
                  sx={{ alignSelf: "flex-end" }}
                >
                  Add Range
                </Button>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {experienceFilter.map((range) => (
                    <Chip
                      key={range}
                      label={
                        range.includes("-")
                          ? `${range} years`
                          : `${range}+ years`
                      }
                      onDelete={() =>
                        setExperienceFilter(
                          experienceFilter.filter((r) => r !== range)
                        )
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

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
                Salary Range (in LPA){" "}
                {salaryRangeFilter.length > 0 &&
                  `(${salaryRangeFilter.length})`}
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
                      endAdornment: (
                        <InputAdornment position="end"></InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Max Salary"
                    type="number"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    sx={{ flex: 1 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end"></InputAdornment>
                      ),
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
                  sx={{ alignSelf: "flex-end" }}
                >
                  Add Range
                </Button>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {salaryRangeFilter.map((range) => (
                    <Chip
                      key={range}
                      label={`${range} LPA`}
                      onDelete={() =>
                        setSalaryRangeFilter(
                          salaryRangeFilter.filter((r) => r !== range)
                        )
                      }
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
                {datePostedFilter.length > 0 && `(${datePostedFilter.length})`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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

        {/* Right Section - Job Listings */}
        <Box sx={{ width: "75%", p: 2 }}>
          {filteredJobs && filteredJobs.length > 0 ? (
            <Grid container spacing={3}>
              {filteredJobs.map((job) => (
                <Grid item xs={12} key={job._id}>
                  <JobCard job={job} user={user} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <NoJobFound />
          )}
        </Box>
      </Box>
      {/* Material UI Pagination */}
      <Box display="flex" justifyContent="center">
        <Pagination
          count={numPage}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          size="large"
          shape="rounded"
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
          }}
        />
      </Box>
    </Box>
  );
};

export default DesktopView;
