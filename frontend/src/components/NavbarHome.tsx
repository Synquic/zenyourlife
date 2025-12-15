import React from 'react'

import { Menu, X, ChevronDown } from "lucide-react";
import znlogo from "../assets/znlogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NavbarHome = () => {
   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
   const [isLangOpen, setIsLangOpen] = React.useState(false);
   const langDropdownRef = React.useRef<HTMLDivElement>(null);

   const navigate=useNavigate();
   const { t, i18n } = useTranslation();

   // Get current language code in uppercase
   const currentLang = i18n.language?.toUpperCase().substring(0, 2) || 'EN';

   const languages = [
     { code: 'EN', lang: 'en', name: 'English', flag: '🇬🇧' },
     { code: 'NL', lang: 'nl', name: 'Nederlands', flag: '🇳🇱' },
     { code: 'FR', lang: 'fr', name: 'Français', flag: '🇫🇷' },
     { code: 'DE', lang: 'de', name: 'Deutsch', flag: '🇩🇪' }
   ];

   // Change language handler
   const changeLanguage = (langCode: string) => {
     i18n.changeLanguage(langCode);
     setIsLangOpen(false);
   };

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
   ZENYOURLIFE.BE
  </span>
</Link>


<div className="hidden md:flex space-x-8">
  <a
    href='#herosection'
     onClick={(e) => {
                e.preventDefault();
                document.getElementById('herosection')?.scrollIntoView({ behavior: 'smooth' });
              }}
    className="text-gray-700 font-medium hover:text-gray-900"
  >
    {t('nav.overview')}
  </a>

  <Link
    to="/Servicepage"
    className="text-gray-700 font-medium hover:text-gray-900"
  >
    {t('nav.services')}
  </Link>

  <a
    href='#booking'
     onClick={(e) => {
                e.preventDefault();
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
              }}
    className="text-gray-700 font-medium hover:text-gray-900"
  >
    {t('nav.booking')}
  </a>

  <Link
    to="/about"
    className="text-gray-700 font-medium hover:text-gray-900"
  >
    {t('nav.about')}
  </Link>

  <a
    href='#testimonial'
     onClick={(e) => {
                e.preventDefault();
                document.getElementById('testimonial')?.scrollIntoView({ behavior: 'smooth' });
              }}
    className="text-gray-700 font-medium hover:text-gray-900"
  >
    {t('nav.testimonial')}
  </a>

  <a
    href='#faq'
     onClick={(e) => {
                e.preventDefault();
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              }}
    className="text-gray-700 font-medium hover:text-gray-900"
  >
    {t('nav.faqs')}
  </a>

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
            onClick={() => changeLanguage(lang.lang)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FFFBEA] transition-colors ${
              currentLang === lang.code ? 'bg-[#FFFBEA] border-l-4 border-[#B8860B]' : ''
            }`}
          >
            <span className="text-2xl">{lang.flag}</span>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-900">{lang.code}</span>
              <span className="text-xs text-gray-600">{lang.name}</span>
            </div>
            {currentLang === lang.code && (
              <svg
                className="ml-auto w-5 h-5 text-[#B8860B]"
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


          <button onClick={()=>navigate('/contact')} className="hidden md:block bg-[#d4af37] text-white px-6 py-2 rounded-full hover:bg-yellow-500 transition">
            {t('nav.contact_us')}
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
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#herosection"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('herosection')?.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2"
            >
              {t('nav.overview')}
            </a>

            <Link
              to="/Servicepage"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2"
            >
              {t('nav.services')}
            </Link>

            <a
              href="#booking"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2"
            >
              {t('nav.booking')}
            </a>

            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2"
            >
              {t('nav.about')}
            </Link>

            <a
              href="#testimonial"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('testimonial')?.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2"
            >
              {t('nav.testimonial')}
            </a>

            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2"
            >
              {t('nav.faqs')}
            </a>

            {/* Language Selector for Mobile */}
            <div className="py-2 border-t border-gray-100 mt-2">
              <p className="text-xs text-gray-500 mb-2">{t('nav.language')}</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.lang);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                      currentLang === lang.code
                        ? 'bg-[#B8860B] text-white'
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
                navigate('/contact');
                setIsMenuOpen(false);
              }}
              className="w-full bg-[#d4af37] text-white px-6 py-3 rounded-full hover:bg-yellow-500 transition mt-4"
            >
              {t('nav.contact_us')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavbarHome