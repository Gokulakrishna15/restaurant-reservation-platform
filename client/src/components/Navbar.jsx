import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Get user from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";
  const isRestaurantOwner = user?.role === "restaurant_owner";
  const isRegularUser = user?.role === "user";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-black to-pink-900 border-b-4 border-pink-500 text-green-300 shadow-lg font-mono sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-extrabold tracking-widest text-pink-400 uppercase hover:text-cyan-300 transition"
        >
          🍴 FoodieHub
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {token && (
            <>
              {/* ✅ Regular User Links */}
              {isRegularUser && (
                <>
                  <NavLink
                    to="/restaurants"
                    className={({ isActive }) =>
                      isActive
                        ? "text-pink-400 font-bold underline"
                        : "hover:text-cyan-300 transition"
                    }
                  >
                    🍽 Restaurants
                  </NavLink>

                  <NavLink
                    to="/my-reservations"
                    className={({ isActive }) =>
                      isActive
                        ? "text-pink-400 font-bold underline"
                        : "hover:text-cyan-300 transition"
                    }
                  >
                    📅 My Reservations
                  </NavLink>

                  <NavLink
                    to="/recommendations"
                    className={({ isActive }) =>
                      isActive
                        ? "text-pink-400 font-bold underline"
                        : "hover:text-cyan-300 transition"
                    }
                  >
                    🎯 Recommendations
                  </NavLink>
                </>
              )}

              {/* ✅ Restaurant Owner Links */}
              {isRestaurantOwner && (
                <>
                  <NavLink
                    to="/my-restaurants"
                    className={({ isActive }) =>
                      isActive
                        ? "text-green-400 font-bold underline"
                        : "hover:text-green-300 transition"
                    }
                  >
                    🏪 My Restaurants
                  </NavLink>
                  
                  <NavLink
                    to="/restaurants"
                    className={({ isActive }) =>
                      isActive
                        ? "text-pink-400 font-bold underline"
                        : "hover:text-cyan-300 transition"
                    }
                  >
                    🍽 Browse Restaurants
                  </NavLink>
                </>
              )}

              {/* ✅ Admin Links */}
              {isAdmin && (
                <>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive
                        ? "text-yellow-400 font-bold underline"
                        : "hover:text-yellow-300 transition"
                    }
                  >
                    🏪 Manage Restaurants
                  </NavLink>
                  
                  <NavLink
                    to="/admin/reservations"
                    className={({ isActive }) =>
                      isActive
                        ? "text-yellow-400 font-bold underline"
                        : "hover:text-yellow-300 transition"
                    }
                  >
                    📅 All Reservations
                  </NavLink>
                  
                  <NavLink
                    to="/admin/reviews"
                    className={({ isActive }) =>
                      isActive
                        ? "text-yellow-400 font-bold underline"
                        : "hover:text-yellow-300 transition"
                    }
                  >
                    ⭐ Manage Reviews
                  </NavLink>
                </>
              )}
            </>
          )}

          {/* Auth Links */}
          {!token ? (
            <>
              <NavLink
                to="/login"
                className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-4 py-2 rounded-lg font-bold hover:from-pink-600 hover:to-purple-800 transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="border-2 border-cyan-400 text-cyan-300 px-4 py-2 rounded-lg font-bold hover:bg-cyan-400 hover:text-black transition"
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <>
              <span className="text-cyan-300">
                👤 {user?.name || "User"}
                {isAdmin && <span className="ml-2 text-xs bg-yellow-600 px-2 py-1 rounded">ADMIN</span>}
                {isRestaurantOwner && <span className="ml-2 text-xs bg-green-600 px-2 py-1 rounded">OWNER</span>}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-pink-400 text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t-2 border-pink-500 p-4 space-y-3">
          {token && (
            <>
              {isRegularUser && (
                <>
                  <NavLink
                    to="/restaurants"
                    className="block hover:text-cyan-300 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    🍽 Restaurants
                  </NavLink>
                  <NavLink
                    to="/my-reservations"
                    className="block hover:text-cyan-300 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    📅 My Reservations
                  </NavLink>
                  <NavLink
                    to="/recommendations"
                    className="block hover:text-cyan-300 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    🎯 Recommendations
                  </NavLink>
                </>
              )}
              
              {isRestaurantOwner && (
                <>
                  <NavLink
                    to="/my-restaurants"
                    className="block hover:text-green-300 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    🏪 My Restaurants
                  </NavLink>
                  <NavLink
                    to="/restaurants"
                    className="block hover:text-cyan-300 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    🍽 Browse Restaurants
                  </NavLink>
                </>
              )}
              
              {isAdmin && (
                <>
                  <NavLink
                    to="/admin"
                    className="block hover:text-yellow-300 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    🏪 Manage Restaurants
                  </NavLink>
                  <NavLink
                    to="/admin/reservations"
                    className="block hover:text-yellow-300 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    📅 All Reservations
                  </NavLink>
                  <NavLink
                    to="/admin/reviews"
                    className="block hover:text-yellow-300 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    ⭐ Manage Reviews
                  </NavLink>
                </>
              )}
            </>
          )}

          {!token ? (
            <>
              <NavLink
                to="/login"
                className="block bg-gradient-to-r from-pink-500 to-purple-700 text-white px-4 py-2 rounded-lg font-bold text-center"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="block border-2 border-cyan-400 text-cyan-300 px-4 py-2 rounded-lg font-bold text-center"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <>
              <p className="text-cyan-300 py-2">
                👤 {user?.name || "User"}
                {isAdmin && <span className="ml-2 text-xs bg-yellow-600 px-2 py-1 rounded">ADMIN</span>}
                {isRestaurantOwner && <span className="ml-2 text-xs bg-green-600 px-2 py-1 rounded">OWNER</span>}
              </p>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;