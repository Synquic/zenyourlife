import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import znlogo from '../assets/znlogo.png';
import trustedImage from '../assets/trusted.png';
import main1 from '../assets/main1.png';
import main2 from '../assets/main2.png';

const MainLanding = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('EN');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src={znlogo}
                alt="ZenYourLife Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-semibold text-gray-800">
                zenyourlife.be
              </span>
            </div>

            {/* Right Side - Contact Button and Language Dropdown */}
            <div className="flex items-center gap-3">
              {/* Contact Button */}
              <button className="bg-[#d4af37] text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-[#b8921f] transition shadow-md">
                Contact us
              </button>

              {/* Language Dropdown */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-gray-700 text-sm font-semibold bg-transparent border border-gray-300 rounded-lg px-2 py-1.5 cursor-pointer hover:border-[#d4af37] transition"
              >
                <option value="EN">EN</option>
                <option value="NL">NL</option>
                <option value="FR">FR</option>
                <option value="DE">DE</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Trusted Partner Badge */}
          <div className="flex justify-center mb-8">
            <img
              src={trustedImage}
              alt="Trusted by 5000+ Partners"
              className="h-8 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 leading-tight">
              Discover Tranquility &<br />Luxury
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome to a world where luxury meets serenity
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Book A Massage Card */}
            <div
              onClick={() => navigate('/home')}
              className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <img
                src={main1}
                alt="Book A Massage"
                className="w-full h-80 object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">Book A Massage</h3>
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Antoin Beach</span>
                </div>
              </div>
            </div>

            {/* Book A Rental Card */}
            <div
              onClick={() => navigate('/rhome')}
              className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <img
                src={main2}
                alt="Book A Rental"
                className="w-full h-80 object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">Book A Rental</h3>
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Lanzarote, Spain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLanding;
