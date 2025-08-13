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
  Modal,
  Fade,
} from "@mui/material";
import dayjs from "dayjs";
import WorkIcon from "@mui/icons-material/Work";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Delete, Add } from "@mui/icons-material";
import AlertModal from "../../../components/Alerts/view";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { UpdateUser } from "../../../redux/userSlice";
import { useSelector } from "react-redux";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" },
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

const ExperienceHistory = ({ userId, experienceHistory, about }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [experiences, setExperiences] = useState(experienceHistory || []);
  const [desc, setDesc] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });
  const [newExperience, setNewExperience] = useState({
    companyName: "",
    designation: "",
    from: null,
    to: null,
    description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setExperiences(experienceHistory || []);
  }, [experienceHistory]);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewExperience({
      companyName: "",
      designation: "",
      from: null,
      to: null,
      description: "",
    });
  };

  const handleInputChange = (e) => {
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  };

  const handleFromChange = (date) => {
    setNewExperience((prev) => ({
      ...prev,
      from: date ? date.toISOString() : null,
    }));
  };

  const handleToChange = (date) => {
    setNewExperience((prev) => ({
      ...prev,
      to: date ? date.toISOString() : null,
    }));
  };

  const calculateExperienceYears = (history = []) => {
    if (!Array.isArray(history) || history.length === 0) return 0;
    let totalMonths = 0;
    const now = dayjs();

    for (const entry of history) {
      const from = entry?.from ? dayjs(entry.from) : null;
      const to = entry?.to ? dayjs(entry.to) : now;

      if (!from || !from.isValid()) continue;
      const months = to.diff(from, "month") + 1;
      if (months > 0) totalMonths += months;
    }

    return Math.floor(totalMonths / 12);
  };

  const handleAddExperience = async () => {
    if (!newExperience.companyName || !newExperience.designation) {
      setAlert({
        open: true,
        type: "warning",
        title: "Missing Fields",
        message: "Company Name and Designation are required.",
      });
      return;
    }

    const experienceToAdd = {
      companyName: newExperience.companyName,
      designation: newExperience.designation,
      from: newExperience.from,
      to: newExperience.to,
      description: newExperience.description,
    };

    const updatedExperiences = [...experiences, experienceToAdd];

    setIsSaving(true);
    try {
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

        setNewExperience({
          companyName: "",
          designation: "",
          from: null,
          to: null,
          description: "",
        });
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExperience = async (indexToDelete) => {
    const updatedExperiences = experiences.filter(
      (_, i) => i !== indexToDelete
    );

    setExperiences(updatedExperiences);

    setIsSaving(true);
    try {
      const resData = await updateExperienceHistory(userId, updatedExperiences);

      if (resData?.success) {
        dispatch(UpdateUser(resData?.user));
        setAlert({
          open: true,
          type: "success",
          title: "Success",
          message: "Experience deleted successfully!",
        });
      } else {
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
    } finally {
      setIsSaving(false);
    }
  };

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
          <AlertModal
            open={alert.open}
            onClose={() => setAlert({ ...alert, open: false })}
            type={alert.type}
            title={alert.title}
            message={alert.message}
          />
          <Tabs value={0} sx={{ mb: 0 }}>
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
        </Box>

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
                  }}
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                  justifyContent={"space-between"}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "#24252C",
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: 600,
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
                  <IconButton
                    onClick={() => handleDeleteExperience(index)}
                    disabled={isSaving}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              {exp.description && (
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
                    }}
                  >
                    {exp.description}
                  </Typography>
                </Box>
              )}
            </Paper>
          ))
        )}

        <Box sx={{ mt: 3, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={
              isSaving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Add />
              )
            }
            onClick={handleOpenModal}
            disabled={isSaving}
            sx={{
              textTransform: "none",
              fontFamily: "Poppins",
            }}
          >
            {isSaving ? "Adding Experience..." : "Add Experience"}
          </Button>
        </Box>

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
                    required
                    error={isModalOpen && !newExperience.companyName}
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
                    required
                    error={isModalOpen && !newExperience.designation}
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
                          readOnly: true,
                        },
                        onKeyDown: (e) => e.preventDefault(),
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
                    rows={3}
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
                      onClick={handleAddExperience}
                      startIcon={
                        isSaving ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Add />
                        )
                      }
                      disabled={
                        !newExperience.companyName ||
                        !newExperience.designation ||
                        isSaving
                      }
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