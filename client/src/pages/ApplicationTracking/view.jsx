import { useEffect, useState } from "react";
import { Grid, Box, Typography, Button, Chip, Badge } from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import { CheckCircle, Visibility, Assignment, Person, WorkOutline, Block } from "@mui/icons-material";
import Loader from "../Landing/LandingMain/loader";
import AppliedJobMenuCard from "./AppliedJobMenuCard";

const DesktopView = () => {
  const { user } = useSelector((state) => state.user);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedApplied, setAppliedSelect] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [activeTab, setActiveTab] = useState("inProgress");
  const [activeProcessingStage, setActiveProcessingStage] = useState("ALL");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Processing stages configuration
  const processingStages = [
    { key: "ALL", label: "All", icon: null, color: "#6366f1" },
    { key: "applied", label: "Applied", icon: <CheckCircle />, color: "#10b981" },
    { key: "application viewed", label: "Viewed", icon: <Visibility />, color: "#3b82f6" },
    { key: "shortlisted", label: "Shortlisted", icon: <Assignment />, color: "#f59e0b" },
    { key: "interviewing", label: "Interviewed", icon: <Person />, color: "#8b5cf6" },
    { key: "hired", label: "Hired", icon: <WorkOutline />, color: "#059669" },
  ];

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

  // Get jobs count for each processing stage
  // Get jobs count for each processing stage (case-insensitive)
  const getStageCount = (stageKey) => {
    return appliedJobs.filter((job) => {
      const status = job.status?.toLowerCase();
      if (stageKey === "ALL") {
        return status !== "not progressing";
      }
      return status === stageKey.toLowerCase() && status !== "not progressing";
    }).length;
  };

  // Filter jobs based on active tab and processing stage (case-insensitive)
  const getFilteredJobs = () => {
    let filtered = [];

    if (activeTab === "inProgress") {
      filtered = appliedJobs.filter(
        (job) => job.status?.toLowerCase() !== "not progressing"
      );
      if (activeProcessingStage !== "ALL") {
        filtered = filtered.filter(
          (job) => job.status?.toLowerCase() === activeProcessingStage.toLowerCase()
        );
      }
    } else {
      filtered = appliedJobs.filter(
        (job) => job.status?.toLowerCase() === "not progressing"
      );
    }

    return filtered;
  };  

  const filteredJobs = getFilteredJobs();

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", p: isMobile ? 2 : 4 }}>
      <Loader isLoading={isFetching} />

      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          sx={{
            color: "#1f2937",
            fontWeight: "700",
            fontSize: isMobile ? 24 : 32,
            fontFamily: "Satoshi, serif",
            mb: 1,
          }}
        >
          My Applications
        </Typography>
        <Typography
          sx={{
            color: "#6b7280",
            fontSize: isMobile ? 14 : 16,
            fontFamily: "Poppins",
          }}
        >
          Track your job application progress
        </Typography>
      </Box>

      {/* Main Tab Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            borderRadius: "60px",
            p: 0.75,
            bgcolor: "white",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <Button
            onClick={() => {
              setActiveTab("inProgress");
              setActiveProcessingStage("ALL");
            }}
            variant="contained"
            disableElevation
            startIcon={activeTab === "inProgress" ? <CheckCircle /> : null}
            sx={{
              borderRadius: "50px",
              fontWeight: 600,
              fontFamily: "Poppins",
              fontSize: isMobile ? "13px" : "14px",
              px: isMobile ? 2 : 3,
              py: 1,
              background:
                activeTab === "inProgress"
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "transparent",
              color: activeTab === "inProgress" ? "white" : "#6b7280",
              "&:hover": {
                background:
                  activeTab === "inProgress"
                    ? "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)"
                    : "#f3f4f6",
              },
              textTransform: "none",
              transition: "all 0.3s ease",
            }}
          >
            In Progress ({appliedJobs.filter(job => job.status !== "Not Progressing").length})
          </Button>
          <Button
            onClick={() => setActiveTab("notProgressing")}
            variant="contained"
            disableElevation
            startIcon={activeTab === "notProgressing" ? <Block /> : null}
            sx={{
              borderRadius: "50px",
              fontWeight: 600,
              fontFamily: "Poppins",
              fontSize: isMobile ? "13px" : "14px",
              px: isMobile ? 2 : 3,
              py: 1,
              background:
                activeTab === "notProgressing"
                  ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
                  : "transparent",
              color: activeTab === "notProgressing" ? "white" : "#6b7280",
              "&:hover": {
                background:
                  activeTab === "notProgressing"
                    ? "linear-gradient(135deg, #ff5252 0%, #d63031 100%)"
                    : "#f3f4f6",
              },
              textTransform: "none",
              transition: "all 0.3s ease",
            }}
          >
            Not Progressing ({appliedJobs.filter(job => job.status === "Not Progressing").length})
          </Button>
        </Box>
      </Box>

      {/* Processing Stage Filters - Only show when "In Progress" is active */}
      {activeTab === "inProgress" && (
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: "#374151",
              fontWeight: "600",
              fontSize: isMobile ? 16 : 18,
              fontFamily: "Poppins",
              mb: 2,
              textAlign: "center",
            }}
          >
            Filter by Status
          </Typography>
          
          <Box 
            sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              justifyContent: "center", 
              gap: isMobile ? 1 : 1.5,
              maxWidth: "900px",
              mx: "auto",
            }}
          >
            {processingStages.map((stage) => {
              const count = getStageCount(stage.key);
              const isActive = activeProcessingStage === stage.key;
              
              return (
                <Badge
                  key={stage.key}
                  badgeContent={count}
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: isActive ? "#ffffff" : stage.color,
                      color: isActive ? stage.color : "#ffffff",
                      fontWeight: "600",
                      fontSize: "11px",
                    }
                  }}
                >
                  <Chip
                    icon={stage.icon}
                    label={stage.label}
                    onClick={() => setActiveProcessingStage(stage.key)}
                    variant={isActive ? "filled" : "outlined"}
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: isActive ? "600" : "500",
                      fontSize: isMobile ? "12px" : "13px",
                      px: isMobile ? 0.5 : 1,
                      py: isMobile ? 2.5 : 3,
                      backgroundColor: isActive ? stage.color : "white",
                      color: isActive ? "white" : stage.color,
                      borderColor: stage.color,
                      borderWidth: "2px",
                      "&:hover": {
                        backgroundColor: isActive ? stage.color : `${stage.color}15`,
                        borderColor: stage.color,
                        transform: "translateY(-2px)",
                      },
                      "& .MuiChip-icon": {
                        color: isActive ? "white" : stage.color,
                      },
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  />
                </Badge>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Results Summary */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          sx={{
            color: "#6b7280",
            fontSize: isMobile ? 14 : 16,
            fontFamily: "Poppins",
            fontWeight: "500",
          }}
        >
          {filteredJobs.length > 0 
            ? `Showing ${filteredJobs.length} ${filteredJobs.length === 1 ? 'application' : 'applications'}`
            : 'No applications found'
          }
          {activeTab === "inProgress" && activeProcessingStage !== "ALL" && 
            ` in ${processingStages.find(s => s.key === activeProcessingStage)?.label} stage`
          }
        </Typography>
      </Box>

      {/* Job Cards Grid */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {isFetching ? (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ 
                fontFamily: "Poppins",
                fontSize: isMobile ? 16 : 18,
              }}
            >
              Loading your applications...
            </Typography>
          </Box>
        ) : filteredJobs.length > 0 ? (
          <Grid
            container
            spacing={isMobile ? 2 : 3}
            justifyContent="flex-start"
            sx={{
              maxWidth: "1400px",
              mx: "auto",
              minHeight: "400px",
            }}
          >
            {filteredJobs.map((job, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={index}
                onClick={() => setAppliedSelect(job)}
                sx={{ 
                  cursor: "pointer",
                  "& > *": {
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                    }
                  }
                }}
              >
                <AppliedJobMenuCard job={job} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DesktopView;