import { Box, Typography, LinearProgress,Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const view = () => {
    const navigate = useNavigate();
    const handleClick = ()=>{
        navigate("/user-profile");
    }
  // Sample progress value (replace this with actual profile completion percentage)
  const profileCompletion = 70; // Example: Profile is 70% complete

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid #00000040", borderRadius: 4, flexDirection: "column", padding: 2,mb:8 }}>
      <Typography sx={{ color: "#474E68", fontFamily: "Satoshi", fontWeight: "500", fontSize: "20px" }}>
        Hey [Name], don’t leave recruiters guessing! Complete your profile and stand out.
      </Typography>
      <Box sx={{ mt: 2, color: "#24252C", fontFamily: "Poppins", fontSize: "18px", fontWeight: "500" }}>
        <Typography>Your Profile is</Typography>
      </Box>
      {/* Progress bar below "Your Profile" */}
      <LinearProgress variant="determinate" value={profileCompletion} sx={{ width: '20%',height:6,borderRadius:4, marginTop: 1 }} />
      <Typography sx={{fontFamily:"Poppins",fontWeight:"500",fontSize:14,mt:1,color:"#808195"}}>{profileCompletion}% done</Typography>
      <Button variant="contained" sx={{fontFamily:"Satoshi",fontWeight:"700",fontSize:"15px",textTransform:"none",borderRadius:16,mt:4,py:1,px:2}} onClick={handleClick}>
        Complete your Profile
      </Button>
    </Box>
  );
};

export default view;
