import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import { Facebook, Instagram, Twitter, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../config/api";

const Contact = () => {
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
          message: t('contact.success_message'),
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
          message: data.message || t('contact.error_message'),
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: t('contact.connection_error'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Main Contact Section with Gradient */}
      <div
        className="min-h-screen pt-20 sm:pt-24 pb-10 sm:pb-16"
        style={{
          background:
            "linear-gradient(to bottom, #6EA8FF29, #F6F6F6, #F6F6F6, #F5D88E)",
        }}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Contact Badge */}
          <div className="mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-600 shadow-sm">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></span>
              {t('contact.badge')}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Left Side - Heading & Social */}
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6 sm:mb-8">
                {t('contact.heading_line1')}
                <br />
                {t('contact.heading_line2')}
                <br />
                {t('contact.heading_line3')}
              </h1>

              {/* Social Icons */}
              <div className="flex items-center gap-3 sm:gap-4">
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
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* First Name */}
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder={t('contact.first_name')}
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-xs sm:text-sm"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder={t('contact.last_name')}
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-xs sm:text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder={t('contact.email_address')}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-xs sm:text-sm"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 sm:mb-2">
                    {t('contact.phone_number')}
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="px-2 sm:px-3 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-xs sm:text-sm"
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
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 sm:mb-2">
                    {t('contact.message_label')}
                  </label>
                  <textarea
                    name="message"
                    placeholder={t('contact.message_label')}
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#FFF9E6] border border-[#F5D88E] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition text-xs sm:text-sm resize-none"
                  />
                </div>

                {/* Status Message */}
                {submitStatus.type && (
                  <div
                    className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                    ) : (
                      <AlertCircle size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                    )}
                    {submitStatus.message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 text-white py-2.5 sm:py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="sm:w-[18px] sm:h-[18px] animate-spin" />
                      {t('contact.sending')}
                    </>
                  ) : (
                    t('contact.send')
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="bg-[#F6F6F6] py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Left Side */}
            <div className="text-center md:text-left">
              <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">{t('contact.info_title')}</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900">
                {t('contact.info_heading_line1')}
                <br />
                {t('contact.info_heading_line2')}
              </h2>
            </div>

            {/* Right Side - Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {/* Email */}
              <div className="text-center sm:text-left">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                  {t('contact.email_label')}
                </h3>
                <div className="w-8 h-0.5 bg-gray-900 mb-3 sm:mb-4 mx-auto sm:mx-0"></div>
                <a href="mailto:info@zenyourlife.be" className="text-xs sm:text-sm text-gray-900 font-medium mb-1.5 sm:mb-2 hover:text-[#d4af37] transition-colors">
                  info@zenyourlife.be
                </a>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed mt-2">
                  BTW: BE0899912649
                </p>
              </div>

              {/* Number */}
              <div className="text-center sm:text-left">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                  {t('contact.number_label')}
                </h3>
                <div className="w-8 h-0.5 bg-gray-900 mb-3 sm:mb-4 mx-auto sm:mx-0"></div>
                <a href="tel:+32476667115" className="text-xs sm:text-sm text-gray-900 font-medium mb-1.5 sm:mb-2 hover:text-[#d4af37] transition-colors">
                  0476 66 71 15
                </a>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed mt-2">
                  {t('contact.assistance_hours')}
                  <br />
                  {t('contact.hours_detail')}
                </p>
              </div>

              {/* Address */}
              <div className="text-center sm:text-left">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                  {t('contact.address')}
                </h3>
                <div className="w-8 h-0.5 bg-gray-900 mb-3 sm:mb-4 mx-auto sm:mx-0"></div>
                <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
                  Schapenbaan 45
                  <br />
                  1731 Relegem
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
