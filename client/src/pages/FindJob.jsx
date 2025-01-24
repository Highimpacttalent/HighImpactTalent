import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import Header from "../components/Header.jsx";
import { experience } from "../utils/data";
import { CustomButton, JobCard, ListBox } from "../components";
import { apiRequest } from "../utils";
import { useSelector } from "react-redux";

const FindJobs = () => {
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

  useEffect(() => {
    fetchJobs();
  }, [sort, filterJobTypes, selectedCheckbox, filterExp, page]);

  return (
    <div className="bg-gray-100">
      <div className="relative bg-cover bg-center h-fit  flex items-center justify-center">
        <div className=" rounded-xl w-full max-w-4xl mx-auto px-5 py-5">
          <div className="text-center mb-2 max-[550px]:hidden py-2">
            <p className="text-[#1176DB] font-bold italic text-4xl md:text-6xl">
              Find your Next Opportunity
            </p>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-between   rounded-full">
            <div
              className={`flex w-full items-center bg-white rounded-full shadow-md`}
            >
              <AiOutlineSearch className="text-gray-600 text-xl ml-3" />
              <input
                type="text"
                value={searchKeyword}
                onChange={handleInputChange}
                placeholder="Enter job title..."
                className="capitalize w-full p-3 outline-none bg-transparent text-sm md:text-base"
              />
            </div>
          </div>
        </div>
      </div>
      <div className=" min-h-screen flex gap-4">
        {/* Job Listings */}
        <div className="w-full  px-3">
          <div className="flex items-center justify-end  gap-5 mb-2">
            <div className="flex items-center gap-2">
              {/* <p className="text-base text-gray-600">Sort By:</p> */}
              <ListBox sort={sort} setSort={setSort} />
              <div className="relative ">
                {/* Small box to toggle filters */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 bg-blue-500 text-white rounded shadow-sm focus:outline-none w-[8rem] md:w-[10rem] "
                >
                  Experience
                </button>

                {/* Filters container */}
                {showFilters && (
                  <div className="absolute top-12 left-0 w-64 bg-white shadow-lg rounded-lg z-10">
                    {/* <p className="text-xl font-semibold text-[#1176DB] mb-4 pl-5 pt-4">
                      Filter Search
                    </p> */}
                    <div className="py-4 border-t border-gray-200">
                      <div className="flex pl-5 justify-between items-center mb-4">
                        <p className="flex items-center gap-2 font-semibold text-gray-700">
                          <BsStars />
                          Experience
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 pl-5">
                        <div className="flex flex-col capitalize">
                          {[
                            "All",
                            "1-2 years",
                            "2-6 years",
                            "Over 6 years",
                          ].map((label, index) => (
                            <div
                              key={index}
                              onClick={() => handleCheckboxChange(index)}
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
                                selectedCheckbox === index
                                  ? "bg-blue-100 border-l-4 border-blue-500"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <label>
                                <input
                                  type="checkbox"
                                  checked={selectedCheckbox === index}
                                  onChange={() => {}}
                                  className="hidden"
                                />
                                {label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setShowLikedJobs((prevState) => !prevState);
                  filterLikedJobs();
                }}
                className={`p-2 ${
                  showLikedJobs
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                } rounded shadow-md focus:outline-none`}
              >
                {showLikedJobs ? "All" : "Liked"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredJobs &&
              filteredJobs.length > 0 &&
              filteredJobs.map((job, index) => (
                <JobCard job={job} key={index} />
              ))}
          </div>

          {numPage > page && !isFetching && (
            <div className="w-full flex items-center justify-center pt-10">
              <CustomButton
                title="Load More"
                containerStyles="text-blue-600 py-2 px-6 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600 transition"
                onClick={() => setPage((prevPage) => prevPage + 1)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
