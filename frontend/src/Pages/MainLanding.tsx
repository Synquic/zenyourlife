import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import znlogo from '../assets/znlogo.png';
import main001 from '../assets/main001.jpg'
import lanz01 from '../assets/lanz01.jpg'
// import main2 from '../assets/main2.png';
import tp1 from '../assets/tp1.jpg';
import tp2 from '../assets/tp2.jpg';
import tp3 from '../assets/tp3.jpg';
import tp4 from '../assets/tp4.jpg';
import tp5 from '../assets/tp5.png';

import zenurlifeRental from '../assets/zenurlifeRental.jpg';

const MainLanding = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Get current language code in uppercase
  const currentLang = i18n.language?.toUpperCase().substring(0, 2) || 'EN';

  // Change language handler
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <img
                src={znlogo}
                alt="ZenYourLife Logo"
                className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
              />
              <span className="text-sm sm:text-xl font-semibold text-gray-800">
                ZENYOURLIFE.BE
              </span>
            </div>

            {/* Right Side - Contact Button and Language Dropdown */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Contact Button */}
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#d4af37] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-base font-medium hover:bg-[#b8921f] transition shadow-md"
              >
                {t('nav.contact_us')}
              </button>

              {/* Language Dropdown */}
              <select
                value={currentLang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="text-gray-700 text-xs sm:text-sm font-semibold bg-transparent border border-gray-300 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 cursor-pointer hover:border-[#d4af37] transition"
              >
                <option value="EN">EN</option>
                <option value="NL">NL</option>
                <option value="FR">FR</option>
                <option value="DE">DE</option>
                <option value="ES">ES</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Trusted Partner Badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white shadow-lg">
              {/* Overlapping Avatar Circles */}
              <div className="flex items-center -space-x-1.5">
                {/* Avatar 1 */}
                <div className="w-7 h-7 rounded-full border-2 border-white shadow-md overflow-hidden">
                  <img src={tp1} alt="Partner 1" className="w-full h-full object-cover" />
                </div>

                {/* Avatar 2 */}
                <div className="w-7 h-7 rounded-full border-2 border-white shadow-md overflow-hidden">
                  <img src={tp2} alt="Partner 2" className="w-full h-full object-cover" />
                </div>

                {/* Avatar 3 */}
                <div className="w-7 h-7 rounded-full border-2 border-white shadow-md overflow-hidden">
                  <img src={tp3} alt="Partner 3" className="w-full h-full object-cover" />
                </div>

                {/* Avatar 4 */}
                <div className="w-7 h-7 rounded-full border-2 border-white shadow-md overflow-hidden">
                  <img src={tp4} alt="Partner 4" className="w-full h-full object-cover" />
                </div>

                {/* Avatar 5 */}
                <div className="w-7 h-7 rounded-full border-2 border-white shadow-md overflow-hidden">
                  <img src={tp5} alt="Partner 5" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Text */}
              <div className="text-gray-800 font-semibold text-xs">
                {t('main_landing.trusted_partners')}
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl  text-gray-900 mb-4 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Book A Massage Card */}
            <div
              onClick={() => navigate('/home')}
              className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <img
                src={main001}
                alt="Book A Massage"
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">{t('main_landing.book_massage')}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 stroke-yellow-400"
                    fill="none"

                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Schapenbaan 45 ,1731 Relegem</span>
                </div>
              </div>
            </div>

            {/* Book A Rental Card */}
            <div
              onClick={() => navigate('/rhome')}
              className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <img
                src={lanz01}
                alt="Book A Rental"
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">{t('main_landing.book_rental')}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 stroke-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Lanzarote, Spain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLanding;
