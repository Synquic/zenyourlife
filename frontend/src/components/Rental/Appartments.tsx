import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apat1 from "../../assets/Apat1.png";
import apat2 from "../../assets/Apat2.png";
import blueArrow from "../../assets/bluearrow.png";
import { useTranslation } from "react-i18next";
import RBooking from './RBooking';

import { API_BASE_URL, getImageUrl } from '../../config/api';

// Map image names to imported images
const imageMap: { [key: string]: string } = {
  'Apat1.png': apat1,
  'Apat2.png': apat2,
};

interface PropertyData {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  priceUnit: string;
  guests: number;
  bedrooms: number;
  parking: string;
  image: string;
  imageUrl?: string;
  cleanliness: {
    title: string;
    description: string;
  };
  amenities: string[];
  hostName?: string;
  isActive: boolean;
}

interface SectionSettings {
  title: string;
  description: string;
}

interface CardProps {
  property: PropertyData;
  t: (key: string) => string;
  onBookNow: () => void;
}

const Card = ({ property, t, onBookNow }: CardProps) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get fallback image based on property.image or default
  const getFallbackImage = () => {
    if (property.image && imageMap[property.image]) return imageMap[property.image];
    return apat1;
  };

  // Get image source - prefer imageUrl from server, fallback to mapped image
  const getImageSrc = () => {
    // If server image failed to load, use fallback
    if (imageError) {
      return getFallbackImage();
    }

    const serverUrl = getImageUrl(property.imageUrl);
    if (serverUrl) return serverUrl;
    return getFallbackImage();
  };

  // Handle image load error - switch to fallback
  const handleImageError = () => {
    if (!imageError) {
      console.log(`Image failed to load for ${property.name}, using fallback`);
      setImageError(true);
    }
  };

  return (
    <div className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-8 flex flex-col lg:flex-row gap-5 sm:gap-8 items-stretch">
      {/* LEFT — Image */}
      <div className="w-full lg:w-[280px] flex-shrink-0">
        <img
          src={getImageSrc()}
          alt={property.name}
          onError={handleImageError}
          className="w-full h-48 sm:h-52 lg:h-full lg:min-h-[220px] object-cover rounded-lg sm:rounded-xl"
        />
      </div>

      {/* MIDDLE — Text & Icons */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{property.name}</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3">
            {property.description}
          </p>
        </div>

        {/* Icons Row */}
        <div className="mt-4 sm:mt-5 space-y-2.5 text-gray-700 text-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <span>👥</span> <span>{property.guests} {t('rental.apartments.guests')}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span>🛏️</span> <span>{property.bedrooms} {t('rental.apartments.bedrooms')}</span>
          </div>
          {property.parking && (
            <div className="flex items-center gap-2 sm:gap-3">
              <span>🚗</span> <span className="text-xs sm:text-sm">{property.parking}</span>
            </div>
          )}
        </div>

        {property.hostName && (
          <p className="text-blue-600 font-medium text-xs sm:text-sm mt-4 cursor-pointer">
            {t('rental.apartments.meet_host')} →
          </p>
        )}
      </div>

      {/* RIGHT — Price + Rules */}
      <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col justify-between lg:pl-4 lg:border-l lg:border-gray-200/50">
        <div>
          <div className="flex items-end gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">
              {property.currency}{property.price}
            </h2>
            <span className="text-gray-500 text-xs sm:text-sm pb-1">{property.priceUnit}</span>
          </div>

          {property.cleanliness && property.cleanliness.title && (
            <div className="mt-4 sm:mt-5">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">{property.cleanliness.title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
                {property.cleanliness.description}
              </p>
            </div>
          )}

          {property.amenities && property.amenities.length > 0 && (
            <div className="mt-4 sm:mt-5">
              <h3 className="font-semibold text-sm sm:text-base mb-2 text-gray-900">{t('rental.apartments.amenities')}</h3>
              <div className="flex flex-wrap gap-1.5">
                {(showAllAmenities ? property.amenities : property.amenities.slice(0, 4)).map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[11px]"
                  >
                    ✓ {amenity}
                  </span>
                ))}
                {property.amenities.length > 4 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="inline-flex items-center text-blue-600 text-[11px] font-medium hover:text-blue-800 cursor-pointer transition-colors"
                  >
                    {showAllAmenities ? 'Show less' : `+${property.amenities.length - 4} more`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3">
          <Link
            to={`/particular-property/${property._id}`}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition-all font-medium text-sm"
          >
            {t('rental.apartments.view_more')}
            
          </Link>
          <button
            onClick={onBookNow}
            className="flex items-center justify-center gap-2 bg-white/30 backdrop-blur-md border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-xl shadow-md hover:bg-white/50 transition-all font-medium text-sm"
          >
            {t('rental.apartments.book_now')}
            <img src={blueArrow} alt="arrow" className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Apartment = () => {
  const { t, i18n } = useTranslation();
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [sectionSettings, setSectionSettings] = useState<SectionSettings>({
    title: 'Apartments',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
  });
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isBookingModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isBookingModalOpen]);

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
  };

  // Get current language for API calls (extract base language code, e.g., "de-DE" -> "de")
  const currentLang = i18n.language?.split('-')[0] || 'en';

  // Default properties (fallback)
  const defaultProperties: PropertyData[] = [
    {
      _id: '1',
      name: 'Lanzarote',
      description: 'Modern oceanfront villa ',
      price: 350,
      currency: '€',
      priceUnit: 'per night',
      guests: 8,
      bedrooms: 4,
      parking: 'Covered Parking for 2',
      image: 'Apat2.png',
      cleanliness: {
        title: 'Cleanliness',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      },
      amenities: ['Infinity Pool', 'High-Speed WIFI', 'Free Parking'],
      isActive: true
    },
    {
      _id: '2',
      name: 'Casa Miramar',
      description: 'Modern oceanfront villa with infinity pool.',
      price: 350,
      currency: '€',
      priceUnit: 'per night',
      guests: 8,
      bedrooms: 4,
      parking: 'Covered Parking for 2',
      image: 'Apat1.png',
      cleanliness: {
        title: 'Cleanliness',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      },
      amenities: ['Infinity Pool', 'High-Speed WIFI', 'Free Parking'],
      isActive: true
    }
  ];

  // Fetch properties from backend (with translation)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch properties with language parameter
        const propertiesResponse = await fetch(`${API_BASE_URL}/properties?lang=${currentLang}`);
        const propertiesData = await propertiesResponse.json();

        if (propertiesData.success && propertiesData.data.length > 0) {
          setProperties(propertiesData.data);
        } else {
          // Use default properties if none in database
          setProperties(defaultProperties);
        }

        // Fetch section settings with language parameter
        const settingsResponse = await fetch(`${API_BASE_URL}/properties/section-settings/apartments?lang=${currentLang}`);
        const settingsData = await settingsResponse.json();

        if (settingsData.success && settingsData.data) {
          setSectionSettings({
            title: settingsData.data.title,
            description: settingsData.data.description
          });
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Use default properties on error
        setProperties(defaultProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang]);

  return (
    <div id="apartments" className="px-4 sm:px-6 py-4 sm:py-6 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Apartments Section */}
      <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8" style={{
        background: 'linear-gradient(to bottom, #B9E4FF, #EAF7FF, #FFFFFF)'
      }}>
        {/* Header Section - Dynamic */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">
            {sectionSettings.title}
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed px-2">
            {sectionSettings.description}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Cards Section - Dynamic */}
        {!loading && (
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {properties.map((property) => (
              <Card key={property._id} property={property} t={t} onBookNow={handleBookNow} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-10 sm:py-16">
            <p className="text-gray-500 text-sm">{t('rental.apartments.no_properties')}</p>
          </div>
        )}
      </div>

      {/* RBooking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[1100px] max-h-[95vh] overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white hover:bg-gray-100 rounded-full p-1.5 sm:p-2 transition z-50 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
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
    </div>
  );
};

export default Apartment;
