import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import RFooter from '../../components/Rental/RFooter'
import RNavbar from '../../components/Rental/RNavbar'

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
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
  )
}

const RPrivacy = () => {
  const [openSection, setOpenSection] = useState<string | null>('privacy')
  const { t } = useTranslation()

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <>
      <RNavbar/>
      <div className="min-h-screen bg-white pt-20">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-inter text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last Updated: October 26, 2023
          </p>

          {/* Introduction */}
          <div className="mb-12">
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
                To exercise any of these rights, please contact us at {t('company.email_privacy')}.
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

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              If you have any questions about our Privacy Policy or Terms of Service, please contact us at{' '}
              <a href={`mailto:${t('company.email')}`} className="text-[#0D9488] hover:underline">
                {t('company.email')}
              </a>
            </p>
          </div>
        </div>
      </div>
      <RFooter />
    </>
  )
}

export default RPrivacy
