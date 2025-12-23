import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
// import { AuthProvider } from "./context/AuthContext"; // optional

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* Wrap with providers if needed */}
    {/* <AuthProvider> */}
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    {/* </AuthProvider> */}
  </React.StrictMode>
);

// ✅ Hide loader once React mounts
const loader = document.getElementById("loader");
if (loader) loader.style.display = "none";