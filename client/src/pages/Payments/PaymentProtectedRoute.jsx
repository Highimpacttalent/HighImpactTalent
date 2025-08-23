import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const PaymentProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidPayment, setHasValidPayment] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (!user || !user.token) {
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          "https://highimpacttalent.onrender.com/api-v1/payment/check-status",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success && response.data.paymentStatus === "SUCCESS") {
          setHasValidPayment(true);
        }
      } catch (error) {
        console.error("Payment status check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to payment page if not paid
  return hasValidPayment ? <Outlet /> : <Navigate to="/payment" replace />;
};

export default PaymentProtectedRoute;