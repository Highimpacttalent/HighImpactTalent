import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Modal, // Import Modal
  Fade, // Optional: for modal transition
} from "@mui/material";
import dayjs from "dayjs";
// EditIcon and SaveIcon are no longer needed in the header
import WorkIcon from "@mui/icons-material/Work";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Delete, Add } from "@mui/icons-material";
import AlertModal from "../../../components/Alerts/view";
import "react-datepicker/dist/react-datepicker.css";
// InputMask, Visibility icons, axios, useDispatch, useSelector, AdapterDayjs, DatePicker, LocalizationProvider, UpdateUser imports remain the same
import axios from "axios";
import { useDispatch } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { UpdateUser } from "../../../redux/userSlice";
import { useSelector } from "react-redux";

// Modal style for centering
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" }, // Responsive width
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh", // Prevent modal from exceeding viewport height
  overflowY: "auto", // Add scroll if content overflows
};

const ExperienceHistory = ({ userId, experienceHistory, about }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [experiences, setExperiences] = useState(experienceHistory || []);
  const [desc, setDesc] = useState(false); // Controls visibility of Description *in the display list*
  // isEditing state is removed
  const [isSaving, setIsSaving] = useState(false); // Used for saving progress (Add or Delete)
  const [alert, setAlert] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });
  // State for the form *within the modal*
  const [newExperience, setNewExperience] = useState({
    companyName: "",
    designation: "",
    from: null, // Use null for DatePicker initially
    to: null, // Use null for DatePicker initially
    description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Sync local state when the prop changes (e.g., on initial load or after a successful save fetch)
    setExperiences(experienceHistory || []);
  }, [experienceHistory]);

  // Handler to open the modal and reset the form
  const handleOpenModal = () => {
    setNewExperience({
      companyName: "",
      designation: "",
      from: null,
      to: null,
      description: "",
    });
    setIsModalOpen(true);
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optional: Reset the form if closed without adding
    setNewExperience({
      companyName: "",
      designation: "",
      from: null,
      to: null,
      description: "",
    });
  };

  const handleInputChange = (e) => {
    // This handler is only used for text inputs in the modal form
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  };

  // Handler for DatePicker 'From'
  const handleFromChange = (date) => {
    setNewExperience((prev) => ({
      ...prev,
      from: date ? date.toISOString() : null, // Store as ISO string or null
    }));
  };

  // Handler for DatePicker 'To'
  const handleToChange = (date) => {
    setNewExperience((prev) => ({
      ...prev,
      to: date ? date.toISOString() : null, // Store as ISO string or null
    }));
  };

  // --- MODIFIED handleAddExperience ---
  // Adds the new experience from modal form to the local state AND SAVES IMMEDIATELY
  const handleAddExperience = async () => {
    // Basic validation
    if (!newExperience.companyName || !newExperience.designation) {
      setAlert({
        open: true,
        type: "warning",
        title: "Missing Fields",
        message: "Company Name and Designation are required.",
      });
      return;
    }

    const calculateExperienceYears = (history = []) => {
        if (!Array.isArray(history) || history.length === 0) return 0;
        let totalMonths = 0;
        const now = dayjs();
    
        for (const entry of history) {
          // entry.from / entry.to are stored as ISO strings (or null)
          const from = entry?.from ? dayjs(entry.from) : null;
          const to = entry?.to ? dayjs(entry.to) : now;
    
          if (!from || !from.isValid()) continue;
          const months = to.diff(from, "month") + 1; // inclusive
          if (months > 0) totalMonths += months;
        }
    
        return Math.floor(totalMonths / 12); // floor years (4.2 -> 4)
      };

    // Create a new experience object to add to the array
    const experienceToAdd = {
      companyName: newExperience.companyName,
      designation: newExperience.designation,
      // Ensure dates are stored consistently (e.g., ISO strings or null)
      from: newExperience.from,
      to: newExperience.to,
      description: newExperience.description,
    };

    // Create the updated array with the new experience
    const updatedExperiences = [...experiences, experienceToAdd];

    setIsSaving(true); // Start saving state
    try {
      // Save the entire updated array to the backend
      const resData = await updateExperienceHistory(userId, updatedExperiences);

      if (resData?.success) {
        dispatch(UpdateUser(resData?.user));
        setExperiences(resData?.user?.experienceHistory);

        setAlert({
          open: true,
          type: "success",
          title: "Success",
          message: "Experience added successfully!",
        });

        // Reset the form fields
        setNewExperience({
          companyName: "",
          designation: "",
          from: null,
          to: null,
          description: "",
        });
        // Close the modal
        handleCloseModal();
      } else {
        throw new Error(resData?.message || "Add failed");
      }
    } catch (error) {
      console.error(
        "Error while adding experience:",
        error?.response?.data?.message || error.message
      );
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message:
          error?.response?.data?.message ||
          "Failed to add experience. Please try again.",
      });
      // Consider rolling back the local state if the API failed to add it
      // setExperiences(experiences); // Revert to state before optimistic add (if you did an optimistic update)
    } finally {
      setIsSaving(false); // End saving state
    }
  };

  // --- MODIFIED handleDeleteExperience ---
  // Filters the local state array AND SAVES IMMEDIATELY
  const handleDeleteExperience = async (indexToDelete) => {
    // Filter the local state array
    const updatedExperiences = experiences.filter(
      (_, i) => i !== indexToDelete
    );

    // Optimistically update local state for immediate feedback
    setExperiences(updatedExperiences);

    setIsSaving(true); // Start saving state
    try {
      // Save the entire updated array to the backend
      const resData = await updateExperienceHistory(userId, updatedExperiences);

      if (resData?.success) {
        dispatch(UpdateUser(resData?.user)); // Update Redux which triggers useEffect
        setAlert({
          open: true,
          type: "success",
          title: "Success",
          message: "Experience deleted successfully!",
        });
      } else {
        // If API fails, show error and the useEffect will likely revert the local state
        // back to the server's version when Redux is updated (or on next component load)
        throw new Error(resData?.message || "Delete failed");
      }
    } catch (error) {
      console.error(
        "Error while deleting experience:",
        error?.response?.data?.message || error.message
      );
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message:
          error?.response?.data?.message ||
          "Failed to delete experience. Please try again.",
      });
      // The useEffect should handle syncing state on error, but a manual refetch could be added here if needed
    } finally {
      setIsSaving(false); // End saving state
    }
  };

  // updateExperienceHistory function remains the same, called by add/delete handlers
  const updateExperienceHistory = async (userId, experienceData) => {
    const computedYears = calculateExperienceYears(experienceData);
    try {
      const res = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/update-exp",
        {
          userId,
          experienceHistory: experienceData,
          experience: computedYears,
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error during API update:", error);
      throw error;
    }
  };

  // handleEditClick and handleSaveClick are removed

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={2}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {" "}
          {/* Added alignItems */}
          <AlertModal
            open={alert.open}
            onClose={() => setAlert({ ...alert, open: false })}
            type={alert.type}
            title={alert.title}
            message={alert.message}
          />
          <Tabs value={0} sx={{ mb: 0 }}>
            {" "}
            {/* Removed mb from Tabs */}
            <Tab
              sx={{
                "&.MuiTab-root": {
                  color: "#404258",
                  fontWeight: 700,
                  fontFamily: "Poppins",
                  textTransform: "none",
                },
              }}
              label="Experience"
            />
          </Tabs>
          {/* Removed Edit/Save buttons from the header */}
        </Box>

        {/* Existing Experiences Display */}
        {experiences.length === 0 ? (
          <Paper
            sx={{
              p: 2,
              mb: 2,
              textAlign: "center",
              border: "1px solid #00000040",
              borderRadius: 4,
            }}
          >
            <WorkIcon sx={{ fontSize: 48, color: "#00000040", mb: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Poppins",
                fontWeight: 550,

                mb: 1,
                color: "#24252C",
              }}
            >
              No work experience added yet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Poppins",
                color: "#555770",
                mb: 2,
              }}
            >
              Please add your work experience here to make your profile
              shine—and help recruiters see all your achievements!
            </Typography>
          </Paper>
        ) : (
          experiences.map((exp, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid #00000040",
                borderRadius: 4,
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                flexDirection={{ xs: "column", sm: "row" }}
              >
                <Box
                  display="flex"
                  sx={{
                    width: { xs: "100%", sm: "90%", md: "60%", lg: "60%" },
                  }} // Adjusted width
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                  justifyContent={"space-between"}
                  alignItems={{ xs: "flex-start", sm: "center" }} // Adjusted alignment for smaller screens
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "#24252C",
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: 600, // Added some weight
                      }}
                    >
                      Company Name:
                    </Typography>
                    <Typography
                      sx={{
                        color: "#808195",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                      }}
                    >
                      {exp.companyName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: "#24252C",
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      Designation:
                    </Typography>
                    <Typography
                      sx={{
                        color: "#808195",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                      }}
                    >
                      {exp.designation}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: "#24252C",
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      FROM:
                    </Typography>
                    <Typography
                      sx={{
                        color: "#808195",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                      }}
                    >
                      {/* Format date string for display */}
                      {exp.from ? dayjs(exp.from).format("MMM YYYY") : ""}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: "#24252C",
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      TO:
                    </Typography>
                    <Typography
                      sx={{
                        color: "#808195",
                        fontFamily: "Poppins",
                        fontSize: "12px",
                      }}
                    >
                      {/* Format date string for display */}
                      {exp.to ? dayjs(exp.to).format("MMM YYYY") : ""}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    mt: { xs: 2, sm: 0 },
                  }}
                >
                  {/* Show delete button always */}
                  <IconButton
                    onClick={() => handleDeleteExperience(index)}
                    disabled={isSaving}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              {/* Description box visibility controlled by `desc` state */}
              {/* NOTE: This currently toggles the description for ALL entries simultaneously based on the single `desc` state. If you want per-experience description toggle, `desc` should be an array or object. Keeping as is for now based on original code. */}
              {exp.description && ( // Only show description box if description exists
                <Box sx={{ mt: 1 }}>
                  <Typography
                    sx={{
                      color: "#24252C",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    Description:
                  </Typography>
                  <Typography
                    sx={{
                      color: "#808195",
                      fontFamily: "Poppins",
                      fontSize: "12px",
                      whiteSpace: "pre-wrap",
                    }} // Preserve line breaks
                  >
                    {exp.description}
                  </Typography>
                </Box>
              )}
            </Paper>
          ))
        )}

        {/* --- ADD EXPERIENCE BUTTON (Bottom Left) --- */}
        <Box sx={{ mt: 3, mb: 2 }}>
          {" "}
          {/* Added margin for spacing */}
          <Button
            variant="contained" // or 'outlined'
            startIcon={
              isSaving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Add />
              )
            } // Show loader icon when saving
            onClick={handleOpenModal}
            disabled={isSaving} // Disable button while saving any experience
            sx={{
              textTransform: "none",
              fontFamily: "Poppins", // Apply Poppins font
              // justifyContent: 'flex-start', // Align icon/text to the left if desired
            }}
          >
            {isSaving ? "Adding Experience..." : "Add Experience"}
          </Button>
        </Box>

        {/* --- ADD EXPERIENCE MODAL --- */}
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isModalOpen}>
            <Box sx={modalStyle}>
              <Typography
                variant="h6"
                component="h2"
                sx={{ mb: 3, fontFamily: "Poppins" }}
              >
                Add Work Experience
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="companyName"
                    label="Company Name"
                    fullWidth
                    value={newExperience.companyName}
                    onChange={handleInputChange}
                    required // Added required
                    error={isModalOpen && !newExperience.companyName} // Simple validation feedback
                    helperText={
                      isModalOpen && !newExperience.companyName
                        ? "Required"
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="designation"
                    label="Designation"
                    fullWidth
                    value={newExperience.designation}
                    onChange={handleInputChange}
                    required // Added required
                    error={isModalOpen && !newExperience.designation} // Simple validation feedback
                    helperText={
                      isModalOpen && !newExperience.designation
                        ? "Required"
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    views={["year", "month"]}
                    label="From"
                    value={
                      newExperience.from ? dayjs(newExperience.from) : null
                    }
                    onChange={handleFromChange}
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "medium",
                        inputProps: {
                          readOnly: true, // Prevent manual typing
                        },
                        onKeyDown: (e) => e.preventDefault(), // Block all keyboard input
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    views={["year", "month"]}
                    label="To"
                    value={newExperience.to ? dayjs(newExperience.to) : null}
                    onChange={handleToChange}
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "medium",
                        inputProps: {
                          readOnly: true,
                        },
                        onKeyDown: (e) => e.preventDefault(),
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Description"
                    fullWidth
                    multiline
                    rows={3} // Increased rows slightly
                    value={newExperience.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={handleCloseModal}
                      sx={{ textTransform: "none" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleAddExperience} // This button now triggers save
                      startIcon={
                        isSaving ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Add />
                        )
                      } // Show loader
                      disabled={
                        !newExperience.companyName ||
                        !newExperience.designation ||
                        isSaving
                      } // Disable if required fields are empty OR saving
                      sx={{ textTransform: "none" }}
                    >
                      {isSaving ? "Adding..." : "Add Experience"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
};

export default ExperienceHistory;
