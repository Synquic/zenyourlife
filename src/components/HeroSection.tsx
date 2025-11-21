
import Frame1 from "../assets/Frame1.jpg";

const HeroSection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 mt-16">
      {/* Card Container */}
      <div className="relative max-w-7xl mx-auto h-[600px] rounded-3xl overflow-hidden">
        
        {/* Background Image */}
        <img
          src={Frame1}
          alt="Wellness"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Black Gradient Overlay from Left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 via-40% to-transparent"></div>

        {/* Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-2xl px-8 md:px-16">
            <span className="inline-block bg-gray-700/80 text-white px-5 py-2 rounded-full text-sm mb-6">
              About Us
            </span>

            <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-[0_0_20px_white]">
  Wellness, Comfort and Mindful Living - All in One Place
</h1>

            <p className="text-white text-base mb-8 leading-relaxed max-w-[500px]">
              At Zenyouths, we believe that taking care of yourself shouldn't feel
              like a luxury you finally got around to — it should feel natural. So we
              set out to create a space where body, mind, and environment work
              together instead of fighting for your attention.
            </p>

            <button className="bg-gray-700/50 backdrop-blur border border-white/30 text-white px-8 py-3 rounded-lg hover:bg-gray-600/50 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;