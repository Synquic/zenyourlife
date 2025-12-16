import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Plus, Send, CheckCircle, XCircle, Loader2, Calendar, User, Clock, Mail, Phone, MapPin, X, Save, Sparkles, CalendarCheck, MessageSquare, FileText, Menu, Trash2, Filter, ChevronDown, PanelLeftClose, PanelRightClose, GripVertical } from 'lucide-react'
import Sidebar from '../components/Sidebar'

interface ServiceOption {
  _id: string
  title: string
  duration: number
  price: number
  category: string
}

interface BookingData {
  _id: string
  enrollmentId: number
  service: string
  serviceTitle: string
  appointmentDate: string
  appointmentDay: string
  appointmentTime: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phoneNumber: string
  country: string
  gender: string
  specialRequests: string
  message: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
  updatedAt: string
}

import { API_BASE_URL } from '../config/api'
const API_URL = API_BASE_URL

type FilterPeriod = 'all' | 'day' | 'week' | 'month' | 'year'

const countryNames: { [key: string]: string } = {
  'BE': 'Belgium',
  'US': 'United States',
  'UK': 'United Kingdom',
  'NL': 'Netherlands',
  'DE': 'Germany',
  'FR': 'France',
  'ES': 'Spain',
  'IT': 'Italy',
  'IN': 'India'
}

