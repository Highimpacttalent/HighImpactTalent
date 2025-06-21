import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Grid, Button } from "@mui/material";
import pay1 from "../../assets/Payment/pay1.svg";
import pay2 from "../../assets/Payment/pay2.svg";
import pay3 from "../../assets/Payment/pay3.svg";
// MUI Icons
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";

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
    <Box sx={{ bgcolor: "white", border: "2px solid white" }}>
      <Box sx={{ mt: 8 }}>
        <Typography
          sx={{
            textAlign: "center",
            fontFamily: "Satoshi,serif",
            color: "#474E68",
            fontWeight: "700",
            fontSize: "32px",
          }}
        >
          Recruit Like a Pro – Get Exclusive{" "}
          <span
            style={{
              color: "#3C7EFC",
              fontFamily: "Satoshi,serif",
              fontWeight: "700",
              fontSize: "32px",
            }}
          >
            Resume Access
          </span>{" "}
          Today!
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            textAlign: "center",
            fontFamily: "Poppins",
            color: "#6B7280",
            fontWeight: "400",
            fontSize: "18px",
            mt: 2,
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          Skip the wait. Access our premium database of 2000+ verified resumes
          instantly and find your perfect candidates in minutes, not weeks.
        </Typography>
      </Box>

      {/* Features Grid */}
      <Box sx={{ mt: 6, px: 4 }}>
        <Grid container spacing={3} sx={{ maxWidth: "1200px", mx: "auto" }}>
          {/* Feature 1 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                textAlign: "center",
                p: 3,
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#3C7EFC",
                  boxShadow: "0 4px 12px rgba(60, 126, 252, 0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  bgcolor: "#EEF2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <SearchIcon sx={{ color: "#3C7EFC", fontSize: "28px" }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "600",
                  fontSize: "18px",
                  color: "#374151",
                  mb: 1,
                }}
              >
                Smart AI Assistant
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "400",
                  fontSize: "14px",
                  color: "#6B7280",
                  lineHeight: 1.6,
                }}
              >
                Simply describe your ideal candidate and our AI will instantly
                recommend the best matching profiles from our database.
              </Typography>
            </Box>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                textAlign: "center",
                p: 3,
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#3C7EFC",
                  boxShadow: "0 4px 12px rgba(60, 126, 252, 0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  bgcolor: "#EEF2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <FilterListIcon sx={{ color: "#3C7EFC", fontSize: "28px" }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "600",
                  fontSize: "18px",
                  color: "#374151",
                  mb: 1,
                }}
              >
                Advanced Filtering
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "400",
                  fontSize: "14px",
                  color: "#6B7280",
                  lineHeight: 1.6,
                }}
              >
                Filter by experience, skills, top companies, education,
                location, and more to find exactly what you're looking for.
              </Typography>
            </Box>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                textAlign: "center",
                p: 3,
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#3C7EFC",
                  boxShadow: "0 4px 12px rgba(60, 126, 252, 0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  bgcolor: "#EEF2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <StarIcon sx={{ color: "#3C7EFC", fontSize: "28px" }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "600",
                  fontSize: "18px",
                  color: "#374151",
                  mb: 1,
                }}
              >
                Premium Profiles
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "400",
                  fontSize: "14px",
                  color: "#6B7280",
                  lineHeight: 1.6,
                }}
              >
                Access candidates from top companies and premier institutes with
                verified backgrounds and consulting experience.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* What's Included Section */}
      <Box sx={{ mt: 6, px: 4 }}>
        <Typography
          sx={{
            textAlign: "center",
            fontFamily: "Poppins",
            fontWeight: "600",
            fontSize: "24px",
            color: "#374151",
            mb: 4,
          }}
        >
          What's Included in Your Subscription
        </Typography>

        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          <Grid container spacing={2}>
            {[
              "✓ Instant access to 2000+ verified resumes",
              "✓ AI-powered candidate recommendations",
              "✓ Advanced search and filtering options",
              "✓ Direct contact information access",
              "✓ Profiles from top companies & institutes",
              "✓ Detailed work experience & skills data",
              "✓ Educational background verification",
              "✓ Consulting background indicators",
              "✓ Salary and experience level filters",
              "✓ Location-based candidate search",
              "✓ Downloadable CV access",
              "✓ 24/7 platform support",
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: "400",
                    fontSize: "16px",
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <span
                    style={{
                      color: "#10B981",
                      marginRight: "8px",
                      fontWeight: "600",
                    }}
                  >
                    {feature.split(" ")[0]}
                  </span>
                  {feature.substring(2)}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ mt: 6 }}>
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "400",
            fontFamily: "Poppins",
            color: "#474E68",
          }}
        >
          Get unlimited access for just{" "}
          <span
            style={{
              fontSize: "28px",
              fontWeight: "700",
              fontFamily: "Poppins",
              color: "#3C7EFC",
            }}
          >
            ₹19,999/-
          </span>
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "400",
            fontFamily: "Poppins",
            color: "#6B7280",
            mt: 1,
          }}
        >
          One-time payment • No recurring charges • Lifetime access
        </Typography>
      </Box>

      {/* CTA Button */}
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Button
          variant="contained"
          onClick={initializePayment}
          disabled={loading}
          className={`px-4 py-2 font-semibold text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } rounded-md transition-colors duration-200`}
          sx={{
            borderRadius: 8,
            p: 4,
            mt: 4,
            fontFamily: "Poppins",
            fontWeight: "700",
            py: 2,
            textTransform: "none",
            fontSize: "18px",
            minWidth: "200px",
            boxShadow: "0 4px 12px rgba(60, 126, 252, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(60, 126, 252, 0.4)",
              transform: "translateY(-1px)",
            },
          }}
        >
          {loading ? "Processing..." : "Get Instant Access Now"}
        </Button>
      </Box>

      {error && (
        <p className="text-sm text-red-600 mt-4 text-center">{error}</p>
      )}

      {/* Trust Indicators */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "12px",
            color: "#6B7280",
            fontWeight: "400",
          }}
        >
          🔒 Secure Payment • 💯 Verified Profiles • ⚡ Instant Access
        </Typography>
      </Box>

      {/* Payment Options */}
      <Box
        sx={{
          mt: 6,
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
            <img
              key={index}
              src={payIcon}
              alt={`Payment Option ${index + 1}`}
            />
          ))}
        </Box>
      </Box>

      {/* Social Proof */}
      <Box sx={{ mt: 4, textAlign: "center", pb: 4 }}>
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "14px",
            color: "#6B7280",
            fontWeight: "400",
            fontStyle: "italic",
          }}
        >
          "This platform cut our hiring time by 70%. The AI recommendations are
          incredibly accurate!"
          <br />
          <span style={{ fontWeight: "600", color: "#374151" }}>
            - HR Director, Tech Startup
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default PaymentPage;
