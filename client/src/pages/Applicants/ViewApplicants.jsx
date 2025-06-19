import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  InputBase,
  Button,
  Autocomplete,
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
  const weights = {
    exp: 25,
    skills: 40,
    loc: 10,
    type: 10,
    mode: 10,
    sal: 5,
  };

  let expScore = 0,
    skillsScore = 0,
    locScore = 0,
    typeScore = 0,
    modeScore = 0,
    salScore = 0;

  // 1) Experience
  const jobMinExp = job.experience?.minExperience ?? job.experience;
  if (jobMinExp !== undefined && jobMinExp !== null) {
    const ratio = Math.min(applicant.experience / jobMinExp, 1);
    expScore = ratio * weights.exp;
  } else {
    expScore = weights.exp;
  }

  // 2) Skills Match (40%)
  if (Array.isArray(job.skills) && job.skills.length > 0) {
    const matches = job.skills.filter((js) =>
      (applicant.skills || []).some(
        (ast) => ast.toLowerCase() === js.toLowerCase()
      )
    );
    skillsScore = (matches.length / job.skills.length) * weights.skills;
  } else {
    skillsScore = weights.skills;
  }

  // 3) Location / Relocate
  if (job.jobLocation) {
    if (
      job.jobLocation.toLowerCase() === "hybrid" ||
      applicant.currentLocation?.toLowerCase() === job.jobLocation.toLowerCase() ||
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
  const jobMinSalary = job.salary?.minSalary ?? job.salary;
  if (jobMinSalary !== undefined && jobMinSalary !== null) {
    if (
      !applicant.expectedMinSalary ||
      parseInt(applicant.expectedMinSalary, 10) <= parseInt(jobMinSalary, 10)
    ) {
      salScore = weights.sal;
    }
  } else {
    salScore = weights.sal;
  }

  const totalScore = Math.round(
    expScore + skillsScore + locScore + typeScore + modeScore + salScore
  );

  const breakdown = `
Candidate: ${applicant.firstName} ${applicant.lastName}
Job Criteria:
  • Required Exp: ${jobMinExp ?? "[none specified]"}
  • Skills: ${job.skills?.length ? job.skills.join(", ") : "Not Provided"}
  • Location: ${job.jobLocation ?? "[none specified]"}
  • Work Type: ${job.workType || "[none specified]"}
  • Work Mode: ${job.workMode || "[none specified]"}
  • Min Salary: ${jobMinSalary ?? "[none specified]"}

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

  console.log(totalScore, breakdown);
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

const JobApplications = () => {
  const steps = [
    "Applied",
    "Application Viewed",
    "Shortlisted",
    "Interviewing",
    "Hired",
    "Not Progressing",
  ];
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
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
  const [stageCounts, setStageCounts] = useState({});
  const [cities, setCities] = useState();
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
    keywords: "",
    location: "",
    currentDesignation: "",
    totalYearsInConsulting: "",
  });

  const [screeningQuestions, setScreeningQuestions] = useState([]);

  // Fetch applications with server-side filtering
  const fetchApplications = async (filterParams = {}, status = null) => {
    try {
      setFilterLoading(true);
      
      const queryParams = new URLSearchParams();
      
      // Add status if provided
      if (status) {
        queryParams.append('status', status);
      }
      
      // Add filter parameters
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          queryParams.append(key, value.toString().trim());
        }
      });

      const response = await apiRequest({
        url: `application/get-applications/${jobId}?${queryParams.toString()}`,
        method: "GET",
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch applications");
      }

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

      return enriched;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setFilterLoading(false);
    }
  };

  //Fetch stage counts
  const fetchStageCounts = async () => {
    try {
      const response = await apiRequest({
        url: `application/get-stage-counts/${jobId}`,
        method: "GET",
      });

      if (response.success) {
        setStageCounts(response.stageCounts || {});
      }
    } catch (err) {
      console.error("Error fetching stage counts:", err);
    }
  };

   useEffect(() => {
      const fetchCities = async () => {
        try {
          const response = await fetch("/cities.csv");
          const text = await response.text();
          const rows = text.split("\n");
          const cityList = rows.slice(1).map((row) => row.trim()).filter(Boolean).sort();
  
          setCities([...new Set(cityList)]);
        } catch (error) {
          console.error("Error loading cities:", error);
          setCities([]);
        }
      };
  
      fetchCities();
    }, []);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Fetch all applications for initial load
        const allApps = await fetchApplications();
        setAllApplications(allApps);
        
        // Filter by current step
        const currentStatus = steps[activeStep];
        const filteredByStatus = allApps.filter((app) => app.status === currentStatus);
        setApplications(filteredByStatus);
        setFilteredApps(filteredByStatus);
        
        // Fetch stage counts
        await fetchStageCounts();

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchScreeningQuestions = async () => {
      try {
        const response = await apiRequest({
          url: `application/get-screening-filter-options/${jobId}`,
          method: "GET",
        });
        
        if (response.success && response.jobScreeningQuestions) {
          setScreeningQuestions(response.jobScreeningQuestions);
        }
      } catch (err) {
        console.error("Error fetching screening questions:", err);
      }
    };

    initializeData();
    fetchScreeningQuestions();
  }, [jobId]);

  const handleStepClick = async (index) => {
    setActiveStep(index);
    setSelectedApplications(new Set());
    
    const currentStatus = steps[index];
    
    // If filters are applied, fetch with filters and status
    const hasActiveFilters = Object.values(filters).some(value => 
      value && value.toString().trim()
    );
    
    if (hasActiveFilters) {
      const filteredApps = await fetchApplications(filters, currentStatus);
      setApplications(filteredApps);
      setFilteredApps(filteredApps);
    } else {
      // Use cached data if no filters
      const filtered = allApplications.filter((app) => app.status === currentStatus);
      setApplications(filtered);
      setFilteredApps(filtered);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = async () => {
  const currentStatus = steps[activeStep];
  
  // Prepare filter parameters for API
  const filterParams = {
    keywords: filters.keywords || '',
    location: filters.location || '',
    currentDesignation: filters.currentDesignation || '',
    totalYearsInConsulting: filters.totalYearsInConsulting || ''
  };
  
  // Prepare screening filters in the format backend expects
  const screeningFilters = {};
  
  screeningQuestions.forEach(question => {
    const filterKey = `screening_${question._id}`;
    if (filters[filterKey] && filters[filterKey].length > 0) {
      screeningFilters[question._id] = {
        questionType: question.questionType,
        expectedAnswer: filters[filterKey]
      };
    }
  });

  // Only add screeningFilters if there are any
  if (Object.keys(screeningFilters).length > 0) {
    filterParams.screeningFilters = JSON.stringify(screeningFilters);
  }
  
  // Fetch filtered applications from server
  const filteredApps = await fetchApplications(filterParams, currentStatus);
  setApplications(filteredApps);
  setFilteredApps(filteredApps);
  setSelectedApplications(new Set());
};

  const clearFilters = async () => {
  // 1. Reset all extra filters (like keywords, location)
  const resetFilters = {
    keywords: "",
    location: "",
    currentDesignation: "",
    totalYearsInConsulting: "",
  };
  screeningQuestions.forEach(question => {
    resetFilters[`screening_${question._id}`] = "";
  });
  setFilters(resetFilters);

  // 2. Go back to the first tab — usually "Applied"
  const newActiveStep = 0;
  setActiveStep(newActiveStep);

  // 3. Find the status name (e.g., "Applied")
  const newStatus = steps[newActiveStep];

  // 4. Filter from the full list we already have (`allApplications`)
  const filtered = allApplications.filter(app => app.status === newStatus);

  // 5. Update the UI with that filtered list
  setApplications(filtered);
  setFilteredApps(filtered);

  // 6. Refresh stage counts (the numbers on tabs)
  await fetchStageCounts();

  // 7. Clear any selected applicants (used for bulk actions)
  setSelectedApplications(new Set());

  // 8. Optional: If on mobile, close the filters drawer
  if (isMobile) {
    setDrawerOpen(false);
  }
};

const FiltersContent = (
  <Box sx={{ p: 2, width: isMobile ? 250 : "auto" }}>

    {/* Keywords Field */}
    <Box sx={{ mb: 3 }}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          fontFamily: "Satoshi, sans-serif", 
          fontWeight: 600,
          color: "#374151",
          mb: 1.5,
          fontSize: "0.875rem",
          letterSpacing: "-0.01em"
        }}
      >
        Keywords
      </Typography>
      <TextField
        name="keywords"
        value={filters.keywords}
        onChange={handleFilterChange}
        placeholder="Search by name, skills, expertise..."
        size="small"
        fullWidth
        sx={{ 
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            border: "1.5px solid #e2e8f0",
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.875rem",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: "#cbd5e1",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
            },
            "&.Mui-focused": {
              borderColor: "#667eea",
              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
              backgroundColor: "#ffffff"
            },
            "& fieldset": {
              border: "none"
            }
          },
          "& .MuiOutlinedInput-input": {
            padding: "12px 16px",
            "&::placeholder": {
              color: "#94a3b8",
              opacity: 1
            }
          }
        }}
      />
    </Box>

    {/* Location Field */}
    <Box sx={{ mb: 3 }}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          fontFamily: "Satoshi, sans-serif", 
          fontWeight: 600,
          color: "#374151",
          mb: 1.5,
          fontSize: "0.875rem",
          letterSpacing: "-0.01em"
        }}
      >
        Location
      </Typography>
      <Autocomplete
    freeSolo
    options={cities}
    inputValue={filters.location}
    onInputChange={(event, newValue) =>
      handleFilterChange({ target: { name: "location", value: newValue } })
    }
    onChange={(event, newValue) =>
      handleFilterChange({ target: { name: "location", value: newValue || "" } })
    }
    renderInput={(params) => (
      <TextField
        {...params}
        name="location"
        placeholder="City, country or region"
        size="small"
        fullWidth
         sx={{ 
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            border: "1.5px solid #e2e8f0",
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.875rem",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: "#cbd5e1",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
            },
            "&.Mui-focused": {
              borderColor: "#667eea",
              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
              backgroundColor: "#ffffff"
            },
            "& fieldset": {
              border: "none"
            }
          },
          "& .MuiOutlinedInput-input": {
            padding: "12px 16px",
            "&::placeholder": {
              color: "#94a3b8",
              opacity: 1
            }
          }
        }}
      />
    )}
  />
    </Box>

    {/* Current Designation Field */}
    <Box sx={{ mb: 3 }}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          fontFamily: "Satoshi, sans-serif", 
          fontWeight: 600,
          color: "#374151",
          mb: 1.5,
          fontSize: "0.875rem",
          letterSpacing: "-0.01em"
        }}
      >
        Current Designation
      </Typography>
      <TextField
        name="currentDesignation"
        value={filters.currentDesignation}
        onChange={handleFilterChange}
        placeholder="Job title or role"
        size="small"
        fullWidth
        sx={{ 
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            border: "1.5px solid #e2e8f0",
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.875rem",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: "#cbd5e1",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
            },
            "&.Mui-focused": {
              borderColor: "#667eea",
              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
              backgroundColor: "#ffffff"
            },
            "& fieldset": {
              border: "none"
            }
          },
          "& .MuiOutlinedInput-input": {
            padding: "12px 16px",
            "&::placeholder": {
              color: "#94a3b8",
              opacity: 1
            }
          }
        }}
      />
    </Box>

    {/* Years in Consulting Dropdown */}
    <Box sx={{ mb: 3 }}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          fontFamily: "Satoshi, sans-serif", 
          fontWeight: 600,
          color: "#374151",
          mb: 1.5,
          fontSize: "0.875rem",
          letterSpacing: "-0.01em"
        }}
      >
        Years in Consulting
      </Typography>
      <FormControl fullWidth>
        <Select
          name="totalYearsInConsulting"
          value={filters.totalYearsInConsulting}
          onChange={handleFilterChange}
          size="small"
          displayEmpty
          sx={{
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            border: "1.5px solid #e2e8f0",
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.875rem",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: "#cbd5e1",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
            },
            "&.Mui-focused": {
              borderColor: "#667eea",
              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
            },
            "& fieldset": {
              border: "none"
            },
            "& .MuiSelect-select": {
              padding: "12px 16px",
              color: filters.totalYearsInConsulting ? "#1f2937" : "#94a3b8"
            },
            "& .MuiSelect-icon": {
              color: "#6b7280",
              right: "12px"
            }
          }}
        >
          <MenuItem value="" sx={{ fontFamily: "Poppins, sans-serif", color: "#94a3b8" }}>
            Select experience level
          </MenuItem>
          <MenuItem value="0-2" sx={{ fontFamily: "Poppins, sans-serif" }}>0-2 years</MenuItem>
          <MenuItem value="2-5" sx={{ fontFamily: "Poppins, sans-serif" }}>2-5 years</MenuItem>
          <MenuItem value="5-10" sx={{ fontFamily: "Poppins, sans-serif" }}>5-10 years</MenuItem>
          <MenuItem value="10-100" sx={{ fontFamily: "Poppins, sans-serif" }}>10+ years</MenuItem>
        </Select>
      </FormControl>
    </Box>

    {/* Screening Questions Section */}
    {screeningQuestions.length > 0 && (
      <Box sx={{ mb: 4 }}>
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 3,
            pb: 2,
            borderBottom: "1px solid #f1f5f9"
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 20,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "2px",
              mr: 2
            }}
          />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontFamily: "Satoshi, sans-serif", 
              fontWeight: 700,
              color: "#1a1d29",
              fontSize: "1rem",
              letterSpacing: "-0.01em"
            }}
          >
            Screening Questions
          </Typography>
        </Box>
        
        {screeningQuestions.map((question, index) => (
          <Box key={question._id} sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontFamily: "Satoshi, sans-serif", 
                fontWeight: 600,
                color: "#374151",
                mb: 1.5,
                fontSize: "0.875rem",
                letterSpacing: "-0.01em"
              }}
            >
              {question.question}
            </Typography>
            <FormControl fullWidth>
              <Select
                name={`screening_${question._id}`}
                value={filters[`screening_${question._id}`] || ""}
                onChange={handleFilterChange}
                size="small"
                displayEmpty
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                  border: "1.5px solid #e2e8f0",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
                  },
                  "&.Mui-focused": {
                    borderColor: "#667eea",
                    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
                  },
                  "& fieldset": {
                    border: "none"
                  },
                  "& .MuiSelect-select": {
                    padding: "12px 16px",
                    color: filters[`screening_${question._id}`] ? "#1f2937" : "#94a3b8"
                  },
                  "& .MuiSelect-icon": {
                    color: "#6b7280",
                    right: "12px"
                  }
                }}
              >
                <MenuItem value="" sx={{ fontFamily: "Poppins, sans-serif", color: "#94a3b8" }}>
                  Select an option
                </MenuItem>
                {question.options?.map((option, idx) => (
                  <MenuItem key={idx} value={option} sx={{ fontFamily: "Poppins, sans-serif" }}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}
      </Box>
    )}

    {/* Action Buttons */}
    <Box sx={{ display: "flex", gap: 2, pt: 3, borderTop: "1px solid #f1f5f9" }}>
      <Button
        variant="contained"
        fullWidth
        onClick={applyFilters}
        disabled={filterLoading}
        startIcon={filterLoading ? <CircularProgress size={16} color="inherit" /> : null}
        sx={{ 
          fontFamily: "Satoshi, sans-serif", 
          fontWeight: 600,
          fontSize: "0.875rem",
          textTransform: "none",
          borderRadius: "12px",
          padding: "12px 24px",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
          transition: "all 0.2s ease-in-out",
          letterSpacing: "-0.01em",
          backgroundColor: '#374151',
          '&:hover': { backgroundColor: '#1f2937' },
        }}
      >
        {filterLoading ? "Applying Filters..." : "Apply Filters"}
      </Button>
      
      <Button
        variant="outlined"
        fullWidth
        onClick={clearFilters}
        disabled={filterLoading}
        sx={{ 
          fontFamily: "Satoshi, sans-serif", 
          fontWeight: 600,
          fontSize: "0.875rem",
          textTransform: "none",
          borderRadius: "12px",
          padding: "12px 24px",
          borderColor: "#e2e8f0",
          color: "#64748b",
          backgroundColor: "#ffffff",
          transition: "all 0.2s ease-in-out",
          letterSpacing: "-0.01em",
          "&:hover": {
            borderColor: "#cbd5e1",
            backgroundColor: "#f8fafc",
            color: "#475569",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
          },
          "&:disabled": {
            borderColor: "#f1f5f9",
            color: "#cbd5e1"
          }
        }}
      >
        Clear All
      </Button>
    </Box>
  </Box>
);

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
    // Reset to current filtered applications without AI search
    const currentStatus = steps[activeStep];
    const hasActiveFilters = Object.values(filters).some(value => 
      value && value.toString().trim()
    );
    
    if (hasActiveFilters) {
      const filteredApps = await fetchApplications(filters, currentStatus);
      setFilteredApps(filteredApps);
    } else {
      const filtered = allApplications.filter((app) => app.status === currentStatus);
      setFilteredApps(filtered);
    }
    
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
        
        // Refresh data after bulk action
        await fetchStageCounts();
        const currentStatus = steps[activeStep];
        const hasActiveFilters = Object.values(filters).some(value => 
          value && value.toString().trim()
        );
        
        if (hasActiveFilters) {
          const filteredApps = await fetchApplications(filters, currentStatus);
          setApplications(filteredApps);
          setFilteredApps(filteredApps);
        } else {
          const allApps = await fetchApplications();
          setAllApplications(allApps);
          const filtered = allApps.filter((app) => app.status === currentStatus);
          setApplications(filtered);
          setFilteredApps(filtered);
        }
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
        
        // Refresh data after bulk action
        await fetchStageCounts();
        const currentStatus = steps[activeStep];
        const hasActiveFilters = Object.values(filters).some(value => 
          value && value.toString().trim()
        );
        
        if (hasActiveFilters) {
          const filteredApps = await fetchApplications(filters, currentStatus);
          setApplications(filteredApps);
          setFilteredApps(filteredApps);
        } else {
          const allApps = await fetchApplications();
          setAllApplications(allApps);
          const filtered = allApps.filter((app) => app.status === currentStatus);
          setApplications(filtered);
          setFilteredApps(filtered);
        }
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
        
        // Refresh data after bulk action
        await fetchStageCounts();
        const currentStatus = steps[activeStep];
        const hasActiveFilters = Object.values(filters).some(value => 
          value && value.toString().trim()
        );
        
        if (hasActiveFilters) {
          const filteredApps = await fetchApplications(filters, currentStatus);
          setApplications(filteredApps);
          setFilteredApps(filteredApps);
        } else {
          const allApps = await fetchApplications();
          setAllApplications(allApps);
          const filtered = allApps.filter((app) => app.status === currentStatus);
          setApplications(filtered);
          setFilteredApps(filtered);
        }
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

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", p: { xs: 2, md: 4 } }}>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
            fontFamily: "Satoshi",
            boxShadow: "0 2px 12px rgba(239, 68, 68, 0.15)",
          }}
        >
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Enhanced Filters Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: "350px" },
            flexShrink: 0,
          }}
        >
          {isMobile ? (
            <Box sx={{ mb: 3 }}>
              <Button
                onClick={() => setDrawerOpen(true)}
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={{
                  bgcolor: "white",
                  borderRadius: 3,
                  p: 2,
                  fontFamily: "Satoshi",
                  fontWeight: 600,
                  textTransform: "none",
                  border: "2px solid #e2e8f0",
                  color: "#24252C",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  "&:hover": {
                    bgcolor: "#f8fafc",
                    border: "2px solid #1976d2",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Filters & Search
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                bgcolor: "white",
                p: 3,
                borderRight: "2px solid #e2e8f0",
                position: "sticky",
                top: 20,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Satoshi",
                  fontWeight: 600,
                  fontSize: "22px",
                  color: "#24252C",
                  mb: 3,
                  borderBottom: "2px solid #f1f5f9",
                  pb: 2,
                }}
              >
                Filters & Search
              </Typography>
              {FiltersContent}
            </Box>
          )}

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: 320,
                bgcolor: "white",
                borderRadius: "0 16px 16px 0",
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography
                sx={{
                  fontFamily: "Satoshi",
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "#24252C",
                  mb: 3,
                  borderBottom: "2px solid #f1f5f9",
                  pb: 2,
                }}
              >
                Filters & Search
              </Typography>
              {FiltersContent}
            </Box>
          </Drawer>
        </Box>

        {/* Applications Section */}
        <Box sx={{ flex: 1 }}>
          {/* Header Section */}
      <Box
        sx={{
          bgcolor: "white",
          p: { xs: 1, md: 2 },
          mb: 3,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            color: "#24252C",
            fontFamily: "Satoshi",
            fontWeight: 700,
            fontSize: { xs: "24px", md: "30px" },
            mb: 1,
          }}
        >
          Job Applications
        </Typography>
      
      </Box>
          {/* Premium Tab Navigation */}
          <Box
            sx={{
              bgcolor: "transparent",
              borderBottom: "1px solid #e2e8f0",
              mb: 3,
              overflowX: "auto",
              px: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  height: 4,
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f5f9",
                  borderRadius: 2,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#cbd5e1",
                  borderRadius: 2,
                },
              }}
            >
              {steps.map((step, index) => {
                 const isActive = activeStep === index;
                 const candidateCount = stageCounts[step] || 0;

                return (
                  <Box
                    key={step}
                    onClick={() => handleStepClick(index)}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1.2,
                      cursor: "pointer",
                      borderBottom: isActive
                        ? "3px solid #1976d2"
                        : "3px solid transparent",
                      transition: "all 0.3s ease",
                      backgroundColor: isActive ? "#f0f7ff" : "transparent",
                      "&:hover": {
                        backgroundColor: isActive ? "#e3f2fd" : "#f8fafc",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Satoshi",
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "14px",
                        color: isActive ? "#1976d2" : "#334155",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {step}
                    </Typography>

                    <Box
                      sx={{
                        bgcolor: isActive ? "#1976d2" : "#cbd5e1",
                        color: "white",
                        px: 1,
                        py: 0.3,
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 700,
                        fontFamily: "Satoshi",
                        minWidth: "24px",
                        textAlign: "center",
                      }}
                    >
                      {candidateCount}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Enhanced Bulk Actions */}
          {filteredApps.length > 0 && (
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                p: 3,
                mb: 3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: "1px solid #e2e8f0",
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              }}
            >
              {/* Compact Header with Inline Actions */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                {/* Left Section - Selection Info */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flex: 1,
                    minWidth: "250px",
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<SelectAllIcon />}
                    onClick={handleSelectAll}
                    sx={{
                      fontFamily: "Satoshi",
                      fontWeight: 600,
                      fontSize: "13px",
                      borderRadius: 2.5,
                      textTransform: "none",
                      px: 2.5,
                      py: 1,
                      border: "1.5px solid #e2e8f0",
                      color: "#475569",
                      bgcolor: "white",
                      minHeight: "36px",
                      "&:hover": {
                        border: "1.5px solid #1976d2",
                        color: "#1976d2",
                        bgcolor: "#f0f7ff",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {selectedApplications.size === filteredApps.length
                      ? "Deselect"
                      : "Select All"}
                  </Button>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "#f0f7ff",
                      px: 2.5,
                      py: 1,
                      borderRadius: 2.5,
                      border: "1px solid #bfdbfe",
                      minHeight: "36px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#1976d2",
                        fontFamily: "Satoshi",
                        fontWeight: 700,
                        fontSize: "15px",
                        lineHeight: 1,
                      }}
                    >
                      {filteredApps.length}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#1976d2",
                        fontFamily: "Satoshi",
                        fontWeight: 500,
                        fontSize: "13px",
                        lineHeight: 1,
                      }}
                    >
                      at <strong>{steps[activeStep]}</strong>
                    </Typography>
                  </Box>

                  {/* Selection Badge */}
                  {selectedApplications.size > 0 && (
                    <Box
                      sx={{
                        bgcolor: "#dcfce7",
                        color: "#166534",
                        px: 2,
                        py: 0.75,
                        borderRadius: 2,
                        border: "1px solid #bbf7d0",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        minHeight: "36px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Satoshi",
                          fontWeight: 600,
                          fontSize: "13px",
                          lineHeight: 1,
                        }}
                      >
                        {selectedApplications.size} selected
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={clearSelection}
                        sx={{
                          color: "#166534",
                          p: 0.25,
                          ml: 0.5,
                          "&:hover": { bgcolor: "rgba(22, 101, 52, 0.1)" },
                        }}
                      >
                        <CancelOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {/* Right Section - Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: "center",
                    flexWrap:"wrap",
                  }}
                >
                  {/* Primary Actions */}
                  <Button
                    variant="contained"
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
                        <CircularProgress size={14} color="inherit" />
                      ) : (
                        <ArrowForwardIcon sx={{ fontSize: 16 }} />
                      )
                    }
                    sx={{
                      fontFamily: "Satoshi",
                      fontWeight: 600,
                      fontSize: "13px",
                      textTransform: "none",
                      borderRadius: 2.5,
                      px: 2.5,
                      py: 1,
                      minHeight: "36px",
                      bgcolor: "#1976d2",
                      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
                      "&:hover": {
                        bgcolor: "#1565c0",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.35)",
                      },
                      "&:disabled": {
                        bgcolor: "#e2e8f0",
                        color: "#94a3b8",
                      },
                    }}
                  >
                    {bulkActionLoading ? "Processing..." : "Advance"}
                  </Button>

                  <Button
                    variant="outlined"
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
                    startIcon={<CancelOutlinedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      fontFamily: "Satoshi",
                      fontWeight: 600,
                      fontSize: "13px",
                      textTransform: "none",
                      borderRadius: 2.5,
                      px: 2.5,
                      py: 1,
                      minHeight: "36px",
                      border: "1.5px solid #ef4444",
                      color: "#ef4444",
                      bgcolor: "white",
                      "&:hover": {
                        bgcolor: "#fef2f2",
                        border: "1.5px solid #dc2626",
                        color: "#dc2626",
                        transform: "translateY(-1px)",
                      },
                      "&:disabled": {
                        border: "1.5px solid #e2e8f0",
                        color: "#94a3b8",
                      },
                    }}
                  >
                    Reject
                  </Button>

                  {/* Divider */}
                  <Divider
                    orientation="vertical"
                    sx={{
                      height: "24px",
                      borderColor: "#e2e8f0",
                      mx: 0.5,
                    }}
                  />

                  {/* Secondary Action */}
                  <Button
                    variant="text"
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
                    startIcon={<CancelOutlinedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      fontFamily: "Satoshi",
                      fontWeight: 600,
                      fontSize: "13px",
                      textTransform: "none",
                      borderRadius: 2.5,
                      px: 2,
                      py: 1,
                      minHeight: "36px",
                      color: "#64748b",
                      "&:hover": {
                        bgcolor: "#f1f5f9",
                        color: "#ef4444",
                      },
                      "&:disabled": {
                        color: "#cbd5e1",
                      },
                    }}
                  >
                    Reject All
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress sx={{ color: "#1976d2" }} size={40} />
        </Box>
      )}

          {/* Enhanced Applications Grid */}
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 4,
              p: { xs: 2, md: 3 },
              minHeight: "400px",
            }}
          >
            <Grid container spacing={3}>
              {filteredApps.map((app) => (
                <Grid item xs={12} key={app._id}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-2px)",  
                      },
                    }}
                  >
                    {/* Enhanced Selection Checkbox */}
                    <Checkbox
                      checked={selectedApplications.has(app._id)}
                      onChange={() => handleApplicationSelect(app._id)}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 3,
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "50%",
                        p: 1,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        "&:hover": {
                          bgcolor: "white",
                          transform: "scale(1.1)",
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: 20,
                          color: selectedApplications.has(app._id)
                            ? "#1976d2"
                            : "#64748b",
                        },
                      }}
                    />

                    {/* Enhanced Application Card */}
                    <Box
                      sx={{
                        border: selectedApplications.has(app._id)
                          ? "3px solid #1976d2"
                          : "3px solid transparent",
                        borderRadius: 3,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        background: selectedApplications.has(app._id)
                          ? "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)"
                          : "white",
                        position: "relative",
                        "&::before": selectedApplications.has(app._id)
                          ? {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 4,
                              bgcolor: "#1976d2",
                              borderRadius: "3px 3px 0 0",
                            }
                          : {},
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

            {/* Enhanced Empty States */}
            {!loading &&
              !error &&
              filteredApps.length === 0 &&
              applications.length > 0 && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    px: 4,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    <FilterListIcon sx={{ fontSize: 40, color: "#64748b" }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Satoshi",
                      fontWeight: 700,
                      color: "#24252C",
                      mb: 2,
                      fontSize: "20px",
                    }}
                  >
                    No matching applications found
                  </Typography>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontFamily: "Satoshi",
                      mb: 4,
                      fontSize: "16px",
                      maxWidth: "400px",
                      mx: "auto",
                    }}
                  >
                    Try adjusting your filters or search criteria to find the
                    candidates you're looking for
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={clearFilters}
                    sx={{
                      fontFamily: "Satoshi",
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: "none",
                      px: 4,
                      py: 1.5,
                      bgcolor: "#1976d2",
                      boxShadow: "0 4px 16px rgba(25, 118, 210, 0.3)",
                      "&:hover": {
                        bgcolor: "#1565c0",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                      },
                    }}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              )}

            {!loading && !error && applications.length === 0 && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  px: 4,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 32,
                      fontWeight: 300,
                      color: "#64748b",
                    }}
                  >
                    📋
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Satoshi",
                    fontWeight: 700,
                    color: "#24252C",
                    mb: 2,
                    fontSize: "20px",
                  }}
                >
                  No applications at this stage
                </Typography>
                <Typography
                  sx={{
                    color: "#64748b",
                    fontFamily: "Satoshi",
                    fontSize: "16px",
                    maxWidth: "400px",
                    mx: "auto",
                  }}
                >
                  There are currently no candidates at the{" "}
                  <strong>"{steps[activeStep]}"</strong> stage
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Enhanced Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, action: "", title: "", message: "" })
        }
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Satoshi",
            fontWeight: 700,
            fontSize: "22px",
            color: "#24252C",
            pb: 2,
          }}
        >
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography
            sx={{
              fontFamily: "Satoshi",
              color: "#64748b",
              lineHeight: 1.6,
              fontSize: "16px",
            }}
          >
            {confirmDialog.message}
          </Typography>
          {confirmDialog.action === "rejectAll" && (
            <Alert
              severity="warning"
              sx={{
                mt: 3,
                borderRadius: 3,
                fontFamily: "Satoshi",
                border: "1px solid #fbbf24",
                bgcolor: "#fffbeb",
              }}
            >
              <Typography sx={{ fontFamily: "Satoshi", fontSize: "14px" }}>
                This action cannot be undone. All candidates will be marked as
                "Not Progressing".
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 2 }}>
          <Button
            onClick={() =>
              setConfirmDialog({
                open: false,
                action: "",
                title: "",
                message: "",
              })
            }
            variant="outlined"
            sx={{
              fontFamily: "Satoshi",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 3,
              px: 3,
              py: 1,
              border: "2px solid #e2e8f0",
              color: "#64748b",
              "&:hover": {
                border: "2px solid #cbd5e1",
                bgcolor: "#f8fafc",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmAction}
            disabled={bulkActionLoading}
            startIcon={
              bulkActionLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
            sx={{
              fontFamily: "Satoshi",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 3,
              px: 4,
              py: 1,
              bgcolor:
                confirmDialog.action === "advance" ? "#1976d2" : "#ef4444",
              boxShadow:
                confirmDialog.action === "advance"
                  ? "0 4px 16px rgba(25, 118, 210, 0.3)"
                  : "0 4px 16px rgba(239, 68, 68, 0.3)",
              "&:hover": {
                bgcolor:
                  confirmDialog.action === "advance" ? "#1565c0" : "#dc2626",
                transform: "translateY(-1px)",
              },
            }}
          >
            {bulkActionLoading ? "Processing..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Breakdown Dialog */}
      <Dialog
        open={breakdownDialogOpen}
        onClose={() => setBreakdownDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Satoshi",
            fontWeight: 700,
            fontSize: "22px",
            color: "#24252C",
            borderBottom: "1px solid #f1f5f9",
            pb: 2,
          }}
        >
          Match Score Breakdown
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            bgcolor: "#f8fafc",
            borderColor: "#f1f5f9",
          }}
        >
          <Typography
            component="pre"
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "Monaco, Consolas, monospace",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#24252C",
              bgcolor: "white",
              p: 3,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
            }}
          >
            {selectedBreakdown}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setBreakdownDialogOpen(false)}
            variant="contained"
            sx={{
              fontFamily: "Satoshi",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 3,
              px: 4,
              py: 1,
              bgcolor: "#1976d2",
              "&:hover": {
                bgcolor: "#1565c0",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Success/Error Snackbar */}
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
            borderRadius: 3,
            fontFamily: "Satoshi",
            fontWeight: 500,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid",
            borderColor:
              snackbar.severity === "success" ? "#bbf7d0" : "#fecaca",
            "& .MuiAlert-icon": {
              fontSize: 22,
            },
            "& .MuiAlert-message": {
              fontSize: "15px",
              fontWeight: 500,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JobApplications;
