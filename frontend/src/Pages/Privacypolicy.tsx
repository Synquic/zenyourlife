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
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[800px] pb-5' : 'max-h-0'}`}
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

interface LegalPageData {
  pageTitle: string
  lastUpdated: string
  introduction?: string
  sections: Section[]
}

const Privacypolicy = () => {
  const [openSection, setOpenSection] = useState<string | null>('personalData')
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
        const response = await fetch(`${API_BASE_URL}/legal-pages/privacy-policy?language=${lang}`)
        const result = await response.json()
        if (result.success && result.data) {
          setPageData(result.data)
          // Open first section by default
          if (result.data.sections?.length > 0) {
            setOpenSection(result.data.sections[0].key)
          }
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLegalPage()
  }, [i18n.language])

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
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
            {pageData?.pageTitle || 'Privacy Policy - Zenyourlife'}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last Updated: {pageData?.lastUpdated || 'December 2024'}
          </p>

          {/* Introduction */}
          {pageData?.introduction && (
            <div className="mb-12">
              <p className="text-sm text-gray-600 leading-relaxed">
                {pageData.introduction}
              </p>
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

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              If you have any questions about our Privacy Policy, please contact us at{' '}
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

export default Privacypolicy
