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
      sx={{ backgroundColor: "white", color: "black", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Mobile Menu Button */}
        <IconButton
          sx={{ display: { md: "none" } }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, ml: 4 }}>
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
                whiteSpace: "nowrap",
              }}
            >
              High Impact Talent
            </Typography>
          </Link>
        </Box>

        {/* Desktop Navigation */}
        {user?.token ? (
          <LoggedInMenu user={user} handleMenuOpen={handleMenuOpen} />
        ) : (
          <LoggedOutMenu />
        )}

        {/* Profile Menu */}
        {user?.token && (
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem
              component={Link}
              to="/user-profile"
              onClick={handleMenuClose}
            >
              <AccountCircle sx={{ mr: 1 }} /> User Profile
            </MenuItem>
            <MenuItem component={Link} to="/password" onClick={handleMenuClose}>
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
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ width: "100%", "& .MuiDrawer-paper": { width: "100%" } }}
      >
        {/* Logo, Company Name, and Close Icon in the Same Div */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #eee",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={logo} sx={{ width: 40, height: 40, mr: 1 }} />
            <Typography
              variant="h6"
              sx={{ color: "#1176DB", fontWeight: "bold" }}
            >
              High Impact Talent
            </Typography>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Drawer Content */}
        {user?.token ? (
          <LoggedInDrawer
            user={user}
            handleLogout={handleLogout}
            setDrawerOpen={setDrawerOpen}
          />
        ) : (
          <LoggedOutDrawer setDrawerOpen={setDrawerOpen} />
        )}
      </Drawer>
    </AppBar>
  );
};

const LoggedInMenu = ({ user, handleMenuOpen }) => (
  <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, ml: "auto", mr: 2 }}>
    <Button
      component={Link}
      to={user?.accountType === "seeker" ? "/find-jobs" : "/view-jobs"}
      color="inherit"
    >
      {user?.accountType === "seeker" ? "Find Job" : "Job Posts"}
    </Button>
    {user?.accountType !== "seeker" && (
      <Button
        color="inherit"
        component={Link}
        to="/upload-a-job"
      >
        Upload Job
      </Button>
    )}
    {user?.accountType === "seeker" && (
      <Button component={Link} to="/companies" color="inherit">
        Companies
      </Button>
    )}
    <Button component={Link} to="/about-us" color="inherit">
      About
    </Button>
    <Button component={Link} to="/contact-us" color="inherit">
      Contact Us
    </Button>
    <Button component={Link} to="/blog" color="inherit">
      Blog
    </Button>
    <IconButton onClick={handleMenuOpen}>
      <Avatar
        src={
          user?.profileUrl ||
          "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
        }
      />
    </IconButton>
  </Box>
);

const LoggedOutMenu = () => (
  <Box
    sx={{
      display: { xs: "none", md: "flex" },
      ml: "auto",
      alignItems: "center",
      gap: 3,
    }}
  >
    <Button component={Link} to="/find-jobs" color="inherit">
      Jobs
    </Button>
    <Button component={Link} to="/hiring" color="inherit">
      Hiring
    </Button>
    <Button component={Link} to="/about-us" color="inherit">
      About
    </Button>
    <Button component={Link} to="/contact-us" color="inherit">
      Contact Us
    </Button>
    <Button
      variant="contained"
      component={Link}
      to="/"
      sx={{
        bgcolor: "#3C7EFC",
        borderRadius: 8,
        fontFamily: "Poppins",
      }}
    >
      Login
    </Button>
  </Box>
);

const LoggedOutDrawer = ({ setDrawerOpen }) => (
  <List>
    <ListItem
      button
      component={Link}
      to="/find-jobs"
      onClick={() => setDrawerOpen(false)}
    >
      <ListItemText primary="Jobs" />
    </ListItem>
    <ListItem
      button
      component={Link}
      to="/hiring"
      onClick={() => setDrawerOpen(false)}
    >
      <ListItemText primary="Hiring" />
    </ListItem>
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
  </List>
);

const LoggedInDrawer = ({ user, handleLogout, setDrawerOpen }) => (
  <List>
    <ListItem
      button
      component={Link}
      to={user?.accountType === "seeker" ? "/find-jobs" : "/view-jobs"}
      onClick={() => setDrawerOpen(false)}
    >
      <ListItemText
        primary={user?.accountType === "seeker" ? "Find Job" : "Job Posts"}
      />
    </ListItem>
    {user?.accountType !== "seeker" && (
      <ListItem
        button
        component={Link}
        to="/upload-a-job"
        onClick={() => setDrawerOpen(false)}
      >
        <ListItemText primary="Upload Job" />
      </ListItem>
    )}
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
    {user?.accountType == "seeker" && (<ListItem
      button
      component={Link}
      to="/user-profile"
      onClick={() => setDrawerOpen(false)}
    >
      <ListItemText primary="User Profile" />
    </ListItem>)}
    <ListItem
      button
      component={Link}
      to="/password"
      onClick={() => setDrawerOpen(false)}
    >
      <ListItemText primary="Change Password" />
    </ListItem>
    {user?.accountType === "seeker" && (
      <ListItem
        button
        component={Link}
        to="/application-tracking"
        onClick={() => setDrawerOpen(false)}
      >
        <ListItemText primary="Application Status" />
      </ListItem>
    )}
    <ListItem
      button
      onClick={() => {
        handleLogout();
        setDrawerOpen(false);
      }}
    >
      <ListItemText primary="Log Out" sx={{ color: "red" }} />
    </ListItem>
  </List>
);

export default Navbar;
