import React from 'react'

import { Menu, X } from "lucide-react";
import znlogo from "../../assets/znlogo.png";
import { Link } from "react-router-dom";

const RNavbar = () => {
 const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <nav className="bg-white  fixed w-full top-0 z-50">
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
            <a
              href="#"
              className="text-gray-700 font-semibold hover:text-gray-900"
            >
              Overview
            </a>
            <a
              href="#"
              className="text-gray-700 font-semibold hover:text-gray-900"
            >
              Apartments
            </a>
            <a
              href="#"
              className="text-gray-700 font-semibold hover:text-gray-900"
            >
              Booking
            </a>
            <a
              href="#"
              className="text-gray-700 font-semibold hover:text-gray-900"
            >
              Lanzarote Experience
            </a>
            <a
              href="#"
              className="text-gray-700 font-semibold hover:text-gray-900"
            >
              FAQs
            </a>
            <select className="text-gray-700 font-semibold bg-transparent border-none">
              <option>EN</option>
              <option>NL</option>
            </select>
          </div>

          <button className="hidden md:block bg-[#4F82BE]  text-gray-900 px-6 py-2 rounded-full hover:bg-[#395f8b] transition">
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

export default RNavbar