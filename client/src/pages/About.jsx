import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import about1 from "../assets/about1.svg";
import about2 from "../assets/about2.svg";
import Profile from "../assets/ProfileImg.jpg";

const About = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: "white" }}>
      <Typography
        variant="h4"
        fontWeight="600"
        textAlign="center"
        sx={{ mb: 8, fontFamily: "Urbanist", color: "#3C7EFC", mt: 6 }}
      >
        <span style={{ color: "#474E68", fontFamily: "Urbanist", fontWeight: "600" }}>Strategic{" "}</span>
        Hiring,{" "}
        <span style={{ color: "#474E68", fontFamily: "Urbanist", fontWeight: "600" }}>Meaningful{" "}</span>
        Careers
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
        Great careers don’t happen by chance, and neither do great hires. At High Impact Talent<br />
        we bridge the gap between top talent and leading organizations, ensuring the <br />
        perfect match—not just by skills, but by culture, ambition, and long-term vision. <br />
        Because when the right people meet the right opportunity, success follows.
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
              Founded by experts from Bain & Company and the Mahindra Group, High Impact Talent was born out of a desire to solve the challenges faced by organizations in finding the right talent for strategic roles.<br /><br />
              With our extensive industry knowledge and network, we are uniquely positioned to understand and meet the needs of both job seekers and employers. We work closely with both parties to create lasting professional relationships, ensuring that every placement is a step towards greater success.
            </Typography>
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
              Our vision is to be the most trusted and effective recruitment partner for high-impact roles, driving success for individuals and organizations alike.<br /><br />
              We aim to revolutionize the hiring process by leveraging data-driven insights, AI-powered recommendations, and human expertise to ensure the best possible match between candidates and companies.
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ width: { xs: "100%", md: "30%" }, display: "flex", justifyContent: "center" }}>
          <img src={about2} alt="img here" style={{ maxWidth: "100%", height: "auto" }} />
        </Box>
      </Box>

      {/* Founders Section */}
      <Typography
        variant="h4"
        fontWeight="600"
        textAlign="center"
        sx={{ mb: 8, fontFamily: "Urbanist", color: "#474E68", mt: 6 }}
      >
        About the founders
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: "space-between",
          mt: 10,
          gap: 4,
        }}
      >
        {/* Founder 1 */}
        <Box sx={{ width: { xs: "100%", md: "50%" }, p: 2 }}>
          <Stack sx={{ justifyContent: "center", alignItems: "center" }} gap={0.5}>
            <Box sx={{ width: "60%", height: 280, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src={Profile} alt="img here" style={{ borderRadius: 14, height: "100%", objectFit: "cover", width: "100%" }} />
            </Box>
            <Typography sx={{ color: "#404258", fontSize: 16, fontWeight: "600", fontFamily: "Poppins" }}>Koustubh Haridas</Typography>
            <Typography sx={{ color: "#474E68", fontSize: 12, fontWeight: "600", fontFamily: "Poppins" }}>Co-Founder & CEO</Typography>
            <Typography sx={{ color: "#808195", fontSize: 10, fontFamily: "Poppins" }}>(ex-Bain & Company)</Typography>
            <Typography sx={{
              justifyContent: "center",
              fontSize: 10,
              alignItems: "center",
              textAlign: "center",
              border: 1,
              borderRadius: 2,
              p: 1,
              color: "#474E68",
              fontWeight: "400",
              fontFamily: "Poppins"
            }}>
              With years of strategic consulting<br /> experience, Koustubh drives the vision<br /> and growth of High Impact Talent.
            </Typography>
          </Stack>
        </Box>

        {/* Founder 2 */}
        <Box sx={{ width: { xs: "100%", md: "50%" }, p: 2 }}>
          <Stack sx={{ justifyContent: "center", alignItems: "center" }} gap={0.5}>
            <Box sx={{ width: "60%", height: 280, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src="https://media.licdn.com/dms/image/v2/C4E03AQHvDmfkfmUe5g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1594657616165?e=1747267200&v=beta&t=noDbx2lcVeUKX8Ql3-0bF-lJDmzHckcQLpBFrbmSocY"
                alt="img here"
                style={{ borderRadius: 14, height: "100%", objectFit: "cover", width: "100%" }}
              />
            </Box>
            <Typography sx={{ color: "#404258", fontSize: 16, fontWeight: "600", fontFamily: "Poppins" }}>Umang Somani</Typography>
            <Typography sx={{ color: "#474E68", fontSize: 12, fontWeight: "600", fontFamily: "Poppins" }}>Co-Founder & CFO</Typography>
            <Typography sx={{ color: "#808195", fontSize: 10, fontFamily: "Poppins" }}>(Mahindra Group)</Typography>
            <Typography sx={{
              justifyContent: "center",
              fontSize: 10,
              alignItems: "center",
              textAlign: "center",
              border: 1,
              borderRadius: 2,
              p: 1,
              color: "#474E68",
              fontWeight: "400",
              fontFamily: "Poppins"
            }}>
              Umang's financial and operational<br /> acumen ensures seamless execution and<br /> continuous improvement in our services.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default About;
