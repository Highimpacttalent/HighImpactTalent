import React from 'react'
import { Box } from '@mui/material'
import Jobcardview from "../Jobcardview"
import { useLocation } from 'react-router-dom';
import JobDesc from '../JobDesc';

function View() {
  const { state } = useLocation();
  const job = state?.job;
  return (
    <Box sx={{bgcolor:"white",p:4}}>
        <Box sx={{mt:4}}>
        <Jobcardview job={job}></Jobcardview>
        </Box>
        <Box sx={{mt:4}}>
        <JobDesc job={job}></JobDesc>
        </Box>
    </Box>
  )
}

export default View
