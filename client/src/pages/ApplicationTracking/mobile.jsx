import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button
} from "@mui/material";
import { useSelector } from "react-redux";
import AppliedJobMenuCard from "./AppliedJobMenuCard";
import axios from "axios";

const MobileView = () => {
  const { user } = useSelector((state) => state.user);
  const [appliedJobs, setAppliedJobs] = useState([]);
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
          fontSize: {xs: "24px", sm: "24px",md: "28px"},
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

      {isFetching ? (
        <Typography textAlign="center" color="textSecondary" mt={3}>
          Loading jobs...
        </Typography>
      ) : filteredJobs.length > 0 ? (
        <Grid container spacing={2}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} key={job._id}>
                <AppliedJobMenuCard job={job} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center" mt={4} color="textSecondary">
          No jobs found.
        </Typography>
      )}

    </Box>
  );
};

export default MobileView;
