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
  });

  // State to store validation errors
  const [validationErrors, setValidationErrors] = useState({
    currentCompany: "",
    currentDesignation: "",
    currentSalary: "",
    // Add other fields here if they become mandatory later
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
      });
       // Optional: Validate initial data when loaded, but will be validated on edit click anyway
       // const initialErrors = validateForm({
       //    currentCompany: experienceData.currentCompany || "",
       //    currentDesignation: experienceData.currentDesignation || "",
       //    currentSalary: experienceData.currentSalary || "",
       // });
       // setValidationErrors(initialErrors);
    }
  }, [experienceData]);

  const [isSaving, setIsSaving] = useState(false);

  // Validation function - Identical to the previous solution as the fields are the same
  const validateForm = (data) => {
    const errors = {};

    // Validate Current Company (Required)
    if (!data.currentCompany || data.currentCompany.trim() === "") {
      errors.currentCompany = "Current Company is required.";
    } else {
      errors.currentCompany = ""; // Clear error if valid
    }

    // Validate Current Designation (Required)
    if (!data.currentDesignation || data.currentDesignation.trim() === "") {
      errors.currentDesignation = "Designation is required.";
    } else {
      errors.currentDesignation = ""; // Clear error if valid
    }

    // Validate Current Salary (Required, Numeric, Max 1000, No negatives)
    const salary = parseFloat(data.currentSalary);
    if (!data.currentSalary || data.currentSalary.trim() === "") {
         errors.currentSalary = "Current Salary is required.";
    } else if (isNaN(salary)) {
         errors.currentSalary = "Please enter a valid number.";
    } else if (salary > 1000) {
      errors.currentSalary = "Salary cannot exceed 1000 lakhs.";
    }
     else if (salary < 0) {
        errors.currentSalary = "Salary cannot be negative.";
     }
     else {
      errors.currentSalary = ""; // Clear error if valid
    }

    // You can add validation for other fields here if needed

    return errors;
  };


  const handleEditClick = () => {
    setIsEditing(true);
    // Run validation immediately when entering edit mode to show initial errors if any
    const initialErrors = validateForm(formData);
    setValidationErrors(initialErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Validate the form data whenever a field changes for real-time feedback
    const updatedErrors = validateForm(newFormData);
    setValidationErrors(updatedErrors);

    // console.log("Updated formData:", newFormData); // Keep if needed for debugging
    // console.log("Updated validationErrors:", updatedErrors); // Keep if needed for debugging
  };

  const handleSaveClick = async () => {
    // Perform final validation before attempting to save
    const finalErrors = validateForm(formData);
    setValidationErrors(finalErrors);

    // Check if there are any errors
    const isValid = Object.values(finalErrors).every(error => error === '');

    if (!isValid) {
      console.log("Validation failed. Cannot save.");
      return; // Stop the save process if validation fails
    }

    // If validation passes, proceed with saving
    setIsSaving(true);
    console.log("Payload being sent:", formData); // Keep if needed for debugging

    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/user/updateWork",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: experienceData?._id,
            ...formData,
            // experience: Number(formData.experience) // Keep if needed
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        dispatch(UpdateUser(formData)); // Update Redux store
        setIsEditing(false);
        // Optionally clear errors on successful save
        // setValidationErrors({ currentCompany: "", currentDesignation: "", currentSalary: "" });
      } else {
        console.error("Failed to save experience:", result.message);
        // Handle API error display if necessary
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      // Handle network/other error display if necessary
    }
    setIsSaving(false);
  };

   // Determine if the Save button should be disabled
   // Disabled if currently saving OR if there are any validation errors
  const isSaveButtonDisabled = isSaving || Object.values(validationErrors).some(error => error !== '');


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
            disabled={isSaveButtonDisabled} // Use the calculated disabled state
            sx={{
              height: "35px",
              mt: 2,
              // Style disabled state differently
              bgcolor: isSaveButtonDisabled ? "grey.400" : "#3C7EFC",
              color: "white",
              "&:hover": { bgcolor: isSaveButtonDisabled ? "grey.400" : "#3361cb" },
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
                error={!!validationErrors.currentCompany} // Set error prop based on state
                helperText={validationErrors.currentCompany} // Display error message
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
                 error={!!validationErrors.currentDesignation} // Set error prop based on state
                 helperText={validationErrors.currentDesignation} // Display error message
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

          {/* Current Salary */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Current Salary (INR Lakhs)
            </Typography>
            {isEditing ? (
              <TextField
                size="small"
                fullWidth
                type="number" // Use type="number" for better user input, but validation is still needed
                name="currentSalary"
                value={formData.currentSalary}
                onChange={handleChange}
                error={!!validationErrors.currentSalary} // Set error prop based on state
                helperText={validationErrors.currentSalary} // Display error message
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 16,
                    height: "35px",
                  },
                  width: "95%",
                  mt: 1,
                }}
                // Optional: Prevent negative input directly in the field
                 InputProps={{
                   inputProps: { min: 0 }
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
                {formData.currentSalary
                  ? `${formData.currentSalary} Lakhs`
                  : "N/A"}
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
                  onChange={handleChange} // This handleChange will now trigger validation as well
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
                 {/* Add error/helper text here if this becomes mandatory */}
                 {/* {!!validationErrors.isItConsultingCompany && <Typography color="error" variant="caption">{validationErrors.isItConsultingCompany}</Typography>} */}
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
                  onChange={handleChange} // This handleChange will now trigger validation as well
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
                 {/* Add error/helper text here if this becomes mandatory */}
                 {/* {!!validationErrors.joinConsulting && <Typography color="error" variant="caption">{validationErrors.joinConsulting}</Typography>} */}
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
                  onChange={handleChange} // This handleChange will now trigger validation as well
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
                 {/* Add error/helper text here if this becomes mandatory */}
                 {/* {!!validationErrors.openToRelocate && <Typography color="error" variant="caption">{validationErrors.openToRelocate}</Typography>} */}
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