import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-extrabold tracking-tight">
          🍴 FoodieHub
        </NavLink>

        {/* Links */}
        <div className="flex gap-6">
          <NavLink
            to="/restaurants"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:opacity-80"
            }
          >
            Restaurants
          </NavLink>
          <NavLink
            to="/my-reservations"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:opacity-80"
            }
          >
            My Reservations
          </NavLink>
          <NavLink
            to="/recommendations"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:opacity-80"
            }
          >
            Recommendations
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "font-semibold underline text-red-300" : "hover:opacity-80"
            }
          >
            Admin
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
