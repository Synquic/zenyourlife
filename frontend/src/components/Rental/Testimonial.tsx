import { useState, useEffect } from "react";
import profile1 from "../../assets/profile1.png";
import profile2 from "../../assets/profile2.png";
import profile3 from "../../assets/profile3.png";
import profile4 from "../../assets/profile4.png";
import { useTranslation } from "react-i18next";

import { API_BASE_URL } from '../../config/api';

interface TestimonialData {
  _id: string;
  name: string;
  role: string;
  text: string;
  photo: string;
  photoUrl?: string;
  rating: number;
  isActive: boolean;
}

interface TestimonialProps {
  propertyId?: string;
  propertyName?: string;
}

type TabType = 'villa' | 'casa';

// Photo mapping for local assets
const photoMap: { [key: string]: string } = {
  "profile1.png": profile1,
  "profile2.png": profile2,
  "profile3.png": profile3,
  "profile4.png": profile4,
};

// Default testimonials for fallback
const defaultTestimonials = [
  {
    _id: "1",
    name: "Dave Nash",
    role: "@once",
    text: "After exploring the platform for a few months, I finally took the plunge. Wow, it's a game changer! Just give it a shot! You won't regret it!",
    photo: "profile1.png",
    rating: 5,
    isActive: true,
  },
  {
    _id: "2",
    name: "Sebas",
    role: "@sebasbedoya",
    text: "Once you start using this service, there's no going back. It has completely transformed my experience. The properties are amazing!",
    photo: "profile2.png",
    rating: 5,
    isActive: true,
  },
  {
    _id: "3",
    name: "Dylan Pearson",
    role: "@dylanbusiness",
    text: "The Tesla of rental services. A brief stay at their property was absolutely phenomenal. Just imagine what it can do for your vacation!",
    photo: "profile1.png",
    rating: 5,
    isActive: true,
  },
  {
    _id: "4",
    name: "Piero Madu",
    role: "@pieromadu",
    text: "This has revolutionized my vacation planning. Utilizing their services is essential for a perfect getaway experience!",
    photo: "profile3.png",  
    rating: 5,
    isActive: true,
  },
];

const Testimonial = ({ propertyId, propertyName }: TestimonialProps = {}) => {
  const { t, i18n } = useTranslation();
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(defaultTestimonials);
  const [activeTab, setActiveTab] = useState<TabType>('villa');

  // Check if we're on a specific property page (propertyName is passed)
  const isPropertyPage = !!propertyName;

  // Get current language for API calls (extract base language code, e.g., "de-DE" -> "de")
  const currentLang = i18n.language?.split('-')[0] || 'en';

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Build query params
        const params = new URLSearchParams();
        params.append('lang', currentLang);

        // If on a specific property page, use that property's name
        // Otherwise use tab-based filtering
        if (isPropertyPage && propertyName) {
          params.append('propertyName', propertyName);
        } else if (activeTab === 'villa') {
          params.append('propertyName', 'Villa Zen Your Life');
        } else if (activeTab === 'casa') {
          params.append('propertyName', 'Casa Artevista');
        }

        const response = await fetch(`${API_BASE_URL}/testimonials?${params.toString()}`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setTestimonials(data.data);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // Keep default testimonials on error
      }
    };

    fetchTestimonials();
  }, [currentLang, propertyId, propertyName, activeTab, isPropertyPage]);

  const getPhotoSrc = (testimonial: TestimonialData) => {
    if (testimonial.photoUrl) return testimonial.photoUrl;
    return photoMap[testimonial.photo] || profile1;
  };

  const baseCard =
    "group relative overflow-hidden transition-all duration-500 rounded-2xl p-6 cursor-pointer select-none " +
    "shadow-[0_8px_25px_rgba(0,0,0,0.25)] bg-[#f4f4f4] text-gray-900 " +
    "hover:scale-[1.04] hover:shadow-[0_15px_35px_rgba(0,0,0,0.35)] " +
    "hover:[transform:rotateX(-5deg)_rotateY(-10deg)_rotateZ(2deg)] " +
    "h-auto min-h-[200px]";

  const hoverGradient =
    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-900 " +
    "bg-gradient-to-b from-[#6EA8FF29] via-[#73B3FF] via-[#4F82BE] to-[#1F3A59]";

  const glossLayer =
    "absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-40 pointer-events-none";

  const contentWrapper = "relative z-10";

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white font-inter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-inter text-gray-900 leading-tight max-w-full sm:max-w-[600px]">
            {t('rental.testimonial.title')}
          </h2>
        </div>

        {/* Property Filter Tabs - Only show when NOT on a specific property page */}
        {!isPropertyPage && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('villa')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'villa'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Villa Zen Your Life
            </button>
            <button
              onClick={() => setActiveTab('casa')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'casa'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Casa Artevista
            </button>
          </div>
        )}

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial._id || index} className={baseCard}>
              <div className={hoverGradient}></div>
              <div className={glossLayer}></div>

              <div className={contentWrapper}>
                <div className="flex items-center mb-4">
                  <img
                    src={getPhotoSrc(testimonial)}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm opacity-80">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{testimonial.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
