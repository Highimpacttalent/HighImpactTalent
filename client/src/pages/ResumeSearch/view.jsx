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
  Divider,
  Container,
  InputAdornment,
  Fade,
  Collapse,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { skillsList } from "../../assets/mock";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { keyframes } from "@emotion/react";

const ResumeSearch = () => {
  const fadeInUp = keyframes`
    from { 
      opacity: 0; 
      transform: translateY(24px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  `;

  const slideIn = keyframes`
    from { 
      opacity: 0; 
      transform: translateX(-20px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  `;

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [numberOfResumes, setNumberOfResumes] = useState(5);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
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
            numberOfResumes: numberOfResumes,
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
  const recordsPerPage = 6;

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentResumes = resumes.slice(startIndex, endIndex);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const ResumeCard = ({ resume, index }) => {
    const [openDrawer, setOpenDrawer] = useState(false);

    const formatExperience = (exp) => {
      if (exp && exp.includes("year")) return exp;
      return exp ? `${exp} years` : "Not specified";
    };

    const isRAGResult = resume.retrieval_score !== undefined;

    return (
      <>
        <Fade in={true} timeout={600 + index * 100}>
          <Card
            sx={{
              height: "100%",
              border: "1px solid #f5f5f5",
              borderRadius: "16px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backgroundColor: "#ffffff",
              "&:hover": {
                borderColor: "#e0e0e0",
                boxShadow: "0 8px 40px rgba(0, 0, 0, 0.08)",
                transform: "translateY(-4px)",
              },
              position: "relative",
              overflow: "visible",
            }}
          >
            {isRAGResult && resume.retrieval_score && (
              <Box
                sx={{
                  position: "absolute",
                  top: -8,
                  right: 16,
                  backgroundColor: "#000000",
                  color: "white",
                  px: 2,
                  py: 0.5,
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  zIndex: 1,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
              >
                {(resume.retrieval_score * 100).toFixed(0)}% Match
              </Box>
            )}

            <CardContent sx={{ p: 3 }}>
              {/* Top section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 3,
                  mb: 3,
                }}
              >
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    color: "#6c757d",
                  }}
                >
                  <PersonIcon sx={{ fontSize: 24 }} />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#212529",
                      fontSize: "1.1rem",
                      mb: 0.5,
                      lineHeight: 1.3,
                    }}
                  >
                    {isRAGResult
                      ? resume.personal_info?.name || "Name not available"
                      : resume.name || "Name not available"}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6c757d",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {isRAGResult
                      ? resume.professional_profile?.current_role
                      : resume.currentJobRole}{" "}
                    {(isRAGResult
                      ? resume.professional_profile?.current_company
                      : resume.currentCompany) &&
                      ` at ${
                        isRAGResult
                          ? resume.professional_profile.current_company
                          : resume.currentCompany
                      }`}
                  </Typography>
                </Box>
              </Box>

              {/* Quick Info */}
              <Stack spacing={2.5}>
                {(isRAGResult
                  ? resume.personal_info?.location
                  : resume.location) && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: "#6c757d" }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#495057", fontWeight: 500 }}
                    >
                      {isRAGResult
                        ? resume.personal_info.location
                        : resume.location}
                    </Typography>
                  </Box>
                )}

                {(isRAGResult
                  ? resume.professional_profile?.total_experience_stated
                  : resume.experience) && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TrendingUpIcon sx={{ fontSize: 18, color: "#6c757d" }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#495057", fontWeight: 500 }}
                    >
                      {formatExperience(
                        isRAGResult
                          ? resume.professional_profile.total_experience_stated
                          : resume.experience
                      )}
                    </Typography>
                  </Box>
                )}

                {(isRAGResult ? resume.education?.[0] : resume.education) && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <SchoolIcon sx={{ fontSize: 18, color: "#6c757d" }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#495057", fontWeight: 500 }}
                    >
                      {isRAGResult
                        ? `${resume.education[0].institution}${
                            resume.education[0].class_of
                              ? ` (${resume.education[0].class_of})`
                              : ""
                          }`
                        : resume.education}
                    </Typography>
                  </Box>
                )}
              </Stack>

              {/* Skills */}
              {(isRAGResult ? resume.skills : resume.technicalSkills) && (
                <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #f1f3f4" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: "#495057",
                      fontSize: "0.875rem",
                    }}
                  >
                    Skills
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {(isRAGResult ? resume.skills : resume.technicalSkills)
                      ?.slice(0, 4)
                      .map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #e9ecef",
                            color: "#495057",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            height: 28,
                            "&:hover": {
                              backgroundColor: "#e9ecef",
                            },
                          }}
                        />
                      ))}
                    {(isRAGResult ? resume.skills : resume.technicalSkills)
                      ?.length > 4 && (
                      <Chip
                        label={`+${
                          (isRAGResult ? resume.skills : resume.technicalSkills)
                            .length - 4
                        }`}
                        size="small"
                        sx={{
                          backgroundColor: "#212529",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 28,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              )}

              {/* View Resume Button */}
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#000000" }}
                  color="primary"
                  onClick={() => setOpenDrawer(true)}
                >
                  View Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Drawer - Full Resume Preview */}
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <Box
            sx={{
              width: { xs: "100vw", sm: 600, md: 700 },
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {resume.personal_info?.name}
              </Typography>
              <IconButton onClick={() => setOpenDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Scrollable content */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
              {/* Contact */}
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Contact
              </Typography>
              <Stack spacing={1} mb={2}>
                {resume.personal_info?.contact?.email && (
                  <Typography>
                    Email: {resume.personal_info.contact.email}
                  </Typography>
                )}
                {resume.personal_info?.contact?.phone && (
                  <Typography>
                    Phone: {resume.personal_info.contact.phone}
                  </Typography>
                )}
                {resume.personal_info?.contact?.linkedin && (
                  <Typography>
                    LinkedIn: {resume.personal_info.contact.linkedin}
                  </Typography>
                )}
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* Professional Profile */}
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Professional Profile
              </Typography>
              <Typography variant="body2" mb={2}>
                {resume.professional_profile?.current_role} at{" "}
                {resume.professional_profile?.current_company} (
                {resume.professional_profile?.total_experience_stated})
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* Education */}
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Education
              </Typography>
              <Stack spacing={1} mb={2}>
                {resume.education?.map((edu, i) => (
                  <Typography key={i} variant="body2">
                    {edu.institution} {edu.class_of ? `(${edu.class_of})` : ""}
                  </Typography>
                ))}
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* Work Experience */}
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Work Experience
              </Typography>
              <Box>
                {resume.work_experience?.map((exp, i) => (
                  <Box key={i} mb={2}>
                    <Typography variant="body2" fontWeight={600}>
                      {exp.role} @ {exp.company} ({exp.duration})
                    </Typography>
                    <ul style={{ marginTop: 4, paddingLeft: 16 }}>
                      {exp.responsibilities?.map((resp, j) => (
                        <li key={j}>
                          <Typography variant="body2">{resp}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Skills */}
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Skills
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {resume.skills?.map((skill, i) => (
                  <Chip key={i} label={skill} size="small" />
                ))}
              </Box>
            </Box>

            {/* Fixed bottom PDF viewer button */}
            {resume.metadata?.resume_url && (
              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid #e0e0e0",
                  backgroundColor: "white",
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    // Instead of redirect, open inline PDF viewer
                    window.open(resume.metadata.resume_url, "_blank");
                  }}
                >
                  Open Resume PDF
                </Button>
              </Box>
            )}
          </Box>
        </Drawer>
      </>
    );
  };

  const filterComponents = (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <TuneIcon sx={{ color: "#6c757d", fontSize: 20 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#212529",
              fontSize: "1rem",
            }}
          >
            Filters
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={toggleDrawer(false)} sx={{ color: "#6c757d" }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Stack spacing={3}>
        <TextField
          label="Location"
          name="location"
          fullWidth
          size="small"
          value={filters.location}
          onChange={handleFilterChange}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              fontSize: "0.9rem",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#6c757d",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#212529",
              },
            },
            "& .MuiInputLabel-root": {
              fontSize: "0.9rem",
              "&.Mui-focused": {
                color: "#212529",
              },
            },
          }}
        />

        <TextField
          label="Experience (Years)"
          name="exp"
          type="number"
          fullWidth
          size="small"
          value={filters.exp}
          onChange={handleFilterChange}
          inputProps={{ min: 0 }}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              fontSize: "0.9rem",
            },
          }}
        />

        <Autocomplete
          multiple
          options={skillsList}
          value={filters.skills}
          onChange={handleSkillsChange}
          filterSelectedOptions
          disableCloseOnSelect
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Skills"
              placeholder="Select skills"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  fontSize: "0.9rem",
                },
              }}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                sx={{
                  backgroundColor: "#f8f9fa",
                  color: "#495057",
                  fontWeight: 500,
                }}
              />
            ))
          }
        />

        <Box>
          <TextField
            label="Add Company"
            fullWidth
            size="small"
            onKeyDown={handleCompanyChange}
            placeholder="Press Enter to add"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                fontSize: "0.9rem",
              },
            }}
          />
          {filters.companiesWorkedAt.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {filters.companiesWorkedAt.map((company, index) => (
                <Chip
                  key={index}
                  label={company}
                  onDelete={() => removeCompany(company)}
                  size="small"
                  sx={{
                    backgroundColor: "#f8f9fa",
                    color: "#495057",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        <TextField
          label="Job Role"
          name="jobRoles"
          fullWidth
          size="small"
          value={filters.jobRoles}
          onChange={handleFilterChange}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              fontSize: "0.9rem",
            },
          }}
        />

        <TextField
          label="Current Company"
          name="currentCompany"
          fullWidth
          size="small"
          value={filters.currentCompany}
          onChange={handleFilterChange}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              fontSize: "0.9rem",
            },
          }}
        />

        <TextField
          label="Institute Name"
          name="instituteName"
          fullWidth
          size="small"
          value={filters.instituteName}
          onChange={handleFilterChange}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              fontSize: "0.9rem",
            },
          }}
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Year of Passout"
              name="yearOfPassout"
              fullWidth
              size="small"
              value={filters.yearOfPassout}
              onChange={handleFilterChange}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  fontSize: "0.9rem",
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Min Experience"
              name="minWorkExp"
              fullWidth
              size="small"
              value={filters.minWorkExp}
              onChange={handleFilterChange}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  fontSize: "0.9rem",
                },
              }}
            />
          </Grid>
        </Grid>

        <TextField
          label="Work Experience Company"
          name="workExpCompany"
          fullWidth
          size="small"
          value={filters.workExpCompany}
          onChange={handleFilterChange}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              fontSize: "0.9rem",
            },
          }}
        />

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Checkbox
                name="isConsultant"
                checked={filters.isConsultant}
                onChange={handleFilterChange}
                sx={{
                  color: "#6c757d",
                  "&.Mui-checked": {
                    color: "#212529",
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{ fontWeight: 500, color: "#495057", fontSize: "0.9rem" }}
              >
                Consultant Only
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                name="topCompany"
                checked={filters.topCompany}
                onChange={handleFilterChange}
                sx={{
                  color: "#6c757d",
                  "&.Mui-checked": {
                    color: "#212529",
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{ fontWeight: 500, color: "#495057", fontSize: "0.9rem" }}
              >
                Top Companies Only
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                name="topInstitutes"
                checked={filters.topInstitutes}
                onChange={handleFilterChange}
                sx={{
                  color: "#6c757d",
                  "&.Mui-checked": {
                    color: "#212529",
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{ fontWeight: 500, color: "#495057", fontSize: "0.9rem" }}
              >
                Top Institutes Only
              </Typography>
            }
          />
        </Stack>

        <Button
          variant="contained"
          onClick={handleFilterSubmit}
          fullWidth
          size="medium"
          sx={{
            mt: 3,
            borderRadius: "8px",
            backgroundColor: "#212529",
            fontWeight: 600,
            py: 1.2,
            textTransform: "none",
            fontSize: "0.9rem",
            "&:hover": {
              backgroundColor: "#343a40",
            },
          }}
        >
          Apply Filters
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#212529",
              fontSize: { xs: "2rem", md: "2.5rem" },
              mb: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Find Top Talent
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#6c757d",
              fontSize: "1.1rem",
              fontWeight: 400,
            }}
          >
            Discover the perfect candidates with intelligent search
          </Typography>
        </Box>

        {/* Search Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: "12px",
            border: "1px solid #e9ecef",
            backgroundColor: "#ffffff",
          }}
        >
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} md={7}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#212529",
                    mb: 1.5,
                    fontSize: "1rem",
                  }}
                >
                  Job Description
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Describe the role, required skills, and experience level..."
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#fafafa",
                      fontSize: "0.9rem",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6c757d",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#212529",
                      },
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#212529",
                    mb: 1.5,
                    fontSize: "1rem",
                  }}
                >
                  Results Count
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={numberOfResumes}
                    onChange={(e) => setNumberOfResumes(e.target.value)}
                    variant="outlined"
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#fafafa",
                      fontSize: "0.9rem",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6c757d",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#212529",
                      },
                    }}
                  >
                    <MenuItem value={5}>5 Results</MenuItem>
                    <MenuItem value={10}>10 Results</MenuItem>
                    <MenuItem value={15}>15 Results</MenuItem>
                    <MenuItem value={20}>20 Results</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} md={2}>
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "row", md: "column" },
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleRAGSearch}
                  disabled={loading}
                  size="large"
                  sx={{
                    height: "48px",
                    backgroundColor: "#212529",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "0.95rem",
                    "&:hover": {
                      backgroundColor: "#343a40",
                    },
                    "&:disabled": {
                      backgroundColor: "#6c757d",
                    },
                  }}
                  startIcon={loading ? null : <SearchIcon />}
                >
                  {loading ? "Searching..." : "Search"}
                </Button>

                {!isMobile && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={toggleDrawer(true)}
                    size="large"
                    sx={{
                      height: "48px",
                      borderColor: "#e9ecef",
                      color: "#6c757d",
                      fontWeight: 600,
                      borderRadius: "8px",
                      textTransform: "none",
                      fontSize: "0.95rem",
                      "&:hover": {
                        borderColor: "#6c757d",
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                    startIcon={<TuneIcon />}
                    endIcon={
                      showAdvancedSearch ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )
                    }
                  >
                    Filters
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Mobile Filter Button */}
          {isMobile && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={toggleDrawer(true)}
                startIcon={<TuneIcon />}
                sx={{
                  borderRadius: "8px",
                  borderColor: "#e9ecef",
                  color: "#6c757d",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Advanced Filters
              </Button>
            </Box>
          )}
        </Paper>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              width: { xs: 300, sm: 350, md: 380 },
              borderRadius: "0 12px 12px 0",
            },
          }}
        >
          {filterComponents}
        </Drawer>

        {/* Loading */}
        {loading && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "12px",
              border: "1px solid #e9ecef",
              mb: 4,
              backgroundColor: "#fafafa",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <AutoAwesomeIcon sx={{ color: "#6c757d", fontSize: 20 }} />
              <Typography sx={{ fontWeight: 600, color: "#495057" }}>
                Analyzing candidates...
              </Typography>
            </Box>
            <LinearProgress
              sx={{
                borderRadius: "4px",
                backgroundColor: "#e9ecef",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#212529",
                },
              }}
            />
          </Paper>
        )}

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: "8px",
              border: "1px solid #f8d7da",
              backgroundColor: "#f8d7da",
              color: "#721c24",
            }}
          >
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {resumes.length === 0 && !loading && (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: "12px",
              border: "2px dashed #e9ecef",
              backgroundColor: "#fafafa",
            }}
          >
            <Box sx={{ mb: 4 }}>
              <SearchIcon sx={{ fontSize: "4rem", color: "#dee2e6" }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: "#495057",
              }}
            >
              Ready to find great talent?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6c757d",
                fontSize: "1rem",
                maxWidth: 480,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Enter a detailed job description above to discover the most
              relevant candidates from our database
            </Typography>
          </Paper>
        )}

        {/* Results Section */}
        {resumes.length > 0 && (
          <Box>
            {/* Results Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 4,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "#212529",
                  fontSize: "1.5rem",
                }}
              >
                {resumes.length} Candidate{resumes.length !== 1 ? "s" : ""}{" "}
                Found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6c757d",
                  fontWeight: 500,
                }}
              >
                Showing {startIndex + 1}-{Math.min(endIndex, resumes.length)} of{" "}
                {resumes.length}
              </Typography>
            </Box>

            {/* Results Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {currentResumes.map((resume, index) => (
                <Grid item xs={12} md={6} key={resume._id || index}>
                  <ResumeCard resume={resume} index={index} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {resumes.length > recordsPerPage && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Pagination
                  count={Math.ceil(resumes.length / recordsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: "8px",
                      fontWeight: 600,
                      color: "#6c757d",
                      "&.Mui-selected": {
                        backgroundColor: "#212529",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#343a40",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ResumeSearch;
