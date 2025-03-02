import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout,
  AccountCircle,
  LockReset,
  Assignment,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Logout as LogoutAction } from "../redux/userSlice";
import logo from "../assets/tlogo.png";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(LogoutAction());
    window.location.replace("/");
  };

  return (
    <AppBar
      position="sticky"
      sx={{ backgroundColor: "white", color: "black", boxShadow: 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Avatar src={logo} sx={{ width: 40, height: 40, mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              color: "#1176DB",
              fontWeight: "bold",
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            High Impact Talent
          </Typography>
        </Link>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          <Button
            component={Link}
            to={user?.accountType === "seeker" ? "/find-jobs" : "/view-jobs"}
            color="inherit"
            sx={{fontFamily: 'Poppins'}}
          >
            {user?.accountType === "seeker" ? "Find Job" : "Job Posts"}
          </Button>
          {user?.accountType === "seeker" && (
            <Button component={Link} to="/companies" color="inherit"
            sx={{fontFamily: 'Poppins'}}>
              Companies
            </Button>
          )}
          {user?.token && user?.accountType !== "seeker" && (
            <Button component={Link} to="/upload-job" color="inherit"
            sx={{fontFamily: 'Poppins'}}>
              Upload Job
            </Button>
          )}
          <Button component={Link} to="/about-us" color="inherit"
            sx={{fontFamily: 'Poppins'}}>
            About
          </Button>
          <Button component={Link} to="/contact-us" color="inherit"
            sx={{fontFamily: 'Poppins'}}>
            Contact Us
          </Button>
          <Button component={Link} to="/blog" color="inherit"
            sx={{fontFamily: 'Poppins'}}>
            Blog
          </Button>
        </Box>

        {/* User Profile Menu */}
        {user?.token ? (
          <>
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                src={
                  user?.profileUrl ||
                  "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                }
              />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
            >
              {user?.accountType === "seeker" && (
                <MenuItem
                  component={Link}
                  to="/user-profile"
                  onClick={handleMenuClose}
                >
                  <AccountCircle sx={{ mr: 1 }} /> User Profile
                </MenuItem>
              )}
              <MenuItem
                component={Link}
                to="/password"
                onClick={handleMenuClose}
              >
                <LockReset sx={{ mr: 1 }} /> Change Password
              </MenuItem>
              {user?.accountType === "seeker" && (
                <MenuItem
                  component={Link}
                  to="/application-tracking"
                  onClick={handleMenuClose}
                >
                  <Assignment sx={{ mr: 1 }} /> Application Status
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                <Logout sx={{ mr: 1 }} /> Log Out
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            component={Link}
            to="/"
            variant="outlined"
            sx={{ color: "#14a800", borderColor: "#14a800" }}
          >
            Sign In
          </Button>
        )}

        {/* Mobile Menu Button */}
        <IconButton
          sx={{ display: { md: "none" } }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <CloseIcon />
          </IconButton>
          <List>
            <ListItem
              button
              component={Link}
              to={user?.accountType === "seeker" ? "/find-jobs" : "/view-jobs"}
            >
              <ListItemText
                primary={
                  user?.accountType === "seeker" ? "Find Job" : "Job Posts"
                }
              />
            </ListItem>
            {user?.accountType === "seeker" && (
              <ListItem button component={Link} to="/companies">
                <ListItemText primary="Companies" />
              </ListItem>
            )}
            {user?.token && user?.accountType !== "seeker" && (
              <ListItem button component={Link} to="/upload-job">
                <ListItemText primary="Upload Job" />
              </ListItem>
            )}
            <ListItem button component={Link} to="/about-us">
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button component={Link} to="/contact-us">
              <ListItemText primary="Contact Us" />
            </ListItem>
            <ListItem button component={Link} to="/blog">
              <ListItemText primary="Blog" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
