import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert, Box } from "@mui/material";
import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const mobileView = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`https://highimpacttalent.onrender.com/api-v1/application/get-allapplication/${user._id}`);
        console.log(res.data.data)
        setApplications(res.data.data);
        console.log(applications)
      } catch (error) {
        setError("Failed to fetch applications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [user._id]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <FaClock color="orange" size={20} />;
      case "accepted":
        return <FaCheckCircle color="green" size={20} />;
      case "rejected":
        return <FaTimesCircle color="red" size={20} />;
      default:
        return <FaClock color="gray" size={20} />;
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
    sx={{
      background: "linear-gradient(135deg, #e3f2fd 30%, #ffffff 90%)",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: 1,
    }}
  >
    <Paper
      elevation={4}
      sx={{
        width: "80%",
        maxWidth: "1000px",
        p: 3,
        borderRadius: 3,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        Application Tracking
      </Typography>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#eeeeee" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Job Title</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Company</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app, index) => (
                <TableRow key={index} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
                  <TableCell>{app.job.jobTitle}</TableCell>
                  <TableCell>{app.company.name}</TableCell>
                  <TableCell>
                    {getStatusIcon(app.status)} {app.status}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </Box>
  );
};

export default mobileView;
