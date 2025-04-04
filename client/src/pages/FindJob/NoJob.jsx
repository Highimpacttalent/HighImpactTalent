import React from "react";
import { Box, Typography } from "@mui/material";
import NoJob from "../../assets/FindJob/NoJob.svg";

const NoJobFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 8,
        px: 2,
      }}
    >
      <Box
        component="img"
        src={NoJob}
        alt="No Jobs Found"
        sx={{
          width: { xs: "200px", sm: "250px", md: "300px" },
          mb: 3,
        }}
      />
      <Typography  sx={{ color: "#808195", fontWeight: 500,width: { xs: "350px", sm: "350px", md: "450px" },fontFamily:"Satoshi",fontSize:"20px" }}>
      Empty results today, but tomorrow could be different. Keep the hunt alive!
      </Typography>
    </Box>
  );
};

export default NoJobFound;
