import { useState, useEffect } from 'react';
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Shield,
  X,
  ChevronDown,
  FileText,
  Cookie,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import bluearrow from '../../assets/bluearrow.png';
import RBooking from './RBooking';
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from '../../config/api';

// Legal page data interface
interface LegalSection {
  key: string;
  title: string;
  content: string;
}

interface LegalPageData {
  pageTitle: string;
  lastUpdated: string;
  introduction?: string;
  sections: LegalSection[];
}

interface FooterProps {
  onContactClick?: () => void;
}

// Privacy Accordion Item Component
interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem = ({ title, children, isOpen, onToggle }: AccordionItemProps) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
      >
        <div className="text-sm text-gray-600 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

const Footer = ({ onContactClick: _onContactClick }: FooterProps) => {
  const { t, i18n } = useTranslation();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('privacy');

  // Legal modals state
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isDpaModalOpen, setIsDpaModalOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  // Legal page data state
  const [termsData, setTermsData] = useState<LegalPageData | null>(null);
  const [dpaData, setDpaData] = useState<LegalPageData | null>(null);
  const [cookieData, setCookieData] = useState<LegalPageData | null>(null);
  const [legalLoading, setLegalLoading] = useState(false);
  const [legalOpenSection, setLegalOpenSection] = useState<string | null>(null);

  // Fetch legal page content
  const fetchLegalPage = async (pageType: string, setData: React.Dispatch<React.SetStateAction<LegalPageData | null>>) => {
    setLegalLoading(true);
    try {
      const lang = i18n.language?.substring(0, 2) || 'en';
      const response = await fetch(`${API_BASE_URL}/legal-pages/${pageType}?language=${lang}`);
      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        if (result.data.sections?.length > 0) {
          setLegalOpenSection(result.data.sections[0].key);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${pageType}:`, error);
    } finally {
      setLegalLoading(false);
    }
  };

  // Open legal modals
  const openTermsModal = () => {
    setIsTermsModalOpen(true);
    if (!termsData) fetchLegalPage('terms-and-conditions', setTermsData);
  };

  const openDpaModal = () => {
    setIsDpaModalOpen(true);
    if (!dpaData) fetchLegalPage('dpa', setDpaData);
  };

  const openCookieModal = () => {
    setIsCookieModalOpen(true);
    if (!cookieData) fetchLegalPage('cookie-policy', setCookieData);
  };

  const toggleLegalSection = (section: string) => {
    setLegalOpenSection(legalOpenSection === section ? null : section);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isBookingModalOpen || isPrivacyModalOpen || isTermsModalOpen || isDpaModalOpen || isCookieModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isBookingModalOpen, isPrivacyModalOpen, isTermsModalOpen, isDpaModalOpen, isCookieModalOpen]);

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
  };

  return (
    <>
    <footer  className="bg-gray-900 text-white min-h-screen py-16">
      {/* Booking Section */}
      <section className="mx-4 my-8 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-r from-[#4A90E2] via-[#7DB4E6] to-[#C8E6C9] rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-400/30">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 px-8 md:px-12 py-12 md:py-16 flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Left Side - Text Content */}
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-white text-sm font-medium">{t('rental.footer.contact_label')}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-medium text-white leading-tight">
                  {t('rental.footer.booking_title')}
                </h2>
              </div>

              {/* Right Side - Buttons */}
              <div className="flex-shrink-0 flex gap-4">
              
                <button onClick={handleBookNow} className="relative bg-[#8cb8ea]/20 backdrop-blur-md border-2 border-[#4A90E2] hover:bg-[#f5d76e2]/30 text-white px-8 py-3.5 rounded-full transition-all text-base font-medium flex items-center gap-3 shadow-lg cursor-pointer overflow-hidden group">
                  {/* Glass shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50"></div>
                  <span className="font-semibold text-black relative z-10">{t('rental.footer.book_now')}</span>
                  <img src={bluearrow} alt="" className="h-5 w-auto relative z-10" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-4">zenyourlife.be</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 w-62">
              This is the little note about products and this little note.
              This place like website (it's also still place like note) is
              currently under slight updates.
            </p>
            <button className="text-yellow-400 hover:text-yellow-300">
              {t('rental.footer.see_about')} →
            </button>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('rental.footer.services')}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">{t('nav.massage')}</a></li>
              <li><a href="#" className="hover:text-white">{t('nav.facial_care')}</a></li>
              <li><a href="#" className="hover:text-white">{t('nav.pmu')}</a></li>
              <li><a href="#" className="hover:text-white">{t('nav.transport')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('rental.footer.contact_us')}</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-2 mt-1" />
                <span>+32 123 456 789</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-1" />
                <span>info@zenyouths.be</span>
              </li>
              <li className="flex items-start">
                <Shield className="w-4 h-4 mr-2 mt-1" />
                <button
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  {t('rental.footer.privacy_policy')}
                </button>
              </li>
              <li className="flex items-start">
                <FileText className="w-4 h-4 mr-2 mt-1" />
                <button
                  onClick={openTermsModal}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li className="flex items-start">
                <ShieldCheck className="w-4 h-4 mr-2 mt-1" />
                <button
                  onClick={openDpaModal}
                  className="hover:text-white transition-colors text-left"
                >
                  DPA
                </button>
              </li>
              <li className="flex items-start">
                <Cookie className="w-4 h-4 mr-2 mt-1" />
                <button
                  onClick={openCookieModal}
                  className="hover:text-white transition-colors text-left"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('rental.footer.location')}</h4>
            <p className="text-gray-400 text-sm mb-4">
              <MapPin className="w-4 h-4 inline mr-2" />
              Wellness center city, Villas 3<br />© Web - contact
            </p>
            <div className="flex space-x-2 mt-4">
              <span className="text-gray-400 text-sm">{t('rental.footer.languages')}:</span>
              <button className="text-white hover:text-yellow-400">En</button>
              <button className="text-gray-400 hover:text-white">Fr</button>
              <button className="text-gray-400 hover:text-white">De</button>
              <button className="text-gray-400 hover:text-white">Nl</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="#"
              className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Youtube size={20} />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 zenyouths.be. {t('rental.footer.all_rights')}
          </p>
        </div>
      </div>
    </footer>

    {/* RBooking Modal */}
    {isBookingModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-[1100px] max-h-[95vh] overflow-hidden shadow-2xl relative">
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
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

          {/* RBooking Component */}
          <RBooking onClose={handleCloseModal} />
        </div>
      </div>
    )}

    {/* Privacy Policy Modal */}
    {isPrivacyModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Close Button */}
          <button
            onClick={() => setIsPrivacyModalOpen(false)}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-2 transition z-50 shadow-md"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Privacy Policy Content */}
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-inter text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              Last Updated: October 26, 2023
            </p>

            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Introduction</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Welcome to ZenYourLife. This document outlines our Privacy Policy, explaining how we collect, use, and protect your personal information, and the Terms of Service that govern your use of our website and services for both wellness and holiday rentals. By accessing our site, you agree to these terms.
              </p>
            </div>

            {/* Accordion Sections */}
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
              {/* Privacy Policy Section */}
              <AccordionItem
                title="Privacy Policy"
                isOpen={openSection === 'privacy'}
                onToggle={() => toggleSection('privacy')}
              >
                <p className="mb-4">
                  We are committed to protecting your privacy. This policy outlines how we handle your personal information to protect your privacy.
                </p>

                <h4 className="font-semibold text-gray-900 mb-2">Information We Collect</h4>
                <p className="mb-4">
                  We collect information you provide directly to us, such as when you create an account, book a service or rental, or contact us. This may include your name, email address, phone number, and payment information. We also collect anonymous data related to your website usage to improve our services.
                </p>

                <h4 className="font-semibold text-gray-900 mb-2">How We Use Your Information</h4>
                <p>
                  Your information is used to provide and improve our services, process transactions, communicate with you about bookings and inquiries, and for marketing purposes with your consent.
                </p>
              </AccordionItem>

              {/* Your Data Rights */}
              <AccordionItem
                title="Your Data Rights"
                isOpen={openSection === 'dataRights'}
                onToggle={() => toggleSection('dataRights')}
              >
                <p className="mb-4">
                  Under GDPR and other applicable data protection laws, you have the following rights:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>The right to access your personal data</li>
                  <li>The right to rectification of inaccurate personal data</li>
                  <li>The right to erasure of your personal data</li>
                  <li>The right to restrict processing of your personal data</li>
                  <li>The right to data portability</li>
                  <li>The right to object to processing of your personal data</li>
                </ul>
                <p className="mt-4">
                  To exercise any of these rights, please contact us at privacy@zenyourlife.be.
                </p>
              </AccordionItem>

              {/* Terms of Service */}
              <AccordionItem
                title="Terms of Service"
                isOpen={openSection === 'terms'}
                onToggle={() => toggleSection('terms')}
              >
                <h4 className="font-semibold text-gray-900 mb-2">Terms of Service</h4>
                <p className="mb-4">
                  By using our website and services, you agree to comply with and be bound by the following terms and conditions of use.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>You must be at least 18 years old to use our services</li>
                  <li>You agree to provide accurate and complete information when making bookings</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree not to use our services for any unlawful purpose</li>
                  <li>We reserve the right to modify or discontinue our services at any time</li>
                </ul>
              </AccordionItem>

              {/* Booking And Payment */}
              <AccordionItem
                title="Booking And Payment"
                isOpen={openSection === 'booking'}
                onToggle={() => toggleSection('booking')}
              >
                <h4 className="font-semibold text-gray-900 mb-2">Booking Process</h4>
                <p className="mb-4">
                  All bookings are subject to availability and confirmation. A booking is only confirmed once you receive a confirmation email from us.
                </p>

                <h4 className="font-semibold text-gray-900 mb-2">Payment Terms</h4>
                <p className="mb-4">
                  For wellness services, full payment is required at the time of booking. For holiday rentals, a 30% deposit is required to secure your booking, with the remaining balance due 14 days before your arrival date.
                </p>

                <h4 className="font-semibold text-gray-900 mb-2">Accepted Payment Methods</h4>
                <p>
                  We accept major credit cards (Visa, MasterCard, American Express), bank transfers, and PayPal.
                </p>
              </AccordionItem>

              {/* Cancellation Policy */}
              <AccordionItem
                title="Cancellation Policy"
                isOpen={openSection === 'cancellation'}
                onToggle={() => toggleSection('cancellation')}
              >
                <h4 className="font-semibold text-gray-900 mb-2">Wellness Services</h4>
                <p className="mb-4">
                  Cancellations made more than 24 hours before the appointment will receive a full refund. Cancellations made within 24 hours will be charged 50% of the service fee. No-shows will be charged the full amount.
                </p>

                <h4 className="font-semibold text-gray-900 mb-2">Holiday Rentals</h4>
                <p className="mb-4">
                  Cancellations made more than 30 days before check-in: Full refund minus processing fees. Cancellations made 14-30 days before check-in: 50% refund. Cancellations made less than 14 days before check-in: No refund.
                </p>

                <p className="text-gray-500 italic">
                  We recommend purchasing travel insurance to protect against unforeseen circumstances.
                </p>
              </AccordionItem>

              {/* Limitation of Liability */}
              <AccordionItem
                title="Limitation of Liability"
                isOpen={openSection === 'liability'}
                onToggle={() => toggleSection('liability')}
              >
                <p className="mb-4">
                  ZenYourLife shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
                </p>
                <p className="mb-4">
                  Our total liability to you for any claims arising from your use of our services shall not exceed the amount you paid for the specific service giving rise to the claim.
                </p>
                <p>
                  We are not responsible for any loss or damage to personal belongings during your stay at our rental properties or during wellness treatments. Guests are advised to secure valuables and use any provided safety deposit facilities.
                </p>
              </AccordionItem>
            </div>

            {/* Related Legal Pages */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 text-center">Related Legal Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => { setIsPrivacyModalOpen(false); openTermsModal(); }}
                  className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-[#0D9488]/10 rounded-lg flex items-center justify-center group-hover:bg-[#0D9488]/20 transition-colors">
                    <FileText className="w-5 h-5 text-[#0D9488]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Terms & Conditions</p>
                    <p className="text-xs text-gray-500">Read our terms</p>
                  </div>
                </button>

                <button
                  onClick={() => { setIsPrivacyModalOpen(false); openDpaModal(); }}
                  className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-[#0D9488]/10 rounded-lg flex items-center justify-center group-hover:bg-[#0D9488]/20 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-[#0D9488]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">DPA</p>
                    <p className="text-xs text-gray-500">Data Processing Agreement</p>
                  </div>
                </button>

                <button
                  onClick={() => { setIsPrivacyModalOpen(false); openCookieModal(); }}
                  className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-[#0D9488]/10 rounded-lg flex items-center justify-center group-hover:bg-[#0D9488]/20 transition-colors">
                    <Cookie className="w-5 h-5 text-[#0D9488]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Cookie Policy</p>
                    <p className="text-xs text-gray-500">How we use cookies</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                If you have any questions about our Privacy Policy or Terms of Service, please contact us at{' '}
                <a href="mailto:info@zenyourlife.be" className="text-[#0D9488] hover:underline">
                  info@zenyourlife.be
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Terms & Conditions Modal */}
    {isTermsModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setIsTermsModalOpen(false)}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-2 transition z-50 shadow-md"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="p-8 md:p-12">
            {legalLoading && !termsData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
              </div>
            ) : termsData ? (
              <>
                <h1 className="text-3xl md:text-4xl font-inter text-gray-900 mb-4">
                  {termsData.pageTitle}
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                  Last Updated: {termsData.lastUpdated}
                </p>

                {termsData.introduction && (
                  <div className="mb-8">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {termsData.introduction}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                  {termsData.sections.map((section) => (
                    <AccordionItem
                      key={section.key}
                      title={section.title}
                      isOpen={legalOpenSection === section.key}
                      onToggle={() => toggleLegalSection(section.key)}
                    >
                      <div className="whitespace-pre-line">{section.content}</div>
                    </AccordionItem>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-10">Failed to load content</p>
            )}
          </div>
        </div>
      </div>
    )}

    {/* DPA Modal */}
    {isDpaModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setIsDpaModalOpen(false)}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-2 transition z-50 shadow-md"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="p-8 md:p-12">
            {legalLoading && !dpaData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
              </div>
            ) : dpaData ? (
              <>
                <h1 className="text-3xl md:text-4xl font-inter text-gray-900 mb-4">
                  {dpaData.pageTitle}
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                  Last Updated: {dpaData.lastUpdated}
                </p>

                {dpaData.introduction && (
                  <div className="mb-8">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {dpaData.introduction}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                  {dpaData.sections.map((section) => (
                    <AccordionItem
                      key={section.key}
                      title={section.title}
                      isOpen={legalOpenSection === section.key}
                      onToggle={() => toggleLegalSection(section.key)}
                    >
                      <div className="whitespace-pre-line">{section.content}</div>
                    </AccordionItem>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-10">Failed to load content</p>
            )}
          </div>
        </div>
      </div>
    )}

    {/* Cookie Policy Modal */}
    {isCookieModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setIsCookieModalOpen(false)}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-2 transition z-50 shadow-md"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="p-8 md:p-12">
            {legalLoading && !cookieData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
              </div>
            ) : cookieData ? (
              <>
                <h1 className="text-3xl md:text-4xl font-inter text-gray-900 mb-4">
                  {cookieData.pageTitle}
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                  Last Updated: {cookieData.lastUpdated}
                </p>

                {cookieData.introduction && (
                  <div className="mb-8">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {cookieData.introduction}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                  {cookieData.sections.map((section) => (
                    <AccordionItem
                      key={section.key}
                      title={section.title}
                      isOpen={legalOpenSection === section.key}
                      onToggle={() => toggleLegalSection(section.key)}
                    >
                      <div className="whitespace-pre-line">{section.content}</div>
                    </AccordionItem>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-10">Failed to load content</p>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Footer;
