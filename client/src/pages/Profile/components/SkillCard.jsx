import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Chip, Card, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUser } from "../../../redux/userSlice";
import Select from "react-select";
import { skillsList } from "../../../assets/mock";

const SkillCard = ({ userInfo }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); 
  const [skills, setSkills] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if(userInfo?.skills){
      setSkills(userInfo?.skills);
    }
  }, [userInfo]);

  // Custom styles for Select component - matches UserInfoForm
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

  // Handle skills change
  const handleSkillsChange = (selectedOptions) => {
    const selectedSkills = selectedOptions.map((option) => option.value);
    setSkills(selectedSkills);
  };

  // Remove Skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prevSkills) => prevSkills.filter((skill) => skill !== skillToRemove));
  };

  // Save Skills to API
  const handleSaveSkills = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const response = await fetch("https://highimpacttalent.onrender.com/api-v1/user/updateSkills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: {userId:userInfo?._id}, skills }),
      });

      const result = await response.json();
      if (result.success) {
        dispatch(UpdateUser({ ...user, skills })); // Update Redux store
        setIsEditing(false);
      } else {
        console.error("Failed to save skills:", result.message);
      }
    } catch (error) {
      console.error("Error saving skills:", error);
    }

    setIsSaving(false);
  };

  const handleCancelEdit = () => {
  setSkills(userInfo?.skills || []);  // revert to original
  setIsEditing(false);
};

  return (
    <Box>
      {/* Tabs Section */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Tabs value={0}>
          <Tab sx={{
                "&.MuiTab-root": { color: "#404258", fontWeight: 700, textTransform: "none" }, 
              }} 
              label="Skills"
          />
        </Tabs>
        <IconButton onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}>
          {isEditing ? <CloseIcon sx={{ color: "#D9534F" }} /> : <EditIcon sx={{ color: "#404258" }} />}
        </IconButton>
      </Box>

       {/* Editing View */}
       {isEditing ? (
        <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Select
              isMulti
              options={skillsList.map((skill) => ({
                value: skill,
                label: skill,
              }))}
              value={skills.map((skill) => ({
                value: skill,
                label: skill,
              }))}
              onChange={handleSkillsChange}
              styles={customStyles}
              placeholder="Select or type skills..."
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={handleSaveSkills}
              disabled={isSaving}
              sx={{
                bgcolor: isSaving ? "grey.400" : "#3C7EFC",
                color: "white",
                borderRadius: "50%",
                width: 40,
                height: 40,
                "&:hover": { bgcolor: "#3361cb" },
              }}
            >
              <SaveIcon />
            </IconButton>
          </Box>
        </Box>
      ) : (
        // Read-only Chip View
        <Card
          variant="outlined"
          sx={{ p: 2, borderRadius: 2, border: "1px solid #00000040" }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  sx={{
                    backgroundColor: "#E3EDFF",
                    color: "#474E68",
                    fontFamily: "Poppins",
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" sx={{ color: "#404258" }}>
                No skills added yet. Please add your skills.
              </Typography>
            )}
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default SkillCard;