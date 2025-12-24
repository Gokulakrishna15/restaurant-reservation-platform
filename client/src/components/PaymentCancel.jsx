import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="space-y-4">
          <div className="text-red-600 text-6xl">❌</div>
          <h2 className="text-3xl font-bold text-red-700">Payment Cancelled</h2>
          <p className="text-gray-700 text-lg">
            Your transaction was not completed. No charges have been made.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-600">
              Your reservation has not been confirmed. You can try booking again or contact us for assistance.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={() => navigate("/restaurants")}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Try Booking Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="w-full text-gray-600 hover:text-gray-800 transition"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;