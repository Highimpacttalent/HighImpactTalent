import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Link } from "react-router-dom";
import { Box, Container, Grid, Typography, IconButton, Avatar } from "@mui/material";
import logo from "../assets/tlogo.png";

const Footer = () => {
  return (
    <Box
    component="footer"
    sx={{
      bgcolor: "#F1F4F7",
      color: "black",
      py: 6,
      fontFamily: "Poppins, sans-serif",
    }}
  >
    <Container>
      <Grid container spacing={4} justifyContent="space-between">
        {/* Logo & Social Media */}
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Avatar src={logo} alt="Company Logo" sx={{ width: 55, height: 55 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Poppins', color: '#404258' }}>
              High Impact Talent
            </Typography>
          </Box>

          {/* Social Media Icons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            <IconButton sx={{ transition: "0.3s", "&:hover": { transform: "scale(1.2)" } }} onClick={() => window.open("https://www.linkedin.com/company/highimpacttalent/posts/?feedView=all")}>
              <LinkedInIcon fontSize="medium" />
            </IconButton>
          </Box>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} sm={4} textAlign="center">
          <Typography variant="body1" fontWeight="bold" sx={{ mb: 1, fontFamily: 'Poppins', color: '#404258' }}>
            Quick Links
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <Link to="/about-us" style={{ textDecoration: "none", color: "#404258", transition: "0.3s" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#1176DB")} 
              onMouseOut={(e) => (e.currentTarget.style.color = "#404258")}>
              About
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <Link to="/find-jobs" style={{ textDecoration: "none", color: "#404258", transition: "0.3s" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#1176DB")} 
              onMouseOut={(e) => (e.currentTarget.style.color = "#404258")}>
              Careers
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <Link to="/companies" style={{ textDecoration: "none", color: "#404258", transition: "0.3s" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#1176DB")} 
              onMouseOut={(e) => (e.currentTarget.style.color = "#404258")}>
              Companies
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <Link to="/blog" style={{ textDecoration: "none", color: "#404258", transition: "0.3s" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#1176DB")} 
              onMouseOut={(e) => (e.currentTarget.style.color = "#404258")}>
              Blogs
            </Link>
          </Typography>
        </Grid>

        {/* Legal Links */}
        <Grid item xs={12} sm={4} textAlign="center">
          <Typography variant="body1" fontWeight="bold" sx={{ mb: 1, fontFamily: 'Poppins', color: '#404258' }}>
            Legal
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <Link to="/" style={{ textDecoration: "none", color: "#404258", transition: "0.3s" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#1176DB")} 
              onMouseOut={(e) => (e.currentTarget.style.color = "#404258")}>
              Terms and Conditions
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <Link to="/" style={{ textDecoration: "none", color: "#404258", transition: "0.3s" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#1176DB")} 
              onMouseOut={(e) => (e.currentTarget.style.color = "#404258")}>
              Privacy Policy
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <Link to="/contact-us" style={{ textDecoration: "none", color: "#404258", transition: "0.3s" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#1176DB")} 
              onMouseOut={(e) => (e.currentTarget.style.color = "#404258")}>
              Contact Us
            </Link>
          </Typography>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Typography variant="body2" textAlign="center" sx={{ mt: 4, fontFamily: 'Poppins', color: '#404258' }}>
        &copy; 2024 HighImpactTalentEnquiry | {" "}
        <a href="mailto:highimpacttalentenquiry@gmail.com" style={{ color: "#1176DB", fontWeight: "bold", textDecoration: "none", transition: "0.3s", fontFamily: 'Poppins' }}
          onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")} 
          onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}>
          highimpacttalentenquiry@gmail.com
        </a>
      </Typography>
    </Container>
  </Box>
  );
};

export default Footer;
