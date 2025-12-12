import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Calendar, Users, TrendingUp, Clock, CheckCircle, Loader2, ArrowRight, AlertCircle, Activity, Zap, BarChart3, Eye, Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'

import { API_BASE_URL } from '../config/api'

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
  const [stats, setStats] = useState<DashboardStats>({
    upcomingBookings: 0,
    pendingBookings: 0,
    totalBookings: 0,
    confirmedRate: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch from enrollments API (massage bookings)
        const enrollmentsRes = await fetch(`${API_BASE_URL}/enrollments`)
        const enrollmentsData = await enrollmentsRes.json()

        if (enrollmentsData.success) setAppointments(enrollmentsData.data)
        calculateStats(enrollmentsData.data || [])
      } catch (err) {
        setError('Error connecting to server')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  const recentMassageBookings = appointments.slice(0, 6).map(apt => ({
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
      const massageCount = appointments.filter(apt => new Date(apt.appointmentDate).getMonth() === monthIndex).length
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
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#DFB13B] to-[#C9A032] flex items-center justify-center shadow-lg shadow-[#DFB13B]/20">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base sm:text-xl font-bold text-slate-800">Dashboard</h1>
                  <p className="text-slate-500 text-[10px] sm:text-xs hidden sm:block">{currentDate}</p>
                </div>
              </div>
            </div>

          </div>
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
              {/* Welcome Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#DFB13B] via-[#C9A032] to-[#B8922D] rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-1/3 w-16 sm:w-32 h-16 sm:h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative z-10">
                  <div className="mb-3 sm:mb-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-white mb-1">Welcome back, Admin!</h2>
                    <p className="text-white/70 text-xs sm:text-sm">Here's what's happening with your massage appointments today.</p>
                  </div>
                  <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
                    <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 text-center">
                      <p className="text-xl sm:text-3xl font-bold text-white">{stats.upcomingBookings}</p>
                      <p className="text-white/70 text-[10px] sm:text-xs mt-0.5">Upcoming</p>
                    </div>
                    <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 text-center">
                      <p className="text-xl sm:text-3xl font-bold text-white">{stats.pendingBookings}</p>
                      <p className="text-white/70 text-[10px] sm:text-xs mt-0.5">Pending</p>
                    </div>
                    <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 text-center">
                      <p className="text-xl sm:text-3xl font-bold text-white">{stats.confirmedRate}%</p>
                      <p className="text-white/70 text-[10px] sm:text-xs mt-0.5">Confirmed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="group bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate('/appointments')}>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-[10px] sm:text-xs bg-violet-50 text-violet-600 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium">Massage</span>
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">{stats.totalBookings}</p>
                  <p className="text-xs sm:text-sm text-slate-500">Total Appointments</p>
                </div>

                <div className="group bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate('/appointments')}>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-600 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium">7 Days</span>
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">{stats.upcomingBookings}</p>
                  <p className="text-xs sm:text-sm text-slate-500">Upcoming Bookings</p>
                </div>

                <div className="group bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-[10px] sm:text-xs bg-amber-50 text-amber-600 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium">Action</span>
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">{stats.pendingBookings}</p>
                  <p className="text-xs sm:text-sm text-slate-500">Awaiting Confirmation</p>
                </div>

                <div className="group bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-600 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium">{stats.confirmedRate}%</span>
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">{stats.totalBookings}</p>
                  <p className="text-xs sm:text-sm text-slate-500">All Time Bookings</p>
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column - Bookings */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {/* Recent Massage Bookings */}
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md shadow-violet-500/20">
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Recent Massage Bookings</h3>
                            <p className="text-[10px] sm:text-xs text-slate-500">{stats.totalBookings} total appointments</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('/massage-appointments')}
                          className="flex items-center gap-1 text-[10px] sm:text-xs text-violet-600 hover:text-violet-700 font-medium bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-sm hover:shadow transition-all"
                        >
                          View All
                          <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {recentMassageBookings.length === 0 ? (
                        <div className="p-6 sm:p-8 text-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                          </div>
                          <p className="text-slate-500 text-xs sm:text-sm">No bookings yet</p>
                        </div>
                      ) : (
                        recentMassageBookings.map((booking) => {
                          const statusConfig = getStatusConfig(booking.status)
                          return (
                            <div key={booking.id} className="px-3 sm:px-5 py-2.5 sm:py-3.5 hover:bg-slate-50/50 transition group">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg flex items-center justify-center text-violet-600 font-semibold text-xs sm:text-sm">
                                    {booking.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-800 text-xs sm:text-sm">{booking.name}</p>
                                    <p className="text-[10px] sm:text-xs text-slate-500 truncate max-w-[120px] sm:max-w-[200px]">{booking.service}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[10px] font-semibold uppercase ${statusConfig.bg} ${statusConfig.text}`}>
                                    {booking.status}
                                  </span>
                                  <p className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5 sm:mt-1">{booking.date} • {booking.time}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>

                  {/* Chart Section */}
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-sm sm:text-lg font-semibold text-slate-800">Booking Analytics</h2>
                          <p className="text-[10px] sm:text-xs text-slate-500">Last 6 months performance</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600"></div>
                          <span className="text-slate-600 font-medium">Massage Appointments</span>
                        </div>
                      </div>
                    </div>
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

                {/* Right Column */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm p-3 sm:p-5">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                      <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Quick Actions</h2>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => navigate('/massage-appointments')}
                        className="w-full flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all group"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="text-left flex-1">
                          <span className="text-xs sm:text-sm font-semibold block">Massage Bookings</span>
                          <span className="text-[10px] sm:text-xs text-white/70">View all appointments</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>

                      <button
                        onClick={() => navigate('/services')}
                        className="w-full flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl hover:shadow-md transition-all group border border-slate-200"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        </div>
                        <div className="text-left flex-1">
                          <span className="text-xs sm:text-sm font-semibold block">Services</span>
                          <span className="text-[10px] sm:text-xs text-slate-500">Manage services</span>
                        </div>
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                      </button>

                      <button
                        onClick={() => navigate('/users')}
                        className="w-full flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl hover:shadow-md transition-all group border border-slate-200"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                        </div>
                        <div className="text-left flex-1">
                          <span className="text-xs sm:text-sm font-semibold block">Customers</span>
                          <span className="text-[10px] sm:text-xs text-slate-500">User management</span>
                        </div>
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Performance Card */}
                  <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                        <h3 className="font-semibold text-sm sm:text-base">Performance</h3>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
                            <span className="text-slate-400">Confirmation Rate</span>
                            <span className="font-bold text-emerald-400">{stats.confirmedRate}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2 sm:h-2.5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full transition-all duration-1000"
                              style={{ width: `${stats.confirmedRate}%` }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-slate-700">
                          <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                            <p className="text-lg sm:text-2xl font-bold">{stats.totalBookings}</p>
                            <p className="text-[10px] sm:text-xs text-slate-400">Total Bookings</p>
                          </div>
                          <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                            <p className="text-lg sm:text-2xl font-bold text-amber-400">{stats.pendingBookings}</p>
                            <p className="text-[10px] sm:text-xs text-slate-400">Pending</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm p-3 sm:p-5">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                      <h3 className="font-semibold text-slate-800 text-sm sm:text-base">System Status</h3>
                    </div>
                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-emerald-50 rounded-lg sm:rounded-xl">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs sm:text-sm font-medium text-emerald-700">All systems operational</span>
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
