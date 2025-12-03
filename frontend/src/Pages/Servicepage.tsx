import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import serviceF1 from '../assets/serviceF1.png'
import lock from '../assets/lock.png'
import m1 from '../assets/m1.png'
import m2 from '../assets/m2.png'
import m3 from '../assets/m3.png'
import m4 from '../assets/m4.png'
import m5 from '../assets/m5.png'
import m6 from '../assets/m6.png'
import m7 from '../assets/m7.png'
import m8 from '../assets/m8.png'
import m9 from '../assets/m9.png'
import { ArrowRight } from 'lucide-react'
import Expert from '../components/Expert'
import Testimonial from '../components/Testimonial'
import Footer from '../components/Footer'

// Image array for cycling through service images (m1 to m9)
const serviceImages = [m1, m2, m3, m4, m5, m6, m7, m8, m9]

// Default fallback images map
const defaultImages: { [key: string]: string } = {
  'm1.png': m1, 'm2.png': m2, 'm3.png': m3, 'm4.png': m4, 'm5.png': m5,
  'm6.png': m6, 'm7.png': m7, 'm8.png': m8, 'm9.png': m9, 'serviceF1.png': serviceF1
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

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  image: string;
  imageUrl?: string;
  isActive: boolean;
  benefits?: BenefitItem[];
  targetAudience?: TargetAudienceItem[];
}

interface PageContent {
  pageId: string;
  hero: {
    title: string;
    subtitle: string;
    badgeText: string;
    buttonText: string;
    backgroundImage: string;
    backgroundImageUrl: string;
  };
  statistics: Array<{
    value: string;
    label: string;
    isHighlighted: boolean;
  }>;
  sectionHeaders: {
    services: {
      title: string;
      subtitle: string;
    };
  };
}

const Servicepage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get current language for API calls (extract base language code, e.g., "de-DE" -> "de")
  const currentLang = i18n.language?.split('-')[0] || 'en';

  // Fetch services and page content from backend (with translation)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch services and page content in parallel (with language parameter)
        const [servicesRes, pageContentRes] = await Promise.all([
          fetch(`http://localhost:5000/api/services?lang=${currentLang}`),
          fetch('http://localhost:5000/api/page-content/services')
        ]);

        const servicesData = await servicesRes.json();
        const pageContentData = await pageContentRes.json();

        if (servicesData.success) {
          setServices(servicesData.data);
        } else {
          setError('Failed to load services');
        }

        if (pageContentData.success) {
          setPageContent(pageContentData.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentLang]);

  // Get image source - prefer imageUrl, fallback to local image
  const getServiceImage = (service: Service, index: number) => {
    if (service.imageUrl) return service.imageUrl;
    if (service.image && defaultImages[service.image]) return defaultImages[service.image];
    return serviceImages[index % serviceImages.length];
  };

  // Get hero background image
  const getHeroImage = () => {
    if (pageContent?.hero?.backgroundImageUrl) return pageContent.hero.backgroundImageUrl;
    if (pageContent?.hero?.backgroundImage && defaultImages[pageContent.hero.backgroundImage]) {
      return defaultImages[pageContent.hero.backgroundImage];
    }
    return serviceF1;
  };
  return (
    <>
      <Navbar />

      {/* Hero Section - Same style as About page */}
      <section className="px-3 sm:px-6 lg:px-8 py-4 sm:py-8 mt-14 sm:mt-10">
        {/* Card Container */}
        <div className="relative max-w-7xl mx-auto h-[400px] sm:h-[500px] md:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden">
          {/* Background Image */}
          <img
            src={getHeroImage()}
            alt="Massage therapy"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient Overlay - Left to Right (Black to Transparent) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 via-60% to-black/30 sm:via-black/85 sm:via-40% sm:to-transparent"></div>

          {/* Content */}
          <div className="relative z-20 h-full flex items-center">
            <div className="max-w-2xl px-4 sm:px-8 md:px-16">
              {/* Services Badge */}
              <span className="inline-flex items-center gap-2 bg-[#d4af37] text-white text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                <img src={lock} alt="" className="w-2.5 h-2.5 sm:w-3 sm:h-3 brightness-0 invert" />
                {t('nav.services')}
              </span>

              {/* Heading */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 sm:mb-6 leading-tight drop-shadow-[0_0_20px_white]">
                {t('services.hero_title_1')}<br />{t('services.hero_title_2')}
              </h1>

              {/* Description */}
              <p className="text-white text-xs sm:text-sm md:text-base mb-5 sm:mb-8 leading-relaxed max-w-[500px]">
                {t('services.hero_description')}
              </p>

              {/* CTA Button */}
              {/* <button className="bg-gray-700/50 backdrop-blur border border-[#d4af37] text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-600/50 transition text-sm sm:text-base">
                {t('services.view_all')}
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            {(pageContent?.statistics || [
              { value: '100+', label: t('home.treatments_offered'), isHighlighted: false },
              { value: '50+', label: t('home.certified_therapists'), isHighlighted: true },
              { value: '2k+', label: t('home.satisfied_clients'), isHighlighted: false },
              { value: '300+', label: t('home.unique_wellness'), isHighlighted: false }
            ]).map((stat, index) => (
              <div
                key={index}
                className={`text-center p-4 sm:p-8 ${
                  stat.isHighlighted
                    ? 'bg-gradient-to-r from-[#8C3C06] to-[#EBB11D]'
                    : ''
                } ${index < 3 ? 'border-r' : ''} ${index < 2 ? 'border-b md:border-b-0' : ''} border-gray-200`}
              >
                <h3 className={`text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 ${stat.isHighlighted ? 'text-white' : 'text-gray-800'}`}>
                  {stat.value}
                </h3>
                <p className={`text-xs sm:text-sm ${stat.isHighlighted ? 'text-white' : 'text-gray-600'}`}>
                  {stat.label.split(' ').map((word, i) => (
                    <span key={i}>{word}<br /></span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="px-3 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12" style={{ background: 'linear-gradient(180deg, #F5D88E -80%, #FEFFCF 45%, #FFFFFF 70%)' }}>
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            {/* Services Badge */}
            <span className="inline-flex items-center gap-2 bg-[#d4af37] text-white text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
              <img src={lock} alt="" className="w-2.5 h-2.5 sm:w-3 sm:h-3 brightness-0 invert" />
              {t('nav.services')}
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-gray-900 mb-3 sm:mb-4">
              {t('home.exclusive_services')}
            </h2>

            <p className="text-gray-600 max-w-xl mx-auto text-xs sm:text-base px-2">
              {t('home.exclusive_description')}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Loading State */}
            {loading && (
              <div className="col-span-full flex items-center justify-center py-8 sm:py-12">
                <div className="text-gray-500 text-sm">{t('common.loading')}</div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="col-span-full flex items-center justify-center py-8 sm:py-12">
                <div className="text-red-500 text-sm">{error}</div>
              </div>
            )}

            {/* Dynamic Service Cards - Show only first 8 */}
            {!loading && !error && services.slice(0, 8).map((service, index) => (
              <div
                key={service._id}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/service/${service._id}`, { state: { service, imageIndex: index % 9 } })}
              >
                <div className="h-36 sm:h-48 overflow-hidden relative">
                  <img
                    src={getServiceImage(service, index)}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                  <button className="w-8 h-8 sm:w-10 sm:h-10 bg-[#d4af37] rounded-full flex items-center justify-center hover:bg-[#c49f2c] transition-colors">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Expert/>
      <Testimonial/>
      <Footer/>
    </>
  )
}

export default Servicepage
