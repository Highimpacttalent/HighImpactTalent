import React,{useState,useEffect} from "react";
import { Container, Card, CardContent, Typography, Grid, Avatar, Chip, List, ListItem, ListItemText, IconButton } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { deepPurple } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {LocalPhone} from "@mui/icons-material";
import MailIcon from "@mui/icons-material/Mail";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useParams } from "react-router-dom";
import axios from "axios"

const ViewResumeProfile = () => {

  const {resumeId} = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axios.post("https://highimpacttalent.onrender.com/api-v1/resume/getResumeId", {
          resumeId
        });
        setUserData(response.data.data);
        console.log(userData)
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Profile Header */}
      <Card sx={{ p: 3, textAlign: "center", background: deepPurple[50] }}>
        <Avatar
          sx={{ bgcolor: deepPurple[500], width: 80, height: 80, margin: "0 auto" }}
        >
          {userData?.personalInformation?.name.charAt(0)}
        </Avatar>
        <Typography variant="h5" fontWeight="bold" mt={2}>
          {userData?.personalInformation?.name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {userData?.professionalDetails?.currentDesignation} at{" "}
          {userData?.professionalDetails?.currentCompany}
        </Typography>

        {/* Contact Information */}
        <Typography variant="body2" sx={{ mt: 1 }}>
          <LocationOnIcon fontSize="small" /> {userData?.personalInformation?.location}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <MailIcon fontSize="small" /> {userData?.personalInformation?.email}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <LocalPhone fontSize="small" /> {userData?.personalInformation?.contactNumber}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <LinkedInIcon fontSize="small" /> {userData?.personalInformation?.linkedinLink}
        </Typography>
      </Card>

      {/* Professional Details */}
      <Card sx={{ mt: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">Quick Glance</Typography>
          <Typography variant="body1">Years of Experience: {userData?.professionalDetails?.noOfYearsExperience}</Typography>
          <Typography variant="body1">Current Company: {userData?.professionalDetails?.currentCompany}</Typography>
          <Typography variant="body1">Designation: {userData?.professionalDetails?.currentDesignation}</Typography>
          <Typography variant="body1">About: {userData?.professionalDetails?.about}</Typography>
        </CardContent>
      </Card>

      {/* Education */}
      <Card sx={{ mt: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            <SchoolIcon /> Education
          </Typography>
          <List>
            {userData?.educationDetails?.map((edu, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={<Typography fontWeight="bold">{edu?.instituteName}</Typography>}
                  secondary={`Graduated in ${edu?.yearOfPassout}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

       {/* Skills */}
       <Card sx={{ mt: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">Skills</Typography>
          <Grid container spacing={1} mt={1}>
            {userData?.skills?.map((skill, index) => (
              <Grid item key={index}>
                <Chip label={skill} color="primary" variant="outlined" />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      
      {/* Work Experience */}
      <Card sx={{ mt: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            <WorkIcon /> Work Experience
          </Typography>
          <List>
  {userData?.workExperience?.map((job, index) => (
    <React.Fragment key={index}>
      <ListItem divider button onClick={() => handleToggle(index)}>
        <ListItemText
          primary={<Typography fontWeight="bold">{job?.jobTitle}</Typography>}
          secondary={`${job?.companyName} | ${job?.duration}`}
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

        </CardContent>
      </Card>
     
    </Container>
  );
};

export default ViewResumeProfile;