import React from 'react'
import service1 from "../assets/service 1.png";
import service2 from "../assets/service 2.png";
const Service = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-yellow-500 text-sm font-semibold block mb-2 text-center">— Overview</span>
          <h2 className="text-4xl font-serif text-gray-900 mb-12 text-center">What We Do?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80" 
                alt="Therapeutic Massage"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Therapeutic Massage & Bodywork
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our massages aren't just about relaxation - they're designed to release built-up tension, relieves chronic muscle tension, improve flexibility, and align your nervous system to a multi-neutral base. From hot stone, deep tissue, to sports massage, every technique is chosen to help you reconnect with your body.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80" 
                alt="Holiday Stays"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Curated Holiday Stays in Lanzarote
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We've partnered with carefully selected accommodations in Lanzarote where it's beautiful, sustainable easy access for retreats. This ensures a space where you can exhale properly while staying in sync with surrounding nature's rhythms. Think rest, not just relaxing in pool.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Service