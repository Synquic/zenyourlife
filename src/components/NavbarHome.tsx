import React from 'react'

import { Menu, X } from "lucide-react";
import znlogo from "../assets/znlogo.png";
import { Link } from "react-router-dom";

const NavbarHome = () => {
   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <nav className="bg-white fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
<Link to="/" className="flex items-center gap-2">
  <img
    src={znlogo}
    alt="ZenYouth Logo"
    className="h-7 w-7 object-contain"
  />
  <span className="text-xl font-semibold text-gray-800">
    zenyourlife.be
  </span>
</Link>


<div className="hidden md:flex space-x-8">
  <Link
    to="/"
    className="text-gray-700 font-semibold hover:text-gray-900"
  >
    Overview
  </Link>

  <Link
    to="/services"
    className="text-gray-700 font-semibold hover:text-gray-900"
  >
    Services
  </Link>

  <Link
    to="/booking"
    className="text-gray-700 font-semibold hover:text-gray-900"
  >
    Booking
  </Link>

  <Link
    to="/about"
    className="text-gray-700 font-semibold hover:text-gray-900"
  >
    About
  </Link>

  <Link
    to="/testimonials"
    className="text-gray-700 font-semibold hover:text-gray-900"
  >
    Testimonials
  </Link>

  <Link
    to="/faqs"
    className="text-gray-700 font-semibold hover:text-gray-900"
  >
    FAQs
  </Link>

  <select className="text-gray-700 font-semibold bg-transparent border-none">
    <option>EN</option>
    <option>NL</option>
  </select>
</div>


          <button className="hidden md:block bg-[#d4af37] text-gray-900 px-6 py-2 rounded-full hover:bg-yellow-500 transition">
            Contact us
          </button>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavbarHome