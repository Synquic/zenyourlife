import { Filter, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import NavbarHome from "./NavbarHome";

const Booking = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);

  const services = [
    {
      title: "Relaxing massage",
      description:
        "A gentle, soothing massage designed to ease tension and promote deep relaxation.",
    },
    {
      title: "Signature hot stone",
      description:
        "Heated stones are placed on key points to melt away stress and muscle stiffness.",
    },
    {
      title: "Permanent Make-Up (PMU)",
      description:
        "Semi-permanent cosmetic tattooing for brows, lips, or eyeliner—wake up ready.",
    },
    {
      title: "Healing reflexology",
      description:
        "Pressure applied to specific points on the feet to support overall wellness.",
    },
    {
      title: "Facial Care",
      description:
        "Customized skincare treatments to cleanse, hydrate, and rejuvenate your complexion.",
    },
    {
      title: "Sports Massage",
      description:
        "Targeted therapy to relieve muscle soreness and improve athletic performance.",
    },
    {
      title: "Back and Neck",
      description:
        "Focused relief for tension and stiffness in the upper body and spine.",
    },
    {
      title: "Hot Stone Therapy",
      description:
        "Smooth, heated stones glide over muscles to release deep-seated tension.",
    },
  ];

  return (
    <>
      <NavbarHome />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Appointment Booking
              </h1>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {services.map((service, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedService(index);
                  setShowError(false);
                }}
                className={`group relative overflow-hidden transition-all duration-500 rounded-2xl p-6 cursor-pointer select-none hover:scale-[1.04] hover:shadow-[0_15px_35px_rgba(0,0,0,0.35)] hover:-translate-y-2 ${
                  selectedService === index
                    ? "bg-gradient-to-br from-[#f8e7b5] via-[#d8a93d] to-[#6b4b09] border-2 border-gray-800"
                    : "bg-[#ffffff] text-gray-900"
                }`}
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-900 bg-gradient-to-br from-[#f8e7b5] via-[#d8a93d] to-[#6b4b09]"></div>

                {/* Gloss Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-40 pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <button className="w-10 h-10 bg-[#d4b13e] hover:bg-[#9A7209] rounded-full flex items-center justify-center transition-colors ml-auto">
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
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {showError && (
            <div className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-pulse">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="font-medium text-lg">
                Please select a massage service first
              </p>
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (selectedService === null) {
                  setShowError(true);
                  return;
                }
                navigate("/bookingdate");
              }}
              className="bg-[#B8860B] hover:bg-[#9A7209] text-white px-8 py-3 rounded-full font-medium transition-colors shadow-md"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;
