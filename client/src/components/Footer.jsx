import React, { useEffect } from "react";
import axios from "axios";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Grid, Typography, IconButton, Avatar } from "@mui/material";
import logo from "../assets/tlogo.png";
import { useSelector, useDispatch } from "react-redux";
import { Logout as LogoutAction } from "../redux/userSlice";

const Footer = () => {
  const { user } = useSelector((state) => state.user); // { token, ... }
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(LogoutAction());
    window.location.replace("/");
  };

  useEffect(() => {
    // if there's no user or no token, nothing to verify
    if (!user || !user.token) {
      return;
    }

    axios
      .get(
        "https://highimpacttalent.onrender.com/api-v1/verify/verify-token",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then(() => {
        // token is valid: do nothing
      })
      .catch((err) => {
        const code = err.response?.data?.code;
        if (["TOKEN_EXPIRED", "INVALID_TOKEN", "AUTH_FAILED"].includes(code)) {
          handleLogout();
        }
      });
  }, [user?.token]); // only rerun if token changes

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
              <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "Poppins", color: "#404258" }}>
                High Impact Talent
              </Typography>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              <IconButton
                sx={{ transition: "0.3s", "&:hover": { transform: "scale(1.2)" } }}
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/company/highimpacttalent/posts/?feedView=all"
                  )
                }
              >
                <LinkedInIcon fontSize="medium" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 1, fontFamily: "Poppins", color: "#404258" }}>
              Quick Links
            </Typography>
            {[
              { to: "/contact-us", label: "Contact Us" },
              { to: "/about-us", label: "About" },
              { to: "/blog", label: "Blogs" },
            ].map(({ to, label }) => (
              <Typography key={to} variant="body2" sx={{ mb: 0.5 }}>
                <Link
                  to={to}
                  style={{ textDecoration: "none", color: "#404258", transition: "0.3s" }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#1176DB")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#404258")}
                >
                  {label}
                </Link>
              </Typography>
            ))}
          </Grid>

          {/* Legal Links */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 1, fontFamily: "Poppins", color: "#404258" }}>
              Legal
            </Typography>
            {[
              { to: "/t&c", label: "Terms and Conditions" },
              { to: "/refund", label: "Refund Policy" },
              { to: "/privacy-policy", label: "Privacy Policy" },
            ].map(({ to, label }) => (
              <Typography key={to} variant="body2" sx={{ mb: 0.5 }}>
                <Link
                  to={to}
                  style={{ textDecoration: "none", color: "#404258", transition: "0.3s" }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#1176DB")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#404258")}
                >
                  {label}
                </Link>
              </Typography>
            ))}
          </Grid>
        </Grid>

        <Typography variant="body2" textAlign="center" sx={{ mt: 4, fontFamily: "Poppins", color: "#404258" }}>
          &copy; 2025 HighImpactTalentEnquiry |{" "}
          <a
            href="mailto:highimpacttalentenquiry@gmail.com"
            style={{
              color: "#1176DB",
              fontWeight: "bold",
              textDecoration: "none",
              transition: "0.3s",
              fontFamily: "Poppins",
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            highimpacttalentenquiry@gmail.com
          </a>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
