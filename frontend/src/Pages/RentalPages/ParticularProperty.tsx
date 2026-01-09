import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RNavbar from "../../components/Rental/RNavbar";
import RBooking from "../../components/Rental/RBooking";
import RContact from "../../components/Rental/RContact";
import blueArrow from "../../assets/bluearrow.png";
import apat1 from "../../assets/Apat1.png";
import apat2 from "../../assets/Apat2.png";
import { API_BASE_URL, getImageUrl } from "../../config/api";
import ov1 from "../../assets/ov1.png";
import ov2 from "../../assets/ov2.png";
import ov3 from "../../assets/ov3.png";
import ov4 from "../../assets/ov4.png";
import lo1 from "../../assets/lo1.png";
import lo2 from "../../assets/lo2.png";
import lo3 from "../../assets/lo3.png";
import lock2 from "../../assets/lock2.png";
import Testimonial from "../../components/Rental/Testimonial";
import RFooter from "../../components/Rental/RFooter";

// Amenity icon mapping - matches the predefined amenities in admin
const amenityIcons: { [key: string]: React.ReactNode } = {
  wifi: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  washing: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
      <circle cx="12" cy="13" r="4" strokeWidth={2} />
    </svg>
  ),
  tv: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  linens: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  safe: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  coffee: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h1a3 3 0 010 6h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zm4-3a2 2 0 114 0M8 5h4" />
    </svg>
  ),
  outdoor: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  checkin: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
  ac: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  pool: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15c2.483 0 4.345-1 6-3 1.655 2 3.517 3 6 3s4.345-1 6-3M3 20c2.483 0 4.345-1 6-3 1.655 2 3.517 3 6 3s4.345-1 6-3" />
    </svg>
  ),
  kitchen: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  parking: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h4a4 4 0 110 8H8V7zm0 0V5m0 10v2" />
    </svg>
  ),
  garden: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  gym: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h2m12 0h2M6 8v8m12-8v8M8 8h8M8 16h8" />
    </svg>
  ),
  view: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

// Amenity labels mapping
const amenityLabels: { [key: string]: string } = {
  wifi: 'High-speed Wi-Fi',
  washing: 'Washing machine',
  tv: 'Smart TV',
  linens: 'Fresh linens & towels',
  safe: 'Safe neighborhood',
  coffee: 'Coffee maker',
  outdoor: 'Outdoor seating',
  checkin: 'Self check-in',
  ac: 'Air conditioning',
  pool: 'Swimming pool',
  kitchen: 'Fully equipped kitchen',
  parking: 'Free parking',
  garden: 'Private garden',
  gym: 'Gym access',
  view: 'Ocean/Mountain view',
};
// Map image names to imported images
const imageMap: { [key: string]: string } = {
  "Apat1.png": apat1,
  "Apat2.png": apat2,
};

interface OverviewFeature {
  title: string;
  description: string;
  imageUrl: string;
}

interface LocationPlace {
  title: string;
  imageUrl: string;
}

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
  mapUrl?: string;
  image: string;
  imageUrl?: string;
  galleryImages?: string[];
  cleanliness: {
    title: string;
    description: string;
  };
  amenities: string[];
  hostName?: string;
  overview?: {
    title: string;
    description1: string;
    description2: string;
    highlights: string[];
    features: OverviewFeature[];
  };
  location?: {
    title: string;
    description: string;
    mapEmbedUrl: string;
    places: LocationPlace[];
  };
  isActive: boolean;
}

