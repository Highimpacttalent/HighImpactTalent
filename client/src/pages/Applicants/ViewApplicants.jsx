import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  InputBase,
  Button,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  useMediaQuery,
  useTheme,
  Checkbox,
  Chip,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import { AiOutlineSearch } from "react-icons/ai";
import { apiRequest } from "../../utils";
import StatusJob from "./StatusJob";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { LinkedIn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ApplicationCard from "./component/ApplicantsCard";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import { useSelector } from "react-redux";

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

const ActionButton = styled(Button)(({ theme, variant: variantProp }) => ({
  fontFamily: "Satoshi",
  fontWeight: 600,
  fontSize: "14px",
  borderRadius: "8px",
  textTransform: "none",
  minHeight: "40px",
  boxShadow: "none",
  transition: "all 0.2s ease-in-out",
  ...(variantProp === "advance" && {
    background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
    },
    "&:disabled": {
      background: "#e0e0e0",
      color: "#9e9e9e",
    },
  }),
  ...(variantProp === "reject" && {
    background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(135deg, #d32f2f 0%, #c62828 100%)",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
    },
    "&:disabled": {
      background: "#e0e0e0",
      color: "#9e9e9e",
    },
  }),
  ...(variantProp === "rejectAll" && {
    background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
    },
  }),
}));

