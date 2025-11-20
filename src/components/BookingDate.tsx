import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavbarHome from "./NavbarHome";

const BookingDate = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(0); // Default to first date
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);

  // Generate dates from 1-30 with corresponding day names
  const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const dates = Array.from({ length: 30 }, (_, i) => ({
    day: days[i % 7], // Cycle through days starting from Sunday
    date: i + 1,
  }));

  const times = ["12:30", "12:30", "12:30", "12:30", "12:30", "12:30"];

  return (
    <>
      <NavbarHome />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl w-full ">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Appointment Booking
            </h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Date Selection */}
          <div className="rounded-lg p-6 mb-6">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="inline-flex gap-2">
                {dates.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(index)}
                    className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition-all w-16 shrink-0 ${
                      selectedDate === index
                        ? "bg-[#d4af37] text-white border-2 border-gray-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span className="text-xs font-medium mb-1">{item.day}</span>
                    <span className="text-xl font-semibold">{item.date}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Selection */}
          <div className=" rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Time
            </h2>
            <div className="grid grid-cols-6 gap-3">
              {times.map((time, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedTime(index);
                    setShowError(false);
                  }}
                  className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === index
                      ? "bg-[#d4af37] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {showError && (
            <div className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-pulse">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="font-medium text-lg">
                Please select both date and time first
              </p>
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                if (selectedTime === null) {
                  setShowError(true);
                  return;
                }
                navigate("/bookingForm");
              }}
              className="bg-[#d4af37] hover:bg-[#b8921f] text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md flex items-center gap-2"
            >
              <span>Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
    </>
  );
};

export default BookingDate;
