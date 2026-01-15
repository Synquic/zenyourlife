import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ArrowRight, Sparkles, Heart, Users, CheckCircle2, X } from 'lucide-react'
import serviceF1 from '../assets/serviceF1.png'
import zenurlifemassage from '../assets/zenurlifemassage.jpeg'
import massage2zen from '../assets/massage2zen.jpeg'
import scrubzen from '../assets/scrubzen.jpeg'
import facialzen from '../assets/facialzen.jpeg'
import pmubrows from '../assets/pmubrows.jpeg'
import pmueyes from '../assets/pmueyes.jpeg'
import sportsMassagelegs from '../assets/sportsMassagelegs.jpeg'
import Footer from '../components/Footer'
import FloatingBookButton from '../components/FloatingBookButton'
import { useTranslation } from 'react-i18next'
import BookingDate from '../components/BookingDate'
import TickImage from '../assets/tick.png'
import MasterPrimaryButton from '../assets/Master Primary Button (4).png'
import { API_BASE_URL, getImageUrl } from "../config/api";

// Auto-select banner image based on service name/category keywords
const getBannerImageByServiceName = (title: string, category: string): string => {
  const lowerTitle = title.toLowerCase();
  const lowerCategory = category.toLowerCase();

  // Sports massage
  if (lowerTitle.includes('sport') || lowerTitle.includes('athletic') || lowerTitle.includes('legs') || lowerTitle.includes('full body')) {
    return sportsMassagelegs;
  }

  // Hot stone massage
  if (lowerTitle.includes('hot stone') || lowerTitle.includes('stone')) {
    return massage2zen;
  }

  // Scrub/exfoliation treatments
  if (lowerTitle.includes('scrub') || lowerTitle.includes('exfoliat') || lowerTitle.includes('peeling')) {
    return scrubzen;
  }

  // Facial treatments
  if (lowerTitle.includes('facial') || lowerTitle.includes('face') || lowerCategory.includes('facial')) {
    return facialzen;
  }

  // PMU - Eyebrows
  if (lowerTitle.includes('brow') || lowerTitle.includes('eyebrow') || (lowerCategory.includes('pmu') && lowerTitle.includes('brow'))) {
    return pmubrows;
  }

  // PMU - Eyes/Eyeliner
  if (lowerTitle.includes('eye') || lowerTitle.includes('liner') || lowerTitle.includes('lash')) {
    return pmueyes;
  }

  // PMU category default
  if (lowerCategory.includes('pmu')) {
    return pmubrows;
  }

  // Relaxation/Swedish/Classic massage
  if (lowerTitle.includes('relax') || lowerTitle.includes('swedish') || lowerTitle.includes('classic') || lowerTitle.includes('wellness')) {
    return zenurlifemassage;
  }

  // Deep tissue/Therapeutic
  if (lowerTitle.includes('deep tissue') || lowerTitle.includes('therapeutic') || lowerTitle.includes('pressure')) {
    return massage2zen;
  }

  // Default fallback based on category
  if (lowerCategory.includes('massage')) {
    return zenurlifemassage;
  }

  // Ultimate fallback
  return serviceF1;
};

interface ContentSection {
  title: string;
  description?: string;
  content?: string;
}

interface BenefitItem {
  title?: string;
  description: string;
  icon?: string;
}

interface TargetAudienceItem {
  title?: string;
  description: string;
  icon?: string;
}

interface ServiceImage {
  url: string;
  caption?: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  image: string;
  imageUrl?: string;
  bannerImageUrl?: string;
  isActive: boolean;
  contentSections?: ContentSection[];
  benefits?: BenefitItem[];
  targetAudience?: TargetAudienceItem[];
  serviceImages?: ServiceImage[];
}

interface ServicePageContent {
  contentSections: ContentSection[];
  benefits: BenefitItem[];
  targetAudience: TargetAudienceItem[];
  benefitsTitle: string;
  targetAudienceTitle: string;
}

