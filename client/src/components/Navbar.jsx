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
import { CiUser } from "react-icons/ci";
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
        <Box sx={{ display: "flex", alignItems: "center",width:{xs:"100%",sm:"100%",md:"28%",lg:"28%"}, ml: 4}}>
          <Link
            to={user.token ? "/" : "/"}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Avatar src={logo} sx={{ width: "40px", height: "40px", mr: 1.5 }} />
            <Typography
              variant="h6"
              sx={{
                color: "#3C7EFC",
                fontWeight: "500",
                whiteSpace: "nowrap",
                fontFamily:"Poppins",
                fontSize:"20px"

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
           {user?.accountType === "seeker" && (
            <MenuItem
              component={Link}
              to="/user-profile"
              onClick={handleMenuClose}
            >
              <AccountCircle sx={{ mr: 1 }} /> User Profile
            </MenuItem>
            )} 
           
           {user?.accountType !== "seeker" && (
            <MenuItem
              component={Link}
              to="/rec-profile"
              onClick={handleMenuClose}
            >
              <AccountCircle sx={{ mr: 1 }} /> User Profile
            </MenuItem>
            )} 
            <MenuItem component={Link} to="/password" onClick={handleMenuClose}>
              <LockReset sx={{ mr: 1 }} /> Change Password
            </MenuItem>
            {/* {user?.accountType === "seeker" && (
              <MenuItem
                component={Link}
                to="/application-tracking"
                onClick={handleMenuClose}
              >
                <Assignment sx={{ mr: 1 }} /> Application Status
              </MenuItem>
            )} */}
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
        sx={{ width: "80%", "& .MuiDrawer-paper": { width: "80%" } }}
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
  <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3,mr: 2,flexGrow:1 ,justifyContent:"space-between"}}>
    <Box sx={{display:"flex",width:"65%",justifyContent:"space-evenly"}}>
    <Button
      component={Link}
      to={user?.accountType === "seeker" ? "/find-jobs" : "/view-jobs"}
      sx={{textTransform:"none",fontFamily:"Poppins",fontWeight:"500",fontSize:"18px",color:"#24252C"}}
    >
      {user?.accountType === "seeker" ? "Jobs" : "Job Posts"}
    </Button>
    {user?.accountType === "seeker" && (
      <Button
        color="inherit"
        component={Link}
        to="/application-tracking"
        sx={{textTransform:"none",fontFamily:"Poppins",fontWeight:"500",fontSize:"18px",color:"#24252C"}}
      >
        Job Tracker
      </Button>
    )}
    {user?.accountType !== "seeker" && (
      <Button
        color="inherit"
        component={Link}
        to="/resumesearch"
        sx={{textTransform:"none",fontFamily:"Poppins",fontWeight:"500",fontSize:"18px",color:"#24252C"}}
      >
        Resume Search
      </Button>
    )}
    {/* {user?.accountType === "seeker" && (
      <Button component={Link} to="/companies" color="inherit">
        Companies
      </Button>
    )} */}
    <Button component={Link} to="/about-us" sx={{textTransform:"none",fontFamily:"Poppins",fontWeight:"500",fontSize:"18px",color:"#24252C"}}>
      About
    </Button>
    <Button component={Link} to="/blog" sx={{textTransform:"none",fontFamily:"Poppins",fontWeight:"500",fontSize:"18px",color:"#24252C"}}>
      Blog
    </Button>
    <Button component={Link} to="/contact-us" sx={{textTransform:"none",fontFamily:"Poppins",fontWeight:"500",fontSize:"18px",color:"#24252C"}}>
      Contact Us
    </Button>
    </Box>
    <IconButton
  onClick={handleMenuOpen}
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
    textTransform: "none",
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: { xs: "14px", sm: "16px", md: "18px" }, // Responsive Font
    color: "#24252C",
    bgcolor: "white",
    px: { xs: 1, sm: 2 }, // Adjust padding
    borderRadius: 16,
    "&:hover": {
      bgcolor: "#f5f5f5",
    },
  }}
>
  {user?.profileUrl ? (
    <Avatar src={user?.profileUrl} sx={{ width: { xs: 30, sm: 40 }, height: { xs: 30, sm: 40 } }} />
  ) : (
    <CiUser size={24} style={{ strokeWidth: 1,width: { xs: 30, sm: 40 }, height: { xs: 30, sm: 40 } }}/>
  )}
  <Typography sx={{textTransform:"none",fontFamily:"Poppins",fontWeight:"500",fontSize:"18px",color:"#24252C"}}>Your Profile</Typography>
</IconButton>

    </Box>
);

const LoggedOutMenu = () => (
  <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3,mr: 2,flexGrow:1 ,justifyContent:"space-between"}}>
    <Box sx={{display:"flex",width:"65%",justifyContent:"space-evenly"}}>
    <Button component={Link} to="/find-jobs" color="inherit" sx={{textTransform:"none",fontFamily:"Poppins",fontWeight:"500",fontSize:"18px",color:"#24252C"}}>
      Jobs
    </Button>
    <Button component={Link} to="/contact-us" color="inherit" sx={{textTransform:"none",fontFamily:"Poppins",fontWeight:"500",fontSize:"18px",color:"#24252C"}}>
      Contact Us
    </Button>
    <Button component={Link} to="/about-us" color="inherit" sx={{textTransform:"none",fontFamily:"Poppins",fontWeight:"500",fontSize:"18px",color:"#24252C"}}>
      About
    </Button>
    <Button component={Link} to="/blog" color="inherit" sx={{textTransform:"none",fontFamily:"Poppins",fontWeight:"500",fontSize:"18px",color:"#24252C"}}>
      Blog
    </Button>
    </Box>
    {/* <Button
      variant="contained"
      component={Link}
      to="/u-login"
      sx={{
        bgcolor: "#3C7EFC",
        borderRadius: 8,
        fontFamily: "Poppins",
      }}
    >
      Login
    </Button> */}
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
      to="/contact-us"
      onClick={() => setDrawerOpen(false)}
    >
      <ListItemText primary="Contact Us" />
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
      to="/blog"
      onClick={() => setDrawerOpen(false)}
    >
      <ListItemText primary="Blog" />
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
        to="/resumesearch"
        onClick={() => setDrawerOpen(false)}
      >
        <ListItemText primary="Resume Search" />
      </ListItem>
    )}
    {/* {user?.accountType === "seeker" && (
      <ListItem
        button
        component={Link}
        to="/companies"
        onClick={() => setDrawerOpen(false)}
      >
        <ListItemText primary="Companies" />
      </ListItem>
    )} */}
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
    {user?.accountType === "seeker" && (
      <ListItem
        button
        component={Link}
        to="/user-profile"
        onClick={() => setDrawerOpen(false)}
      >
        <ListItemText primary="User Profile" />
      </ListItem>
    )}
    {user?.accountType !== "seeker" && (
      <ListItem
        button
        component={Link}
        to="/rec-profile"
        onClick={() => setDrawerOpen(false)}
      >
        <ListItemText primary="User Profile" />
      </ListItem>
    )}
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