const ParticularProperty = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false);

  // Image error states for fallback handling
  const [mainImageError, setMainImageError] = useState(false);
  const [galleryImageErrors, setGalleryImageErrors] = useState<{[key: number]: boolean}>({});

  const currentLang = i18n.language?.split("-")[0] || "en";

  // Get fallback image based on property.image or default
  const getFallbackImage = (imageName?: string, index?: number) => {
    if (imageName && imageMap[imageName]) return imageMap[imageName];
    // Alternate between apat1 and apat2 for gallery images
    if (index !== undefined) return index % 2 === 0 ? apat1 : apat2;
    return apat1;
  };

  // Get image source with error handling
  const getImageSrc = (imageUrl?: string, imageName?: string, hasError?: boolean, index?: number) => {
    // If image failed to load, use fallback
    if (hasError) {
      return getFallbackImage(imageName, index);
    }
    const serverUrl = getImageUrl(imageUrl);
    if (serverUrl) return serverUrl;
    if (imageName && imageMap[imageName]) return imageMap[imageName];
    return getFallbackImage(imageName, index);
  };

  // Handle main image error
  const handleMainImageError = () => {
    if (!mainImageError) {
      console.log('Main image failed to load, using fallback');
      setMainImageError(true);
    }
  };

  // Handle gallery image error
  const handleGalleryImageError = (index: number) => {
    if (!galleryImageErrors[index]) {
      console.log(`Gallery image ${index} failed to load, using fallback`);
      setGalleryImageErrors(prev => ({ ...prev, [index]: true }));
    }
  };

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isBookingModalOpen || isContactModalOpen || isPhotoGalleryOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isBookingModalOpen, isContactModalOpen, isPhotoGalleryOpen]);

  // Reset image error states when property ID changes
  useEffect(() => {
    setMainImageError(false);
    setGalleryImageErrors({});
  }, [id]);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/properties/${id}?lang=${currentLang}`
        );
        const data = await response.json();
        if (data.success) {
          setProperty(data.data);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, currentLang]);

  if (loading) {
    return (
      <>
        <RNavbar onContactClick={() => setIsContactModalOpen(true)} />
        <div className="flex justify-center items-center h-[60vh] mt-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        {/* RContact Modal */}
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[900px] max-h-[95vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white hover:bg-gray-100 rounded-full p-1.5 sm:p-2 transition z-50 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <RContact isModal={true} onClose={() => setIsContactModalOpen(false)} />
            </div>
          </div>
        )}
      </>
    );
  }

  if (!property) {
    return (
      <>
        <RNavbar onContactClick={() => setIsContactModalOpen(true)} />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-gray-500">Property not found</p>
        </div>
        {/* RContact Modal */}
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[900px] max-h-[95vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white hover:bg-gray-100 rounded-full p-1.5 sm:p-2 transition z-50 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <RContact isModal={true} onClose={() => setIsContactModalOpen(false)} />
            </div>
          </div>
        )}
      </>
    );
  }

  // Get gallery images (main + additional) with error handling
  const mainImage = getImageSrc(property.imageUrl, property.image, mainImageError);

  // Process gallery images with fallback support
  const galleryImages = property.galleryImages && property.galleryImages.length > 0
    ? property.galleryImages.map((img: string, idx: number) => {
        if (galleryImageErrors[idx]) {
          return idx % 2 === 0 ? apat1 : apat2; // Fallback if error
        }
        return getImageUrl(img) || (idx % 2 === 0 ? apat1 : apat2);
      })
    : [apat1, apat2];

  // All photos for the gallery modal (main image + gallery images)
  const allPhotos = [mainImage, ...galleryImages];

  return (
    <>
      <RNavbar onContactClick={() => setIsContactModalOpen(true)} />

      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 pt-20 sm:pt-26 max-w-6xl mx-auto">
        {/* Image Gallery */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-8">
          {/* Main Large Image */}
          <div className="w-full lg:w-[60%] h-[280px] sm:h-[350px] lg:h-[420px]">
            <img
              src={mainImage}
              alt={property.name}
              onError={handleMainImageError}
              className="w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-lg"
            />
          </div>

          {/* Side Images */}
          <div className="w-full lg:w-[40%] flex flex-row lg:flex-col gap-3 sm:gap-4">
            <div className="w-1/2 lg:w-full h-[140px] sm:h-[165px] lg:h-[200px]">
              <img
                src={galleryImages[0] || apat1}
                alt={`${property.name} view 1`}
                onError={() => handleGalleryImageError(0)}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-md"
              />
            </div>
            <div className="w-1/2 lg:w-full h-[140px] sm:h-[165px] lg:h-[200px] relative">
              <img
                src={galleryImages[1] || apat2}
                alt={`${property.name} view 2`}
                onError={() => handleGalleryImageError(1)}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-md"
              />
              {/* View More Photos Button - overlaid on second gallery image */}
              {allPhotos.length > 2 && (
                <button
                  onClick={() => setIsPhotoGalleryOpen(true)}
                  className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg transition-all text-xs sm:text-sm font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t("rental.property.view_photos", "View all")} ({allPhotos.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 items-start">
            {/* Left Section - Title & Description */}
            <div className="lg:col-span-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {property.name}
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-4">
                {property.description}
              </p>
              
            </div>

            {/* Middle Section - Icons/Stats */}
            <div className="flex flex-row md:flex-col gap-4 md:gap-3 lg:border-l lg:border-gray-100 lg:pl-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">👥</span>
                </div>
                <span className="text-gray-700 text-xs sm:text-sm">
                  {property.guests} {t("rental.apartments.guests")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🛏️</span>
                </div>
                <span className="text-gray-700 text-xs sm:text-sm">
                  {property.bedrooms} {t("rental.apartments.bedrooms")}
                </span>
              </div>
              {property.parking && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🚗</span>
                  </div>
                  <span className="text-gray-700 text-xs sm:text-sm">
                    {property.parking}
                  </span>
                </div>
              )}
            </div>

            {/* Third Section - Cleanliness & Amenities */}
            <div className="lg:border-l lg:border-gray-100 lg:pl-4">
              {/* Cleanliness */}
              {property.cleanliness && property.cleanliness.title && (
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">
                    {property.cleanliness.title}
                  </h3>
                  <p className="text-gray-500 text-[11px] sm:text-xs leading-relaxed line-clamp-2">
                    {property.cleanliness.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">
                    {t("rental.apartments.amenities")}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(showAllAmenities
                      ? property.amenities
                      : property.amenities.slice(0, 3)
                    ).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[11px]"
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <button
                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="inline-flex items-center text-blue-600 text-[11px] font-medium hover:text-blue-800 cursor-pointer transition-colors"
                      >
                        {showAllAmenities
                          ? "Show less"
                          : `+${property.amenities.length - 3} more`}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Section - Price and Book Button */}
            <div className="flex flex-col items-end justify-between h-full lg:border-l lg:border-gray-100 lg:pl-4">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {property.currency}
                  {property.price}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  {property.priceUnit}
                </span>
              </div>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition-all font-medium text-xs sm:text-sm"
              >
                {t("rental.apartments.book_now")}
               
              </button>
            </div>
          </div>
        </div>

        {/* overview */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 mt-10 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT */}
            <div>
              <div className="flex items-center gap-2 text-blue-500 text-sm mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{t("rental.property_overview.label")}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {property?.overview?.title || t("rental.property_overview.title")}
              </h2>

              <p className="text-gray-800 text-sm mt-4 leading-relaxed">
                {property?.overview?.description1 || t("rental.property_overview.description1")}
              </p>

              <p className="text-gray-800 text-sm mt-4 leading-relaxed">
                {property?.overview?.description2 || t("rental.property_overview.description2")}
              </p>

              <p className="text-gray-800 text-sm mt-4 leading-relaxed font-bold">
                {t("rental.property_overview.highlights")}
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 text-sm leading-relaxed space-y-1">
                {property?.overview?.highlights && property.overview.highlights.length > 0 ? (
                  property.overview.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))
                ) : (
                  <>
                    <li>{t("rental.property_overview.highlight1")}</li>
                    <li>{t("rental.property_overview.highlight2")}</li>
                    <li>{t("rental.property_overview.highlight3")}</li>
                    <li>{t("rental.property_overview.highlight4")}</li>
                    <li>{t("rental.property_overview.highlight5")}</li>
                    <li>{t("rental.property_overview.highlight6")}</li>
                    <li>{t("rental.property_overview.highlight7")}</li>
                    <li>{t("rental.property_overview.highlight8")}</li>
                  </>
                )}
              </ul>
            </div>

            {/* RIGHT - Cards Grid */}
            <div>
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {property?.overview?.features && property.overview.features.length > 0 ? (
                  property.overview.features.map((feature, idx) => {
                    // Default images for fallback
                    const defaultImages = [ov1, ov2, ov3, ov4];
                    const fallbackImage = defaultImages[idx % defaultImages.length];

                    // Use uploaded image if available, otherwise use fallback
                    const imageUrl = feature.imageUrl ? getImageUrl(feature.imageUrl) : fallbackImage;

                    return (
                      <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="p-3 sm:p-4">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                            {feature.title}
                          </h3>
                          <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3">
                            {feature.description}
                          </p>
                        </div>
                        <div className="relative h-36 sm:h-48 lg:h-52 overflow-hidden">
                          <img
                            src={imageUrl || fallbackImage}
                            alt={feature.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-0 left-0 right-0 h-16 sm:h-24 z-10 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    {/* Default Card 1 - Private terrace */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                          {t("rental.property_overview.private_terrace")}
                        </h3>
                        <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {t("rental.property_overview.private_terrace_desc")}
                        </p>
                      </div>
                      <div className="relative h-36 sm:h-48 lg:h-52 overflow-hidden">
                        <img src={ov1} alt={t("rental.property_overview.private_terrace")} className="w-full h-full object-cover" />
                        <div className="absolute top-0 left-0 right-0 h-16 sm:h-24 z-10 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                      </div>
                    </div>
                    {/* Default Card 2 - Airy bedroom */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                          {t("rental.property_overview.airy_bedroom")}
                        </h3>
                        <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {t("rental.property_overview.airy_bedroom_desc")}
                        </p>
                      </div>
                      <div className="relative h-36 sm:h-48 lg:h-52 overflow-hidden">
                        <img src={ov2} alt={t("rental.property_overview.airy_bedroom")} className="w-full h-full object-cover" />
                        <div className="absolute top-0 left-0 right-0 h-16 sm:h-24 z-10 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                      </div>
                    </div>
                    {/* Default Card 3 - Living room */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                          {t("rental.property_overview.living_room")}
                        </h3>
                        <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {t("rental.property_overview.living_room_desc")}
                        </p>
                      </div>
                      <div className="relative h-36 sm:h-48 lg:h-52 overflow-hidden">
                        <img src={ov3} alt={t("rental.property_overview.living_room")} className="w-full h-full object-cover" />
                        <div className="absolute top-0 left-0 right-0 h-16 sm:h-24 z-10 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                      </div>
                    </div>
                    {/* Default Card 4 - Kitchen */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                          {t("rental.property_overview.kitchen")}
                        </h3>
                        <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {t("rental.property_overview.kitchen_desc")}
                        </p>
                      </div>
                      <div className="relative h-36 sm:h-48 lg:h-52 overflow-hidden">
                        <img src={ov4} alt={t("rental.property_overview.kitchen")} className="w-full h-full object-cover" />
                        <div className="absolute top-0 left-0 right-0 h-16 sm:h-24 z-10 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Amenities Grid Section - Dynamic */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-8 mt-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {property.amenities.map((amenityId, index) => {
                // Check if it's a predefined amenity with an icon
                const icon = amenityIcons[amenityId];
                const label = amenityLabels[amenityId] || amenityId;

                return (
                  <div key={index} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      {icon ? (
                        <span className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">{icon}</span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700 text-xs sm:text-sm">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Location Section */}
        <div
          className="py-16 sm:py-20 mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 shadow-lg rounded-2xl sm:rounded-3xl relative z-10"
          style={{ background: 'linear-gradient(to bottom, #EAF7FF 0%, #F5FBFF 50%, #FFFFFF 100%)' }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Location Badge */}
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 text-[#89d1fe] text-sm shadow-sm">
                <img src={lock2} alt="Location" className="h-6 w-6" />
                <span>{t("rental.location.label")}</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-5">
              {property?.location?.title || t("rental.location.title")}
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed text-center max-w-lg mx-auto mb-14 px-4">
              {property?.location?.description || t("rental.location.description")}
            </p>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {property?.location?.places && property.location.places.length > 0 ? (
                property.location.places.map((place, idx) => (
                  <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="px-5 pt-5 pb-3">
                      <h3 className="text-base font-semibold text-gray-900">
                        {place.title}
                      </h3>
                    </div>
                    <div className="relative h-44 mx-3 mb-3 rounded-xl overflow-hidden">
                      <img
                        src={getImageUrl(place.imageUrl) || lo1}
                        alt={place.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {/* Default Card 1 - Playa del Reducto */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="px-5 pt-5 pb-3">
                      <h3 className="text-base font-semibold text-gray-900">
                        {t("rental.location.place1")}
                      </h3>
                    </div>
                    <div className="relative h-44 mx-3 mb-3 rounded-xl overflow-hidden">
                      <img src={lo1} alt={t("rental.location.place1")} className="w-full h-full object-cover" />
                      <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                    </div>
                  </div>
                  {/* Default Card 2 - César Manrique landmarks */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="px-5 pt-5 pb-3">
                      <h3 className="text-base font-semibold text-gray-900">
                        {t("rental.location.place2")}
                      </h3>
                    </div>
                    <div className="relative h-44 mx-3 mb-3 rounded-xl overflow-hidden">
                      <img src={lo2} alt={t("rental.location.place2")} className="w-full h-full object-cover" />
                      <div className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, white, rgba(255, 255, 255, 0.7), transparent)' }}></div>
                    </div>
                  </div>
                  {/* Default Card 3 - Arrecife town */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="px-5 pt-5 pb-3">
                      <h3 className="text-base font-semibold text-gray-900">
                        {t("rental.location.place3")}
                      </h3>
                    </div>
                    <div className="relative h-44 mx-3 mb-3 rounded-xl overflow-hidden">
                      <img src={lo3} alt={t("rental.location.place3")} className="w-full h-full object-cover" />
                      <div className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, white, rgba(255, 255, 255, 0.7), transparent)' }}></div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Map Section - Only show if admin added map URL */}
            {property?.location?.mapEmbedUrl && (
              <div className="mt-10">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t("rental.location.view_on_map")}
                    </h3>
                  </div>
                  <div className="rounded-xl overflow-hidden relative w-full" style={{ paddingBottom: '56.25%', minHeight: '250px' }}>
                    <iframe
                      src={property.location.mapEmbedUrl}
                      style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                      title={`${property.name} Location Map`}
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 relative z-0">
          <Testimonial propertyId={property?._id} propertyName={property?.name} />
        </div>

        {/* Still Have Questions Section */}
        <div className="py-10 sm:py-14 mt-8">
          <div className="bg-gradient-to-r from-[#F0F9FF] via-[#F5FBFF] to-[#F0F9FF] rounded-2xl px-6 sm:px-10 lg:px-14 py-8 sm:py-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
              {/* Left - Title */}
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#3B82F6] whitespace-nowrap">
                {t("rental.questions.title")}
              </h2>

              {/* Right - Description and Button */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                <p className="text-gray-500 text-sm leading-relaxed text-center sm:text-left max-w-xs">
                  {t("rental.questions.description")}
                </p>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-white border border-[#6F7BF8] rounded-full px-5 py-2.5 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm whitespace-nowrap"
                >
                  {t("rental.questions.button")}
                  <span className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
       </div>

      <RFooter/>

      {/* RBooking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[1100px] max-h-[95vh] overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
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

            {/* RBooking Component - Pass current property to skip property selection */}
            <RBooking
              onClose={() => setIsBookingModalOpen(false)}
              preSelectedProperty={property ? {
                _id: property._id,
                name: property.name,
                description: property.description,
                price: property.price,
                guests: property.guests,
                bedrooms: property.bedrooms,
                parking: property.parking,
                image: property.image,
                imageUrl: property.imageUrl
              } : undefined}
            />
          </div>
        </div>
      )}

      {/* RContact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[900px] max-h-[95vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsContactModalOpen(false)}
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

            {/* RContact Component */}
            <RContact isModal={true} onClose={() => setIsContactModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Photo Gallery Modal */}
      {isPhotoGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setIsPhotoGalleryOpen(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white hover:bg-gray-100 rounded-full p-1.5 sm:p-2 transition z-50 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {property.name} - {t("rental.property.photos", "Photos")}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {allPhotos.length} {t("rental.property.photos_count", "photos")}
              </p>
            </div>

            {/* Photos Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-100px)]" style={{ scrollbarWidth: 'thin' }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {allPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden group"
                  >
                    <img
                      src={photo}
                      alt={`${property.name} - Photo ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ParticularProperty;
