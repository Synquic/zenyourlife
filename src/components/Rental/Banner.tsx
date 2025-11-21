// import React from 'react';
import blueArrow from '../../assets/bluearrow.png';
import lock2 from '../../assets/lock2.png';

const Banner = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative max-w-6xl mx-auto bg-gradient-to-r from-sky-200 via-sky-300 to-sky-400 rounded-2xl overflow-hidden shadow-xl border border-sky-300">
        {/* Cloud/Sky Background Pattern */}
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <div className="absolute top-2 right-16 w-40 h-20 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-8 right-32 w-48 h-24 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-4 right-56 w-36 h-18 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-72 w-32 h-16 bg-white rounded-full blur-2xl"></div>
        </div>

        {/* Diagonal Divider Line */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-400/40 to-transparent transform -skew-x-12 origin-center"></div>
        </div>

        {/* Right Side - Mountain Image (Full Height) with Diagonal Clip */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop"
              alt="snowy mountains"
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 md:px-12 py-10 md:py-12">
          {/* Left Side - Contact Badge & Heading */}
          <div className="flex flex-col items-start gap-5 flex-1">
            {/* Contact Badge */}
            <button className="bg-white/60 backdrop-blur-sm border border-white/80 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 hover:bg-white/70 transition-all shadow-sm text-slate-700">
              <span className="text-base">
                <img src={lock2} alt="" />
                </span> Contact
            </button>

            {/* Heading */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                Book your Stay for a<br />
                rejuvenating experience
              </h2>
            </div>
          </div>

          {/* Right Side - Book Now Button */}
          <div className="mt-6 md:mt-0 relative z-20">
            <button className="relative bg-white/30 backdrop-blur-md border-2 border-white text-slate-800 px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 hover:bg-white/40 transition-all shadow-lg overflow-hidden group">
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50"></div>
              <span className="relative z-10">Book Now</span>
              <div className="w-6 h-6 rounded-md flex items-center justify-center relative z-10">
                <img src={blueArrow} alt="arrow" className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;