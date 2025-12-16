import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import RNavbar from '../../components/Rental/RNavbar'
import RHeroSection from '../../components/Rental/RHeroSection'
import Overview from '../../components/Rental/Overview'
import Appartments from '../../components/Rental/Appartments'
import Banner from '../../components/Rental/Banner'
import Service from '../../components/Rental/Service'
import Testimonial from '../../components/Rental/Testimonial'
import FAQ from '../../components/Rental/FAQ'
import RFooter from '../../components/Rental/RFooter'
import RContact from '../../components/Rental/RContact'

const RHome = () => {
  const location = useLocation();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Scroll to section when navigating with hash
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isContactModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isContactModalOpen]);

  const handleOpenContactModal = () => {
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <>
    <RNavbar onContactClick={handleOpenContactModal} />
    <RHeroSection/>
    <Overview/>
    <Appartments/>
    <Banner/>
    <Service/>
    <Testimonial/>
    <FAQ onContactClick={handleOpenContactModal} />
    <RFooter onContactClick={handleOpenContactModal} />

    {/* Contact Modal - Full RContact Page */}
    {isContactModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white w-full h-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Close Button */}
          <button
            onClick={handleCloseContactModal}
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

          {/* Full RContact Component */}
          <RContact isModal={true} onClose={handleCloseContactModal} />
        </div>
      </div>
    )}
    </>
  )
}

export default RHome