const SelectionChip = styled(Chip)(({ theme }) => ({
  fontFamily: "Satoshi",
  fontWeight: 500,
  fontSize: "13px",
  height: "28px",
  backgroundColor: "#e3f2fd",
  color: "#1976d2",
  border: "1px solid #bbdefb",
  "& .MuiChip-deleteIcon": {
    color: "#1976d2",
    fontSize: "18px",
  },
}));

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
  const [activeStep, setActiveStep] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  const [openBreakdownId, setOpenBreakdownId] = useState(null);
  const [breakdownDialogOpen, setBreakdownDialogOpen] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentUser = useSelector((state) => state.user.user);

  // Bulk selection states
  const [selectedApplications, setSelectedApplications] = useState(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: "",
    title: "",
    message: "",
  });

  // Filter states
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
    setSelectedApplications(new Set()); // Clear selections when changing steps
  };

  useEffect(() => {
    const status = steps[activeStep];
    const filtered = allApplications.filter((app) => app.status === status);
    setApplications(filtered);
    setFilteredApps(filtered);
    setSelectedApplications(new Set()); // Clear selections when step changes
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
        setFilteredApps(matchedApp);
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Something went wrong with resume filtering",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Search error:", err);
      setSnackbar({
        open: true,
        message: "Failed to filter resumes.",
        severity: "error",
      });
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

  // Bulk selection handlers
  const handleApplicationSelect = (applicationId) => {
    const newSelected = new Set(selectedApplications);
    if (newSelected.has(applicationId)) {
      newSelected.delete(applicationId);
    } else {
      newSelected.add(applicationId);
    }
    setSelectedApplications(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedApplications.size === filteredApps.length) {
      setSelectedApplications(new Set());
    } else {
      setSelectedApplications(new Set(filteredApps.map((app) => app._id)));
    }
  };

  const clearSelection = () => {
    setSelectedApplications(new Set());
  };

  // Bulk actions
  const handleBulkAdvance = async () => {
    if (selectedApplications.size === 0) return;

    setBulkActionLoading(true);
    try {
      const response = await axios.put(
        "https://highimpacttalent.onrender.com/api-v1/application/bulk-advance",
        {
          applicationIds: Array.from(selectedApplications),
          user: {
            userId: currentUser._id,
          },
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `${response.data.modifiedCount} applications advanced successfully`,
          severity: "success",
        });

        // Refresh applications
        window.location.reload();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "Failed to advance applications",
        severity: "error",
      });
    } finally {
      setBulkActionLoading(false);
      setSelectedApplications(new Set());
    }
  };

  const handleBulkReject = async () => {
    if (selectedApplications.size === 0) return;

    setBulkActionLoading(true);
    try {
      const response = await axios.put(
        "https://highimpacttalent.onrender.com/api-v1/application/bulk-reject",
        {
          applicationIds: Array.from(selectedApplications),
          user: {
            userId: currentUser._id,
          },
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `${response.data.modifiedCount} applications rejected successfully`,
          severity: "success",
        });

        // Refresh applications
        window.location.reload();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to reject applications",
        severity: "error",
      });
    } finally {
      setBulkActionLoading(false);
      setSelectedApplications(new Set());
    }
  };

  const handleRejectAll = async () => {
    const allApplicationIds = filteredApps.map((app) => app._id);

    setBulkActionLoading(true);
    try {
      const response = await axios.put(
        "https://highimpacttalent.onrender.com/api-v1/application/bulk-reject",
        {
          applicationIds: allApplicationIds,
          user: {
            userId: currentUser._id,
          },
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `All ${response.data.modifiedCount} applications at this stage rejected`,
          severity: "success",
        });

        // Refresh applications
        window.location.reload();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "Failed to reject all applications",
        severity: "error",
      });
    } finally {
      setBulkActionLoading(false);
      setSelectedApplications(new Set());
    }
  };

  const openConfirmDialog = (action, title, message) => {
    setConfirmDialog({ open: true, action, title, message });
  };

  const handleConfirmAction = () => {
    const { action } = confirmDialog;
    setConfirmDialog({ open: false, action: "", title: "", message: "" });

    switch (action) {
      case "advance":
        handleBulkAdvance();
        break;
      case "reject":
        handleBulkReject();
        break;
      case "rejectAll":
        handleRejectAll();
        break;
      default:
        break;
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply filters
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
    setSelectedApplications(new Set()); // Clear selections when filtering
  };

  const clearFilters = () => {
    setFilters({
      experience: "",
      currentJob: "",
      joinConsulting: "",
      openToRelocate: "",
    });
    setFilteredApps(applications);
    setSelectedApplications(new Set());
  };

  const getNextStepName = () => {
    const currentStatus = steps[activeStep];
    const statusFlow = {
      Applied: "Application Viewed",
      "Application Viewed": "Shortlisted",
      Shortlisted: "Interviewing",
      Interviewing: "Hired",
    };
    return statusFlow[currentStatus] || "Next Stage";
  };

  const FiltersContent = (
    <Box sx={{ p: 2, width: isMobile ? 250 : "auto" }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontFamily: "Satoshi", fontWeight: 600 }}
      >
        Filters
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          label="Current Job"
          name="currentJob"
          value={filters.currentJob}
          onChange={handleFilterChange}
          placeholder="Enter job title..."
          size="small"
          sx={{ "& .MuiInputLabel-root": { fontFamily: "Satoshi" } }}
        />
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel sx={{ fontFamily: "Satoshi" }}>Experience</InputLabel>
        <Select
          name="experience"
          value={filters.experience}
          onChange={handleFilterChange}
          label="Experience"
          size="small"
          sx={{ "& .MuiInputLabel-root": { fontFamily: "Satoshi" } }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value={1}>1+ years</MenuItem>
          <MenuItem value={3}>3+ years</MenuItem>
          <MenuItem value={5}>5+ years</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel sx={{ fontFamily: "Satoshi" }}>Join Consulting</InputLabel>
        <Select
          name="joinConsulting"
          value={filters.joinConsulting}
          onChange={handleFilterChange}
          label="Join Consulting"
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Lateral">Lateral</MenuItem>
          <MenuItem value="Out of Campus">Out of Campus</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel sx={{ fontFamily: "Satoshi" }}>Open to Relocate</InputLabel>
        <Select
          name="openToRelocate"
          value={filters.openToRelocate}
          onChange={handleFilterChange}
          label="Open to Relocate"
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={applyFilters}
          sx={{ fontFamily: "Satoshi", fontWeight: 600 }}
        >
          Apply
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={clearFilters}
          sx={{ fontFamily: "Satoshi", fontWeight: 600 }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "white", p: { xs: 2, md: 4 } }}>
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
        <CircularProgress sx={{ display: "block", m: "20px auto" }} />
      )}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      <Box sx={{ p: 0 }}>
        <StatusJob activeStep={activeStep} onStepClick={handleStepClick} />
      </Box>

      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          mt: 4,
        }}
      >
        {/* Filters */}
        <Box
          sx={{
            width: { xs: "100%", md: "25%" },
            pr: { md: 2 },
            mb: { xs: 2, md: 0 },
          }}
        >
          {isMobile ? (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                bgcolor: "grey.300",
                borderRadius: 2,
                p: 0.5,
                ml: 2,
                boxShadow: 3,
                fontFamily: "Poppins",
              }}
            >
              <FilterListIcon />
              <span
                style={{ fontFamily: "Poppins", fontSize: 16, fontWeight: 500 }}
              >
                Filters
              </span>
            </IconButton>
          ) : (
            <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
              {FiltersContent}
            </Paper>
          )}
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            {FiltersContent}
          </Drawer>
        </Box>

        {/* Applications Section */}
        <Box sx={{ width: { xs: "100%", md: "75%" } }}>
          {/* Bulk Actions Header */}
          {filteredApps.length > 0 && (
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0",
              }}
            >
              {/* Selection Info */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: selectedApplications.size > 0 ? 2 : 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<SelectAllIcon />}
                    onClick={handleSelectAll}
                    sx={{
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                      fontSize: "13px",
                      borderRadius: 2,
                      textTransform: "none",
                      borderColor: "#e0e0e0",
                      color: "#666",
                      "&:hover": {
                        borderColor: "#1976d2",
                        color: "#1976d2",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    {selectedApplications.size === filteredApps.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontFamily: "Satoshi",
                      fontWeight: 500,
                    }}
                  >
                    {filteredApps.length} candidate
                    {filteredApps.length !== 1 ? "s" : ""} at{" "}
                    {steps[activeStep]} stage
                  </Typography>
                </Box>

                {selectedApplications.size > 0 && (
                  <SelectionChip
                    label={`${selectedApplications.size} selected`}
                    onDelete={clearSelection}
                    size="small"
                  />
                )}
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {/* Advance Selected */}
                <ActionButton
                  variant="advance"
                  disabled={
                    selectedApplications.size === 0 ||
                    bulkActionLoading ||
                    activeStep === steps.length - 1
                  }
                  onClick={() =>
                    openConfirmDialog(
                      "advance",
                      "Advance Selected Candidates",
                      `Move ${selectedApplications.size} selected candidate${
                        selectedApplications.size !== 1 ? "s" : ""
                      } to "${getNextStepName()}" stage?`
                    )
                  }
                  startIcon={
                    bulkActionLoading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <ArrowForwardIcon />
                    )
                  }
                  sx={{ minWidth: "140px" }}
                >
                  {bulkActionLoading ? "Processing..." : "Advance Selected"}
                </ActionButton>

                {/* Reject Selected */}
                <ActionButton
                  variant="reject"
                  disabled={
                    selectedApplications.size === 0 || bulkActionLoading
                  }
                  onClick={() =>
                    openConfirmDialog(
                      "reject",
                      "Reject Selected Candidates",
                      `Mark ${selectedApplications.size} selected candidate${
                        selectedApplications.size !== 1 ? "s" : ""
                      } as "Not Progressing"?`
                    )
                  }
                  startIcon={<CancelOutlinedIcon />}
                  sx={{ minWidth: "130px" }}
                >
                  Reject Selected
                </ActionButton>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 1, height: "40px" }}
                />

                {/* Reject All */}
                <ActionButton
                  variant="rejectAll"
                  disabled={filteredApps.length === 0 || bulkActionLoading}
                  onClick={() =>
                    openConfirmDialog(
                      "rejectAll",
                      "Reject All at This Stage",
                      `Mark all ${filteredApps.length} candidate${
                        filteredApps.length !== 1 ? "s" : ""
                      } at "${steps[activeStep]}" stage as "Not Progressing"?`
                    )
                  }
                  startIcon={<CancelOutlinedIcon />}
                  sx={{ minWidth: "110px" }}
                >
                  Reject All
                </ActionButton>
              </Box>
            </Paper>
          )}

          {/* Applications Grid */}
          <Grid container spacing={2}>
            {filteredApps.map((app) => (
              <Grid item xs={12} key={app._id}>
                <Box sx={{ position: "relative" }}>
                  {/* Selection Checkbox */}
                  <Checkbox
                    checked={selectedApplications.has(app._id)}
                    onChange={() => handleApplicationSelect(app._id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                    }}
                  />

                  {/* Application Card with Selection Border */}
                  <Box
                    sx={{
                      border: selectedApplications.has(app._id)
                        ? "2px solid #1976d2"
                        : "2px solid transparent",
                      borderRadius: 2,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        border: selectedApplications.has(app._id)
                          ? "2px solid #1565c0"
                          : "2px solid #e0e0e0",
                      },
                    }}
                  >
                    <ApplicationCard
                      app={app}
                      setSelectedBreakdown={setSelectedBreakdown}
                      setBreakdownDialogOpen={setBreakdownDialogOpen}
                      navigate={navigate}
                      markAsViewed={markAsViewed}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {!loading &&
            !error &&
            filteredApps.length === 0 &&
            applications.length > 0 && (
              <Box
                sx={{
                  textAlign: "center",
                  mt: 4,
                  p: 4,
                  bgcolor: "#f8f9fa",
                  borderRadius: 3,
                  border: "1px solid #e9ecef",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Satoshi",
                    fontWeight: 600,
                    color: "#495057",
                    mb: 1,
                  }}
                >
                  No matching applications found
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color: "#6c757d",
                    fontFamily: "Satoshi",
                    mb: 2,
                  }}
                >
                  Try adjusting your filters or search criteria
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 2,
                    fontFamily: "Satoshi",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </Box>
            )}

          {!loading && !error && applications.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                mt: 4,
                p: 4,
                bgcolor: "#f8f9fa",
                borderRadius: 3,
                border: "1px solid #e9ecef",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Satoshi",
                  fontWeight: 600,
                  color: "#495057",
                  mb: 1,
                }}
              >
                No applications at this stage
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6c757d",
                  fontFamily: "Satoshi",
                }}
              >
                There are currently no candidates at the "{steps[activeStep]}"
                stage
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, action: "", title: "", message: "" })
        }
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Satoshi",
            fontWeight: 700,
            fontSize: "20px",
            color: "#24252C",
          }}
        >
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "Satoshi",
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            {confirmDialog.message}
          </Typography>
          {confirmDialog.action === "rejectAll" && (
            <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
              <Typography sx={{ fontFamily: "Satoshi", fontSize: "14px" }}>
                This action cannot be undone. All candidates will be marked as
                "Not Progressing".
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() =>
              setConfirmDialog({
                open: false,
                action: "",
                title: "",
                message: "",
              })
            }
            sx={{
              fontFamily: "Satoshi",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
          <ActionButton
            variant={confirmDialog.action === "advance" ? "advance" : "reject"}
            onClick={handleConfirmAction}
            disabled={bulkActionLoading}
            startIcon={
              bulkActionLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {bulkActionLoading ? "Processing..." : "Confirm"}
          </ActionButton>
        </DialogActions>
      </Dialog>

      {/* Breakdown Dialog */}
      <Dialog
        open={breakdownDialogOpen}
        onClose={() => setBreakdownDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Satoshi",
            fontWeight: 700,
            fontSize: "20px",
            color: "#24252C",
          }}
        >
          Match Score Breakdown
        </DialogTitle>
        <DialogContent dividers>
          <Typography
            component="pre"
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: "13px",
              lineHeight: 1.5,
              color: "#333",
            }}
          >
            {selectedBreakdown}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setBreakdownDialogOpen(false)}
            sx={{
              fontFamily: "Satoshi",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            fontFamily: "Satoshi",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JobApplications;
