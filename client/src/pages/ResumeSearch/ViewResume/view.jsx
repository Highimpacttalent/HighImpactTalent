import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import { deepPurple } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LocalPhone } from "@mui/icons-material";
import MailIcon from "@mui/icons-material/Mail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PhoneIcon from "@mui/icons-material/Phone";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewResumeProfile = () => {
  const { resumeId } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axios.post(
          "https://highimpacttalent.onrender.com/api-v1/resume/getResumeId",
          {
            resumeId,
          }
        );
        setUserData(response.data.data);
        console.log(userData);
      } catch (error) {
        console.error("Error fetching resume data:", error);
      }
    };

    fetchResumeData();
  }, [resumeId]);

  const [expanded, setExpanded] = useState({});

  const handleToggle = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Box
      sx={{
        bgcolor: "white",
        height: "100%",
        width: "100%",
        border: "1px solid white",
      }}
    >
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Profile Header */}
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            border: "1px solid #3C7EFC",
            borderRadius: 4,
          }}
        >
          <Avatar
            sx={{ bgcolor: "#D9D9D9", width: 80, height: 80, margin: "0 auto" }}
          >
            {userData?.personalInformation?.name.charAt(0)}
          </Avatar>
          <Typography
            sx={{
              color: "#24252C",
              fontWeight: 700,
              fontSize: "28px",
              fontFamily: "Satoshi",
            }}
            mt={2}
          >
            {userData?.personalInformation?.name}
          </Typography>
          <Typography
            sx={{
              color: "#24252C",
              fontFamily: "Satoshi",
              fontWeight: 500,
              textTransform: "none",
            }}
          >
            {userData?.professionalDetails?.currentDesignation} at{" "}
            {userData?.professionalDetails?.currentCompany}
          </Typography>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "90%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MailIcon fontSize="small" />
                    <Typography
                      sx={{ color: "#24252C", fontFamily: "Poppins" }}
                    >
                      {userData?.personalInformation.email}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          userData?.personalInformation.email
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
                      {userData?.personalInformation.contactNumber}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          userData?.personalInformation.contactNumber
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
              <Chip
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography
                      sx={{ color: "#24252C", fontFamily: "Poppins" }}
                    >
                      {userData?.personalInformation?.location}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          userData?.personalInformation?.location
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
          </Box>
        </Box>

        {/* Education */}
        <Box
          sx={{
            mt: 3,
            py: 2,
            px: 4,
            borderRadius: 4,
            border: "1px solid #00000033",
          }}
        >
          <Tabs value={0} sx={{ alignItems: "flex-start" }}>
            <Tab
              label={
                <Typography
                  sx={{
                    textTransform: "none",
                    textAlign: "left",
                    fontFamily: "Satoshi",
                    fontWeight: "500",
                    fontSize: "16px",
                    color: "#24252C",
                  }}
                >
                  Educational Details
                </Typography>
              }
            />
          </Tabs>
          <List sx={{ mt: 2 }}>
            {userData?.educationDetails?.map((edu, index) => (
              <ListItem
                key={index}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "16px",
                    fontFamily: "Satoshi",
                  }}
                >
                  {edu?.instituteName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "gray",
                    fontFamily: "Satoshi",
                  }}
                >
                  Graduation Year: {edu?.yearOfPassout}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Skills */}
        <Box
          sx={{
            mt: 3,
            py: 2,
            px: 4,
            borderRadius: 4,
            border: "1px solid #00000033",
          }}
        >
          <Tabs value={0} sx={{ alignItems: "flex-start" }}>
            <Tab
              label={
                <Typography
                  sx={{
                    textTransform: "none",
                    textAlign: "left",
                    fontFamily: "Satoshi",
                    fontWeight: "500",
                    fontSize: "16px",
                    color: "#24252C",
                  }}
                >
                  Skills
                </Typography>
              }
            />
          </Tabs>
          <Typography
            sx={{
              fontFamily: "Poppins",
              color: "#24252C",
              fontSize: "14px",
              mt: 2,
              mb: 2,
            }}
          >
            {userData?.skills.join(", ")}
          </Typography>
        </Box>

        {/* Work Experience */}
        <Box
          sx={{
            mt: 3,
            py: 2,
            px: 4,
            borderRadius: 4,
            border: "1px solid #00000033",
          }}
        >
          <Tabs value={0} sx={{ alignItems: "flex-start" }}>
            <Tab
              label={
                <Typography
                  sx={{
                    textTransform: "none",
                    textAlign: "left",
                    fontFamily: "Satoshi",
                    fontWeight: "500",
                    fontSize: "16px",
                    color: "#24252C",
                  }}
                >
                  Work Experience
                </Typography>
              }
            />
          </Tabs>
          <List sx={{ mt: 2, mb: 1 }}>
            {userData?.workExperience?.map((job, index) => (
              <React.Fragment key={index}>
                <ListItem divider button onClick={() => handleToggle(index)}>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight="bold"
                        sx={{
                          color: "#24252C",
                          fontFamily: "Poppins",
                          fontWeight: 600,
                          fontSize: "16px",
                        }}
                      >
                        {job?.jobTitle}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography>
                          <span
                            style={{
                              color: "#24252C",
                              fontFamily: "Poppins",
                              fontSize: "14px",
                            }}
                          >
                            {job?.companyName}
                          </span>{" "}
                          |{" "}
                          <span
                            style={{
                              color: "#808195",
                              fontFamily: "Satoshi",
                              fontSize: "16px",
                            }}
                          >
                            {job?.duration}
                          </span>
                        </Typography>
                      </>
                    }
                  />
                  <IconButton>
                    {expanded[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </ListItem>

                {/* Responsibilities should be nested under the respective job */}
                {expanded[index] && (
                  <List sx={{ mt: 1, pl: 4 }}>
                    {job?.responsibilities?.map((resp, idx) => (
                      <ListItem key={idx}>
                        <ListItemText primary={`- ${resp}`} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* Professional Details */}
        <Box
          sx={{
            mt: 3,
            py: 2,
            px: 4,
            borderRadius: 4,
            border: "1px solid #00000033",
            mb: 4,
          }}
        >
          <Tabs value={0} sx={{ alignItems: "flex-start" }}>
            <Tab
              label={
                <Typography
                  sx={{
                    textTransform: "none",
                    textAlign: "left",
                    fontFamily: "Satoshi",
                    fontWeight: "500",
                    fontSize: "16px",
                    color: "#24252C",
                  }}
                >
                  Quick Glance
                </Typography>
              }
            />
          </Tabs>
          <Typography variant="h6" fontWeight="bold">
            Quick Glance
          </Typography>
          <Typography variant="body1">
            Years of Experience:{" "}
            {userData?.professionalDetails?.noOfYearsExperience}
          </Typography>
          <Typography variant="body1">
            Current Company: {userData?.professionalDetails?.currentCompany}
          </Typography>
          <Typography variant="body1">
            Designation: {userData?.professionalDetails?.currentDesignation}
          </Typography>
          <Typography variant="body1">
            About: {userData?.professionalDetails?.about}
          </Typography>
        </Box>

        <Box></Box>

        <Button
          fullWidth
          variant="contained"
          sx={{bgcolor:"#3C7EFC",borderRadius:16,mb:8,textTransform:"none",fontFamily:"Satoshi",fontWeight:700}}
          onClick={() => {
            if (userData?.cvUrl) {
              window.open(userData.cvUrl, "_blank");
            } else {
              alert("Resume link not available");
            }
          }}
        >
          Download Resume
        </Button>
      </Container>
    </Box>
  );
};

export default ViewResumeProfile;
