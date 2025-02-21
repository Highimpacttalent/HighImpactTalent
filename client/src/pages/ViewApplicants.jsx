import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../utils";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Avatar,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import ViewAnalytics from "./AnalyticApplicant";
import { styled } from "@mui/system";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#1976d2",
  color: "white",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f5f5f5",
  },
}));

const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleViewResume = (id, cvUrl) => {
    setResumeLinks((prev) => ({ ...prev, [id]: cvUrl }));
  };

  return (
    <Box sx={{ maxWidth: "90%", margin: "auto", padding: 4 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
        Job Applications
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setShowAnalytics(!showAnalytics)} // Show analytics when clicked
      >
        View Analytics
      </Button>
    </Box>

    {showAnalytics ? (
      <ViewAnalytics jobId={jobId}/> // Conditionally render the ViewAnalytics component
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
          <Typography align="center">No applications found for this job.</Typography>
        )}
        {!loading && !error && applications.length > 0 && (
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Candidate Name</StyledTableCell>
                  <StyledTableCell>LinkedIn URL</StyledTableCell>
                  <StyledTableCell>Current Job</StyledTableCell>
                  <StyledTableCell>Join Consulting</StyledTableCell>
                  <StyledTableCell>Open to Relocate</StyledTableCell>
                  <StyledTableCell>Experience</StyledTableCell>
                  <StyledTableCell>Resume</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app, index) => (
                  <StyledTableRow key={app._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={app.applicant.profileUrl} sx={{ width: 40, height: 40 }} />
                    <Typography fontWeight="bold">{app.applicant.firstName} {app.applicant.lastName}</Typography>
                  </Box>
                </TableCell>
                    <TableCell>
                      <Link
                        to={app.applicant.linkedinLink}
                        style={{
                          textDecoration: "none",
                          color: "blue",
                          fontWeight: "bold",
                        }}
                      >
                        Link
                      </Link>
                    </TableCell>
                    <TableCell>{app.applicant.currentJobRole}</TableCell>
                    <TableCell>{app.applicant.joinConsulting}</TableCell>
                    <TableCell>{app.applicant.openToRelocate}</TableCell>
                    <TableCell>{app.applicant.experience} years</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() =>
                          handleViewResume(app._id, app.applicant.cvUrl)
                        }
                      >
                        View Resume
                      </Button>
                      {resumeLinks[app._id] && (
                        <Typography variant="body2" color="primary" sx={{ marginTop: 1 }}>
                          <a
                            href={resumeLinks[app._id]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open Resume
                          </a>
                        </Typography>
                      )}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </>
    )}
  </Box>
);
};
export default JobApplications;
