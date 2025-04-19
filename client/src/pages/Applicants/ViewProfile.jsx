import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import axios from "axios"
import { useLocation } from "react-router-dom";

const ViewProfile = () => {
  const location = useLocation();
  const userData = location.state?.applicant || {};
  // const currentStatus = location.state?.status || "";
  const applicationId = location.state?.applicationId || "";
  const [expanded, setExpanded] = useState([]);
  console.log(userData);
  const validStatuses = ["Application Viewed", "Shortlisted", "Interviewing","Hired"];
  const initialStatus = validStatuses.includes(location.state?.status) ? location.state?.status : "Application Viewed";
  
  const [currentStatus, setStatus] = useState(initialStatus);
  const statusFlow = {
    "Application Viewed": "Shortlist",
    "Shortlisted": "Interview",
    "Interviewing": "Hire",
  };

  const nextAction = statusFlow[currentStatus];

  const handleToggle = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleStatusUpdate = async () => {
    const statusMap = {
      Shortlist: "Shortlisted",
      Interview: "Interviewing",
      Hire: "Hired",
    };
  
    const statusToSend = statusMap[nextAction];
    try {
      const res = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/application/update-status",
        {
          applicationId,
          status: statusToSend,
        }
      );
      if (res.status === 200 || res.data.success) {
        setStatus(statusToSend);
      } else {
        alert("Unable to update status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Unable to update status.");
    }
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
            {userData?.firstName?.charAt(0)}
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
            {userData?.firstName + userData?.lastName}
          </Typography>
          <Typography
            sx={{
              color: "#24252C",
              fontFamily: "Satoshi",
              fontWeight: 500,
            }}
          >
            {userData?.professionalDetails?.currentDesignation} at{" "}
            {userData?.currentCompany}
          </Typography>

          {/* Contact Chips */}
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
              {[
                {
                  icon: <MailIcon fontSize="small" />,
                  text: userData?.email,
                },
                {
                  icon: <PhoneIcon fontSize="small" />,
                  text: userData?.contactNumber,
                },
              ].map((item, idx) => (
                <Chip
                  key={idx}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {item.icon}
                      <Typography
                        sx={{ color: "#24252C", fontFamily: "Poppins" }}
                      >
                        {currentStatus === "Application Viewed" ? "**************" : item.text}
                      </Typography>
                       {currentStatus !== "Application Viewed" && (
                        <IconButton size="small" onClick={() => navigator.clipboard.writeText(item.text)}>
                          <ContentCopyIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      )}
                    </Box>
                  }
                  variant="outlined"
                  sx={{ bgcolor: "#E3EDFF", pl: 1 }}
                />
              ))}
            </Box>
          </Box>
          {currentStatus === "Application Viewed" && (
            <Typography sx={{ mt: 2, color: "#808195", fontFamily: "Poppins", fontSize: "14px", textAlign: "center" }}>
              Note: Shortlist the candidate to view contact details
            </Typography>
          )}
        </Box>

        {/* Quick Glance Section */}
        <Section title="Quick Glance">
          <Typography
            sx={{
              fontFamily: "Poppins",
              color: "#24252C",
              fontSize: "14px",
              mt: 2,
            }}
          >
            Years of Experience: {userData?.experience}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              color: "#24252C",
              fontSize: "14px",
              mt: 0.5,
            }}
          >
            Current Company: {userData?.currentCompany}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              color: "#24252C",
              fontSize: "14px",
              mt: 0.5,
            }}
          >
            Designation: {userData?.currentDesignation}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              color: "#24252C",
              fontSize: "14px",
              mt: 0.5,
            }}
          >
            About: {userData?.about}
          </Typography>
        </Section>

        {/* Skills Section */}
        <Section title="Skills">
          {userData?.skills.length > 0 ? (
            <Typography
              sx={{
                fontFamily: "Poppins",
                color: "#24252C",
                fontSize: "14px",
                mt: 2,
                mb: 2,
              }}
            >
              {userData?.skills?.join(", ")}
            </Typography>
          ) : (
            <Typography
              sx={{
                fontFamily: "Poppins",
                color: "#24252C",
                fontSize: "14px",
                mt: 2,
                mb: 2,
              }}
            >
              Skills not updated
            </Typography>
          )}
        </Section>

        {/* Work Experience Section */}
        <Section title="Work Experience">
          {userData?.workExperience?.length > 0 ? (
            <List sx={{ mt: 2, mb: 1 }}>
              {userData?.workExperience?.map((job, index) => (
                <React.Fragment key={index}>
                  <ListItem divider button onClick={() => handleToggle(index)}>
                    <ListItemText
                      primary={
                        <Typography
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
                      }
                    />
                    <IconButton>
                      {expanded[index] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </ListItem>

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
          ) : (
            <Typography
              sx={{
                fontFamily: "Poppins",
                color: "#24252C",
                fontSize: "14px",
                mt: 2,
                mb: 2,
              }}
            >
              Work Experience not updated
            </Typography>
          )}
        </Section>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 2,
            mt: 4,
            mb: 8,
            width: { md: "80%", lg: "80%", sm: "100%", xs: "100%" },
          }}
        >
          {/* Download Resume */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#3C7EFC",
              borderRadius: 16,
              textTransform: "none",
              fontFamily: "Satoshi",
              fontWeight: 700,
            }}
            onClick={() => {
              if (userData?.cvUrl) {
                window.open(userData.cvUrl, "_blank");
              } else {
                alert("Resume link not available...");
              }
            }}
          >
            View Resume
          </Button>
          {/* Action / Hired Button */}
          {currentStatus === "Hired" ? (
            <Button
              fullWidth
              variant="contained"
              disabled
              sx={{
                bgcolor: "#808080",
                borderRadius: 16,
                textTransform: "none",
                fontFamily: "Satoshi",
                fontWeight: 700,
              }}
            >
              Hired
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "green",
                borderRadius: 16,
                textTransform: "none",
                fontFamily: "Satoshi",
                fontWeight: 700,
              }}
              onClick={handleStatusUpdate}
            >
              {nextAction}
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ViewProfile;

// Reusable section wrapper
const Section = ({ title, children }) => (
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
            {title}
          </Typography>
        }
      />
    </Tabs>
    {children}
  </Box>
);
