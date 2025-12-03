import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Bell, Plus, Edit2, Trash2, X, Save, Loader2, Sparkles, Clock, DollarSign, Filter, ChevronDown, Eye, EyeOff, LayoutGrid, List, Heart, Users, FileText, Image, Upload, Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'

const API_BASE_URL = 'http://localhost:5000/api'

// Available images for selection with colors
const availableImages = [
  { name: 'm1.png', label: 'Massage 1', color: 'from-rose-400 to-rose-600' },
  { name: 'm2.png', label: 'Massage 2', color: 'from-violet-400 to-violet-600' },
  { name: 'm3.png', label: 'Massage 3', color: 'from-blue-400 to-blue-600' },
  { name: 'm4.png', label: 'Massage 4', color: 'from-cyan-400 to-cyan-600' },
  { name: 'm5.png', label: 'Massage 5', color: 'from-emerald-400 to-emerald-600' },
  { name: 'm6.png', label: 'Massage 6', color: 'from-amber-400 to-amber-600' },
  { name: 'm7.png', label: 'Massage 7', color: 'from-orange-400 to-orange-600' },
  { name: 'm8.png', label: 'Massage 8', color: 'from-pink-400 to-pink-600' },
  { name: 'm9.png', label: 'Massage 9', color: 'from-indigo-400 to-indigo-600' },
]

// Category configurations
const categories = [
  { value: 'massage', label: 'Massage', color: 'from-blue-400 to-blue-600', bgLight: 'bg-blue-50', textColor: 'text-blue-600' },
  { value: 'facial', label: 'Facial', color: 'from-pink-400 to-pink-600', bgLight: 'bg-pink-50', textColor: 'text-pink-600' },
  { value: 'pmu', label: 'PMU', color: 'from-purple-400 to-purple-600', bgLight: 'bg-purple-50', textColor: 'text-purple-600' },
  { value: 'therapy', label: 'Therapy', color: 'from-emerald-400 to-emerald-600', bgLight: 'bg-emerald-50', textColor: 'text-emerald-600' },
]

interface ContentSection {
  title: string
  description: string
}

interface ServiceBenefit {
  description: string
}

interface ServiceTargetAudience {
  description: string
}

interface ServiceImage {
  url: string
  caption: string
}

interface Service {
  _id: string
  title: string
  description: string
  category: string
  duration: number
  price: number
  image: string
  imageUrl?: string
  isActive: boolean
  displayOrder: number
  contentSections?: ContentSection[]
  benefits?: ServiceBenefit[]
  targetAudience?: ServiceTargetAudience[]
  serviceImages?: ServiceImage[]
}

interface ServiceFormData {
  title: string
  description: string
  category: string
  duration: number
  price: number
  image: string
  imageUrl: string
  isActive: boolean
  contentSections: ContentSection[]
  benefits: ServiceBenefit[]
  targetAudience: ServiceTargetAudience[]
  serviceImages: ServiceImage[]
}

interface BenefitItem {
  _id?: string
  description: string
}

interface TargetAudienceItem {
  _id?: string
  description: string
}

interface ServicePageContent {
  _id?: string
  benefits: BenefitItem[]
  targetAudience: TargetAudienceItem[]
  benefitsTitle: string
  targetAudienceTitle: string
}

const initialFormData: ServiceFormData = {
  title: '',
  description: '',
  category: 'massage',
  duration: 60,
  price: 0,
  image: 'm1.png',
  imageUrl: '',
  isActive: true,
  contentSections: [],
  benefits: [],
  targetAudience: [],
  serviceImages: []
}

