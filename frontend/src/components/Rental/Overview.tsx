import { useState, useEffect } from 'react';
import ov1 from '../../assets/ov1.png';
import ov2 from '../../assets/ov2.png';
import ov3 from '../../assets/ov3.png';
import { useTranslation } from "react-i18next";
import { API_BASE_URL, getImageUrl } from '../../config/api';

interface OverviewCard {
  title: string;
  description: string;
  imageUrl: string;
}

interface OverviewData {
  badge: string;
  title1: string;
  title2: string;
  description1: string;
  description2: string;
  cards: OverviewCard[];
}

// Default fallback images (up to 4 cards)
const defaultImages = [ov1, ov2, ov3, ov1];

const Overview = () => {
  const { t, i18n } = useTranslation();
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const lang = i18n.language || 'en';
        const response = await fetch(`${API_BASE_URL}/rental-page/overview?lang=${lang}`);
        const data = await response.json();
        if (data.success) {
          setOverviewData(data.data);
        }
      } catch (error) {
        console.error('Error fetching overview data:', error);
      }
    };

    fetchOverviewData();
  }, [i18n.language]);

  // Use API data if available, otherwise fall back to translations
  const badge = overviewData?.badge || t('rental.overview.badge');
  const title1 = overviewData?.title1 || t('rental.overview.title_1');
  const title2 = overviewData?.title2 || t('rental.overview.title_2');
  const description1 = overviewData?.description1 || t('rental.overview.description_1');
  const description2 = overviewData?.description2 || t('rental.overview.description_2');

  // Use API cards if available, otherwise use translation defaults (2 cards)
  const cards = overviewData?.cards || [
    { title: t('rental.overview.villas_title'), description: t('rental.overview.villas_desc'), imageUrl: '' },
    { title: t('rental.overview.countryside_title'), description: t('rental.overview.countryside_desc'), imageUrl: '' }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Overview Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="text-blue-600 font-medium text-sm">{badge}</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-inter text-gray-900 mb-4 leading-tight">
            {title1}<br />
            {title2}
          </h2>
        </div>

        {/* Description */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
            {description1}
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {description2}
          </p>
        </div>

        {/* Cards Grid - Dynamic columns based on card count */}
        <div className={`grid gap-8 mx-auto ${
          cards.length === 1 ? 'md:grid-cols-1 max-w-md' :
          cards.length === 2 ? 'md:grid-cols-2 max-w-4xl' :
          cards.length === 3 ? 'md:grid-cols-3 max-w-5xl' :
          'md:grid-cols-2 lg:grid-cols-4 max-w-6xl'
        }`}>
          {cards.map((card, index) => {
            // Use API image if available, otherwise use default
            const imageUrl = card.imageUrl ? getImageUrl(card.imageUrl) : defaultImages[index % defaultImages.length];

            return (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={imageUrl || defaultImages[index % defaultImages.length]}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  {/* White to transparent gradient overlay from top */}
                  <div className="absolute top-0 left-0 right-0 h-24 z-20 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Overview;
