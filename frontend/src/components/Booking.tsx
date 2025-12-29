import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BookingDate from "./BookingDate";
import MasterPrimaryButton from "../assets/Master Primary Button (4).png";
import TickImage from "../assets/tick.png";
import { API_BASE_URL } from "../config/api";

interface BookingProps {
  onClose?: () => void;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  price: number;
}

const Booking = ({ onClose }: BookingProps) => {
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedServiceData, setSelectedServiceData] = useState<Service | null>(null);
  const [showBookingDate, setShowBookingDate] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services`)

        console.log("respon =" ,response);
        const data = await response.json();

        if (data.success) {
          console.log('Fetched services:', data.data);
          setServices(data.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to hardcoded services if API fails
        setServices([
          {
            _id: '1',
            title: "Relaxing",
            description: "A gentle, soothing massage designed to ease tension and promote deep relaxation.",
            category: 'massage',
            duration: 60,
            price: 65
          },
          {
            _id: '2',
            title: "Signature hot stone",
            description: "Heated stones are placed on key points to melt away stress and muscle stiffness.",
            category: 'massage',
            duration: 90,
            price: 95
          },
          {
            _id: '3',
            title: "Permanent Make-Up (PMU)",
            description: "Semi-permanent cosmetic tattooing for brows, lips, or eyeliner—wake up ready.",
            category: 'pmu',
            duration: 120,
            price: 250
          },
          {
            _id: '4',
            title: "Healing reflexology",
            description: "Pressure applied to specific points on the feet to support overall wellness.",
            category: 'therapy',
            duration: 45,
            price: 55
          },
          {
            _id: '5',
            title: "Facial Care",
            description: "Customized skincare treatments to cleanse, hydrate, and rejuvenate your complexion.",
            category: 'facial',
            duration: 60,
            price: 75
          },
          {
            _id: '6',
            title: "Sports Massage",
            description: "Targeted therapy to relieve muscle soreness and improve athletic performance.",
            category: 'massage',
            duration: 60,
            price: 70
          },
          {
            _id: '7',
            title: "Back and Neck",
            description: "Focused relief for tension and stiffness in the upper body and spine.",
            category: 'massage',
            duration: 45,
            price: 50
          },
          {
            _id: '8',
            title: "Hot Stone Therapy",
            description: "Smooth, heated stones glide over muscles to release deep-seated tension.",
            category: 'massage',
            duration: 75,
            price: 85
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      {!showApprovedModal && (
        <div className="bg-gray-50 py-6 px-3 sm:px-4 lg:px-6 min-h-[500px]">
          <div className="max-w-5xl mx-auto">
            {!showBookingDate ? (
            <>
              {/* Header */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  {t('booking.title')}
                </h1>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8860B]"></div>
                </div>
              ) : (
                <>
                  {/* Service Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedService(index);
                          setSelectedServiceData(service);

                          // Log selected service
                          console.log('═══════════════════════════════════════════════════════');
                          console.log('STEP 1: SERVICE SELECTION');
                          console.log('═══════════════════════════════════════════════════════');
                          console.log('Selected Service:', {
                            id: service._id,
                            title: service.title,
                            description: service.description,
                            category: service.category,
                            duration: `${service.duration} minutes`,
                            price: `€${service.price}`
                          });
                          console.log('═══════════════════════════════════════════════════════\n');

                          // Auto-proceed to next step
                          setShowBookingDate(true);
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
                          <p className="text-xs text-gray-600 leading-relaxed mb-3">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-[#B8860B]">€{service.price}</span>
                              <span className="text-xs text-gray-500">/ {service.duration} min</span>
                            </div>
                            <button className="w-8 h-8 bg-[#d4b13e] hover:bg-[#9A7209] rounded-full flex items-center justify-center transition-colors">
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
                      </div>
                    ))}
                  </div>

                </>
              )}
            </>
          ) : (
            <BookingDate
              onClose={() => setShowBookingDate(false)}
              onSuccess={() => {
                setShowBookingDate(false);
                setShowApprovedModal(true);
              }}
              selectedService={selectedServiceData}
            />
          )}
        </div>
      </div>
      )}

      {/* Approved Modal */}
      {showApprovedModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
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
                  if (onClose) {
                    onClose();
                  }
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
  );
};

export default Booking;
