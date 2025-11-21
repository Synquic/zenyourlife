import { useState } from "react";
import { X, AlertCircle, Filter } from "lucide-react";
import BookingForm from "./BookingForm";

interface BookingDateProps {
  onClose?: () => void;
}

const BookingDate = ({ onClose }: BookingDateProps) => {
  const [selectedDate, setSelectedDate] = useState(0); // Default to first date
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);
  const [showBookingFormModal, setShowBookingFormModal] = useState(false);

  // Generate dates from 1-30 with corresponding day names
  const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const dates = Array.from({ length: 30 }, (_, i) => ({
    day: days[i % 7], // Cycle through days starting from Sunday
    date: i + 1,
  }));

  const times = ["12:30", "1:30", "2:30", "3:30", "4:30", "5:30"];

  return (
    <>
      <div className="bg-gray-50 py-3 px-2 sm:px-4 lg:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
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

          {/* Header */}


          {/* Date Selection */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Select Date
            </h2>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="inline-flex gap-2">
                {dates.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(index)}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all w-14 shrink-0 ${
                      selectedDate === index
                        ? "bg-gradient-to-br from-[#f8e7b5] via-[#d8a93d] to-[#6b4b09] text-white border-2 border-gray-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span className="text-xs font-medium mb-1">{item.day}</span>
                    <span className="text-lg font-semibold">{item.date}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Select Time
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {times.map((time, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedTime(index);
                    setShowError(false);
                  }}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === index
                      ? "bg-gradient-to-br from-[#f8e7b5] via-[#d8a93d] to-[#6b4b09] text-white border-2 border-gray-800"
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
            <div className="mb-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-3 rounded-lg shadow-md flex items-center gap-2 animate-pulse">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="font-medium text-sm">
                Please select a time slot first
              </p>
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (selectedTime === null) {
                  setShowError(true);
                  return;
                }
                setShowBookingFormModal(true);
              }}
              className="bg-[#B8860B] hover:bg-[#9A7209] text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-md text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* BookingForm Modal */}
      {showBookingFormModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-50 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Close Button */}
            <button
              onClick={() => setShowBookingFormModal(false)}
              className="absolute top-6 right-6 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition z-50"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* BookingForm Component */}
            <div className="relative pt-4">
              <BookingForm onClose={onClose} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingDate;
