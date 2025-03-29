import React, { useState } from "react";
import { Avatar, Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { AiOutlineMail, AiOutlinePlus } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { HiLocationMarker } from "react-icons/hi";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector, useDispatch } from "react-redux";
import { UpdateUser } from "../../../redux/userSlice";

const UserInfoCard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    email: user?.email ?? "",
    contactNumber: user?.contactNumber ?? "",
    currentLocation: user?.currentLocation?.toUpperCase() ?? "",
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setUpdatedUserInfo({ ...updatedUserInfo, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://highimpacttalent.onrender.com/api-v1/user/updateUserPersonnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId:user._id,
          email: updatedUserInfo.email,
          contactNumber: updatedUserInfo.contactNumber,
          currentLocation: updatedUserInfo.currentLocation,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        dispatch(UpdateUser(updatedUserInfo)); // Update Redux store
        setIsEditing(false);
      } else {
        console.error("Error updating user:", result.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
  display="flex"
  flexDirection={{ xs: "column", sm: "row" }}
  alignItems="center"
  justifyContent="space-evenly"
  flexWrap="wrap"
  gap={2}
  sx={{
    maxWidth: "90%", // Adjust width dynamically
    width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" }, // Different widths for screens
    margin: "auto",
    border: "3px solid #00000040",
    p: 2,
    borderRadius: 4,
  }}
>

      {/* Profile Image */}
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Avatar
          src={user?.profileUrl}
          alt="Profile"
          sx={{
            width: { xs: 80, md: 80, lg: 100 },
            height: { xs: 80, md: 80, lg: 100 },
            transition: "0.3s",
          }}
        />
        <input type="file" accept="image/*" style={{ display: "none" }} id="upload-input" />
        <Box
          component="label"
          htmlFor="upload-input"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "white",
            borderRadius: "50%",
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 3,
            cursor: "pointer",
            opacity: 0,
            transition: "opacity 0.3s",
            "&:hover": { opacity: 1 },
          }}
        >
          <AiOutlinePlus size={20} color="#3C7EFC" />
        </Box>
      </Box>

      {/* User Info */}
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            textTransform: "capitalize",
            mb: 1,
            color: "#404258",
            fontWeight: 700,
            fontFamily: "Satoshi",
            fontSize: { xs: 20, md: 25, lg: 30 },
          }}
        >
          {user?.firstName + " " + user?.lastName}
        </Typography>

        <Box textAlign="center" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Email */}
          {isEditing ? (
            <TextField
              name="email"
              size="small"
              value={updatedUserInfo.email}
              onChange={handleChange}
              sx={{ width: "250px" }}
            />
          ) : (
            <Typography display="flex" alignItems="center" gap={1} color="#404258" fontWeight="400">
              <AiOutlineMail /> {updatedUserInfo.email}
            </Typography>
          )}

          {/* Contact */}
          {isEditing ? (
            <TextField
              name="contactNumber"
              size="small"
              value={updatedUserInfo.contactNumber}
              onChange={handleChange}
              sx={{ width: "250px" }}
            />
          ) : (
            <Typography display="flex" alignItems="center" gap={1} color="#404258" fontWeight="400">
              <FiPhoneCall /> {updatedUserInfo.contactNumber}
            </Typography>
          )}

          {/* Location */}
          {isEditing ? (
            <TextField
              name="currentLocation"
              size="small"
              value={updatedUserInfo.currentLocation}
              onChange={handleChange}
              sx={{ width: "250px" }}
            />
          ) : (
            <Typography display="flex" alignItems="center" gap={1} color="#404258" fontWeight="400">
              <HiLocationMarker /> {updatedUserInfo.currentLocation}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Edit & Save Buttons */}
      <Box sx={{  px: 4, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {isEditing ? (
          <Button
            variant="contained"
            size="small"
            onClick={handleSaveClick}
            sx={{ bgcolor: "#3C7EFC", color: "white", borderRadius: 16 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Save"}
          </Button>
        ) : (
          <Typography
            sx={{ color: "#3C7EFC", cursor: "pointer", display: "flex", alignItems: "center", gap: 1 }}
            onClick={handleEditClick}
          >
            <EditIcon sx={{ color: "#3C7EFC" }} /> Edit Profile
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default UserInfoCard;
