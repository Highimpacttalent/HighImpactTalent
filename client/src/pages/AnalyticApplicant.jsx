import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../utils";
import {
  Table,
  TableBody,
  Card,
  CardHeader,
  Divider,
  CardContent,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Box,
  Select,
  MenuItem,
  Avatar,
  FormControl,
  InputLabel,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { Email,SyncAlt,BusinessCenter,MonetizationOn,CompareArrows,Group, LinkedIn, Phone, Work,AttachMoney, Business, LocationOn, Description } from "@mui/icons-material";
import "chart.js/auto";
import dayjs from "dayjs";

const ViewAnalytics = ({ jobId }) => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
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
        if (!response.success) throw new Error("Failed to fetch applications");
        setApplications(response.applications);
        setFilteredApps(response.applications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [jobId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

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
          .toLowerCase()
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

  const handleOpenModal = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCandidate(null);
  };

  const processGraphData = () => {
    const weeks = {};
    for (let i = 4; i >= 0; i--) {
      const weekStart = dayjs()
        .subtract(i, "week")
        .startOf("week")
        .format("YYYY-MM-DD");
      weeks[weekStart] = 0;
    }

    applications.forEach((app) => {
      const applicationDate = dayjs(app.createdAt)
        .startOf("week")
        .format("YYYY-MM-DD");
      if (weeks.hasOwnProperty(applicationDate)) {
        weeks[applicationDate]++;
      }
    });

    return {
      labels: Object.keys(weeks).map((date) => dayjs(date).format("MMM D")),
      datasets: [
        {
          label: "Number of Applicants",
          data: Object.values(weeks),
          borderColor: "#1976d2",
          backgroundColor: "rgba(25, 118, 210, 0.2)",
        },
      ],
    };
  };

  const renderPortfolio = selectedCandidate ? (
    <Card sx={{ maxWidth: 700, p: 3, boxShadow: 3, borderRadius: 2, maxHeight: "80vh", overflowY: "auto" }}>
      {/* Header with Avatar and Name */}
      <CardHeader
        avatar={<Avatar src={selectedCandidate.profileUrl} sx={{ width: 80, height: 80 }} />}
        title={
          <Typography variant="h5" fontWeight="bold">
            {selectedCandidate.firstName} {selectedCandidate.lastName}
          </Typography>
        }
        subheader={
          <Typography variant="subtitle1" color="textSecondary">
            {selectedCandidate.currentDesignation} @ {selectedCandidate.currentConsultingCompany || "N/A"}
          </Typography>
        }
      />
      <Divider sx={{ my: 2 }} />
  
      <CardContent>
        {/* Job & Experience Section */}
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Work fontSize="small" color="primary" />
              <Typography variant="body1"><b>Current Role:</b> {selectedCandidate.currentJobRole || "Not specified"}</Typography>
            </Box>
  
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Business fontSize="small" color="primary" />
              <Typography variant="body1"><b>Company:</b> {selectedCandidate.currentCompany || "Not specified"}</Typography>
            </Box>
  
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <MonetizationOn fontSize="small" color="primary" />
              <Typography variant="body1"><b>Salary:</b> ₹{selectedCandidate.currentSalary || "Not specified"}</Typography>
            </Box>
  
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Work fontSize="small" color="primary" />
              <Typography variant="body1"><b>Experience:</b> {selectedCandidate.experience} years</Typography>
            </Box>
          </Grid>
  
          {/* Right Column */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOn fontSize="small" color="primary" />
              <Typography variant="body1"><b>Location:</b> {selectedCandidate.currentLocation || "Not specified"}</Typography>
            </Box>
  
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <CompareArrows fontSize="small" color="primary" />
              <Typography variant="body1"><b>Relocate:</b> {selectedCandidate.openToRelocate || "Not specified"}</Typography>
            </Box>
  
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Group fontSize="small" color="primary" />
              <Typography variant="body1"><b>Consulting:</b> {selectedCandidate.joinConsulting || "Not specified"}</Typography>
            </Box>
          </Grid>
        </Grid>
  
        <Divider sx={{ my: 2 }} />
  
        {/* Contact Details */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Email fontSize="small" color="primary" />
              <Typography variant="body1">
                <a href={`mailto:${selectedCandidate.email}`} style={{ textDecoration: "none", color: "inherit" }}>
                  {selectedCandidate.email}
                </a>
              </Typography>
            </Box>
          </Grid>
  
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Phone fontSize="small" color="primary" />
              <Typography variant="body1">
                <a href={`tel:${selectedCandidate.contactNumber}`} style={{ textDecoration: "none", color: "inherit" }}>
                  {selectedCandidate.contactNumber}
                </a>
              </Typography>
            </Box>
          </Grid>
        </Grid>
  
        <Divider sx={{ my: 2 }} />
  
        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            variant="contained"
            startIcon={<LinkedIn />}
            href={selectedCandidate.linkedinLink}
            target="_blank"
            sx={{ textTransform: "none" }}
          >
            View LinkedIn
          </Button>
  
          <Button
            variant="contained"
            startIcon={<Description />}
            href={selectedCandidate.cvUrl}
            target="_blank"
            sx={{ textTransform: "none", backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
          >
            Download Resume
          </Button>
        </Box>
      </CardContent>
    </Card>
  ) : null;
  

  return (
    <Box sx={{ maxWidth: "90%", margin: "auto", padding: 4 }}>
      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      <Grid container spacing={3} alignItems="stretch">
        {/* Graph Section */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: 2 }}
            >
              Applicants Over Time
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={processGraphData()} />
            </Box>
          </Paper>
        </Grid>

        {/* Filters Section */}
        <Grid item xs={12} md={5}>
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
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={"yes"}>Yes</MenuItem>
                <MenuItem value={"no"}>No</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Applications Table */}
      <TableContainer
        component={Paper}
        sx={{ boxShadow: 4, borderRadius: 2, overflow: "hidden", marginTop: 4 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Candidate Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                LinkedIn
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Resume
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Candidate Profile
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApps.map((app, index) => (
              <TableRow
                key={app._id}
                sx={{ backgroundColor: index % 2 ? "#f9f9f9" : "#fff" }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={app.applicant.profileUrl}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography fontWeight="bold">
                      {app.applicant.firstName} {app.applicant.lastName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    href={app.applicant.linkedinLink}
                    target="_blank"
                  >
                    View LinkedIn
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    href={app.applicant.cvUrl}
                    target="_blank"
                  >
                    View Resume
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(app.applicant)}
                  >
                    View Profile
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Candidate Profile Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
      >
        <DialogContent>
          
            {renderPortfolio}
         
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ViewAnalytics;
