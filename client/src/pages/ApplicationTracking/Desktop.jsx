import { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import SavedJobCard from "./SavedJobCard";
import AppliedJobCard from "./AppliedJobCard";
import axios from "axios";

const DesktopView = () => {
  const { user } = useSelector((state) => state.user);
  const [selectedTab, setSelectedTab] = useState("saved");
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;

      setIsFetching(true);
      try {
        const [savedJobsResult, appliedJobsResult] = await Promise.allSettled([
          axios.post("https://highimpacttalent.onrender.com/api-v1/jobs/get-jobs", 
            { jobIds: user.likedJobs || [] }, 
            { headers: { "Content-Type": "application/json" } }
          ),
          axios.post("https://highimpacttalent.onrender.com/api-v1/application/get-jobs", 
            { applicationIds: user.appliedJobs || [] }, 
            { headers: { "Content-Type": "application/json" } }
          ),
        ]);
      
        if (savedJobsResult.status === "fulfilled") {
          setSavedJobs(savedJobsResult.value?.data?.data || []);
        } else {
          console.error("Failed to fetch saved jobs:", savedJobsResult.reason);
        }
      
        if (appliedJobsResult.status === "fulfilled") {
          setAppliedJobs(appliedJobsResult.value?.data?.applications || []);
        } else {
          console.error("Failed to fetch applied jobs:", appliedJobsResult.reason);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchJobs();
  }, [user]); // Fetch only once when the component mounts

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", p: isMobile ? 1 : 5 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ maxWidth: "xl", mx: "auto", mt: 6, px: 2, display: "flex", gap: 3 }}>
          {/* Left Section - Tabs */}
          <Box sx={{ width: "25%", p: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
              <Box
                onClick={() => setSelectedTab("saved")}
                sx={{
                  px: 3,
                  py: 1,
                  cursor: "pointer",
                  bgcolor: selectedTab === "saved" ? "#3F81FF14" : "white",
                  borderRadius: 2,
                  fontWeight: "bold",
                  width: "80%",
                }}
              >
                Saved Jobs
              </Box>
              <Box
                onClick={() => setSelectedTab("applied")}
                sx={{
                  px: 3,
                  py: 1,
                  cursor: "pointer",
                  bgcolor: selectedTab === "applied" ? "#3F81FF14" : "white",
                  borderRadius: 2,
                  fontWeight: "bold",
                  width: "80%",
                }}
              >
                Applied Jobs
              </Box>
            </Box>
          </Box>

          {/* Right Section - Job Cards */}
          <Box sx={{ flex: 0.95, p: 2 }}>
            {isFetching ? (
              <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
                Loading jobs...
              </Typography>
            ) : (selectedTab === "saved" ? savedJobs : appliedJobs).length > 0 ? (
              <Grid container spacing={3} gap={2}>
                {(selectedTab === "saved" ? savedJobs : appliedJobs).map((job, index) => (
                  <Grid item xs={12} sm={6} md={12} key={index}>
                    {selectedTab === "saved" ? <SavedJobCard job={job} /> : <AppliedJobCard job={job} />}
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  No jobs found.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DesktopView;
