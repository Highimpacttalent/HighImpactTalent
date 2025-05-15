import { useMediaQuery, useTheme } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/system";
import { Typography, Button, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserInfocard from "./components/ProfileCard";
import mobileView from "../FindJob/mobile";
import { AiOutlineDown } from "react-icons/ai";
import JobCardRecriter from "./components/JobCardMob";

const ProfileSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Jobs");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const dispatch = useDispatch();
  const [userInfo, setUser] = useState();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://highimpacttalent.onrender.com/api-v1/user/get",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
            params: { id: user?.id },
          }
        );
        setUser(response?.data?.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [user?.token, user?.id]);

  const desktopView = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: { xs: 0, sm: 0, md: 4, lg: 4 },
        backgroundColor: "white",
      }}
    >
      <Box className="w-full rounded-xl p-8 space-y-8">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <UserInfocard userInfo={userInfo} />
        </Box>
      </Box>
    </Box>
  );

  const MobileView = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "white",
        py: 5,
        px: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontWeight: 500,
            color: "#000000CC",
            fontSize: "16px",
          }}
        >
          Recruiter Profile
        </Typography>

        {/* Wrap button + dropdown in a relative container */}
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
              borderRadius: 2,
            }}
            onClick={() => setSortMenuOpen(!sortMenuOpen)}
          >
            {selectedFilter} <AiOutlineDown />
          </Button>

          {sortMenuOpen && (
            <Box
              sx={{
                position: "absolute", // ✅ absolute instead of relative
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

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}
      >
        <UserInfocard userInfo={userInfo} />
      </Box>
      <Box>
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontWeight: 500,
            color: "#000000CC",
            fontSize: "16px",
            mt: 4,
          }}
        >
          Jobs by recruiter
        </Typography>

        <Box sx={{mt:4}}>
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
    </Box>
  );

  return <Box>{isMobile ? MobileView : desktopView}</Box>;
};

export default ProfileSection;
