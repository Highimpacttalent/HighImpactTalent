import React, { useState, useEffect } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from '@mui/icons-material/Search'
import {
  TextField,
  MenuItem,
  Select,
  Box,
  InputLabel,
  FormControl,
  Button,
  Chip,
  Radio,
  RadioGroup,
  Grid,
  Slider,
  Card,
  ListItemText,
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
import CloseIcon from "@mui/icons-material/Close";
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "600",
            fontFamily: "Satoshi",
            fontSize: "20px",
            py: 1.5,
          }}
        >
          Filters
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "600",
            fontFamily: "Satoshi",
            fontSize: "20px",
            py: 1.5,
          }}
        >
          <CloseIcon onClick={toggleDrawer(false)} />
        </Typography>
      </Box>
      <Grid container spacing={2}>
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
                placeholder="Select Skills"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px", // rounded corners
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#333333",
                  },
                  "& input": {
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#333333",
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
                  sx={{
                    borderRadius: "8px",
                    fontWeight: 500,
                    fontSize: "13px",
                    color: "#000000AD",
                    border: "1.5px solid #ccc",
                  }}
                />
              ))
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            gutterBottom
            sx={{
              fontWeight: 500,
              color: "#00000080",
              fontSize: "14px",
              mt: 1,
            }}
          >
            Experience (in Years)
          </Typography>
          <Box sx={{ width: "80%", px: 1 }}>
            <Slider
              value={filters.exp}
              onChange={(event, newValue) =>
                handleFilterChange({
                  target: { name: "exp", value: newValue },
                })
              }
              name="exp"
              min={0}
              max={20}
              step={1}
              valueLabelDisplay="auto"
              sx={{
                color: "#1976d2",

                // Track (filled part of the slider)
                "& .MuiSlider-track": {
                  height: 8,
                  borderRadius: 4,
                },

                // Rail (unfilled part of the slider)
                "& .MuiSlider-rail": {
                  height: 6,
                  borderRadius: 4,
                  opacity: 1,
                  backgroundColor: "#ccc",
                },

                // Thumb (the pointer/handle)
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#ffffff",
                  border: "2px solid #000000",
                  "&:hover, &.Mui-focusVisible, &.Mui-active": {
                    boxShadow: "0px 0px 0px 6px rgba(0, 0, 0, 0.16)",
                  },
                },

                // Value label styling
                "& .MuiSlider-valueLabel": {
                  fontSize: 12,
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography
            gutterBottom
            sx={{
              fontWeight: 500,
              color: "#00000080",
              fontSize: "14px",
              mt: 1,
              fontFamily: "Poppins",
            }}
          >
            Work Experience Company
          </Typography>
          <TextField
            name="workExpCompany"
            placeholder="enter company name"
            fullWidth
            value={filters.workExpCompany}
            onChange={handleFilterChange}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // rounded corners
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
              "& input": {
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            gutterBottom
            sx={{
              fontWeight: 500,
              color: "#00000080",
              fontSize: "14px",
              mt: 1,
              fontFamily: "Poppins",
            }}
          >
            Minimum Work Experience
          </Typography>

          <FormControl component="fieldset" sx={{ mt: 1, ml: 1 }}>
            <RadioGroup
              name="minWorkExp"
              value={filters.minWorkExp}
              onChange={handleFilterChange}
            >
              {[1, 2, 3].map((val) => (
                <FormControlLabel
                  key={val}
                  value={val}
                  control={
                    <Radio
                      sx={{
                        color: "#3C7EFC",
                        p: 0.5, // slightly reduced padding
                        mr: 1,
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontFamily: "Poppins",
                        fontSize: "14px",
                      }}
                    >
                      {val === 3 ? "3+" : val}
                    </Typography>
                  }
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    mb: 0.5, // reduce vertical margin between rows
                    "& .MuiFormControlLabel-label": {
                      fontSize: "14px",
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography
            gutterBottom
            sx={{
              fontWeight: 500,
              color: "#00000080",
              fontSize: "14px",
              mt: 1,
              fontFamily: "Poppins",
            }}
          >
            Institute Name
          </Typography>
          <TextField
            name="instituteName"
            placeholder="enter institute name"
            fullWidth
            value={filters.instituteName}
            onChange={handleFilterChange}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // rounded corners
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
              "& input": {
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            gutterBottom
            sx={{
              fontWeight: 500,
              color: "#00000080",
              fontSize: "14px",
              mt: 1,
              fontFamily: "Poppins",
            }}
          >
            Specific Batch of Institute
          </Typography>
          <TextField
            placeholder="eg: 2020"
            name="yearOfPassout"
            fullWidth
            value={filters.yearOfPassout}
            onChange={handleFilterChange}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // rounded corners
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
              "& input": {
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            gutterBottom
            sx={{
              fontWeight: 500,
              color: "#00000080",
              fontSize: "14px",
              mt: 1,
              fontFamily: "Poppins",
            }}
          >
            Current Company
          </Typography>
          <TextField
            placeholder="eg. Google"
            name="currentCompany"
            fullWidth
            value={filters.currentCompany}
            onChange={handleFilterChange}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // rounded corners
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
              "& input": {
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            gutterBottom
            sx={{
              fontWeight: 500,
              color: "#00000080",
              fontSize: "14px",
              mt: 1,
              fontFamily: "Poppins",
            }}
          >
            Current Designation
          </Typography>
          <TextField
            placeholder="eg. Software Developer"
            name="jobRoles"
            fullWidth
            value={filters.jobRoles}
            onChange={handleFilterChange}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // rounded corners
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
              "& input": {
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            gutterBottom
            sx={{
              fontWeight: 500,
              color: "#00000080",
              fontSize: "14px",
              mt: 1,
              fontFamily: "Poppins",
            }}
          >
            Location
          </Typography>
          <TextField
            placeholder="enter the location"
            name="location"
            fullWidth
            value={filters.location}
            onChange={handleFilterChange}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // rounded corners
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
              "& input": {
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            gutterBottom
            sx={{
              fontWeight: 500,
              color: "#00000080",
              fontSize: "14px",
              mt: 1,
              fontFamily: "Poppins",
            }}
          >
            Previous Employers
          </Typography>
          <TextField
            placeholder="eg. Amazon, Google"
            fullWidth
            onKeyDown={handleCompanyChange}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // rounded corners
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
              "& input": {
                fontWeight: 500,
                fontSize: "14px",
                color: "#333333",
              },
            }}
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
          <FormControlLabel
            control={
              <Checkbox
                name="isConsultant"
                checked={filters.isConsultant}
                onChange={handleFilterChange}
                sx={{
                  transform: "scale(0.8)", // Reduce checkbox size
                  color: "#3C7EFC", // Optional: checkbox color
                  p: 0.5, // Reduce padding
                }}
              />
            }
            label={
              <Typography sx={{ fontFamily: "Poppins", fontSize: "14px" }}>
                Consultant
              </Typography>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="topCompany"
                checked={filters.topCompany}
                onChange={handleFilterChange}
                sx={{
                  transform: "scale(0.8)", // Reduce checkbox size
                  color: "#3C7EFC", // Optional: checkbox color
                  p: 0.5, // Reduce padding
                }}
              />
            }
            label={
              <Typography sx={{ fontFamily: "Poppins", fontSize: "14px" }}>
                Top Company
              </Typography>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="topInstitutes"
                checked={filters.topInstitutes}
                onChange={handleFilterChange}
                sx={{
                  transform: "scale(0.8)", // Reduce checkbox size
                  color: "#3C7EFC", // Optional: checkbox color
                  p: 0.5, // Reduce padding
                }}
              />
            }
            label={
              <Typography sx={{ fontFamily: "Poppins", fontSize: "14px" }}>
                Top Company
              </Typography>
            }
          />
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center", height: 30 }}></Grid>
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
 <Box sx={{ display: "flex", alignItems: "center", gap: 0, width: { xs: "100%", sm: "350px" } }}>
  {/* AI Search TextField */}
  <TextField
    fullWidth
    placeholder="AI Search"
    variant="outlined"
    onFocus={() => navigate("/ai-resume")}
    InputProps={{
      startAdornment: <SearchIcon sx={{ color: "#888", mr: 1 }} />,
      sx: {
        borderTopLeftRadius: "12px",
        borderBottomLeftRadius: "12px",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: "#fff",
        fontFamily: "Poppins",
        fontSize: "14px",
        fontWeight: 500,
        boxShadow: 2,
        cursor: "pointer",
      },
      readOnly: true,
    }}
  />

  {/* Search Button (Attached to TextField) */}
  <Button
    onClick={() => navigate("/ai-resume")}
    sx={{
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: "12px",
      borderBottomRightRadius: "12px",
      background:  "linear-gradient(45deg, #ff6ec4, #7873f5)",
      color: "#fff",
      fontFamily: "Poppins",
      fontWeight: 500,
      px: 3,
      height: "56px", // match TextField height
      boxShadow: 2,
      textTransform: "none",
    }}
  >
    Search
  </Button>
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
      {/* Main content */}
      <Box sx={{ flex: 1 }}>
        {/* Header: filter icon, actions, title all in one line on mobile */}
        <Typography
          sx={{
            fontWeight: 600,
            flexGrow: 1,
            textAlign: "left",
            fontFamily: "Poppins",
            fontSize: "24px",
            color: "#000000CC",
          }}
        >
          Resume Search
        </Typography>
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
          
        </Box>

        <Button
          variant="contained"
          onClick={toggleDrawer(true)}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            bgcolor:"#00A6ED",
            fontFamily: "Poppins",
            fontSize: "16px",
            textTransform: "none",
            borderRadius: 12,
            px: 2,
            py: 0.5,
            mb: 2
          }}
        >
          Filters
        </Button>

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box sx={{ width: 340, p: 2 }}>{filterComponents}</Box>
          </Drawer>
        )}

        {loading && <LinearProgress color="primary" sx={{ mt:2,mb: 1 }} />}

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
