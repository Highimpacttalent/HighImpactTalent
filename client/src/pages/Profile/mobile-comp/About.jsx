import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  IconButton,
  TextField,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch } from "react-redux";
import { UpdateUser } from "../../../redux/userSlice";

const AboutSection = ({ userInfo }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setAboutText(userInfo.about || "");
    }
  }, [userInfo]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setAboutText(e.target.value);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/user/updateAbout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: userInfo?._id, 
            about: aboutText 
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        dispatch(UpdateUser({ ...userInfo, about: aboutText }));
        setIsEditing(false);
      } else {
        console.error("Failed to save about section:", result.message);
      }
    } catch (error) {
      console.error("Error saving about section:", error);
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
            label="About"
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

      {/* About Card */}
      <Card
        variant="outlined"
        sx={{ p: 3, borderRadius: 2, border: "1px solid #00000040" }}
      >
        {isEditing ? (
          <TextField
            multiline
            rows={4}
            fullWidth
            value={aboutText}
            onChange={handleChange}
            placeholder="Add a short summary about yourself"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        ) : (
          <Typography
            variant="body1"
            fontWeight="400"
            fontSize="14px"
            color="#808195"
            fontFamily="Poppins"
          >
            {aboutText || "No information provided yet."}
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default AboutSection;