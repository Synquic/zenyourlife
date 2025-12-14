
import { useTranslation } from "react-i18next";
import Frame1 from "../assets/Frame1.jpg";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-3 sm:px-6 lg:px-8 py-4 sm:py-8 mt-20 sm:mt-16">
      {/* Card Container */}
      <div className="relative max-w-7xl mx-auto h-[480px] sm:h-[550px] md:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden">

        {/* Background Image */}
        <img
          src={Frame1}
          alt="Wellness"
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] sm:object-center"
        />

        {/* Black Gradient Overlay - Bottom to top on mobile, left to right on desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 via-40% to-transparent sm:bg-gradient-to-r sm:from-black sm:via-black/85 sm:via-40% sm:to-transparent"></div>

        {/* Content - Bottom aligned on mobile */}
        <div className="relative z-20 h-full flex flex-col justify-end sm:justify-center px-5 sm:px-8 md:px-16 pb-8 sm:pb-0">
          <div className="max-w-2xl">
            <span className="inline-block bg-gray-700/80 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-4 sm:mb-6">
              {t('about.title')}
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-inter text-white mb-3 sm:mb-6 leading-tight drop-shadow-[0_0_20px_white]">
              {t('about.hero_title')}
            </h1>

            <p className="text-white/90 text-sm sm:text-base mb-5 sm:mb-8 leading-relaxed max-w-[300px] sm:max-w-[500px]">
              {t('about.hero_description')}
            </p>

            <button
              onClick={() => {
                const overviewSection = document.getElementById('overview');
                if (overviewSection) {
                  overviewSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-gray-700/50 backdrop-blur border border-white/30 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-600/50 transition text-sm sm:text-base"
            >
              {t('common.learn_more')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
