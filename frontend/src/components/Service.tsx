import { useTranslation } from "react-i18next";

const Service = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-b from-white to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-yellow-500 text-sm font-semibold block mb-2 text-center">— {t('nav.overview')}</span>
          <h2 className="text-4xl font-serif text-gray-900 mb-12 text-center">{t('about.what_we_do')}</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80"
                alt="Therapeutic Massage"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('about.therapeutic_massage_title')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.therapeutic_massage_desc')}
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
                  {t('about.holiday_stays_title')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.holiday_stays_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Service
