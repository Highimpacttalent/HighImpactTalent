import React from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const txnid = queryParams.get("txnid");

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-sm text-gray-600 mb-6">
                Thank you for your payment. Your transaction ID is:{" "}
                <span className="font-semibold">{txnid}</span>.
            </p>
            <a
                href="/resumesearch"
                className="w-full px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
            >
                View Resume Pool
            </a>
        </div>
    );
};

export default PaymentSuccess;