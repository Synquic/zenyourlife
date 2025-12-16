import React from 'react'

import { Menu, X, ChevronDown } from "lucide-react";
import znlogo from "../../assets/znlogo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface RNavbarProps {
  onContactClick?: () => void;
}

const RNavbar = ({ onContactClick }: RNavbarProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const langDropdownRef = React.useRef<HTMLDivElement>(null);

  // Get current language directly from i18n (syncs with localStorage)
  const currentLang = i18n.language?.toUpperCase().substring(0, 2) || 'EN';

  // Check if we're on the RHome page
  const isHomePage = location.pathname === '/rhome' || location.pathname === '/rhome/';

  // Handle navigation to sections
  const handleSectionClick = (sectionId: string) => {
    if (isHomePage) {
      // If on home page, scroll to section
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If on another page, navigate to home with hash
      navigate(`/rhome#${sectionId}`);
    }
  };


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
    ZENYOURLIFE.BE
  </span>
</Link>


          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 font-semibold hover:text-gray-900"
            >
              {t('rental.nav.home')}
            </Link>
            <button
              onClick={() => handleSectionClick('apartments')}
              className="text-gray-700 font-semibold hover:text-gray-900 cursor-pointer"
            >
              {t('rental.nav.apartments')}
            </button>
            <button
              onClick={() => handleSectionClick('booking')}
              className="text-gray-700 font-semibold hover:text-gray-900"
            >
              {t('rental.nav.booking')}
            </button>
            <button
              onClick={() => handleSectionClick('service')}
              className="text-gray-700 font-semibold hover:text-gray-900"
            >
              {t('rental.nav.lanzarote_experience')}
            </button>
            <button
              onClick={() => handleSectionClick('faq')}
              className="text-gray-700 font-semibold hover:text-gray-900"
            >
              {t('rental.nav.faqs')}
            </button>

            {/* Premium Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-gray-700 font-semibold hover:text-gray-900 transition"
              >
                <span>{currentLang}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Card */}
              {isLangOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-56 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code.toLowerCase());
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#E3F2FD] transition-colors ${
                        currentLang === lang.code ? 'bg-[#E3F2FD] border-l-4 border-[#4F82BE]' : ''
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-900">{lang.code}</span>
                        <span className="text-xs text-gray-600">{lang.name}</span>
                      </div>
                      {currentLang === lang.code && (
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

          <button onClick={onContactClick} className="hidden md:block bg-[#4F82BE]  text-white px-6 py-2 rounded-full hover:bg-[#395f8b] transition">
            {t('rental.nav.contact_us')}
          </button>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => {
                handleSectionClick('hero');
                setIsMenuOpen(false);
              }}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2 w-full text-left"
            >
              {t('rental.nav.home')}
            </button>
            <button
              onClick={() => {
                handleSectionClick('apartments');
                setIsMenuOpen(false);
              }}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2 w-full text-left"
            >
              {t('rental.nav.apartments')}
            </button>
            <button
              onClick={() => {
                handleSectionClick('booking');
                setIsMenuOpen(false);
              }}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2 w-full text-left"
            >
              {t('rental.nav.booking')}
            </button>
            <button
              onClick={() => {
                handleSectionClick('service');
                setIsMenuOpen(false);
              }}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2 w-full text-left"
            >
              {t('rental.nav.lanzarote_experience')}
            </button>
            <button
              onClick={() => {
                handleSectionClick('faq');
                setIsMenuOpen(false);
              }}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2 w-full text-left"
            >
              {t('rental.nav.faqs')}
            </button>

            {/* Language Selector for Mobile */}
            <div className="py-2 border-t border-gray-100 mt-2">
              <p className="text-xs text-gray-500 mb-2">{t('nav.language')}</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code.toLowerCase());
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                      currentLang === lang.code
                        ? 'bg-[#4F82BE] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Button for Mobile */}
            <button
              onClick={() => {
                onContactClick?.();
                setIsMenuOpen(false);
              }}
              className="w-full bg-[#4F82BE] text-white px-6 py-3 rounded-full hover:bg-[#395f8b] transition mt-4"
            >
              {t('rental.nav.contact_us')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default RNavbar