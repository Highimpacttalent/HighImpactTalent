import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  IconButton,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Button,
  Radio,
  Tabs,
  Tab,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch } from "react-redux";
import { UpdateUser } from "../../../redux/userSlice";

const Experience = ({ experienceData }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    currentCompany: "",
    openToRelocate: "",
    currentDesignation: "",
    currentSalary: "",
    isItConsultingCompany: "",
    joinConsulting: "",
    experience: "",
  });

  useEffect(() => {
    if (experienceData) {
      setFormData({
        currentCompany: experienceData.currentCompany || "",
        openToRelocate: experienceData.openToRelocate || "",
        currentDesignation: experienceData.currentDesignation || "",
        currentSalary: experienceData.currentSalary || "",
        isItConsultingCompany: experienceData.isItConsultingCompany || "",
        joinConsulting: experienceData.joinConsulting || "",
        experience: experienceData.experience || "",
      });
    }
  }, [experienceData]);

  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    console.log("Updated formData:", { ...formData, [e.target.name]: e.target.value });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    console.log("Payload being sent:", formData);
    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/user/updateWork",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: experienceData?._id, 
            ...formData,
            // experience: Number(formData.experience)
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        dispatch(UpdateUser(formData)); // Update Redux store
        setIsEditing(false);
      } else {
        console.error("Failed to save experience:", result.message);
      }
    } catch (error) {
      console.error("Error saving experience:", error);
    }
    setIsSaving(false);
  };

  return (
    <Box>
      {/* Tabs Section */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Tabs value={0}>
          <Tab
            sx={{
              "&.MuiTab-root": {
                color: "#404258",
                fontWeight: 700,
                fontFamily: "Poppins",
                textTransform: "none",
              },
            }}
            label="Present Role"
          />
        </Tabs>
        {isEditing ? (
          <Button
            variant="outlined"
            onClick={handleSaveClick}
            disabled={isSaving}
             sx={{
                height: "35px",
                bgcolor: isSaving ? "grey.400" : "#3C7EFC",
                color: "white",
                "&:hover": { bgcolor: "#3361cb" },
                mt:2
              }}
          >
            Save
          </Button>
        ) : (
          <IconButton onClick={handleEditClick}>
            <EditIcon sx={{ color: "#404258" }} />
          </IconButton>
        )}
      </Box>

      {/* Experience Card */}
      <Card
        variant="outlined"
        sx={{ p: 3, borderRadius: 2, border: "1px solid #00000040" }}
      >
        <Grid container spacing={2}>
          {/* Current Company */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Current Company
            </Typography>
            {isEditing ? (
              <TextField
                size="small"
                fullWidth
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 16,
                    height: "35px",
                  },
                  width: "95%",
                  mt: 1,
                }}
              />
            ) : (
              <Typography
                variant="subtitle1"
                fontWeight="400"
                fontSize="14px"
                color="#808195"
                fontFamily="Poppins"
              >
                {formData.currentCompany || "N/A"}
              </Typography>
            )}
          </Grid>

          {/* Current Designation */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Designation
            </Typography>
            {isEditing ? (
              <TextField
                size="small"
                fullWidth
                name="currentDesignation"
                value={formData.currentDesignation}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 16,
                    height: "35px",
                  },
                  width: "95%",
                  mt: 1,
                }}
              />
            ) : (
              <Typography
                variant="subtitle1"
                fontWeight="400"
                fontSize="14px"
                color="#808195"
                fontFamily="Poppins"
              >
                {formData.currentDesignation || "N/A"}
              </Typography>
            )}
          </Grid>

          {/* Experience */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Experience (Years)
            </Typography>
            {isEditing ? (
              <FormControl sx={{ width: "95%", mt: 1 }} size="small">
                <Select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  sx={{
                    borderRadius: 16,
                    height: "35px",
                  }}
                >
                  <MenuItem value="">Select experience</MenuItem>
                  {Array.from({ length: 15 }, (_, i) => (
                    <MenuItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}+
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography
                variant="subtitle1"
                fontWeight="400"
                fontSize="14px"
                color="#808195"
                fontFamily="Poppins"
              >
                {formData.experience ? `${formData.experience}+ years` : "N/A"}
              </Typography>
            )}
          </Grid>

          {/* Current Salary */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Current Salary (INR Lakhs)
            </Typography>
            {isEditing ? (
              <TextField
                size="small"
                fullWidth
                type="number"
                name="currentSalary"
                value={formData.currentSalary}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 16,
                    height: "35px",
                  },
                  width: "95%",
                  mt: 1,
                }}
              />
            ) : (
              <Typography
                variant="subtitle1"
                fontWeight="400"
                fontSize="14px"
                color="#808195"
                fontFamily="Poppins"
              >
                {formData.currentSalary ? `${formData.currentSalary} Lakhs` : "N/A"}
              </Typography>
            )}
          </Grid>

          {/* Is it a Consulting Company */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Is it a Consulting Company?
            </Typography>
            {isEditing ? (
              <FormControl component="fieldset" sx={{ mt: 1 }}>
                <RadioGroup
                  row
                  name="isItConsultingCompany"
                  value={formData.isItConsultingCompany}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            ) : (
              <Typography
                variant="subtitle1"
                fontWeight="400"
                fontSize="14px"
                color="#808195"
                fontFamily="Poppins"
              >
                {formData.isItConsultingCompany || "N/A"}
              </Typography>
            )}
          </Grid>

          {/* When joined consulting */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              When did you first join Consulting?
            </Typography>
            {isEditing ? (
              <FormControl component="fieldset" sx={{ mt: 1 }}>
                <RadioGroup
                  row
                  name="joinConsulting"
                  value={formData.joinConsulting}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Lateral"
                    control={<Radio />}
                    label="Lateral"
                  />
                  <FormControlLabel
                    value="Out of campus"
                    control={<Radio />}
                    label="Out of Campus"
                  />
                </RadioGroup>
              </FormControl>
            ) : (
              <Typography
                variant="subtitle1"
                fontWeight="400"
                fontSize="14px"
                color="#808195"
                fontFamily="Poppins"
              >
                {formData.joinConsulting || "N/A"}
              </Typography>
            )}
          </Grid>

          {/* Open to Relocate */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Open to Relocate
            </Typography>
            {isEditing ? (
              <FormControl component="fieldset" sx={{ mt: 1 }}>
                <RadioGroup
                  row
                  name="openToRelocate"
                  value={formData.openToRelocate}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            ) : (
              <Typography
                variant="subtitle1"
                fontWeight="400"
                fontSize="14px"
                color="#808195"
                fontFamily="Poppins"
              >
                {formData.openToRelocate || "N/A"}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default Experience;