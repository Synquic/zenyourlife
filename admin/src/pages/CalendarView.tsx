import { useState } from 'react'
import { Calendar, Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import BookingCalendar from '../components/BookingCalendar'

const CalendarView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-60 min-h-screen">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
          <div className="px-4 sm:px-8 py-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-[#DFB13B] to-[#C9A032] items-center justify-center shadow-lg shadow-[#DFB13B]/30">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-slate-800">Booking Calendar</h1>
                <p className="text-xs sm:text-sm text-slate-500">View massage booking availability at a glance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-[#DFB13B]/10 to-[#C9A032]/5 border border-[#DFB13B]/20 rounded-2xl p-4 sm:p-5 mb-6">
            <h3 className="font-semibold text-slate-800 mb-2">How to use the calendar</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500" />
                <span className="text-slate-600">All slots available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500" />
                <span className="text-slate-600">Partially booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-slate-600">Fully booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-400" />
                <span className="text-slate-600">Blocked / Off day</span>
              </div>
            </div>
          </div>

          {/* Calendar Component */}
          <BookingCalendar />
        </div>
      </div>
    </div>
  )
}

export default CalendarView
