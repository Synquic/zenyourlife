import set1 from '../../assets/set1.png';
import set2 from '../../assets/set2.png';
import set3 from '../../assets/set3.png';

const Overview = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Overview Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="text-blue-600 font-medium text-sm">Overview</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 leading-tight">
            Find a Space That Feels<br />
            Like Your Island Home
          </h2>
        </div>

        {/* Description */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
            Lanzarote isn't just a destination — it's a rhythm. Volcanic cliffs,
            whitewashed villages, black-sand beaches, and quiet pockets
            of calm you won't find anywhere else. Our curated stays are
            designed to help you slip into that rhythm effortlessly.
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Whether you want ocean views, total seclusion, or a modern
            base close to Lanzarote's cultural spots, you'll find a place here
            that feels comfortably yours.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Villas Card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-56">
              <img
                src={set3}
                alt="Villas"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Villas
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Spacious, private, and perfect for families or
                long stays.
              </p>
            </div>
          </div>

          {/* Countryside Homes Card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-56">
              <img
                src={set2}
                alt="Countryside Homes"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Countryside Homes
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Slow living surrounded by volcanic landscapes.
              </p>
            </div>
          </div>

          {/* Luxury Stays Card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-56">
              <img
                src={set1}
                alt="Luxury Stays"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Luxury Stays
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                High-end interiors, premium amenities, and
                total tranquility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;