const ParticularService = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const stateService = (location.state as { service: Service })?.service;
  const { t, i18n } = useTranslation();

  const [service, setService] = useState<Service | null>(stateService || null);
  const [content, setContent] = useState<ServicePageContent>({
    contentSections: [],
    benefits: [],
    targetAudience: [],
    benefitsTitle: "Benefits You'll Feel",
    targetAudienceTitle: "Who It's For"
  });
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);

  // Get current language for API calls (extract base language code, e.g., "de-DE" -> "de")
  const currentLang = i18n.language?.split('-')[0] || 'en';

  // Scroll to top when component mounts or service changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isBookingModalOpen || showApprovedModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isBookingModalOpen, showApprovedModal]);

  useEffect(() => {
    const fetchServiceData = async () => {
      // Prefer URL id over state id to ensure fresh data
      const serviceId = id || stateService?._id;

      if (!serviceId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Always fetch fresh data from API to get latest updates (with translation)
        console.log('Fetching fresh service data by ID:', serviceId);
        const serviceResponse = await fetch(`${API_BASE_URL}/services/${serviceId}?lang=${currentLang}`);
        const serviceData = await serviceResponse.json();
        console.log('Fetched service data:', serviceData);

        if (serviceData.success && serviceData.data) {
          const fetchedService = serviceData.data;
          console.log('Full fetched service:', JSON.stringify(fetchedService, null, 2));
          console.log('contentSections:', fetchedService.contentSections);
          console.log('benefits:', fetchedService.benefits);
          console.log('targetAudience:', fetchedService.targetAudience);
          console.log('serviceImages:', fetchedService.serviceImages);

          setService(fetchedService);

          // Always use content from fetched service if it has any content
          const hasContentSections = fetchedService.contentSections && fetchedService.contentSections.length > 0;
          const hasBenefits = fetchedService.benefits && fetchedService.benefits.length > 0;
          const hasTargetAudience = fetchedService.targetAudience && fetchedService.targetAudience.length > 0;

          console.log('hasContentSections:', hasContentSections);
          console.log('hasBenefits:', hasBenefits);
          console.log('hasTargetAudience:', hasTargetAudience);

          // Set content from service if it has any fields
          if (hasContentSections || hasBenefits || hasTargetAudience) {
            console.log('Setting content from fetched service data');
            setContent({
              contentSections: fetchedService.contentSections || [],
              benefits: fetchedService.benefits || [],
              targetAudience: fetchedService.targetAudience || [],
              benefitsTitle: "Benefits You'll Feel",
              targetAudienceTitle: "Who It's For"
            });
            setLoading(false);
            return;
          }
        }

        // Fall back to generic service page content if no content
        const response = await fetch(`${API_BASE_URL}/service-page-content`)
        const data = await response.json();

        if (data.success) {
          setContent({
            contentSections: [],
            benefits: data.data.benefits || [],
            targetAudience: data.data.targetAudience || [],
            benefitsTitle: data.data.benefitsTitle || "Benefits You'll Feel",
            targetAudienceTitle: data.data.targetAudienceTitle || "Who It's For"
          });
        }
      } catch (error) {
        console.error('Error fetching service data:', error);
        // Use state service as fallback if API fails
        if (stateService) {
          setService(stateService);
          setContent({
            contentSections: stateService.contentSections || [],
            benefits: stateService.benefits || [],
            targetAudience: stateService.targetAudience || [],
            benefitsTitle: "Benefits You'll Feel",
            targetAudienceTitle: "Who It's For"
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentLang]);

  // Fallback if no service data
  if (!service) {
    return (
      <>

        <div className="flex items-center justify-center h-screen mt-20">
          <p className="text-gray-500">{t('common.service_not_found')}</p>
        </div>
      </>
    );
  }

  return (
   <>
   <Navbar/>
    <div className="animate-fade-in">

      {/* Hero Banner Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 mt-10">
        <div className="relative max-w-7xl mx-auto min-h-[300px] rounded-3xl overflow-hidden">
          {/* Background Image - Use bannerImageUrl if available, otherwise auto-select */}
          <img
            src={service.bannerImageUrl ? (getImageUrl(service.bannerImageUrl) || getBannerImageByServiceName(service.title, service.category)) : getBannerImageByServiceName(service.title, service.category)}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient Overlay - Left to Right (Black to Transparent) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 via-40% to-transparent"></div>

          {/* Content */}
          <div className="relative z-20 flex items-center py-10 md:py-12">
            <div className="max-w-xl px-8 md:px-12">
              {/* Heading */}
              <h1 className="text-4xl md:text-5xl font-inter text-[#d4af37] mb-4 leading-tight italic">
                {service.title}
              </h1>

              {/* Description */}
              <p className="text-white/80 text-sm mb-6 leading-relaxed max-w-[400px]">
                {service.description}
              </p>

              {/* CTA Button */}
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="inline-flex items-center gap-3 bg-transparent border border-[#d4af37] text-white px-6 py-2.5 rounded-full hover:bg-[#d4af37]/10 transition group"
              >
                <span className="text-sm">{t('services.schedule_now')}</span>
                <span className="w-6 h-6 bg-[#d4af37] rounded-full flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections - Detailed descriptions with titles */}
      {!loading && content.contentSections.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4af37]/10 text-[#d4af37] text-sm font-medium rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                {t('services.about_service')}
              </span>
              <h2 className="text-3xl md:text-4xl font-inter text-gray-900">
                {t('services.what_we_offer')}
              </h2>
            </div>

            <div className="space-y-6">
              {content.contentSections.map((section, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#d4af37]/30 transition-all duration-300"
                >
                  {/* Decorative accent */}
                  <div className="absolute top-0 left-8 w-16 h-1 bg-gradient-to-r from-[#d4af37] to-[#f5d88e] rounded-full transform -translate-y-1/2" />

                  {/* Number badge */}
                  <div className="absolute -left-3 top-8 w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                    {index + 1}
                  </div>

                  <div className="ml-4">
                    {/* Section Title */}
                    <h3 className="text-xl md:text-2xl font-inter mb-3 text-gray-900 group-hover:text-[#d4af37] transition-colors">
                      {section.title}
                    </h3>
                    {/* Section Content */}
                    <p className="text-gray-600 leading-relaxed text-base">
                      {section.content || section.description}
                    </p>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#d4af37]/20 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Images Gallery */}
      {!loading && service?.serviceImages && service.serviceImages.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white via-[#faf8f5] to-white">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4af37]/10 text-[#d4af37] text-sm font-medium rounded-full mb-4">
                <CheckCircle2 className="w-4 h-4" />
                {t('services.gallery')}
              </span>
              <h2 className="text-3xl md:text-4xl font-inter text-gray-900 mb-3">
                {t('services.gallery')}
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                {t('services.gallery_subtitle')}
              </p>
            </div>

            {/* Images Grid - Optimized for 1-4 images with enhanced styling */}
            <div className={`grid gap-6 ${
              service.serviceImages.length === 1
                ? 'grid-cols-1 max-w-4xl mx-auto'
                : service.serviceImages.length === 2
                  ? 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto'
                  : service.serviceImages.length === 3
                    ? 'grid-cols-1 md:grid-cols-3'
                    : 'grid-cols-2 md:grid-cols-4'
            }`}>
              {service.serviceImages.map((img, index) => (
                <div
                  key={index}
                  className={`relative group overflow-hidden rounded-3xl shadow-xl border-4 border-white ${
                    service.serviceImages?.length === 1 ? 'aspect-[16/9]' : 'aspect-square'
                  }`}
                >
                  <img
                    src={getImageUrl(img.url) || img.url}
                    alt={img.caption || `${service.title} image ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  {/* Elegant overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Gold frame effect on hover */}
                  <div className="absolute inset-0 border-4 border-[#d4af37]/0 group-hover:border-[#d4af37]/60 rounded-3xl transition-all duration-500" />

                  {/* Caption on hover */}
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white text-sm font-medium">{img.caption}</p>
                    </div>
                  )}

                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#d4af37] opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-tl-lg" />
                  <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#d4af37] opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-br-lg" />

                  {/* Image number badge */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#d4af37] font-semibold text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits You'll Feel Section - Show for all services */}
      {!loading && content.benefits.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4af37]/10 text-[#d4af37] text-sm font-medium rounded-full mb-4">
                <Heart className="w-4 h-4" />
                {t('services.wellness_benefits')}
              </span>
              <h2 className="text-3xl md:text-4xl font-inter text-gray-900 mb-3">
                {t('services.benefits_title')}
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                {t('services.benefits_subtitle')}
              </p>
            </div>

            {/* Benefits Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${content.benefits.length >= 5 ? 'lg:grid-cols-5' : content.benefits.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-5`}>
              {content.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#d4af37]/30 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#d4af37]/40 via-[#d4af37] to-[#d4af37]/40 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Icon container */}
                  <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37]/20 to-[#f5d88e]/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="w-3 h-3 bg-[#d4af37] rounded-full" />
                  </div>

                  {/* Benefit title if exists */}
                  {benefit.title && (
                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h4>
                  )}

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Number indicator */}
                  <div className="absolute bottom-4 right-4 text-4xl font-inter text-[#d4af37]/10 group-hover:text-[#d4af37]/20 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Who It's For Section - Show for all services */}
      {!loading && content.targetAudience.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white via-[#fdfcfa] to-white">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4af37]/10 text-[#d4af37] text-sm font-medium rounded-full mb-4">
                <Users className="w-4 h-4" />
                {t('services.perfect_for')}
              </span>
              <h2 className="text-3xl md:text-4xl font-inter text-gray-900 mb-3">
                {t('services.target_title')}
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                {t('services.target_subtitle')}
              </p>
            </div>

            {/* Target Audience Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${content.targetAudience.length >= 5 ? 'lg:grid-cols-5' : content.targetAudience.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-5`}>
              {content.targetAudience.map((audience, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden"
                >
                  {/* Card with gradient border effect */}
                  <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    {/* Gradient top border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] via-[#f5d88e] to-[#d4af37] rounded-t-2xl" />

                    {/* Check icon */}
                    <div className="w-10 h-10 bg-[#d4af37]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                      <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    {/* Audience title if exists */}
                    {audience.title && (
                      <h4 className="text-base font-semibold text-gray-900 mb-2">
                        {audience.title}
                      </h4>
                    )}

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {audience.description}
                    </p>

                    {/* Decorative corner */}
                    <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#d4af37]/5 to-transparent rounded-tl-full transform translate-x-8 translate-y-8 group-hover:from-[#d4af37]/10 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Book Your Experience Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 -mt-5">
        <div
          className="max-w-7xl mx-auto rounded-3xl p-12 text-center"
          style={{ background: 'linear-gradient(180deg, #F5D88E 0%, #FEFFCF 50%, #FFFFFF 100%)' }}
        >
          {/* Contact Badge */}
          <span className="inline-flex items-center gap-2 bg-white text-gray-700 text-sm px-5 py-2 rounded-full mb-6 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t('nav.contact_us')}
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-inter text-gray-900 mb-8">
            {t('services.book_experience')}<br />
            {service.title}
          </h2>

          {/* CTA Button */}
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-md border border-[#eac874] text-gray-700 px-6 py-2.5 rounded-full shadow-sm hover:bg-white/70 hover:shadow-md transition"
          >
            <span className="text-sm">{t('services.schedule_now')}</span>
            <span className="w-6 h-6 bg-[#d4af37] rounded-full flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </span>
          </button>
        </div>
      </section>

    </div>

    <Footer/>

    {/* Booking Modal - Opens BookingDate directly with pre-selected service */}
    {isBookingModalOpen && service && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-gray-50 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Close Button */}
          <button
            onClick={() => setIsBookingModalOpen(false)}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-2 transition z-[10000] shadow-md"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* BookingDate Component with pre-selected service */}
          <div className="relative p-4">
            <BookingDate
              onClose={() => setIsBookingModalOpen(false)}
              onSuccess={() => {
                setIsBookingModalOpen(false);
                setShowApprovedModal(true);
              }}
              selectedService={{
                _id: service._id,
                title: service.title,
                description: service.description,
                category: service.category,
                duration: service.duration,
                price: service.price
              }}
            />
          </div>
        </div>
      </div>
    )}

    {/* Approved/Success Modal */}
    {showApprovedModal && (
      <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
              {t('booking.success')}
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {t('booking.success_message')}
            </p>

            {/* Back to Home Button */}
            <button
              onClick={() => {
                setShowApprovedModal(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative bg-white/30 backdrop-blur-lg border-2 border-[#B8860B]/50 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-white/40 hover:border-[#B8860B] transition-all shadow-[0_8px_32px_0_rgba(184,134,11,0.2)] flex items-center gap-2 mx-auto overflow-hidden group"
            >
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50"></div>
              <span className="relative z-10 font-semibold">{t('booking.back_to_home')}</span>
              <img src={MasterPrimaryButton} alt="" className="h-5 w-auto relative z-10" />
            </button>
          </div>
        </div>
      </div>
    )}

    <FloatingBookButton />
   </>
  )
}

export default ParticularService
