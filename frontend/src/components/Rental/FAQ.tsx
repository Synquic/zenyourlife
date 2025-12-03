import { useState } from 'react';
import blueArrow from '../../assets/bluearrow.png';
import lock2 from '../../assets/lock2.png';
import { useTranslation } from "react-i18next";

interface FAQProps {
  onContactClick?: () => void;
}

const FAQ = ({ onContactClick }: FAQProps) => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const faqs = [
    {
      question: t('rental.faq.q1'),
      answer: t('rental.faq.a1')
    },
    {
      question: t('rental.faq.q2'),
      answer: t('rental.faq.a2')
    },
    {
      question: t('rental.faq.q3'),
      answer: t('rental.faq.a3')
    },
    {
      question: t('rental.faq.q4'),
      answer: t('rental.faq.a4')
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id='faq' className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Side */}
          <div className="flex flex-col">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 border border-blue-400 rounded-full text-xs sm:text-sm text-blue-600 mb-4 sm:mb-6 mt-0 md:-mt-20 w-fit">
              <span className="text-blue-400">
                <img src={lock2} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
              </span> {t('rental.faq.badge')}
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight mt-0 md:-mt-5">
              {t('rental.faq.title_1')}<br />
              {t('rental.faq.title_2')}
            </h2>

            {/* Still Have Questions Section */}
            <div className="mt-6 sm:mt-10 bg-blue-50 rounded-2xl p-5 sm:p-8 border border-blue-100 w-full max-w-[420px] flex flex-col justify-between min-h-[220px] sm:h-[280px]">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-600 mb-3 sm:mb-4">
                  {t('rental.faq.still_questions')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                  {t('rental.faq.still_questions_desc')}
                </p>
              </div>

              {/* Contact Button */}
              <button onClick={onContactClick} className="bg-white/30 backdrop-blur-md border-2 border-[#6F7BF8] text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 sm:gap-3 hover:bg-white/40 transition-all shadow-lg w-fit">
                {t('rental.faq.contact_us')}
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center">
                  <img src={blueArrow} alt="arrow" className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-3 sm:pb-4"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-start justify-between text-left py-3 sm:py-4 focus:outline-none group"
                >
                  <div className="flex items-start gap-2 sm:gap-4 flex-1">
                    <span className="text-gray-400 font-medium text-sm sm:text-lg mt-0.5 sm:mt-1">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-semibold text-sm sm:text-lg transition-colors ${
                      openIndex === index ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {faq.question}
                    </span>
                  </div>

                  <div className="ml-2 sm:ml-4 flex-shrink-0">
                    {openIndex === index ? (
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
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
                        className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
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
                  <div className="pl-8 sm:pl-14 pr-4 sm:pr-10 pb-3 sm:pb-4 animate-fadeIn">
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
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