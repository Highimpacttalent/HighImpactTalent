import React, { useState, useEffect } from "react";
import { FaSearch, FaBriefcase, FaUsers } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { Box, Button, Container, Grid, Typography, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { WorkOutline, GroupAdd } from "@mui/icons-material";
import No1 from "../../../assets/LandingPhone/No1.svg";
import No2 from "../../../assets/LandingPhone/No2.svg";
import No3 from "../../../assets/LandingPhone/No3.svg";

const MobileLanding = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      setIsOpen(true);
    }
  }, [user]);

  return (
    <div>
      {/* {LoginModal} */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            px: { xs: 3, md: 15 },
            pb: { xs: 3, md: 15 },
            pt: { xs: 3 },
            minHeight: { md: "100vh" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "white",
          }}
        >
          <Box sx={{ flex: 1, textAlign:"center"}}>
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontSize: "22px",
                fontWeight: 700,
                color: "#24252C",
              }}
            >
              A job portal designed for{" "}
              <span
                style={{
                  fontFamily: "Satoshi",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#3C7EFC",
                }}
              >
                Impact
              </span>
              .
            </Typography>

            <Typography
              sx={{
                color: "#808195",
                fontFamily: "Poppins",
                mt: 2,
                fontSize: "16px",
              }}
            >
              Top talent and high-impact opportunities move fast. Be part of the
              elite network that gets there first
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              mt: 6,
            }}
          >
            <img
              src={No1}
              alt="Professional"
              style={{
                height: { xs: "100px", sm: "100px", md: "400px" }, // Responsive heights
                width: "auto",
                borderRadius: "8px",
                transition: "opacity 0.3s ease-in-out",
              }}
            />
            <img
              src={No2}
              alt="Professional"
              style={{
                height: { xs: "100px", sm: "100px", md: "400px" }, 
                width: "auto",
                borderRadius: "8px",
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <img
              src={No3}
              alt="Professional"
              style={{
                height: { xs: "100px", sm: "100px", md: "400px" }, 
                width: "auto",
                borderRadius: "8px",
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            height: 50,
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            component={Link}
            to="/u-login"
            sx={{
              bgcolor: "#3C7EFC",
              borderRadius: 16,
              fontFamily: "Poppins",
              width: "88%",
            }}
          >
            Find Your Opportunity
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/r-login"
            sx={{
              bgcolor: "#3C7EFC",
              borderRadius: 16,
              fontFamily: "Poppins",
              width: "88%",
            }}
          >
            Hire Top Talent
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default MobileLanding;
