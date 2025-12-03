import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, CalendarCheck, MessageSquare, Building2, Sparkles, Users, Settings, LogOut, Quote, ChevronRight, Flower2, X, Settings2 } from 'lucide-react'
import znlogo from '../assets/znlogo.png'

interface MenuItem {
  name: string
  icon: React.ReactNode
  path: string
  badge?: number
}

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
    { name: 'Rental Bookings', icon: <CalendarCheck className="w-5 h-5" />, path: '/bookings' },
    { name: 'Massage Appointments', icon: <Flower2 className="w-5 h-5" />, path: '/massage-appointments' },
    { name: 'Booking Management', icon: <Settings2 className="w-5 h-5" />, path: '/booking-management' },
    { name: 'Inquiries', icon: <MessageSquare className="w-5 h-5" />, path: '/inquiries' },
    { name: 'Properties', icon: <Building2 className="w-5 h-5" />, path: '/properties' },
    { name: 'Services', icon: <Sparkles className="w-5 h-5" />, path: '/services' },
    { name: 'Testimonials', icon: <Quote className="w-5 h-5" />, path: '/testimonials' },
    { name: 'Users', icon: <Users className="w-5 h-5" />, path: '/users' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn')
    localStorage.removeItem('adminEmail')
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  const handleNavigation = (path: string) => {
    navigate(path)
    if (onClose) onClose()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 h-screen bg-white flex flex-col border-r border-slate-200/80 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <img src={znlogo} alt="ZenYourLife" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  ZenYourLife
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Admin Portal</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (onClose) onClose()
              }}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

      {/* Menu Label */}
      <div className="px-6 py-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Main Menu</span>
      </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`transition-transform duration-200 ${isActive(item.path) ? '' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isActive(item.path)
                        ? 'bg-white/20 text-white'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive(item.path) && (
                    <ChevronRight className="w-4 h-4 text-white/70" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-3 mt-auto">
          {/* Settings */}
          <button
            onClick={() => handleNavigation('/settings')}
            className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 mb-2 ${
              isActive('/settings')
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="flex-1 text-left">Settings</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-violet-500/20">
                A
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-slate-700 truncate">Admin User</p>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">admin@zenyourlife.com</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 mt-3 rounded-xl text-xs sm:text-sm font-medium text-red-500 hover:bg-red-50 border border-red-100 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
