import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MasterPrimaryButton from "../assets/Master Primary Button (4).png";
import NavbarHome from "./NavbarHome";

const BookingForm = () => {
  const navigate = useNavigate();
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
    // Navigate to approved page
    navigate("/approved");
  };

  return (
    <>
      <NavbarHome />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Appointment Booking
            </h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Form */}
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
                    <span className="absolute right-3 top-3 text-red-500 text-xl">
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
                    <span className="absolute right-3 top-3 text-red-500 text-xl">
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
                    <span className="absolute right-3 top-3 text-red-500 text-xl">
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
                  <span className="absolute right-3 top-3 text-red-500 text-xl">
                    *
                  </span>
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
                {/* Special Requests - aligns with First Name height */}
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

                {/* Message - spans from Last Name to Gender */}
                <div className="flex-1">
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full h-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {showError && (
              <div className="mt-6 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-pulse">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="font-medium text-lg">
                  Please fill in all required fields
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-[#d4af37]/20 backdrop-blur-md border-2 border-[#d4af37] hover:bg-[#d4af37]/30 text-gray-900 px-8 py-3.5 rounded-full font-medium transition-all shadow-lg flex items-center gap-3"
              >
                <span className="font-semibold">Submit Your Form</span>
                <img src={MasterPrimaryButton} alt="" className="h-5 w-auto" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingForm;
