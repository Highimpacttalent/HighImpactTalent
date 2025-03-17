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
  Avatar,
  Typography,
  Pagination,
  LinearProgress,
  Autocomplete,
} from "@mui/material";
import { skillsList } from "../../assets/mock";
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';


const ResumeSearch = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    exp: "",
    skills: [],
    pastCompanies: [],
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

  const removeCompany = (companyToRemove) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      pastCompanies: prevFilters.pastCompanies.filter(
        (company) => company !== companyToRemove
      ),
    }));
  };

  const handleSkillsChange = (event, newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, skills: newValue }));
  };

  const handleCompanyChange = (event) => {
    if (event.key === "Enter" && event.target.value.trim() !== "") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        pastCompanies: [...prevFilters.pastCompanies, event.target.value.trim()],
      }));
      event.target.value = "";
    }
  };


  const handleSubmit = () => {
    fetchResumes(filters);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  // Calculate start and end index for slicing
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  // Sliced data for current page
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

     {/* Filters Section (Right) */}
     <Box sx={{ flex: 1, background: "#f9f9f9", padding: "20px", borderRadius: "8px" }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "600",fontFamily:"Satoshi",fontSize:24 }}>
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
          <FormControl fullWidth>
            <InputLabel>Experience</InputLabel>
            <Select name="exp" value={filters.exp} onChange={handleFilterChange}>
              <MenuItem value="1">1+ Years</MenuItem>
              <MenuItem value="3">3+ Years</MenuItem>
              <MenuItem value="5">5+ Years</MenuItem>
              <MenuItem value="10">10+ Years</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
            <TextField
              label="Add Company"
              fullWidth
              onKeyDown={handleCompanyChange}
              placeholder="Press Enter to add"
            />
            <Stack direction="row" >
              {filters.pastCompanies.map((company, index) => (
                <Chip
                  key={index}
                  label={company}
                  onDelete={() => removeCompany(company)}
                />
              ))}
            </Stack>
          </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={skillsList}
            value={filters.skills}
            onChange={handleSkillsChange}
            filterSelectedOptions
            disableCloseOnSelect
            renderInput={(params) => <TextField {...params} label="Skills" placeholder="Type a skill" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} />
              ))
            }
          />
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
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Apply Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
    
    {/* Resume Cards Section (Left) */}
    <Box sx={{ flex: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        style={{ fontWeight: "600", textAlign: "center" }}
      >
        Resume Search
      </Typography>

      {loading && <LinearProgress color="primary" style={{ marginBottom: "10px" }} />}

      <Box container spacing={3} marginTop={2}>
        {currentResumes.map((resume) => (
          <Box sx={{display:"flex",border:2,flexDirection:"column",mb:2,borderColor:"grey.50",borderRadius:4}}>
          <Card sx={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "12px", padding: "10px", backgroundColor: "#fff" }}>
            <CardContent sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "#1976D2", color: "#fff" }}>
                {resume.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", fontSize: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {resume.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "gray", display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 16 }} /> {resume.email}
                </Typography>
                <Typography variant="body2" sx={{ color: "gray", display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 16 }} /> {resume.location}
                </Typography>
                <Typography variant="body2" sx={{ color: "gray", display: "flex", alignItems: "center", gap: 1 }}>
                   <WorkIcon sx={{ fontSize: 16 }} /> {resume.experience} years experience 
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "12px", color: "#555", marginTop: "5px" }}>
                  🔹 Skills: {resume.skills.slice(0, 5).join(", ")}...
                </Typography>
              </Box>
            </CardContent>
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <Button size="small" variant="contained" color="primary"  onClick={() => window.open(resume.cvUrl)}>
                View Resume
              </Button>
            </Box>
          </Card>
        </Box>
        ))}
      </Box>
       {/* Pagination Component */}
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

     