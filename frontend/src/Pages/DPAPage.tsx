import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { ChevronDown } from 'lucide-react'
import Footer from '../components/Footer'
import { useTranslation } from 'react-i18next'
import { API_BASE_URL } from "../config/api";

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

const AccordionItem = ({ title, children, isOpen, onToggle }: AccordionItemProps) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1200px] pb-5' : 'max-h-0'}`}
      >
        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {children}
        </div>
      </div>
    </div>
  )
}

interface Section {
  key: string
  title: string
  content: string
}

interface Party {
  name: string
  role: string
  email?: string
}

interface LegalPageData {
  pageTitle: string
  lastUpdated: string
  sections: Section[]
  additionalSections?: Section[]
  parties?: {
    controller: Party
    processor: Party
  }
}

const DPAPage = () => {
  const [openSection, setOpenSection] = useState<string | null>('subject')
  const [pageData, setPageData] = useState<LegalPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const { i18n } = useTranslation()

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Fetch legal page content when language changes
  useEffect(() => {
    const fetchLegalPage = async () => {
      setLoading(true)
      try {
        const lang = i18n.language?.substring(0, 2) || 'en'
        const response = await fetch(`${API_BASE_URL}/legal-pages/dpa?language=${lang}`)
        const result = await response.json()
        if (result.success && result.data) {
          setPageData(result.data)
          // Open first section by default
          if (result.data.sections?.length > 0) {
            setOpenSection(result.data.sections[0].key)
          }
        }
      } catch (error) {
        console.error('Error fetching DPA:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLegalPage()
  }, [i18n.language])

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  // Get translated labels
  const getBetweenLabel = () => {
    const lang = i18n.language?.substring(0, 2) || 'en'
    const labels: { [key: string]: string } = {
      en: 'Between:',
      fr: 'Entre :',
      de: 'Zwischen:',
      nl: 'Tussen:'
    }
    return labels[lang] || labels.en
  }

  const getAndLabel = () => {
    const lang = i18n.language?.substring(0, 2) || 'en'
    const labels: { [key: string]: string } = {
      en: 'and',
      fr: 'et',
      de: 'und',
      nl: 'en'
    }
    return labels[lang] || labels.en
  }

  const getAdditionalLegalLabel = () => {
    const lang = i18n.language?.substring(0, 2) || 'en'
    const labels: { [key: string]: string } = {
      en: 'Additional Legal Text for Lanzarote',
      fr: 'Texte juridique supplémentaire pour Lanzarote',
      de: 'Zusätzlicher Rechtstext für Lanzarote',
      nl: 'Aanvullende juridische tekst voor Lanzarote'
    }
    return labels[lang] || labels.en
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4af37]"></div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-20">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            {pageData?.pageTitle || 'Data Processing Agreement (DPA)'}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last Updated: {pageData?.lastUpdated || 'December 2024'}
          </p>

          {/* Parties Section */}
          {pageData?.parties && (
            <div className="mb-12 bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{getBetweenLabel()}</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">{pageData.parties.controller.name}</p>
                  <p className="text-sm text-gray-600">{pageData.parties.controller.role}</p>
                  {pageData.parties.controller.email && (
                    <p className="text-sm text-gray-600">
                      Email:{' '}
                      <a href={`mailto:${pageData.parties.controller.email}`} className="text-[#d4af37] hover:underline">
                        {pageData.parties.controller.email}
                      </a>
                    </p>
                  )}
                </div>
                <div className="text-gray-500 text-sm">{getAndLabel()}</div>
                <div>
                  <p className="font-medium text-gray-900">{pageData.parties.processor.name}</p>
                  <p className="text-sm text-gray-600">{pageData.parties.processor.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Accordion Sections */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            {pageData?.sections?.map((section, index) => (
              <AccordionItem
                key={section.key}
                title={`${index + 1}. ${section.title}`}
                isOpen={openSection === section.key}
                onToggle={() => toggleSection(section.key)}
              >
                {section.content}
              </AccordionItem>
            ))}
          </div>

          {/* Additional Legal Text for Lanzarote */}
          {pageData?.additionalSections && pageData.additionalSections.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-serif text-gray-900 mb-6">
                {getAdditionalLegalLabel()}
              </h2>

              <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                {pageData.additionalSections.map((section) => (
                  <AccordionItem
                    key={section.key}
                    title={section.title}
                    isOpen={openSection === section.key}
                    onToggle={() => toggleSection(section.key)}
                  >
                    {section.content}
                  </AccordionItem>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              If you have any questions about this Data Processing Agreement, please contact us at{' '}
              <a href="mailto:info@zenyourlife.be" className="text-[#d4af37] hover:underline">
                info@zenyourlife.be
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default DPAPage
