
import profile1 from "../assets/profile1.png";
import profile2 from "../assets/profile2.png";
import profile3 from "../assets/profile3.png";
import profile4 from "../assets/profile4.png";
import MasterPrimaryButton from "../assets/Master Primary Button (4).png";

const Testimonial = () => {
  const baseCard =
  "group relative overflow-hidden transition-all duration-500 rounded-2xl p-6 cursor-pointer select-none " +
  "shadow-[0_8px_25px_rgba(0,0,0,0.25)] bg-[#f4f4f4] text-gray-900 " +
  "hover:scale-[1.04] hover:shadow-[0_15px_35px_rgba(0,0,0,0.35)] " +
  "hover:[transform:rotateX(-5deg)_rotateY(-10deg)_rotateZ(2deg)] " +
  "h-64" ; // example fixed height


  const hoverGradient =
    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-900 " +
    "bg-gradient-to-b from-[#FFEEC3] via-[#DFB13B] to-[#3D2D06]";

  const glossLayer =
    "absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-40 pointer-events-none";

  const contentWrapper = "relative z-10";

  // Array of testimonial objects
  const testimonials = [
    {
      name: "Dave Nash",
      role: "@once",
      text: "After exploring the @Kundkund platform for a few months, I finally took the plunge. Wow, it’s a game changer! Just give it a shot! You won't regret it! 🤘🏻",
      photo: profile1,
    },
    {
      name: "Sebas",
      role: "@sebasbedoya",
      text: "Once you start using @Kundkund, there's no going back. It has completely transformed my approach to finance. Analyzing IPOs and comparing brokers has never been easier! 🔥🔥",
      photo: profile2,
    },
    {
      name: "Dylan Pearson",
      role: "@dylanbusiness",
      text: "Kundkund - The Tesla of financial services. A brief consultation with their expert nearly doubled my investment returns. Just imagine what their platform can do for you! The future is bright. #Kundkund ☀",
      photo:profile1,
    },
    {
      name: "Piero Madu",
      role: "@pieromadu",
      text: "@Kundkund has revolutionized my investment strategy. Utilizing their services is essential for maximizing returns and navigating the complexities of finance! ⚡",
      photo: profile3,
    },
    {
      name: "George Klein",
      role: "@GeorgeBlue94",
      text: "Kundkund is the culmination of a year’s work and contributions from many experts. Financial analysis is here to stay. Kundkund is the future of finance! 💎",
      photo: profile4,
    },
    {
      name: "Jordan Welch",
      role: "@jrdn.w",
      text: "I was part of the beta launch... absolutely mind-blowing. Managing my investments has never been easier. @Kundkund is by far my go-to platform",
      photo: profile2,
    },
    {
      name: "Faiz W",
      role: "@Faiz",
      text: "Incredible! @Kundkund elevates your financial game. My investment portfolio grew by 15% in no time! 😱",
      photo: profile3,
    },
    {
      name: "Dave Nash",
      role: "@once",
      text: "After exploring the @Kundkund platform for a few months, I finally took the plunge. Wow, it’s a game changer! Just give it a shot! You won't regret it! 🤘🏻",
      photo: profile1,
    },
  ];

  return (
    <section className="py-20 bg-white font-inter px-8 sm:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-5xl  text-gray-900 w-[600px] leading-tight">
            What our clients say about their experience
          </h2>

          <button className="bg-white border border-yellow-500 text-gray-900 px-6 py-3 rounded-xl hover:bg-yellow-500 hover:text-white transition flex items-center">
            Schedule Now <img src={MasterPrimaryButton} alt=""  className="h-7 w-7 ml-2"/>
          </button>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          {testimonials.map((t, index) => (
            <div key={index} className={baseCard}>
              <div className={hoverGradient}></div>
              <div className={glossLayer}></div>

              <div className={contentWrapper}>
                <div className="flex items-center mb-4">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm opacity-80">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
