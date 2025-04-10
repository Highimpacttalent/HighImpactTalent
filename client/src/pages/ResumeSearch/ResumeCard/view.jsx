import React from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Avatar,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import PhoneIcon from "@mui/icons-material/Phone";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import BusinessIcon from "@mui/icons-material/Business";

function view({ resume }) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mb: 2,
        border: "1px solid #0000004D",
        borderRadius:4
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          p: 4,
        }}
      >
        <Box sx={{ width: "15%"}}>
          <Avatar sx={{ bgcolor: "#D9D9D9", height: "80px", width: "80px" }}>
            {resume.personalInformation.name.charAt(0)}
          </Avatar>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Stack>
            <Typography
              sx={{
                color: "#24252C",
                fontFamily: "Poppins",
                fontWeight: "600",
                fontSize: "20px",
              }}
            >
              {resume.personalInformation.name}
            </Typography>
            <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
              <Chip
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon fontSize="small" />
                    <Typography
                      sx={{ color: "#24252C", fontFamily: "Poppins" }}
                    >
                      {resume.personalInformation.email}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          resume.personalInformation.email
                        )
                      }
                    >
                      <ContentCopyIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                }
                variant="outlined"
                sx={{ bgcolor: "#E3EDFF", pl: 1 }}
              />
              <Chip
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PhoneIcon fontSize="small" />
                    <Typography
                      sx={{ color: "#24252C", fontFamily: "Poppins" }}
                    >
                      {resume.personalInformation.contactNumber}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          resume.personalInformation.contactNumber
                        )
                      }
                    >
                      <ContentCopyIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                }
                variant="outlined"
                sx={{ bgcolor: "#E3EDFF" }}
              />
            </Box>
            <Box sx={{ display: "flex", mt: 2, gap: 2 }}>
              <Typography
                sx={{
                  color: "#474E68",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                {resume.professionalDetails.noOfYearsExperience} Years
                Experience
              </Typography>
              <Typography
                sx={{
                  color: "#474E68",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                {resume.personalInformation.location}
              </Typography>
              <Typography
                sx={{
                  color: "#474E68",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
                {resume.professionalDetails.currentCompany}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: "#24252C",
                fontFamily: "Poppins",
                fontWeight: "600",
                mt: 2,
                fontSize: "16px",
              }}
            >
              Key Skills:
            </Typography>
            <Typography sx={{ fontFamily: "Poppins", color: "#000000",fontSize:"14px" }}>
              {resume.skills.join(", ")}
            </Typography>
            <Box>
            <Button
            variant="contained"
            onClick={() => navigate(`/resumesearch/viewresume/${resume._id}`)}
            sx={{bgcolor:"#3C7EFC",mt:4,borderRadius:50,px:"28px",py:"14px",fontFamily:"Satoshi",fontWeight:700,textTransform:"none"}}
          >
            View Profile
          </Button>
          </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default view;
