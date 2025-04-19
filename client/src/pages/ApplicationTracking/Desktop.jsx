import { useEffect, useState } from "react";
import { Grid, Box, Typography, ButtonGroup, Button } from "@mui/material";
import { useSelector } from "react-redux";
import SavedJobCard from "./SavedJobCard";
import Loader from "../Landing/LandingMain/loader";
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
  const [activeTab, setActiveTab] = useState("inProgress");
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
          const applications = appliedJobsResult?.data?.applications || [];
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

  const filteredJobs =
    activeTab === "inProgress"
      ? appliedJobs.filter((job) => job.status !== "Not Progressing")
      : appliedJobs.filter((job) => job.status === "Not Progressing");

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

      {/* Tab Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            borderRadius: "50px",
            p: 0.5,
            bgcolor: "#f5f5f5",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            width: "fit-content",
          }}
        >
          <Button
            onClick={() => setActiveTab("inProgress")}
            variant="contained"
            disableElevation
            sx={{
              borderRadius: "30px",
              px: 4,
              py: 1.2,
              fontWeight: 600,
              fontSize: "16px",
              transition: "all 0.3s ease",
              background:
                activeTab === "inProgress"
                  ? "linear-gradient(135deg, #007FFF, #00C6FF)"
                  : "transparent",
              color: activeTab === "inProgress" ? "white" : "#555",
              boxShadow:
                activeTab === "inProgress"
                  ? "0 0 12px rgba(0, 198, 255, 0.5)"
                  : "none",
              "&:hover": {
                background:
                  activeTab === "inProgress"
                    ? "linear-gradient(135deg, #007FFF, #00C6FF)"
                    : "#e0e0e0",
              },
            }}
          >
            In Progress
          </Button>
          <Button
            onClick={() => setActiveTab("notProgressing")}
            variant="contained"
            disableElevation
            sx={{
              borderRadius: "30px",
              px: 4,
              py: 1.2,
              fontWeight: 600,
              fontSize: "16px",
              transition: "all 0.3s ease",
              background:
                activeTab === "notProgressing"
                  ? "linear-gradient(135deg, #FF5F6D, #FFC371)"
                  : "transparent",
              color: activeTab === "notProgressing" ? "white" : "#555",
              boxShadow:
                activeTab === "notProgressing"
                  ? "0 0 12px rgba(255, 99, 71, 0.5)"
                  : "none",
              "&:hover": {
                background:
                  activeTab === "notProgressing"
                    ? "linear-gradient(135deg, #FF5F6D, #FFC371)"
                    : "#e0e0e0",
              },
            }}
          >
            Not Progressing
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* <Box sx={{ width: "70%"}}>
          {selectedApplied != "" ? (
            <LeftPanel Application={selectedApplied} />
          ) : (
            <Typography>No jobs to display</Typography>
          )}
        </Box> */}

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {isFetching ? (
            <Typography
              variant="h6"
              color="textSecondary"
              align="center"
              sx={{ mt: 4 }}
            >
              Loading jobs...
            </Typography>
          ) : filteredJobs.length > 0 ? (
            <Grid
              container
              spacing={2}
              justifyContent="center"
              sx={{ maxWidth: "1200px", mx: "auto" }}
            >
              {filteredJobs.map((job, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4} // 3 in a row on md and up
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
