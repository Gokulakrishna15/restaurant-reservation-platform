import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");
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
      
      // ✅ Role-based redirect
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else if (res.data.user.role === "restaurant_owner") {
        navigate("/my-restaurants");
      } else {
        navigate("/restaurants");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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

        {/* ✅ COMPLETE TEST CREDENTIALS */}
        <div className="mt-6 space-y-4">
          {/* Test Accounts */}
          <div className="p-4 bg-purple-900 border-2 border-purple-500 rounded-lg text-xs">
            <p className="font-bold mb-3 text-yellow-300 text-center text-sm">
              🧪 Test Accounts
            </p>
            
            <div className="space-y-3">
              {/* Admin */}
              <div className="bg-black p-3 rounded border border-yellow-500">
                <p className="text-yellow-400 font-bold mb-1">⚡ Admin:</p>
                <p className="text-cyan-300">📧 admin@foodiehub.com</p>
                <p className="text-cyan-300">🔑 admin123</p>
              </div>

              {/* Regular User */}
              <div className="bg-black p-3 rounded border border-green-500">
                <p className="text-green-400 font-bold mb-1">👤 Customer:</p>
                <p className="text-cyan-300">📧 user@test.com</p>
                <p className="text-cyan-300">🔑 user123</p>
              </div>

              {/* Restaurant Owner */}
              <div className="bg-black p-3 rounded border border-pink-500">
                <p className="text-pink-400 font-bold mb-1">🏪 Restaurant Owner:</p>
                <p className="text-cyan-300">📧 owner@test.com</p>
                <p className="text-cyan-300">🔑 owner123</p>
              </div>
            </div>
          </div>

          {/* Test Payment Card */}
          <div className="p-4 bg-cyan-900 border-2 border-cyan-500 rounded-lg text-xs">
            <p className="font-bold mb-3 text-yellow-300 text-center text-sm">
              💳 Test Payment Card (Stripe)
            </p>
            
            <div className="bg-black p-3 rounded space-y-1">
              <p className="text-green-300"><span className="text-cyan-300 font-bold">Card:</span> 4242 4242 4242 4242</p>
              <p className="text-green-300"><span className="text-cyan-300 font-bold">Expiry:</span> Any future date (e.g., 12/25)</p>
              <p className="text-green-300"><span className="text-cyan-300 font-bold">CVC:</span> Any 3 digits (e.g., 123)</p>
              <p className="text-green-300"><span className="text-cyan-300 font-bold">ZIP:</span> Any 5 digits (e.g., 12345)</p>
            </div>

            <p className="text-yellow-400 text-center mt-2 text-xs">
              💡 Use this card for testing reservations
            </p>
          </div>
        </div>

        <footer className="text-center text-green-400 text-xs mt-6">
          © 2025 FoodieHub · Built with ❤️ by Gokulakrishna
        </footer>
      </div>
    </div>
  );
}