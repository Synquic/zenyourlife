import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  X,
  Shield,
  FileText,
  Cookie,
  Scale,
} from "lucide-react";
import primaryMaster from '../assets/Master Primary Button (4).png';
import Booking from './Booking';
import znlogo from '../assets/znlogo.png';
import { API_BASE_URL } from '../config/api';

interface Service {
  _id: string;
  title: string;
  category: string;
}

const Footer = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Fetch services to get the first service of each category
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services`);
        const data = await response.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  // Navigate to first service of a category
  const navigateToFirstService = (category: string) => {
    const categoryServices = services.filter(s =>
      s.category.toLowerCase() === category.toLowerCase()
    );
    if (categoryServices.length > 0) {
      navigate(`/service/${categoryServices[0]._id}`);
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback to service page with category filter
      navigate(`/Servicepage?category=${category}`);
    }
  };

  // Change language handler
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isBookingModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isBookingModalOpen]);

  return (
    <>
    <footer id='booking' className="bg-gray-900 text-white min-h-0 sm:min-h-screen py-10 sm:py-16">
      {/* Booking Section */}
      <section className="mx-3 sm:mx-4 my-6 sm:my-8 mt-6 sm:mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#F4E5A1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#B8860B]/30">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F4E5A1]/20 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 px-4 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
              {/* Left Side - Text Content */}
              <div className="max-w-xl text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3 sm:mb-4">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-white text-xs sm:text-sm font-medium">{t('nav.contact_us')}</span>
                </div>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-medium text-white leading-tight">
                 {t('footer.booking_title')}
                </h2>
              </div>

              {/* Right Side - Button */}
              <div id='booking' className="flex-shrink-0">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="relative bg-white/30 backdrop-blur-md border-2 border-[#D4AF37] hover:bg-white/40 text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base font-medium flex items-center gap-2 sm:gap-3 shadow-lg cursor-pointer overflow-hidden group"
                >
                  {/* Glass shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50"></div>
                  <span className="font-medium relative z-10">{t('services.book_now')}</span>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center relative z-10">
                    <img src={primaryMaster} alt="arrow" className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* About Section - Full width on mobile */}
        <div className="mb-8 sm:mb-0 sm:hidden">
          <h3 className="text-xl font-semibold mb-3">zenyourlife.be</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {t('footer.about_description')}
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* About - Hidden on mobile, shown on larger screens */}
          <div className="hidden sm:block">
                        <div className="flex items-center gap-2 mb-4">
              <img src={znlogo} alt="ZenYourLife Logo" className="h-7 w-7 object-contain" />
              <h3 className="text-xl font-semibold">ZENYOURLIFE.BE</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {t('footer.about_description')}
            </p>

          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-base">{t('footer.services')}</h4>
            <ul className="space-y-2.5 text-gray-400 text-sm">
              <li>
                <button
                  onClick={() => navigateToFirstService('massage')}
                  className="hover:text-white transition-colors text-left"
                >
                  {t('nav.massage')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToFirstService('facial')}
                  className="hover:text-white transition-colors text-left"
                >
                  {t('nav.facial_care')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToFirstService('pmu')}
                  className="hover:text-white transition-colors text-left"
                >
                  {t('nav.pmu')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div id="footer-contact">
            <h4 className="font-semibold mb-4 text-base">{t('contact.title')}</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="relative group">
                <a
                  href="tel:+32476667115"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = 'tel:+32476667115';
                  }}
                  className="flex items-center hover:text-white transition-colors py-2 -my-2 cursor-pointer active:text-yellow-400"
                >
                  <Phone className="w-4 h-4 mr-2 shrink-0" />
                  <span className="underline">0476 66 71 15</span>
                </a>
                <span className="absolute left-0 -top-8 bg-white text-gray-900 px-3 py-1 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                  Call
                </span>
              </li>
              <li>
                <a
                  href="mailto:info@zenyourlife.be"
                  className="flex items-center hover:text-white transition-colors py-2 -my-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>info@zenyourlife.be</span>
                </a>
              </li>
              <li className="flex items-center">
                <span className="text-xs mr-2 flex-shrink-0 font-medium">BTW:</span>
                <span>BE0899912649</span>
              </li>
            </ul>

            {/* Legal Links */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                  <Link to="/privacy-policy" className="hover:text-white transition-colors">
                    {t('footer.privacy')}
                  </Link>
                </li>
                <li className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                  <Link to="/dpa" className="hover:text-white transition-colors">
                    {t('footer.dpa')}
                  </Link>
                </li>
                <li className="flex items-center">
                  <Scale className="w-4 h-4 mr-2 flex-shrink-0" />
                  <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
                    {t('footer.terms')}
                  </Link>
                </li>
                <li className="flex items-center">
                  <Cookie className="w-4 h-4 mr-2 flex-shrink-0" />
                  <Link to="/cookie-policy" className="hover:text-white transition-colors">
                    {t('footer.cookies')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold mb-4 text-base">{t('contact.address')}</h4>
            <div className="flex items-start text-gray-400 text-sm">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p>Schapenbaan 45</p>
                <p>1731 Relegem</p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-3 sm:space-x-4 mb-0">
            <a
              href="#"
              className="bg-white text-gray-900 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Facebook size={16} className="sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="bg-white text-gray-900 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Instagram size={16} className="sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="bg-white text-gray-900 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Linkedin size={16} className="sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="bg-white text-gray-900 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Youtube size={16} className="sm:w-5 sm:h-5" />
            </a>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm text-center">
            © 2025 zenyouths.be. {t('footer.rights')}.
          </p>
        </div> */}
      </div>
    </footer>

    {/* Booking Modal */}
    {isBookingModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-gray-50 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Close Button */}
          <button
            onClick={() => setIsBookingModalOpen(false)}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-2 transition z-50 shadow-md"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Booking Component */}
          <div className="relative">
            <Booking onClose={() => setIsBookingModalOpen(false)} />
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Footer;
