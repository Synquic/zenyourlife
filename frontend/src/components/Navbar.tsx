import React from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import znlogo from "../assets/znlogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../config/api";

interface BenefitItem {
  title?: string;
  description: string;
  icon?: string;
}

interface TargetAudienceItem {
  title?: string;
  description: string;
  icon?: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  image: string;
  imageUrl?: string;
  isActive: boolean;
  benefits?: BenefitItem[];
  targetAudience?: TargetAudienceItem[];
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [isFacialOpen, setIsFacialOpen] = React.useState(false);
  const [isMassageOpen, setIsMassageOpen] = React.useState(false);
  const [services, setServices] = React.useState<Service[]>([]);
  // Mobile accordion states
  const [isMobileMassageOpen, setIsMobileMassageOpen] = React.useState(false);
  const [isMobileFacialOpen, setIsMobileFacialOpen] = React.useState(false);
  const langDropdownRef = React.useRef<HTMLDivElement>(null);
  const facialDropdownRef = React.useRef<HTMLDivElement>(null);
  const massageDropdownRef = React.useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Get current language code in uppercase
  const currentLang = i18n.language?.toUpperCase().substring(0, 2) || "EN";

  const languages = [
    { code: "EN", lang: "en", name: "English", flag: "🇬🇧" },
    { code: "NL", lang: "nl", name: "Nederlands", flag: "🇳🇱" },
    { code: "FR", lang: "fr", name: "Français", flag: "🇫🇷" },
    { code: "DE", lang: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  // Change language handler
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsLangOpen(false);
  };

  // Fetch services from backend
  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services`);
        const data = await response.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  // Filter services by category dynamically
  const massageServices = services.filter(
    (s) =>
      s.category?.toLowerCase() === "massage" ||
      s.category?.toLowerCase() === "therapy"
  );

  const facialServices = services.filter(
    (s) =>
      s.category?.toLowerCase() === "facial" ||
      s.category?.toLowerCase() === "facial care"
  );

  // Handle service click - navigate to ParticularService page
  const handleServiceClick = (menuItemName: string) => {
    console.log("handleServiceClick - menuItemName:", menuItemName);
    console.log(
      "handleServiceClick - available services:",
      services.map((s) => s.title)
    );

    // Find matching service by title (case-insensitive partial match)
    const matchedService = services.find(
      (s) =>
        s.title.toLowerCase().includes(menuItemName.toLowerCase()) ||
        menuItemName.toLowerCase().includes(s.title.toLowerCase())
    );

    console.log("handleServiceClick - matchedService:", matchedService);

    if (matchedService) {
      const serviceIndex = services.findIndex(
        (s) => s._id === matchedService._id
      );
      console.log(
        "Navigating to service with benefits:",
        matchedService.benefits
      );
      navigate(`/service/${matchedService._id}`, {
        state: { service: matchedService, imageIndex: serviceIndex % 9 },
      });
    } else {
      console.log("No match found, redirecting to /services");
      // If no exact match, go to services page
      navigate("/services");
    }

    // Close dropdowns
    setIsMassageOpen(false);
    setIsFacialOpen(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
      if (
        facialDropdownRef.current &&
        !facialDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFacialOpen(false);
      }
      if (
        massageDropdownRef.current &&
        !massageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMassageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={znlogo}
              alt="ZenYouth Logo"
              className="h-7 w-7 object-contain"
            />
            <span className="text-xl font-medium text-gray-800">
              ZENYOURLIFE.BE
            </span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {/* Massage Dropdown */}
            <div className="relative" ref={massageDropdownRef}>
              <button
                onClick={() => {
                  setIsMassageOpen(!isMassageOpen);
                  setIsFacialOpen(false);
                }}
                className="flex items-center gap-1 text-gray-700 font-medium hover:text-gray-900 transition"
              >
                {t("nav.massage")}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isMassageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Simple Dropdown Menu */}
              {isMassageOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-56 z-50">
                  {massageServices.length > 0 ? (
                    massageServices.map((service, index) => (
                      <button
                        key={service._id}
                        onClick={() => handleServiceClick(service.title)}
                        className={`block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#FFFBEA] hover:text-[#B8860B] transition-colors ${
                          index !== massageServices.length - 1
                            ? "border-b border-gray-50"
                            : ""
                        }`}
                      >
                        {service.title}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Loading...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Facial Care Dropdown */}
            <div className="relative" ref={facialDropdownRef}>
              <button
                onClick={() => {
                  setIsFacialOpen(!isFacialOpen);
                  setIsMassageOpen(false);
                }}
                className="flex items-center gap-1 text-gray-700 font-medium hover:text-gray-900 transition"
              >
                {t("nav.facial_care")}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isFacialOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Simple Dropdown Menu */}
              {isFacialOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-64 z-50">
                  {facialServices.length > 0 ? (
                    facialServices.map((service, index) => (
                      <button
                        key={service._id}
                        onClick={() => handleServiceClick(service.title)}
                        className={`block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#FFFBEA] hover:text-[#B8860B] transition-colors ${
                          index !== facialServices.length - 1
                            ? "border-b border-gray-50"
                            : ""
                        }`}
                      >
                        {service.title}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Loading...
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link
              to="/pmu"
              className="text-gray-700 font-medium hover:text-gray-900"
            >
              {t("nav.pmu")}
            </Link>

            <a
              href="/contact"
              className="text-gray-700 font-medium hover:text-gray-900"
            >
              {t("nav.contact")}
            </a>

            {/* Premium Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-gray-700 font-semibold hover:text-gray-900 transition"
              >
                <span>{currentLang}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isLangOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Card */}
              {isLangOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-56 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.lang)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FFFBEA] transition-colors ${
                        currentLang === lang.code
                          ? "bg-[#FFFBEA] border-l-4 border-[#B8860B]"
                          : ""
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-900">
                          {lang.code}
                        </span>
                        <span className="text-xs text-gray-600">
                          {lang.name}
                        </span>
                      </div>
                      {currentLang === lang.code && (
                        <svg
                          className="ml-auto w-5 h-5 text-[#B8860B]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/contact")}
            className="hidden md:block bg-[#d4af37]  text-white px-6 py-2 rounded-full hover:bg-yellow-500 transition"
          >
            {t("nav.contact")}
          </button>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {/* Massage Section - Accordion */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => setIsMobileMassageOpen(!isMobileMassageOpen)}
                className="w-full flex items-center justify-between py-3 text-gray-900 font-medium"
              >
                <span>{t("nav.massage")}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isMobileMassageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isMobileMassageOpen && (
                <div className="pb-3 pl-4 space-y-1">
                  {massageServices.map((service) => (
                    <button
                      key={service._id}
                      onClick={() => {
                        handleServiceClick(service.title);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-gray-600 hover:text-[#B8860B] py-2 text-sm"
                    >
                      {service.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Facial Care Section - Accordion */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => setIsMobileFacialOpen(!isMobileFacialOpen)}
                className="w-full flex items-center justify-between py-3 text-gray-900 font-medium"
              >
                <span>{t("nav.facial_care")}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isMobileFacialOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isMobileFacialOpen && (
                <div className="pb-3 pl-4 space-y-1">
                  {facialServices.map((service) => (
                    <button
                      key={service._id}
                      onClick={() => {
                        handleServiceClick(service.title);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-gray-600 hover:text-[#B8860B] py-2 text-sm"
                    >
                      {service.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Other Links */}
            <Link
              to="/pmu"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2"
            >
              {t("nav.pmu")}
            </Link>

            <a
              href="#"
              className="block text-gray-700 font-medium hover:text-gray-900 py-2"
            >
              {t("nav.transport")}
            </a>

            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 font-medium hover:text-gray-900 py-2"
            >
              {t("nav.contact")}
            </Link>

            {/* Language Selector for Mobile */}
            <div className="py-2 border-t border-gray-100 mt-2">
              <p className="text-xs text-gray-500 mb-2">{t("nav.language")}</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.lang);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                      currentLang === lang.code
                        ? "bg-[#B8860B] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Button for Mobile */}
            <button
              onClick={() => {
                navigate("/contact");
                setIsMenuOpen(false);
              }}
              className="w-full bg-[#d4af37] text-white px-6 py-3 rounded-full hover:bg-yellow-500 transition mt-4"
            >
              {t("nav.contact")}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
