import React, { useState, useEffect, useMemo } from "react"; // Import useMemo
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
  const user = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    workMode: [],
    jobType: [],
    preferredLocations: [], // This will store the actual values to be saved
    expectedSalary: "",
  });

  const [cities, setCities] = useState([]);
  // This state tracks the selected options for the react-select component
  const [selectedLocations, setSelectedLocations] = useState([]);
  // This state tracks the value in the 'Other' text field
  const [otherLocation, setOtherLocation] = useState("");

  // State to store validation errors for each field
  const [validationErrors, setValidationErrors] = useState({
    workMode: "",
    jobType: "",
    preferredLocations: "", // Covers both empty selection and empty 'Other' text
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

  // Fetch cities from CSV
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/cities.csv"); // Make sure this path is correct for your project structure
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
  }, []); // Run once on mount

  // Effect to load user data into form state when userInfo prop changes
  useEffect(() => {
    if (userInfo) {
      const initialData = {
        workMode: userInfo.preferredWorkModes || [],
        jobType: userInfo.preferredWorkTypes || [],
        preferredLocations: userInfo.preferredLocations || [], // This is the saved value(s)
        expectedSalary: userInfo.expectedMinSalary || "",
      };

      setFormData(initialData);

      // Determine initial selectedLocations for react-select and otherLocation text
      let initialSelected = [];
      let initialOtherLocation = "";

      if (initialData.preferredLocations && initialData.preferredLocations.length > 0) {
          const savedLocations = initialData.preferredLocations;
          // If there's only one saved location and it's not in the cities list, assume it's a custom 'Other' location
          if (savedLocations.length === 1 && cities.length > 0 && !cities.includes(savedLocations[0])) {
               initialSelected = [{ value: "Other", label: "Other" }];
               initialOtherLocation = savedLocations[0]; // Set the custom value
           } else {
               // Otherwise, map the saved locations to react-select options
               initialSelected = savedLocations.map((loc) => ({
                   value: loc,
                   label: loc,
               }));
               initialOtherLocation = ""; // Ensure otherLocation is empty if not 'Other'
           }
      }

      setSelectedLocations(initialSelected);
      setOtherLocation(initialOtherLocation);

      // Note: Validation is not run here on load, it will run on handleEditClick
    }
  }, [userInfo, cities]); // Depend on userInfo and cities (since cities affect interpretation of saved location)

  // Validation function - adapted to take relevant state pieces
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

    // Validate Preferred Locations (Required - at least one + handle 'Other' text)
    // Validation logic should use the state variables that directly reflect user interaction
     if (!currentSelectedLocations || currentSelectedLocations.length === 0) {
         errors.preferredLocations = "At least one Preferred Location is required.";
     } else {
         // Check if 'Other' is selected in the react-select component
         const otherSelected = currentSelectedLocations.some(opt => opt.value === "Other");
         if (otherSelected) {
              // If 'Other' is selected, check if the 'Other' text field is empty
             if (!currentOtherLocation || currentOtherLocation.trim() === "") {
                 errors.preferredLocations = "Please specify the other location.";
             } else {
                 errors.preferredLocations = ""; // Clear error if 'Other' text is provided
             }
         } else {
             // If 'Other' is NOT selected, just ensure at least one location was picked (already checked above)
             errors.preferredLocations = ""; // Clear error if valid selection made
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
     else if (salary < 0) {
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
      borderRadius: 4,
      borderColor: state.isFocused ? '#3B82F6' : provided.borderColor,
      boxShadow: state.isFocused ? '0 0 0 1px #3B82F6' : null,
      // Add error border based on validationErrors state
      border: validationErrors.workMode && state.selectProps.name === 'workMode' ? '1px solid red' :
              validationErrors.jobType && state.selectProps.name === 'jobType' ? '1px solid red' :
              validationErrors.preferredLocations && state.selectProps.name === 'preferredLocations' ? '1px solid red' :
              provided.border,

    }),
     multiValue: (provided) => ({
         ...provided,
         backgroundColor: "#E3EDFF",
         color: "#474E68",
         borderRadius: 16,
         fontFamily: "Poppins",
         fontSize: "12px",
         margin: "2px",
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
             backgroundColor: '#FFDCDC',
             color: '#D9534F',
          },
      }),
    menu: (provided) => ({
      ...provided,
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      border: "1px solid #d1d5db",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#E3EDFF" : "white",
      color: state.isSelected ? "#474E68" : "black",
      "&:hover": {
        backgroundColor: "#f3f4f6",
      },
    }),
     placeholder: (provided) => ({
         ...provided,
         color: "#808195",
         fontSize: "0.875rem",
     }),
      dropdownIndicator: (provided) => ({
          ...provided,
           padding: 4,
      }),
       clearIndicator: (provided) => ({
          ...provided,
           padding: 4,
      }),
       indicatorSeparator: (provided) => ({
            ...provided,
             display: 'none',
       }),
  };


  const handleEditClick = () => {
    setIsEditing(true);
    // Validate current data when entering edit mode to show initial errors if any
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

       let initialSelected = [];
       let initialOtherLocation = "";

       if (initialData.preferredLocations && initialData.preferredLocations.length > 0) {
           const savedLocations = initialData.preferredLocations;
           // If only one saved location and not a city, assume it's custom 'Other'
           if (savedLocations.length === 1 && cities.length > 0 && !cities.includes(savedLocations[0])) {
                initialSelected = [{ value: "Other", label: "Other" }];
                initialOtherLocation = savedLocations[0];
            } else {
                initialSelected = savedLocations.map((loc) => ({
                    value: loc,
                    label: loc,
                }));
                initialOtherLocation = "";
            }
       }

      setSelectedLocations(initialSelected);
      setOtherLocation(initialOtherLocation);
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

  const handleSelectChange = (field) => (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    const newFormData = {
      ...formData,
      [field]: selectedValues,
    };
    setFormData(newFormData);

    // Validate after state update
    // Note: Locations validation needs selectedLocations and otherLocation
    const updatedErrors = validateForm(newFormData, selectedLocations, otherLocation);
    setValidationErrors(updatedErrors);
  };

  const handleLocationChange = (selectedOptions) => {
    const newLocations = selectedOptions || [];
    const hasOther = newLocations.some(opt => opt.value === "Other");

    let limitedLocations;
    let updatedOtherLocation = otherLocation; // Keep existing otherLocation value by default

    if (hasOther) {
        // If 'Other' is selected, keep only 'Other' in the selection
        limitedLocations = newLocations.filter(opt => opt.value === "Other");
        // If 'Other' was just selected, and otherLocation is empty, don't clear it immediately.
        // The validation will handle the required text input.
    } else {
        // Limit to 5 locations if 'Other' is not selected
        limitedLocations = newLocations.slice(0, 5);
         updatedOtherLocation = ""; // Clear otherLocation if 'Other' is deselected
    }

    setSelectedLocations(limitedLocations);
    setOtherLocation(updatedOtherLocation); // Update otherLocation state

    // Update formData based on the new selectedLocations and potentially cleared otherLocation
    const newFormData = {
        ...formData,
        preferredLocations: hasOther
            ? (updatedOtherLocation.trim() !== "" ? [updatedOtherLocation] : []) // If 'Other' selected & text exists, use text
            : limitedLocations.map(loc => loc.value), // Otherwise use selected city values
    };
    setFormData(newFormData);


     // Validate after state update with the new states
    const updatedErrors = validateForm(newFormData, limitedLocations, updatedOtherLocation);
    setValidationErrors(updatedErrors);
  };


  const handleOtherLocationChange = (e) => {
    const value = e.target.value;
    setOtherLocation(value); // Update otherLocation state

    // Update formData.preferredLocations only if "Other" is selected in react-select
    const hasOther = selectedLocations.some(loc => loc.value === "Other");
    let newFormData = formData; // Start with current formData
    if (hasOther) {
       newFormData = {
          ...formData,
          preferredLocations: [value], // Replace the placeholder/empty array with the custom value
       };
       setFormData(newFormData); // Update formData state if needed
    }
    // Note: If 'Other' is NOT selected in react-select, changing this text field
    // does NOT affect formData.preferredLocations in this logic, which is correct.

    // Validate after state update using the potentially updated formData and the new otherLocation value
    const updatedErrors = validateForm(newFormData, selectedLocations, value);
    setValidationErrors(updatedErrors);
  };


  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    const newFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(newFormData); // Update formData state

     // Validate after state update
     const updatedErrors = validateForm(newFormData, selectedLocations, otherLocation);
    setValidationErrors(updatedErrors);
  };

  const handleSaveClick = async () => {
    // Perform final validation using the current states
    const finalErrors = validateForm(formData, selectedLocations, otherLocation);
    setValidationErrors(finalErrors);

    // Check if there are any errors in the final validation result
    const isValid = Object.values(finalErrors).every(error => error === '');

    if (!isValid) {
      console.log("Validation failed. Cannot save.");
      // The errors are already displayed via setValidationErrors
      return; // Stop the save process if validation fails
    }

    // If validation passes, prepare payload and proceed with saving
    setIsSaving(true);

    // The formData.preferredLocations state should already hold the correct final values
    // (custom text if 'Other' selected, or city names otherwise)
    const payload = {
        ...formData,
        // Ensure salary is sent as a number. parseFloat results in NaN if not a number,
        // but validation ensures it *is* a valid number <= 1000 here.
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
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            user: { userId: userInfo?._id },
            jobPreferences: payload, // Send the validated payload
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Update the user state in Redux
        // Assuming the API response contains the updated jobPreferences object
        const updatedUser = {
             ...user, // Keep other user properties
             jobPreferences: result.jobPreferences // Use the updated data from the API response
        };
        dispatch(UpdateUser(updatedUser)); // Dispatch action
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
        // Optionally display API error message to the user
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
       // Optionally display network/other error message to the user
    } finally {
      setIsSaving(false);
    }
  };

  // Prepare location options with "Other" at the bottom
  // Use useMemo to prevent recreating this array unnecessarily on every render
  const locationOptions = useMemo(() => {
      const cityOptions = cities.map((city) => ({ value: city, label: city }));
      return [...cityOptions, { value: "Other", label: "Other" }];
  }, [cities]); // Only re-calculate if the cities list changes

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
              variant="contained" // Use contained for primary action
              onClick={handleSaveClick}
              disabled={isSaveButtonDisabled} // Disable based on validation/saving state
              sx={{
                height: "35px", // Added height
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
                name="workMode" // Add name prop to Select for customStyles
                options={workModeOptions}
                value={formData.workMode.map((mode) => ({
                  value: mode,
                  label: mode,
                }))}
                onChange={handleSelectChange("workMode")}
                styles={customStyles}
                placeholder="Select work modes..."
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
                 name="jobType" // Add name prop
                options={workTypeOptions}
                value={formData.jobType.map((type) => ({
                  value: type,
                  label: type,
                }))}
                onChange={handleSelectChange("jobType")}
                styles={customStyles}
                placeholder="Select job types..."
                menuPosition="fixed"
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
                 name="preferredLocations" // Add name prop
                options={locationOptions}
                value={selectedLocations} // Controlled by selectedLocations state
                onChange={handleLocationChange} // Custom handler for locations
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
               {/* Display error text below the Select component */}
               {validationErrors.preferredLocations && !selectedLocations.some((loc) => loc.value === "Other") && (
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
                  onChange={handleOtherLocationChange} // Custom handler for 'Other' text
                   // Show error state on this TextField if the location error exists
                   error={!!validationErrors.preferredLocations}
                   // Display helper text here *only* if the error is specific to the 'Other' field being empty
                   helperText={
                        validationErrors.preferredLocations && selectedLocations.some((loc) => loc.value === "Other")
                        ? validationErrors.preferredLocations
                        : '' // Don't show helper text otherwise
                   }
                   FormHelperTextProps={{
                         sx: { mt: validationErrors.preferredLocations ? 0.5 : 0, mx: 0 },
                   }}
                  sx={{ mt: 1 }}
                />
              )}
               {/* Display error text below the Other location TextField if it's the source of the error */}
               {/* This is redundant with the helperText on the TextField, but kept for clarity if needed */}
              {/* {validationErrors.preferredLocations && selectedLocations.some((loc) => loc.value === "Other") && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {validationErrors.preferredLocations}
                  </Typography>
              )} */}
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
                name="expectedSalary" // Add name prop
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