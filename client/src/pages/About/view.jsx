import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import about1 from "../../assets/about1.svg";
import about2 from "../../assets/about2.svg";
import Profile from "../../assets/ProfileImg.jpg";
import Profile2 from "../../assets/Umangsomani.jpeg";

const About = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 8 },pt: { xs: 2, md: 4 }, bgcolor: "white" }}>
      <Typography
        variant="h4"
        fontWeight="600"
        textAlign="center"
        sx={{ mb: 8, fontFamily: "Urbanist", color: "#3C7EFC", mt: 6 }}
      >
        <span style={{ color: "#474E68", fontFamily: "Urbanist", fontWeight: "600" }}>Where Strategic{" "}</span>
        Hiring Meets{" "}
        <span style={{ color: "#474E68", fontFamily: "Urbanist", fontWeight: "600" }}>Career-Defining{" "}</span>
        Moves
      </Typography>

      <Typography
        fontWeight="400"
        textAlign="center"
        sx={{
          mb: 8,
          fontFamily: "Poppins",
          color: "#808195",
          fontSize: { xs: 16, md: 20 },
        }}
      >
        Great careers aren’t built on luck—and great hires aren’t found by sifting through 10,000 resumes. At High Impact Talent, we bridge the gap between high-performing professionals and forward-thinking organizations.<br/><br/>

We go beyond job descriptions and CVs. We match ambition with vision, culture with chemistry, and people with purpose.
      </Typography>

      {/* Our Story */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          justifyContent: "space-between",
          mt: 10,
          gap: 4,
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "70%" }, p: 2 }}>
          <Stack>
            <Typography sx={{ color: "#474E68", fontSize: 34, mb: 4, fontWeight: "700", fontFamily: "Urbanist" }}>
              Our Story
            </Typography>
            <Typography sx={{ fontFamily: "Poppins", color: "#474E68", fontSize: 20 }}>
              Built by Insiders. Backed by Experience. Trusted by Leaders.
Founded by veterans from Bain & Company and the Mahindra Group, High Impact Talent was born to fix what traditional hiring platforms broke: speed, relevance, and trust.

We saw the pain—founders wasting weeks skimming irrelevant profiles, and top-tier candidates lost in the noise. So we built a solution. One that’s fast, curated, and radically outcome-driven.

Whether you're a Series A rocketship or an enterprise giant, we’re your unfair advantage in hiring strategic, high-impact talent. </Typography>
          </Stack>
        </Box>
        <Box sx={{ width: { xs: "100%", md: "30%" }, display: "flex", justifyContent: "center" }}>
          <img src={about1} alt="img here" style={{ maxWidth: "100%", height: "auto" }} />
        </Box>
      </Box>

      {/* Our Vision */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          justifyContent: "space-between",
          mt: 10,
          gap: 4,
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "70%" }, p: 2 }}>
          <Stack>
            <Typography sx={{ color: "#474E68", fontSize: 34, mb: 4, fontWeight: "700", fontFamily: "Urbanist" }}>
              Our Vision
            </Typography>
            <Typography sx={{ fontFamily: "Poppins", color: "#474E68", fontSize: 20 }}>
              To Make Every Hire Count. For Good.
We’re not a job board. We’re a talent intelligence platform. Our vision is to redefine the way high-stakes hiring happens—through:<br/>

1. AI-powered shortlisting (no noise, just precision)<br/>
2. Human-led matchmaking (we’ve been in the boardroom, not just the backend)<br/>
3. Data-driven decisions (because gut-feel doesn’t scale)<br/>

Our mission? To become the most trusted recruitment partner for high-impact roles across India and beyond.</Typography>
          </Stack>
        </Box>
        <Box sx={{ width: { xs: "100%", md: "30%" }, display: "flex", justifyContent: "center" }}>
          <img src={about2} alt="img here" style={{ maxWidth: "100%", height: "auto" }} />
        </Box>
      </Box>


      
    </Box>
  );
};

export default About;
