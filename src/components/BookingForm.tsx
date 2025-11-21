import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import MasterPrimaryButton from "../assets/Master Primary Button (4).png";
import TickImage from "../assets/tick.png";

interface BookingFormProps {
  onClose?: () => void;
}

const BookingForm = ({ onClose }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "BE",
    gender: "",
    specialRequests: "",
    message: "",
  });
  const [showError, setShowError] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Only allow numbers for phoneNumber field
    if (name === "phoneNumber") {
      const numericValue = value.replace(/[^0-9+]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      setShowError(false);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setShowError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.gender
    ) {
      setShowError(true);
      return;
    }

    setShowError(false);
    console.log("Form submitted:", formData);
    // Show approved modal
    setShowApprovedModal(true);
  };

  return (
    <>
      <div className="bg-gray-50 p-0 -mt-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Appointment Booking
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                {/* First Name */}
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Your First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition"
                    />
                    <span className="absolute right-3 top-3 text-red-500">
                      *
                    </span>
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Your Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition"
                    />
                    <span className="absolute right-3 top-3 text-red-500">
                      *
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition"
                    />
                    <span className="absolute right-3 top-3 text-red-500">
                      *
                    </span>
                  </div>
                </div>

                {/* Phone Number with Country Code */}
                <div className="relative">
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition"
                    >
                      <option value="BE">🇧🇪</option>
                      <option value="US">🇺🇸</option>
                      <option value="GB">🇬🇧</option>
                      <option value="FR">🇫🇷</option>
                      <option value="DE">🇩🇪</option>
                      <option value="NL">🇳🇱</option>
                    </select>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="+32455689"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="col-span-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition"
                    />
                  </div>
                  <span className="absolute right-3 top-3 text-red-500">*</span>
                </div>

                {/* Gender Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition appearance-none"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Right Column - Special Requests and Message */}
              <div className="flex flex-col gap-4">
                {/* Special Requests */}
                <div>
                  <input
                    type="text"
                    name="specialRequests"
                    placeholder="Special Requests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition"
                  />
                </div>

                {/* Message */}
                <div className="flex-1">
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full h-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition resize-none min-h-[200px]"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {showError && (
              <div className="mt-6 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-lg shadow-md flex items-center gap-3 animate-pulse">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="font-medium">
                  Please fill in all required fields
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="relative bg-white/30 backdrop-blur-lg border-2 border-[#B8860B]/50 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-white/40 hover:border-[#B8860B] transition-all shadow-[0_8px_32px_0_rgba(184,134,11,0.2)] flex items-center gap-2 overflow-hidden group"
              >
                {/* Glass shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50"></div>
                <span className="relative z-10">Submit Your Form</span>
                <img src={MasterPrimaryButton} alt="" className="h-5 w-auto relative z-10" />
              </button>
            </div>
          </form>
        </div>
      </div>

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
                Appointment Confirmed!
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Your appointment has been successfully booked. We've sent a
                confirmation email with all the details.
              </p>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowApprovedModal(false);
                  if (onClose) {
                    onClose();
                  }
                }}
                className="relative bg-white/30 backdrop-blur-lg border-2 border-[#B8860B]/50 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-white/40 hover:border-[#B8860B] transition-all shadow-[0_8px_32px_0_rgba(184,134,11,0.2)] flex items-center gap-2 mx-auto overflow-hidden group"
              >
                {/* Glass shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50"></div>
                <span className="relative z-10 font-semibold">Back to Home</span>
                <img src={MasterPrimaryButton} alt="" className="h-5 w-auto relative z-10" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm;
