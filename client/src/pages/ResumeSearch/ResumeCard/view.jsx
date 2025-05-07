import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Avatar,
  Stack,
  Typography,
  Chip,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';

const ProfileCard = ({ resume }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleCopy = (text) => navigator.clipboard.writeText(text);

  return (
    <Box
      sx={{
        border: '1px solid #0000004D',
        borderRadius: 4,
        overflow: 'hidden',
        mb: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'flex-start',
          p: { xs: 2, sm: 4 },
        }}
      >
        {/* Avatar always top-left */}
        <Box sx={{ mr: { xs: 0, sm: 4 }, mb: { xs: 2, sm: 0 } }}>
          <Avatar
            sx={{
              bgcolor: '#D9D9D9',
              width: 80,
              height: 80,
              fontSize: '2rem',
            }}
          >
            {resume.personalInformation.name.charAt(0)}
          </Avatar>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, width: '100%' }}>
          {/* Name */}
          <Typography
            sx={{
              color: '#24252C',
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '20px',
            }}
          >
            {resume.personalInformation.name}
          </Typography>

          {/* Contact Chips */}
          <Box sx={{display:"flex",flexDirection:{xs:"column",md:"row",lg:"row",sm:"column",flexWrap:"wrap",gap:4}}} mt={1}>
            <Chip
              variant="outlined"
              sx={{ bgcolor: '#E3EDFF', pl: 1 }}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,justifyContent:"flex-start" }}>
                  <EmailIcon fontSize="small" />
                  <Typography sx={{ color: '#24252C', fontFamily: 'Poppins',fontSize: {xs:'12px',sm:'12px'} }}>
                    {resume.personalInformation.email}
                  </Typography>
                  <IconButton size="small" onClick={() => handleCopy(resume.personalInformation.email)}>
                    <ContentCopyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              }
            />

            <Chip
              variant="outlined"
              sx={{ bgcolor: '#E3EDFF', pl: 1 }}
              label={
                <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: 'flex-start',
                }}
              >
                  <PhoneIcon fontSize="small" />
                  <Typography sx={{ color: '#24252C', fontFamily: 'Poppins' ,fontSize: {xs:'12px',sm:'12px'}}}>
                    {resume.personalInformation.contactNumber}
                  </Typography>
                  <IconButton size="small" onClick={() => handleCopy(resume.personalInformation.contactNumber)}>
                    <ContentCopyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              }
            />
          </Box>

          {/* Meta Info */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
            <Typography
              sx={{
                color: '#474E68',
                fontFamily: 'Poppins',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <WorkIcon fontSize="small" sx={{ mr: 1 }} />
              {resume.professionalDetails.noOfYearsExperience} Years Experience
            </Typography>
            <Typography
              sx={{
                color: '#474E68',
                fontFamily: 'Poppins',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
              {resume.personalInformation.location}
            </Typography>
            <Typography
              sx={{
                color: '#474E68',
                fontFamily: 'Poppins',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
              {resume.professionalDetails.currentCompany}
            </Typography>
          </Stack>

          {/* Skills */}
          <Box mt={2}>
            <Typography
              sx={{
                color: '#24252C',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '16px',
              }}
            >
              Key Skills:
            </Typography>
            <Typography sx={{ fontFamily: 'Poppins', color: '#000000', fontSize: '14px', mt: 0.5 }}>
              {resume.skills.join(', ')}
            </Typography>
          </Box>

          {/* View Profile Button */}
          <Box mt={4}>
            <Button
              variant="contained"
              onClick={() => navigate(`/resumesearch/viewresume/${resume._id}`)}
              sx={{
                bgcolor: '#3C7EFC',
                borderRadius: 50,
                px: '28px',
                py: '14px',
                textTransform: 'none',
                fontFamily: 'Satoshi',
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
