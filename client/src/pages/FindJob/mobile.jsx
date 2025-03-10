import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { CustomButton, JobCard, ListBox } from "../../components";
import { Grid, } from "@mui/material";

import {
  Box,
  Typography,
} from "@mui/material";
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

  return (
    <div className="bg-gray-50 min-h-screen border-red-200" style={{padding:isMobile?10:40}}>
      <Box sx={{display:"flex",flexDirection: "column",gap:2}}>
      


<Box>
  {/* Search Bar */}
  <div className="max-w-4xl mx-auto mt-3 px-5">
    <div className="flex items-center bg-white rounded-full shadow-lg px-4 py-3">
      <AiOutlineSearch className="text-gray-500 text-2xl" />
      <input
        type="text"
        value={searchKeyword}
        onChange={handleInputChange}
        placeholder="Enter job title..."
        className="w-full p-2 text-lg outline-none bg-transparent"
      />
    </div>
  </div>

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