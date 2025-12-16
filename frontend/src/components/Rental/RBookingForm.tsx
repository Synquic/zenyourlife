import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import RApproved from './RApproved';
import { API_BASE_URL } from "../../config/api";

interface PropertyData {
  _id: string;
  name: string;
  description: string;
  price: number;
  guests: number;
  bedrooms: number;
  parking: string;
  image: string;
}

interface DateInfo {
  fullDate: string;
  date: number;
  month: number;
  year: number;
  day: string;
  checkInTime: string;
  checkOutTime: string;
}

interface RBookingFormProps {
  onClose?: () => void;
  propertyData?: PropertyData;
  dateInfo?: DateInfo;
}

const RBookingForm: React.FC<RBookingFormProps> = ({ onClose, propertyData, dateInfo }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+32',
    phone: '',
    accountType: '',
    specialRequests: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    accountType: false
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof typeof errors] !== undefined) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      email: !formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      phone: !formData.phone.trim(),
      accountType: !formData.accountType
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(error => error);

    if (hasErrors) {
      setSubmitMessage('Please fill in all required fields correctly');
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 3000);
    }

    return !hasErrors;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitStatus('loading');
    setSubmitMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/rental`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          gender: formData.accountType,
          specialRequests: formData.specialRequests,
          message: formData.message,
          property: propertyData ? {
            propertyId: propertyData._id,
            name: propertyData.name,
            price: propertyData.price,
            guests: propertyData.guests,
            bedrooms: propertyData.bedrooms,
            parking: propertyData.parking
          } : null,
          booking: dateInfo ? {
            fullDate: dateInfo.fullDate,
            date: dateInfo.date,
            month: dateInfo.month,
            year: dateInfo.year,
            day: dateInfo.day,
            checkInTime: dateInfo.checkInTime,
            checkOutTime: dateInfo.checkOutTime
          } : null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      await response.json();
      setSubmitStatus('success');
      setShowConfirmation(true);

    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
      setSubmitMessage('Failed to submit booking. Please try again.');
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 3000);
    }
  };

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  // Show confirmation page after successful booking
  if (showConfirmation) {
    return (
      <RApproved
        onClose={onClose}
        onHome={handleHomeClick}
      />
    );
  }

  return (
    <div className="bg-white w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-2xl font-normal text-gray-900">Check Availability</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl font-light"
          >
            ×
          </button>
        )}
      </div>

      {/* Form */}
      <div className="px-4 sm:px-8 py-4 sm:py-8 max-h-[calc(95vh-100px)] sm:max-h-[calc(95vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-3 sm:space-y-4">
            {/* First Name */}
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Your First Name"
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm transition-all ${
                  errors.firstName
                    ? 'bg-red-50 border border-red-200 text-red-900 placeholder-red-400'
                    : 'bg-gray-50 border border-transparent text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:outline-none'
                }`}
              />
              <span className="absolute right-3 top-3 sm:top-3.5 text-red-500 text-xs sm:text-sm">*</span>
            </div>

            {/* Last Name */}
            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Your Last Name"
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm transition-all ${
                  errors.lastName
                    ? 'bg-red-50 border border-red-200 text-red-900 placeholder-red-400'
                    : 'bg-gray-50 border border-transparent text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:outline-none'
                }`}
              />
              <span className="absolute right-3 top-3 sm:top-3.5 text-red-500 text-xs sm:text-sm">*</span>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email Address"
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm transition-all ${
                  errors.email
                    ? 'bg-red-50 border border-red-200 text-red-900 placeholder-red-400'
                    : 'bg-gray-50 border border-transparent text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:outline-none'
                }`}
              />
              <span className="absolute right-3 top-3 sm:top-3.5 text-red-500 text-xs sm:text-sm">*</span>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 font-medium">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  className="px-2 sm:px-3 py-3 sm:py-3.5 bg-gray-50 rounded-lg text-xs sm:text-sm focus:bg-white focus:border-gray-200 focus:outline-none border border-transparent flex items-center gap-2"
                  style={{ width: '115px' }}
                >
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+31">🇳🇱 +31</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+39">🇮🇹 +39</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+43">🇦🇹 +43</option>
                  <option value="+45">🇩🇰 +45</option>
                  <option value="+46">🇸🇪 +46</option>
                  <option value="+47">🇳🇴 +47</option>
                  <option value="+48">🇵🇱 +48</option>
                  <option value="+351">🇵🇹 +351</option>
                  <option value="+352">🇱🇺 +352</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="8023456789"
                  className={`flex-1 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm transition-all ${
                    errors.phone
                      ? 'bg-red-50 border border-red-200 text-red-900 placeholder-red-400'
                      : 'bg-gray-50 border border-transparent text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:outline-none'
                  }`}
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 font-medium">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm transition-all appearance-none ${
                  errors.accountType
                    ? 'bg-red-50 border border-red-200 text-red-900'
                    : 'bg-gray-50 border border-transparent text-gray-400 focus:bg-white focus:border-gray-200 focus:outline-none'
                } ${formData.accountType ? 'text-gray-900' : ''}`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239CA3AF' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                }}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3 sm:space-y-4">
            {/* Special Requests */}
            <div>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Special Requests"
                rows={4}
                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:outline-none border border-transparent resize-none transition-all sm:rows-[7]"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 font-medium">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Message"
                rows={4}
                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:outline-none border border-transparent resize-none transition-all sm:rows-[7]"
              />
            </div>
          </div>
        </div>

        {/* Error/Success Message */}
        {submitMessage && (
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg text-center text-xs sm:text-sm ${
            submitStatus === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {submitMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={handleSubmit}
            disabled={submitStatus === 'loading'}
            className={`bg-blue-500 hover:bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-xs sm:text-sm transition-all flex items-center gap-2 ${
              submitStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitStatus === 'loading' ? 'Submitting...' : 'Submit Your Form'}
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RBookingForm;
