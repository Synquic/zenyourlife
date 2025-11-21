import React from 'react'

import { Menu, X, ChevronDown } from "lucide-react";
import znlogo from "../../assets/znlogo.png";
import { Link } from "react-router-dom";

const RNavbar = () => {
 const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [selectedLang, setSelectedLang] = React.useState('EN');
  const langDropdownRef = React.useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'NL', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' }
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
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

            {/* Premium Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-gray-700 font-semibold hover:text-gray-900 transition"
              >
                <span>{selectedLang}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Card */}
              {isLangOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-56 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#E3F2FD] transition-colors ${
                        selectedLang === lang.code ? 'bg-[#E3F2FD] border-l-4 border-[#4F82BE]' : ''
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-900">{lang.code}</span>
                        <span className="text-xs text-gray-600">{lang.name}</span>
                      </div>
                      {selectedLang === lang.code && (
                        <svg
                          className="ml-auto w-5 h-5 text-[#4F82BE]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button className="hidden md:block bg-[#4F82BE]  text-white px-6 py-2 rounded-full hover:bg-[#395f8b] transition">
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