import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineSearch, AiOutlineCheck } from "react-icons/ai"; // Import check icon
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
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiRequest } from "../../utils"; // Ensure this utility is correctly set up for API calls
import { useSelector } from "react-redux";
import { JobCard } from "../../components";

const DesktopView = () => {
  const { user } = useSelector((state) => state.user);

  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTab, setSelectedTab] = useState(0); 
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [experienceFilter, setExperienceFilter] = useState([]);
  const [workModeFilter, setWorkModeFilter] = useState([]);
  const [workTypeFilter, setWorkTypeFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState([]);
  const [salaryRangeFilter, setSalaryRangeFilter] = useState([]);
  const [datePostedFilter, setDatePostedFilter] = useState([]);

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

  const experienceOptions = [
    { value: "0-2", label: "0-2 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "6-8", label: "6-8 years" },
    { value: "9-11", label: "9-11 years" },
    { value: "11+", label: "Over 11 years" },
  ];

  const workModeOptions = ["Remote", "Hybrid", "Work From Office"];
  const workTypeOptions = ["Full-Time", "Part-Time", "Contract", "Temporary"];
  const salaryRangeOptions = [
    "30-40",
    "40-50",
    "50-60",
    "60-70",
    "70-80",
    "80-90",
  ];
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
      searchLoc: searchLocation,
      exp: experienceFilter,
      sort: sort,
      pageNum: page,
      workMode: workModeFilter,
      workType: workTypeFilter,
      locations: locationsForAPI,
      salary: salaryRangeFilter,
      datePosted: datePostedFilter,
    });
    try {
      const res = await apiRequest({
        url: "/jobs" + newURL,
        method: "POST",
        data: { skills: user?.skills || []}
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
    searchQuery,
    searchLocation,
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
    setPage(1);
    fetchJobs();
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
    const isSelected = state.includes(value);
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
        {isSelected && (
          <AiOutlineCheck color="#1A73E8" style={{ marginRight: "8px" }} />
        )}
        <Typography variant="body1" color="#404258" fontFamily="Poppins">
          {label}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", p: 5 }}>
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
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setSearchQuery(e.target.value); // Update searchQuery directly
            }}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <IconButton sx={{ color: "gray" }}>
            <MdLocationOn fontSize="24px" />
          </IconButton>
          <InputBase
            sx={{ flex: 1, fontSize: "1.1rem", ml: 1 }}
            placeholder="Location"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
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

      <Box sx={{
          maxWidth: "xl",
          mx: "auto",
          mt: 6,
          px: 2,
          display: "flex",
          }}>
        <Tabs
           value={selectedTab}
           onChange={(event, newValue) => setSelectedTab(newValue)}
          indicatorColor="primary"
          textColor="#474E68"
        >
          <Tab
            label="All Jobs"
            sx={{
              fontFamily: "Satoshi",
              fontSize: "18px",
              fontWeight: "700",
              textTransform: "none",
              textColor: "#474E68",
            }}
          />
          <Tab
            label="Recommended Jobs"
            sx={{
              fontFamily: "Satoshi",
              fontSize: "18px",
              fontWeight: "700",
              textTransform: "none",
              textColor: "#474E68",
            }}
          />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: "xl",
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
                Experience{" "}
                {experienceFilter.length > 0 && `(${experienceFilter.length})`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {experienceOptions.map((option) => (
                  <FilterOption
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    state={experienceFilter}
                    setState={setExperienceFilter}
                  />
                ))}
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
                Salary Range{" "}
                {salaryRangeFilter.length > 0 &&
                  `(${salaryRangeFilter.length})`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {salaryRangeOptions.map((range) => (
                  <FilterOption
                    key={range}
                    label={`${range} Lakhs`}
                    value={range}
                    state={salaryRangeFilter}
                    setState={setSalaryRangeFilter}
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
          {/* Job Cards */}
          <Grid container spacing={3}>
            {filteredJobs.map((job) => (
              <Grid item xs={12} key={job._id}>
                <JobCard job={job} user={user} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default DesktopView;
