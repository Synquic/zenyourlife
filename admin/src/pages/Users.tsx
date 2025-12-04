import { useState, useEffect } from 'react'
import { Search, Users as UsersIcon, Mail, Phone, MapPin, Calendar, X, Loader2, Eye, UserCircle, CalendarCheck, Home, Sparkles, TrendingUp, Clock, Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'

import { API_BASE_URL } from '../config/api'

interface UserData {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phoneNumber: string
  country: string
  gender: string
  totalBookings: number
  firstBooking: string
  lastBooking: string
}

interface RentalUserData {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  gender: string
  totalBookings: number
  firstBooking: string
  lastBooking: string
}

interface UserDetails {
  user: {
    firstName: string
    lastName: string
    fullName: string
    email: string
    phoneNumber: string
    country: string
    gender: string
  }
  stats: {
    totalBookings: number
    completedBookings: number
    pendingBookings: number
    cancelledBookings: number
  }
  bookings: Array<{
    _id: string
    enrollmentId: number
    serviceTitle: string
    appointmentDate: string
    appointmentTime: string
    status: string
  }>
}

interface RentalUserDetails {
  user: {
    firstName: string
    lastName: string
    fullName: string
    email: string
    phone: string
    gender: string
  }
  stats: {
    totalBookings: number
    completedBookings: number
    pendingBookings: number
    confirmedBookings: number
    cancelledBookings: number
  }
  bookings: Array<{
    _id: string
    bookingId: string
    propertyName: string
    checkInDate: string
    checkInTime: string
    checkOutTime: string
    status: string
    totalAmount: number
  }>
}

interface RentalBookingResponse {
  _id: string
  bookingId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: string
  property?: {
    name: string
  }
  booking?: {
    checkInDate: string
    checkInTime: string
    checkOutTime: string
  }
  payment?: {
    totalAmount: number
  }
  status: string
  createdAt: string
}

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

const Users = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'massage' | 'rental'>('massage')

  const [massageUsers, setMassageUsers] = useState<UserData[]>([])
  const [massageLoading, setMassageLoading] = useState(true)
  const [selectedMassageUser, setSelectedMassageUser] = useState<UserDetails | null>(null)

  const [rentalUsers, setRentalUsers] = useState<RentalUserData[]>([])
  const [rentalLoading, setRentalLoading] = useState(true)
  const [selectedRentalUser, setSelectedRentalUser] = useState<RentalUserDetails | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const fetchMassageUsers = async () => {
    try {
      setMassageLoading(true)
      const response = await fetch(`${API_BASE_URL}/enrollments/users`)
      const data = await response.json()
      if (data.success) {
        setMassageUsers(data.data)
      }
    } catch (error) {
      console.error('Error fetching massage users:', error)
    } finally {
      setMassageLoading(false)
    }
  }

  const fetchRentalUsers = async () => {
    try {
      setRentalLoading(true)
      const response = await fetch(`${API_BASE_URL}/bookings`)
      const data = await response.json()
      if (data.success) {
        const userMap = new Map<string, RentalUserData>()

        data.data.forEach((booking: RentalBookingResponse) => {
          const email = booking.email
          if (userMap.has(email)) {
            const existingUser = userMap.get(email)!
            existingUser.totalBookings += 1
            if (new Date(booking.createdAt) > new Date(existingUser.lastBooking)) {
              existingUser.lastBooking = booking.createdAt
            }
            if (new Date(booking.createdAt) < new Date(existingUser.firstBooking)) {
              existingUser.firstBooking = booking.createdAt
            }
          } else {
            userMap.set(email, {
              id: booking._id,
              firstName: booking.firstName,
              lastName: booking.lastName,
              fullName: `${booking.firstName} ${booking.lastName}`,
              email: booking.email,
              phone: booking.phone,
              gender: booking.gender,
              totalBookings: 1,
              firstBooking: booking.createdAt,
              lastBooking: booking.createdAt
            })
          }
        })

        setRentalUsers(Array.from(userMap.values()))
      }
    } catch (error) {
      console.error('Error fetching rental users:', error)
    } finally {
      setRentalLoading(false)
    }
  }

  useEffect(() => {
    fetchMassageUsers()
    fetchRentalUsers()
  }, [])

  const fetchMassageUserDetails = async (email: string) => {
    setLoadingDetails(true)
    try {
      const response = await fetch(`${API_BASE_URL}/enrollments/users/${encodeURIComponent(email)}`)
      const data = await response.json()
      if (data.success) {
        setSelectedMassageUser(data.data)
        setSelectedRentalUser(null)
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error('Error fetching massage user details:', error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const fetchRentalUserDetails = async (email: string) => {
    setLoadingDetails(true)
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`)
      const data = await response.json()
      if (data.success) {
        const userBookings = data.data.filter((b: RentalBookingResponse) => b.email === email)

        if (userBookings.length > 0) {
          const firstBooking = userBookings[0]
          const stats = {
            totalBookings: userBookings.length,
            completedBookings: userBookings.filter((b: RentalBookingResponse) => b.status === 'completed').length,
            pendingBookings: userBookings.filter((b: RentalBookingResponse) => b.status === 'pending').length,
            confirmedBookings: userBookings.filter((b: RentalBookingResponse) => b.status === 'confirmed').length,
            cancelledBookings: userBookings.filter((b: RentalBookingResponse) => b.status === 'cancelled').length
          }

          setSelectedRentalUser({
            user: {
              firstName: firstBooking.firstName,
              lastName: firstBooking.lastName,
              fullName: `${firstBooking.firstName} ${firstBooking.lastName}`,
              email: firstBooking.email,
              phone: firstBooking.phone,
              gender: firstBooking.gender
            },
            stats,
            bookings: userBookings.map((b: RentalBookingResponse) => ({
              _id: b._id,
              bookingId: b.bookingId,
              propertyName: b.property?.name || 'N/A',
              checkInDate: b.booking?.checkInDate || b.createdAt,
              checkInTime: b.booking?.checkInTime || 'N/A',
              checkOutTime: b.booking?.checkOutTime || 'N/A',
              status: b.status,
              totalAmount: b.payment?.totalAmount || 0
            }))
          })
          setSelectedMassageUser(null)
          setIsModalOpen(true)
        }
      }
    } catch (error) {
      console.error('Error fetching rental user details:', error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const currentUsers = activeTab === 'massage' ? massageUsers : rentalUsers
  const filteredUsers = currentUsers.filter(user => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (activeTab === 'massage'
        ? (user as UserData).phoneNumber?.includes(searchQuery)
        : (user as RentalUserData).phone?.includes(searchQuery))

    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      case 'confirmed': return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200'
      case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200'
      default: return 'bg-slate-50 text-slate-700 border border-slate-200'
    }
  }

  const currentLoading = activeTab === 'massage' ? massageLoading : rentalLoading
  const totalUsers = currentUsers.length
  const maleUsers = currentUsers.filter(u => u.gender === 'male').length
  const femaleUsers = currentUsers.filter(u => u.gender === 'female').length
  const totalBookings = currentUsers.reduce((sum, u) => sum + u.totalBookings, 0)

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Customer Management</h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">View and manage your customers across all services</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-80 focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B] focus:bg-white transition-all text-sm"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Tab Selector */}
          <div className="bg-white rounded-2xl p-1.5 inline-flex gap-1 shadow-sm border border-slate-100 mb-8">
            <button
              onClick={() => setActiveTab('massage')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'massage'
                  ? 'bg-gradient-to-r from-[#DFB13B] to-[#C9A032] text-white shadow-lg shadow-[#DFB13B]/20'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Massage Bookings
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === 'massage' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {massageUsers.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('rental')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'rental'
                  ? 'bg-gradient-to-r from-[#DFB13B] to-[#C9A032] text-white shadow-lg shadow-[#DFB13B]/20'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              Rental Bookings
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === 'rental' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {rentalUsers.length}
              </span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm group hover:shadow-md hover:border-[#DFB13B]/20 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-slate-800">{totalUsers}</p>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">Active</span> users
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#DFB13B]/10 to-[#DFB13B]/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UsersIcon className="w-6 h-6 text-[#DFB13B]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm group hover:shadow-md hover:border-blue-200 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Male Customers</p>
                  <p className="text-3xl font-bold text-slate-800">{maleUsers}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {totalUsers > 0 ? Math.round((maleUsers / totalUsers) * 100) : 0}% of total
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm group hover:shadow-md hover:border-pink-200 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Female Customers</p>
                  <p className="text-3xl font-bold text-slate-800">{femaleUsers}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {totalUsers > 0 ? Math.round((femaleUsers / totalUsers) * 100) : 0}% of total
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserCircle className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm group hover:shadow-md hover:border-amber-200 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-slate-800">{totalBookings}</p>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    All time
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CalendarCheck className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-700">
                  {activeTab === 'massage' ? 'Massage' : 'Rental'} Customers
                </h3>
                <span className="text-sm text-slate-500">
                  Showing {filteredUsers.length} of {totalUsers} customers
                </span>
              </div>
            </div>

            {/* Loading State */}
            {currentLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-[#DFB13B] animate-spin mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Loading customers...</p>
                </div>
              </div>
            )}

            {/* User Cards */}
            {!currentLoading && (
              <div className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="px-6 py-4 hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm ${
                          user.gender === 'male'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                            : user.gender === 'female'
                            ? 'bg-gradient-to-br from-pink-500 to-pink-600'
                            : 'bg-gradient-to-br from-slate-500 to-slate-600'
                        }`}>
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>

                        {/* User Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-800">{user.fullName}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${
                              user.gender === 'male'
                                ? 'bg-blue-50 text-blue-600'
                                : user.gender === 'female'
                                ? 'bg-pink-50 text-pink-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {user.gender}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-slate-500 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              {user.email}
                            </span>
                            <span className="text-sm text-slate-500 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {activeTab === 'massage' ? (user as UserData).phoneNumber : (user as RentalUserData).phone}
                            </span>
                            {activeTab === 'massage' && (
                              <span className="text-sm text-slate-500 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {countryNames[(user as UserData).country] || (user as UserData).country}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex items-center gap-6">
                        {/* Bookings Count */}
                        <div className="text-center">
                          <p className="text-2xl font-bold text-slate-800">{user.totalBookings}</p>
                          <p className="text-xs text-slate-500">Bookings</p>
                        </div>

                        {/* Last Activity */}
                        <div className="text-right min-w-[100px]">
                          <p className="text-sm font-medium text-slate-700">{formatDate(user.lastBooking)}</p>
                          <p className="text-xs text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            Last active
                          </p>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => activeTab === 'massage' ? fetchMassageUserDetails(user.email) : fetchRentalUserDetails(user.email)}
                          disabled={loadingDetails}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-[#DFB13B] hover:text-white transition-all text-sm font-medium group-hover:bg-[#DFB13B] group-hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {filteredUsers.length === 0 && !currentLoading && (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <UsersIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-1">No customers found</h3>
                    <p className="text-slate-500 text-sm">
                      {searchQuery
                        ? 'Try adjusting your search terms'
                        : `Customers will appear here once they make ${activeTab === 'massage' ? 'massage' : 'rental'} bookings`
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Massage User Details Modal */}
      {isModalOpen && selectedMassageUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div
            className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Gradient */}
            <div className="bg-gradient-to-r from-[#DFB13B] to-[#C9A032] px-6 py-8 text-white relative">
              <button
                onClick={() => { setIsModalOpen(false); setSelectedMassageUser(null) }}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl font-bold">
                  {selectedMassageUser.user.firstName?.charAt(0)}{selectedMassageUser.user.lastName?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-white/70" />
                    <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Massage Customer</span>
                  </div>
                  <h3 className="text-xl font-semibold">{selectedMassageUser.user.fullName}</h3>
                  <p className="text-white/80 text-sm">{selectedMassageUser.user.email}</p>
                </div>
              </div>

              {/* Contact Info Pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1.5 bg-white/10 backdrop-blur rounded-lg text-sm flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  {selectedMassageUser.user.phoneNumber}
                </span>
                <span className="px-3 py-1.5 bg-white/10 backdrop-blur rounded-lg text-sm flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {countryNames[selectedMassageUser.user.country] || selectedMassageUser.user.country}
                </span>
                <span className="px-3 py-1.5 bg-white/10 backdrop-blur rounded-lg text-sm capitalize">
                  {selectedMassageUser.user.gender}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-800">{selectedMassageUser.stats.totalBookings}</p>
                  <p className="text-xs text-slate-500 font-medium">Total</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{selectedMassageUser.stats.completedBookings}</p>
                  <p className="text-xs text-emerald-600 font-medium">Completed</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-amber-600">{selectedMassageUser.stats.pendingBookings}</p>
                  <p className="text-xs text-amber-600 font-medium">Pending</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-red-500">{selectedMassageUser.stats.cancelledBookings}</p>
                  <p className="text-xs text-red-500 font-medium">Cancelled</p>
                </div>
              </div>

              {/* Booking History */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Booking History</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {selectedMassageUser.bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{booking.serviceTitle}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatDate(booking.appointmentDate)} at {booking.appointmentTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">#{booking.enrollmentId}</span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rental User Details Modal */}
      {isModalOpen && selectedRentalUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div
            className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Gradient */}
            <div className="bg-gradient-to-r from-[#DFB13B] to-[#C9A032] px-6 py-8 text-white relative">
              <button
                onClick={() => { setIsModalOpen(false); setSelectedRentalUser(null) }}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl font-bold">
                  {selectedRentalUser.user.firstName?.charAt(0)}{selectedRentalUser.user.lastName?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Home className="w-4 h-4 text-white/70" />
                    <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Rental Customer</span>
                  </div>
                  <h3 className="text-xl font-semibold">{selectedRentalUser.user.fullName}</h3>
                  <p className="text-white/80 text-sm">{selectedRentalUser.user.email}</p>
                </div>
              </div>

              {/* Contact Info Pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1.5 bg-white/10 backdrop-blur rounded-lg text-sm flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  {selectedRentalUser.user.phone}
                </span>
                <span className="px-3 py-1.5 bg-white/10 backdrop-blur rounded-lg text-sm capitalize">
                  {selectedRentalUser.user.gender}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-slate-800">{selectedRentalUser.stats.totalBookings}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Total</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-emerald-600">{selectedRentalUser.stats.completedBookings}</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Done</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-blue-600">{selectedRentalUser.stats.confirmedBookings}</p>
                  <p className="text-[10px] text-blue-600 font-medium">Confirmed</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-amber-600">{selectedRentalUser.stats.pendingBookings}</p>
                  <p className="text-[10px] text-amber-600 font-medium">Pending</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-red-500">{selectedRentalUser.stats.cancelledBookings}</p>
                  <p className="text-[10px] text-red-500 font-medium">Cancelled</p>
                </div>
              </div>

              {/* Booking History */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Rental History</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {selectedRentalUser.bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-slate-800 text-sm">{booking.propertyName}</p>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{formatDate(booking.checkInDate)} • {booking.checkInTime} - {booking.checkOutTime}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">€{booking.totalAmount?.toFixed(2)}</span>
                          <span className="text-slate-400">#{booking.bookingId}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
