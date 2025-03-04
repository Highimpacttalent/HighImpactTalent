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
      sx={{ 
        backgroundColor: "white", 
        color: "black", 
        boxShadow: "none" // Remove shadow to eliminate the line below navbar
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: { xs: '8px 16px' } }}>
        {/* Mobile Layout: Hamburger on left, logo and text centered */}
        <Box sx={{ 
          display: "flex", 
          width: "100%", 
          alignItems: "center", 
          position: "relative"
        }}>
          {/* Hamburger Menu Button (left) */}
          <IconButton
            sx={{ 
              display: { md: "none" },
              position: "absolute",
              left: 0,
              zIndex: 2
            }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Text (centered for mobile) */}
          <Box sx={{ 
            position: "absolute", 
            left: "50%", 
            transform: "translateX(-50%)",
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Avatar src={logo} sx={{ width: 36, height: 36, mr: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  color: "#1176DB",
                  fontWeight: "bold",
                  fontSize: "1rem"
                }}
              >
                High Impact Talent
              </Typography>
            </Link>
          </Box>

          {/* Desktop Logo (visible only on desktop) */}
          <Box sx={{ 
            display: { xs: "none", md: "flex" }, 
            alignItems: "center"
          }}>
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
                  fontSize: { sm: "1.25rem", md: "1.5rem" },
                }}
              >
                High Impact Talent
              </Typography>
            </Link>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ 
            display: { xs: "none", md: "flex" }, 
            gap: 3,
            ml: "auto",
            mr: 2
          }}>
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

          {/* User Profile Button - Not visible on mobile */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
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
          </Box>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Menu</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* User profile section in drawer */}
          {user?.token ? (
            <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
              <Avatar
                src={
                  user?.profileUrl ||
                  "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                }
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {user?.firstName || "User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email || ""}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Button
              component={Link}
              to="/"
              variant="contained"
              fullWidth
              sx={{ 
                mb: 2,
                backgroundColor: "#14a800",
                '&:hover': {
                  backgroundColor: "#118f00",
                }
              }}
              onClick={() => setDrawerOpen(false)}
            >
              Sign In
            </Button>
          )}
          
          <List>
            <ListItem
              button
              component={Link}
              to={user?.accountType === "seeker" ? "/find-jobs" : "/view-jobs"}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText
                primary={
                  user?.accountType === "seeker" ? "Find Job" : "Job Posts"
                }
              />
            </ListItem>
            {user?.accountType === "seeker" && (
              <ListItem 
                button 
                component={Link} 
                to="/companies"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary="Companies" />
              </ListItem>
            )}
            {user?.token && user?.accountType !== "seeker" && (
              <ListItem 
                button 
                component={Link} 
                to="/upload-job"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary="Upload Job" />
              </ListItem>
            )}
            <ListItem 
              button 
              component={Link} 
              to="/about-us"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="About" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/contact-us"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Contact Us" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/blog"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Blog" />
            </ListItem>
            
            {/* User account options in drawer */}
            {user?.token && (
              <>
                <ListItem 
                  button 
                  component={Link} 
                  to="/user-profile"
                  onClick={() => setDrawerOpen(false)}
                  sx={{ display: user?.accountType === "seeker" ? "flex" : "none" }}
                >
                  <AccountCircle sx={{ mr: 2 }} />
                  <ListItemText primary="User Profile" />
                </ListItem>
                <ListItem 
                  button 
                  component={Link} 
                  to="/password"
                  onClick={() => setDrawerOpen(false)}
                >
                  <LockReset sx={{ mr: 2 }} />
                  <ListItemText primary="Change Password" />
                </ListItem>
                <ListItem 
                  button 
                  component={Link} 
                  to="/application-tracking"
                  onClick={() => setDrawerOpen(false)}
                  sx={{ display: user?.accountType === "seeker" ? "flex" : "none" }}
                >
                  <Assignment sx={{ mr: 2 }} />
                  <ListItemText primary="Application Status" />
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => {
                    handleLogout();
                    setDrawerOpen(false);
                  }}
                  sx={{ color: "red" }}
                >
                  <Logout sx={{ mr: 2 }} />
                  <ListItemText primary="Log Out" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;