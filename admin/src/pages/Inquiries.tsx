import { useState, useEffect, useRef } from 'react'
import { Search, Mail, Phone, Calendar, User, Clock, MessageSquare, Trash2, Eye, CheckCircle, AlertCircle, Archive, Loader2, X, Menu, Filter, ChevronDown } from 'lucide-react'
import Sidebar from '../components/Sidebar'

type FilterPeriod = 'all' | 'day' | 'week' | 'month' | 'year'

interface InquiryData {
  _id: string
  firstName: string
  lastName: string
  email: string
  countryCode: string
  phone: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: string
}

import { API_BASE_URL } from '../config/api'
const API_URL = API_BASE_URL

const Inquiries = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inquiries, setInquiries] = useState<InquiryData[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryData | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  const filterOptions: { value: FilterPeriod; label: string }[] = [
    { value: 'all', label: 'All Time' },
    { value: 'day', label: 'Last 24 Hours' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'year', label: 'Last Year' }
  ]

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

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/contact?source=massage`)
      console.log('Fetch inquiries response:', response)
      if (!response.ok) throw new Error('Failed to fetch inquiries')
      const data = await response.json()
    console.log('Fetch inquiries response:', data)
      if (data.success) {
        setInquiries(data.data)
        if (data.data.length > 0 && !selectedInquiry) {
          setSelectedInquiry(data.data[0])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inquiries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      setActionLoading(status)
      const response = await fetch(`${API_URL}/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!response.ok) throw new Error('Failed to update status')
      await fetchInquiries()
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, status: status as InquiryData['status'] } : null)
      }
    } catch (err) {
      console.error('Error updating status:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const deleteInquiry = async (id: string) => {
    try {
      setActionLoading('delete')
      const response = await fetch(`${API_URL}/contact/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete inquiry')
      await fetchInquiries()
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(inquiries.length > 1 ? inquiries.find(i => i._id !== id) || null : null)
      }
      setShowDeleteConfirm(false)
      setDeleteId(null)
    } catch (err) {
      console.error('Error deleting inquiry:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const getFilteredByPeriod = (data: InquiryData[]) => {
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

    return data.filter(inquiry => new Date(inquiry.createdAt) >= startDate)
  }

  const filteredInquiries = getFilteredByPeriod(inquiries).filter(inquiry => {
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter
    const matchesSearch =
      inquiry.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      new: 'bg-blue-100 text-blue-700',
      read: 'bg-yellow-100 text-yellow-700',
      replied: 'bg-green-100 text-green-700',
      archived: 'bg-gray-100 text-gray-700'
    }
    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateString)
  }

  const statusCounts = {
    all: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    read: inquiries.filter(i => i.status === 'read').length,
    replied: inquiries.filter(i => i.status === 'replied').length,
    archived: inquiries.filter(i => i.status === 'archived').length
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Massage Inquiries</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage massage contact form submissions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B]"
                />
              </div>

              {/* Time Period Filter */}
              <div className="relative" ref={filterDropdownRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">{filterOptions.find(opt => opt.value === filterPeriod)?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-48 z-[100]">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilterPeriod(option.value)
                          setIsFilterOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                          filterPeriod === option.value
                            ? 'bg-[#DFB13B]/10 text-[#DFB13B] font-semibold'
                            : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 mt-4">
            {['all', 'new', 'read', 'replied', 'archived'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-[#DFB13B] to-[#C9A032] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                  statusFilter === status ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {statusCounts[status as keyof typeof statusCounts]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* List */}
          <div className="w-96 border-r border-gray-200 bg-white overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-[#DFB13B] animate-spin" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 text-red-500">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <MessageSquare className="w-12 h-12 mb-3" />
                <p>No inquiries found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredInquiries.map(inquiry => (
                  <div
                    key={inquiry._id}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedInquiry?._id === inquiry._id ? 'bg-[#FFEEC3]/20 border-l-4 border-[#DFB13B]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#DFB13B] to-[#C9A032] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {inquiry.firstName.charAt(0)}{inquiry.lastName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {inquiry.firstName} {inquiry.lastName}
                          </h3>
                          <p className="text-xs text-gray-500">{inquiry.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {inquiry.message}
                    </p>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {getTimeAgo(inquiry.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="flex-1 bg-gray-50 overflow-y-auto">
            {selectedInquiry ? (
              <div className="p-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#DFB13B] to-[#C9A032] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#DFB13B]/30">
                        {selectedInquiry.firstName.charAt(0)}{selectedInquiry.lastName.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {selectedInquiry.firstName} {selectedInquiry.lastName}
                        </h2>
                        <p className="text-gray-500">{selectedInquiry.email}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedInquiry.status)}`}>
                          {selectedInquiry.status.charAt(0).toUpperCase() + selectedInquiry.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setDeleteId(selectedInquiry._id)
                        setShowDeleteConfirm(true)
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">{selectedInquiry.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedInquiry.countryCode} {selectedInquiry.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Received</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(selectedInquiry.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Full Name</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedInquiry.firstName} {selectedInquiry.lastName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#DFB13B]" />
                    Message
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => updateStatus(selectedInquiry._id, 'new')}
                      disabled={actionLoading !== null || selectedInquiry.status === 'new'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedInquiry.status === 'new'
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      } disabled:opacity-50`}
                    >
                      {actionLoading === 'new' ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
                      Mark as New
                    </button>
                    <button
                      onClick={() => updateStatus(selectedInquiry._id, 'read')}
                      disabled={actionLoading !== null || selectedInquiry.status === 'read'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedInquiry.status === 'read'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      } disabled:opacity-50`}
                    >
                      {actionLoading === 'read' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                      Mark as Read
                    </button>
                    <button
                      onClick={() => updateStatus(selectedInquiry._id, 'replied')}
                      disabled={actionLoading !== null || selectedInquiry.status === 'replied'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedInquiry.status === 'replied'
                          ? 'bg-green-500 text-white'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      } disabled:opacity-50`}
                    >
                      {actionLoading === 'replied' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Mark as Replied
                    </button>
                    <button
                      onClick={() => updateStatus(selectedInquiry._id, 'archived')}
                      disabled={actionLoading !== null || selectedInquiry.status === 'archived'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedInquiry.status === 'archived'
                          ? 'bg-gray-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      {actionLoading === 'archived' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare className="w-16 h-16 mb-4" />
                <p className="text-lg">Select an inquiry to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Inquiry</h3>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteId(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this inquiry? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteId(null)
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteId && deleteInquiry(deleteId)}
                disabled={actionLoading === 'delete'}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading === 'delete' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inquiries
