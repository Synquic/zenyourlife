import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search, Plus, Edit2, Trash2, X, Save, Loader2, Building2, Users,
  BedDouble, DollarSign, Filter, ChevronDown, Eye, EyeOff, LayoutGrid,
  List, Car, Sparkles, Settings2, Star, TrendingUp, Home,
  ArrowUpRight, Image as ImageIcon, Menu, Upload, Link
} from 'lucide-react'
import Sidebar from '../components/Sidebar'

const API_BASE_URL = 'http://localhost:5000/api'

// Available images for selection with colors
const availableImages = [
  { name: 'Apat1.png', label: 'Apartment 1', color: 'from-violet-500 via-purple-500 to-fuchsia-500' },
  { name: 'Apat2.png', label: 'Apartment 2', color: 'from-cyan-500 via-blue-500 to-indigo-500' },
  { name: 'Villa1.png', label: 'Villa 1', color: 'from-emerald-500 via-teal-500 to-cyan-500' },
  { name: 'Villa2.png', label: 'Villa 2', color: 'from-amber-500 via-orange-500 to-red-500' },
]

interface PropertyData {
  _id: string
  name: string
  description: string
  price: number
  currency: string
  priceUnit: string
  guests: number
  bedrooms: number
  parking: string
  image: string
  imageUrl?: string
  cleanliness: {
    title: string
    description: string
  }
  amenities: string[]
  hostName?: string
  displayOrder: number
  isActive: boolean
}

interface SectionSettings {
  sectionType: string
  title: string
  description: string
  isActive: boolean
}

