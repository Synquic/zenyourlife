
import { useTranslation } from "react-i18next";
import MasterButton from "../assets/MasterButton.png";
import MasterButton1 from "../assets/MasterButton (1).png";
import MasterButton2 from "../assets/MasterButton (2).png";
import MasterButton3 from "../assets/MasterButton (3).png";

const Overview = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-yellow-50 relative overflow-hidden -mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Rainbow Dot Glow Above Heading */}
        <div className="relative mx-auto w-fit mb-4">
          {/* Red Arc */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-20 rounded-full
                          border-t-4 border-red-400 opacity-100 blur-2xl"
               style={{ transform: 'rotate(-20deg)' }}></div>

          {/* Yellow Arc */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-20 rounded-full
                          border-t-4 border-yellow-300 opacity-100 blur-2xl"
               style={{ transform: 'rotate(0deg)' }}></div>

          {/* Blue Arc */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-20 rounded-full
                          border-t-4 border-blue-300 opacity-100 blur-2xl"
               style={{ transform: 'rotate(20deg)' }}></div>

          {/* Transparent Dot */}
          <div className="w-3 h-3 bg-white/0 rounded-full relative z-10 mx-auto shadow-lg"></div>
        </div>

        <span className="text-yellow-500 text-sm font-semibold block mb-2 text-center">
          — {t('nav.overview')}
        </span>

        <h2 className="text-4xl font-serif text-gray-900 mb-12 text-center relative z-10">
          {t('about.overview_title')}
        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          {/* CARD 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4">
              <img src={MasterButton} alt="" className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('about.personal_touch')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('about.personal_touch_desc')}
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4">
              <img src={MasterButton1} alt="" className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('about.honest_intentions')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('about.honest_intentions_desc')}
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4">
              <img src={MasterButton2} alt="" className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('about.authentic_quality')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('about.authentic_quality_desc')}
            </p>
          </div>

          {/* CARD 4 */}
          <div className="bg-white p-6 rounded-xl shadow-2xl hover:shadow-xl transition text-center">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4">
              <img src={MasterButton3} alt="" className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('about.holistic_perspective')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('about.holistic_perspective_desc')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Overview;
