import React, { useState, useRef } from "react";
import {
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { AiOutlineMail, AiOutlinePlus } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { HiLocationMarker } from "react-icons/hi";
import { useMediaQuery,useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector, useDispatch } from "react-redux";
import ProfileNotify from "../../Landing/Landing2/ProfileNotify/view.jsx";
import { UpdateUser } from "../../../redux/userSlice";
import axios from "axios";

const UserInfoCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(user?.profileUrl || "");
  const fileInputRef = useRef(null);

  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    email: user?.email ?? "",
    contactNumber: user?.contactNumber ?? "",
    currentLocation: user?.currentLocation?.toUpperCase() ?? "",
    profileUrl: user?.profileUrl ?? "",
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setUpdatedUserInfo({ ...updatedUserInfo, [e.target.name]: e.target.value });
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)$/)) {
      alert("Please upload an image file (JPEG, JPG, or PNG)");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    setUploadingProfilePic(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("profilePic", file);

      // Upload to server
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.success) {
        setProfilePicUrl(response.data.url);
        setProfilePic(response.data.url);
        dispatch(UpdateUser({ ...user, profileUrl: response.data.url }));
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Profile picture upload error:", error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setUploadingProfilePic(false);
    }
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/user/updateUserPersonnel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            email: updatedUserInfo.email,
            contactNumber: updatedUserInfo.contactNumber,
            currentLocation: updatedUserInfo.currentLocation,
            profileUrl: profilePicUrl,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        dispatch(
          UpdateUser({
            ...updatedUserInfo,
            profileUrl: profilePicUrl,
          })
        );
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

  const desktopView = (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      flexWrap="wrap"
      gap={5}
      sx={{
        width: { xs: "100%", sm: "80%", md: "85%", lg: "85%" },
        margin: "auto",
        border: "1px solid #00000040",
        p: 2,
        borderRadius: 4,
      }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        sx={{
          width: "100%",
        }}
        flexWrap="wrap"
        gap={5}
      >
        {/* Profile Image */}
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={profilePicUrl || user?.profileUrl}
            alt="Profile"
            sx={{
              width: { xs: 80, md: 80, lg: 100 },
              height: { xs: 80, md: 80, lg: 100 },
              transition: "0.3s",
            }}
          />
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="upload-input"
            ref={fileInputRef}
            onChange={handleProfilePicUpload}
            disabled={uploadingProfilePic}
          />
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
              cursor: uploadingProfilePic ? "not-allowed" : "pointer",
              opacity: uploadingProfilePic ? 0.7 : 1,
              transition: "opacity 0.3s",
              "&:hover": { opacity: 1 },
            }}
          >
            {uploadingProfilePic ? (
              <CircularProgress size={20} />
            ) : (
              <AiOutlinePlus size={20} color="#3C7EFC" />
            )}
          </Box>
        </Box>

        {/* User Info */}
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              px: 1,
              fontFamily: "Satoshi",
              fontWeight: "700",
              fontSize: { xs: 20, md: 25, lg: 30 },
              color: "#24252C",
              mb: 1,
            }}
          >
            {user?.firstName + " " + user?.lastName}
          </Typography>

          <Box textAlign="center" sx={{ display: "flex", gap: 2 }}>
            {/* Email */}
            {isEditing ? (
              <Typography
              display="flex"
              alignItems="center"
              gap={1}
              color="#404258"
              fontWeight="400"
            >
              <AiOutlineMail /> {updatedUserInfo.email}
            </Typography>
            ) : (
              <Typography
                display="flex"
                alignItems="center"
                gap={1}
                color="#404258"
                fontWeight="400"
              >
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
              <Typography
                display="flex"
                alignItems="center"
                gap={1}
                color="#404258"
                fontWeight="400"
              >
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
              <Typography
                display="flex"
                alignItems="center"
                gap={1}
                color="#404258"
                fontWeight="400"
              >
                <HiLocationMarker /> {updatedUserInfo.currentLocation}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Edit & Save Buttons */}
        <Box
          sx={{
            px: 4,
            py: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isEditing ? (
            <Button
              variant="contained"
              size="small"
              onClick={handleSaveClick}
              sx={{ bgcolor: "#3C7EFC", color: "white", borderRadius: 16 }}
              disabled={loading || uploadingProfilePic}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Save"
              )}
            </Button>
          ) : (
            <Typography
              sx={{
                color: "#3C7EFC",
                cursor: "pointer",
                display: "flex",
                gap: 1,
              }}
              onClick={handleEditClick}
            >
              <EditIcon sx={{ color: "#3C7EFC" }} /> Edit Profile
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"flex-start"}}>
        <Typography
          sx={{
            px: 1,
            fontFamily: "Satoshi",
            fontWeight: "700",
            fontSize: "20px",
            color: "#24252C",
          }}
        >
          Finish Your Profile & Let the Perfect Job Find You!
        </Typography>
        <Box sx={{border:2,px:8,py:2,borderRadius:4,border:"1px solid #00000040",mt:2,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <Box
          sx={{
            color: "#24252C",
            fontFamily: "Poppins",
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
          <Typography sx={{color:"#24252C",fontWeight:"500"}}>Your Profile is</Typography>
        </Box>
        {/* Progress bar below "Your Profile" */}
        <LinearProgress
          variant="determinate"
          value={40}
          sx={{ width:"100%",height: 6, borderRadius: 4, marginTop: 1   }}
        />
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontWeight: "500",
            fontSize: 14,
            mt: 1,
            color: "#808195",
          }}
        >
          40% done
        </Typography>
      </Box>
      </Box>
    </Box>
  )

  const mobileView = (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems="center"
      justifyContent="space-evenly"
      flexWrap="wrap"
      gap={2}
      sx={{
        maxWidth: "90%",
        width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
        margin: "auto",
        border: "3px solid #00000040",
        p: 2,
        borderRadius: 4,
      }}
    >
      {/* Profile Image */}
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Avatar
          src={profilePicUrl || user?.profileUrl}
          alt="Profile"
          sx={{
            width: { xs: 80, md: 80, lg: 100 },
            height: { xs: 80, md: 80, lg: 100 },
            transition: "0.3s",
          }}
        />
        <input 
          type="file" 
          accept="image/*" 
          style={{ display: "none" }} 
          id="upload-input"
          ref={fileInputRef}
          onChange={handleProfilePicUpload}
          disabled={uploadingProfilePic}
        />
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
            cursor: uploadingProfilePic ? "not-allowed" : "pointer",
            opacity: uploadingProfilePic ? 0.7 : 1,
            transition: "opacity 0.3s",
            "&:hover": { opacity: 1 },
          }}
        >
          {uploadingProfilePic ? (
            <CircularProgress size={20} />
          ) : (
            <AiOutlinePlus size={20} color="#3C7EFC" />
          )}
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
      <Box sx={{ px: 4, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {isEditing ? (
          <Button
            variant="contained"
            size="small"
            onClick={handleSaveClick}
            sx={{ bgcolor: "#3C7EFC", color: "white", borderRadius: 16 }}
            disabled={loading || uploadingProfilePic}
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
  )

  return (
    <Box sx={{width:"100%"}}>
    {isMobile ? mobileView : desktopView }
    </Box>
  );
};

export default UserInfoCard;
