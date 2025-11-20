import React from "react";
import apat1 from "../../assets/Apat1.png";
import apat2 from "../../assets/Apat2.png";
import blueArrow from "../../assets/bluearrow.png";

const Card = ({ title, price, image }) => (
  <div className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-start">

    {/* LEFT — Image */}
    <div className="w-full md:w-1/3">
      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover rounded-xl"
      />
    </div>

    {/* MIDDLE — Text & Icons */}
    <div className="flex flex-col justify-between md:w-1/3">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600 text-sm mt-1">
          Modern oceanfront villa with infinity pool.
        </p>
      </div>

      {/* Icons Row */}
      <div className="mt-4 space-y-3 text-gray-700">
        <div className="flex items-center gap-3">
          <span>👥</span> <span>8 guests</span>
        </div>
        <div className="flex items-center gap-3">
          <span>🛏️</span> <span>4 bedrooms</span>
        </div>
        <div className="flex items-center gap-3">
          <span>🚗</span> <span>Covered Parking for 2</span>
        </div>
      </div>

      <p className="text-blue-600 font-medium text-sm mt-4 cursor-pointer">
        Meet the Host →
      </p>
    </div>

    {/* RIGHT — Price + Rules */}
    <div className="md:w-1/3 flex flex-col justify-between">
      <div className="flex items-end gap-2">
        <h2 className="text-3xl font-bold text-blue-600">€{price}</h2>
        <span className="text-gray-500">per night</span>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Cleanliness</h3>
        <p className="text-gray-600 text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Amenities</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Infinity Pool <br />
          High-Speed WIFI <br />
          Free Parking
        </p>
      </div>

      <button className="mt-6 flex items-center justify-center gap-2 bg-white/30 backdrop-blur-md border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-xl shadow-md hover:bg-white/50 transition-all w-fit font-medium">
        Book Now
        <img src={blueArrow} alt="arrow" className="w-5 h-5" />
      </button>
    </div>

  </div>
);

const Apartment = () => {

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      {/* Apartments Section */}
      <div className="bg-blue-50 rounded-2xl p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Apartments</h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam.
          </p>
        </div>

        {/* Cards Section */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Card 1 */}
          <Card
            title="Lanzarote"
            price={350}
            image={apat2}
          />

          {/* Card 2 */}
          <Card
            title="Casa Miramar"
            price={350}
            image={apat1}
          />
        </div>
      </div>

    </div>
  );
};

export default Apartment;
