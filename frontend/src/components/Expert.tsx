import { useTranslation } from "react-i18next";
import lock from "../assets/lock.png";
import nadia2 from "../assets/nadia2.png";

const Expert = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 sm:py-18 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 bg-[#FDF8E8] text-[#B8860B] px-5 py-2 rounded-full text-sm font-medium border border-[#E8D9A0]">
            <img src={lock} alt="" className="w-3 h-3" />
            {t('experts.team_badge')}
          </span>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-2/5 relative">
              <img
                src={nadia2}
                alt="Nadia Delens"
                className="w-full h-56 sm:h-72 md:h-full object-cover object-top"
              />
            </div>

            {/* Text Section */}
            <div className="md:w-3/5 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                {t('experts.title')}
              </h2>
              <h3 className="text-lg sm:text-xl font-medium text-[#B8860B] mb-4">
                Nadia Delens
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {t('experts.description')}
              </p>

              {/* Decorative element */}
              <div className="mt-5 flex items-center gap-2">
                <div className="w-12 h-1 bg-[#B8860B] rounded-full"></div>
                <div className="w-3 h-1 bg-[#B8860B]/50 rounded-full"></div>
                <div className="w-1.5 h-1 bg-[#B8860B]/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Expert;
