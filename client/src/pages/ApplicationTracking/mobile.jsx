import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Drawer,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import AppliedJobCard from "./AppliedJobCard";
import LeftPanel from "./LeftPanel";
import axios from "axios";

const MobileView = () => {
  const { user } = useSelector((state) => state.user);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedJobData, setSelectedJobData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.post(
          "https://highimpacttalent.onrender.com/api-v1/application/get-jobs",
          { applicationIds: user.appliedJobs || [] },
          { headers: { "Content-Type": "application/json" } }
        );
        setAppliedJobs(response?.data?.applications || []);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    if (user?.appliedJobs?.length) {
      fetchAppliedJobs();
    }
  }, [user]);

  const handleAppliedCardClick = (job) => {
    setSelectedJobData(job);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedJobData(null);
  };

  useEffect(()=>{
    console.log(selectedJobData);
  },[selectedJobData])

  return (
    <Box p={2} bgcolor={"white"}>
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

      <Grid container spacing={2}>
        {appliedJobs.map((job) => (
          <Grid item xs={12} key={job._id}>
            <Box onClick={() => handleAppliedCardClick(job)} sx={{ cursor: "pointer" }}>
              <AppliedJobCard job={job} />
            </Box>
          </Grid>
        ))}
      </Grid>

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
      <Typography variant="body1">Loading job details...</Typography>
    )}
      </Drawer>
    </Box>
  );
};

export default MobileView;
