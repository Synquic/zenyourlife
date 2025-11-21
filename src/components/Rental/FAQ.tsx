import { useState } from 'react';
import blueArrow from '../../assets/bluearrow.png';
import lock2 from '../../assets/lock2.png';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const faqs = [
    {
      question: "What's included in each rental?",
      answer: "Each rental includes fully furnished accommodation with kitchen appliances, linens, towels, WiFi, and utilities. Some properties may also include parking and access to shared amenities."
    },
    {
      question: "How far are the rentals from Lanzarote's main attractions?",
      answer: "It depends on where you book. Coastal homes are minutes from beaches, while countryside stays sit close to volcanic trails and nature spots. Each listing includes an exact map and distance highlights so you know exactly what you're getting into."
    },
    {
      question: "Is early check-in or late check-out possible?",
      answer: "Early check-in and late check-out are subject to availability and may incur additional charges. Please contact us in advance to arrange special timing for your stay."
    },
    {
      question: "Are the rentals suitable for families or groups?",
      answer: "Yes! We offer a variety of properties that accommodate different group sizes, from cozy studios to spacious villas perfect for families and large groups."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Side */}
          <div className="flex flex-col">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-blue-400 rounded-full text-sm text-blue-600 mb-6 -mt-20 w-fit">
              <span className="text-blue-400">
                <img src={lock2} alt="" />
                </span> FAQs
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-4xl font-semibold text-gray-900 mb-6 leading-tight -mt-5">
              FAQs related to<br />
              Lanzarote Experience
            </h2>

            {/* Still Have Questions Section */}
            <div className="mt-10 bg-blue-50 rounded-2xl p-8 border border-blue-100 w-[420px] flex flex-col justify-between h-[280px]">
              <div>
                <h3 className="text-3xl md:text-3xl font-semibold text-blue-600 mb-4">
                  Still Have<br />
                  Questions?
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Not finding the answer you're looking for? Tell us what you need - we'll point you in the right direction without the back-and-forth.
                </p>
              </div>

              {/* Contact Button */}
              <button className="bg-white/30 backdrop-blur-md border-2 border-[#6F7BF8] text-gray-900 px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 hover:bg-white/40 transition-all shadow-lg w-fit">
                Contact Us
                <div className="w-6 h-6  rounded-md flex items-center justify-center">
                  <img src={blueArrow} alt="arrow" className="w-6 h-6" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-4"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-start justify-between text-left py-4 focus:outline-none group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-gray-400 font-medium text-lg mt-1">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-semibold text-lg transition-colors ${
                      openIndex === index ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {faq.question}
                    </span>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    {openIndex === index ? (
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v12m6-6H6"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                {openIndex === index && (
                  <div className="pl-14 pr-10 pb-4 animate-fadeIn">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;