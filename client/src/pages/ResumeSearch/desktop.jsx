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
  useMediaQuery,
  IconButton,
  Drawer,
  useTheme,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AIChatbot from "./AiChatbot/view";
import FilterListIcon from "@mui/icons-material/FilterList";
import ResumeCard from "./ResumeCard/view.jsx";
import Chatbot from "./Chatbot/view";
import { skillsList } from "../../assets/mock";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import { keyframes } from "@emotion/react";

const ResumeSearch = () => {
  const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const filterComponents = (
    <>
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
                <Chip {...getTagProps({ index })} key={option} label={option} />
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
    </>
  );

  return (
    <Box
      sx={{
        background: "#fff",
        fontFamily: "Poppins, sans-serif",
        p: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      {/* Sidebar or Drawer trigger handled inside header */}
      {!isMobile && (
        <Box
          sx={{
            p: 2,
            width: "24%",
            minWidth: 240,
            borderRight: "2px solid #E0E0E0",
          }}
        >
          {filterComponents}
        </Box>
      )}

      {/* Main content */}
      <Box sx={{ flex: 1 }}>
        {/* Header: filter icon, actions, title all in one line on mobile */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {isMobile && (
            <IconButton onClick={toggleDrawer(true)}>
              <FilterListIcon />
            </IconButton>
          )}

          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              flexGrow: 1,
              textAlign: isMobile ? "center" : "left",
            }}
          >
            Resume Search
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <Chatbot setFilters={setFilters} />
            <AIChatbot setFilters={setFilters} /> */}
            {/* Exclusive AI Feature */}
            <Box
              sx={{
                background: "linear-gradient(45deg, #ff6ec4, #7873f5)",
                color: "white",
                px: 2.5,
                py: 1.2,
                borderRadius: 2,
                boxShadow: 4,
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              onClick={() => navigate("/ai-resume")}
            >
              <span role="img" aria-label="star">
                ✨
              </span>
              Try AI Resume Selector
            </Box>
           <Box
              sx={{
                background: "linear-gradient(45deg, #ff6ec4, #7873f5)",
                color: "white",
                px: 2.5,
                py: 1.2,
                borderRadius: 2,
                boxShadow: 4,
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              onClick={() => navigate("/ai-chat")}
            >
              <span role="img" aria-label="star">
                ✨
              </span>
              Ask Koustubh!
            </Box>
          </Box>
        </Box>

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box sx={{ width: 280, p: 2 }}>{filterComponents}</Box>
          </Drawer>
        )}

        {loading && <LinearProgress color="primary" sx={{ mb: 1 }} />}

        <Box container spacing={3} mt={2}>
          {currentResumes.map((resume) => (
            <ResumeCard key={resume._id} resume={resume} />
          ))}
        </Box>

        <Pagination
          count={Math.ceil(resumes.length / recordsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />
      </Box>
    </Box>
  );
};

export default ResumeSearch;
