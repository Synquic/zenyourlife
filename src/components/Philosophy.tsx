import React from 'react'

const Philosophy = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-yellow-50 to-white relative overflow-hidden -mt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">

        {/* Transparent Dot with Intense Rainbow Arcs */}
        <div className="relative mx-auto w-fit mb-12">

          {/* Red Arc */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-20 rounded-full
                          border-t-4 border-red-600 opacity-100 blur-2xl"
               style={{ transform: 'rotate(-20deg)' }}>
          </div>

          {/* Yellow Arc */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-20 rounded-full
                          border-t-4 border-yellow-600 opacity-100 blur-2xl"
               style={{ transform: 'rotate(0deg)' }}>
          </div>

          {/* Blue Arc */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-20 rounded-full
                          border-t-4 border-blue-600 opacity-100 blur-2xl"
               style={{ transform: 'rotate(20deg)' }}>
          </div>

          {/* Transparent Dot Source */}
          <div className="w-3 h-3 bg-white/0 rounded-full relative z-10 mx-auto shadow-lg"></div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8 relative z-10">
          Our Philosophy
        </h2>

        {/* Bottom Dotted Line */}
        <div className="w-full border-b-2 border-dotted border-gray-300 mb-8"></div>

        {/* Paragraphs */}
        <p className="text-gray-700 text-lg mb-6 font-medium">
          Most wellness brands promise instant transformation. We don't.
          What we offer is simpler — small, intentional experiences that leave a lasting impact.
        </p>

        <p className="text-gray-600 leading-relaxed mb-6 text-base">
          Whether it's the warmth of a hot stone massage easing your tension or waking up in a rental home overlooking the volcanic landscape of Lanzarote, our goal is the same:
          help you reconnect with yourself in ways that genuinely matter.
        </p>

        <p className="text-gray-600 leading-relaxed text-base">
          Wellness isn't a trend. It's a practice. And we design everything around that truth.
        </p>
      </div>
    </section>
  )
}

export default Philosophy
