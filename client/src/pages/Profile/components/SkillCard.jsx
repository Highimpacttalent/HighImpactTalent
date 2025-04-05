import React, { useState,useEffect } from "react";
import { Box, Typography, Tabs, Tab, Chip, Card, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { UpdateUser } from "../../../redux/userSlice";

const SkillCard = ({ userInfo }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); 
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

   useEffect(() => {
      if(userInfo?.skills){
        setSkills(userInfo?.skills);
      }
    }, [userInfo]);

  // Add Skill
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills((prevSkills) => [...prevSkills.filter((s) => s !== "N/A"), newSkill.trim()]);
      setNewSkill("");
    }
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
        console.log("entered")
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

  return (
    <Box>
      {/* Tabs Section */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Tabs value={0}>
          <Tab sx={{
                "&.MuiTab-root": { color: "#404258",fontWeight: 700,textTransform: "none", }, 
              }} label="Skills"
            />
        </Tabs>
        <IconButton onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? <CloseIcon sx={{ color: "#D9534F" }} /> : <EditIcon sx={{ color: "#404258" }} />}
        </IconButton>
      </Box>

      {/* Input field only when editing */}
      {isEditing && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <TextField
            label="New Skill"
            size="small"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            sx={{ flexGrow: 1, "& .MuiOutlinedInput-root": { borderRadius: 16 } }}
          />
          <IconButton
            onClick={handleAddSkill}
            sx={{ bgcolor: "primary.main", color: "white", borderRadius: "50%", width: 40, height: 40, "&:hover": { bgcolor: "primary.dark" } }}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={handleSaveSkills}
            disabled={isSaving}
            sx={{ bgcolor: isSaving ? "grey.400" : "primary.main", color: "white", borderRadius: "50%", width: 40, height: 40, "&:hover": { bgcolor: "primary.dark" } }}
          >
            <SaveIcon />
          </IconButton>
        </Box>
      )}

      {/* Skills Section */}
      <Card variant="outlined" sx={{ p: 2, borderRadius: 2, border: "1px solid #00000040" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                sx={{ backgroundColor: "#E3EDFF", color: "#474E68", fontFamily: "Poppins" }}
                onDelete={isEditing ? () => handleRemoveSkill(skill) : undefined}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "#404258" }}>No skills added yet. Please add your skills.</Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default SkillCard;
