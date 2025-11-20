import trustedImage from '../../assets/trusted.png';
import frame7 from '../../assets/frame7.png';

const RHeroSection = () => {
  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-8 mt-8">
      {/* Trusted Partners Badge - Positioned to overlap with hero section */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white rounded-full px-5 py-4 shadow-lg flex items-center gap-3">
          <img
            src={trustedImage}
            alt="Trusted by 1000+ Partners"
            className="h-7 object-contain"
          />
        </div>
      </div>

      {/* Main Hero Container with rounded corners and top notch */}
      <div
        className="relative min-h-[400px] md:min-h-[550px] bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${frame7})`,
          borderRadius: '32px',
          marginTop: '40px'
        }}
      >
        {/* Notch cut-out at the top - matching the badge curve */}


        {/* Main Content */}
        <div className="container mx-auto px-6 h-full min-h-[400px] md:min-h-[550px] flex items-center pt-12">
          <div className="grid md:grid-cols-2 gap-8 w-full items-center">
            {/* Left Side - Text Content */}
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-tight">
                Find Out the<br />
                <span className="italic font-light">Best Stay.</span>
              </h1>
            </div>

            {/* Right Side - CTA */}
            <div className="flex flex-col items-end space-y-4">
              <p className="text-white text-base md:text-lg lg:text-xl text-right max-w-[400px]">
                Luxury villas in the stunning volcanic landscape of Lanzarote
              </p>
              <button className="group bg-white/30 backdrop-blur-md border-2 border-[#4F82BE] hover:bg-white hover:text-gray-900 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-xl font-medium transition-all shadow-lg flex items-center gap-3">
                <span className="font-semibold">Reserve Your Stay</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
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