const Services = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  // Service Page Content state (Benefits & Target Audience)
  const [servicePageContent, setServicePageContent] = useState<ServicePageContent>({
    benefits: [],
    targetAudience: [],
    benefitsTitle: "Benefits You'll Feel",
    targetAudienceTitle: "Who It's For"
  })
  const [loadingContent, setLoadingContent] = useState(true)
  const [savingContent, setSavingContent] = useState(false)
  const [newBenefit, setNewBenefit] = useState('')
  const [newTargetAudience, setNewTargetAudience] = useState('')
  const [editingBenefitIndex, setEditingBenefitIndex] = useState<number | null>(null)
  const [editingTargetIndex, setEditingTargetIndex] = useState<number | null>(null)
  const [editBenefitText, setEditBenefitText] = useState('')
  const [editTargetText, setEditTargetText] = useState('')

  // Per-service benefits/targetAudience state (for modal)
  const [newServiceBenefit, setNewServiceBenefit] = useState('')
  const [newServiceTarget, setNewServiceTarget] = useState('')

  // Inline editing for service benefits/targetAudience
  const [editingServiceBenefitIndex, setEditingServiceBenefitIndex] = useState<number | null>(null)
  const [editingServiceTargetIndex, setEditingServiceTargetIndex] = useState<number | null>(null)
  const [editServiceBenefitText, setEditServiceBenefitText] = useState('')
  const [editServiceTargetText, setEditServiceTargetText] = useState('')

  // Content sections state (for detailed content like "Energy points: ...")
  const [newContentSectionTitle, setNewContentSectionTitle] = useState('')
  const [newContentSectionDesc, setNewContentSectionDesc] = useState('')
  const [editingContentSectionIndex, setEditingContentSectionIndex] = useState<number | null>(null)
  const [editContentSectionTitle, setEditContentSectionTitle] = useState('')
  const [editContentSectionDesc, setEditContentSectionDesc] = useState('')

  // Service images state (gallery images for service page - max 4)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageUrlInput, setImageUrlInput] = useState('')

  // Fetch services and content
  useEffect(() => {
    fetchServices()
    fetchServicePageContent()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/services`)
      const data = await response.json()

      if (data.success) {
        setServices(data.data)
      } else {
        setError('Failed to fetch services')
      }
    } catch (err) {
      setError('Error connecting to server')
      console.error('Error fetching services:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchServicePageContent = async () => {
    try {
      setLoadingContent(true)
      const response = await fetch(`${API_BASE_URL}/service-page-content`)
      const data = await response.json()

      if (data.success) {
        setServicePageContent(data.data)
      }
    } catch (err) {
      console.error('Error fetching service page content:', err)
    } finally {
      setLoadingContent(false)
    }
  }

  const saveServicePageContent = async () => {
    try {
      setSavingContent(true)
      const response = await fetch(`${API_BASE_URL}/service-page-content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicePageContent)
      })
      const data = await response.json()

      if (data.success) {
        setServicePageContent(data.data)
        alert('Content saved successfully!')
      } else {
        alert('Failed to save content: ' + (data.message || 'Unknown error'))
      }
    } catch (err) {
      console.error('Error saving service page content:', err)
      alert('Error saving content. Please check console for details.')
    } finally {
      setSavingContent(false)
    }
  }

  // Add new benefit
  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return
    const updatedContent = {
      ...servicePageContent,
      benefits: [...servicePageContent.benefits, { description: newBenefit.trim() }]
    }
    setServicePageContent(updatedContent)
    setNewBenefit('')
  }

  // Remove benefit
  const handleRemoveBenefit = (index: number) => {
    const updatedBenefits = servicePageContent.benefits.filter((_, i) => i !== index)
    setServicePageContent({ ...servicePageContent, benefits: updatedBenefits })
  }

  // Start editing benefit
  const handleStartEditBenefit = (index: number) => {
    setEditingBenefitIndex(index)
    setEditBenefitText(servicePageContent.benefits[index].description)
  }

  // Save edited benefit
  const handleSaveEditBenefit = (index: number) => {
    if (!editBenefitText.trim()) return
    const updatedBenefits = [...servicePageContent.benefits]
    updatedBenefits[index] = { ...updatedBenefits[index], description: editBenefitText.trim() }
    setServicePageContent({ ...servicePageContent, benefits: updatedBenefits })
    setEditingBenefitIndex(null)
    setEditBenefitText('')
  }

  // Add new target audience
  const handleAddTargetAudience = () => {
    if (!newTargetAudience.trim()) return
    const updatedContent = {
      ...servicePageContent,
      targetAudience: [...servicePageContent.targetAudience, { description: newTargetAudience.trim() }]
    }
    setServicePageContent(updatedContent)
    setNewTargetAudience('')
  }

  // Remove target audience
  const handleRemoveTargetAudience = (index: number) => {
    const updatedTargetAudience = servicePageContent.targetAudience.filter((_, i) => i !== index)
    setServicePageContent({ ...servicePageContent, targetAudience: updatedTargetAudience })
  }

  // Start editing target audience
  const handleStartEditTarget = (index: number) => {
    setEditingTargetIndex(index)
    setEditTargetText(servicePageContent.targetAudience[index].description)
  }

  // Save edited target audience
  const handleSaveEditTarget = (index: number) => {
    if (!editTargetText.trim()) return
    const updatedTargetAudience = [...servicePageContent.targetAudience]
    updatedTargetAudience[index] = { ...updatedTargetAudience[index], description: editTargetText.trim() }
    setServicePageContent({ ...servicePageContent, targetAudience: updatedTargetAudience })
    setEditingTargetIndex(null)
    setEditTargetText('')
  }

  // Per-service benefit handlers (for modal form)
  const handleAddServiceBenefit = () => {
    if (!newServiceBenefit.trim()) return
    setFormData({
      ...formData,
      benefits: [...formData.benefits, { description: newServiceBenefit.trim() }]
    })
    setNewServiceBenefit('')
  }

  const handleRemoveServiceBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index)
    })
  }

  // Per-service target audience handlers (for modal form)
  const handleAddServiceTarget = () => {
    if (!newServiceTarget.trim()) return
    setFormData({
      ...formData,
      targetAudience: [...formData.targetAudience, { description: newServiceTarget.trim() }]
    })
    setNewServiceTarget('')
  }

  const handleRemoveServiceTarget = (index: number) => {
    setFormData({
      ...formData,
      targetAudience: formData.targetAudience.filter((_, i) => i !== index)
    })
  }

  // Start editing service benefit
  const handleStartEditServiceBenefit = (index: number) => {
    setEditingServiceBenefitIndex(index)
    setEditServiceBenefitText(formData.benefits[index].description)
  }

  // Save edited service benefit
  const handleSaveEditServiceBenefit = (index: number) => {
    if (!editServiceBenefitText.trim()) return
    const updatedBenefits = [...formData.benefits]
    updatedBenefits[index] = { ...updatedBenefits[index], description: editServiceBenefitText.trim() }
    setFormData({ ...formData, benefits: updatedBenefits })
    setEditingServiceBenefitIndex(null)
    setEditServiceBenefitText('')
  }

  // Start editing service target audience
  const handleStartEditServiceTarget = (index: number) => {
    setEditingServiceTargetIndex(index)
    setEditServiceTargetText(formData.targetAudience[index].description)
  }

  // Save edited service target audience
  const handleSaveEditServiceTarget = (index: number) => {
    if (!editServiceTargetText.trim()) return
    const updatedTargetAudience = [...formData.targetAudience]
    updatedTargetAudience[index] = { ...updatedTargetAudience[index], description: editServiceTargetText.trim() }
    setFormData({ ...formData, targetAudience: updatedTargetAudience })
    setEditingServiceTargetIndex(null)
    setEditServiceTargetText('')
  }

  // Content section handlers
  const handleAddContentSection = () => {
    if (!newContentSectionTitle.trim() || !newContentSectionDesc.trim()) return
    setFormData({
      ...formData,
      contentSections: [...formData.contentSections, { title: newContentSectionTitle.trim(), description: newContentSectionDesc.trim() }]
    })
    setNewContentSectionTitle('')
    setNewContentSectionDesc('')
  }

  const handleRemoveContentSection = (index: number) => {
    setFormData({
      ...formData,
      contentSections: formData.contentSections.filter((_, i) => i !== index)
    })
  }

  const handleStartEditContentSection = (index: number) => {
    setEditingContentSectionIndex(index)
    setEditContentSectionTitle(formData.contentSections[index].title)
    setEditContentSectionDesc(formData.contentSections[index].description)
  }

  const handleSaveEditContentSection = (index: number) => {
    if (!editContentSectionTitle.trim() || !editContentSectionDesc.trim()) return
    const updated = [...formData.contentSections]
    updated[index] = { title: editContentSectionTitle.trim(), description: editContentSectionDesc.trim() }
    setFormData({ ...formData, contentSections: updated })
    setEditingContentSectionIndex(null)
    setEditContentSectionTitle('')
    setEditContentSectionDesc('')
  }

  // Service images handlers - drag & drop upload (max 4 images)
  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    // Check max 4 images limit
    const remainingSlots = 4 - formData.serviceImages.length
    if (remainingSlots <= 0) {
      alert('Maximum 4 images allowed per service')
      return
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    setUploadingImage(true)

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formDataUpload = new FormData()
        formDataUpload.append('image', file)

        const response = await fetch(`${API_BASE_URL}/upload/image`, {
          method: 'POST',
          body: formDataUpload
        })

        const data = await response.json()
        if (data.success) {
          return { url: data.data.url, caption: '' }
        }
        throw new Error(data.message || 'Upload failed')
      })

      const uploadedImages = await Promise.all(uploadPromises)
      setFormData(prev => ({
        ...prev,
        serviceImages: [...prev.serviceImages, ...uploadedImages]
      }))
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Error uploading images. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }, [formData.serviceImages.length])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleImageUpload(e.dataTransfer.files)
  }, [handleImageUpload])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveServiceImage = (index: number) => {
    setFormData({
      ...formData,
      serviceImages: formData.serviceImages.filter((_, i) => i !== index)
    })
  }

  // Add image via URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return
    if (formData.serviceImages.length >= 4) {
      alert('Maximum 4 images allowed per service')
      return
    }
    setFormData({
      ...formData,
      serviceImages: [...formData.serviceImages, { url: imageUrlInput.trim(), caption: '' }]
    })
    setImageUrlInput('')
  }

  // Open modal for adding new service
  const handleAddNew = () => {
    setEditingService(null)
    setFormData(initialFormData)
    setNewServiceBenefit('')
    setNewServiceTarget('')
    setNewContentSectionTitle('')
    setNewContentSectionDesc('')
    setEditingServiceBenefitIndex(null)
    setEditingServiceTargetIndex(null)
    setEditServiceBenefitText('')
    setEditServiceTargetText('')
    setShowModal(true)
  }

  // Open modal for editing service
  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      duration: service.duration,
      price: service.price,
      image: service.image,
      imageUrl: service.imageUrl || '',
      isActive: service.isActive,
      contentSections: service.contentSections || [],
      benefits: service.benefits || [],
      targetAudience: service.targetAudience || [],
      serviceImages: service.serviceImages || []
    })
    setNewServiceBenefit('')
    setNewServiceTarget('')
    setNewContentSectionTitle('')
    setNewContentSectionDesc('')
    setEditingServiceBenefitIndex(null)
    setEditingServiceTargetIndex(null)
    setEditingContentSectionIndex(null)
    setEditServiceBenefitText('')
    setEditServiceTargetText('')
    setEditContentSectionTitle('')
    setEditContentSectionDesc('')
    setShowModal(true)
  }

  // Save service (create or update)
  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      const url = editingService
        ? `${API_BASE_URL}/services/${editingService._id}`
        : `${API_BASE_URL}/services`

      const method = editingService ? 'PUT' : 'POST'

      // Debug: Log what's being sent
      console.log('Saving service with data:', formData)
      console.log('serviceImages being sent:', formData.serviceImages)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setShowModal(false)
        fetchServices()
        setFormData(initialFormData)
        setEditingService(null)
      } else {
        alert(data.message || 'Failed to save service')
      }
    } catch (err) {
      console.error('Error saving service:', err)
      alert('Error saving service')
    } finally {
      setSaving(false)
    }
  }

  // Delete service
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        fetchServices()
      } else {
        alert(data.message || 'Failed to delete service')
      }
    } catch (err) {
      console.error('Error deleting service:', err)
      alert('Error deleting service')
    }
  }

  // Toggle active status
  const handleToggleStatus = async (service: Service) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${service._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...service, isActive: !service.isActive })
      })

      const data = await response.json()

      if (data.success) {
        fetchServices()
      }
    } catch (err) {
      console.error('Error toggling status:', err)
    }
  }

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === 'all' || service.category === filterCategory

    return matchesSearch && matchesCategory
  })

  // Get category config
  const getCategoryConfig = (category: string) => {
    return categories.find(c => c.value === category) || categories[0]
  }

  // Get image color
  const getImageColor = (image: string) => {
    const found = availableImages.find(img => img.name === image)
    return found?.color || 'from-gray-400 to-gray-600'
  }

  // Stats
  const totalServices = services.length
  const activeServices = services.filter(s => s.isActive).length
  const avgPrice = services.length > 0
    ? (services.reduce((acc, s) => acc + s.price, 0) / services.length).toFixed(0)
    : '0'

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Services
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage your wellness services and pricing</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-slate-100/80 border-0 rounded-xl text-sm w-64 focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all outline-none"
                />
              </div>
              {/* Notification */}
              <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {/* Profile */}
              <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-violet-500/20">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Services</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{totalServices}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Services</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{activeServices}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Eye className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Avg. Price</p>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-3xl font-bold text-slate-800">${avgPrice}</p>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-slate-300 transition"
                >
                  <Filter className="w-4 h-4" />
                  {filterCategory === 'all' ? 'All Categories' : getCategoryConfig(filterCategory).label}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showFilterDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 min-w-[160px] z-20">
                    <button
                      onClick={() => { setFilterCategory('all'); setShowFilterDropdown(false) }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition ${
                        filterCategory === 'all' ? 'text-violet-600 font-medium bg-violet-50' : 'text-slate-600'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => { setFilterCategory(cat.value); setShowFilterDropdown(false) }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition flex items-center gap-2 ${
                          filterCategory === cat.value ? 'text-violet-600 font-medium bg-violet-50' : 'text-slate-600'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color}`}></span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-violet-100 text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-violet-100 text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <span className="text-sm text-slate-500">
                Showing {filteredServices.length} of {totalServices}
              </span>
            </div>

            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 transition shadow-lg shadow-violet-500/30 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl">
              <Loader2 className="w-10 h-10 animate-spin text-violet-500 mb-4" />
              <span className="text-slate-500">Loading services...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                <X className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium">Connection Error</p>
                <p className="text-sm text-red-500">{error}. Please make sure the backend server is running.</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredServices.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No services found</h3>
              <p className="text-slate-500 mb-6">Get started by adding your first service</p>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>
          )}

          {/* Services Grid */}
          {!loading && !error && filteredServices.length > 0 && viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service, index) => {
                const catConfig = getCategoryConfig(service.category)
                return (
                  <div
                    key={service._id}
                    className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Image */}
                    <div className={`h-36 bg-gradient-to-br ${getImageColor(service.image)} flex items-center justify-center relative`}>
                      <span className="text-5xl font-bold text-white/30">
                        {service.image?.replace('.png', '').toUpperCase() || 'IMG'}
                      </span>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${catConfig.bgLight} ${catConfig.textColor}`}>
                          {catConfig.label}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <button
                        onClick={() => handleToggleStatus(service)}
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold transition ${
                          service.isActive
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </button>

                      {/* Inactive Overlay */}
                      {!service.isActive && (
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                          <EyeOff className="w-8 h-8 text-white/70" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-slate-800 mb-1 truncate">{service.title}</h3>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{service.description}</p>

                      {/* Price & Duration */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{service.duration} mins</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xl font-bold text-violet-600">${service.price}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => handleEdit(service)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition text-sm font-medium"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <div className="w-px h-6 bg-slate-200"></div>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Services List View */}
          {!loading && !error && filteredServices.length > 0 && viewMode === 'list' && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Service</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Category</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Duration</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Price</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => {
                    const catConfig = getCategoryConfig(service.category)
                    return (
                      <tr key={service._id} className="border-t border-slate-100 hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${getImageColor(service.image)} rounded-xl flex items-center justify-center`}>
                              <span className="text-xs font-bold text-white/70">
                                {service.image?.replace('.png', '').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{service.title}</p>
                              <p className="text-xs text-slate-500 truncate max-w-[200px]">{service.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${catConfig.bgLight} ${catConfig.textColor}`}>
                            {catConfig.label}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">{service.duration} mins</td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-violet-600">${service.price}</span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleToggleStatus(service)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                              service.isActive
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {service.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(service)}
                              className="p-2 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(service._id)}
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Service Detail Page Content Section */}

        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-violet-500 to-violet-600 px-8 py-6">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  {editingService ? <Edit2 className="w-7 h-7 text-white" /> : <Plus className="w-7 h-7 text-white" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <p className="text-violet-100 text-sm mt-0.5">
                    {editingService ? 'Update service details' : 'Create a new wellness service'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Swedish Massage"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the service..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white transition-all outline-none resize-none"
                />
              </div>

              {/* Category & Duration Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Duration (minutes)
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      min="0"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              {/* Image Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Image
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {availableImages.map((img) => (
                    <button
                      key={img.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img.name })}
                      className={`relative p-3 rounded-2xl transition-all ${
                        formData.image === img.name
                          ? 'bg-violet-50 border-2 border-violet-500 shadow-lg shadow-violet-500/20'
                          : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                      }`}
                    >
                      <div className={`h-16 bg-gradient-to-br ${img.color} rounded-xl flex items-center justify-center mb-2`}>
                        <span className="text-xl font-bold text-white/50">
                          {img.name.replace('.png', '').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 text-center">{img.label}</p>
                      {formData.image === img.name && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Custom Image URL <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white transition-all outline-none"
                />
                <p className="text-xs text-slate-400 mt-2">
                  If provided, this URL will override the selected image
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-700">Visibility</p>
                  <p className="text-sm text-slate-500">Show this service to customers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    formData.isActive ? 'bg-violet-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      formData.isActive ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Content Sections - Detailed descriptions with titles */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <label className="text-sm font-semibold text-slate-700">
                    Content Sections <span className="font-normal text-slate-400">(Detailed descriptions with titles)</span>
                  </label>
                </div>

                {/* Add new content section */}
                <div className="space-y-2 mb-3">
                  <input
                    type="text"
                    value={newContentSectionTitle}
                    onChange={(e) => setNewContentSectionTitle(e.target.value)}
                    placeholder="Section title (e.g., 'Energy points')"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all outline-none text-sm"
                  />
                  <div className="flex gap-2">
                    <textarea
                      value={newContentSectionDesc}
                      onChange={(e) => setNewContentSectionDesc(e.target.value)}
                      placeholder="Section description..."
                      rows={2}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all outline-none text-sm resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddContentSection}
                      className="px-4 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition self-end"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content sections list */}
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {formData.contentSections.map((section, index) => (
                    <div key={index} className="p-4 bg-amber-50 rounded-xl group">
                      {editingContentSectionIndex === index ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editContentSectionTitle}
                            onChange={(e) => setEditContentSectionTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500/20"
                            placeholder="Section title"
                            autoFocus
                          />
                          <textarea
                            value={editContentSectionDesc}
                            onChange={(e) => setEditContentSectionDesc(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                            rows={3}
                            placeholder="Section description"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveEditContentSection(index)}
                              className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingContentSectionIndex(null); setEditContentSectionTitle(''); setEditContentSectionDesc(''); }}
                              className="px-3 py-1.5 text-xs bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-amber-700 mb-1">{section.title}</h4>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap">{section.description}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditContentSection(index)}
                                className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveContentSection(index)}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {formData.contentSections.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-3">No content sections added. Add detailed descriptions for this service (e.g., "Energy points", "Self-healing of the body").</p>
                  )}
                </div>
              </div>

              {/* Service-Specific Benefits */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <label className="text-sm font-semibold text-slate-700">
                    Service Benefits <span className="font-normal text-slate-400">(Unique to this service)</span>
                  </label>
                </div>

                {/* Add new benefit */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newServiceBenefit}
                    onChange={(e) => setNewServiceBenefit(e.target.value)}
                    placeholder="Add a benefit for this service..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all outline-none text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddServiceBenefit())}
                  />
                  <button
                    type="button"
                    onClick={handleAddServiceBenefit}
                    className="px-4 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Benefits list */}
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-rose-50 rounded-lg group">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 shrink-0"></div>
                      {editingServiceBenefitIndex === index ? (
                        <div className="flex-1 flex flex-col gap-2">
                          <textarea
                            value={editServiceBenefitText}
                            onChange={(e) => setEditServiceBenefitText(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-500/20 resize-none"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveEditServiceBenefit(index)}
                              className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingServiceBenefitIndex(null); setEditServiceBenefitText(''); }}
                              className="px-3 py-1.5 text-xs bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="flex-1 text-sm text-slate-600 whitespace-pre-wrap">{benefit.description}</p>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditServiceBenefit(index)}
                              className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveServiceBenefit(index)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {formData.benefits.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-3">No benefits added. Add benefits specific to this service.</p>
                  )}
                </div>
              </div>

              {/* Service-Specific Target Audience */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-500" />
                  <label className="text-sm font-semibold text-slate-700">
                    Who It's For <span className="font-normal text-slate-400">(Target audience for this service)</span>
                  </label>
                </div>

                {/* Add new target */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newServiceTarget}
                    onChange={(e) => setNewServiceTarget(e.target.value)}
                    placeholder="Add target audience for this service..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddServiceTarget())}
                  />
                  <button
                    type="button"
                    onClick={handleAddServiceTarget}
                    className="px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Target audience list */}
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {formData.targetAudience.map((target, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg group">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                      {editingServiceTargetIndex === index ? (
                        <div className="flex-1 flex flex-col gap-2">
                          <textarea
                            value={editServiceTargetText}
                            onChange={(e) => setEditServiceTargetText(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                            rows={2}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveEditServiceTarget(index)}
                              className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingServiceTargetIndex(null); setEditServiceTargetText(''); }}
                              className="px-3 py-1.5 text-xs bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="flex-1 text-sm text-slate-600">{target.description}</p>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditServiceTarget(index)}
                              className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveServiceTarget(index)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {formData.targetAudience.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-3">No target audience added. Specify who this service is for.</p>
                  )}
                </div>
              </div>

              {/* Service Images Gallery - Drag & Drop Upload (Max 4) */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-indigo-500" />
                    <label className="text-sm font-semibold text-slate-700">
                      Service Gallery <span className="font-normal text-slate-400">(Max 4 images)</span>
                    </label>
                  </div>
                  <span className="text-xs text-slate-500">{formData.serviceImages.length}/4 images</span>
                </div>

                {formData.serviceImages.length < 4 && (
                  <div className="space-y-3 mb-4">
                    {/* Add via URL */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                        placeholder="Paste image URL here..."
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        disabled={!imageUrlInput.trim()}
                        className="px-4 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-200"></div>
                      <span className="text-xs text-slate-400">or upload from PC</span>
                      <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    {/* Drag & Drop Upload Area */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      {uploadingImage ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-2" />
                          <p className="text-sm text-slate-600">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6 text-indigo-400 mb-2" />
                          <p className="text-sm font-medium text-slate-700">
                            {isDragging ? 'Drop images here' : 'Drag & drop or click to browse'}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Uploaded Images Grid */}
                {formData.serviceImages.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {formData.serviceImages.map((img, index) => (
                      <div key={index} className="relative group rounded-md overflow-hidden bg-slate-100 w-14 h-14">
                        <img
                          src={img.url}
                          alt={`Service image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><rect fill="%23f1f5f9" width="56" height="56"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="8">Err</text></svg>'
                          }}
                        />
                        {/* Delete button overlay */}
                        <button
                          type="button"
                          onClick={() => handleRemoveServiceImage(index)}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                        {/* Image number badge */}
                        <div className="absolute bottom-0.5 left-0.5 px-1 py-px bg-black/50 text-white text-[8px] rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {formData.serviceImages.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-2">No images uploaded yet. Drag & drop or click to upload.</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-8 py-5 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 transition shadow-lg shadow-violet-500/30 font-medium disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close filter dropdown */}
      {showFilterDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowFilterDropdown(false)}
        />
      )}
    </div>
  )
}

export default Services
