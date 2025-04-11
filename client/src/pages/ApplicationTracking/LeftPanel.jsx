import React from "react";
import { Box, Typography, Stepper, Step, StepLabel } from "@mui/material";
import AppliedJobCard from "./AppliedJobCard";
import CloseIcon from "@mui/icons-material/Close";

function LeftPanel({ Application }) {
  const steps = ["Applied", "Shortlisted", "Interviewing", "Hired"];
  const currentStatus = Application?.status?.toLowerCase(); // handle undefined gracefully

// Convert steps to lowercase for comparison
const lowerSteps = steps.map(step => step.toLowerCase());

// Find current step index in lowercase array
const currentStepIndex = lowerSteps.indexOf(currentStatus);

// Check if rejected
const isRejected = currentStatus === "not progressing";

  return (
    <Box
      sx={{
        pr: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ width: "100%",ml:{xs:3,sm:3,md:0,lg:0} }}>
        <AppliedJobCard job={Application} />
      </Box>
      <Box sx={{ width: "100%" }}>
        <Typography
          sx={{
            color: "#24252C",
            fontFamily: "Satoshi",
            fontWeight: "500",
            fontSize: "24px",
            ml:2
          }}
        >
          Application Status
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Stepper activeStep={isRejected ? steps.length : currentStepIndex} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}

            {/* If status is rejected, add red cross step */}
            {isRejected && (
              <Step>
                <StepLabel
                  StepIconComponent={() => (
                    <CloseIcon sx={{ color: "red", fontSize: 24 }} />
                  )}
                >
                  Not Progressing
                </StepLabel>
              </Step>
            )}
          </Stepper>
        </Box>
        <Box sx={{mt:2}}>
        <Typography
          sx={{
            color: "#24252C",
            fontFamily: "Satoshi",
            fontWeight: "500",
            fontSize: "24px",
            ml:2
          }}
        >
            Recruiter Details
            </Typography>
        </Box>
        <Box sx={{display:"flex",px:2}}>
        <Box sx={{border:"1px solid #00000040",borderRadius:4,display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"center",p:2,mt:2}}>
            <Typography sx={{color:"#24252C",fontFamily:"Poppins",fontWeight:"500",fontSize:"18px"}}>{Application?.company?.recruiterName}</Typography>
            <Typography sx={{color:"#474E68",fontFamily:"Poppins",fontWeight:"400",fontSize:"18px"}}>{Application?.company?.name}</Typography>
        </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LeftPanel;
