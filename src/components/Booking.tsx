import { Filter, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import BookingDate from "./BookingDate";

interface BookingProps {
  onClose?: () => void;
}

const Booking = ({ onClose }: BookingProps) => {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);
  const [showBookingDate, setShowBookingDate] = useState(false);

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
      <div className="bg-gray-50 py-10 px-3 sm:px-4 lg:px-6">
        <div className="max-w-5xl mx-auto">
          {!showBookingDate ? (
            <>
              {/* Header */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Appointment Booking
                  </h1>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                      <Filter className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {services.map((service, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedService(index);
                      setShowError(false);
                    }}
                    className={`group relative overflow-hidden transition-all duration-500 rounded-xl p-4 cursor-pointer select-none hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:-translate-y-1 ${
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
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <button className="w-8 h-8 bg-[#d4b13e] hover:bg-[#9A7209] rounded-full flex items-center justify-center transition-colors ml-auto">
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
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Error Message */}
              {showError && (
                <div className="mb-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-3 rounded-lg shadow-md flex items-center gap-2 animate-pulse">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="font-medium text-sm">
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
                    setShowBookingDate(true);
                  }}
                  className="bg-[#B8860B] hover:bg-[#9A7209] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md text-sm"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <BookingDate onClose={onClose} />
          )}
        </div>
      </div>
    </>
  );
};

export default Booking;
