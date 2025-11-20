import s1 from '../../assets/s1.png';
import s2 from '../../assets/s2.png';
import s3 from '../../assets/s3.png';
import s4 from '../../assets/s4.png';

const Service = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Services Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-blue-400 rounded-full text-sm text-blue-600">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            Services
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
            Experience Lanzarote
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the unique volcanic landscapes, pristine beaches, and year-round sunshine of this stunning Canary Island destination.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {/* CARD 1 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-5 pb-3">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">300+</h3>
              <p className="text-xs text-gray-500">Days of Sunshine</p>
            </div>

            {/* — Improved image + fade overlay */}
            <div className="w-full h-40 overflow-hidden relative">
              {/* Image: ensure it is below overlay (z-10) */}
              <img
                src={s4}
                alt="Days of Sunshine"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 z-10 block"
              />

              {/* Stronger bottom fade: shorter height, stronger white */}
              <div
                className="absolute bottom-0 left-0 right-0 h-28 z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(255,255,255,1) 15%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.6) 65%, rgba(255,255,255,0))",
                }}
              />
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-5 pb-3">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">100+</h3>
              <p className="text-xs text-gray-500">Volcanic Beaches</p>
            </div>

            <div className="w-full h-40 overflow-hidden relative">
              <img
                src={s2}
                alt="Volcanic Beaches"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 z-10 block"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-28 z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(255,255,255,1) 15%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.6) 65%, rgba(255,255,255,0))",
                }}
              />
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-5 pb-3">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">22°C</h3>
              <p className="text-xs text-gray-500">Avg. Temperature</p>
            </div>

            <div className="w-full h-40 overflow-hidden relative">
              <img
                src={s3}
                alt="Average Temperature"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 z-10 block"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-28 z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(255,255,255,1) 15%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.6) 65%, rgba(255,255,255,0))",
                }}
              />
            </div>
          </div>

          {/* CARD 4 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-5 pb-3">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">UNESCO</h3>
              <p className="text-xs text-gray-500">Biosphere Reserve</p>
            </div>

            <div className="w-full h-40 overflow-hidden relative">
              <img
                src={s1}
                alt="UNESCO Biosphere Reserve"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 z-10 block"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-28 z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(255,255,255,1) 15%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.6) 65%, rgba(255,255,255,0))",
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Service;
