import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await registerUser({ name, email, password });
      console.log("✅ Registration successful:", res.data);

      // ✅ Store token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // ✅ Store user data (including role!)
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      setSuccess("Registration successful! Redirecting...");
      
      // ✅ Redirect based on role
      setTimeout(() => {
        if (res.data.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      console.error("❌ Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center font-mono">
      <div className="w-full max-w-md bg-black border-4 border-green-400 rounded-xl shadow-lg p-8 text-green-300">
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-400 tracking-widest uppercase">
          🕹 Signup for FoodieHub
        </h2>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-1 text-cyan-300">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 text-cyan-300">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 text-cyan-300">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-700 text-white py-3 rounded-lg font-bold shadow-lg hover:from-pink-600 hover:to-purple-800 transition disabled:opacity-50"
          >
            {loading ? "⌛ Registering..." : "Register"}
          </button>

          {/* Feedback */}
          {error && <p className="text-red-400 text-sm mt-2">❌ {error}</p>}
          {success && <p className="text-green-400 text-sm mt-2">✅ {success}</p>}
        </form>

        {/* Login Link */}
        <p className="text-sm text-center mt-6 text-cyan-300">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-400 font-bold hover:underline">
            Login here
          </Link>
        </p>

        {/* Retro Proof Banner */}
        <div className="text-xs text-yellow-400 text-center mt-6 uppercase tracking-widest">
        </div>

        {/* Footer */}
        <footer className="text-center text-green-400 text-xs mt-6">
        </footer>
      </div>
    </div>
  );
}