import { Box, Typography, LinearProgress,Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const Mobileview = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const handleClick = ()=>{
        navigate("/user-profile");
    }
    console.log("userInfo" ,user)

     // Calculate filled fields
  const filledFieldsCount = profileFields.reduce((count, field) => {
    if (user[field] && user[field].toString().trim() !== "") {
      return count + 1;
    }
    return count;
  }, 0);

  const profileCompletion = Math.round((filledFieldsCount / profileFields.length) * 100);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid #00000040", borderRadius: 4, flexDirection: "column", padding: 2,mb:8 ,textAlign:"center"}}>
      <Typography sx={{ color: "#474E68", fontFamily: "Satoshi", fontWeight: "500", fontSize: "16px" }}>
        Hey {user.user.firstName || "User"}, don’t leave recruiters guessing! Complete your profile and stand out.
      </Typography>
      <Box sx={{ mt: 2, color: "#24252C", fontFamily: "Poppins", fontSize: "18px", fontWeight: "500" }}>
        <Typography sx={{fontWeight:"bold"}}>Your Profile is</Typography>
      </Box>
      {/* Progress bar below "Your Profile" */}
      <LinearProgress variant="determinate" value={profileCompletion} sx={{ width: '40%',height:6,borderRadius:4, marginTop: 1 }} />
      <Typography sx={{fontFamily:"Poppins",fontWeight:"500",fontSize:14,mt:1,color:"#808195"}}>{profileCompletion}% done</Typography>
      <Button variant="contained" sx={{fontFamily:"Satoshi",fontWeight:"700",fontSize:"15px",textTransform:"none",borderRadius:16,mt:4,py:1,px:2}} onClick={handleClick}>
        Complete your Profile
      </Button>
    </Box>
  );
};

export default Mobileview;
