import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Box, Container, Grid, Typography, IconButton, Avatar} from "@mui/material";
import logo from "../assets/tlogo.png";

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "grey.900", color: "white", py: 5 }}>
      <Container>
        {/* Logo & Title */}
        <Grid container justifyContent="center" alignItems="center" spacing={1}>
          <Grid item>
            {/* Company Logo */}
            <Avatar
              src={logo} // Replace with your actual logo URL or import
              alt="Company Logo"
              sx={{ width: 50, height: 50, bgcolor: "white" }} // Adjust size & background color if needed
            />
          </Grid>
          <Grid item>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#1176DB", textTransform: "uppercase" }}>
              High Impact Talent
            </Typography>
          </Grid>
        </Grid>

        {/* Navigation Links */}
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Link to="/" style={{ textDecoration: "none", color: "gray" }}>
              <Typography variant="body2" sx={{ "&:hover": { color: "white" } }}>
                Home
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/about-us" style={{ textDecoration: "none", color: "gray" }}>
              <Typography variant="body2" sx={{ "&:hover": { color: "white" } }}>
                About Us
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/contact-us" style={{ textDecoration: "none", color: "gray" }}>
              <Typography variant="body2" sx={{ "&:hover": { color: "white" } }}>
                Contact
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/privacy-policy" style={{ textDecoration: "none", color: "gray" }}>
              <Typography variant="body2" sx={{ "&:hover": { color: "white" } }}>
                Privacy & Policy
              </Typography>
            </Link>
          </Grid>
        </Grid>

        {/* Copyright & Email */}
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Typography variant="body2" textAlign="center">
            &copy; 2024 HighImpactTalentEnquiry |{" "}
            <a href="mailto:highimpacttalentenquiry@gmail.com" style={{ color: "#1176DB", fontWeight: "bold" }}>
              highimpacttalentenquiry@gmail.com
            </a>
          </Typography>
        </Grid>

        {/* Social Media Icons */}
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <IconButton sx={{ color: "white", mx: 1, "&:hover": { color: "#1176DB" } }}>
            <FaFacebookF size={20} />
          </IconButton>
          <IconButton sx={{ color: "white", mx: 1, "&:hover": { color: "#1176DB" } }}>
            <FaTwitter size={20} />
          </IconButton>
          <IconButton sx={{ color: "white", mx: 1, "&:hover": { color: "#1176DB" } }}>
            <FiInstagram size={20} />
          </IconButton>
          <IconButton sx={{ color: "white", mx: 1, "&:hover": { color: "#1176DB" } }}>
            <FaLinkedinIn size={20} />
          </IconButton>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
