import React, { useState, useEffect } from "react";
import {
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
  Avatar,
  Typography,
  Pagination,
  LinearProgress,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Chatbot from "./Chatbot/view";
import { skillsList } from "../../assets/mock";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";

const ResumeSearch = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location: "",
    exp: "",
    skills: [],
    companiesWorkedAt: [],
    jobRoles: "",
    currentCompany: "",
    isConsultant: false,
    instituteName: "",
    yearOfPassout: "",
    workExpCompany: "",
    minWorkExp: "",
    topCompany: false,
    topInstitutes: false,
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
    const { name, value, type, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]:
        type === "checkbox"
          ? checked
          : name === "yearOfPassout"
          ? Number(value) || ""
          : value,
    }));
  };

  const handleSkillsChange = (event, newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, skills: newValue }));
  };

  const handleCompanyChange = (event) => {
    const newCompany = event.target.value.trim().toUpperCase();
    if (event.key === "Enter" && event.target.value.trim() !== "") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        companiesWorkedAt: [...prevFilters.companiesWorkedAt, newCompany],
      }));
      event.target.value = "";
    }
  };

  const removeCompany = (companyToRemove) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      companiesWorkedAt: prevFilters.companiesWorkedAt.filter(
        (company) => company !== companyToRemove
      ),
    }));
  };

  const handleSubmit = () => {
    fetchResumes(filters);
  };

  useEffect(() => {
    fetchResumes(filters);
  }, [filters]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentResumes = resumes.slice(startIndex, endIndex);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  

  return (
    <Box
      style={{
        background: "#fff",
        fontFamily: "Poppins, sans-serif",
        padding: "20px",
        borderRadius: "8px",
        display: "flex",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          width: "30%",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "600", fontFamily: "Satoshi", fontSize: 24 }}
        >
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Location"
              name="location"
              fullWidth
              value={filters.location}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Experience (Years)"
              name="exp"
              type="number"
              fullWidth
              value={filters.exp}
              onChange={handleFilterChange}
              inputProps={{ min: 0 }} // Prevent negative values
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={skillsList}
              value={filters.skills}
              onChange={handleSkillsChange}
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
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Add Company"
              fullWidth
              onKeyDown={handleCompanyChange}
              placeholder="Press Enter to add"
            />
            <Stack direction="row">
              {filters.companiesWorkedAt.map((company, index) => (
                <Chip
                  key={index}
                  label={company}
                  onDelete={() => removeCompany(company)}
                />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Job Role"
              name="jobRoles"
              fullWidth
              value={filters.jobRoles}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Current Company"
              name="currentCompany"
              fullWidth
              value={filters.currentCompany}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Institute Name"
              name="instituteName"
              fullWidth
              value={filters.instituteName}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Year of Passout"
              name="yearOfPassout"
              fullWidth
              value={filters.yearOfPassout}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Work Experience Company"
              name="workExpCompany"
              fullWidth
              value={filters.workExpCompany}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Minimum Work Experience"
              name="minWorkExp"
              fullWidth
              value={filters.minWorkExp}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isConsultant"
                  checked={filters.isConsultant}
                  onChange={handleFilterChange}
                />
              }
              label="Consultant"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="topCompany"
                  checked={filters.topCompany}
                  onChange={handleFilterChange}
                />
              }
              label="Top Company"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="topInstitutes"
                  checked={filters.topInstitutes}
                  onChange={handleFilterChange}
                />
              }
              label="Top Institutes"
            />
          </Grid>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "80%" }}>
        <Box sx={{display:"flex",justifyContent:"space-between",width:"60%"}}>
        <Box sx={{alignItems:"flex-start",justifyContent:"flex-start",ml:2}}>
          <Chatbot setFilters={setFilters} />
        </Box>
        <Typography
          variant="h4"
          gutterBottom
          style={{ fontWeight: "600", textAlign: "center",ml:15 }}
        >
          Resume Search
        </Typography>
        </Box>

        {loading && (
          <LinearProgress color="primary" style={{ marginBottom: "10px" }} />
        )}
        <Box container spacing={3} marginTop={2}>
          {currentResumes.map((resume) => (
            <Box
              sx={{
                display: "flex",
                border: 2,
                flexDirection: "column",
                mb: 2,
                borderColor: "grey.50",
                borderRadius: 4,
              }}
            >
              <Card
                sx={{
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  padding: "10px",
                  backgroundColor: "#fff",
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "#3f51b5" }}>
                      {resume.personalInformation.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {resume.personalInformation.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                        {resume.personalInformation.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                        {resume.personalInformation.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                        {resume.professionalDetails.currentDesignation} at{" "}
                        {resume.professionalDetails.currentCompany}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {resume.professionalDetails.about}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 2, display: "flex", flexWrap: "wrap", rowGap: 1 }}
                  >
                    {resume.skills.map((skill, index) => (
                      <Chip key={index} label={skill} variant="outlined" />
                    ))}
                  </Stack>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "8px",
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(`/resumesearch/viewresume/${resume._id}`)
                    }
                  >
                    View Profile
                  </Button>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
        <Pagination
          count={Math.ceil(resumes.length / recordsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
        />
      </Box>
    </Box>
  );
};

export default ResumeSearch;
