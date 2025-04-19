import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Card,
  Typography,
  IconButton,
  InputBase,
} from "@mui/material";
import { styled } from "@mui/system";
import ViewAnalytics from "../AnalyticApplicant";
import { AiOutlineSearch } from "react-icons/ai";
import { apiRequest } from "../../utils";
import StatusJob from "./StatusJob";
import axios from "axios"
import { AiOutlineClose } from "react-icons/ai";
import { LinkedIn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const JobApplications = () => {
  const steps = [
    "Applied",
    "Application Viewed",
    "Shortlisted",
    "Interviewing",
    "Hired",
  ];
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0); // Default first step
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  const [resumeLinks, setResumeLinks] = useState({});
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await apiRequest({
          url: `application/get-applications/${jobId}`,
          method: "GET",
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch applications");
        }

        setApplications(response.applications);
        setAllApplications(response.applications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  useEffect(() => {
    const status = steps[activeStep];
    const filtered = allApplications.filter((app) => app.status === status);
    setApplications(filtered);
  }, [activeStep, allApplications]);

  const handleSearchClick = async () => {
    if (!searchKeyword.trim()) return;

    const cdnUrls = applications.map((app) => ({
      userId: app.applicant._id,
      cdnUrl: app.applicant.cvUrl,
    }));

    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/ai/filter-resume",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recruiterPrompt: searchKeyword,
            cdnUrls: cdnUrls,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data?.matchedCandidates) {
        console.log(applications);
        console.log(data);
        const matchedIds = data.matchedCandidates.map((c) => c.userId);

        const matchedApp = applications.filter((app) =>
          matchedIds.includes(app.applicant._id)
        );

        if (matchedApp) {
          setApplications(matchedApp); // Replace all with only filtered one
        } else {
          setApplications([]); // No match found
        }
      } else {
        alert(data.message || "Something went wrong with resume filtering");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Failed to filter resumes.");
    }
  };

  const restore = async () => {
    setApplications(allApplications);
  };

  const markAsViewed = async (applicationId) => {
    console.log(applicationId)
    try {
      await axios.post("https://highimpacttalent.onrender.com/api-v1/application/update-status", {
        applicationId,
        status: "Application Viewed",
      });
    } catch (err) {
      console.error("Error marking application as viewed:", err);
    }
  };

  return (
    <Box sx={{ bgcolor: "white", p: 4 }}>
      <Typography
        sx={{
          textAlign: "center",
          mt: 2,
          color: "#24252C",
          fontFamily: "Satoshi",
          mb: 4,
          fontWeight: 700,
          fontSize: "30px",
        }}
      >
        Job Applications
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          sx={{
            bgcolor: "#3C7EFC",
            py: 2,
            px: 4,
            borderRadius: 50,
            fontFamily: "Satoshi",
            fontWeight: 700,
            fontSize: "16px",
            textTransform: "none",
            mb: 4,
          }}
          onClick={() => setShowAnalytics(!showAnalytics)}
        >
          {showAnalytics ? "Close Analytics" : "View Analytics"}
        </Button>
      </Box>

      {showAnalytics ? (
        <ViewAnalytics jobId={jobId} />
      ) : (
        <>
          {loading && (
            <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
          )}
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          {!loading && !error && applications.length === 0 && (
            <Typography align="center">
              No applications found for this job.
            </Typography>
          )}
          {/* Search Bar */}
          <Box sx={{ mx: "auto", mt: 3, px: 2, mb: 3 }}>
            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
                borderRadius: "50px",
                boxShadow: 3,
                width: "100%",
                maxWidth: 1000,
                mx: "auto",
              }}
            >
              <IconButton sx={{ color: "gray" }}>
                <AiOutlineSearch fontSize="24px" />
              </IconButton>
              <InputBase
                sx={{ flex: 1, fontSize: "1.1rem", ml: 1 }}
                placeholder="Tell us what kind of candidate you're searching for and our AI powered search will find the best match..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              {/* Cross icon appears only if search is active */}
              {searchKeyword && (
                <IconButton
                  onClick={() => {
                    restore();
                    setSearchKeyword("");
                  }}
                >
                  <AiOutlineClose fontSize="20px" />
                </IconButton>
              )}
              <Button
                variant="contained"
                sx={{
                  borderRadius: "50px",
                  backgroundColor: "#1A73E8",
                  color: "white",
                  px: 3,
                  ml: 1,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#1669D8" },
                }}
                onClick={handleSearchClick}
              >
                Search
              </Button>
            </Paper>
          </Box>
          <Box sx={{ p: 4 }}>
            <StatusJob activeStep={activeStep} onStepClick={handleStepClick} />
          </Box>
          {!loading && !error && applications.length > 0 && (
            <Grid
              container
              sx={{ gap: { sm: 1, xs: 1, md: 0, lg: 0 }, columnGap: 2 }}
            >
              {applications.map((app, index) => (
                <Grid item xs={12} sm={6} md={3} key={app._id}>
                  <Card
                    sx={{
                      border: "1px solid grey",
                      borderRadius: 4,
                      p: 2,
                      height: "350px",
                      width: "320px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={2}
                      mb={2}
                    >
                      <Avatar
                        src={app.applicant?.profileUrl}
                        sx={{ width: 90, height: 90 }}
                      />
                      <Box>
                        <Typography fontWeight="bold">
                          {app.applicant.firstName} {app.applicant.lastName}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Box sx={{ width: "78%" }}>
                        <Typography variant="body2" mb={0.5}>
                          <strong>Experience:</strong>{" "}
                          {app.applicant.experience} years
                        </Typography>
                        <Typography variant="body2" mb={0.5}>
                          <strong>Join Consulting:</strong>{" "}
                          {app.applicant.joinConsulting}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Open to Relocate:</strong>{" "}
                          {app.applicant.openToRelocate}
                        </Typography>
                        <Typography variant="body2" mb={1}>
                          <strong>Social:</strong>
                          <Button href={app.applicant.linkedinLink}>
                            <LinkedIn />
                          </Button>
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      mt={2}
                      display="flex"
                      gap={1}
                      flexWrap="wrap"
                      justifyContent="center"
                    >
                      <Button
                        variant="contained"
                        role="link"
                        color="primary"
                        sx={{
                          borderRadius: 16,
                          px: 2,
                          py: 1,
                          fontFamily: "Satoshi",
                          textTransform: "none",
                        }}
                        size="small"
                        onClick={async () => {
                          if (app.status === "Applied") {
                            try {
                              // Mark the application as viewed
                              await markAsViewed(app._id);
                        
                              // Navigate to the profile view
                              navigate("/view-profile", {
                                state: { applicant: app.applicant, status: app.status, applicationId: app._id },
                              });
                            } catch (error) {
                              console.error("Error marking application as viewed:", error);
                              alert("An error occurred while marking the application as viewed.");
                            }
                          } else {
                            // If the status is not 'Applied', just navigate
                            navigate("/view-profile", {
                              state: { applicant: app.applicant, status: app.status, applicationId: app._id },
                            });
                          }
                        }}
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="contained"
                        role="link"
                        color="primary"
                        sx={{
                          borderRadius: 16,
                          px: 2,
                          py: 1,
                          fontFamily: "Satoshi",
                          textTransform: "none",
                        }}
                        size="small"
                        onClick={async () => {
                          await markAsViewed(app._id); // Mark the application as viewed
                          window.open(app.applicant.cvUrl, "_blank"); // Open resume in new tab
                        }}
                      >
                        View Resume
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default JobApplications;
