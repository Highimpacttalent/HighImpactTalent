import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  Stack,
  Typography,
  Chip,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import ExperienceIcon from "../../../assets/FindJob/experinece.svg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";

const ProfileCard = ({ resume }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showAll, setShowAll] = useState(false);
  const skillsToShow = showAll ? resume.skills : resume.skills.slice(0, 4);

  const handleToggle = () => {
    setShowAll((prev) => !prev);
  };

  const handleCopy = (text) => navigator.clipboard.writeText(text);

  return (
    <Box
      sx={{
        border: "1px solid #0000004D",
        borderRadius: 4,
        overflow: "hidden",
        mb: 2,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          p: { xs: 2, sm: 4 },
        }}
      >
        {/* Avatar always top-left */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            mb: { xs: 4 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
              <Avatar
                sx={{
                  bgcolor: "#D9D9D9",
                  width: 50,
                  height: 50,
                  fontSize: "1.5rem",
                  mr: { xs: 2, sm: 4 },
                }}
              >
                {resume.personalInformation.name.charAt(0)}
              </Avatar>
            </Box>
            {/* Name */}
            <Box>
              <Typography
                sx={{
                  color: "#24252C",
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: "20px",
                }}
              >
                {resume.personalInformation.name}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography
              sx={{
                bgcolor: "#A9D9FF",
                color: "#558CB9",
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: "14px",
                px: 1,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              RESUME
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "center",
            mb: { xs: 2, sm: 0 },
          }}
        >
          <Chip
            icon={<LocationOnIcon sx={{ color: "#474E68" }} />}
            label={
              <Typography
                sx={{
                  color: "#000000AD",
                  fontWeight: 500,
                  fontSize: "16px",
                  fontFamily: "Poppins",
                }}
              >
                {resume.personalInformation.location}
              </Typography>
            }
            variant="outlined"
            sx={{ border: "2px solid #D7D7D7" }}
          />
          <Chip
            icon={<img src={ExperienceIcon} alt="Experience" />}
            label={
              <Typography
                sx={{
                  color: "#000000AD",
                  fontWeight: 500,
                  fontSize: "16px",
                  fontFamily: "Poppins",
                }}
              >
                {resume.professionalDetails.noOfYearsExperience} years of
                experience
              </Typography>
            }
            variant="outlined"
            sx={{ border: "2px solid #D7D7D7" }}
          />
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, width: "100%" }}>
          {/* Skills */}
          <Box mt={2}>
            <Typography
              sx={{
                color: "#000000",
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: "16px",
                mb: 2,
              }}
            >
              SKILLS:
            </Typography>

            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: 1, width: "100%" }}
            >
              {skillsToShow.map((skill, index) => (
                <Chip
                  key={index}
                  label={
                    <Typography
                      color="#000000AD"
                      fontFamily={"Poppins"}
                      fontSize={"14px"}
                    >
                      {skill}
                    </Typography>
                  }
                  sx={{ fontFamily: "Poppins", bgcolor: "#D7D7D7" }}
                />
              ))}
            </Box>

            {resume.skills.length > 4 && (
              <Button
                variant="text"
                onClick={handleToggle}
                sx={{
                  mt: 1,
                  textTransform: "none",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                }}
              >
                {showAll ? "View Less" : "View More"}
              </Button>
            )}
          </Box>

          {/* View Profile Button */}
          <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/resumesearch/viewresume/${resume._id}`)}
              sx={{
                bgcolor: "#3C7EFC",
                borderRadius: 50,
                px: "28px",
                py: "10px",
                textTransform: "none",
                fontFamily: "Satoshi",
                fontWeight: 700,
              }}
            >
              View Profile
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileCard;
