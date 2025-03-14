import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

const RefundPolicy = () => {
  return (
    <Box sx={{ p: 5, bgcolor: 'white' }}>
      <Typography 
        variant="h4" 
        fontWeight="600" 
        textAlign="center" 
        sx={{ mb: 8, fontFamily: 'Satoshi, sans-serif', color: '#3C7EFC', mt: 6 }}
      >
        Refund Policy
      </Typography>

      <Typography 
        fontWeight="400" 
        textAlign="center" 
        sx={{ mb: 8, fontFamily: 'Poppins', color: '#808195', fontSize: 20 }}
      >
        Our goal is to provide top-tier consulting job opportunities. However, in case of dissatisfaction with our services, please review our refund policy.
      </Typography>

      <Box sx={{ mt: 10 }}>
        <Stack spacing={4}>
          <Typography sx={{ fontFamily: 'Satoshi, sans-serif', color: '#474E68', fontSize: 24, fontWeight: '700' }}>
            Eligibility for Refund
          </Typography>
          <Typography sx={{ fontFamily: 'Poppins', color: '#474E68', fontSize: 18 }}>
            Refund requests are only accepted within 14 days of service purchase. Refunds will not be issued for completed consultations or job placements.
          </Typography>

          <Typography sx={{ fontFamily: 'Satoshi, sans-serif', color: '#474E68', fontSize: 24, fontWeight: '700' }}>
            Refund Process
          </Typography>
          <Typography sx={{ fontFamily: 'Poppins', color: '#474E68', fontSize: 18 }}>
            To initiate a refund, contact our support team with proof of payment and a valid reason. Refunds will be processed within 7-10 business days.
          </Typography>

          <Typography sx={{ fontFamily: 'Satoshi, sans-serif', color: '#474E68', fontSize: 24, fontWeight: '700' }}>
            Contact Support
          </Typography>
          <Typography sx={{ fontFamily: 'Poppins', color: '#474E68', fontSize: 18 }}>
            For any refund-related queries, reach out to highimpacttalentenquiry@gmail.com.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default RefundPolicy;