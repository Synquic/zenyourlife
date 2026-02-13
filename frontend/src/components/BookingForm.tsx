import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, Loader2, Calendar, Clock, X, Sparkles } from "lucide-react";
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
  selectedDateStr?: string;
  selectedTime?: string;
}

const COUNTRY_CODES: Record<string, string> = {
  BE: '+32',
  IN: '+91',
  US: '+1',
  GB: '+44',
  FR: '+33',
  DE: '+49',
  NL: '+31',
}

const BookingForm = ({ onClose, onSuccess, selectedService = null, selectedDate = null, selectedDateStr = '', selectedTime = '' }: BookingFormProps) => {
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
    reminderSms: false,
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
      // Use selectedDateStr (YYYY-MM-DD Belgium calendar date) for timezone-safe storage
      const fullPhoneNumber = `${COUNTRY_CODES[formData.country] || '+32'} ${formData.phoneNumber}`;
      const appointmentData = {
        serviceId: selectedService?._id,
        serviceTitle: selectedService?.title,
        selectedDate: selectedDateStr || appointmentDate.toISOString(),
        selectedTime: selectedTime,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: fullPhoneNumber,
        country: formData.country,
        gender: formData.gender,
        specialRequests: formData.specialRequests,
        message: formData.message,
        reminderPreference: formData.reminderSms ? 'both' : 'email'
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
        phoneNumber: fullPhoneNumber,
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
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl mx-auto">
      {/* Golden header banner with appointment summary */}
      <div className="bg-gradient-to-r from-[#8b6914] via-[#d4a017] to-[#b8860b] px-6 py-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-4 pr-10">
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-bold text-lg leading-tight">{t('booking.title')}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {selectedService && (
                <span className="text-white/95 text-sm font-medium">{selectedService.title}</span>
              )}
              {selectedService && (selectedDate || selectedTime) && (
                <span className="text-white/40 text-sm">|</span>
              )}
              {selectedDate && (
                <span className="flex items-center gap-1.5 text-white/85 text-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              )}
              {selectedTime && (
                <span className="flex items-center gap-1.5 text-white/85 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="px-6 py-6 sm:px-8 sm:py-7">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('booking.first_name')} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder={t('booking.first_name')}
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] transition text-sm"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('booking.last_name')} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder={t('booking.last_name')}
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] transition text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('booking.email')} <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder={t('booking.email')}
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] transition text-sm"
              />
            </div>

            {/* Phone Number with Country Code */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('booking.phone') || 'Phone Number'} <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="px-2.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] transition text-sm w-[72px]"
                >
                  <option value="BE">BE</option>
                  <option value="IN">IN</option>
                  <option value="US">US</option>
                  <option value="GB">GB</option>
                  <option value="FR">FR</option>
                  <option value="DE">DE</option>
                  <option value="NL">NL</option>
                </select>
                <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#d4af37]/40 focus-within:border-[#d4af37] transition">
                  <span className="pl-3 text-sm text-gray-400 font-medium select-none">
                    {COUNTRY_CODES[formData.country] || '+32'}
                  </span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="flex-1 px-2 py-2.5 bg-transparent focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('booking.gender')} <span className="text-red-400">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] transition appearance-none text-sm"
              >
                <option value="">{t('booking.select_gender')}</option>
                <option value="male">{t('booking.male')}</option>
                <option value="female">{t('booking.female')}</option>
                <option value="other">{t('booking.other')}</option>
              </select>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('booking.special_requests')}
              </label>
              <input
                type="text"
                name="specialRequests"
                placeholder={t('booking.special_requests')}
                value={formData.specialRequests}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] transition text-sm"
              />
            </div>

            {/* Message - full width */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('booking.message') || 'Message'}
              </label>
              <textarea
                name="message"
                placeholder={t('booking.message_placeholder')}
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] transition resize-none text-sm"
              ></textarea>
            </div>
          </div>

          {/* Reminder + Submit row */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-5">
              <span className="text-sm font-medium text-gray-600">{t('booking.reminder') || 'Reminder'}:</span>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-4 h-4 accent-[#d4af37] opacity-70"
                />
                <span className="text-sm text-gray-600">{t('booking.reminder_email') || 'Email'}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reminderSms as boolean}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, reminderSms: e.target.checked }))
                    setShowError(false)
                  }}
                  className="w-4 h-4 accent-[#d4af37]"
                />
                <span className="text-sm text-gray-600">{t('booking.reminder_sms') || 'SMS'}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#8b6914] to-[#d4a017] text-white px-8 py-2.5 rounded-full font-semibold hover:from-[#7a5b10] hover:to-[#c49515] transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('booking.submitting') || 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <span>{t('booking.submit_form')}</span>
                  <img src={MasterPrimaryButton} alt="" className="h-5 w-auto" />
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {showError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <p className="font-medium text-sm">{t('booking.fill_required')}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
