import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
// import { AuthProvider } from "./context/AuthContext"; // optional

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap with providers if needed */}
    {/* <AuthProvider> */}
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    {/* </AuthProvider> */}
  </React.StrictMode>
);