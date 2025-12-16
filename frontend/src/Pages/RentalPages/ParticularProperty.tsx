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
// Map image names to imported images
const imageMap: { [key: string]: string } = {
  "Apat1.png": apat1,
  "Apat2.png": apat2,
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
  galleryImages?: string[];
  cleanliness: {
    title: string;
    description: string;
  };
  amenities: string[];
  hostName?: string;
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

  const currentLang = i18n.language?.split("-")[0] || "en";

  // Get image source
  const getImageSrc = (imageUrl?: string, imageName?: string) => {
    const serverUrl = getImageUrl(imageUrl);
    if (serverUrl) return serverUrl;
    if (imageName && imageMap[imageName]) return imageMap[imageName];
    return apat1;
  };

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isBookingModalOpen || isContactModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isBookingModalOpen, isContactModalOpen]);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/properties/${id}?lang=${currentLang}`
        );
        const data = await response.json();
        console.log("[Frontend] Fetched property data:", data);
        console.log("[Frontend] Gallery images from DB:", data.data?.galleryImages);
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

  // Get gallery images (main + additional)
  const mainImage = getImageSrc(property.imageUrl, property.image);
  console.log("[Frontend] Raw galleryImages from property:", property.galleryImages);
  const galleryImages = property.galleryImages && property.galleryImages.length > 0
    ? property.galleryImages.map((img: string) => getImageUrl(img) || apat1)
    : [apat1, apat2];
  console.log("[Frontend] Processed galleryImages for display:", galleryImages);

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
              className="w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-lg"
            />
          </div>

          {/* Side Images */}
          <div className="w-full lg:w-[40%] flex flex-row lg:flex-col gap-3 sm:gap-4">
            <div className="w-1/2 lg:w-full h-[140px] sm:h-[165px] lg:h-[200px]">
              <img
                src={galleryImages[0] || apat1}
                alt={`${property.name} view 1`}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-md"
              />
            </div>
            <div className="w-1/2 lg:w-full h-[140px] sm:h-[165px] lg:h-[200px]">
              <img
                src={galleryImages[1] || apat2}
                alt={`${property.name} view 2`}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-md"
              />
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
              <button className="text-blue-600 font-medium text-xs sm:text-sm hover:text-blue-700 transition-colors flex items-center gap-1">
                {t("rental.apartments.meet_host")}{" "}
                <span className="text-sm">↗</span>
              </button>
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
                <img
                  src={blueArrow}
                  alt="arrow"
                  className="w-3 h-3 sm:w-4 sm:h-4 brightness-0 invert"
                />
              </button>
            </div>
          </div>
        </div>

        {/* overview */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 mt-10 sm:p-8 grid grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 text-blue-500 text-sm mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{t("rental.property_overview.label")}</span>
            </div>

            <h2 className="text-3xl font-semibold text-gray-900">{t("rental.property_overview.title")}</h2>

            <p className="text-gray-800 text-sm mt-4 leading-relaxed w-[80%]">
              {t("rental.property_overview.description1")}
            </p>

            <p className="text-gray-800 text-sm mt-4 leading-relaxed w-[80%]">
              {t("rental.property_overview.description2")}
            </p>

            <p className="text-gray-800 text-sm mt-4 leading-relaxed font-bold">
              {t("rental.property_overview.highlights")}
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600 text-sm leading-relaxed space-y-1">
              <li>{t("rental.property_overview.highlight1")}</li>
              <li>{t("rental.property_overview.highlight2")}</li>
              <li>{t("rental.property_overview.highlight3")}</li>
              <li>{t("rental.property_overview.highlight4")}</li>
              <li>{t("rental.property_overview.highlight5")}</li>
              <li>{t("rental.property_overview.highlight6")}</li>
              <li>{t("rental.property_overview.highlight7")}</li>
              <li>{t("rental.property_overview.highlight8")}</li>
            </ul>
          </div>

          {/* right */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 - Private terrace */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {t("rental.property_overview.private_terrace")}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {t("rental.property_overview.private_terrace_desc")}
                  </p>
                </div>
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={ov1}
                    alt={t("rental.property_overview.private_terrace")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                </div>
              </div>

              {/* Card 2 - Airy bedroom */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {t("rental.property_overview.airy_bedroom")}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {t("rental.property_overview.airy_bedroom_desc")}
                  </p>
                </div>
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={ov2}
                    alt={t("rental.property_overview.airy_bedroom")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                </div>
              </div>

              {/* Card 3 - Open-plan living room */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {t("rental.property_overview.living_room")}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {t("rental.property_overview.living_room_desc")}
                  </p>
                </div>
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={ov3}
                    alt={t("rental.property_overview.living_room")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                </div>
              </div>

              {/* Card 4 - Fully equipped kitchen */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {t("rental.property_overview.kitchen")}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {t("rental.property_overview.kitchen_desc")}
                  </p>
                </div>
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={ov4}
                    alt={t("rental.property_overview.kitchen")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities Grid Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* High-speed Wi-Fi */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">{t("rental.amenities_list.wifi")}</span>
            </div>

            {/* Washing machine */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
                  <circle cx="12" cy="13" r="4" strokeWidth={2} />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">{t("rental.amenities_list.washing")}</span>
            </div>

            {/* Free parking */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l1-2h12l1 2M5 10v8a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-8M5 10h14M7 14h.01M17 14h.01" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">{t("rental.amenities_list.parking")}</span>
            </div>

            {/* Smart TV */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">{t("rental.amenities_list.tv")}</span>
            </div>

            {/* Fresh linens & towels */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">{t("rental.amenities_list.linens")}</span>
            </div>

            {/* Safe neighborhood */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">{t("rental.amenities_list.safe")}</span>
            </div>

            {/* Coffee maker */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h1a3 3 0 010 6h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zm4-3a2 2 0 114 0M8 5h4" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">{t("rental.amenities_list.coffee")}</span>
            </div>

            {/* Outdoor seating */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">{t("rental.amenities_list.outdoor")}</span>
            </div>

            {/* Self check-in */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">{t("rental.amenities_list.checkin")}</span>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div
          className="py-16 sm:py-20 mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 shadow-lg rounded-2xl sm:rounded-3xl relative z-10"
          style={{ background: 'linear-gradient(to bottom, #EAF7FF 0%, #F5FBFF 50%, #FFFFFF 100%)' }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Services Badge */}
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 text-[#89d1fe] text-sm shadow-sm">
                <img src={lock2} alt="Services" className="h-6 w-6" />
                <span>{t("rental.location.label")}</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-5">{t("rental.location.title")}</h2>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed text-center max-w-lg mx-auto mb-14 px-4">
              {t("rental.location.description")}
            </p>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 - Playa del Reducto */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="px-5 pt-5 pb-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    {t("rental.location.place1")}
                  </h3>
                </div>
                <div className="relative h-44 mx-3 mb-3 rounded-xl overflow-hidden">
                  <img
                    src={lo1}
                    alt={t("rental.location.place1")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                </div>
              </div>

              {/* Card 2 - César Manrique landmarks */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="px-5 pt-5 pb-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    {t("rental.location.place2")}
                  </h3>
                </div>
                <div className="relative h-44 mx-3 mb-3 rounded-xl overflow-hidden">
                  <img
                    src={lo2}
                    alt={t("rental.location.place2")}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, white, rgba(255, 255, 255, 0.7), transparent)' }}
                  ></div>
                </div>
              </div>

              {/* Card 3 - Arrecife town */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="px-5 pt-5 pb-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    {t("rental.location.place3")}
                  </h3>
                </div>
                <div className="relative h-44 mx-3 mb-3 rounded-xl overflow-hidden">
                  <img
                    src={lo3}
                    alt={t("rental.location.place3")}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, white, rgba(255, 255, 255, 0.7), transparent)' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 relative z-0">
          <Testimonial/>
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

            {/* RBooking Component */}
            <RBooking onClose={() => setIsBookingModalOpen(false)} />
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
    </>
  );
};

export default ParticularProperty;
