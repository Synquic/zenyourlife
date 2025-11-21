
import { useNavigate } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import blueArrow from '../assets/bluearrow.png';

const Footer = () => {
  // const navigate = useNavigate();
  return (
    <footer  className="bg-gray-900 text-white min-h-screen py-16">
      {/* Booking Section */}
      <section className="mx-4 my-8 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-r from-[#4A90E2] via-[#4F82BE] to-[#4F82BE] rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-400/30">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 px-8 md:px-12 py-12 md:py-16 flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Left Side - Text Content */}
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-white text-sm font-medium">Contact</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-medium text-white leading-tight">
                 Welcome to a world whereluxury meets serenity
                </h2>
              </div>

              {/* Right Side - Button */}
              <div className="flex-shrink-0">
                <button  className="relative bg-white/30 backdrop-blur-md border-2 border-white hover:bg-white/40 text-white px-6 py-3 rounded-lg transition-all text-base font-medium flex items-center gap-3 shadow-lg cursor-pointer overflow-hidden group">
                  {/* Glass shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50"></div>
                  <span className="font-semibold relative z-10">Reserve Now</span>
                  <div className="w-8 h-8 rounded-md flex items-center justify-center relative z-10">
                    <img src={blueArrow} alt="arrow" className="w-8 h-8" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-4">zenyourlife.be</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 w-62">
              This is the little note about products and this little note.
              This place like website (it's also still place like note) is
              currently under slight updates.
            </p>
            <button className="text-yellow-400 hover:text-yellow-300">
              See About →
            </button>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Massage</a></li>
              <li><a href="#" className="hover:text-white">Facial Care</a></li>
              <li><a href="#" className="hover:text-white">PMU</a></li>
              <li><a href="#" className="hover:text-white">Transport</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-2 mt-1" />
                <span>+32 123 456 789</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-1" />
                <span>info@zenyouths.be</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Location</h4>
            <p className="text-gray-400 text-sm mb-4">
              <MapPin className="w-4 h-4 inline mr-2" />
              Wellness center city, Villas 3<br />© Web - contact
            </p>
            <div className="flex space-x-2 mt-4">
              <span className="text-gray-400 text-sm">Languages:</span>
              <button className="text-white hover:text-yellow-400">En</button>
              <button className="text-gray-400 hover:text-white">Fr</button>
              <button className="text-gray-400 hover:text-white">De</button>
              <button className="text-gray-400 hover:text-white">Ge</button>
              <button className="text-gray-400 hover:text-white">No</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="#"
              className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
            >
              <Youtube size={20} />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 zenyouths.be. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
