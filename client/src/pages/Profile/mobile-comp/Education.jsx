import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Modal,
  Fade,
  TextField,
} from "@mui/material";
import { Delete, Add, School } from "@mui/icons-material";
import AlertModal from "../../../components/Alerts/view";
import axios from "axios";
import { useDispatch } from "react-redux";
import { UpdateUser } from "../../../redux/userSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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

const EducationHistory = ({ userId, educationDetails }) => {
  const dispatch = useDispatch();
  const [education, setEducation] = useState(educationDetails || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: "", title: "", message: "" });

  const [newEdu, setNewEdu] = useState({
    instituteName: "",
    courseName: "",
    specialization: "",
    startYear: null,
    endYear: null,
  });

  useEffect(() => {
    setEducation(educationDetails || []);
  }, [educationDetails]);

  const handleInputChange = (e) => {
    setNewEdu({ ...newEdu, [e.target.name]: e.target.value });
  };

  const handleAddEducation = async () => {
    const { instituteName, courseName, startYear, endYear } = newEdu;

    if (!instituteName || !courseName || !startYear || !endYear) {
      return setAlert({
        open: true,
        type: "warning",
        title: "Missing Fields",
        message: "All fields except specialization are required.",
      });
    }

    if (dayjs(startYear).isAfter(dayjs(endYear))) {
      return setAlert({
        open: true,
        type: "error",
        title: "Invalid Date Range",
        message: "Start date cannot be after End date.",
      });
    }

    const formattedEdu = {
      ...newEdu,
      startYear: dayjs(startYear).format("YYYY-MM"),
      endYear: dayjs(endYear).format("YYYY-MM"),
    };

    const updatedEducation = [...education, formattedEdu];
    setIsSaving(true);

    try {
      const res = await axios.post("https://highimpacttalent.onrender.com/api-v1/user/update-edu", {
        userId,
        educationDetails: updatedEducation,
      });

      if (res?.data?.success) {
        dispatch(UpdateUser(res.data.user));
        setEducation(res.data.user.educationDetails);
        setNewEdu({
          instituteName: "",
          courseName: "",
          specialization: "",
          startYear: null,
          endYear: null,
        });
        setIsModalOpen(false);
        setAlert({ open: true, type: "success", title: "Success", message: "Education added successfully!" });
      } else {
        throw new Error(res?.data?.message || "Failed to update");
      }
    } catch (err) {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: err?.message || "Failed to save.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (index) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setIsSaving(true);

    try {
      const res = await axios.post("https://highimpacttalent.onrender.com/api-v1/user/update-edu", {
        userId,
        educationDetails: updatedEducation,
      });

      if (res?.data?.success) {
        dispatch(UpdateUser(res.data.user));
        setEducation(res.data.user.educationDetails);
        setAlert({ open: true, type: "success", title: "Deleted", message: "Education entry deleted." });
      } else {
        throw new Error(res?.data?.message);
      }
    } catch (err) {
      setAlert({ open: true, type: "error", title: "Error", message: err?.message || "Failed to delete." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box p={2}>
      <AlertModal
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />

      <Box sx={{ mb: 2 }}>
        <Tabs value={0}>
          <Tab
            label="Education"
            sx={{
              "&.MuiTab-root": {
                color: "#404258",
                fontWeight: 700,
                fontFamily: "Poppins",
                textTransform: "none",
              },
            }}
          />
        </Tabs>
      </Box>

      {education.length === 0 ? (
        <Paper sx={{ p: 2, mb: 2, textAlign: "center", border: "1px solid #00000040", borderRadius: 4 }}>
          <School sx={{ fontSize: 48, color: "#00000040", mb: 1 }} />
          <Typography variant="h6" fontFamily="Poppins" fontWeight={550} mb={1} color="#24252C">
            No education added yet
          </Typography>
          <Typography variant="body1" fontFamily="Poppins" color="#555770" mb={2}>
            Please add your academic background to enhance your profile visibility.
          </Typography>
        </Paper>
      ) : (
        education.map((edu, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, border: "1px solid #00000040", borderRadius: 4 }}>
            <Box display="flex" justifyContent="space-between" flexDirection={{ xs: "column", sm: "row" }}>
              <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Box>
                  <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px">Institute:</Typography>
                  <Typography fontFamily="Poppins" fontSize="12px" color="#808195">{edu.instituteName}</Typography>
                </Box>
                <Box>
                  <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px">Course:</Typography>
                  <Typography fontFamily="Poppins" fontSize="12px" color="#808195">{edu.courseName}</Typography>
                </Box>
                <Box>
                  <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px">Start:</Typography>
                  <Typography fontFamily="Poppins" fontSize="12px" color="#808195">{edu.startYear}</Typography>
                </Box>
                <Box>
                  <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px">End:</Typography>
                  <Typography fontFamily="Poppins" fontSize="12px" color="#808195">{edu.endYear}</Typography>
                </Box>
                {edu.specialization && (
                  <Box>
                    <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px">Specialization:</Typography>
                    <Typography fontFamily="Poppins" fontSize="12px" color="#808195">{edu.specialization}</Typography>
                  </Box>
                )}
              </Box>
              <Box mt={{ xs: 2, sm: 0 }}>
                <IconButton onClick={() => handleDelete(index)} disabled={isSaving}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))
      )}

      <Box mt={3} mb={2}>
        <Button
          variant="contained"
          startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <Add />}
          onClick={() => setIsModalOpen(true)}
          disabled={isSaving}
          sx={{ textTransform: "none", fontFamily: "Poppins" }}
        >
          {isSaving ? "Saving..." : "Add Education"}
        </Button>
      </Box>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} closeAfterTransition BackdropProps={{ timeout: 500 }}>
        <Fade in={isModalOpen}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={3} fontFamily="Poppins">Add Education</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField name="instituteName" label="Institute Name" fullWidth value={newEdu.instituteName} onChange={handleInputChange} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField name="courseName" label="Course Name" fullWidth value={newEdu.courseName} onChange={handleInputChange} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField name="specialization" label="Specialization" fullWidth value={newEdu.specialization} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    views={['year', 'month']}
                    label="Start Date"
                    value={newEdu.startYear}
                    onChange={(value) => setNewEdu({ ...newEdu, startYear: value })}
                    slotProps={{ textField: { fullWidth: true, required: true } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    views={['year', 'month']}
                    label="End Date"
                    value={newEdu.endYear}
                    minDate={newEdu.startYear || undefined}
                    onChange={(value) => setNewEdu({ ...newEdu, endYear: value })}
                    slotProps={{ textField: { fullWidth: true, required: true } }}
                  />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                  <Button onClick={() => setIsModalOpen(false)} variant="outlined" sx={{ textTransform: "none", fontFamily: "Poppins" }}>Cancel</Button>
                  <Button onClick={handleAddEducation} variant="contained" disabled={isSaving} sx={{ textTransform: "none", fontFamily: "Poppins" }}>
                    {isSaving ? "Saving..." : "Add Education"}
                  </Button>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default EducationHistory;