const MassageBooking = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [showNewBookingModal, setShowNewBookingModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email')
  const [messageContent, setMessageContent] = useState('')
  const [messageSubject, setMessageSubject] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageStatus, setMessageStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  // Panel resize and collapse states
  const [leftPanelWidth, setLeftPanelWidth] = useState(420)
  const [activePanel, setActivePanel] = useState<'both' | 'left' | 'right'>('both')
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [services, setServices] = useState<ServiceOption[]>([])
  const [savingBooking, setSavingBooking] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [newBookingForm, setNewBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: 'BE',
    gender: 'male',
    serviceId: '',
    appointmentDate: '',
    appointmentTime: '10:00',
    specialRequests: '',
    message: ''
  })

  const filterOptions: { value: FilterPeriod; label: string }[] = [
    { value: 'all', label: 'All Time' },
    { value: 'day', label: 'Last 24 Hours' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'year', label: 'Last Year' }
  ]

  // Filter bookings based on selected period
  const getFilteredByPeriod = (data: BookingData[]) => {
    const now = new Date()
    let startDate: Date

    switch (filterPeriod) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        return data
    }

    return data.filter(booking => new Date(booking.appointmentDate) >= startDate)
  }

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/enrollments`)
      if (!response.ok) throw new Error('Failed to fetch bookings')
      const data = await response.json()
      if (data.success) {
        setBookings(data.data)
        if (data.data.length > 0 && !selectedBooking) {
          setSelectedBooking(data.data[0])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/services`)
      if (!response.ok) throw new Error('Failed to fetch services')
      const data = await response.json()
      if (data.success) {
        setServices(data.data.filter((s: ServiceOption & { isActive: boolean }) => s.isActive))
      }
    } catch (err) {
      console.error('Failed to fetch services:', err)
    }
  }

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingBooking(true)

    try {
      const selectedService = services.find(s => s._id === newBookingForm.serviceId)
      const appointmentDate = new Date(newBookingForm.appointmentDate)
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

      const response = await fetch(`${API_URL}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: newBookingForm.serviceId,
          serviceTitle: selectedService?.title || '',
          appointmentDate: newBookingForm.appointmentDate,
          appointmentDay: dayNames[appointmentDate.getDay()],
          appointmentTime: newBookingForm.appointmentTime,
          firstName: newBookingForm.firstName,
          lastName: newBookingForm.lastName,
          email: newBookingForm.email,
          phoneNumber: newBookingForm.phoneNumber,
          country: newBookingForm.country,
          gender: newBookingForm.gender,
          specialRequests: newBookingForm.specialRequests,
          message: newBookingForm.message
        })
      })

      if (!response.ok) throw new Error('Failed to create booking')

      const data = await response.json()
      if (data.success) {
        setShowNewBookingModal(false)
        setNewBookingForm({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          country: 'BE',
          gender: 'male',
          serviceId: '',
          appointmentDate: '',
          appointmentTime: '10:00',
          specialRequests: '',
          message: ''
        })
        fetchBookings()
      }
    } catch {
      alert('Failed to create booking')
    } finally {
      setSavingBooking(false)
    }
  }

  const openNewBookingModal = () => {
    fetchServices()
    setShowNewBookingModal(true)
  }

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle panel resizing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const newWidth = e.clientX - containerRect.left

    // Set min and max widths
    const minLeftWidth = 280  // Minimum left panel width
    const minRightWidth = 550 // Minimum right panel width to preserve layout
    const maxLeftWidth = containerRect.width - minRightWidth

    setLeftPanelWidth(Math.min(Math.max(newWidth, minLeftWidth), maxLeftWidth))
  }, [isResizing])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Add mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  useEffect(() => {
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      setActionLoading(status)
      const response = await fetch(`${API_URL}/enrollments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!response.ok) throw new Error('Failed to update status')
      const data = await response.json()
      if (data.success) {
        setBookings(prev => prev.map(b => b._id === id ? data.data : b))
        if (selectedBooking?._id === id) {
          setSelectedBooking(data.data)
        }
      }
    } catch {
      alert('Failed to update booking status')
    } finally {
      setActionLoading(null)
    }
  }

  const deleteBooking = async (id: string) => {
    try {
      setDeleting(true)
      const response = await fetch(`${API_URL}/enrollments/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete appointment')
      const data = await response.json()
      if (data.success) {
        setBookings(prev => prev.filter(b => b._id !== id))
        if (selectedBooking?._id === id) {
          setSelectedBooking(bookings.length > 1 ? bookings.find(b => b._id !== id) || null : null)
        }
        setShowDeleteConfirm(null)
      }
    } catch {
      alert('Failed to delete appointment')
    } finally {
      setDeleting(false)
    }
  }

  const openMessageModal = () => {
    setMessageType('email')
    setMessageContent('')
    setMessageSubject('')
    setMessageStatus(null)
    setShowMessageModal(true)
  }

  const sendMessage = async () => {
    if (!selectedBooking || !messageContent.trim()) return

    try {
      setSendingMessage(true)
      setMessageStatus(null)
      const response = await fetch(`${API_URL}/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: messageType,
          to: messageType === 'email' ? selectedBooking.email : selectedBooking.phoneNumber,
          subject: messageSubject || `Message from Zen Your Life`,
          message: messageContent,
          customerName: `${selectedBooking.firstName} ${selectedBooking.lastName}`,
          country: selectedBooking.country
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessageStatus({ type: 'success', text: `${messageType === 'email' ? 'Email' : 'SMS'} sent successfully!` })
        setMessageContent('')
        setMessageSubject('')
        // Auto close after 2 seconds
        setTimeout(() => {
          setShowMessageModal(false)
          setMessageStatus(null)
        }, 2000)
      } else {
        setMessageStatus({ type: 'error', text: data.message || 'Failed to send message' })
      }
    } catch {
      setMessageStatus({ type: 'error', text: 'Failed to send message. Please try again.' })
    } finally {
      setSendingMessage(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' }
      case 'pending':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' }
      case 'cancelled':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' }
      case 'completed':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' }
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' }
    }
  }

  // Apply period filter first, then status and search filters
  const periodFilteredBookings = getFilteredByPeriod(bookings)

  const filteredBookings = periodFilteredBookings.filter(booking => {
    const statusMatch = statusFilter === 'all' || booking.status === statusFilter
    const searchMatch = searchQuery === '' ||
      `${booking.firstName} ${booking.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.enrollmentId?.toString().includes(searchQuery) ||
      booking.serviceTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchQuery.toLowerCase())
    return statusMatch && searchMatch
  })

  // Stats based on period filtered bookings
  const stats = {
    total: periodFilteredBookings.length,
    pending: periodFilteredBookings.filter(b => b.status === 'pending').length,
    confirmed: periodFilteredBookings.filter(b => b.status === 'confirmed').length,
    completed: periodFilteredBookings.filter(b => b.status === 'completed').length
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#f8fafc]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#DFB13B] mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Loading appointments...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#f8fafc]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Failed to load appointments</h3>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <button
              onClick={fetchBookings}
              className="bg-[#DFB13B] text-white px-6 py-2.5 rounded-xl hover:bg-[#C9A032] transition font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 relative z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-lg sm:text-2xl font-semibold text-slate-800">Massage Appointments</h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5 hidden sm:block">Manage massage and wellness bookings</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Filter Dropdown */}
              <div className="relative" ref={filterDropdownRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-3 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm font-medium text-slate-700"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">{filterOptions.find(opt => opt.value === filterPeriod)?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden w-48 z-[100]">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilterPeriod(option.value)
                          setIsFilterOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                          filterPeriod === option.value
                            ? 'bg-[#DFB13B]/10 text-[#DFB13B] font-semibold'
                            : 'text-slate-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={openNewBookingModal}
                className="flex items-center gap-2 bg-[#DFB13B] text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-[#C9A032] transition font-medium shadow-sm shadow-[#DFB13B]/20 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Appointment</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden" ref={containerRef}>
          {/* Left Panel */}
          <div
            className={`border-r border-slate-200 flex flex-col bg-white transition-all duration-300 ${
              activePanel === 'right' ? 'w-0 overflow-hidden' : activePanel === 'left' ? 'flex-1' : ''
            }`}
            style={{
              width: activePanel === 'right' ? 0 : activePanel === 'left' ? '100%' : `${leftPanelWidth}px`,
              minWidth: activePanel === 'right' ? 0 : activePanel === 'left' ? '100%' : '280px'
            }}
          >
            {/* Panel header with toggle */}
            {activePanel !== 'right' && (
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50">
                <span className="text-xs font-medium text-slate-500">Appointments List</span>
                <button
                  onClick={() => setActivePanel(activePanel === 'left' ? 'both' : 'left')}
                  className={`p-1.5 rounded-lg transition-colors ${activePanel === 'left' ? 'bg-[#DFB13B] text-white' : 'hover:bg-slate-200 text-slate-500'}`}
                  title={activePanel === 'left' ? 'Show both panels' : 'Expand to full width'}
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            )}
            {/* Search & Filter */}
            <div className="p-4 space-y-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] focus:bg-white transition-all text-sm"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                {[
                  { key: 'all', label: 'All', count: stats.total },
                  { key: 'pending', label: 'Pending', count: stats.pending },
                  { key: 'confirmed', label: 'Confirmed', count: stats.confirmed },
                  { key: 'completed', label: 'Done', count: stats.completed }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      statusFilter === tab.key
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab.label}
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                      statusFilter === tab.key ? 'bg-[#DFB13B]/10 text-[#DFB13B]' : 'bg-slate-200/50'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Booking List */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-700">No appointments found</p>
                  <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredBookings.map((booking) => {
                    const statusConfig = getStatusConfig(booking.status)
                    const isSelected = selectedBooking?._id === booking._id

                    return (
                      <div
                        key={booking._id}
                        onClick={() => setSelectedBooking(booking)}
                        className={`p-4 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#DFB13B]/5 border-l-3 border-l-[#DFB13B]'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm ${
                              booking.gender === 'male' ? 'bg-blue-500' : booking.gender === 'female' ? 'bg-pink-500' : 'bg-slate-500'
                            }`}>
                              {booking.firstName?.charAt(0)}{booking.lastName?.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800 text-sm">{booking.firstName} {booking.lastName}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">{booking.serviceTitle}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(booking.appointmentDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {booking.appointmentTime}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">#{booking.enrollmentId}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Resizer Handle */}
          {activePanel === 'both' && (
            <div
              className="w-1 bg-slate-200 hover:bg-[#DFB13B] cursor-col-resize transition-colors relative group flex-shrink-0"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-slate-300 group-hover:bg-[#DFB13B] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-3 h-3 text-white" />
              </div>
            </div>
          )}

          {/* Collapsed Left Panel Button */}
          {activePanel === 'right' && (
            <button
              onClick={() => setActivePanel('both')}
              className="w-10 bg-white border-r border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
              title="Show appointments list"
            >
              <PanelRightClose className="w-4 h-4 text-slate-500" />
            </button>
          )}

          {/* Right Panel - Details */}
          <div
            className={`flex-1 flex flex-col bg-slate-50 transition-all duration-300 ${
              activePanel === 'left' ? 'w-0 overflow-hidden' : ''
            }`}
            style={{
              display: activePanel === 'left' ? 'none' : 'flex'
            }}
          >
            {/* Right panel header with toggle */}
            <div className="flex items-center justify-between px-6 py-2 border-b border-slate-200 bg-white">
              <span className="text-xs font-medium text-slate-500">Booking Details</span>
              <button
                onClick={() => setActivePanel(activePanel === 'right' ? 'both' : 'right')}
                className={`p-1.5 rounded-lg transition-colors ${activePanel === 'right' ? 'bg-[#DFB13B] text-white' : 'hover:bg-slate-100 text-slate-500'}`}
                title={activePanel === 'right' ? 'Show both panels' : 'Expand to full width'}
              >
                <PanelRightClose className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {selectedBooking ? (
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Booking Header Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-[#DFB13B] to-[#C9A032] px-6 py-5 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-xl font-bold">
                          {selectedBooking.firstName?.charAt(0)}{selectedBooking.lastName?.charAt(0)}
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">{selectedBooking.firstName} {selectedBooking.lastName}</h2>
                          <p className="text-white/80 text-sm">{selectedBooking.serviceTitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Appointment ID</p>
                        <p className="text-lg font-mono font-semibold">#{selectedBooking.enrollmentId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 divide-x divide-slate-100">
                    <div className="p-4 text-center">
                      <p className="text-lg font-bold text-slate-800">{formatDate(selectedBooking.appointmentDate)}</p>
                      <p className="text-xs text-slate-500 mt-1">Date</p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-lg font-bold text-slate-800">{selectedBooking.appointmentTime}</p>
                      <p className="text-xs text-slate-500 mt-1">Time</p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-lg font-bold text-slate-800">{selectedBooking.appointmentDay}</p>
                      <p className="text-xs text-slate-500 mt-1">Day</p>
                    </div>
                    <div className="p-4 text-center">
                      {(() => {
                        const statusConfig = getStatusConfig(selectedBooking.status)
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                            {selectedBooking.status}
                          </span>
                        )
                      })()}
                      <p className="text-xs text-slate-500 mt-2">Status</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {selectedBooking.status === 'pending' && (
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'confirmed')}
                      disabled={actionLoading === 'confirmed'}
                      className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-600 transition font-medium shadow-sm disabled:opacity-50"
                    >
                      {actionLoading === 'confirmed' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Confirm Appointment
                    </button>
                  )}
                  {selectedBooking.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'completed')}
                      disabled={actionLoading === 'completed'}
                      className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition font-medium shadow-sm disabled:opacity-50"
                    >
                      {actionLoading === 'completed' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarCheck className="w-4 h-4" />}
                      Mark Complete
                    </button>
                  )}
                  <button
                    onClick={openMessageModal}
                    className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl hover:bg-amber-600 transition font-medium shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                  {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                    <button
                      onClick={() => setShowCancelConfirm(selectedBooking._id)}
                      className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl hover:bg-red-100 transition font-medium border border-red-200"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => setShowDeleteConfirm(selectedBooking._id)}
                    className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-xl hover:bg-red-600 transition font-medium shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-[#DFB13B]/10 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-[#DFB13B]" />
                      </div>
                      <h3 className="font-semibold text-slate-800">Customer Information</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm ${
                          selectedBooking.gender === 'male' ? 'bg-blue-500' : selectedBooking.gender === 'female' ? 'bg-pink-500' : 'bg-slate-500'
                        }`}>
                          {selectedBooking.firstName?.charAt(0)}{selectedBooking.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{selectedBooking.firstName} {selectedBooking.lastName}</p>
                          <p className="text-xs text-slate-500 capitalize">{selectedBooking.gender}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{selectedBooking.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{selectedBooking.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{countryNames[selectedBooking.country] || selectedBooking.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-[#DFB13B]/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-[#DFB13B]" />
                      </div>
                      <h3 className="font-semibold text-slate-800">Appointment Details</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">Date</span>
                        </div>
                        <span className="text-sm font-medium text-slate-800">{formatDate(selectedBooking.appointmentDate)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <span className="text-xs text-slate-500">Time</span>
                          <span className="text-sm font-medium text-slate-800">{selectedBooking.appointmentTime}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <span className="text-xs text-slate-500">Day</span>
                          <span className="text-sm font-medium text-slate-800">{selectedBooking.appointmentDay}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">Booked on {formatDate(selectedBooking.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-[#DFB13B]/10 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-[#DFB13B]" />
                      </div>
                      <h3 className="font-semibold text-slate-800">Service</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-[#DFB13B]/5 to-transparent rounded-xl">
                        <p className="font-medium text-slate-800">{selectedBooking.serviceTitle}</p>
                        <p className="text-xs text-slate-500 mt-1">Wellness Treatment</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Timeline */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-[#DFB13B]/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-[#DFB13B]" />
                      </div>
                      <h3 className="font-semibold text-slate-800">Timeline</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm text-slate-600">Created</span>
                        <span className="text-sm font-medium text-slate-800">{formatDate(selectedBooking.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm text-slate-600">Last Updated</span>
                        <span className="text-sm font-medium text-slate-800">{formatDate(selectedBooking.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {(selectedBooking.specialRequests || selectedBooking.message) && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-[#DFB13B]/10 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-[#DFB13B]" />
                      </div>
                      <h3 className="font-semibold text-slate-800">Additional Notes</h3>
                    </div>
                    <div className="space-y-3">
                      {selectedBooking.specialRequests && (
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Special Requests</p>
                          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{selectedBooking.specialRequests}</p>
                        </div>
                      )}
                      {selectedBooking.message && (
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Message</p>
                          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{selectedBooking.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-lg font-medium text-slate-700">Select an appointment</p>
                <p className="text-sm text-slate-400 mt-1">Choose an appointment from the list to view details</p>
              </div>
            )}
            </div>
          </div>

          {/* Collapsed Right Panel Button */}
          {activePanel === 'left' && (
            <button
              onClick={() => setActivePanel('both')}
              className="w-10 bg-white border-l border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
              title="Show booking details"
            >
              <PanelLeftClose className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4" onClick={() => setShowNewBookingModal(false)}>
          <div
            className="bg-white rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#DFB13B] to-[#C9A032] px-4 sm:px-6 py-4 sm:py-5 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">Create New Appointment</h2>
                  <p className="text-white/70 text-xs sm:text-sm mt-0.5">Add a new massage appointment</p>
                </div>
                <button
                  onClick={() => setShowNewBookingModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateBooking} className="overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                {/* Customer Information */}
                <div className="bg-slate-50/50 rounded-xl p-4 sm:p-5 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-[#DFB13B]/10 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-[#DFB13B]" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Customer Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">First Name</label>
                      <input
                        type="text"
                        value={newBookingForm.firstName}
                        onChange={(e) => setNewBookingForm({ ...newBookingForm, firstName: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] transition-all text-sm"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Last Name</label>
                      <input
                        type="text"
                        value={newBookingForm.lastName}
                        onChange={(e) => setNewBookingForm({ ...newBookingForm, lastName: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] transition-all text-sm"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={newBookingForm.email}
                        onChange={(e) => setNewBookingForm({ ...newBookingForm, email: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] transition-all text-sm"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        value={newBookingForm.phoneNumber}
                        onChange={(e) => setNewBookingForm({ ...newBookingForm, phoneNumber: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] transition-all text-sm"
                        placeholder="+32 123456789"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Country</label>
                      <select
                        value={newBookingForm.country}
                        onChange={(e) => setNewBookingForm({ ...newBookingForm, country: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] transition-all text-sm appearance-none cursor-pointer"
                      >
                        {Object.entries(countryNames).map(([code, name]) => (
                          <option key={code} value={code}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Gender</label>
                      <div className="flex gap-1.5 sm:gap-2">
                        {['male', 'female', 'other'].map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setNewBookingForm({ ...newBookingForm, gender: g })}
                            className={`flex-1 px-2 sm:px-3 py-2.5 rounded-lg sm:rounded-xl border text-xs sm:text-sm font-medium transition-all capitalize ${
                              newBookingForm.gender === g
                                ? 'bg-[#DFB13B] text-white border-[#DFB13B] shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-[#DFB13B]/50'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Selection */}
                <div className="bg-slate-50/50 rounded-xl p-4 sm:p-5 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-[#DFB13B]/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#DFB13B]" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Service Selection</h3>
                  </div>
                  <select
                    value={newBookingForm.serviceId}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, serviceId: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] transition-all text-sm appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.title} - €{service.price} ({service.duration} mins)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Appointment Details */}
                <div className="bg-slate-50/50 rounded-xl p-4 sm:p-5 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-[#DFB13B]/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-[#DFB13B]" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Appointment Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Date</label>
                      <input
                        type="date"
                        value={newBookingForm.appointmentDate}
                        onChange={(e) => setNewBookingForm({ ...newBookingForm, appointmentDate: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] transition-all text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Time</label>
                      <input
                        type="time"
                        value={newBookingForm.appointmentTime}
                        onChange={(e) => setNewBookingForm({ ...newBookingForm, appointmentTime: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] transition-all text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-slate-50/50 rounded-xl p-4 sm:p-5 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-[#DFB13B]/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-[#DFB13B]" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Additional Information</h3>
                    <span className="text-xs text-slate-400 ml-auto">Optional</span>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Special Requests</label>
                      <textarea
                        value={newBookingForm.specialRequests}
                        onChange={(e) => setNewBookingForm({ ...newBookingForm, specialRequests: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] transition-all text-sm h-16 sm:h-20 resize-none"
                        placeholder="Any special requests from the customer..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Message</label>
                      <textarea
                        value={newBookingForm.message}
                        onChange={(e) => setNewBookingForm({ ...newBookingForm, message: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] transition-all text-sm h-16 sm:h-20 resize-none"
                        placeholder="Additional notes..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-t border-slate-200 flex gap-2 sm:gap-3 sticky bottom-0">
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg sm:rounded-xl hover:bg-white transition font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBooking}
                  className="flex-1 px-3 sm:px-4 py-2.5 bg-[#DFB13B] text-white rounded-lg sm:rounded-xl hover:bg-[#C9A032] transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm shadow-[#DFB13B]/20 text-sm"
                >
                  {savingBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Creating...</span>
                      <span className="sm:hidden">Wait...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span className="hidden sm:inline">Create Appointment</span>
                      <span className="sm:hidden">Create</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Delete Appointment?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to delete this appointment? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteBooking(showDeleteConfirm)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCancelConfirm(null)}>
          <div
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Cancel Appointment?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to cancel this appointment? The customer will be notified about the cancellation.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition font-medium"
                >
                  No, Keep It
                </button>
                <button
                  onClick={async () => {
                    await updateBookingStatus(showCancelConfirm, 'cancelled')
                    setShowCancelConfirm(null)
                  }}
                  disabled={actionLoading === 'cancelled'}
                  className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading === 'cancelled' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Yes, Cancel
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowMessageModal(false)}>
          <div
            className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Send Message</h2>
                  <p className="text-white/70 text-sm">Contact {selectedBooking.firstName} {selectedBooking.lastName}</p>
                </div>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Status Notification */}
            {messageStatus && (
              <div className={`px-6 py-3 flex items-center gap-3 ${
                messageStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-b border-emerald-100'
                  : 'bg-red-50 text-red-700 border-b border-red-100'
              }`}>
                {messageStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm font-medium">{messageStatus.text}</span>
              </div>
            )}

            {/* Horizontal Layout */}
            <div className="flex">
              {/* Left Side - Contact Info & Type Selection */}
              <div className="w-64 bg-slate-50 p-5 border-r border-slate-200 space-y-4">
                {/* Customer Contact Info */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Customer Contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 truncate text-xs">{selectedBooking.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 text-xs">{selectedBooking.phoneNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Message Type Selection */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Send via</h3>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setMessageType('email')}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        messageType === 'email'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessageType('sms')}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        messageType === 'sms'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                      SMS
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Message Content */}
              <div className="flex-1 p-5 space-y-4">
                {/* Email Subject (only for email) */}
                {messageType === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                    <input
                      type="text"
                      value={messageSubject}
                      onChange={(e) => setMessageSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
                      placeholder="Enter email subject..."
                    />
                  </div>
                )}

                {/* Message Content */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className={`w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm resize-none ${
                      messageType === 'email' ? 'h-28' : 'h-36'
                    }`}
                    placeholder={messageType === 'email' ? 'Type your email message here...' : 'Type your SMS message here...'}
                  />
                  {messageType === 'sms' && (
                    <p className="text-xs text-slate-400 mt-1">
                      {messageContent.length}/160 characters
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="px-5 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={sendingMessage || !messageContent.trim()}
                    className="flex-1 px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
                  >
                    {sendingMessage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send {messageType === 'email' ? 'Email' : 'SMS'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MassageBooking