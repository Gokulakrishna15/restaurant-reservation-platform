import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-red-100 border border-red-400 rounded text-center">
      <h2 className="text-2xl font-bold text-red-700 mb-4">Payment Cancelled ❌</h2>
      <p className="text-gray-700 mb-6">
        Your transaction was not completed. You can try again or return home.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Home
        </button>
        <button
          onClick={() => navigate("/restaurants")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;