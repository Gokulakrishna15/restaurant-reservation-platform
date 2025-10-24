import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedApp from './components/ProtectedApp'; // ✅ Protected dashboard wrapper

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/signup" element={<Signup />} /> {/* Optional alias */}

        {/* Protected Routes */}
        <Route path="/*" element={<ProtectedApp />} />
      </Routes>
    </Router>
  );
}