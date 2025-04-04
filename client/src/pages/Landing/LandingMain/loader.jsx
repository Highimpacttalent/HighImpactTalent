// components/Loader.jsx
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const Loader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backdropFilter: 'blur(2px)',
        zIndex: 1300, // higher than Material UI modal
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap:4
      }}
    >
      <CircularProgress size={40} thickness={5} color="primary" />
      <Typography sx={{fontWeight:"500",fontFamily:"Satoshi",fontSize:"24px",color:"#474E68"}}>More applications don’t mean better chances. <span style={{fontWeight:"500",fontFamily:"Satoshi",fontSize:"24px",color:"#3C7EFC"}}>Smart targeting</span> beats random applying!</Typography>
    </Box>
  );
};

export default Loader;
