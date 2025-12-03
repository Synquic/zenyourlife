import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Twitter, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import RNavbar from "./RNavbar";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface RContactProps {
  isModal?: boolean;
  onClose?: () => void;
}

const RContact = ({ isModal = false }: RContactProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+32",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // State for contact modal when used as standalone page
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Disable background scroll when modal is open (for standalone page)
  useEffect(() => {
    if (!isModal && isContactModalOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!isModal) {
      document.body.style.overflow = 'unset';
    }
    return () => {
      if (!isModal) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isContactModalOpen, isModal]);

  const handleOpenContactModal = () => {
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message: t('rental.contact.success_message'),
        });
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          countryCode: "+32",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || t('rental.contact.error_message'),
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: t('rental.contact.connection_error'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Return modal content if in modal mode - Full RContact page content
  if (isModal) {
    return (
      <>
        {/* Main Contact Section with Gradient */}
        <div
          className="pt-6 sm:pt-8 pb-12 sm:pb-16"
          style={{
            background:
              "linear-gradient(to bottom, #6EA8FF29, #F6F6F6, #F6F6F6, #F5D88E)",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Contact Badge */}
            <div className="mb-4 sm:mb-8">
              <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-600 shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {t('rental.contact.badge')}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-12 items-start">
              {/* Left Side - Heading & Social */}
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-4 sm:mb-8">
                  {t('rental.contact.heading_line1')}
                  <br />
                  {t('rental.contact.heading_line2')}
                  <br />
                  {t('rental.contact.heading_line3')}
                </h1>

                {/* Social Icons */}
                <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 mb-6 md:mb-0">
                  <a
                    href="#"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition"
                  >
                    <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition"
                  >
                    <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition"
                  >
                    <Twitter size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* First Name */}
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder={t('rental.contact.first_name')}
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-sm"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder={t('rental.contact.last_name')}
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder={t('rental.contact.email')}
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-sm"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">
                      {t('rental.contact.phone_number')}
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="px-3 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-sm"
                      >
                        <option value="+32">+32</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+33">+33</option>
                        <option value="+49">+49</option>
                        <option value="+31">+31</option>
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="0812 3456 789"
                        value={formData.phone}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-sm"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">
                      {t('rental.contact.message_label')}
                    </label>
                    <textarea
                      name="message"
                      placeholder={t('rental.contact.message_label')}
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#FFF9E6] border border-[#F5D88E] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition text-sm resize-none"
                    />
                  </div>

                  {/* Status Message */}
                  {submitStatus.type && (
                    <div
                      className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                        submitStatus.type === "success"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {submitStatus.type === "success" ? (
                        <CheckCircle size={18} />
                      ) : (
                        <AlertCircle size={18} />
                      )}
                      {submitStatus.message}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {t('rental.contact.sending')}
                      </>
                    ) : (
                      t('rental.contact.send_message')
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="bg-[#F6F6F6] py-10 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
              {/* Left Side */}
              <div className="text-center md:text-left">
                <p className="text-xs sm:text-sm text-gray-500 mb-2">{t('rental.contact.info_title')}</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900">
                  {t('rental.contact.info_heading_line1')}
                  <br />
                  {t('rental.contact.info_heading_line2')}
                </h2>
              </div>

              {/* Right Side - Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                {/* Email */}
                <div className="text-center sm:text-left">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                    {t('rental.contact.email_label')}
                  </h3>
                  <div className="w-8 h-0.5 bg-gray-900 mb-3 sm:mb-4 mx-auto sm:mx-0"></div>
                  <p className="text-sm text-gray-900 font-medium mb-1 sm:mb-2">
                    help@info.com
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {t('rental.contact.assistance_hours')}
                    <br />
                    {t('rental.contact.hours_detail')}
                  </p>
                </div>

                {/* Number */}
                <div className="text-center sm:text-left">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                    {t('rental.contact.number_label')}
                  </h3>
                  <div className="w-8 h-0.5 bg-gray-900 mb-3 sm:mb-4 mx-auto sm:mx-0"></div>
                  <p className="text-sm text-gray-900 font-medium mb-1 sm:mb-2">
                    (808) 998-34256
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {t('rental.contact.assistance_hours')}
                    <br />
                    {t('rental.contact.hours_detail')}
                  </p>
                </div>

                {/* Address */}
                <div className="text-center sm:text-left">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                    {t('rental.contact.address_label')}
                  </h3>
                  <div className="w-8 h-0.5 bg-gray-900 mb-3 sm:mb-4 mx-auto sm:mx-0"></div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    123 serenity road, 35510,
                    <br />
                    Lanzarote, Spain
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Full page version
  return (
    <>
      <RNavbar onContactClick={handleOpenContactModal} />

      {/* Main Contact Section with Gradient */}
      <div
        className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16"
        style={{
          background:
            "linear-gradient(to bottom, #6EA8FF29, #F6F6F6, #F6F6F6, #F5D88E)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Badge */}
          <div className="mb-4 sm:mb-8">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-600 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {t('rental.contact.badge')}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-12 items-start">
            {/* Left Side - Heading & Social */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-4 sm:mb-8">
                {t('rental.contact.heading_line1')}
                <br />
                {t('rental.contact.heading_line2')}
                <br />
                {t('rental.contact.heading_line3')}
              </h1>

              {/* Social Icons */}
              <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 mb-6 md:mb-0">
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition"
                >
                  <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition"
                >
                  <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition"
                >
                  <Twitter size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* First Name */}
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder={t('rental.contact.first_name')}
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-sm"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder={t('rental.contact.last_name')}
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder={t('rental.contact.email')}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-sm"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    {t('rental.contact.phone_number')}
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="px-3 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-sm"
                    >
                      <option value="+32">🇧🇪 +32</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+31">🇳🇱 +31</option>
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0812 3456 789"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    {t('rental.contact.message_label')}
                  </label>
                  <textarea
                    name="message"
                    placeholder={t('rental.contact.message_label')}
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FFF9E6] border border-[#F5D88E] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition text-sm resize-none"
                  />
                </div>

                {/* Status Message */}
                {submitStatus.type && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <CheckCircle size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    {submitStatus.message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {t('rental.contact.sending')}
                    </>
                  ) : (
                    t('rental.contact.send_message')
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="bg-[#F6F6F6] py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Left Side */}
            <div className="text-center md:text-left">
              <p className="text-xs sm:text-sm text-gray-500 mb-2">{t('rental.contact.info_title')}</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900">
                {t('rental.contact.info_heading_line1')}
                <br />
                {t('rental.contact.info_heading_line2')}
              </h2>
            </div>

            {/* Right Side - Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {/* Email */}
              <div className="text-center sm:text-left">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                  {t('rental.contact.email_label')}
                </h3>
                <div className="w-8 h-0.5 bg-gray-900 mb-3 sm:mb-4 mx-auto sm:mx-0"></div>
                <p className="text-sm text-gray-900 font-medium mb-1 sm:mb-2">
                  help@info.com
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t('rental.contact.assistance_hours')}
                  <br />
                  {t('rental.contact.hours_detail')}
                </p>
              </div>

              {/* Number */}
              <div className="text-center sm:text-left">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                  {t('rental.contact.number_label')}
                </h3>
                <div className="w-8 h-0.5 bg-gray-900 mb-3 sm:mb-4 mx-auto sm:mx-0"></div>
                <p className="text-sm text-gray-900 font-medium mb-1 sm:mb-2">
                  (808) 998-34256
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t('rental.contact.assistance_hours')}
                  <br />
                  {t('rental.contact.hours_detail')}
                </p>
              </div>

              {/* Address */}
              <div className="text-center sm:text-left">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                  {t('rental.contact.address_label')}
                </h3>
                <div className="w-8 h-0.5 bg-gray-900 mb-3 sm:mb-4 mx-auto sm:mx-0"></div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  123 serenity road, 35510,
                  <br />
                  Lanzarote, Spain
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal - Full RContact Page */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full h-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={handleCloseContactModal}
              className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-2 transition z-50 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Full RContact Content */}
            <RContact isModal={true} onClose={handleCloseContactModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default RContact;
