// components/Loader.jsx
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { useMemo } from 'react';

const tips = [
  {
    text: (
      <>
        <Typography sx={{fontWeight:"500",fontFamily:"Satoshi",fontSize:"24px",color:"#474E68"}}>
        <span style={{fontWeight:"500",fontFamily:"Satoshi",fontSize:"24px",color:"#3C7EFC"}}>Job hunting hack: </span>
          
            Applying within 48 hours
          of a job posting boosts your chances by 4x. Speed wins!
        </Typography>
      </>
    ),
  },
  {
    text: (
      <>
       <Typography sx={{fontWeight:"500",fontFamily:"Satoshi",fontSize:"24px",color:"#474E68"}}>More applications don’t mean better chances. <span style={{fontWeight:"500",fontFamily:"Satoshi",fontSize:"24px",color:"#3C7EFC"}}>Smart targeting</span> beats random applying!</Typography>
      </>
    ),
  },
  {
    text: (
      <>
        <Typography sx={{fontWeight:"500",fontFamily:"Satoshi",fontSize:"24px",color:"#474E68"}}>
          <span style={{fontWeight:"500",fontFamily:"Satoshi",fontSize:"24px",color:"#3C7EFC"}}>Resume myth:</span> You don’t need to meet 100%of the job
          criteria. If you hit 60%, apply anyway!
        </Typography>
      </>
    ),
  },
];

const Loader = ({ isLoading }) => {
  // useMemo ensures a consistent random message during the same loading session
  const randomTip = useMemo(() => {
    const index = Math.floor(Math.random() * tips.length);
    return tips[index].text;
  }, []);

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
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        padding: 2,
        textAlign: 'center',
      }}
    >
      <CircularProgress size={40} thickness={5} color="primary" />
      {randomTip}
    </Box>
  );
};

export default Loader;