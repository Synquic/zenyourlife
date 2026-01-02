import React, { useState, useEffect } from 'react';
import { X, Users, BedDouble, ParkingCircle, ChevronRight } from 'lucide-react';
import Apat1 from '../../assets/Apat1.png';
import Apat2 from '../../assets/Apat2.png';
import RBookingDate from './RBookingDate';
import { API_BASE_URL, getImageUrl } from "../../config/api";

// Image mapping for property images
const imageMap: { [key: string]: string } = {
  'Apat1.png': Apat1,
  'Apat2.png': Apat2
};

interface Property {
  _id: string;
  name: string;
  description: string;
  price: number;
  guests: number;
  bedrooms: number;
  parking: string;
  image: string;
  imageUrl?: string;
}

interface RBookingProps {
  onClose?: () => void;
  preSelectedProperty?: Property; // Optional: Skip property selection if provided
}

const RBooking: React.FC<RBookingProps> = ({ onClose, preSelectedProperty }) => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(preSelectedProperty?._id || null);
  const [showDateSelection, setShowDateSelection] = useState<boolean>(!!preSelectedProperty); // Skip to date if property pre-selected
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(!preSelectedProperty); // Don't load if property pre-selected
  const [error, setError] = useState<string | null>(null);

  // Helper function to get image source - prefer imageUrl from backend, fallback to mapped image
  const getImageSrc = (property: Property): string => {
    const serverUrl = getImageUrl(property.imageUrl);
    if (serverUrl) return serverUrl;
    if (property.image && imageMap[property.image]) return imageMap[property.image];
    return Apat1; // Default fallback
  };

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/properties`)
        const data = await response.json();

        if (data.success) {
          setProperties(data.data);
        } else {
          setError('Failed to load properties');
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property._id);
    console.log('Selected property:', property._id);
    setShowDateSelection(true);
  };

  // Get selected property details - use preSelectedProperty if available
  const selectedPropertyData = preSelectedProperty || properties.find(p => p._id === selectedProperty);

  // If date selection is shown, render RBookingDate instead
  if (showDateSelection && selectedPropertyData) {
    return <RBookingDate onClose={onClose} propertyData={selectedPropertyData} />;
  }

  return (
    <div className="bg-white w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-5 border-b border-gray-200">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">Check Availability</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Properties List */}
        <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4 max-h-[calc(95vh-140px)] sm:max-h-[calc(95vh-160px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading properties...</div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-red-500">{error}</div>
            </div>
          )}

          {/* Properties */}
          {!loading && !error && properties.map((property) => (
            <div
              key={property._id}
              onClick={() => handlePropertyClick(property)}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all border-gray-200 hover:border-blue-400 hover:bg-blue-50 bg-white group"
            >
              {/* Top Row on Mobile: Image + Price */}
              <div className="flex gap-3 sm:hidden">
                {/* Property Image */}
                <div className="flex-shrink-0">
                  <img
                    src={getImageSrc(property)}
                    alt={property.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                </div>
                {/* Name and Price on Mobile */}
                <div className="flex-grow flex flex-col justify-between">
                  <h3 className="text-base font-semibold text-gray-900">
                    {property.name}
                  </h3>
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      €{property.price}
                    </div>
                    <div className="text-xs text-gray-500">per night</div>
                  </div>
                </div>
                {/* Arrow on Mobile */}
                <div className="flex items-center">
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>

              {/* Description on Mobile */}
              <p className="text-xs text-gray-600 sm:hidden">
                {property.description}
              </p>

              {/* Amenities Row on Mobile */}
              <div className="flex flex-wrap gap-3 sm:hidden text-xs text-gray-700">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>{property.guests} guests</span>
                </div>
                <div className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-blue-500" />
                  <span>{property.bedrooms} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <ParkingCircle className="w-3.5 h-3.5 text-blue-500" />
                  <span>Parking</span>
                </div>
              </div>

              {/* Desktop Layout - Hidden on Mobile */}
              {/* Property Image */}
              <div className="hidden sm:block flex-shrink-0">
                <img
                  src={getImageSrc(property)}
                  alt={property.name}
                  className="w-28 h-28 rounded-lg object-cover"
                />
              </div>

              {/* Property Details */}
              <div className="hidden sm:flex flex-grow flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {property.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {property.description}
                  </p>
                </div>

                {/* Amenities */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{property.guests} guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <BedDouble className="w-4 h-4 text-blue-500" />
                    <span>{property.bedrooms} bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <ParkingCircle className="w-4 h-4 text-blue-500" />
                    <span>{property.parking}</span>
                  </div>
                </div>
              </div>

              {/* Price + Arrow - Desktop */}
              <div className="hidden sm:flex flex-shrink-0 items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    €{property.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    per night
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default RBooking;