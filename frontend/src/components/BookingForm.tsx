import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, Loader2 } from "lucide-react";
import MasterPrimaryButton from "../assets/Master Primary Button (4).png";
import { API_BASE_URL } from "../config/api";

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  price: number;
}

interface BookingFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
  selectedService?: Service | null;
  selectedDate?: Date | null;
  selectedTime?: string;
}

const BookingForm = ({ onClose, onSuccess, selectedService = null, selectedDate = null, selectedTime = '' }: BookingFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "BE",
    gender: "",
    specialRequests: "",
    message: "",
    reminderPreference: "email", // email or sms
  });
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    setIsSubmitting(true);

    try {
      // Use the selected date directly (passed from BookingDate component)
      const appointmentDate = selectedDate ? new Date(selectedDate) : new Date();

      // Prepare appointment data
      const appointmentData = {
        serviceId: selectedService?._id,
        serviceTitle: selectedService?.title,
        selectedDate: appointmentDate.toISOString(),
        selectedTime: selectedTime,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        country: formData.country,
        gender: formData.gender,
        specialRequests: formData.specialRequests,
        message: formData.message,
        reminderPreference: formData.reminderPreference
      };

      // Log complete booking information
      console.log('═══════════════════════════════════════════════════════');
      console.log('STEP 3: FORM SUBMISSION - COMPLETE BOOKING INFORMATION');
      console.log('═══════════════════════════════════════════════════════');
      console.log('\n📋 SERVICE DETAILS:');
      console.log({
        serviceId: selectedService?._id,
        serviceName: selectedService?.title,
        category: selectedService?.category,
        duration: `${selectedService?.duration} minutes`,
        price: `€${selectedService?.price}`,
        description: selectedService?.description
      });

      console.log('\n📅 APPOINTMENT SCHEDULE:');
      console.log({
        date: appointmentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: selectedTime,
        isoDateTime: appointmentDate.toISOString()
      });

      console.log('\n👤 CUSTOMER INFORMATION:');
      console.log({
        fullName: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        country: formData.country,
        gender: formData.gender
      });

      console.log('\n💬 ADDITIONAL DETAILS:');
      console.log({
        specialRequests: formData.specialRequests || 'None',
        message: formData.message || 'None'
      });

      console.log('\n📤 COMPLETE PAYLOAD BEING SENT TO API:');
      console.log(JSON.stringify(appointmentData, null, 2));
      console.log('═══════════════════════════════════════════════════════\n');

      // Submit to Enrollment API
      const response = await fetch(`${API_BASE_URL}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (data.success) {
        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ ENROLLMENT CREATED SUCCESSFULLY');
        console.log('═══════════════════════════════════════════════════════');
        console.log('Response from Server:', data.data);
        console.log('Enrollment ID:', data.data.enrollmentId);
        console.log('Database ID:', data.data._id);
        console.log('Full Name:', data.data.fullName);
        console.log('Service:', data.data.serviceTitle);
        console.log('Status:', data.data.status);
        console.log('Created At:', new Date(data.data.createdAt).toLocaleString());
        console.log('═══════════════════════════════════════════════════════\n');

        // Trigger success callback to show approved modal in parent
        if (onSuccess) {
          onSuccess();
        }

        // Close the BookingForm modal
        if (onClose) {
          onClose();
        }
      } else {
        console.error('═══════════════════════════════════════════════════════');
        console.error('❌ FAILED TO CREATE ENROLLMENT');
        console.error('═══════════════════════════════════════════════════════');
        console.error("Error Message:", data.message);
        console.error('═══════════════════════════════════════════════════════\n');
        alert("Failed to book appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-gray-50 p-0 -mt-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t('booking.title')}
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
                      placeholder={t('booking.first_name')}
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
                      placeholder={t('booking.last_name')}
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
                      placeholder={t('booking.email')}
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
                    {t('booking.gender')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition appearance-none"
                  >
                    <option value="">{t('booking.select_gender')}</option>
                    <option value="male">{t('booking.male')}</option>
                    <option value="female">{t('booking.female')}</option>
                    <option value="other">{t('booking.other')}</option>
                  </select>
                </div>

                {/* Reminder */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.reminder') || 'Reminder'}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="reminderPreference"
                        value="email"
                        checked={formData.reminderPreference === "email"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#d4af37] border-gray-300 focus:ring-[#d4af37] accent-[#d4af37]"
                      />
                      <span className="text-sm text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="reminderPreference"
                        value="sms"
                        checked={formData.reminderPreference === "sms"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#d4af37] border-gray-300 focus:ring-[#d4af37] accent-[#d4af37]"
                      />
                      <span className="text-sm text-gray-700">SMS</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Special Requests and Message */}
              <div className="flex flex-col gap-4">
                {/* Special Requests */}
                <div>
                  <input
                    type="text"
                    name="specialRequests"
                    placeholder={t('booking.special_requests')}
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition"
                  />
                </div>

                {/* Message */}
                <div className="flex-1">
                  <textarea
                    name="message"
                    placeholder={t('booking.message_placeholder')}
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
                  {t('booking.fill_required')}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative bg-white/30 backdrop-blur-lg border-2 border-[#B8860B]/50 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-white/40 hover:border-[#B8860B] transition-all shadow-[0_8px_32px_0_rgba(184,134,11,0.2)] flex items-center gap-2 overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {/* Glass shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50"></div>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                    <span className="relative z-10">{t('booking.submitting') || 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">{t('booking.submit_form')}</span>
                    <img src={MasterPrimaryButton} alt="" className="h-5 w-auto relative z-10" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingForm;
