import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Card, Button, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useSelector, useDispatch } from "react-redux";
import AlertModal from "../../../components/Alerts/view"
import { UpdateUser } from "../../../redux/userSlice";

const Socials = () => {
  const { user } = useSelector((state) => state.user);
   const [alert, setAlert] = useState({
      open: false,
      type: "success",
      title: "",
      message: "",
    });
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [linkedinLink, setLinkedinLink] = useState(user?.linkedinLink || "#");
  const [loading, setLoading] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!linkedinLink.trim()) {
      setLinkedinLink("#");
      return;
    }

    if (!linkedinLink.startsWith("https://")) {
      setAlert({open:true, type:"error", title: "Error",message: "LinkdIn Link should be a valid link starting with (https://)"})
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://highimpacttalent.onrender.com/api-v1/user/updateLinkdIn", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?._id, linkedIn:linkedinLink }),
      });
      
      const data = await response.json();
      if (response.ok) {
        // Update user in Redux store
        dispatch(UpdateUser({ ...user, linkedinLink }));
        setIsEditing(false);
      } else {
        console.error("Error updating LinkedIn link:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <AlertModal
              open={alert.open}
              onClose={() => setAlert({ ...alert, open: false })}
              type={alert.type}
              title={alert.title}
              message={alert.message}
            />
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            label="Social Profiles"
          />
        </Tabs>
        <IconButton onClick={handleEditClick}>
          <EditIcon sx={{ color: "#404258" }} />
        </IconButton>
      </Box>

      <Card variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center", border: "1px solid #00000040" }}>
        <Typography variant="h6" fontWeight="400" mb={1} color="#404258" fontSize="14px" fontFamily="Poppins">
          LinkedIn Profile
        </Typography>

        {isEditing ? (
          <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            <TextField
              size="small"
              value={linkedinLink}
              onChange={(e) => setLinkedinLink(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 16 }, width: "95%" }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleSaveClick}
              disabled={loading}
              sx={{ bgcolor: "#3C7EFC", color: "white", borderRadius: 16 }}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        ) : linkedinLink === "#" ? (
          <Typography variant="body2" color="textSecondary">
            No LinkedIn profile added.
          </Typography>
        ) : (
          <Button
            variant="contained"
            startIcon={<LinkedInIcon />}
            sx={{
              backgroundColor: "#0077b5",
              color: "#fff",
              fontWeight: "600",
              textTransform: "none",
              borderRadius: 16,
              px: 3,
              "&:hover": { backgroundColor: "#005a8e" },
            }}
            href={linkedinLink}
            target="_blank"
          >
            View Profile
          </Button>
        )}
      </Card>
    </Box>
  );
};

export default Socials;