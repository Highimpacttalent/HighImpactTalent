import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Alert } from "@mui/material";
import JobCardRecriter from "./components/JobCardR";

const JobPosted = () => {
  const { user } = useSelector((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
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
        setJobs(data.companies.jobPosts);
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

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", position: "relative" }}>
      {/* Fixed Header Section */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "white",
          zIndex: 10,
          borderBottom: "1px solid #f0f0f0",
          py: 3,
          px: 4,
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: "#24252C",
              fontFamily: "Satoshi",
              fontWeight: 700,
              fontSize: "30px",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Manage Your Job Posts
          </Typography>

          <Button
            variant="contained"
            sx={{
              bgcolor: "#3C7EFC",
              py: 1.5,
              px: 3,
              borderRadius: 50,
              fontFamily: "Satoshi",
              fontWeight: 700,
              fontSize: "16px",
              textTransform: "none",
              boxShadow: "0 2px 8px rgba(60, 126, 252, 0.2)",
              "&:hover": {
                bgcolor: "#3C7EFC",
                boxShadow: "0 4px 12px rgba(60, 126, 252, 0.3)",
              },
            }}
            onClick={() => {
              navigate("/upload-a-job");
            }}
          >
            + Post New Job
          </Button>
        </Box>
      </Box>

      {jobs.length === 1 && jobs[0]?.status === "draft" && (
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            mt: 3,
            mb: 1,
            px: 4,
          }}
        >
          <Alert
            severity="info"
            sx={{
              backgroundColor: "#E6F0FF",
              color: "#1E3A8A",
              border: "1px solid #B3D4FF",
              fontFamily: "Satoshi",
              fontWeight: 500,
            }}
          >
            Your job is posted but still hidden from candidates. Use the{" "}
            <strong>three-dot menu</strong> on the job card to make it live and
            start attracting top talent.
          </Alert>
        </Box>
      )}

      {/* Main Content Area */}
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: 4,
          pt: 2,
          pb: 4,
        }}
      >
        <div className="flex flex-col md:flex-row min-h-screen text-gray-900">
          {/* Job List */}
          <div
            className={`md:w-1/2 transition-all duration-300 ease-in-out ${
              selectedJob ? "md:w-1/2" : "md:w-full"
            }`}
            style={{
              paddingRight: selectedJob ? "16px" : "0",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                }}
              >
                <Typography
                  sx={{
                    color: "#3C7EFC",
                    fontFamily: "Satoshi",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  Loading jobs...
                </Typography>
              </Box>
            ) : jobs.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {jobs.map((job, index) => (
                  <Box key={job.id || index}>
                    <JobCardRecriter
                      job={job}
                      setSelectedJob={setSelectedJob}
                      selectedJob={selectedJob}
                      fetchJobs={fetchJobs}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#24252C",
                    fontFamily: "Satoshi",
                    fontSize: "18px",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  No job posts yet
                </Typography>
                <Typography
                  sx={{
                    color: "#6B7280",
                    fontFamily: "Satoshi",
                    fontSize: "14px",
                    fontWeight: 400,
                  }}
                >
                  Click "Post New Job" to create your first job listing
                </Typography>
              </Box>
            )}
          </div>

          {/* Job Details Panel (if selectedJob exists) */}
          {selectedJob && (
            <div className="md:w-1/2 border-l border-gray-200 pl-6">
              {/* This would contain job details if your JobCardRecriter component shows details */}
            </div>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default JobPosted;
