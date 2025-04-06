import React, { useState,useEffect } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch } from "react-redux";
import { UpdateUser } from "../../../redux/userSlice";

const Experience = ({ experienceData, userId }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    currentCompany: "",
    openToRelocate: "",
    currentDesignation: "",
  });

  useEffect(() => {
    if (experienceData) {
      setFormData({
        currentCompany: experienceData.currentCompany || "",
        openToRelocate: experienceData.openToRelocate || "",
        currentDesignation: experienceData.currentDesignation || "",
      });
    }
  }, [experienceData]);

  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/user/updateWork",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: experienceData?._id, ...formData }),
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
            <SaveIcon />
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
          <Grid item xs={6}>
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

          {/* Open to Relocate */}
          <Grid item xs={6}>
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
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
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

          {/* Designation */}
          <Grid item xs={6}>
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
        </Grid>
      </Card>
    </Box>
  );
};

export default Experience;
