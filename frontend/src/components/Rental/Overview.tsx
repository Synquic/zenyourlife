import ov1 from '../../assets/ov1.png';
import ov2 from '../../assets/ov2.png';
import ov3 from '../../assets/ov3.png';
import { useTranslation } from "react-i18next";

const Overview = () => {
  const { t } = useTranslation();
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
            <span className="text-blue-600 font-medium text-sm">{t('rental.overview.badge')}</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-inter text-gray-900 mb-4 leading-tight">
            {t('rental.overview.title_1')}<br />
            {t('rental.overview.title_2')}
          </h2>
        </div>

        {/* Description */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
            {t('rental.overview.description_1')}
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {t('rental.overview.description_2')}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Villas Card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('rental.overview.villas_title')}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('rental.overview.villas_desc')}
              </p>
            </div>
            <div className="relative h-44 overflow-hidden">
              <img
                src={ov1}
                alt="Villas"
                className="w-full h-full object-cover"
              />
              {/* White to transparent gradient overlay from top */}
              <div className="absolute top-0 left-0 right-0 h-24 z-20 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
            </div>
          </div>

          {/* Countryside Homes Card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('rental.overview.countryside_title')}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('rental.overview.countryside_desc')}
              </p>
            </div>
            <div className="relative h-44 overflow-hidden">
              <img
                src={ov2}
                alt="Countryside Homes"
                className="w-full h-full object-cover"
              />
              {/* White to transparent gradient overlay from top */}
              <div className="absolute top-0 left-0 right-0 h-24 z-20 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
            </div>
          </div>

          {/* Luxury Stays Card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('rental.overview.luxury_title')}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('rental.overview.luxury_desc')}
              </p>
            </div>
            <div className="relative h-44 overflow-hidden">
              <img
                src={ov3}
                alt="Luxury Stays"
                className="w-full h-full object-cover"
              />
              {/* White to transparent gradient overlay from top */}
              <div className="absolute top-0 left-0 right-0 h-28 z-20 pointer-events-none bg-gradient-to-b from-white via-white/70 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;