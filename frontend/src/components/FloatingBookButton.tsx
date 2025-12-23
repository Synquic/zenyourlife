import { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Booking from './Booking';

const FloatingBookButton = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { t } = useTranslation();

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
      {/* Floating Book Now Button */}
      <button
        onClick={() => setIsBookingModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#996515] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
      >
        <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-medium text-sm sm:text-base">{t('services.book_now', 'Book Now')}</span>
      </button>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
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

export default FloatingBookButton;
