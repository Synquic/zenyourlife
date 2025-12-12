import { useState, useEffect } from 'react'
import { Search, Bell, Plus, Edit2, Trash2, X, Save, Loader2, Star, Quote, MessageCircle, Filter, Eye, EyeOff, ChevronDown, Sparkles, Home, Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'

import { API_BASE_URL } from '../config/api'

// Available profile images for selection
const availablePhotos = [
  { name: 'profile1.png', label: 'Avatar 1', color: 'from-blue-400 to-blue-600' },
  { name: 'profile2.png', label: 'Avatar 2', color: 'from-purple-400 to-purple-600' },
  { name: 'profile3.png', label: 'Avatar 3', color: 'from-emerald-400 to-emerald-600' },
  { name: 'profile4.png', label: 'Avatar 4', color: 'from-amber-400 to-amber-600' },
]

interface Testimonial {
  _id: string
  name: string
  role: string
  text: string
  photo: string
  photoUrl?: string
  rating: number
  isActive: boolean
  displayOrder: number
  createdAt?: string
}

interface TestimonialFormData {
  name: string
  role: string
  text: string
  photo: string
  photoUrl: string
  rating: number
  isActive: boolean
}

const initialFormData: TestimonialFormData = {
  name: '',
  role: '',
  text: '',
  photo: 'profile1.png',
  photoUrl: '',
  rating: 5,
  isActive: true
}

type TabType = 'massage' | 'rental'

const Testimonials = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('massage')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState<TestimonialFormData>(initialFormData)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  // Get API endpoint based on active tab
  const getApiEndpoint = () => {
    return activeTab === 'massage' ? 'testimonials' : 'rental-testimonials'
  }

  // Fetch testimonials
  useEffect(() => {
    fetchTestimonials()
  }, [activeTab])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${API_BASE_URL}/${getApiEndpoint()}/admin`)
      const data = await response.json()

      if (data.success) {
        setTestimonials(data.data)
      } else {
        setError('Failed to fetch testimonials')
      }
    } catch (err) {
      setError('Error connecting to server')
      console.error('Error fetching testimonials:', err)
    } finally {
      setLoading(false)
    }
  }

  // Open modal for adding new testimonial
  const handleAddNew = () => {
    setEditingTestimonial(null)
    setFormData(initialFormData)
    setShowModal(true)
  }

  // Open modal for editing testimonial
  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      text: testimonial.text,
      photo: testimonial.photo,
      photoUrl: testimonial.photoUrl || '',
      rating: testimonial.rating,
      isActive: testimonial.isActive
    })
    setShowModal(true)
  }

  // Save testimonial (create or update)
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.text.trim()) {
      alert('Please fill in name and testimonial text')
      return
    }

    try {
      setSaving(true)
      const url = editingTestimonial
        ? `${API_BASE_URL}/${getApiEndpoint()}/${editingTestimonial._id}`
        : `${API_BASE_URL}/${getApiEndpoint()}`

      const method = editingTestimonial ? 'PUT' : 'POST'

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
        fetchTestimonials()
        setFormData(initialFormData)
        setEditingTestimonial(null)
      } else {
        alert(data.message || 'Failed to save testimonial')
      }
    } catch (err) {
      console.error('Error saving testimonial:', err)
      alert('Error saving testimonial')
    } finally {
      setSaving(false)
    }
  }

  // Delete testimonial
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${getApiEndpoint()}/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        fetchTestimonials()
      } else {
        alert(data.message || 'Failed to delete testimonial')
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err)
      alert('Error deleting testimonial')
    }
  }

  // Toggle active status
  const handleToggleStatus = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${getApiEndpoint()}/${testimonial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...testimonial, isActive: !testimonial.isActive })
      })

      const data = await response.json()

      if (data.success) {
        fetchTestimonials()
      }
    } catch (err) {
      console.error('Error toggling status:', err)
    }
  }

  // Seed default testimonials
  const handleSeedTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${getApiEndpoint()}/seed`, {
        method: 'POST'
      })
      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchTestimonials()
      } else {
        alert(data.message || 'Failed to seed testimonials')
      }
    } catch (err) {
      console.error('Error seeding testimonials:', err)
      alert('Error seeding testimonials')
    }
  }

  // Filter testimonials
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.role.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && testimonial.isActive) ||
      (filterStatus === 'inactive' && !testimonial.isActive)

    return matchesSearch && matchesFilter
  })

  // Stats
  const totalTestimonials = testimonials.length
  const activeTestimonials = testimonials.filter(t => t.isActive).length
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
    : '0.0'

  // Get avatar color based on photo
  const getAvatarColor = (photo: string) => {
    const found = availablePhotos.find(p => p.name === photo)
    return found?.color || 'from-gray-400 to-gray-600'
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Testimonials
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">Manage customer reviews and feedback</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search - Hidden on mobile */}
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-slate-100/80 border-0 rounded-xl text-sm w-48 lg:w-64 focus:ring-2 focus:ring-[#DFB13B]/20 focus:bg-white transition-all outline-none"
                />
              </div>
              {/* Notification */}
              <button className="p-2 sm:p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition relative flex-shrink-0">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {/* Profile */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#DFB13B] to-[#C9A032] rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-[#DFB13B]/20 flex-shrink-0">
                A
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('massage')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'massage'
                  ? 'bg-gradient-to-r from-[#DFB13B] to-[#C9A032] text-white shadow-lg shadow-[#DFB13B]/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Massage</span> Massage
            </button>
            <button
              onClick={() => setActiveTab('rental')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'rental'
                  ? 'bg-gradient-to-r from-[#DFB13B] via-[#DFB13B] to-[#FFEEC3] text-white shadow-lg shadow-[#DFB13B]/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Rental</span> Rental
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">Total Reviews</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{totalTestimonials}</p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#DFB13B] to-[#C9A032] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-[#DFB13B]/30">
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">Active Reviews</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{activeTestimonials}</p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#DFB13B] via-[#DFB13B] to-[#FFEEC3] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-[#DFB13B]/30">
                  <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">Average Rating</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl sm:text-3xl font-bold text-slate-800">{avgRating}</p>
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400" />
                  </div>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Star className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mb-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] transition-all outline-none"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:border-slate-300 transition"
                >
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {filterStatus === 'all' ? 'All Status' : filterStatus === 'active' ? 'Active' : 'Inactive'}
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                {showFilterDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 min-w-[140px] z-20">
                    {['all', 'active', 'inactive'].map((status) => (
                      <button
                        key={status}
                        onClick={() => { setFilterStatus(status as 'all' | 'active' | 'inactive'); setShowFilterDropdown(false) }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition capitalize ${
                          filterStatus === status ? 'text-[#B8922D] font-medium bg-[#FFEEC3]/30' : 'text-slate-600'
                        }`}
                      >
                        {status === 'all' ? 'All Status' : status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs sm:text-sm text-slate-500">
                {filteredTestimonials.length}/{totalTestimonials}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleSeedTestimonials}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl hover:bg-slate-200 transition text-xs sm:text-sm font-medium"
              >
                <span className="hidden sm:inline">Seed</span> Demo
              </button>
              <button
                onClick={handleAddNew}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#DFB13B] to-[#C9A032] text-white rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-[#DFB13B]/30 transition shadow-lg shadow-[#DFB13B]/30 text-xs sm:text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span> Testimonial
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl">
              <Loader2 className="w-10 h-10 animate-spin text-[#DFB13B] mb-4" />
              <span className="text-slate-500">Loading testimonials...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <X className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium">Connection Error</p>
                <p className="text-sm text-red-500">{error}. Please make sure the backend server is running.</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredTestimonials.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Quote className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No {activeTab} testimonials found</h3>
              <p className="text-slate-500 mb-6">Get started by adding your first customer testimonial or seed demo data</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleSeedTestimonials}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition"
                >
                  Seed Demo Data
                </button>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DFB13B] hover:bg-[#C9A032] text-white rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Testimonial
                </button>
              </div>
            </div>
          )}

          {/* Testimonials Grid */}
          {!loading && !error && filteredTestimonials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial._id}
                  className="group bg-white rounded-xl sm:rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getAvatarColor(testimonial.photo)} rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0`}>
                          {testimonial.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">{testimonial.name}</h3>
                          <p className="text-xs sm:text-sm text-slate-500 truncate">{testimonial.role || 'Customer'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleStatus(testimonial)}
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium transition flex-shrink-0 ${
                          testimonial.isActive
                            ? 'bg-[#FFEEC3]/50 text-[#B8922D] hover:bg-[#FFEEC3]'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {testimonial.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="px-4 sm:px-5 py-2 sm:py-3">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            i < testimonial.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="text-xs sm:text-sm text-slate-500 ml-1.5 sm:ml-2">{testimonial.rating}.0</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-4 sm:px-5 pb-3 sm:pb-4">
                    <div className="relative">
                      <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-slate-100 absolute -top-1 -left-1" />
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-4 relative z-10 pl-3 sm:pl-4">
                        {testimonial.text}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-3 sm:px-5 py-3 sm:py-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 text-slate-600 hover:text-[#B8922D] hover:bg-[#FFEEC3]/30 rounded-lg sm:rounded-xl transition text-xs sm:text-sm font-medium"
                    >
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Edit
                    </button>
                    <div className="w-px h-5 sm:h-6 bg-slate-200"></div>
                    <button
                      onClick={() => handleToggleStatus(testimonial)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition text-xs sm:text-sm font-medium"
                    >
                      {testimonial.isActive ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      <span className="hidden xs:inline">{testimonial.isActive ? 'Hide' : 'Show'}</span>
                    </button>
                    <div className="w-px h-5 sm:h-6 bg-slate-200"></div>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition text-xs sm:text-sm font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div
            className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-[#DFB13B] to-[#C9A032] px-4 sm:px-8 py-4 sm:py-6">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 hover:bg-white/20 rounded-xl transition"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  {editingTestimonial ? <Edit2 className="w-5 h-5 sm:w-7 sm:h-7 text-white" /> : <Plus className="w-5 h-5 sm:w-7 sm:h-7 text-white" />}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-xl font-bold text-white">
                    {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                  </h2>
                  <p className="text-white/80 text-xs sm:text-sm mt-0.5 truncate">
                    {activeTab === 'massage' ? 'Massage & Wellness' : 'Rental Properties'} - {editingTestimonial ? 'Update customer feedback' : 'Add a new customer review'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)]">
              {/* Name & Role Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] focus:bg-white transition-all outline-none text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                    Role / Handle
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="@johndoe"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] focus:bg-white transition-all outline-none text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Testimonial Text */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                  Testimonial Text *
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="What did the customer say about their experience..."
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] focus:bg-white transition-all outline-none resize-none text-sm sm:text-base"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  Rating
                </label>
                <div className="flex items-center justify-between gap-2 p-3 sm:p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-0.5 sm:p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 sm:w-8 sm:h-8 transition ${
                            star <= formData.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 text-sm sm:text-base">{formData.rating}</span>
                    <span className="text-slate-400 text-sm sm:text-base"> / 5</span>
                  </div>
                </div>
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  Select Avatar
                </label>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
                  {availablePhotos.map((photo) => (
                    <button
                      key={photo.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, photo: photo.name })}
                      className={`relative p-2 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${
                        formData.photo === photo.name
                          ? 'bg-[#FFEEC3]/20 border-2 border-[#DFB13B] shadow-lg shadow-[#DFB13B]/20'
                          : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                      }`}
                    >
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br ${photo.color} rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-lg`}>
                        {photo.label.split(' ')[1]}
                      </div>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5 sm:mt-2 text-center truncate">{photo.label}</p>
                      {formData.photo === photo.name && (
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-[#DFB13B] rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Photo URL */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                  Custom Photo URL <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] focus:bg-white transition-all outline-none text-sm sm:text-base"
                />
                <p className="text-[10px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2">
                  If provided, this URL will override the selected avatar
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-700 text-sm sm:text-base">Visibility</p>
                  <p className="text-xs sm:text-sm text-slate-500">Show this testimonial on the website</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative w-12 h-7 sm:w-14 sm:h-8 rounded-full transition-colors flex-shrink-0 ${
                    formData.isActive ? 'bg-[#DFB13B]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow transition-transform ${
                      formData.isActive ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-5 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl transition font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-[#DFB13B] to-[#C9A032] text-white rounded-xl hover:shadow-lg hover:shadow-[#DFB13B]/30 transition shadow-lg shadow-[#DFB13B]/30 font-medium disabled:opacity-50 text-sm sm:text-base"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
                <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Testimonial'}</span>
                <span className="sm:hidden">{saving ? 'Saving...' : 'Save'}</span>
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

export default Testimonials
