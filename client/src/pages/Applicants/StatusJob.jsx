import { Box, Stepper, Step, StepLabel } from "@mui/material";

function StatusJob({ activeStep, onStepClick }) {
  const steps = ["Applied", "Application Viewed", "Shortlisted", "Interviewing", "Hired"];

  return (
    <Box sx={{ mt: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel onClick={() => onStepClick(index)}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default StatusJob;
