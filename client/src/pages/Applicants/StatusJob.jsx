import React from "react";
import { Box, Stepper, Step, StepLabel, useMediaQuery, useTheme, Typography } from "@mui/material";

function StatusJob({ activeStep, onStepClick }) {
  const steps = [
    "Applied",
    "Application Viewed",
    "Shortlisted",
    "Interviewing",
    "Hired",
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ mt: 3, width: "100%", overflowX: isMobile ? "auto" : "visible" }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons={isMobile ? "auto" : false}
        allowScrollButtonsMobile={isMobile}
        sx={{
          minWidth: isMobile ? 360 : 'auto',
          padding: isMobile ? theme.spacing(1) : 0,
        }}
      >
        {steps.map((label, index) => (
          <Step key={label} onClick={() => onStepClick(index)}>
            <StepLabel
              sx={{
                cursor: "pointer",
                "& .MuiStepLabel-label": {
                  fontSize: isMobile ? '0.675rem' : '0.875rem',
                  whiteSpace: 'nowrap',
                },
              }}
            >
              {/* Wrap label in Typography to control noWrap */}
              <Typography noWrap>
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default StatusJob;
