import s1 from '../../assets/s1.png';
import s2 from '../../assets/s2.png';
import s3 from '../../assets/s3.png';
import s4 from '../../assets/s4.png';
import lock2 from '../../assets/lock2.png';
import { useTranslation } from "react-i18next";

const Service = () => {
  const { t } = useTranslation();
  return (
    <div id='service' className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Services Badge */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-400 rounded-full text-xs sm:text-sm text-blue-600">
            <img src={lock2} alt="Lock" className="w-4 h-4 sm:w-5 sm:h-5" />
            {t('rental.service.badge')}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            {t('rental.service.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            {t('rental.service.description')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">

          {/* CARD 1 */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 sm:p-5 pb-2 sm:pb-3">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-0.5 sm:mb-1">300+</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">{t('rental.service.sunshine_days')}</p>
            </div>

            {/* — Improved image + fade overlay */}
            <div className="w-full h-28 sm:h-32 md:h-40 overflow-hidden relative">
              {/* Image: ensure it is below overlay (z-10) */}
              <img
                src={s4}
                alt="Days of Sunshine"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 z-10 block"
              />

              {/* Top to bottom fade: white at top to transparent */}
              <div
                className="absolute top-0 left-0 right-0 h-50 z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0))",
                }}
              />
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 sm:p-5 pb-2 sm:pb-3">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-0.5 sm:mb-1">100+</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">{t('rental.service.volcanic_beaches')}</p>
            </div>

            <div className="w-full h-28 sm:h-32 md:h-40 overflow-hidden relative">
              <img
                src={s2}
                alt="Volcanic Beaches"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 z-10 block"
              />
              <div
                className="absolute top-0 left-0 right-0 h-28 z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0))",
                }}
              />
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 sm:p-5 pb-2 sm:pb-3">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-0.5 sm:mb-1">22°C</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">{t('rental.service.avg_temperature')}</p>
            </div>

            <div className="w-full h-28 sm:h-32 md:h-40 overflow-hidden relative">
              <img
                src={s3}
                alt="Average Temperature"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 z-10 block"
              />
              <div
                className="absolute top-0 left-0 right-0 h-28 z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0))",
                }}
              />
            </div>
          </div>

          {/* CARD 4 */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 sm:p-5 pb-2 sm:pb-3">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-0.5 sm:mb-1">UNESCO</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">{t('rental.service.biosphere_reserve')}</p>
            </div>

            <div className="w-full h-28 sm:h-32 md:h-40 overflow-hidden relative">
              <img
                src={s1}
                alt="UNESCO Biosphere Reserve"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 z-10 block"
              />
              <div
                className="absolute top-0 left-0 right-0 h-28 z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0))",
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Service;
