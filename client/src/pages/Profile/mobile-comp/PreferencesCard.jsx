import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  IconButton,
  TextField,
  Button,
  Grid,
  Chip, // Import Chip component
  CircularProgress, // Import CircularProgress component
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUser } from "../../../redux/userSlice";
import Select from "react-select";

const PreferencesCard = ({ userInfo }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    workMode: [],
    jobType: [],
    preferredLocations: [],
    expectedSalary: "",
  });

  const [cities, setCities] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [otherLocation, setOtherLocation] = useState("");

  const workModeOptions = ["Remote", "Hybrid", "Work From Office"].map((option) => ({
    value: option,
    label: option,
  }));

  const workTypeOptions = ["Full-Time", "Part-Time", "Contract", "Temporary"].map(
    (option) => ({
      value: option,
      label: option,
    })
  );

  // Fetch cities from CSV
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/cities.csv");
        const text = await response.text();
        const rows = text.split("\n");
        const cityList = rows
          .slice(1)
          .map((row) => row.trim())
          .filter(Boolean)
          .sort();
        setCities([...new Set(cityList)]);
      } catch (error) {
        console.error("Error loading cities:", error);
        setCities([]);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (userInfo) {
      const initialData = {
        workMode: userInfo.preferredWorkModes || [],
        jobType: userInfo.preferredWorkTypes || [],
        preferredLocations: userInfo.preferredLocations || [],
        expectedSalary: userInfo.expectedMinSalary || "",
      };
      setFormData(initialData);
      setSelectedLocations(
        initialData.preferredLocations.map((loc) => ({
          value: loc,
          label: loc,
        }))
      );
    }
  }, [userInfo]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: 4,
      width: "100%",
      fontSize: "0.875rem",
      //borderRadius: 50,
      //border: "1px solid #24252C",
      //boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
      //"&:hover": {
      //borderColor: "#d1d5db",
      //},
    }),
    menu: (provided) => ({
      ...provided,
      //borderRadius: 50,
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      border: "1px solid #d1d5db",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : "white",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: "#f3f4f6",
      },
    }),
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    if (userInfo) {
      setFormData({
        workMode: userInfo.preferredWorkModes || [],
        jobType: userInfo.preferredWorkTypes || [],
        preferredLocations: userInfo.preferredLocations || [],
        expectedSalary: userInfo.expectedMinSalary || "",
      });
      setSelectedLocations(
        (userInfo.preferredLocations || []).map((loc) => ({
          value: loc,
          label: loc,
        }))
      );
    }
    setIsEditing(false);
  };

  const handleSelectChange = (field, selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData((prev) => ({
      ...prev,
      [field]: selectedValues,
    }));
  };

  const handleLocationChange = (selectedOptions) => {
    const newLocations = selectedOptions || [];

    // Check if "Other" is selected
    const otherSelected = newLocations.some(opt => opt.value === "Other");

    // If "Other" is selected, keep only "Other" in the selection
    if (otherSelected) {
      setSelectedLocations([{ value: "Other", label: "Other" }]);
      setFormData(prev => ({
        ...prev,
        preferredLocations: ["Other"],
      }));
      setOtherLocation(""); // Clear other location when "Other" is selected
    } else {
      // Limit to 5 locations
      const limitedLocations = newLocations.slice(0, 5);
      setSelectedLocations(limitedLocations);
      setFormData(prev => ({
        ...prev,
        preferredLocations: limitedLocations.map(loc => loc.value),
      }));
      setOtherLocation(""); // Clear other location if "Other" is deselected
    }
  };


  const handleOtherLocationChange = (e) => {
    const value = e.target.value;
    setOtherLocation(value);

    // Update the form data with the custom location only if "Other" is selected
    if (selectedLocations.some(loc => loc.value === "Other")) {
      setFormData(prev => ({
        ...prev,
        preferredLocations: [value], // Replace "Other" with the actual value
      }));
    }
  };


  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      // If "Other" is selected, use the custom location value
      const finalLocations = selectedLocations.some(loc => loc.value === "Other")
        ? [otherLocation]
        : formData.preferredLocations;

      const payload = {
        ...formData,
        preferredLocations: finalLocations,
      };

      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/user/updateJobPreferences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            user: { userId: userInfo?._id },
            jobPreferences: payload,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Update the user state in Redux with the new preferences
        dispatch(UpdateUser({ ...user, jobPreferences: payload }));
        setIsEditing(false);
      } else {
        console.error("Failed to save preferences:", result.message);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Prepare location options with "Other" at the bottom
  const locationOptions = [
    ...cities.map((city) => ({ value: city, label: city })),
    { value: "Other", label: "Other" },
  ];

  return (
    <Box>
      {/* Tabs Section */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
            label="Job Preferences"
          />
        </Tabs>
        {isEditing ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={handleSaveClick}
              disabled={isSaving}
              sx={{
                bgcolor: isSaving ? "grey.400" : "#3C7EFC",
                color: "white", 
                "&:hover": { bgcolor: "#3361cb" },
              }}
            >
              {isSaving ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Save'
              )}
            </Button>
            <IconButton onClick={handleCancelClick}>
              <CloseIcon sx={{ color: "#D9534F" }} />
            </IconButton>
          </Box>
        ) : (
          <IconButton onClick={handleEditClick}>
            <EditIcon sx={{ color: "#404258" }} />
          </IconButton>
        )}
      </Box>

      {/* Display mode */}
      {!isEditing && (
        <Card
          variant="outlined"
          sx={{ p: 3, borderRadius: 2, border: "1px solid #00000040" }}
        >
          <Grid container spacing={3}>
            {/* Work Mode */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Work Mode
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.workMode && formData.workMode.length > 0 ? (
                  formData.workMode.map((mode) => (
                    <Chip
                      key={mode}
                      label={mode}
                      size="small"
                      sx={{ backgroundColor: "#E3EDFF",
                    color: "#474E68",
                    fontFamily: "Poppins", }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not specified
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Job Type */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Job Type
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.jobType && formData.jobType.length > 0 ? (
                  formData.jobType.map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      size="small"
                      sx={{backgroundColor: "#E3EDFF",
                        color: "#474E68",
                        fontFamily: "Poppins", }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not specified
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Preferred Locations */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Preferred Locations
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.preferredLocations && formData.preferredLocations.length > 0 ? (
                  formData.preferredLocations.map((location) => (
                    <Chip
                      key={location}
                      label={location}
                      size="small"
                      sx={{ backgroundColor: "#E3EDFF",
                        color: "#474E68",
                        fontFamily: "Poppins", }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not specified
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Expected Salary */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Expected Salary
              </Typography>
              <Typography variant="body1" color="text.primary">
                {formData.expectedSalary ? `${formData.expectedSalary} LPA` : "Not specified"}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Edit mode */}
      {isEditing && (
        <Card
          variant="outlined"
          sx={{ p: 3, borderRadius: 2, border: "1px solid #00000040" }}
        >
          <Grid container spacing={2}>
            {/* Work Mode */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Work Mode
              </Typography>
              <Select
                isMulti
                options={workModeOptions}
                value={formData.workMode.map((mode) => ({
                  value: mode,
                  label: mode,
                }))}
                onChange={(selected) => handleSelectChange("workMode", selected)}
                styles={customStyles}
                placeholder="Select work modes..."
              />
            </Grid>

            {/* Job Type */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Job Type
              </Typography>
              <Select
                isMulti
                options={workTypeOptions}
                value={formData.jobType.map((type) => ({
                  value: type,
                  label: type,
                }))}
                onChange={(selected) => handleSelectChange("jobType", selected)}
                styles={customStyles}
                placeholder="Select job types..."
                menuPosition="fixed"
              />
            </Grid>

            {/* Preferred Locations */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Preferred Locations (max 5)
              </Typography>
              <Select
                isMulti
                options={locationOptions}
                value={selectedLocations}
                onChange={handleLocationChange}
                styles={customStyles}
                placeholder="Search or select locations..."
                isClearable
                isSearchable
                closeMenuOnSelect={false}
                noOptionsMessage={() => "No matching locations found"}
                menuPortalTarget={document.body} 
                menuPosition="fixed"
                menuPlacement="bottom"
              />
              {selectedLocations.some((loc) => loc.value === "Other") && (
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter your location"
                  value={otherLocation}
                  onChange={handleOtherLocationChange}
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>

            {/* Expected Salary */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Expected Salary (LPA)
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="Enter expected salary"
                value={formData.expectedSalary}
                onChange={handleInputChange("expectedSalary")}
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" color="text.secondary">
                      LPA
                    </Typography>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Card>
      )}
    </Box>
  );
};

export default PreferencesCard;