import { useState, useEffect } from 'react';
import blueArrow from '../../assets/bluearrow.png';
import lock2 from '../../assets/lock2.png';
import RBooking from './RBooking';
import { useTranslation } from "react-i18next";

const Banner = () => {
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
    <div id='booking' className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
      <div className="relative max-w-6xl mx-auto bg-gradient-to-r from-sky-200 via-sky-300 to-sky-400 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-sky-300">
        {/* Cloud/Sky Background Pattern */}
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <div className="absolute top-2 right-8 sm:right-16 w-20 sm:w-40 h-10 sm:h-20 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-8 right-16 sm:right-32 w-24 sm:w-48 h-12 sm:h-24 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-4 right-28 sm:right-56 w-18 sm:w-36 h-9 sm:h-18 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-36 sm:right-72 w-16 sm:w-32 h-8 sm:h-16 bg-white rounded-full blur-2xl"></div>
        </div>

        {/* Diagonal Divider Line */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-400/40 to-transparent transform -skew-x-12 origin-center"></div>
        </div>

        {/* Right Side - Mountain Image (Full Height) with Diagonal Clip */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop"
              alt="snowy mountains"
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 py-6 sm:py-8 md:py-12">
          {/* Left Side - Contact Badge & Heading */}
          <div className="flex flex-col items-center md:items-start gap-3 sm:gap-5 flex-1 text-center md:text-left">
            {/* Contact Badge */}
            <button className="bg-white/60 backdrop-blur-sm border border-white/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-1.5 sm:gap-2 hover:bg-white/70 transition-all shadow-sm text-slate-700">
              <span className="text-sm sm:text-base">
                <img src={lock2} alt="" className="w-4 h-4 sm:w-auto sm:h-auto" />
              </span> {t('rental.banner.contact')}
            </button>

            {/* Heading */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                {t('rental.banner.title_1')}<br />
                {t('rental.banner.title_2')}
              </h2>
            </div>
          </div>

          {/* Right Side - Book Now Button */}
          <div className="mt-4 sm:mt-6 md:mt-0 relative z-20">
            <button
              onClick={handleBookNow}
              className="relative bg-white/30 backdrop-blur-md border-2 border-white text-slate-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 sm:gap-3 hover:bg-white/40 transition-all shadow-lg overflow-hidden group"
            >
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50"></div>
              <span className="relative z-10">{t('rental.banner.book_now')}</span>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center relative z-10">
                <img src={blueArrow} alt="arrow" className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* RBooking Modal */}
    {isBookingModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[1100px] max-h-[95vh] overflow-hidden shadow-2xl relative">
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white hover:bg-gray-100 rounded-full p-1.5 sm:p-2 transition z-50 shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
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

export default Banner;