import { useTranslation } from "react-i18next";
import Expert1 from "../assets/Expert1.png";
import lock from "../assets/lock.png";

const Expert = () => {
  const { t } = useTranslation();

  return (
    <section className="py-10 sm:py-20 bg-white -mt-5 sm:-mt-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-middle items-center flex-col mb-8 sm:mb-12">
           <span className="relative inline-flex items-center gap-2 bg-[#DFB13B1A] text-[#B8860B] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm shadow-lg">
                <img src={lock} alt="Lock" className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {t('experts.team_badge')}
              </span>
        </div>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-12 items-center">
          <img
            src={Expert1}
            alt="Nadia Delens"
            className="rounded-xl sm:rounded-lg w-full"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-4xl font-inter text-gray-900 mb-4 sm:mb-6">
              {t('experts.title')}
            </h2>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Nadia Delens
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {t('experts.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Expert;
