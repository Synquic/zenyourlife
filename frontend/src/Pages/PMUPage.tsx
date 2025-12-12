import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { ArrowRight, Sparkles, Heart, Users, X } from 'lucide-react'
import serviceF1 from '../assets/serviceF1.png'
import Footer from '../components/Footer'
import { useTranslation } from 'react-i18next'
import BookingDate from '../components/BookingDate'
import TickImage from '../assets/tick.png'
import MasterPrimaryButton from '../assets/Master Primary Button (4).png'

const PMUPage = () => {
  const { t } = useTranslation();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isBookingModalOpen || showApprovedModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isBookingModalOpen, showApprovedModal]);

  // PMU Content
  const pmuContent = {
    title: t('pmu.title'),
    description: t('pmu.description'),
    contentSections: [
      {
        title: t('pmu.section1_title'),
        description: t('pmu.section1_desc')
      },
      {
        title: t('pmu.section2_title'),
        description: t('pmu.section2_desc')
      },
      {
        title: t('pmu.section3_title'),
        description: t('pmu.section3_desc')
      }
    ],
    benefits: [
      {
        title: t('pmu.benefit1_title'),
        description: t('pmu.benefit1_desc')
      },
      {
        title: t('pmu.benefit2_title'),
        description: t('pmu.benefit2_desc')
      },
      {
        title: t('pmu.benefit3_title'),
        description: t('pmu.benefit3_desc')
      },
      {
        title: t('pmu.benefit4_title'),
        description: t('pmu.benefit4_desc')
      },
      {
        title: t('pmu.benefit5_title'),
        description: t('pmu.benefit5_desc')
      }
    ],
    targetAudience: [
      {
        title: t('pmu.target1_title'),
        description: t('pmu.target1_desc')
      },
      {
        title: t('pmu.target2_title'),
        description: t('pmu.target2_desc')
      },
      {
        title: t('pmu.target3_title'),
        description: t('pmu.target3_desc')
      },
      {
        title: t('pmu.target4_title'),
        description: t('pmu.target4_desc')
      }
    ]
  };

  return (
    <>
      <Navbar />
      <div className="animate-fade-in">

        {/* Hero Banner Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-8 mt-10">
          <div className="relative max-w-7xl mx-auto h-[300px] rounded-3xl overflow-hidden">
            {/* Background Image */}
            <img
              src={serviceF1}
              alt={pmuContent.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay - Left to Right (Black to Transparent) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 via-40% to-transparent"></div>

            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
              <div className="max-w-xl px-8 md:px-12">
                {/* Heading */}
                <h1 className="text-4xl md:text-5xl font-inter text-[#d4af37] mb-4 leading-tight italic">
                  {pmuContent.title}
                </h1>

                {/* Description */}
                <p className="text-white/80 text-sm mb-6 leading-relaxed max-w-[400px]">
                  {pmuContent.description}
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="inline-flex items-center gap-3 bg-transparent border border-[#d4af37] text-white px-6 py-2.5 rounded-full hover:bg-[#d4af37]/10 transition group"
                >
                  <span className="text-sm">{t('services.schedule_now')}</span>
                  <span className="w-6 h-6 bg-[#d4af37] rounded-full flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections - Detailed descriptions with titles */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4af37]/10 text-[#d4af37] text-sm font-medium rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                {t('services.about_service')}
              </span>
              <h2 className="text-3xl md:text-4xl font-inter text-gray-900">
                {t('services.what_we_offer')}
              </h2>
            </div>

            <div className="space-y-6">
              {pmuContent.contentSections.map((section, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#d4af37]/30 transition-all duration-300"
                >
                  {/* Decorative accent */}
                  <div className="absolute top-0 left-8 w-16 h-1 bg-gradient-to-r from-[#d4af37] to-[#f5d88e] rounded-full transform -translate-y-1/2" />

                  {/* Number badge */}
                  <div className="absolute -left-3 top-8 w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                    {index + 1}
                  </div>

                  <div className="ml-4">
                    {/* Section Title */}
                    <h3 className="text-xl md:text-2xl font-inter mb-3 text-gray-900 group-hover:text-[#d4af37] transition-colors">
                      {section.title}
                    </h3>
                    {/* Section Content */}
                    <p className="text-gray-600 leading-relaxed text-base">
                      {section.description}
                    </p>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#d4af37]/20 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits You'll Feel Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4af37]/10 text-[#d4af37] text-sm font-medium rounded-full mb-4">
                <Heart className="w-4 h-4" />
                {t('services.wellness_benefits')}
              </span>
              <h2 className="text-3xl md:text-4xl font-inter text-gray-900 mb-3">
                {t('services.benefits_title')}
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                {t('services.benefits_subtitle')}
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {pmuContent.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#d4af37]/30 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#d4af37]/40 via-[#d4af37] to-[#d4af37]/40 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Icon container */}
                  <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37]/20 to-[#f5d88e]/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="w-3 h-3 bg-[#d4af37] rounded-full" />
                  </div>

                  {/* Benefit title */}
                  <h4 className="text-base font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Number indicator */}
                  <div className="absolute bottom-4 right-4 text-4xl font-inter text-[#d4af37]/10 group-hover:text-[#d4af37]/20 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who It's For Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white via-[#fdfcfa] to-white">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4af37]/10 text-[#d4af37] text-sm font-medium rounded-full mb-4">
                <Users className="w-4 h-4" />
                {t('services.perfect_for')}
              </span>
              <h2 className="text-3xl md:text-4xl font-inter text-gray-900 mb-3">
                {t('services.target_title')}
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                {t('services.target_subtitle')}
              </p>
            </div>

            {/* Target Audience Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {pmuContent.targetAudience.map((audience, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden"
                >
                  {/* Card with gradient border effect */}
                  <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    {/* Gradient top border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] via-[#f5d88e] to-[#d4af37] rounded-t-2xl" />

                    {/* Check icon */}
                    <div className="w-10 h-10 bg-[#d4af37]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                      <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    {/* Audience title */}
                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                      {audience.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {audience.description}
                    </p>

                    {/* Decorative corner */}
                    <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#d4af37]/5 to-transparent rounded-tl-full transform translate-x-8 translate-y-8 group-hover:from-[#d4af37]/10 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Book Your Experience Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-6 -mt-5">
          <div
            className="max-w-7xl mx-auto rounded-3xl p-12 text-center"
            style={{ background: 'linear-gradient(180deg, #F5D88E 0%, #FEFFCF 50%, #FFFFFF 100%)' }}
          >
            {/* Contact Badge */}
            <span className="inline-flex items-center gap-2 bg-white text-gray-700 text-sm px-5 py-2 rounded-full mb-6 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {t('nav.contact')}
            </span>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-inter text-gray-900 mb-8">
              {t('services.book_experience')}<br />
              {t('pmu.title')}
            </h2>

            {/* CTA Button */}
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-md border border-[#eac874] text-gray-700 px-6 py-2.5 rounded-full shadow-sm hover:bg-white/70 hover:shadow-md transition"
            >
              <span className="text-sm">{t('services.schedule_now')}</span>
              <span className="w-6 h-6 bg-[#d4af37] rounded-full flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </span>
            </button>
          </div>
        </section>

      </div>

      <Footer />

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-50 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Close Button */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-2 transition z-[10000] shadow-md"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* BookingDate Component */}
            <div className="relative p-4">
              <BookingDate
                onClose={() => setIsBookingModalOpen(false)}
                onSuccess={() => {
                  setIsBookingModalOpen(false);
                  setShowApprovedModal(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Approved/Success Modal */}
      {showApprovedModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowApprovedModal(false)}
              className="absolute top-6 right-6 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition z-50"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Approved Content */}
            <div className="p-8 text-center">
              {/* Tick Image */}
              <div className="flex justify-center mb-6">
                <div className="bg-green-50 rounded-full p-6">
                  <img
                    src={TickImage}
                    alt="Success"
                    className="w-24 h-24 object-contain"
                  />
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('booking.success')}
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {t('booking.success_message')}
              </p>

              {/* Back to Home Button */}
              <button
                onClick={() => {
                  setShowApprovedModal(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="relative bg-white/30 backdrop-blur-lg border-2 border-[#B8860B]/50 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-white/40 hover:border-[#B8860B] transition-all shadow-[0_8px_32px_0_rgba(184,134,11,0.2)] flex items-center gap-2 mx-auto overflow-hidden group"
              >
                {/* Glass shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50"></div>
                <span className="relative z-10 font-semibold">{t('booking.back_to_home')}</span>
                <img src={MasterPrimaryButton} alt="" className="h-5 w-auto relative z-10" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PMUPage
