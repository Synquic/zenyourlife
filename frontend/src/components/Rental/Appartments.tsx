import { useState, useEffect } from "react";
import apat1 from "../../assets/Apat1.png";
import apat2 from "../../assets/Apat2.png";
import blueArrow from "../../assets/bluearrow.png";
import { useTranslation } from "react-i18next";

import { API_BASE_URL } from '../../config/api';

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
}

const Card = ({ property, t }: CardProps) => {
  // Get image source - prefer imageUrl, fallback to mapped image
  const getImageSrc = () => {
    if (property.imageUrl) return property.imageUrl;
    if (property.image && imageMap[property.image]) return imageMap[property.image];
    return apat1; // Default fallback
  };

  return (
    <div className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
      {/* LEFT — Image */}
      <div className="w-full md:w-1/3">
        <img
          src={getImageSrc()}
          alt={property.name}
          className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg sm:rounded-xl"
        />
      </div>

      {/* MIDDLE — Text & Icons */}
      <div className="flex flex-col justify-between w-full md:w-1/3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">{property.name}</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            {property.description}
          </p>
        </div>

        {/* Icons Row */}
        <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-gray-700 text-sm">
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
          <p className="text-blue-600 font-medium text-xs sm:text-sm mt-3 sm:mt-4 cursor-pointer">
            {t('rental.apartments.meet_host')} →
          </p>
        )}
      </div>

      {/* RIGHT — Price + Rules */}
      <div className="w-full md:w-1/3 flex flex-col justify-between">
        <div className="flex items-end gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">
            {property.currency}{property.price}
          </h2>
          <span className="text-gray-500 text-xs sm:text-sm">{property.priceUnit}</span>
        </div>

        {property.cleanliness && property.cleanliness.title && (
          <div className="mt-3 sm:mt-4">
            <h3 className="font-semibold text-sm sm:text-base">{property.cleanliness.title}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              {property.cleanliness.description}
            </p>
          </div>
        )}

        {property.amenities && property.amenities.length > 0 && (
          <div className="mt-3 sm:mt-4">
            <h3 className="font-semibold text-sm sm:text-base">{t('rental.apartments.amenities')}</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {property.amenities.map((amenity, index) => (
                <span key={index}>
                  {amenity}
                  {index < property.amenities.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        )}

        <button className="mt-4 sm:mt-6 flex items-center justify-center gap-2 bg-white/30 backdrop-blur-md border-2 border-blue-600 text-blue-600 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md hover:bg-white/50 transition-all w-fit font-medium text-sm">
          {t('rental.apartments.book_now')}
          <img src={blueArrow} alt="arrow" className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
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

  // Get current language for API calls (extract base language code, e.g., "de-DE" -> "de")
  const currentLang = i18n.language?.split('-')[0] || 'en';

  // Default properties (fallback)
  const defaultProperties: PropertyData[] = [
    {
      _id: '1',
      name: 'Lanzarote',
      description: 'Modern oceanfront villa with infinity pool.',
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
              <Card key={property._id} property={property} t={t} />
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
    </div>
  );
};

export default Apartment;
