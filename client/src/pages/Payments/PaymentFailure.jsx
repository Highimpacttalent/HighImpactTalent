import React from "react";
import { useLocation } from "react-router-dom";
import {Box,Typography,Button} from "@mui/material"
import PaymentSuccessImg from "../../assets/Payment/payFailure.svg";
import { Link } from "react-router-dom";

const PaymentFailure = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const txnid = queryParams.get("txnid");

    return (
        <Box sx={{bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 2, }}>
            <Box sx={{display:'flex',justifyContent: "center", }}>
                <img src={PaymentSuccessImg} alt={`Payment Option`}  />
            </Box>
            <Box sx={{mt:4}}>
                <Typography sx={{textAlign:'center',fontFamily:"Satoshi",fontWeight:"700",fontSize:'32px',color:'#474E68'}}>Uh-oh! We Couldn’t Process Your Payment</Typography>
            </Box>
            <Box sx={{display:'flex',justifyContent: "center",flexDirection:'column',alignItems:'center', p:2,pb:0}}>
                <Box sx={{p:4,borderRadius:2,pt:0}}>
                    <Typography sx={{color:"rgba(64, 66, 88, 1)",fontSize:"20px"}}>It looks like something went wrong. Please try again or use another payment method.</Typography>
                </Box>
            </Box>
            <Box sx={{display:'flex',justifyContent: "center",flexDirection:'column',alignItems:'center', p:2}}>
            <Link sx={{textDecoration:'none'}} to="/">
                <Button 
                    variant="contained"
                    sx={{borderRadius:8,p:4,fontFamily:'Satoshi',fontSize:"16px",fontWeight:'700',py:1,textTransform:'none'}}
            >
               Retry Payment
               </Button>
            </Link>
            </Box>
        </Box>
    );
};

export default PaymentFailure;