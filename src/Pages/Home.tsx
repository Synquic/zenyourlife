import  { useState, useEffect } from "react";


import frame2 from "../assets/frame2.png";
import frame3 from "../assets/frame3.png";
import frame4 from "../assets/Frame 4.png";
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
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  X,
} from "lucide-react";
import NavbarHome from "../components/NavbarHome";
import Testimonial from "../components/Testimonial";
import Expert from "../components/Expert";
import Booking from "../components/Booking";


const Home = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(2);
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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div>
      {/* Hero Section */}
      <NavbarHome />
      <section className="px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Card Container */}
        <div className="relative max-w-7xl mx-auto h-[650px] md:h-[700px] rounded-3xl overflow-hidden">
          {/* Background Image */}
          <img
            src={frame2}
            alt="Wellness"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Black Gradient Overlay from Left */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 via-40% to-transparent"></div>

          {/* Content */}
          <div className="relative z-20 h-full flex items-center">
            <div className="max-w-2xl px-8 md:px-16">
              <h1 className="text-6xl md:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-[0_0_20px_white]">
                Because health is more than the absence of disease
              </h1>

              <p className="text-white text-base mb-8 leading-relaxed max-w-[500px]">
                Experience a peaceful retreat with our luxurious treatments,
                crafted to refresh your senses and restore harmony.
              </p>

              <div className="flex gap-4">
                <button className="bg-white/10 backdrop-blur-md border-1 border-yellow-400 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition flex items-center gap-2">
                  Schedule Now
                  <img
                    src={MasterPrimaryButton}
                    alt=""
                    className="h-6 w-auto"
                  />
                </button>
                <button className="bg-white/10 backdrop-blur-md border-1 border-yellow-400 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition">
                  View Services
                </button>
              </div>
            </div>
          </div>

          {/* Trusted Partners Badge - Bottom Right */}
          <div className="absolute bottom-5 right-10 z-20">
            <div className="bg-white/30 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/40 max-w-[240px]">
              {/* Overlapping Avatar Circles */}
              <div className="flex items-center -space-x-1.5 mb-2">
                <div className="w-8 h-8 rounded-full border-1 border-white shadow-md overflow-hidden">
                  <img src={tp1} alt="Partner 1" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full border-1 border-white shadow-md overflow-hidden">
                  <img src={tp2} alt="Partner 2" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full border-1 border-white shadow-md overflow-hidden">
                  <img src={tp3} alt="Partner 3" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full border-1 border-white shadow-md overflow-hidden">
                  <img src={tp4} alt="Partner 4" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full border-1 border-white shadow-md overflow-hidden bg-black flex items-center justify-center">
                  <img src={tp5} alt="Partner 5" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-gray-900 font-semibold text-sm">
                  Trusted by
                </h3>
                <h3 className="text-gray-900 font-semibold text-sm">
                  1000+ Partners
                </h3>
                <p className="text-gray-700 text-xs mt-1 leading-relaxed">
                  The perfect organizer and developer for dream agency
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Treatments Offered */}
            <div className="text-center p-8 border-r border-b md:border-b-0 border-gray-200">
              <h3 className="text-4xl font-bold text-gray-800 mb-2">100+</h3>
              <p className="text-sm text-gray-600">
                Treatments
                <br />
                Offered
              </p>
            </div>

            {/* Certified Therapists */}
            <div className="text-center bg-[#B8860B] p-8 border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-4xl font-bold text-white mb-2">50+</h3>
              <p className="text-sm text-white">
                Certified
                <br />
                Therapists
              </p>
            </div>

            {/* Satisfied Clients */}
            <div className="text-center p-8 border-r border-gray-200">
              <h3 className="text-4xl font-bold text-gray-800 mb-2">2k+</h3>
              <p className="text-sm text-gray-600">
                Satisfied
                <br />
                Clients
              </p>
            </div>

            {/* Unique Wellness */}
            <div className="text-center p-8">
              <h3 className="text-4xl font-bold text-gray-800 mb-2">300+</h3>
              <p className="text-sm text-gray-600">
                Unique
                <br />
                Wellness
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Services Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-[#F5D88E] via-[#FEFFCF] to-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-4">
              {/* Glow effect layers */}
              <div className="absolute inset-0 bg-[#F5D88E]/30 blur-2xl rounded-full scale-150"></div>
              <div className="absolute inset-0 bg-[#F5D88E]/20 blur-3xl rounded-full scale-[2]"></div>

              <span className="relative inline-flex items-center gap-2 bg-white text-[#B8860B] px-6 py-2 rounded-full text-sm shadow-lg">
                <img src={lock} alt="Lock" className="w-3 h-3" />
                Services
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-Normal text-gray-900 mb-4">
              Exclusive services for
              <br />
              ultimate relaxation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience a peaceful retreat with our luxurious spa treatments,
              crafted to refresh your senses and restore harmony
            </p>
          </div>

          {/* Services Grid */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-5 mb-8">
              {/* Permanent Make-Up */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Permanent Make-Up (PMU)
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Micropigmentation and permanent makeup are pigmentation
                  methods that incorporate natural pigments into the skin.
                </p>
              </div>

              {/* Relaxing massage */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Relaxing massage
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Therapeutic massages are designed to alleviate chronic and
                  acute movement and pain complaints. Think pain, etc. are
                  examples of these that we can offer!
                </p>
              </div>

              {/* Healing reflexology */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Healing reflexology
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Target pressure points on your feet to release blockages,
                  improve energy flow & enhance overall health and well-being
                </p>
              </div>

              {/* Signature hot stone */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Signature hot stone
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Experience deep relaxation with hot stones applied to pressure
                  points, relieving tension & improving circulation for total
                  wellness
                </p>
              </div>

              {/* Facial Care */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Facial Care
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Keeping your skin beautiful and youthful longer requires extra
                  effort. A healthy lifestyle, diet, exercise, and using
                  natural, healthy products.
                </p>
              </div>

              {/* Book Consultation Card */}
              <div className="relative bg-gradient-to-br from-[#F5E6D3] to-[#E8D4B8] rounded-xl overflow-hidden shadow-sm">
                {/* Background Image */}
                <img
                  src={frame3}
                  alt="Spa"
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />

                {/* Content */}
                <div className="relative z-10 p-5 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Book your consultation call with us now!
                    </h3>
                  </div>
                  <div className="flex justify-end items-end mt-4">
                    <img
                      src={MasterPrimaryButton}
                      alt="Book Now"
                      className="h-10 w-auto cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frame 4 Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <img
            src={frame4}
            alt="Wellness Experience"
            className="w-full h-auto rounded-3xl object-cover shadow-lg"
          />
        </div>
      </section>

      {/* Frame 5 Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto relative">
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg">
            <img
              src={frame5}
              alt="Wellness Room"
              className="w-full h-full object-cover"
            />
            {/* Schedule Now Button Overlay */}
            <div className="absolute top-[5%] right-[3%]">
              <button className="bg-white/15 backdrop-blur-md border border-[#B8860B] text-black rounded-xl pl-6 pr-4 py-3 hover:bg-white/25 transition-all flex items-center gap-3 shadow-xl cursor-pointer">
                <span className="text-sm font-medium tracking-wide">
                  Schedule Now
                </span>
                <div className="bg-[#B8860B] rounded-full p-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
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
            <div className="absolute bottom-8 left-8 max-w-md">
              <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl md:text-3xl font-serif text-white mb-4 leading-tight">
                  Discover our commitment to wellness
                </h2>
                <p className="text-white text-sm leading-relaxed">
                  Under the guidance of our experienced team, we offer
                  revitalizing spa treatments designed to enhance your natural
                  beauty. With a focus on non-invasive therapies, our spa
                  attracts clients from around the world seeking rejuvenation
                  and relaxation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Expert />

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-[#F5D88E] via-[#FEFFCF] to-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Customized Treatments */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="bg-[#B8860B] rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Customized Treatments
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every person has a different experience; carefully designed to
                address.
              </p>
            </div>

            {/* Expert Therapists */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="bg-[#B8860B] rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Expert Therapists
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our skilled therapists provide high-quality treatment.
              </p>
            </div>

            {/* Luxurious Ambience */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="bg-[#B8860B] rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Luxurious Ambience
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Indulge in serene & calming environment that provides
                relaxation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block bg-[#FFFBEA] text-[#B8860B] px-6 py-2 rounded-full text-sm mb-4">
              Why Choose Us?
            </span>
            <h2 className="text-3xl md:text-4xl  text-gray-900 mb-4">
              Experience the perfect blend
              <br />
              of luxury & massage
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              Our team of skilled professionals provides personalized,
              non-invasive treatments to help you look and feel your best
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-3 text-center hover:border-[#B8860B] transition cursor-pointer">
              <h4 className="text-sm font-semibold text-gray-900">
                Skilled Professionals
              </h4>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-3 text-center hover:border-[#B8860B] transition cursor-pointer">
              <h4 className="text-sm font-semibold text-gray-900">
                Top-Quality Products
              </h4>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-3 text-center hover:border-[#B8860B] transition cursor-pointer">
              <h4 className="text-sm font-semibold text-gray-900">
                Serene Environment
              </h4>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-3 text-center hover:border-[#B8860B] transition cursor-pointer">
              <h4 className="text-sm font-semibold text-gray-900">
                Tailored Services
              </h4>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto">
            {/* Left - Image */}
            <div className="rounded-3xl overflow-hidden shadow-lg h-full">
              <img
                src={frame6}
                alt="Spa Treatment"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right - Feature Cards */}
            <div className="space-y-3 flex flex-col justify-between">
              {/* Premium Products */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="bg-[#B8860B] rounded-xl w-12 h-12 flex-shrink-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Premium Products
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We use only the finest products, ensuring exceptional
                      results fine
                    </p>
                  </div>
                </div>
              </div>

              {/* Holistic Approach */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="bg-[#B8860B] rounded-xl w-12 h-12 flex-shrink-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Holistic Approach
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Our treatments focus on both physical and mental wellness
                      for a complete
                    </p>
                  </div>
                </div>
              </div>

              {/* Convenient Booking */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="bg-[#B8860B] rounded-xl w-12 h-12 flex-shrink-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Convenient Booking
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Easily schedule your appointments online or by phone to
                      suit you
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
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto -mt-4">
            {/* Left Side - FAQ Header */}
            <div className=" rounded-2xl p-8 -mt-8">
              <span className="relative inline-flex items-center gap-2 bg-[#DFB13B1A] text-[#B8860B] px-5 py-1 rounded-full text-sm shadow-lg">
                <img src={lock} alt="Lock" className="w-2 h-2" />
                FAQs
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8">
                FAQs related to
                <br />
                Lanzarote Experience
              </h2>

              <div className="mt-12">
                <h3 className="text-2xl font-semibold text-[#B8860B] mb-4">
                  Still Have
                  <br />
                  Questions?
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Not finding the answer you're looking for? Tell us what you
                  need - we'll point you in the right direction without the
                  flaps and-forth.
                </p>
                <button className="bg-white/20 backdrop-blur-md border-2 border-[#B8860B] text-gray-900 px-6 py-3 rounded-lg hover:bg-white/30 transition flex items-center gap-2 shadow-lg">
                  <span className="font-medium">Contact Us</span>
                  <img
                    src={MasterPrimaryButton}
                    alt="Arrow"
                    className="h-5 w-auto"
                  />
                </button>
              </div>
            </div>

            {/* Right Side - FAQ Accordion */}
            <div className="space-y-4">
              {/* Question 1 */}
              <div
                className={`border-2 rounded-xl p-6 transition-all ${
                  openFaq === 1
                    ? "border-[#B8860B] bg-[#FFFBEA]"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <span
                      className={`font-medium ${
                        openFaq === 1 ? "text-[#B8860B]" : "text-gray-400"
                      }`}
                    >
                      01
                    </span>
                    <h4
                      className={`font-medium ${
                        openFaq === 1 ? "text-[#B8860B]" : "text-gray-900"
                      }`}
                    >
                      What's included in each rental?
                    </h4>
                  </div>
                  <button
                    onClick={() => toggleFaq(1)}
                    className={
                      openFaq === 1
                        ? "text-[#B8860B] hover:text-[#9A7209]"
                        : "text-gray-400 hover:text-gray-600"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {openFaq === 1 ? (
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
                {openFaq === 1 && (
                  <div className="pl-9 mt-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Each rental includes fully furnished accommodations with
                      modern amenities, complimentary Wi-Fi, and all essential
                      utilities. Many properties also feature additional perks
                      like pool access, parking, and welcome packages.
                    </p>
                  </div>
                )}
              </div>

              {/* Question 2 - Expanded */}
              <div
                className={`border-2 rounded-xl p-6 transition-all ${
                  openFaq === 2
                    ? "border-[#B8860B] bg-[#FFFBEA]"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <span
                      className={`font-medium ${
                        openFaq === 2 ? "text-[#B8860B]" : "text-gray-400"
                      }`}
                    >
                      02
                    </span>
                    <h4
                      className={`font-medium ${
                        openFaq === 2 ? "text-[#B8860B]" : "text-gray-900"
                      }`}
                    >
                      How far are the rentals from Lanzarote's main attractions?
                    </h4>
                  </div>
                  <button
                    onClick={() => toggleFaq(2)}
                    className={
                      openFaq === 2
                        ? "text-[#B8860B] hover:text-[#9A7209]"
                        : "text-gray-400 hover:text-gray-600"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {openFaq === 2 ? (
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
                {openFaq === 2 && (
                  <div className="pl-9 mt-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      It depends on where you book. Coastal homes are minutes
                      from beaches, while countryside stays offer easy access to
                      volcanic trails and nature spots. Each listing includes an
                      exact map and distance highlights so you know exactly what
                      you're getting into.
                    </p>
                  </div>
                )}
              </div>

              {/* Question 3 */}
              <div
                className={`border-2 rounded-xl p-6 transition-all ${
                  openFaq === 3
                    ? "border-[#B8860B] bg-[#FFFBEA]"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <span
                      className={`font-medium ${
                        openFaq === 3 ? "text-[#B8860B]" : "text-gray-400"
                      }`}
                    >
                      03
                    </span>
                    <h4
                      className={`font-medium ${
                        openFaq === 3 ? "text-[#B8860B]" : "text-gray-900"
                      }`}
                    >
                      Is early check-in or late check-out possible?
                    </h4>
                  </div>
                  <button
                    onClick={() => toggleFaq(3)}
                    className={
                      openFaq === 3
                        ? "text-[#B8860B] hover:text-[#9A7209]"
                        : "text-gray-400 hover:text-gray-600"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {openFaq === 3 ? (
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
                {openFaq === 3 && (
                  <div className="pl-9 mt-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Early check-in and late check-out are subject to
                      availability. We recommend contacting us in advance to
                      arrange flexible timing. Additional fees may apply
                      depending on the property and season.
                    </p>
                  </div>
                )}
              </div>

              {/* Question 4 */}
              <div
                className={`border-2 rounded-xl p-6 transition-all ${
                  openFaq === 4
                    ? "border-[#B8860B] bg-[#FFFBEA]"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <span
                      className={`font-medium ${
                        openFaq === 4 ? "text-[#B8860B]" : "text-gray-400"
                      }`}
                    >
                      04
                    </span>
                    <h4
                      className={`font-medium ${
                        openFaq === 4 ? "text-[#B8860B]" : "text-gray-900"
                      }`}
                    >
                      Are the rentals suitable for families or groups?
                    </h4>
                  </div>
                  <button
                    onClick={() => toggleFaq(4)}
                    className={
                      openFaq === 4
                        ? "text-[#B8860B] hover:text-[#9A7209]"
                        : "text-gray-400 hover:text-gray-600"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {openFaq === 4 ? (
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
                {openFaq === 4 && (
                  <div className="pl-9 mt-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Absolutely! We offer a variety of properties that cater to
                      families and groups of all sizes. From spacious villas to
                      multi-bedroom apartments, each listing specifies capacity
                      and family-friendly amenities.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <footer className="bg-gray-900 text-white min-h-screen py-16">
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#F4E5A1] rounded-3xl p-12 md:p-16 overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
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
                    <span className="text-white text-sm">Connect</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
                    Book your appointment for a rejuvenating experience
                  </h2>
                </div>

                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="bg-white/20 backdrop-blur-sm border border-white/40 text-white px-8 py-4 rounded-full hover:bg-white/30 transition-all flex items-center gap-3 shadow-lg cursor-pointer whitespace-nowrap"
                >
                  <span className="font-medium text-black">
                    Submit Your Form
                  </span>
                  <div className="bg-white rounded-full p-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#B8860B]"
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
            </div>
          </div>
        </section>
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
                See About →
              </button>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Massage
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Facial Care
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    PMU
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Transport
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start">
                  <Phone className="w-4 h-4 mr-2 mt-1" />
                  <span>+32 123 456 789</span>
                </li>
                <li className="flex items-start">
                  <Mail className="w-4 h-4 mr-2 mt-1" />
                  <span>info@zenyouths.be</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Location</h4>
              <p className="text-gray-400 text-sm mb-4">
                <MapPin className="w-4 h-4 inline mr-2" />
                Wellness center city, Villas 3<br />© Web - contact
              </p>
              <div className="flex space-x-2 mt-4">
                <span className="text-gray-400 text-sm">Languages:</span>
                <button className="text-white hover:text-yellow-400">En</button>
                <button className="text-gray-400 hover:text-white">Fr</button>
                <button className="text-gray-400 hover:text-white">De</button>
                <button className="text-gray-400 hover:text-white">Ge</button>
                <button className="text-gray-400 hover:text-white">No</button>
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
              © 2025 zenyouths.be. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto mt-2 shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Close Button */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition z-50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* Booking Component */}
            <div className="relative">
              <Booking onClose={() => setIsBookingModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
