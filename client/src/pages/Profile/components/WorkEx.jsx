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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Delete, Add } from "@mui/icons-material";
import AlertModal from "../../../components/Alerts/view";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { UpdateUser } from "../../../redux/userSlice";

const ExperienceHistory = ({ userId, experienceHistory, about }) => {
  const dispatch = useDispatch();
  const [experiences, setExperiences] = useState(experienceHistory || []);
  const [desc, setDesc] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
      from: "",
      to: "",
      description: "",
  });

  useEffect(() => {
    setExperiences(experienceHistory || []);
  }, [experienceHistory]);

  const handleInputChange = (e) => {
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  };

  const handleAddExperience = async () => {
    if (!newExperience.companyName || !newExperience.designation) return;

    const updated = [...experiences, newExperience];
    setExperiences(updated);
    setNewExperience({
      companyName: "",
      designation: "",
      from: "",
      to: "",
      description: "",
    });
  };

  const handleDeleteExperience = async (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
    await updateExperienceHistory(userId, updated);
  };

  const updateExperienceHistory = async (userId, experienceData) => {
    try {
      await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/update-exp",
        {
          userId,
          experienceHistory: experienceData,
        }
      );
    } catch (error) {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to update experience history. Please try again later.",
      });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      const res = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/update-exp",
        {
          userId,
          experienceHistory: experiences,
        }
      );

      // Check if API call succeeded
      if (res.data?.success) {
        dispatch(UpdateUser({ experienceHistory: experiences }));
        setAlert({
          open: true,
          type: "success",
          title: "Success",
          message: "Experience history updated successfully!",
        });
        setIsEditing(false);
      } else {
        throw new Error(res.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error while updating experience:", error.message);
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message:
          error?.response?.data?.message ||
          "Failed to update experience history.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (date, field) => {
    setNewExperience((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  return (
    <Box p={2}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <AlertModal
          open={alert.open}
          onClose={() => setAlert({ ...alert, open: false })}
          type={alert.type}
          title={alert.title}
          message={alert.message}
        />
        <Tabs value={0} sx={{ mb: 2 }}>
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

        {isEditing ? (
          <Button
            variant="outlined"
            onClick={handleSaveClick}
            disabled={isSaving}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 0,
              padding: 0,
            }}
          >
            {!isSaving ? <SaveIcon /> : <CircularProgress />}
          </Button>
        ) : (
          <IconButton onClick={handleEditClick}>
            <EditIcon sx={{ color: "#404258" }} />
          </IconButton>
        )}
      </Box>

      {/* Existing Experiences */}
      {experiences.map((exp, index) => (
        <Paper
          key={index}
          sx={{ p: 2, mb: 2, border: "1px solid #00000040", borderRadius: 4 }}
        >
          <Box display="flex" justifyContent="space-between" flexDirection={{ xs: "column", sm: "row" }}>
            <Box
              display="flex"
              sx={{ width: { xs: "90%", md: "60%", lg: "60%", sm: "90%" } }}
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#24252C",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                  }}
                >
                  Company Name
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#24252C",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                  }}
                >
                  Designation
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#24252C",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                  }}
                >
                  FROM
                </Typography>
                <Typography
                  sx={{
                    color: "#808195",
                    fontFamily: "Poppins",
                    fontSize: "12px",
                  }}
                >
                  {exp.from ? new Date(exp.from).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#24252C",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                  }}
                >
                  TO
                </Typography>
                <Typography
                  sx={{
                    color: "#808195",
                    fontFamily: "Poppins",
                    fontSize: "12px",
                  }}
                >
                  {exp.to ? new Date(exp.from).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""} 
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton onClick={() => setDesc(!desc)}>
                {!desc ? <Visibility /> : <VisibilityOff />}
              </IconButton>
              <IconButton onClick={() => handleDeleteExperience(index)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ mt: 1, display: desc ? "block" : "none" }}>
            <Typography
              sx={{ color: "#24252C", fontFamily: "Poppins", fontSize: "14px" }}
            >
              Description
            </Typography>
            <Typography
              sx={{ color: "#808195", fontFamily: "Poppins", fontSize: "12px" }}
            >
              {exp.description}
            </Typography>
          </Box>
        </Paper>
      ))}

      {/* Add New Experience */}
      <Box
        sx={{
          p: 1,
          mb: 3,
          display: isEditing ? "flex" : "none",
          flexDirection: "column",
        }}
      >
        <Typography variant="subtitle1" mb={2}>
          Add Experience
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              name="companyName"
              label="Company Name"
              fullWidth
              value={newExperience.companyName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="designation"
              label="Designation"
              fullWidth
              value={newExperience.designation}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
        <label className="date-label" style={{marginRight:"10px"}}>From:</label>
        <DatePicker
          selected={newExperience.from}
          onChange={(date) => handleChange(date, "from")}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          maxDate={new Date()}
          placeholderText="MM/YYYY"
          className="custom-datepicker-input"
        />
      </Grid>

      <Grid item xs={6}>
      <label className="date-label" style={{marginRight:"10px",marginLeft:"5px"}}>To:</label>
        <DatePicker
          selected={newExperience.to}
          onChange={(date) => handleChange(date, "to")}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          maxDate={new Date()}
          placeholderText="MM/YYYY"
          className="custom-datepicker-input"
        />
      </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={newExperience.description}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddExperience}
            >
              Add Experience
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Typography
          sx={{ px: 1, py: 1, color: "#474E68", fontFamily: "Poppins" }}
        >
         {about}
        </Typography>
      </Box>
    </Box>
  );
};

export default ExperienceHistory;
