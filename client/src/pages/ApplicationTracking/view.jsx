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

      {/* Professional Tab Navigation */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", mb: 4 }}>
        {/* Parent Tabs */}
        <Box 
          sx={{ 
            display: "flex",
            borderBottom: "1px solid #e5e7eb",
            mb: 3,
            justifyContent: "center",
          }}
        >
          <Box
            onClick={() => {
              setActiveTab("inProgress");
              setActiveProcessingStage("ALL");
            }}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              px: 3,
              py: 1.5,
              cursor: "pointer",
              borderBottom: activeTab === "inProgress"
                ? "3px solid #1976d2"
                : "3px solid transparent",
              transition: "all 0.3s ease",
              backgroundColor: activeTab === "inProgress" ? "#f0f7ff" : "transparent",
              "&:hover": {
                backgroundColor: activeTab === "inProgress" ? "#e3f2fd" : "#f8fafc",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: activeTab === "inProgress" ? "600" : "500",
                fontSize: isMobile ? 14 : 16,
                color: activeTab === "inProgress" ? "#1976d2" : "#6b7280",
              }}
            >
              In Progress
            </Typography>
            <Chip
              label={appliedJobs.filter(job => job.status !== "Not Progressing").length}
              size="small"
              sx={{
                backgroundColor: activeTab === "inProgress" ? "#1976d2" : "#e5e7eb",
                color: activeTab === "inProgress" ? "white" : "#6b7280",
                fontWeight: "600",
                fontSize: "12px",
                height: "20px",
                "& .MuiChip-label": {
                  px: 1,
                }
              }}
            />
          </Box>

          <Box
            onClick={() => setActiveTab("notProgressing")}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              px: 3,
              py: 1.5,
              cursor: "pointer",
              borderBottom: activeTab === "notProgressing"
                ? "3px solid #dc2626"
                : "3px solid transparent",
              transition: "all 0.3s ease",
              backgroundColor: activeTab === "notProgressing" ? "#fef2f2" : "transparent",
              "&:hover": {
                backgroundColor: activeTab === "notProgressing" ? "#fee2e2" : "#f8fafc",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: activeTab === "notProgressing" ? "600" : "500",
                fontSize: isMobile ? 14 : 16,
                color: activeTab === "notProgressing" ? "#dc2626" : "#6b7280",
              }}
            >
              Not Progressing
            </Typography>
            <Chip
              label={appliedJobs.filter(job => job.status === "Not Progressing").length}
              size="small"
              sx={{
                backgroundColor: activeTab === "notProgressing" ? "#dc2626" : "#e5e7eb",
                color: activeTab === "notProgressing" ? "white" : "#6b7280",
                fontWeight: "600",
                fontSize: "12px",
                height: "20px",
                "& .MuiChip-label": {
                  px: 1,
                }
              }}
            />
          </Box>
        </Box>

        {/* Sub Tabs - Only show when "In Progress" is active */}
        {activeTab === "inProgress" && (
          <Box>
            <Typography
              sx={{
                color: "#374151",
                fontWeight: "600",
                fontSize: isMobile ? 14 : 16,
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
                gap: 0,
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                p: 1,
                border: "1px solid #e5e7eb",
              }}
            >
              {processingStages.map((stage) => {
                const count = getStageCount(stage.key);
                const isActive = activeProcessingStage === stage.key;
                
                return (
                  <Box
                    key={stage.key}
                    onClick={() => setActiveProcessingStage(stage.key)}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                      px: isMobile ? 1.5 : 2,
                      py: 1,
                      cursor: "pointer",
                      borderRadius: "6px",
                      transition: "all 0.3s ease",
                      backgroundColor: isActive ? "white" : "transparent",
                      boxShadow: isActive ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
                      border: isActive ? "1px solid #e5e7eb" : "1px solid transparent",
                      "&:hover": {
                        backgroundColor: isActive ? "white" : "#f1f5f9",
                      },
                      minWidth: isMobile ? "auto" : "100px",
                      justifyContent: "center",
                    }}
                  >
                    {stage.icon && (
                      <Box sx={{ 
                        color: isActive ? stage.color : "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        fontSize: isMobile ? "16px" : "18px",
                      }}>
                        {stage.icon}
                      </Box>
                    )}
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: isActive ? "600" : "500",
                        fontSize: isMobile ? "12px" : "13px",
                        color: isActive ? stage.color : "#6b7280",
                      }}
                    >
                      {stage.label}
                    </Typography>
                    <Chip
                      label={count}
                      size="small"
                      sx={{
                        backgroundColor: isActive ? stage.color : "#e5e7eb",
                        color: isActive ? "white" : "#6b7280",
                        fontWeight: "600",
                        fontSize: "11px",
                        height: "18px",
                        "& .MuiChip-label": {
                          px: 0.5,
                        }
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

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