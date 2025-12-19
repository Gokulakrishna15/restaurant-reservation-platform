import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center font-mono">
      <div className="w-full max-w-md bg-black border-4 border-pink-500 rounded-xl shadow-neon p-8 text-green-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-400 tracking-widest uppercase">
          🍴 FoodieHub Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
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

          {/* Password */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-700 text-white py-3 rounded-lg font-bold shadow-lg hover:from-pink-600 hover:to-purple-800 transition disabled:opacity-50"
          >
            {loading ? "⌛ Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-sm text-center mt-6 text-cyan-300">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-pink-400 font-bold hover:underline"
          >
            Register here
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