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
  Alert,
  Paper,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { skillsList } from "../../assets/mock";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import SearchIcon from "@mui/icons-material/Search";
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
  const [error, setError] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [numberOfResumes, setNumberOfResumes] = useState(5);
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

  const fetchRegularResumes = async (filters = {}) => {
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
    setResumes(data.data || []);
    setLoading(false);
  };

  const handleRAGSearch = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/resume/getResume",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_description: jobDescription,
            numberOfResumes: numberOfResumes
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResumes(data.data || []);
        setCurrentPage(1);
      } else {
        setError(data.message || "Failed to fetch resumes");
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search resumes. Please try again.");
    } finally {
      setLoading(false);
    }
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

  const handleFilterSubmit = () => {
    fetchRegularResumes(filters);
  };

  useEffect(() => {
    fetchRegularResumes();
  }, []);

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

  const ResumeCard = ({ resume }) => {
    const formatExperience = (exp) => {
      if (exp && exp.includes("year")) return exp;
      return exp ? `${exp} years` : "Not specified";
    };

    // Check if this is a RAG result (has retrieval_score) or regular result
    const isRAGResult = resume.retrieval_score !== undefined;

    return (
      <Card 
        sx={{ 
          mb: 2, 
          p: 2, 
          border: "1px solid #E0E0E0",
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 3,
            transform: "translateY(-2px)"
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "between", alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                {isRAGResult ? 
                  (resume.personal_info?.name || "Name not available") :
                  (resume.name || "Name not available")
                }
              </Typography>
              
              {isRAGResult && resume.retrieval_score && (
                <Chip 
                  label={`Match: ${(resume.retrieval_score * 100).toFixed(1)}%`}
                  color="primary"
                  size="small"
                  sx={{ mb: 1 }}
                />
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1, flexWrap: "wrap" }}>
                {((isRAGResult ? resume.personal_info?.location : resume.location)) && (
                  <>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {isRAGResult ? resume.personal_info.location : resume.location}
                    </Typography>
                  </>
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1, flexWrap: "wrap" }}>
                {((isRAGResult ? resume.professional_profile?.current_role : resume.currentJobRole)) && (
                  <>
                    <WorkIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {isRAGResult ? 
                        `${resume.professional_profile.current_role}${resume.professional_profile?.current_company ? ` at ${resume.professional_profile.current_company}` : ''}` :
                        `${resume.currentJobRole}${resume.currentCompany ? ` at ${resume.currentCompany}` : ''}`
                      }
                    </Typography>
                  </>
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2, flexWrap: "wrap" }}>
                {((isRAGResult ? resume.personal_info?.contact?.email : resume.email)) && (
                  <>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {isRAGResult ? resume.personal_info.contact.email : resume.email}
                    </Typography>
                  </>
                )}
              </Box>

              {((isRAGResult ? resume.professional_profile?.total_experience_stated : resume.experience)) && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Experience:</strong> {formatExperience(
                    isRAGResult ? resume.professional_profile.total_experience_stated : resume.experience
                  )}
                </Typography>
              )}

              {((isRAGResult ? resume.education?.[0] : resume.education)) && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Education:</strong> {
                    isRAGResult ? 
                      `${resume.education[0].institution}${resume.education[0].class_of ? ` (${resume.education[0].class_of})` : ''}` :
                      resume.education
                  }
                </Typography>
              )}

              {((isRAGResult ? resume.skills : resume.technicalSkills)) && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Skills:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(isRAGResult ? resume.skills : resume.technicalSkills)?.slice(0, 6).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {(isRAGResult ? resume.skills : resume.technicalSkills)?.length > 6 && (
                      <Chip
                        label={`+${(isRAGResult ? resume.skills : resume.technicalSkills).length - 6} more`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
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
            inputProps={{ min: 0 }}
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
          <Button variant="contained" color="primary" onClick={handleFilterSubmit}>
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
      {/* Sidebar */}
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
        {/* Header */}
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
        </Box>

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box sx={{ width: 280, p: 2 }}>{filterComponents}</Box>
          </Drawer>
        )}

        {/* AI Search Box - Centered and Compact */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textAlign: "center"
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            🤖 AI-Powered Resume Search
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Enter a job description below and let our AI find the most relevant candidates for you!
          </Typography>
          
          <Box sx={{ maxWidth: "600px", margin: "0 auto" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={7}>
                <TextField
                  label="Job Description"
                  multiline
                  rows={3}
                  fullWidth
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="e.g., Looking for a React developer with 3+ years experience..."
                  variant="filled"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: 1,
                    "& .MuiFilledInput-root": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="filled" sx={{ backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 1 }}>
                  <InputLabel>Count</InputLabel>
                  <Select
                    value={numberOfResumes}
                    label="Count"
                    onChange={(e) => setNumberOfResumes(e.target.value)}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleRAGSearch}
                  disabled={loading}
                  sx={{ 
                    height: "56px",
                    backgroundColor: "#fff",
                    color: "#667eea",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#f5f5f5"
                    }
                  }}
                  startIcon={<SearchIcon />}
                >
                  {loading ? "..." : "Search"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Instructional Message */}
        {resumes.length === 0 && !loading && (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              color: "text.secondary"
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2, 
                fontWeight: 300,
                animation: `${bounce} 2s ease-in-out infinite`
              }}
            >
              👆
            </Typography>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              Ready to find your perfect candidates?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter a detailed job description in the prompt box above and let our AI do the magic!
            </Typography>
          </Box>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading Indicator */}
        {loading && <LinearProgress color="primary" sx={{ mb: 1 }} />}

        {/* Results */}
        <Box container spacing={3} mt={2}>
          {currentResumes.map((resume, index) => (
            <ResumeCard key={resume._id || index} resume={resume} />
          ))}
        </Box>

        {/* Pagination */}
        {resumes.length > recordsPerPage && (
          <Pagination
            count={Math.ceil(resumes.length / recordsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ResumeSearch;