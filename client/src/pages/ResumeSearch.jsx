import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Select,
  Box,
  InputLabel,
  FormControl,
  Button,
  Chip,
  Grid,
  Card,
  Stack,
  CardContent,
  Typography,
  LinearProgress,
  Autocomplete,
} from "@mui/material";
import { skillsList } from "../assets/mock";

const ResumeSearch = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    exp: "",
    skills: [],
    pastCompanies: "",
    jobRoles: "",
  });

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async (filters = {}) => {
    setLoading(true);
    const response = await fetch(
      "https://highimpacttalent.onrender.com/api-v1/resume/getResume",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      }
    );
    const data = await response.json();
    setResumes(data.data);
    setLoading(false);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSkillsChange = (event, newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, skills: newValue }));
  };

  const handleSubmit = () => {
    fetchResumes(filters);
  };

  return (
    <Box
      style={{
        background: "#fff",
        fontFamily: "Poppins, sans-serif",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        style={{ fontWeight: "600", textAlign: "center" }}
      >
        Resume Search
      </Typography>

      {/* Progress Bar */}
      {loading && (
        <LinearProgress color="primary" style={{ marginBottom: "10px" }} />
      )}

      {/* Filters Section */}
      <Grid container spacing={2} style={{ padding: "20px" }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Location"
            name="location"
            fullWidth
            value={filters.location}
            onChange={handleFilterChange}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Experience</InputLabel>
            <Select
              name="exp"
              value={filters.exp}
              onChange={handleFilterChange}
            >
              <MenuItem value="1">1+</MenuItem>
              <MenuItem value="3">3+</MenuItem>
              <MenuItem value="5">5+</MenuItem>
              <MenuItem value="10">10+</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Past Companies"
            name="pastCompanies"
            fullWidth
            value={filters.pastCompanies}
            onChange={handleFilterChange}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <Autocomplete
              multiple
              options={skillsList} // List of predefined skills
              value={filters.skills} // Selected skills
              onChange={handleSkillsChange} // Update selected skills
              filterSelectedOptions
              disableCloseOnSelect
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills"
                  placeholder="Type a skill"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                  />
                ))
              }
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Job Role"
            name="jobRoles"
            fullWidth
            value={filters.jobRoles}
            onChange={handleFilterChange}
          />
        </Grid>

        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Apply Filters
          </Button>
        </Grid>
      </Grid>

      {/* Display Resumes */}
      <Grid
        container
        spacing={3}
        marginTop={2}
        sx={{ justifyContent: "center" }}
      >
        {resumes.map((resume) => (
          <Grid item xs={12} sm={8} md={10} key={resume._id}>
            <Card
              sx={{
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            >
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  {resume.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  📧 Email: {resume.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  📍 Location: {resume.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  💼 Experience: {resume.experience} years
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ⭐ Rating: {resume.rating}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  🏢 Companies: {resume.companies.join(", ")}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  🔹 Skills: {resume.skills.join(", ")}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  🎯 Job Role: {resume.jobRoles.join(", ")}
                </Typography>

                {/* Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    marginTop: 2,
                    justifyContent: "flex-end",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                      width: "15%",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => window.open(resume.cvUrl)}
                    >
                      View Resume
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ResumeSearch;
