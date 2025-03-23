import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Box, Tabs, Tab, Typography, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { WorkOutline, GroupAdd } from "@mui/icons-material";

const Landing2 = () => {
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
    <Box display="flex" flexDirection="column" bgcolor="white">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Satoshi",
            fontWeight: "700",
            fontSize: "32px",
            color: "#474E68",
          }}
        >
          Act Fast, Stay Ahead. Land Your Next{" "}
          <span
            style={{
              color: "#3C7EFC",
              fontSize: "32px",
              fontWeight: "700",
              fontFamily: "Satoshi",
            }}
          >
            Big Role
          </span>{" "}
          Now!
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          ml:4
        }}
      >
        <Box >
          <Tabs
            value={0}
            indicatorColor="primary" // Keeps text as it is (no uppercase transformation)
            textColor= "#474E68"
          >
            <Tab label="Top Jobs for You" sx={{
              fontFamily: "Satoshi",
              fontSize: "18px",
              fontWeight: "700",
              textTransform: "none",
              textColor:"#474E68"
            }}/>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
};

export default Landing2;
