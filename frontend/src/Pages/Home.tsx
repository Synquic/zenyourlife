import  { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../config/api";

import zenurlifemassage from "../assets/zenurlifemassage.jpeg";
import massage2zen from "../assets/massage2zen.jpeg";
import frame3 from "../assets/frame3.png";
import frame5 from "../assets/frame5.png";
import frame6 from "../assets/Frame 6.png";
import MasterPrimaryButton from "../assets/Master Primary Button (4).png";
import tp1 from "../assets/tp1.jpg";
import tp2 from "../assets/tp2.jpg";
import tp3 from "../assets/tp3.jpg";
import tp4 from "../assets/tp4.jpg";
import tp5 from "../assets/tp5.png";
import lock from "../assets/lock.png";

import {
  
  X,
} from "lucide-react";
import NavbarHome from "../components/NavbarHome";
import Testimonial from "../components/Testimonial";
import Expert from "../components/Expert";
import Booking from "../components/Booking";
import RContact from "../components/Rental/RContact";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import FloatingBookButton from "../components/FloatingBookButton";


interface FAQData {
  _id: string;
  question: string;
  answer: string;
}

const Home = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [faqs, setFaqs] = useState<FAQData[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const { t, i18n } = useTranslation();

  // Get current language for API calls
  const currentLang = i18n.language?.split('-')[0] || 'en';

  const navigate=useNavigate();

  // Fetch FAQs from database
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoadingFaqs(true);
        const response = await fetch(`${API_BASE_URL}/faqs?category=massage&lang=${currentLang}`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setFaqs(data.data);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoadingFaqs(false);
      }
    };

    fetchFAQs();
  }, [currentLang]);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isBookingModalOpen || isContactModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isBookingModalOpen, isContactModalOpen]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div>
      {/* Hero Section */}
      <NavbarHome />
      <section id="herosection" className="px-3 sm:px-6 lg:px-8 py-4 sm:py-8 mt-14 sm:mt-10">
        {/* Card Container */}
        <div className="relative max-w-7xl mx-auto h-[520px] sm:h-[600px] md:h-[700px] rounded-2xl sm:rounded-3xl overflow-hidden">
          {/* Background Image */}
          <img
            src={zenurlifemassage}
            alt="Wellness"
            className="absolute inset-0 w-full h-full object-cover object-[65%_center] sm:object-center"
          />

          {/* Black Gradient Overlay - Stronger bottom gradient on mobile for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 via-40% to-transparent sm:bg-gradient-to-r sm:from-black sm:via-black/85 sm:via-40% sm:to-transparent"></div>

          {/* Content - Bottom aligned on mobile, centered on desktop */}
          <div className="relative z-20 h-full flex flex-col justify-end sm:justify-center px-5 sm:px-8 md:px-16 pb-8 sm:pb-0">
            <div className="max-w-2xl">
              {/* Trusted Partners Badge - Top on mobile */}
              <div className="flex items-center gap-2 mb-4 sm:hidden">
                <div className="flex items-center -space-x-1.5">
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-md overflow-hidden">
                    <img src={tp1} alt="Partner 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-md overflow-hidden">
                    <img src={tp2} alt="Partner 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-md overflow-hidden">
                    <img src={tp3} alt="Partner 3" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-md overflow-hidden">
                    <img src={tp4} alt="Partner 4" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-white/90 text-xs font-medium">
                  {t('home.trusted_by')} {t('home.partners')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-6xl font-inter text-white mb-3 sm:mb-6 leading-tight drop-shadow-[0_0_20px_white]">
                {t('home.hero_title')}
              </h1>

              <p className="text-white/90 text-sm sm:text-base mb-5 sm:mb-8 leading-relaxed max-w-[320px] sm:max-w-[500px]">
                {t('home.hero_description')}
              </p>

              <div className="flex flex-row gap-3 sm:gap-4 items-center">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="bg-white/10 backdrop-blur-md border border-yellow-400 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-white/20 transition flex items-center justify-center gap-2 sm:gap-2 text-sm sm:text-base whitespace-nowrap"
                >
                  {t('services.schedule_now')}
                  <img
                    src={MasterPrimaryButton}
                    alt=""
                    className="h-5 sm:h-6 w-auto"
                  />
                </button>
                <button onClick={()=>navigate('/Servicepage')} className="bg-white/10 backdrop-blur-md border border-yellow-400 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-white/20 transition text-sm sm:text-base whitespace-nowrap">
                  {t('services.view_all')}
                </button>
              </div>
            </div>
          </div>

          {/* Trusted Partners Badge - Bottom Right on desktop only */}
          <div className="hidden sm:block absolute bottom-5 right-10 z-20">
            <div className="bg-white/30 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/40">
              {/* Overlapping Avatar Circles */}
              <div className="flex items-center -space-x-1.5 mb-2">
                <div className="w-8 h-8 rounded-full border border-white shadow-md overflow-hidden">
                  <img src={tp1} alt="Partner 1" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full border border-white shadow-md overflow-hidden">
                  <img src={tp2} alt="Partner 2" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full border border-white shadow-md overflow-hidden">
                  <img src={tp3} alt="Partner 3" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full border border-white shadow-md overflow-hidden">
                  <img src={tp4} alt="Partner 4" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full border border-white shadow-md overflow-hidden bg-black flex items-center justify-center">
                  <img src={tp5} alt="Partner 5" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-gray-900 font-semibold text-sm">
                  {t('home.trusted_by')}
                </h3>
                <h3 className="text-gray-900 font-semibold text-sm">
                  {t('home.partners')}
                </h3>
                <p className="text-gray-700 text-xs mt-1 leading-relaxed">
                  {t('home.partners_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            {/* Treatments Offered */}
            <div className="text-center p-4 sm:p-8 border-r border-gray-200">
              <h3 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">10+</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {t('home.treatments_offered')}
              </p>
            </div>

            {/* Years of Experience */}
            <div className="text-center bg-[#B8860B] p-4 sm:p-8 border-r border-gray-200">
              <h3 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">15+</h3>
              <p className="text-xs sm:text-sm text-white">
                {t('home.years_experience')}
              </p>
            </div>

            {/* Satisfied Clients */}
            <div className="text-center p-4 sm:p-8">
              <h3 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">2k+</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {t('home.satisfied_clients')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Services Section */}
      <section className="px-3 sm:px-6 lg:px-8 py-10 sm:py-16 bg-gradient-to-b from-[#F5D88E] via-[#FEFFCF] to-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="relative inline-block mb-3 sm:mb-4">
              {/* Glow effect layers */}
              <div className="absolute inset-0 bg-[#F5D88E]/30 blur-2xl rounded-full scale-150"></div>
              <div className="absolute inset-0 bg-[#F5D88E]/20 blur-3xl rounded-full scale-[2]"></div>

              <span className="relative inline-flex items-center gap-2 bg-white text-[#B8860B] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm shadow-lg">
                <img src={lock} alt="Lock" className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {t('nav.services')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal text-gray-900 mb-3 sm:mb-4 px-2">
              {t('home.exclusive_services')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
              {t('home.exclusive_description')}
            </p>
          </div>

          {/* Services Grid */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mb-6 sm:mb-8">
              {/* Permanent Make-Up */}
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  {t('home.pmu_title')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {t('home.pmu_description')}
                </p>
              </div>

              {/* Relaxing massage */}
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  {t('home.relaxing_massage')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {t('home.relaxing_massage_desc')}
                </p>
              </div>

              {/* Healing reflexology */}
              {/* <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  {t('home.healing_reflexology')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {t('home.reflexology_desc')}
                </p>
              </div> */}

              {/* Signature hot stone */}
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  {t('home.hot_stone')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {t('home.hot_stone_desc')}
                </p>
              </div>

              {/* Facial Care */}
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  {t('nav.facial_care')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {t('home.facial_care_desc')}
                </p>
              </div>

              {/* Book Consultation Card */}
              <div className="relative bg-gradient-to-br from-[#F5E6D3] to-[#E8D4B8] rounded-xl overflow-hidden shadow-sm min-h-[120px] sm:min-h-0">
                {/* Background Image */}
                <img
                  src={frame3}
                  alt="Spa"
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />

                {/* Content */}
                <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
                      {t('home.book_consultation')}
                    </h3>
                  </div>
                  <div className="flex justify-end items-end mt-3 sm:mt-4">
                    <img
                      src={MasterPrimaryButton}
                      alt="Book Now"
                      onClick={() => setIsBookingModalOpen(true)}
                      className="h-8 sm:h-10 w-auto cursor-pointer hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frame 4 Section - Deep Tissue Massage */}
      <section className="px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">
            {/* Left - Text Content with Gradient */}
            <div
              className="md:w-1/2 p-5 sm:p-8 md:p-12 flex items-center order-2 md:order-1"
              style={{
                background: 'linear-gradient(to right, #8C3C06, #DFB13B, #FEFFCF)'
              }}
            >
              <p className="text-white text-sm sm:text-lg md:text-xl leading-relaxed font-light drop-shadow-sm">
                {t('home.deep_tissue_desc')}
              </p>
            </div>
            {/* Right - Image */}
            <div className="md:w-1/2 h-48 sm:h-64 md:h-auto order-1 md:order-2">
              <img
                src={massage2zen}
                alt="Deep Tissue Massage"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Frame 5 Section */}
      <section className="px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto relative">
          <div className="relative h-[350px] sm:h-[400px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
            <img
              src={frame5}
              alt="Wellness Room"
              className="w-full h-full object-cover"
            />
            {/* Schedule Now Button Overlay */}
            <div className="absolute top-3 right-3 sm:top-[5%] sm:right-[3%]">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-white/15 backdrop-blur-md border border-[#B8860B] text-black rounded-lg sm:rounded-xl pl-3 pr-2 sm:pl-6 sm:pr-4 py-2 sm:py-3 hover:bg-white/25 transition-all flex items-center gap-2 sm:gap-3 shadow-xl cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                  {t('services.schedule_now')}
                </span>
                <div className="bg-[#B8860B] rounded-full p-1 sm:p-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            </div>

            {/* Glass Effect Text Card - Bottom Left */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-md">
              <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-inter text-white mb-2 sm:mb-4 leading-tight">
                  {t('home.discover_commitment')}
                </h2>
                <p className="text-white text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {t('home.commitment_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Expert />

      {/* Features Section */}


      {/* Why Choose Us Section */}
      <section className="px-3 sm:px-6 lg:px-8 py-10 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block bg-[#FFFBEA] text-[#B8860B] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-3 sm:mb-4">
              {t('home.why_choose_us')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-3 sm:mb-4 px-2">
              {t('home.perfect_blend')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm px-4">
              {t('home.blend_desc')}
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 max-w-4xl mx-auto px-2">
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-6 py-2 sm:py-3 text-center hover:border-[#B8860B] transition cursor-pointer">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900">
                {t('home.skilled_professionals')}
              </h4>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-6 py-2 sm:py-3 text-center hover:border-[#B8860B] transition cursor-pointer">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900">
                {t('home.top_quality_products')}
              </h4>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-6 py-2 sm:py-3 text-center hover:border-[#B8860B] transition cursor-pointer">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900">
                {t('home.serene_environment')}
              </h4>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-6 py-2 sm:py-3 text-center hover:border-[#B8860B] transition cursor-pointer">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900">
                {t('home.tailored_services')}
              </h4>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-stretch max-w-5xl mx-auto">
            {/* Left - Image */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg h-64 sm:h-80 md:h-full">
              <img
                src={frame6}
                alt="Spa Treatment"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right - Feature Cards */}
            <div className="space-y-3 flex flex-col justify-between">
              {/* Premium Products */}
              <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-[#B8860B] rounded-lg sm:rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      {t('home.premium_products')}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {t('home.premium_desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Holistic Approach */}
              <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-[#B8860B] rounded-lg sm:rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      {t('home.holistic_approach')}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {t('home.holistic_desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Convenient Booking */}
              <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-[#B8860B] rounded-lg sm:rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      {t('home.convenient_booking')}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {t('home.booking_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonial />

      {/* FAQ Section */}
      <section id="faq" className="px-3 sm:px-6 lg:px-8 py-10 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Left Side - FAQ Header */}
            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-8">
              <span className="relative inline-flex items-center gap-2 bg-[#DFB13B1A] text-[#B8860B] px-4 sm:px-5 py-1 rounded-full text-xs sm:text-sm shadow-lg">
                <img src={lock} alt="Lock" className="w-2 h-2" />
                {t('nav.faqs')}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter text-gray-900 mb-4 sm:mb-8 mt-3 sm:mt-4">
                {t('home.faq_title')}
              </h2>

              <div className="mt-6 sm:mt-12">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#B8860B] mb-3 sm:mb-4">
                  {t('home.still_questions')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                  {t('home.faq_help')}
                </p>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white/20 backdrop-blur-md border-2 border-[#B8860B] text-gray-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-white/30 transition flex items-center gap-2 shadow-lg text-sm sm:text-base"
                >
                  <span className="font-medium">{t('home.contact_us')}</span>
                  <img
                    src={MasterPrimaryButton}
                    alt="Arrow"
                    className="h-4 sm:h-5 w-auto"
                  />
                </button>
              </div>
            </div>

            {/* Right Side - FAQ Accordion */}
            <div className="space-y-3 sm:space-y-4">
              {loadingFaqs ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-[#B8860B]/20 border-t-[#B8860B] rounded-full animate-spin"></div>
                </div>
              ) : faqs.length > 0 ? (
                faqs.map((faq, index) => (
                  <div
                    key={faq._id}
                    className={`border-2 rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all ${
                      openFaq === index + 1
                        ? "border-[#B8860B] bg-[#FFFBEA]"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex gap-2 sm:gap-4">
                        <span
                          className={`font-medium text-sm sm:text-base ${
                            openFaq === index + 1 ? "text-[#B8860B]" : "text-gray-400"
                          }`}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h4
                          className={`font-medium text-sm sm:text-base ${
                            openFaq === index + 1 ? "text-[#B8860B]" : "text-gray-900"
                          }`}
                        >
                          {faq.question}
                        </h4>
                      </div>
                      <button
                        onClick={() => toggleFaq(index + 1)}
                        className={`flex-shrink-0 ${
                          openFaq === index + 1
                            ? "text-[#B8860B] hover:text-[#9A7209]"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {openFaq === index + 1 ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          )}
                        </svg>
                      </button>
                    </div>
                    {openFaq === index + 1 && (
                      <div className="pl-6 sm:pl-9 mt-3 sm:mt-4">
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  {t('home.no_faqs', 'No FAQs available at the moment.')}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
     <Footer/>

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

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Close Button */}
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-2 transition z-50 shadow-md"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Contact Component */}
            <RContact isModal={true} onClose={() => setIsContactModalOpen(false)} />
          </div>
        </div>
      )}

      <FloatingBookButton />
    </div>
  );
};

export default Home;
