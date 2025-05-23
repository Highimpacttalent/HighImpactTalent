import { useEffect, useState } from "react";
import { Grid, Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../Landing/LandingMain/loader";
import AppliedJobMenuCard from "./AppliedJobMenuCard";

const DesktopView = () => {
  const { user } = useSelector((state) => state.user);
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
        const response = await axios.post(
          "https://highimpacttalent.onrender.com/api-v1/application/get-jobs",
          { applicationIds: user.appliedJobs || [] },
          { headers: { "Content-Type": "application/json" } }
        );

        const applications = response?.data?.applications || [];
        setAppliedJobs(applications);
        if (applications.length > 0) {
          setAppliedSelect(applications[0]);
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchJobs();
  }, [user]);

  const filteredJobs =
    activeTab === "inProgress"
      ? appliedJobs.filter((job) => job.status !== "Not Progressing")
      : appliedJobs.filter((job) => job.status === "Not Progressing");

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", p: isMobile ? 2 : 5 }}>
      <Loader isLoading={isFetching} />

      <Typography
        sx={{
          textAlign: "center",
          color: "#404258",
          fontWeight: "600",
          fontSize: 28,
          fontFamily: "Satoshi,serif",
          mb: 4,
        }}
      >
        Applications
      </Typography>

      {/* Tab Buttons */}
     {/* Tab Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            borderRadius: "50px",
            p: 0.5,
            bgcolor: "#f5f5f5",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Button
            onClick={() => setActiveTab("inProgress")}
            variant="contained"
            disableElevation
            sx={{
              borderRadius: "30px",
              fontWeight: 600,
              fontFamily: "Poppins",
              fontSize: "14px",
              background:
                activeTab === "inProgress"
                  ? "#03A9F4B2"
                  : "transparent",
              color: activeTab === "inProgress" ? "white" : "#555",
              "&:hover": {
                background:
                  activeTab === "inProgress"
                    ? "linear-gradient(135deg, #007FFF, #00C6FF)"
                    : "#e0e0e0",
              },
              textTransform: "none",
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
              fontWeight: 600,
              fontFamily: "Poppins",
              fontSize: "14px",
              background:
                activeTab === "notProgressing"
                  ? "linear-gradient(135deg, #FF5F6D, #FFC371)"
                  : "transparent",
              color: activeTab === "notProgressing" ? "white" : "#555",
              textTransform: "none",
            }}
          >
            Not Progressing
          </Button>
        </Box>
      </Box>

      {/* Job Cards Grid */}
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
            spacing={3}
            justifyContent="flex-start"
            sx={{
              maxWidth: "1200px",
              mx: "auto",
              minHeight: "400px", // Makes sure the grid area has a stable height even for 1 card
            }}
          >
            {filteredJobs.map((job, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                onClick={() => setAppliedSelect(job)}
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
  );
};

export default DesktopView;
