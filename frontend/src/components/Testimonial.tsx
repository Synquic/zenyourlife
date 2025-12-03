import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import profile1 from "../assets/profile1.png";
import profile2 from "../assets/profile2.png";
import profile3 from "../assets/profile3.png";
import profile4 from "../assets/profile4.png";
import MasterPrimaryButton from "../assets/Master Primary Button (4).png";
import Booking from "./Booking";
import { X } from "lucide-react";

const API_BASE_URL = 'http://localhost:5000/api';

// Map photo names to imported images
const photoMap: { [key: string]: string } = {
  'profile1.png': profile1,
  'profile2.png': profile2,
  'profile3.png': profile3,
  'profile4.png': profile4,
};

interface TestimonialData {
  _id: string;
  name: string;
  role: string;
  text: string;
  photo: string;
  photoUrl?: string;
  rating?: number;
  isActive: boolean;
  displayOrder: number;
}

const Testimonial = () => {
  const { t, i18n } = useTranslation();
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Get current language for API calls (extract base language code, e.g., "de-DE" -> "de")
  const currentLang = i18n.language?.split('-')[0] || 'en';

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isBookingModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isBookingModalOpen]);

  // Default testimonials (fallback)
  const defaultTestimonials: TestimonialData[] = [
    {
      _id: '1',
      name: "Dave n",
      role: "@once",
      text: "After exploring the @ZenYourLife platform for a few months, I finally took the plunge. Wow, it's a game changer! Just give it a shot! You won't regret it! 🤘🏻",
      photo: "profile1.png",
      isActive: true,
      displayOrder: 0
    },
    {
      _id: '2',
      name: "Sebas",
      role: "@sebasbedoya",
      text: "Once you start using @ZenYourLife, there's no going back. It has completely transformed my wellness journey. Booking massages has never been easier! 🔥🔥",
      photo: "profile2.png",
      isActive: true,
      displayOrder: 1
    },
    {
      _id: '3',
      name: "Dylan Pearson",
      role: "@dylanbusiness",
      text: "ZenYourLife - The Tesla of wellness services. A brief session with their expert nearly doubled my relaxation. The future is bright. ☀",
      photo: "profile1.png",
      isActive: true,
      displayOrder: 2
    },
    {
      _id: '4',
      name: "Piero Madu",
      role: "@pieromadu",
      text: "@ZenYourLife has revolutionized my self-care routine. Utilizing their services is essential for maintaining balance! ⚡",
      photo: "profile3.png",
      isActive: true,
      displayOrder: 3
    },
    {
      _id: '5',
      name: "George Klein",
      role: "@GeorgeBlue94",
      text: "ZenYourLife is the culmination of wellness expertise. Self-care is here to stay. ZenYourLife is the future of wellness! 💎",
      photo: "profile4.png",
      isActive: true,
      displayOrder: 4
    },
    {
      _id: '6',
      name: "Jordan Welch",
      role: "@jrdn.w",
      text: "I was part of the beta launch... absolutely mind-blowing. Managing my wellness appointments has never been easier. @ZenYourLife is by far my go-to platform",
      photo: "profile2.png",
      isActive: true,
      displayOrder: 5
    },
    {
      _id: '7',
      name: "Faiz W",
      role: "@Faiz",
      text: "Incredible! @ZenYourLife elevates your wellness game. My stress levels dropped significantly in no time! 😱",
      photo: "profile3.png",
      isActive: true,
      displayOrder: 6
    },
    {
      _id: '8',
      name: "Sarah Miller",
      role: "@sarahm",
      text: "The best decision I made this year was joining ZenYourLife. Their massage therapists are world-class! 🤘🏻",
      photo: "profile1.png",
      isActive: true,
      displayOrder: 7
    },
  ];

  // Fetch testimonials from backend (with translation)
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/testimonials?lang=${currentLang}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          setTestimonials(data.data);
        } else {
          // Use default testimonials if none in database
          setTestimonials(defaultTestimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Use default testimonials on error
        setTestimonials(defaultTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [currentLang]);

  // Get photo source - prefer photoUrl, fallback to mapped photo
  const getPhotoSrc = (testimonial: TestimonialData) => {
    if (testimonial.photoUrl) return testimonial.photoUrl;
    if (testimonial.photo && photoMap[testimonial.photo]) return photoMap[testimonial.photo];
    return profile1; // Default fallback
  };

  const baseCard =
  "group relative overflow-hidden transition-all duration-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer select-none " +
  "shadow-[0_8px_25px_rgba(0,0,0,0.25)] bg-[#f4f4f4] text-gray-900 " +
  "hover:scale-[1.02] sm:hover:scale-[1.04] hover:shadow-[0_15px_35px_rgba(0,0,0,0.35)] " +
  "sm:hover:[transform:rotateX(-5deg)_rotateY(-10deg)_rotateZ(2deg)] " +
  "h-auto min-h-[200px] sm:h-64" ;

  const hoverGradient =
    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-900 " +
    "bg-gradient-to-b from-[#FFEEC3] via-[#DFB13B] to-[#3D2D06]";

  const glossLayer =
    "absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-40 pointer-events-none";

  const contentWrapper = "relative z-10";

  return (
    <section id="testimonial" className="py-10 sm:py-20 bg-white font-inter px-3 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl text-gray-900 max-w-full sm:max-w-[600px] leading-tight">
            {t('testimonials.title')}
          </h2>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-white border border-yellow-500 text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-yellow-500 hover:text-white transition flex items-center text-sm sm:text-base"
          >
            {t('services.schedule_now')} <img src={MasterPrimaryButton} alt="" className="h-5 w-5 sm:h-7 sm:w-7 ml-2"/>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-yellow-500"></div>
          </div>
        )}

        {/* Testimonial Cards */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {testimonials.map((t) => (
              <div key={t._id} className={baseCard}>
                <div className={hoverGradient}></div>
                <div className={glossLayer}></div>

                <div className={contentWrapper}>
                  <div className="flex items-center mb-3 sm:mb-4">
                    <img
                      src={getPhotoSrc(t)}
                      alt={t.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{t.name}</p>
                      <p className="text-xs sm:text-sm opacity-80">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-gray-50 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Close Button */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-2 transition z-50 shadow-md"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Booking Component */}
            <div className="relative">
              <Booking onClose={() => setIsBookingModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonial;
