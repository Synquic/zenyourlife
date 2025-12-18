import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Calendar, Users, TrendingUp, Clock, CheckCircle, Loader2, ArrowRight, AlertCircle, Activity, Zap, BarChart3, Eye, Menu, Filter, ChevronDown } from 'lucide-react'
import Sidebar from '../components/Sidebar'

import { API_BASE_URL } from '../config/api'

type FilterPeriod = 'all' | 'day' | 'week' | 'month' | 'year'

interface Appointment {
  _id: string
  firstName: string
  lastName: string
  serviceTitle: string
  appointmentDate: string
  appointmentTime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  email: string
  phoneNumber: string
}

interface DashboardStats {
  upcomingBookings: number
  pendingBookings: number
  totalBookings: number
  confirmedRate: number
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterDropdownRef = useRef<HTMLDivElement>(null)
  const [stats, setStats] = useState<DashboardStats>({
    upcomingBookings: 0,
    pendingBookings: 0,
    totalBookings: 0,
    confirmedRate: 0
  })

  const filterOptions: { value: FilterPeriod; label: string }[] = [
    { value: 'all', label: 'All Time' },
    { value: 'day', label: 'Last 24 Hours' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'year', label: 'Last Year' }
  ]

  // Filter appointments based on selected period
  const getFilteredAppointments = (data: Appointment[]) => {
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

    return data.filter(apt => new Date(apt.appointmentDate) >= startDate)
  }

  const filteredAppointments = getFilteredAppointments(appointments)

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch from enrollments API (massage bookings)
        const enrollmentsRes = await fetch(`${API_BASE_URL}/enrollments`)
        const enrollmentsData = await enrollmentsRes.json()

