import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import pay1 from "../../assets/Payment/pay1.svg";
import pay2 from "../../assets/Payment/pay2.svg";
import pay3 from "../../assets/Payment/pay3.svg";

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (!user || !user.token) {
        setError("User not authenticated.");
        return;
      }

      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/payment/initialize-payment",
        {}, // No request body needed
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Use retrieved token
            "Content-Type": "application/json",
          },
        }
      );

      const { paymentUrl, paymentData } = response.data;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentUrl;

      Object.entries(paymentData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      setError("Failed to initialize payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "white",border:'2px solid white' }}>
      <Box sx={{ mt: 8 }}>
        <Typography
          sx={{
            textAlign: "center",
            fontFamily: "Satoshi,serrif",
            color: "#474E68",
            fontWeight: "700",
            fontSize: "32px",
          }}
        >
          Recruit Like a Pro – Get Exclusive{" "}
          <span
            style={{
              color: "#3C7EFC",
              fontFamily: "Satoshi,serrif",
              fontWeight: "700",
              fontSize: "32px",
            }}
          >
            Resume Access
          </span>{" "}
          Today!
        </Typography>
      </Box>

      <Box>
        <Typography sx={{textAlign:'center',mt:10,fontSize:'18px',fontWeight:'400',fontFamily:'Poppins',color:'#474E68'}}>Subscribe now only <span style={{fontSize:'22px',fontWeight:'600',fontFamily:'Poppins',color:'#474E68'}}>@1/-</span></Typography>
      </Box>
      <Box sx={{display:"flex",alignItems:'center',justifyContent:'center'}}>
      <Button 
        variant="contained"
        onClick={initializePayment}
        disabled={loading}
        className={` px-4 py-2 font-semibold text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } rounded-md transition-colors duration-200`}
        sx={{borderRadius:8,p:4,mt:4,fontFamily:'Poppins',fontWeight:'700',py:1,textTransform:'none'}}>
            
            {loading ? "Processing..." : "Pay Now"}
      </Button>
      </Box>
      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
       {/* Task Box with Centered SVGs */}
       <Box
        sx={{
          mt: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderColor: "#3C7EFC",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {[pay1, pay2, pay3].map((payIcon, index) => (
            <img key={index} src={payIcon} alt={`Payment Option ${index + 1}`}  />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentPage;