const Properties = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [sectionSettings, setSectionSettings] = useState<SectionSettings>({
    sectionType: 'apartments',
    title: 'Apartments',
    description: 'Discover our handpicked collection of premium apartments.',
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<PropertyData | null>(null)
  const [saving, setSaving] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [amenityInput, setAmenityInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: '€',
    priceUnit: 'per night',
    guests: 1,
    bedrooms: 1,
    parking: '',
    image: 'Apat1.png',
    imageUrl: '',
    cleanliness: {
      title: 'Cleanliness',
      description: ''
    },
    amenities: [] as string[],
    hostName: '',
    displayOrder: 0
  })

  // Fetch properties from backend
  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties?all=true`)
      const data = await response.json()
      if (data.success) {
        setProperties(data.data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch section settings
  const fetchSectionSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/section-settings/apartments`)
      const data = await response.json()
      if (data.success) {
        setSectionSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching section settings:', error)
    }
  }

  useEffect(() => {
    fetchProperties()
    fetchSectionSettings()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingProperty
        ? `${API_BASE_URL}/properties/${editingProperty._id}`
        : `${API_BASE_URL}/properties`

      const response = await fetch(url, {
        method: editingProperty ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        fetchProperties()
        closeModal()
      }
    } catch (error) {
      console.error('Error saving property:', error)
    } finally {
      setSaving(false)
    }
  }

  // Handle section settings update
  const handleSectionSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`${API_BASE_URL}/properties/section-settings/apartments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionSettings)
      })

      const data = await response.json()
      if (data.success) {
        setIsSettingsModalOpen(false)
      }
    } catch (error) {
      console.error('Error updating section settings:', error)
    } finally {
      setSaving(false)
    }
  }

  // Toggle property visibility
  const handleToggleStatus = async (property: PropertyData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${property._id}/toggle`, {
        method: 'PUT'
      })
      const data = await response.json()
      if (data.success) {
        fetchProperties()
      }
    } catch (error) {
      console.error('Error toggling property:', error)
    }
  }

  // Delete property
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}/permanent`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        fetchProperties()
      }
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  // Open modal for editing
  const openEditModal = (property: PropertyData) => {
    setEditingProperty(property)
    setFormData({
      name: property.name,
      description: property.description,
      price: property.price,
      currency: property.currency || '€',
      priceUnit: property.priceUnit || 'per night',
      guests: property.guests,
      bedrooms: property.bedrooms,
      parking: property.parking,
      image: property.image,
      imageUrl: property.imageUrl || '',
      cleanliness: property.cleanliness || { title: 'Cleanliness', description: '' },
      amenities: property.amenities || [],
      hostName: property.hostName || '',
      displayOrder: property.displayOrder || 0
    })
    setIsModalOpen(true)
  }

  // Open modal for new property
  const openNewModal = () => {
    setEditingProperty(null)
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: '€',
      priceUnit: 'per night',
      guests: 1,
      bedrooms: 1,
      parking: '',
      image: 'Apat1.png',
      imageUrl: '',
      cleanliness: { title: 'Cleanliness', description: '' },
      amenities: [],
      hostName: '',
      displayOrder: properties.length
    })
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProperty(null)
  }

  // Add amenity
  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData({ ...formData, amenities: [...formData.amenities, amenityInput.trim()] })
      setAmenityInput('')
    }
  }

  // Remove amenity
  const removeAmenity = (amenity: string) => {
    setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) })
  }

  // Handle image upload
  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setUploadingImage(true)
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    try {
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formDataUpload
      })
      const data = await response.json()
      if (data.success && data.data?.url) {
        setFormData(prev => ({ ...prev, imageUrl: data.data.url }))
      } else {
        alert('Failed to upload image: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }, [])

  // Handle drag events
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

  // Handle URL input
  const handleImageUrlSubmit = () => {
    if (imageUrlInput.trim()) {
      setFormData({ ...formData, imageUrl: imageUrlInput.trim() })
      setImageUrlInput('')
    }
  }

  // Remove custom image
  const removeCustomImage = () => {
    setFormData({ ...formData, imageUrl: '' })
  }

  // Filter and search properties
  const filteredProperties = properties.filter(property => {
    const matchesStatus = filterStatus === 'all' ? true :
      filterStatus === 'active' ? property.isActive : !property.isActive
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Get image color
  const getImageColor = (imageName: string) => {
    const img = availableImages.find(i => i.name === imageName)
    return img?.color || 'from-slate-400 to-slate-600'
  }

  // Stats
  const totalProperties = properties.length
  const activeProperties = properties.filter(p => p.isActive).length
  const avgPrice = properties.length > 0
    ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length)
    : 0
  const totalCapacity = properties.reduce((sum, p) => sum + p.guests, 0)

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
          <div className="px-4 sm:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-slate-600" />
                </button>
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-[#DFB13B] to-[#C9A032] items-center justify-center shadow-lg shadow-[#DFB13B]/30">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-slate-800">Properties</h1>
                  <p className="text-xs sm:text-sm text-slate-500">Manage your rental listings</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Search - hidden on mobile, shown on sm+ */}
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 md:w-72 pl-10 pr-4 py-2.5 bg-slate-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:bg-white transition-all"
                  />
                </div>

                {/* Add Button */}
                <button
                  onClick={openNewModal}
                  className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-gradient-to-r from-[#DFB13B] to-[#C9A032] text-white rounded-xl hover:shadow-lg hover:shadow-[#DFB13B]/30 transition-all font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Property</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Mobile Search */}
          <div className="relative sm:hidden mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B]/50 transition-all"
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
            {/* Total Properties */}
            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-100 hover:border-[#DFB13B]/30 transition-all hover:shadow-xl hover:shadow-[#DFB13B]/5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Total Properties</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalProperties}</p>
                  <p className="text-[10px] sm:text-xs text-[#B8922D] font-medium mt-1 sm:mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +2 this month
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#DFB13B] to-[#C9A032] flex items-center justify-center shadow-lg shadow-[#DFB13B]/30">
                  <Home className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DFB13B] to-[#FFEEC3] rounded-b-xl sm:rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Active Listings */}
            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-100 hover:border-[#FFEEC3] transition-all hover:shadow-xl hover:shadow-[#DFB13B]/5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Active Listings</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800">{activeProperties}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2">
                    {totalProperties > 0 ? Math.round((activeProperties / totalProperties) * 100) : 0}% of total
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#DFB13B] via-[#DFB13B] to-[#FFEEC3] flex items-center justify-center shadow-lg shadow-[#DFB13B]/30">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DFB13B] to-[#FFEEC3] rounded-b-xl sm:rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Average Price */}
            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-100 hover:border-amber-200 transition-all hover:shadow-xl hover:shadow-amber-500/5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Avg. Price/Night</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800">€{avgPrice}</p>
                  <p className="text-[10px] sm:text-xs text-amber-600 font-medium mt-1 sm:mt-2 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500" />
                    Premium pricing
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-b-xl sm:rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Total Capacity */}
            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-100 hover:border-rose-200 transition-all hover:shadow-xl hover:shadow-rose-500/5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Total Capacity</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalCapacity}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2">guests accommodated</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-600 rounded-b-xl sm:rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Section Settings Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
                  <Settings2 className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-0.5">Section Configuration</h3>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Title: <span className="text-white font-medium">"{sectionSettings.title}"</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium backdrop-blur"
              >
                <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Edit Settings
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 hidden sm:block" />
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:border-slate-300 transition-all"
                >
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{filterStatus === 'all' ? 'All Properties' : filterStatus === 'active' ? 'Active Only' : 'Hidden Only'}</span>
                  <span className="sm:hidden">{filterStatus === 'all' ? 'All' : filterStatus === 'active' ? 'Active' : 'Hidden'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showFilterDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-1.5 min-w-[140px] sm:min-w-[160px] z-20">
                    {[
                      { value: 'all', label: 'All Properties', icon: Building2 },
                      { value: 'active', label: 'Active Only', icon: Eye },
                      { value: 'inactive', label: 'Hidden Only', icon: EyeOff }
                    ].map((status) => (
                      <button
                        key={status.value}
                        onClick={() => { setFilterStatus(status.value as 'all' | 'active' | 'inactive'); setShowFilterDropdown(false) }}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm hover:bg-slate-50 transition flex items-center gap-2 sm:gap-2.5 ${
                          filterStatus === status.value ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'
                        }`}
                      >
                        <status.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {status.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg sm:rounded-xl p-0.5 sm:p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#DFB13B] text-white shadow-lg shadow-[#DFB13B]/30' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#DFB13B] text-white shadow-lg shadow-[#DFB13B]/30' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Results count */}
            <span className="text-xs sm:text-sm text-slate-500">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-[#FFEEC3] border-t-[#DFB13B] animate-spin" />
              <p className="text-slate-500">Loading properties...</p>
            </div>
          )}

          {/* Properties Grid/List */}
          {!loading && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5' : 'space-y-3 sm:space-y-4'}>
              {filteredProperties.map((property) => (
                viewMode === 'grid' ? (
                  // Grid View Card
                  <div
                    key={property._id}
                    className={`group bg-white rounded-xl sm:rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all overflow-hidden ${
                      !property.isActive ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-36 sm:h-44 overflow-hidden">
                      {property.imageUrl ? (
                        <img
                          src={property.imageUrl}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getImageColor(property.image)} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                          <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-white/30" />
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium backdrop-blur-md ${
                        property.isActive
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-slate-800/80 text-white'
                      }`}>
                        {property.isActive ? 'Active' : 'Hidden'}
                      </div>

                      {/* Price Badge */}
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl shadow-lg">
                        <span className="text-sm sm:text-lg font-bold text-slate-800">{property.currency}{property.price}</span>
                        <span className="text-[10px] sm:text-xs text-slate-500 ml-0.5">/{property.priceUnit?.replace('per ', '')}</span>
                      </div>

                      {/* Quick Actions Overlay - always visible on mobile */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3 sm:pb-4 gap-2">
                        <button
                          onClick={() => openEditModal(property)}
                          className="p-2 sm:p-2.5 bg-white rounded-lg sm:rounded-xl hover:bg-[#FFEEC3]/30 transition-all shadow-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B8922D]" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(property)}
                          className="p-2 sm:p-2.5 bg-white rounded-lg sm:rounded-xl hover:bg-emerald-50 transition-all shadow-lg"
                        >
                          {property.isActive ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />}
                        </button>
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="p-2 sm:p-2.5 bg-white rounded-lg sm:rounded-xl hover:bg-red-50 transition-all shadow-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-5">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1 sm:mb-1.5 line-clamp-1">{property.name}</h3>
                      <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">{property.description}</p>

                      {/* Features */}
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                        <span className="flex items-center gap-1 sm:gap-1.5">
                          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB13B]" />
                          {property.guests}
                        </span>
                        <span className="flex items-center gap-1 sm:gap-1.5">
                          <BedDouble className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB13B]" />
                          {property.bedrooms}
                        </span>
                        {property.parking && (
                          <span className="flex items-center gap-1 sm:gap-1.5">
                            <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB13B]" />
                            Yes
                          </span>
                        )}
                      </div>

                      {/* Amenities */}
                      {property.amenities && property.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {property.amenities.slice(0, 2).map((amenity, idx) => (
                            <span key={idx} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-slate-100 text-slate-600 text-[10px] sm:text-xs rounded-md sm:rounded-lg font-medium">
                              {amenity}
                            </span>
                          ))}
                          {property.amenities.length > 2 && (
                            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#FFEEC3]/30 text-[#B8922D] text-[10px] sm:text-xs rounded-md sm:rounded-lg font-medium">
                              +{property.amenities.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // List View Card
                  <div
                    key={property._id}
                    className={`group bg-white rounded-xl sm:rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all overflow-hidden flex flex-col sm:flex-row ${
                      !property.isActive ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className="relative w-full sm:w-48 md:w-56 h-32 sm:h-40 flex-shrink-0">
                      {property.imageUrl ? (
                        <img
                          src={property.imageUrl}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getImageColor(property.image)} flex items-center justify-center`}>
                          <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-white/30" />
                        </div>
                      )}
                      <div className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium ${
                        property.isActive
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-slate-800/80 text-white'
                      }`}>
                        {property.isActive ? 'Active' : 'Hidden'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-800">{property.name}</h3>
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#FFEEC3]/30 text-[#B8922D] text-xs sm:text-sm font-bold rounded-md sm:rounded-lg">
                            {property.currency}{property.price}
                            <span className="text-[#C9A032] font-normal">/{property.priceUnit?.replace('per ', '')}</span>
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-1">{property.description}</p>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-600">
                          <span className="flex items-center gap-1 sm:gap-1.5">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB13B]" />
                            {property.guests} guests
                          </span>
                          <span className="flex items-center gap-1 sm:gap-1.5">
                            <BedDouble className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB13B]" />
                            {property.bedrooms} bedrooms
                          </span>
                          {property.parking && (
                            <span className="flex items-center gap-1 sm:gap-1.5">
                              <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB13B]" />
                              Parking
                            </span>
                          )}
                          {property.amenities && property.amenities.length > 0 && (
                            <span className="text-[#B8922D] font-medium">
                              +{property.amenities.length} amenities
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:ml-4">
                        <button
                          onClick={() => handleToggleStatus(property)}
                          className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all ${
                            property.isActive
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {property.isActive ? <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </button>
                        <button
                          onClick={() => openEditModal(property)}
                          className="p-2 sm:p-2.5 bg-[#FFEEC3]/30 text-[#B8922D] rounded-lg sm:rounded-xl hover:bg-[#FFEEC3]/50 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="p-2 sm:p-2.5 bg-red-50 text-red-500 rounded-lg sm:rounded-xl hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProperties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4 sm:mb-5">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">No properties found</h3>
              <p className="text-slate-500 mb-4 sm:mb-6 text-center max-w-md text-sm sm:text-base">
                {searchQuery ? 'Try adjusting your search or filters' : 'Get started by adding your first property listing'}
              </p>
              <button
                onClick={openNewModal}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#DFB13B] to-[#C9A032] text-white rounded-xl hover:shadow-lg hover:shadow-[#DFB13B]/30 transition-all font-medium text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Add Your First Property
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#DFB13B] to-[#C9A032] flex items-center justify-center">
                  {editingProperty ? <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                    {editingProperty ? 'Edit Property' : 'Add New Property'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">Fill in the property details below</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg sm:rounded-xl transition-all">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB13B]" />
                  Basic Information
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">Property Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:bg-white transition-all text-sm"
                    placeholder="e.g., Lanzarote Beachfront Villa"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:bg-white transition-all h-20 sm:h-24 resize-none text-sm"
                    placeholder="Describe the property, its features and surroundings..."
                    required
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB13B]" />
                  Pricing
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">Price *</label>
                    <input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? 0 : Number(e.target.value) })}
                      className="w-full px-2 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:bg-white transition-all text-sm"
                      min="0"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-2 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm"
                    >
                      <option value="€">€ Euro</option>
                      <option value="$">$ Dollar</option>
                      <option value="£">£ Pound</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">Per</label>
                    <select
                      value={formData.priceUnit}
                      onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                      className="w-full px-2 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm"
                    >
                      <option value="per night">Night</option>
                      <option value="per week">Week</option>
                      <option value="per month">Month</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Capacity Section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB13B]" />
                  Capacity & Features
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">Guests *</label>
                    <input
                      type="number"
                      value={formData.guests || ''}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value === '' ? 1 : Number(e.target.value) })}
                      className="w-full px-2 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm"
                      min="1"
                      placeholder="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">Bedrooms *</label>
                    <input
                      type="number"
                      value={formData.bedrooms || ''}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value === '' ? 1 : Number(e.target.value) })}
                      className="w-full px-2 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm"
                      min="1"
                      placeholder="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">Parking</label>
                    <input
                      type="text"
                      value={formData.parking}
                      onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                      className="w-full px-2 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm"
                      placeholder="e.g., 2 cars"
                    />
                  </div>
                </div>
              </div>

              {/* Image Selection */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB13B]" />
                  Property Image
                </div>

                {/* Custom Image Preview */}
                {formData.imageUrl && (
                  <div className="relative">
                    <div className="relative h-32 sm:h-40 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-indigo-500">
                      <img
                        src={formData.imageUrl}
                        alt="Custom property image"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#DFB13B] text-white text-xs rounded-lg font-medium">
                        Custom Image
                      </div>
                      <button
                        type="button"
                        onClick={removeCustomImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Drag & Drop Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#DFB13B] bg-[#FFEEC3]/20'
                      : 'border-slate-200 hover:border-[#DFB13B]/50 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-[#DFB13B] animate-spin" />
                      <span className="text-sm text-slate-600">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FFEEC3]/30 flex items-center justify-center">
                        <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFB13B]" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-700">
                          {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image URL Input */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-slate-700">Or enter image URL</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleImageUrlSubmit())}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:bg-white transition-all text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleImageUrlSubmit}
                      className="px-4 py-2.5 sm:py-3 bg-[#DFB13B] text-white rounded-lg sm:rounded-xl hover:bg-[#C9A032] transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Default Image Selection */}
                {!formData.imageUrl && (
                  <>
                    <div className="text-xs text-slate-500 text-center">Or select a default image</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      {availableImages.map((img) => (
                        <button
                          key={img.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: img.name })}
                          className={`relative h-20 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden transition-all ${
                            formData.image === img.name && !formData.imageUrl
                              ? 'ring-2 ring-[#DFB13B] ring-offset-2 scale-[0.98]'
                              : 'hover:scale-[0.98]'
                          }`}
                        >
                          <div className={`w-full h-full bg-gradient-to-br ${img.color} flex items-center justify-center`}>
                            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white/40" />
                          </div>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 sm:p-2">
                            <span className="text-[10px] sm:text-[11px] text-white font-medium">{img.label}</span>
                          </div>
                          {formData.image === img.name && !formData.imageUrl && (
                            <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-[#DFB13B] rounded-full flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Amenities */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB13B]" />
                  Amenities
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:bg-white transition-all text-sm"
                    placeholder="Type an amenity and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="px-3 sm:px-5 py-2.5 sm:py-3 bg-[#DFB13B] text-white rounded-lg sm:rounded-xl hover:bg-[#C9A032] transition-all"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {formData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {formData.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#FFEEC3]/30 text-[#B8922D] rounded-full text-xs sm:text-sm font-medium"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="hover:text-[#8B7424]"
                        >
                          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Host Name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">Host Name (Optional)</label>
                <input
                  type="text"
                  value={formData.hostName}
                  onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:bg-white transition-all text-sm"
                  placeholder="e.g., Maria"
                />
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 flex gap-2 sm:gap-3 bg-slate-50">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-200 text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-50 transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#DFB13B] to-[#C9A032] text-white rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-[#DFB13B]/30 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">{editingProperty ? 'Update Property' : 'Add Property'}</span>
                    <span className="sm:hidden">{editingProperty ? 'Update' : 'Add'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <Settings2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-slate-800">Section Settings</h2>
                  <p className="text-xs sm:text-sm text-slate-500">Customize the properties section</p>
                </div>
              </div>
              <button onClick={() => setIsSettingsModalOpen(false)} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg sm:rounded-xl transition-all">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSectionSettingsSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">Section Title *</label>
                <input
                  type="text"
                  value={sectionSettings.title}
                  onChange={(e) => setSectionSettings({ ...sectionSettings, title: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm"
                  placeholder="e.g., Our Apartments"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">Section Description *</label>
                <textarea
                  value={sectionSettings.description}
                  onChange={(e) => setSectionSettings({ ...sectionSettings, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-0 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all h-28 sm:h-32 resize-none text-sm"
                  placeholder="Describe your properties section..."
                  required
                />
              </div>

              <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-200 text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-50 transition-all font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span className="hidden sm:inline">Save Settings</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Properties