        if (enrollmentsData.success) setAppointments(enrollmentsData.data)
      } catch (err) {
        setError('Error connecting to server')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Recalculate stats when filter changes
  useEffect(() => {
    calculateStats(filteredAppointments)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterPeriod, appointments])

  const calculateStats = (appointmentsData: Appointment[]) => {
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const upcomingMassage = appointmentsData.filter(apt => {
      const aptDate = new Date(apt.appointmentDate)
      return aptDate >= now && aptDate <= sevenDaysFromNow && apt.status !== 'cancelled'
    }).length

    const pendingMassage = appointmentsData.filter(apt => apt.status === 'pending').length

    const totalAll = appointmentsData.length
    const confirmedAll = appointmentsData.filter(apt => apt.status === 'confirmed' || apt.status === 'completed').length
    const rate = totalAll > 0 ? Math.round((confirmedAll / totalAll) * 100) : 0

    setStats({
      upcomingBookings: upcomingMassage,
      pendingBookings: pendingMassage,
      totalBookings: appointmentsData.length,
      confirmedRate: rate
    })
  }

  const recentMassageBookings = filteredAppointments.slice(0, 6).map(apt => ({
    id: apt._id,
    name: `${apt.firstName} ${apt.lastName}`,
    date: new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    service: apt.serviceTitle,
    status: apt.status,
    time: apt.appointmentTime
  }))

  const getChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    const last6Months = []

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      const monthName = months[monthIndex]
      const massageCount = filteredAppointments.filter(apt => new Date(apt.appointmentDate).getMonth() === monthIndex).length
      last6Months.push({ month: monthName, massage: massageCount })
    }
    return last6Months
  }

  const chartData = getChartData()
  const maxChartValue = Math.max(...chartData.map(d => d.massage), 1)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed': return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' }
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' }
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
      case 'completed': return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' }
      default: return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' }
    }
  }

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Modern Design */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 relative z-50">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors -ml-2"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">{currentDate}</p>
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-xs sm:text-sm font-medium text-slate-700"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">{filterOptions.find(opt => opt.value === filterPeriod)?.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden w-48 z-[100]">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilterPeriod(option.value)
                        setIsFilterOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                        filterPeriod === option.value
                          ? 'bg-gradient-to-r from-[#DFB13B]/10 to-[#C9A032]/5 text-[#DFB13B] font-semibold'
                          : 'text-slate-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats row - Same gradient cards on mobile and desktop */}
          {!loading && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3">
              {/* Total Bookings */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700 p-3 sm:p-3.5 shadow-md">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalBookings}</p>
                    <p className="text-[11px] sm:text-xs text-white/80">Total Bookings</p>
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Upcoming */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 p-3 sm:p-3.5 shadow-md">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.upcomingBookings}</p>
                    <p className="text-[11px] sm:text-xs text-white/80">Upcoming</p>
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Pending */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 p-3 sm:p-3.5 shadow-md">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.pendingBookings}</p>
                    <p className="text-[11px] sm:text-xs text-white/80">Pending</p>
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Confirmed Rate */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 p-3 sm:p-3.5 shadow-md">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.confirmedRate}%</p>
                    <p className="text-[11px] sm:text-xs text-white/80">Confirmed Rate</p>
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#DFB13B] to-[#C9A032] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-white" />
                </div>
                <p className="text-slate-500 font-medium text-sm sm:text-base">Loading your dashboard...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 text-red-700 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-sm sm:text-base">Connection Error</p>
                <p className="text-xs sm:text-sm text-red-600">{error}. Please make sure the backend server is running.</p>
              </div>
            </div>
          )}

          {!loading && (
            <>
              {/* Welcome Banner - Compact Modern Design */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#DFB13B] via-[#E8C54A] to-[#C9A032] rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-8 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Welcome back, Admin!</h2>
                    <p className="text-white/80 text-xs sm:text-sm mt-0.5">Here's what's happening with your massage appointments today.</p>
                  </div>
                  <button
                    onClick={() => navigate('/massage-appointments')}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all self-start sm:self-auto"
                  >
                    <Eye className="w-4 h-4" />
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column - Bookings */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {/* Recent Massage Bookings - Modern Card */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-base">Recent Bookings</h3>
                          <p className="text-xs text-slate-500">{stats.totalBookings} total appointments</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/massage-appointments')}
                        className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 font-semibold bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                      >
                        View All
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {recentMassageBookings.length === 0 ? (
                        <div className="p-6 sm:p-8 text-center">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Calendar className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-slate-500 text-sm">No bookings yet</p>
                        </div>
                      ) : (
                        recentMassageBookings.map((booking) => {
                          const statusConfig = getStatusConfig(booking.status)
                          return (
                            <div key={booking.id} className="px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-slate-50/50 transition group">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 sm:w-9 sm:h-9 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg flex items-center justify-center text-violet-600 font-semibold text-sm">
                                    {booking.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-800 text-sm">{booking.name}</p>
                                    <p className="text-xs text-slate-500 truncate max-w-[140px] sm:max-w-[200px]">{booking.service}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[10px] font-semibold uppercase ${statusConfig.bg} ${statusConfig.text}`}>
                                    {booking.status}
                                  </span>
                                  <p className="text-[10px] sm:text-[10px] text-slate-400 mt-1">{booking.date} • {booking.time}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>

                  {/* Chart Section - Modern Card */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-base">Booking Analytics</h3>
                          <p className="text-xs text-slate-500">Last 6 months performance</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600"></div>
                        <span className="text-slate-600 font-medium hidden sm:inline">Massage Appointments</span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                    <div className="flex items-end justify-between h-32 sm:h-48 px-1 sm:px-4 pt-4">
                      {chartData.map((data, index) => {
                        const currentMonthName = new Date().toLocaleString('en-US', { month: 'short' })
                        const isCurrentMonth = data.month === currentMonthName
                        const massageHeight = maxChartValue > 0 ? (data.massage / maxChartValue) * 100 : 0
                        return (
                          <div key={index} className="flex flex-col items-center gap-1 sm:gap-2 flex-1 group">
                            <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded-lg mb-1">
                              {data.massage} bookings
                            </div>
                            <div className="flex gap-0.5 sm:gap-1.5">
                              <div
                                className={`w-6 sm:w-10 rounded-t-md sm:rounded-t-lg transition-all duration-500 ${isCurrentMonth ? 'bg-gradient-to-t from-violet-600 to-purple-500' : 'bg-gradient-to-t from-violet-400 to-purple-300'}`}
                                style={{ height: `${Math.max(massageHeight, 8)}px` }}
                              />
                            </div>
                            <span className={`text-[10px] sm:text-xs font-medium ${isCurrentMonth ? 'text-violet-600 bg-violet-50 px-1.5 sm:px-2 py-0.5 rounded-full' : 'text-slate-500'}`}>
                              {data.month}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Quick Actions - Modern Card */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-100">
                      <div className="w-11 h-11 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-800 text-base">Quick Actions</h2>
                        <p className="text-xs text-slate-500">Navigate to sections</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-2.5">
                      <button
                        onClick={() => navigate('/massage-appointments')}
                        className="w-full flex items-center gap-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white p-3.5 rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all group"
                      >
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="text-left flex-1">
                          <span className="text-sm font-semibold block">Massage Bookings</span>
                          <span className="text-xs text-white/70">View all appointments</span>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>

                      <button
                        onClick={() => navigate('/services')}
                        className="w-full flex items-center gap-3 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 p-3.5 rounded-xl hover:shadow-md transition-all group border border-slate-200"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left flex-1">
                          <span className="text-sm font-semibold block">Services</span>
                          <span className="text-xs text-slate-500">Manage services</span>
                        </div>
                        <Eye className="w-4 h-4 text-slate-400" />
                      </button>

                      <button
                        onClick={() => navigate('/users')}
                        className="w-full flex items-center gap-3 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 p-3.5 rounded-xl hover:shadow-md transition-all group border border-slate-200"
                      >
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="text-left flex-1">
                          <span className="text-sm font-semibold block">Customers</span>
                          <span className="text-xs text-slate-500">User management</span>
                        </div>
                        <Eye className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Performance Card - Modern Glassmorphism */}
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800" />
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-violet-500/20 rounded-full blur-2xl" />
                    <div className="relative z-10 p-4 sm:p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base">Performance</h3>
                          <p className="text-xs text-slate-400">Real-time metrics</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white/5 backdrop-blur rounded-xl p-3.5">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-300">Confirmation Rate</span>
                            <span className="font-bold text-emerald-400">{stats.confirmedRate}%</span>
                          </div>
                          <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full transition-all duration-1000"
                              style={{ width: `${stats.confirmedRate}%` }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/5 backdrop-blur rounded-xl p-3 text-center border border-white/10">
                            <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalBookings}</p>
                            <p className="text-xs text-slate-400">Total Bookings</p>
                          </div>
                          <div className="bg-white/5 backdrop-blur rounded-xl p-3 text-center border border-white/10">
                            <p className="text-xl sm:text-2xl font-bold text-amber-400">{stats.pendingBookings}</p>
                            <p className="text-xs text-slate-400">Pending</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Status - Modern Card */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-100">
                      <div className="w-11 h-11 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">System Status</h3>
                        <p className="text-xs text-slate-500">Server health</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-100">
                        <div className="relative">
                          <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse" />
                          <div className="absolute inset-0 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-emerald-700 block">All systems operational</span>
                          <span className="text-xs text-emerald-600">Last checked: Just now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
