import React from "react";
import { useLocation } from "react-router-dom";
import {Box,Typography,Button} from "@mui/material"
import PaymentSuccessImg from "../../assets/Payment/paySucess.svg";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const txnid = queryParams.get("txnid");

    return (
        <Box sx={{bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 2, }}>
            <Box sx={{display:'flex',justifyContent: "center", }}>
                <img src={PaymentSuccessImg} alt={`Payment Option`}  />
            </Box>
            <Box>
                <Typography sx={{textAlign:'center',fontFamily:"Satoshi",fontWeight:"700",fontSize:'32px',color:'#474E68'}}>Payment Successful!</Typography>
            </Box>
            <Box sx={{display:'flex',justifyContent: "center",flexDirection:'column',alignItems:'center', p:2}}>
                <Box sx={{border: '1px solid rgba(0, 0, 0, 0.25)',p:4,borderRadius:2}}>
                    <Typography sx={{color:"rgba(64, 66, 88, 1)"}}>Transaction number: {txnid}</Typography>
                    <Typography sx={{color:"rgba(64, 66, 88, 1)",mt:1}}>Amount Paid: Rs.19999</Typography>
                </Box>
            </Box>
            <Box sx={{display:'flex',justifyContent: "center",flexDirection:'column',alignItems:'center', p:2}}>
            <Link sx={{textDecoration:'none'}} to="/resumesearch">
                <Button 
                    variant="contained"
                    sx={{borderRadius:8,p:4,fontFamily:'Satoshi',fontSize:"16px",fontWeight:'700',py:2,textTransform:'none'}}
            >
               View Resume Pool
               </Button>
            </Link>
            </Box>
        </Box>
    );
};

export default PaymentSuccess;