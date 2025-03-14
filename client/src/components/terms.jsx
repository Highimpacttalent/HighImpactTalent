import React from 'react';
import { Container, Typography, Paper, Box, Stack } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Box sx={{ p: 5, bgcolor: 'white' }}>
      <Typography 
        variant="h4" 
        fontWeight="600" 
        textAlign="center" 
        sx={{ mb: 8, fontFamily: 'Satoshi, sans-serif', color: '#3C7EFC', mt: 6 }}
      >
        Terms and Conditions
      </Typography>

      <Typography 
        fontWeight="400" 
        textAlign="left" 
        sx={{ mb: 8, fontFamily: 'Poppins', color: '#808195', fontSize: 20 }}
      >
        Welcome to our job search platform for consultants. By accessing and using our website, you agree to comply with and be bound by the following terms and conditions.
      </Typography>

      <Stack spacing={4}>
        <Typography sx={{ fontFamily: 'Poppins', color: '#474E68', fontSize: 20 }}>
          1. Account Registration: Users must provide accurate and complete information during registration. Any false information may lead to account suspension.
        </Typography>

        <Typography sx={{ fontFamily: 'Poppins', color: '#474E68', fontSize: 20 }}>
          2. User Responsibilities: Users are responsible for maintaining the confidentiality of their account credentials and activities.
        </Typography>

        <Typography sx={{ fontFamily: 'Poppins', color: '#474E68', fontSize: 20 }}>
          3. Job Posting and Applications: All job postings must be genuine and relevant to consulting roles. Any misleading content will be removed.
        </Typography>

        <Typography sx={{ fontFamily: 'Poppins', color: '#474E68', fontSize: 20 }}>
          4. Privacy Policy Compliance: Users must adhere to our privacy policy regarding data handling and confidentiality.
        </Typography>

        <Typography sx={{ fontFamily: 'Poppins', color: '#474E68', fontSize: 20 }}>
          5. Intellectual Property: All content and materials on this platform are protected by copyright laws and cannot be reproduced without permission.
        </Typography>

        <Typography sx={{ fontFamily: 'Poppins', color: '#474E68', fontSize: 20 }}>
          6. Termination of Service: We reserve the right to suspend or terminate any user account that violates these terms and conditions.
        </Typography>
      </Stack>

      <Typography 
        fontWeight="400" 
        textAlign="left" 
        sx={{ mt: 8, fontFamily: 'Poppins', color: '#808195', fontSize: 20 }}
      >
        By using this platform, you acknowledge that you have read, understood, and agreed to these terms and conditions.
      </Typography>
    </Box>
  );
};

export default TermsAndConditions;