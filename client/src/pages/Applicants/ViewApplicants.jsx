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
  CardHeader,
  Chip,
  CardContent,
  CardActions,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import { AiOutlineSearch } from "react-icons/ai";
import { apiRequest } from "../../utils";
import StatusJob from "./StatusJob";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { LinkedIn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const computeMatchScore = (job, applicant) => {
  // Weights
  const weights = {
    exp: 25,
    skills: 40,
    loc: 10,
    type: 10,
    mode: 10,
    sal: 5,
  };

  // Sub‑scores
  let expScore = 0,
    skillsScore = 0,
    locScore = 0,
    typeScore = 0,
    modeScore = 0,
    salScore = 0;

  // 1) Experience
  if (job.experience) {
    const ratio = Math.min(applicant.experience / job.experience, 1);
    expScore = ratio * weights.exp;
  } else {
    expScore = weights.exp;
  }

  // 2) Skills Match (40%)
  if (Array.isArray(job.skills) && job.skills.length > 0) {
    // primary: match against job.skills
    const matches = job.skills.filter((js) =>
      (applicant.skills || []).some(
        (ast) => ast.toLowerCase() === js.toLowerCase()
      )
    );
    skillsScore = (matches.length / job.skills.length) * weights.skills;
  } else {
    // no skills *or* requirements specified → full marks
    skillsScore = weights.skills;
  }

  // 3) Location / Relocate
  if (job.jobLocation) {
    if (
      applicant.currentLocation?.toLowerCase() ===
        job.jobLocation.toLowerCase() ||
      applicant.openToRelocate?.toLowerCase() === "yes"
    ) {
      locScore = weights.loc;
    }
  } else {
    locScore = weights.loc;
  }

  // 4) Work Type
  if (job.workType) {
    if ((applicant.preferredWorkTypes || []).includes(job.workType)) {
      typeScore = weights.type;
    }
  } else {
    typeScore = weights.type;
  }

  // 5) Work Mode
  if (job.workMode) {
    if ((applicant.preferredWorkModes || []).includes(job.workMode)) {
      modeScore = weights.mode;
    }
  } else {
    modeScore = weights.mode;
  }

  // 6) Salary Expectation
  if (job.salary) {
    if (
      !applicant.expectedMinSalary ||
      parseInt(applicant.expectedMinSalary, 10) <= parseInt(job.salary, 10)
    ) {
      salScore = weights.sal;
    }
  } else {
    salScore = weights.sal;
  }

  const totalScore = Math.round(
    expScore + skillsScore + locScore + typeScore + modeScore + salScore
  );

  // Detailed console.log for analysis
  const breakdown = `
Candidate: ${applicant.firstName} ${applicant.lastName}
Job Criteria:
  • Required Exp: ${job.experience ?? "[none specified]"}
  • Skills: ${job.skills?.length ? job.skills.join(", ") : "Not Provided"}
  • Location: ${job.jobLocation ?? "[none specified]"}
  • Work Type: ${job.workType || "[none specified]"}
  • Work Mode: ${job.workMode || "[none specified]"}
  • Salary: ${job.salary ?? "[none specified]"}

Applicant Profile:
  • Exp: ${applicant.experience}
  • Skills: ${(applicant.skills || []).join(", ") || "[none]"}
  • Current Location: ${applicant.currentLocation}
  • Open to Relocate: ${applicant.openToRelocate}
  • Preferred Work Types: ${
    (applicant.preferredWorkTypes || []).join(", ") || "[none]"
  }
  • Preferred Work Modes: ${
    (applicant.preferredWorkModes || []).join(", ") || "[none]"
  }
  • Expected Min Salary: ${applicant.expectedMinSalary || "[none]"}

Score by Category:
  • Experience: ${expScore.toFixed(1)} / ${weights.exp}
  • Skills:     ${skillsScore.toFixed(1)} / ${weights.skills}
  • Location:   ${locScore.toFixed(1)} / ${weights.loc}
  • Work Type:  ${typeScore.toFixed(1)} / ${weights.type}
  • Work Mode:  ${modeScore.toFixed(1)} / ${weights.mode}
  • Salary:     ${salScore.toFixed(1)} / ${weights.sal}

→ Total Match Score: ${totalScore}%
`;

  return { totalScore, breakdown };
};

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
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0); // Default first step
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  const [openBreakdownId, setOpenBreakdownId] = useState(null);
  const [breakdownDialogOpen, setBreakdownDialogOpen] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState("");
  
  // Filter states (moved from ViewAnalytics)
  const [filters, setFilters] = useState({
    experience: "",
    currentJob: "",
    joinConsulting: "",
    openToRelocate: "",
  });

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

        // enrich each application with matchScore
        const enriched = response.applications.map((app) => {
          // invoke computeMatchScore here
          const { totalScore, breakdown } = computeMatchScore(
            app.job,
            app.applicant
          );

          return {
            ...app,
            matchScore: totalScore,
            matchBreakdown: breakdown.trim(),
          };
        });

        setAllApplications(enriched);
        setApplications(enriched);
        setFilteredApps(enriched);
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
    setFilteredApps(filtered); // Also update filteredApps when switching steps
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
        const matchedIds = data.matchedCandidates.map((c) => c.userId);

        const matchedApp = applications.filter((app) =>
          matchedIds.includes(app.applicant._id)
        );

        if (matchedApp) {
          setFilteredApps(matchedApp); // Use filteredApps instead
        } else {
          setFilteredApps([]); // No match found
        }
      } else {
        alert(data.message || "Something went wrong with resume filtering");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Failed to filter resumes.");
    }
  };

  const restoreSearch = async () => {
    setFilteredApps(applications);
    setSearchKeyword("");
  };

  const markAsViewed = async (applicationId) => {
    try {
      await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/application/update-status",
        {
          applicationId,
          status: "Application Viewed",
        }
      );
    } catch (err) {
      console.error("Error marking application as viewed:", err);
    }
  };

  // Handle filter changes (from ViewAnalytics)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply filters (from ViewAnalytics)
  const applyFilters = () => {
    let filtered = applications;
    if (filters.experience) {
      filtered = filtered.filter(
        (app) => app.applicant.experience >= filters.experience
      );
    }
    if (filters.currentJob) {
      filtered = filtered.filter((app) =>
        app.applicant.currentJobRole
          ?.toLowerCase()
          .includes(filters.currentJob.toLowerCase())
      );
    }
    if (filters.joinConsulting) {
      filtered = filtered.filter(
        (app) => app.applicant.joinConsulting === filters.joinConsulting
      );
    }
    if (filters.openToRelocate) {
      filtered = filtered.filter(
        (app) => app.applicant.openToRelocate === filters.openToRelocate
      );
    }
    setFilteredApps(filtered);
  };

  const clearFilters = () => {
    setFilters({
      experience: "",
      currentJob: "",
      joinConsulting: "",
      openToRelocate: "",
    });
    setFilteredApps(applications);
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

      <Box sx={{ p: 0 }}>
        <StatusJob activeStep={activeStep} onStepClick={handleStepClick} />
      </Box>

      {/* Main content */}
      <Box sx={{ display: "flex", mt: 4 }}>
        {/* Left side - Filters */}
        <Box sx={{ width: "25%", pr: 2 }}>
          <Paper sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: 2 }}
            >
              Filters
            </Typography>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <TextField
                label="Current Job"
                name="currentJob"
                value={filters.currentJob}
                onChange={handleFilterChange}
                placeholder="Enter job title..."
              />
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Experience</InputLabel>
              <Select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                label="Experience"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={1}>1+ years</MenuItem>
                <MenuItem value={3}>3+ years</MenuItem>
                <MenuItem value={5}>5+ years</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Join Consulting</InputLabel>
              <Select
                name="joinConsulting"
                value={filters.joinConsulting}
                onChange={handleFilterChange}
                label="Join Consulting"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={"Lateral"}>Lateral</MenuItem>
                <MenuItem value={"Out of Campus"}>Out of Campus</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Open to Relocate</InputLabel>
              <Select
                name="openToRelocate"
                value={filters.openToRelocate}
                onChange={handleFilterChange}
                label="Open to Relocate"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={"yes"}>Yes</MenuItem>
                <MenuItem value={"no"}>No</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={clearFilters}
              >
                Clear
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Right side - Search & Applications */}
        <Box sx={{ width: "75%" }}>
          {/* Search Bar */}
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRadius: "50px",
              boxShadow: 3,
              width: "100%",
              mb: 3,
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
                onClick={restoreSearch}
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

          {/* Applications Grid */}
          {!loading && !error && applications.length > 0 && (
            <Grid container spacing={2}>
              {filteredApps.map((app) => (
                <Grid item xs={12} sm={6} md={4} key={app._id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                  >
                    {/* Header: Avatar, Name, Match Chip + Donut */}
                    <CardHeader
                      avatar={
                        <Avatar
                          src={app.applicant.profileUrl}
                          sx={{ width: 56, height: 56 }}
                        />
                      }
                      title={
                        <Typography variant="subtitle1" fontWeight="600">
                          {app.applicant.firstName} {app.applicant.lastName}
                        </Typography>
                      }
                      subheader={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {/* Donut */}
                          <Box position="relative" display="inline-flex">
                            <CircularProgress
                              variant="determinate"
                              value={app.matchScore}
                              size={40}
                              thickness={4}
                              sx={{
                                color:
                                  app.matchScore > 75
                                    ? "success.main"
                                    : app.matchScore > 50
                                    ? "warning.main"
                                    : "error.main",
                              }}
                            />
                            <Box
                              top={0}
                              left={0}
                              bottom={0}
                              right={0}
                              position="absolute"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Typography variant="caption" fontWeight="700">
                                {app.matchScore}%
                              </Typography>
                            </Box>
                          </Box>

                          {/* Chip */}
                          <Chip
                            label={
                              app.matchScore > 75
                                ? "Excellent Fit"
                                : app.matchScore > 50
                                ? "Good Fit"
                                : "Fair Fit"
                            }
                            size="small"
                            sx={{
                              bgcolor:
                                app.matchScore > 75
                                  ? "success.light"
                                  : app.matchScore > 50
                                  ? "warning.light"
                                  : "error.light",
                              color:
                                app.matchScore > 75
                                  ? "success.dark"
                                  : app.matchScore > 50
                                  ? "warning.dark"
                                  : "error.dark",
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      }
                      action={
                        <IconButton
                          aria-label="Match breakdown"
                          onClick={() => {
                            setSelectedBreakdown(app.matchBreakdown);
                            setBreakdownDialogOpen(true);
                          }}
                        >
                          <InfoOutlinedIcon />
                        </IconButton>
                      }
                    />

                    {/* Body: Key Details */}
                    <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Experience:</strong> {app.applicant.experience}{" "}
                        yrs
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Relocate:</strong>{" "}
                        {app.applicant.openToRelocate}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Join Consulting:</strong>{" "}
                        {app.applicant.joinConsulting}
                      </Typography>
                      <Typography
                        variant="body2"
                        display="flex"
                        alignItems="center"
                      >
                        <strong>LinkedIn:</strong>
                        <IconButton
                          size="small"
                          href={app.applicant.linkedinLink}
                          target="_blank"
                          sx={{ ml: 0.5 }}
                        >
                          <LinkedIn fontSize="small" />
                        </IconButton>
                      </Typography>
                    </CardContent>

                    {/* Actions */}
                    <CardActions sx={{ justifyContent: "center", pb: 2 }}>
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
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* Show message when no results after filtering */}
          {!loading && !error && filteredApps.length === 0 && applications.length > 0 && (
            <Box sx={{ textAlign: "center", mt: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
              <Typography variant="h6">No matching applications found</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Try adjusting your filters or search criteria
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ mt: 2 }}
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Breakdown Dialog */}
      <Dialog
        open={breakdownDialogOpen}
        onClose={() => setBreakdownDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Match Score Breakdown</DialogTitle>
        <DialogContent dividers>
          <Typography
            component="pre"
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
            }}
          >
            {selectedBreakdown}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBreakdownDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobApplications;