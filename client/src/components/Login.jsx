import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post("/auth/login", { email, password });
      
      // ✅ Store both token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      console.log("✅ Login successful:", res.data.user);
      
      // ✅ FIXED: Proper role-based redirect
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/restaurants");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center font-mono p-4">
      <div className="w-full max-w-md bg-black border-4 border-pink-500 rounded-xl shadow-neon p-8 text-green-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-400 tracking-widest uppercase">
          🍴 FoodieHub Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-cyan-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-cyan-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900 text-red-300 p-3 rounded border border-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-700 text-white py-3 rounded-lg font-bold shadow-lg hover:from-pink-600 hover:to-purple-800 transition disabled:opacity-50"
          >
            {loading ? "⌛ Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-cyan-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pink-400 font-bold hover:underline">
            Register here
          </Link>
        </p>

        <div className="mt-6 p-4 bg-purple-900 border border-purple-500 rounded text-xs text-yellow-300">
          <p className="font-bold mb-2">🧪 Test Accounts:</p>
          <p>👤 To Access User: guvitestuser@gmail.com / password:guvitestuser</p>
          <p>⚡ To Access Admin: admin@foodiehub.com / password:admin123</p>
        </div>

        <footer className="text-center text-green-400 text-xs mt-6">
          © 2025 FoodieHub · Built with ❤️ by Gokulakrishna
        </footer>
      </div>
    </div>
  );
}