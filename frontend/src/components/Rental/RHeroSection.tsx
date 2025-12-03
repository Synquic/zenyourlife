import tp1 from '../../assets/tp1.jpg';
import tp2 from '../../assets/tp2.jpg';
import tp3 from '../../assets/tp3.jpg';
import tp4 from '../../assets/tp4.jpg';
import frame7 from '../../assets/frame7.png';
import { useTranslation } from "react-i18next";

const RHeroSection = () => {
  const { t } = useTranslation();
  return (
    <div id="hero" className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-4 sm:mt-8">
      {/* Main Hero Container with rounded corners and top notch */}
      <div
        className="relative min-h-[350px] sm:min-h-[400px] md:min-h-[550px] bg-cover bg-center bg-no-repeat overflow-visible rounded-3xl sm:rounded-[32px]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${frame7})`,
          marginTop: '24px'
        }}
      >
        {/* Trusted Partners Badge - Inside hero on mobile, overlapping top on desktop */}
        <div className="absolute top-3 sm:-top-6 left-1/2 transform -translate-x-1/2 z-30 max-w-[90%] sm:max-w-none">
          <div className="bg-white rounded-full px-2 sm:px-6 py-1 sm:py-3 shadow-lg flex items-center gap-1 sm:gap-3">
            {/* Overlapping Profile Images */}
            <div className="flex items-center -space-x-1 sm:-space-x-2 flex-shrink-0">
              <img
                src={tp1}
                alt="Partner 1"
                className="w-4 h-4 sm:w-8 sm:h-8 rounded-full border border-white sm:border-2 object-cover relative z-[4]"
              />
              <img
                src={tp2}
                alt="Partner 2"
                className="w-4 h-4 sm:w-8 sm:h-8 rounded-full border border-white sm:border-2 object-cover relative z-[3]"
              />
              <img
                src={tp3}
                alt="Partner 3"
                className="w-4 h-4 sm:w-8 sm:h-8 rounded-full border border-white sm:border-2 object-cover relative z-[2]"
              />
              <img
                src={tp4}
                alt="Partner 4"
                className="w-4 h-4 sm:w-8 sm:h-8 rounded-full border border-white sm:border-2 object-cover relative z-[1]"
              />
            </div>
            {/* Text */}
            <span className="text-[9px] sm:text-sm font-medium text-gray-700 whitespace-nowrap">
              {t('rental.hero.trusted_by')}
            </span>
          </div>
        </div>
        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 h-full min-h-[350px] sm:min-h-[400px] md:min-h-[550px] flex items-center pt-10 sm:pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full items-center">
            {/* Left Side - Text Content */}
            <div className="text-white space-y-4 sm:space-y-6 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif leading-tight">
                {t('rental.hero.title_1')}<br />
                <span className="italic font-light">{t('rental.hero.title_2')}</span>
              </h1>
            </div>

            {/* Right Side - CTA */}
            <div className="flex flex-col items-center md:items-end space-y-4">
              <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl text-center md:text-right max-w-[400px]">
                {t('rental.hero.description')}
              </p>
              <button className="group bg-white/30 backdrop-blur-md border-2 border-[#4F82BE] hover:bg-white hover:text-gray-900 text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-medium transition-all shadow-lg flex items-center gap-2 sm:gap-3">
                <span className="font-semibold text-sm sm:text-base">{t('rental.hero.reserve_btn')}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHeroSection;
