import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Drawer,
  IconButton,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import AppliedJobCard from "./AppliedJobCard";
import AppliedJobMenuCard from "./AppliedJobMenuCard";
import LeftPanel from "./LeftPanel";
import axios from "axios";

const MobileView = () => {
  const { user } = useSelector((state) => state.user);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedJobData, setSelectedJobData] = useState(null);
  const [activeTab, setActiveTab] = useState("inProgress");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!user?.appliedJobs?.length) return;
      setIsFetching(true);
      try {
        const response = await axios.post(
          "https://highimpacttalent.onrender.com/api-v1/application/get-jobs",
          { applicationIds: user.appliedJobs },
          { headers: { "Content-Type": "application/json" } }
        );
        setAppliedJobs(response?.data?.applications || []);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchAppliedJobs();
  }, [user]);

  const handleAppliedCardClick = (job) => {
    setSelectedJobData(job);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedJobData(null);
  };

  const filteredJobs =
    activeTab === "inProgress"
      ? appliedJobs.filter((job) => job.status !== "Not Progressing")
      : appliedJobs.filter((job) => job.status === "Not Progressing");

  return (
    <Box p={2} bgcolor={"white"}>
      <Typography
        sx={{
          textAlign: "center",
          color: "#404258",
          fontWeight: "600",
          fontSize: 28,
          fontFamily: "Satoshi,serif",
          mb: 3,
        }}
      >
        Applications
      </Typography>

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
              px: 3,
              py: 1,
              fontWeight: 600,
              fontSize: "14px",
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
              px: 3,
              py: 1,
              fontWeight: 600,
              fontSize: "14px",
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

      {isFetching ? (
        <Typography textAlign="center" color="textSecondary" mt={3}>
          Loading jobs...
        </Typography>
      ) : filteredJobs.length > 0 ? (
        <Grid container spacing={2}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} key={job._id}>
              <Box
                onClick={() => handleAppliedCardClick(job)}
                sx={{ cursor: "pointer" }}
              >
                <AppliedJobMenuCard job={job} />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center" mt={4} color="textSecondary">
          No jobs found.
        </Typography>
      )}

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            height: "80vh",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            overflow: "auto",
          },
        }}
      >
        <Box display="flex" justifyContent="flex-end" p={1}>
          <IconButton onClick={closeDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        {selectedJobData ? (
          <LeftPanel Application={selectedJobData} />
        ) : (
          <Typography variant="body1" textAlign="center" mt={2}>
            Loading job details...
          </Typography>
        )}
      </Drawer>
    </Box>
  );
};

export default MobileView;
