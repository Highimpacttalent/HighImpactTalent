import React, { useState } from "react";
import axios from "axios";

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
        <div className="max-w-md mx-auto mt-12 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment</h1>
            <p className="text-sm text-gray-600 mb-6">
                Complete your payment securely with PayU.
            </p>
            <button
                onClick={initializePayment}
                disabled={loading}
                className={`w-full px-4 py-2 font-semibold text-white ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } rounded-md transition-colors duration-200`}
            >
                {loading ? "Processing..." : "Pay Now"}
            </button>
            {error && (
                <p className="text-sm text-red-600 mt-4">{error}</p>
            )}
        </div>
    );
};

export default PaymentPage;