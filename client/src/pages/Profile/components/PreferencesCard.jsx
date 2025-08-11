import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  IconButton,
  Button,
  TextField,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUser } from "../../../redux/userSlice";
import Select from "react-select";

const PreferencesCard = ({ userInfo }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); // Assume user contains the token and potentially updated jobPreferences
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    workMode: [],
    jobType: [],
    preferredLocations: [], // This will store the actual values to be saved (city names or the "Other" text)
    expectedSalary: "",
  });

  // State for react-select controlled component for locations
  const [selectedLocations, setSelectedLocations] = useState([]);
  // State for the 'Other' location text input
  const [otherLocation, setOtherLocation] = useState("");

  // State to store validation errors
  const [validationErrors, setValidationErrors] = useState({
    workMode: "",
    jobType: "",
    preferredLocations: "", // This error will cover both empty selection and empty 'Other' text
    expectedSalary: "",
  });


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

  // State for the list of cities fetched from CSV
  const [cities, setCities] = useState([]);

  // Fetch cities from CSV
  useEffect(() => {
    const fetchCities = async () => {
      try {
        // Adjust the path if necessary based on where the CSV is served
        const response = await fetch("/cities.csv");
        const text = await response.text();
        const rows = text.split("\n");
        const cityList = rows
          .slice(1) // Skip header row
          .map((row) => row.trim())
          .filter(Boolean)
          .sort(); // Sort cities alphabetically
        setCities([...new Set(cityList)]); // Use Set to remove duplicates
      } catch (error) {
        console.error("Error loading cities:", error);
        setCities([]);
      }
    };
    fetchCities();
  }, []); // Run once on component mount

  // Effect to sync data from userInfo prop to local state (formData, selectedLocations, otherLocation)
  useEffect(() => {
    if (userInfo) {
      const initialData = {
        workMode: userInfo.preferredWorkModes || [],
        jobType: userInfo.preferredWorkTypes || [],
        preferredLocations: userInfo.preferredLocations || [],
        expectedSalary: userInfo.expectedMinSalary || "",
      };
      setFormData(initialData);

      // Determine initial selectedLocations for react-select
      let initialSelected = (initialData.preferredLocations || []).map((loc) => ({
        value: loc,
        label: loc,
      }));

      // Handle the case where the loaded data's preferredLocation is a single string
      // This assumes if 'Other' was previously saved, it was saved as a single string value
      // rather than the literal 'Other' label.
      // If userInfo.preferredLocations is an array containing exactly one item
      // AND that item is NOT in the fetched cities list, assume it was a custom "Other" location.
       if (initialData.preferredLocations.length === 1 && cities.length > 0) {
           const savedLocation = initialData.preferredLocations[0];
           if (!cities.includes(savedLocation)) {
               // It's likely a previously saved custom location
               initialSelected = [{ value: "Other", label: "Other" }];
               setOtherLocation(savedLocation); // Populate the 'Other' text field
           } else {
               // It's a city from the list
               initialSelected = [{ value: savedLocation, label: savedLocation }];
               setOtherLocation(""); // Ensure otherLocation is empty
           }
       } else if (initialData.preferredLocations.length > 1) {
            // Multiple locations selected from the city list
           initialSelected = (initialData.preferredLocations || []).map((loc) => ({
               value: loc,
               label: loc,
           }));
           setOtherLocation(""); // Ensure otherLocation is empty
       } else {
            // preferredLocations is empty or null/undefined initially
            initialSelected = [];
            setOtherLocation("");
       }

      setSelectedLocations(initialSelected);
      // No validation needed here on load unless you want button disabled on initial load if data is bad
       // const initialErrors = validateForm(initialData, initialSelected, otherLocation);
       // setValidationErrors(initialErrors);
    }
  }, [userInfo, cities]); // Re-run if userInfo or cities data changes

  // Validation function
  const validateForm = (currentFormData, currentSelectedLocations, currentOtherLocation) => {
    const errors = {};

    // Validate Work Mode (Required - at least one)
    if (!currentFormData.workMode || currentFormData.workMode.length === 0) {
      errors.workMode = "At least one Work Mode is required.";
    } else {
      errors.workMode = "";
    }

    // Validate Job Type (Required - at least one)
    if (!currentFormData.jobType || currentFormData.jobType.length === 0) {
      errors.jobType = "At least one Job Type is required.";
    } else {
      errors.jobType = "";
    }

    // Validate Preferred Locations (Required - at least one + handle 'Other')
    if (!currentSelectedLocations || currentSelectedLocations.length === 0) {
      errors.preferredLocations = "At least one Preferred Location is required.";
    } else {
        // Check if 'Other' is selected
        const otherSelected = currentSelectedLocations.some(opt => opt.value === "Other");
        if (otherSelected && (!currentOtherLocation || currentOtherLocation.trim() === "")) {
             errors.preferredLocations = "Please specify the other location.";
        } else {
             errors.preferredLocations = ""; // Clear error if valid
        }
    }

    // Validate Expected Salary (Required, Numeric, Max 1000, No negatives)
    const salary = parseFloat(currentFormData.expectedSalary);
    if (!currentFormData.expectedSalary || currentFormData.expectedSalary.trim() === "") {
         errors.expectedSalary = "Expected Salary is required.";
    } else if (isNaN(salary)) {
         errors.expectedSalary = "Please enter a valid number.";
    } else if (salary > 1000) {
      errors.expectedSalary = "Expected Salary cannot exceed 1000 LPA.";
    }
     else if (salary < 0) { // Optional: prevent negative salary
        errors.expectedSalary = "Salary cannot be negative.";
     }
     else {
      errors.expectedSalary = ""; // Clear error if valid
    }

    return errors;
  };


  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: 4,
      width: "100%",
      fontSize: "0.875rem",
      borderRadius: 4, // Changed from 50 to default MUI-like
      borderColor: state.isFocused ? '#3B82F6' : provided.borderColor, // Example focus color
      boxShadow: state.isFocused ? '0 0 0 1px #3B82F6' : null, // Example focus shadow
    }),
     multiValue: (provided) => ({
         ...provided,
         backgroundColor: "#E3EDFF", // Chip background color
         color: "#474E68", // Chip text color
         borderRadius: 16, // Chip border radius
         fontFamily: "Poppins",
         fontSize: "12px", // Smaller font size for chips
         margin: "2px", // Spacing between chips
     }),
      multiValueLabel: (provided) => ({
          ...provided,
          color: "#474E68",
          fontFamily: "Poppins",
      }),
      multiValueRemove: (provided) => ({
         ...provided,
          color: "#474E68",
         ':hover': {
             backgroundColor: '#FFDCDC', // Hover background
             color: '#D9534F', // Hover icon color
          },
      }),
    menu: (provided) => ({
      ...provided,
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      border: "1px solid #d1d5db",
      zIndex: 9999, // Ensure menu is above other elements
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#E3EDFF" : "white", // Selected option background
      color: state.isSelected ? "#474E68" : "black", // Selected option text color
      "&:hover": {
        backgroundColor: "#f3f4f6", // Hover background
      },
    }),
     placeholder: (provided) => ({
         ...provided,
         color: "#808195", // Placeholder color
         fontSize: "0.875rem",
     }),
      dropdownIndicator: (provided) => ({
          ...provided,
           padding: 4, // Adjust padding
      }),
       clearIndicator: (provided) => ({
          ...provided,
           padding: 4, // Adjust padding
      }),
       indicatorSeparator: (provided) => ({
            ...provided,
             display: 'none', // Hide the separator line
       }),
  };

  const handleEditClick = () => {
    setIsEditing(true);
    // Validate current data when entering edit mode
    const initialErrors = validateForm(formData, selectedLocations, otherLocation);
    setValidationErrors(initialErrors);
  };

  const handleCancelClick = () => {
    // Reset form data and selected locations to initial user info
    if (userInfo) {
      const initialData = {
        workMode: userInfo.preferredWorkModes || [],
        jobType: userInfo.preferredWorkTypes || [],
        preferredLocations: userInfo.preferredLocations || [],
        expectedSalary: userInfo.expectedMinSalary || "",
      };
      setFormData(initialData);

       let initialSelected = (initialData.preferredLocations || []).map((loc) => ({
           value: loc,
           label: loc,
       }));

       // Re-apply logic to determine if it was a custom 'Other' location
       if (initialData.preferredLocations.length === 1 && cities.length > 0) {
            const savedLocation = initialData.preferredLocations[0];
            if (!cities.includes(savedLocation)) {
                initialSelected = [{ value: "Other", label: "Other" }];
                setOtherLocation(savedLocation);
            } else {
                 initialSelected = [{ value: savedLocation, label: savedLocation }];
                 setOtherLocation("");
            }
       } else if (initialData.preferredLocations.length > 1) {
           initialSelected = (initialData.preferredLocations || []).map((loc) => ({
               value: loc,
               label: loc,
           }));
           setOtherLocation("");
       } else {
           initialSelected = [];
           setOtherLocation("");
       }

      setSelectedLocations(initialSelected);
    }
    setIsEditing(false);
     // Clear validation errors when cancelling
     setValidationErrors({
         workMode: "",
         jobType: "",
         preferredLocations: "",
         expectedSalary: "",
     });
  };

  const handleSelectChange = (field, selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    const newFormData = {
      ...formData,
      [field]: selectedValues,
    };
    setFormData(newFormData);

    // Validate after state update
    // Note: Validation of 'locations' relies on selectedLocations and otherLocation states
    const updatedErrors = validateForm(newFormData, selectedLocations, otherLocation);
    setValidationErrors(updatedErrors);
  };

  const handleLocationChange = (selectedOptions) => {
    const newLocations = selectedOptions || [];
    const hasOther = newLocations.some(opt => opt.value === "Other");

    let limitedLocations;
    if (hasOther) {
        // If 'Other' is selected, ensure only 'Other' is in the list and clear other locations
        limitedLocations = newLocations.filter(opt => opt.value === "Other");
         // Keep existing otherLocation text if available, or clear if 'Other' was just added
        // The formData update will happen in handleOtherLocationChange if text exists,
        // or will be handled below if 'Other' was just selected and text is empty.
    } else {
        // Limit to 5 locations if 'Other' is not selected
        limitedLocations = newLocations.slice(0, 5);
         setOtherLocation(""); // Clear otherLocation if 'Other' is deselected
    }

    setSelectedLocations(limitedLocations);

    // Update formData based on the new selectedLocations list
     const newFormData = {
         ...formData,
         preferredLocations: hasOther
             ? (otherLocation.trim() !== "" ? [otherLocation] : []) // If 'Other' selected and text exists, use text
             : limitedLocations.map(loc => loc.value), // Otherwise use selected city values
     };
    setFormData(newFormData);

     // Validate after state update (use the updated formData for location validation)
     const updatedErrors = validateForm(newFormData, limitedLocations, otherLocation);
    setValidationErrors(updatedErrors);
  };


  const handleOtherLocationChange = (e) => {
    const value = e.target.value;
    setOtherLocation(value);

    // Update formData.preferredLocations only if "Other" is selected in react-select
    const hasOther = selectedLocations.some(loc => loc.value === "Other");
    let newFormData = formData;
    if (hasOther) {
       newFormData = {
          ...formData,
          preferredLocations: [value], // Replace the placeholder/empty array with the custom value
       };
       setFormData(newFormData);
    } else {
        // If "Other" was deselected but the text field somehow still has value,
        // clear it or ignore its value for formData unless 'Other' is re-selected.
        // In this implementation, we clear otherLocation if 'Other' is deselected in handleLocationChange.
        // So this case shouldn't happen unless there's a complex interaction.
        // We'll rely on the logic in handleLocationChange and the validation to cover this.
    }


    // Validate after state update (use the potentially updated formData and the new otherLocation)
    const updatedErrors = validateForm(newFormData, selectedLocations, value);
    setValidationErrors(updatedErrors);
  };


  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    const newFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(newFormData);

     // Validate after state update
     const updatedErrors = validateForm(newFormData, selectedLocations, otherLocation);
    setValidationErrors(updatedErrors);
  };

  const handleSaveClick = async () => {
    // Perform final validation before saving
    // Note: We need the latest states for validation
    const finalErrors = validateForm(formData, selectedLocations, otherLocation);
    setValidationErrors(finalErrors);

    // Check if there are any errors in the final validation result
    const isValid = Object.values(finalErrors).every(error => error === '');

    if (!isValid) {
      console.log("Validation failed. Cannot save.");
      return; // Stop the save process if validation fails
    }

    // If validation passes, prepare payload and proceed with saving
    setIsSaving(true);

    // The formData.preferredLocations state already contains the correct value
    // ('Other' text if 'Other' is selected, or city names otherwise)
    // due to the updates in handleLocationChange and handleOtherLocationChange.
    const payload = {
        ...formData,
        // Ensure salary is sent as a number if backend expects it as such.
        // parseFloat handles potential non-numeric input gracefully (results in NaN),
        // which our validation already catches. Sending NaN might be okay or not
        // depending on the backend; a safe bet is to send null or 0 if it's not a valid number.
        // However, our validation ensures it *is* a valid number <= 1000 if we reach here.
        expectedSalary: parseFloat(formData.expectedSalary)
    };


    console.log("Payload being sent:", payload); // Keep if needed for debugging

    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/user/updateJobPreferences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`, // Ensure token is included
          },
          body: JSON.stringify({
            user: { userId: userInfo?._id }, // Check user ID structure expected by backend
            jobPreferences: payload,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // FIXED: Update Redux with the complete updated user object from the backend
        //console.log("Backend response:", result); // Debug log
        
        // The backend returns the complete updated user object in result.user
        dispatch(UpdateUser(result.user)); // Use the complete user object from backend
        
        setIsEditing(false);
         // Clear validation errors on successful save
         setValidationErrors({
             workMode: "",
             jobType: "",
             preferredLocations: "",
             expectedSalary: "",
         });
      } else {
        console.error("Failed to save preferences:", result.message);
        // Optionally display a general error message to the user
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
       // Optionally display a general error message to the user
    } finally {
      setIsSaving(false);
    }
  };

  // Prepare location options with "Other" at the bottom
  // Memoize this if cities list is very large or frequently updated
  const locationOptions = React.useMemo(() => {
      const cityOptions = cities.map((city) => ({ value: city, label: city }));
      return [...cityOptions, { value: "Other", label: "Other" }];
  }, [cities]); // Recreate options only if cities list changes


  // Determine if the Save button should be disabled
   const isSaveButtonDisabled = isSaving || Object.values(validationErrors).some(error => error !== '');


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
              variant="contained" // Changed to contained for better visual distinction of primary action
              onClick={handleSaveClick}
              disabled={isSaveButtonDisabled} // Use the calculated disabled state
              sx={{
                 height: "35px", // Added height for consistency
                // Style disabled state differently
                bgcolor: isSaveButtonDisabled ? "grey.400" : "#3C7EFC",
                color: "white",
                "&:hover": { bgcolor: isSaveButtonDisabled ? "grey.400" : "#3361cb" },
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
                 {/* Display logic for saved 'Other' location */}
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
                Work Mode <Box component="span" sx={{ color: 'red' }}>*</Box>
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
                // Add error border and helper text for Select component manually
                 sx={{
                    borderColor: validationErrors.workMode ? 'red' : undefined,
                    '&:hover': {
                       borderColor: validationErrors.workMode ? 'red' : undefined,
                    },
                    // react-select doesn't have an 'error' prop like MUI TextField
                 }}
              />
               {validationErrors.workMode && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {validationErrors.workMode}
                  </Typography>
              )}
            </Grid>

            {/* Job Type */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Job Type <Box component="span" sx={{ color: 'red' }}>*</Box>
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
                 sx={{
                    borderColor: validationErrors.jobType ? 'red' : undefined,
                    '&:hover': {
                       borderColor: validationErrors.jobType ? 'red' : undefined,
                    },
                 }}
              />
               {validationErrors.jobType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {validationErrors.jobType}
                  </Typography>
              )}
            </Grid>

            {/* Preferred Locations */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Preferred Locations (max 5) <Box component="span" sx={{ color: 'red' }}>*</Box>
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
                 sx={{
                    borderColor: validationErrors.preferredLocations ? 'red' : undefined,
                    '&:hover': {
                       borderColor: validationErrors.preferredLocations ? 'red' : undefined,
                    },
                 }}
              />
               {validationErrors.preferredLocations && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {validationErrors.preferredLocations}
                  </Typography>
              )}

              {selectedLocations.some((loc) => loc.value === "Other") && (
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter your location"
                  value={otherLocation}
                  onChange={handleOtherLocationChange}
                   error={!!validationErrors.preferredLocations} // Use location error for this too
                   helperText={validationErrors.preferredLocations} // Display error here if Other text is missing
                   FormHelperTextProps={{
                        // Add a class or style to position helper text correctly if needed
                         sx: { mt: validationErrors.preferredLocations ? 0.5 : 0, mx: 0 }, // Adjust margin if error is shown
                   }}
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>

            {/* Expected Salary */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Expected Salary (LPA) <Box component="span" sx={{ color: 'red' }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="Enter expected salary"
                value={formData.expectedSalary}
                onChange={handleInputChange("expectedSalary")}
                error={!!validationErrors.expectedSalary} // Set error prop based on state
                helperText={validationErrors.expectedSalary} // Display error message
                 InputProps={{
                    inputProps: { min: 0 }, // Suggest non-negative input
                   endAdornment: (
                     <Typography variant="body2" color="text.secondary">
                       LPA
                     </Typography>
                   ),
                 }}
                 sx={{
                    // Remove default type="number" spin buttons
                    '& input[type=number]': {
                       '-moz-appearance': 'textfield'
                    },
                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                       '-webkit-appearance': 'none',
                       margin: 0
                    }
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