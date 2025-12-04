import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Shield,
} from "lucide-react";
import bluearrow from '../../assets/bluearrow.png';
import RBooking from './RBooking';
import { useTranslation } from "react-i18next";

interface FooterProps {
  onContactClick?: () => void;
}

const Footer = ({ onContactClick: _onContactClick }: FooterProps) => {
  const { t } = useTranslation();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
  };

  return (
    <>
    <footer  className="bg-gray-900 text-white min-h-screen py-16">
      {/* Booking Section */}
      <section className="mx-4 my-8 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-r from-[#4A90E2] via-[#7DB4E6] to-[#C8E6C9] rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-400/30">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 px-8 md:px-12 py-12 md:py-16 flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Left Side - Text Content */}
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-white"
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
                  <span className="text-white text-sm font-medium">{t('rental.footer.contact_label')}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-medium text-white leading-tight">
                  {t('rental.footer.booking_title')}
                </h2>
              </div>

              {/* Right Side - Buttons */}
              <div className="flex-shrink-0 flex gap-4">
              
                <button onClick={handleBookNow} className="relative bg-[#8cb8ea]/20 backdrop-blur-md border-2 border-[#4A90E2] hover:bg-[#f5d76e2]/30 text-white px-8 py-3.5 rounded-full transition-all text-base font-medium flex items-center gap-3 shadow-lg cursor-pointer overflow-hidden group">
                  {/* Glass shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50"></div>
                  <span className="font-semibold text-black relative z-10">{t('rental.footer.book_now')}</span>
                  <img src={bluearrow} alt="" className="h-5 w-auto relative z-10" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-4">zenyourlife.be</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 w-62">
              This is the little note about products and this little note.
              This place like website (it's also still place like note) is
              currently under slight updates.
            </p>
            <button className="text-yellow-400 hover:text-yellow-300">
              {t('rental.footer.see_about')} →
            </button>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('rental.footer.services')}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">{t('nav.massage')}</a></li>
              <li><a href="#" className="hover:text-white">{t('nav.facial_care')}</a></li>
              <li><a href="#" className="hover:text-white">{t('nav.pmu')}</a></li>
              <li><a href="#" className="hover:text-white">{t('nav.transport')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('rental.footer.contact_us')}</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-2 mt-1" />
                <span>+32 123 456 789</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-1" />
                <span>info@zenyouths.be</span>
              </li>
              <li className="flex items-start">
                <Shield className="w-4 h-4 mr-2 mt-1" />
                <Link to="/rprivacy" className="hover:text-white transition-colors">
                  {t('rental.footer.privacy_policy')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('rental.footer.location')}</h4>
            <p className="text-gray-400 text-sm mb-4">
              <MapPin className="w-4 h-4 inline mr-2" />
              Wellness center city, Villas 3<br />© Web - contact
            </p>
            <div className="flex space-x-2 mt-4">
              <span className="text-gray-400 text-sm">{t('rental.footer.languages')}:</span>
              <button className="text-white hover:text-yellow-400">En</button>
              <button className="text-gray-400 hover:text-white">Fr</button>
              <button className="text-gray-400 hover:text-white">De</button>
              <button className="text-gray-400 hover:text-white">Nl</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="#"
              className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Youtube size={20} />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 zenyouths.be. {t('rental.footer.all_rights')}
          </p>
        </div>
      </div>
    </footer>

    {/* RBooking Modal */}
    {isBookingModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-[1100px] max-h-[95vh] overflow-hidden shadow-2xl relative">
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-2 transition z-50 shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* RBooking Component */}
          <RBooking onClose={handleCloseModal} />
        </div>
      </div>
    )}
    </>
  );
};

export default Footer;
