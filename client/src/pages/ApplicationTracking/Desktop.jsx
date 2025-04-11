import { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import SavedJobCard from "./SavedJobCard";
import Loader from "../Landing/LandingMain/loader"
import AppliedJobCard from "./AppliedJobCard";
import axios from "axios";
import AppliedJobMenuCard from "./AppliedJobMenuCard";
import LeftPanel from "./LeftPanel";

const DesktopView = () => {
  const { user } = useSelector((state) => state.user);
  const [selectedTab, setSelectedTab] = useState("saved");
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedApplied, setAppliedSelect] = useState("");
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
        const appliedJobsResult = await axios.post(
          "https://highimpacttalent.onrender.com/api-v1/application/get-jobs",
          { applicationIds: user.appliedJobs || [] },
          { headers: { "Content-Type": "application/json" } }
        );
        
        if (appliedJobsResult) {
          const applications =
            appliedJobsResult?.data?.applications || [];
          setAppliedJobs(applications);
          if (applications.length > 0) {
            setAppliedSelect(applications[0]);
          }
        } else {
          console.error(
            "Failed to fetch applied jobs:",
            appliedJobsResult.reason
          );
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
    <Box sx={{ bgcolor: "white", minHeight: "100vh", p: isMobile ? 1 : 5 }}>
      <Loader isLoading={isFetching} />
      <Typography
        sx={{
          textAlign: "center",
          color: "#404258",
          fontWeight: "600",
          fontSize: 28,
          fontFamily: "Satoshi,serrif",
          mb: 3,
        }}
      >
        Applications
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          
        }}
      >
        <Box sx={{ width: "70%"}}>
          {selectedApplied != "" ? (
            <LeftPanel Application={selectedApplied} />
          ) : (
            <Typography>No jobs to display</Typography>
          )}
        </Box>

        <Box sx={{ width: "30%" }}>
          {isFetching ? (
            <Typography
              variant="h6"
              color="textSecondary"
              align="center"
              sx={{ mt: 4 }}
            >
              Loading jobs...
            </Typography>
          ) : appliedJobs.length > 0 ? (
            <Grid container gap={2}>
              {appliedJobs.map((job, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={12}
                  key={index}
                  onClick={() => {
                    setAppliedSelect(job);
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  <AppliedJobMenuCard job={job} />
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
  );
};

export default DesktopView;
