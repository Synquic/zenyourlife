import { useState, useEffect } from 'react'
import { Calendar, Plus, Trash2, X, Loader2, CalendarOff, CalendarCheck, Menu, AlertCircle, ToggleLeft, ToggleRight, Clock, Save, Clock3, Settings2, CalendarDays, Edit3 } from 'lucide-react'
import Sidebar from '../components/Sidebar'

const API_BASE_URL = 'http://localhost:5000/api'

interface DaySchedule {
  isWorking: boolean
  timeSlots: string[]
}

interface WeeklySchedule {
  sunday: DaySchedule
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
}

interface BookingSettings {
  _id: string
  timeSlots: string[]
  weeklySchedule: WeeklySchedule
  minAdvanceBooking: number
  maxAdvanceBooking: number
  isBookingEnabled: boolean
}

interface BlockedDate {
  _id: string
  date: string
  reason: string
  isActive: boolean
  isFullDayBlocked: boolean
  blockedTimeSlots: string[]
  createdAt: string
}

type DayName = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

const DAYS: { key: DayName; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' }
]

const BookingManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'schedule' | 'blocked'>('schedule')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Settings state
  const [settings, setSettings] = useState<BookingSettings | null>(null)
  const [editingDay, setEditingDay] = useState<DayName | null>(null)
  const [editingDaySlots, setEditingDaySlots] = useState<string[]>([])
  const [editingDayWorking, setEditingDayWorking] = useState(true)
  const [newSlot, setNewSlot] = useState('')

  // Blocked dates state
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [blockReason, setBlockReason] = useState('')
  const [blockType, setBlockType] = useState<'full' | 'slots'>('full')
  const [selectedBlockSlots, setSelectedBlockSlots] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocked-dates/settings`)
      const data = await response.json()
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  // Fetch blocked dates
  const fetchBlockedDates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocked-dates`)
      const data = await response.json()
      if (data.success) {
        setBlockedDates(data.data)
      }
    } catch (error) {
      console.error('Error fetching blocked dates:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchSettings(), fetchBlockedDates()])
      setLoading(false)
    }
    loadData()
  }, [])

  // Handle editing a day's schedule
  const handleEditDay = (day: DayName) => {
    if (!settings) return
    setEditingDay(day)
    setEditingDaySlots([...settings.weeklySchedule[day].timeSlots])
    setEditingDayWorking(settings.weeklySchedule[day].isWorking)
  }

  // Save day schedule
  const handleSaveDaySchedule = async () => {
    if (!editingDay || !settings) return

    setSaving(true)
    try {
      const response = await fetch(`${API_BASE_URL}/blocked-dates/settings/day/${editingDay}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isWorking: editingDayWorking,
          timeSlots: editingDaySlots
        })
      })
      const data = await response.json()

      if (data.success) {
        // Update local state
        setSettings(prev => {
          if (!prev) return prev
          return {
            ...prev,
            weeklySchedule: {
              ...prev.weeklySchedule,
              [editingDay]: {
                isWorking: editingDayWorking,
                timeSlots: editingDaySlots
              }
            }
          }
        })
        setEditingDay(null)
      } else {
        alert(data.message || 'Failed to save schedule')
      }
    } catch (error) {
      console.error('Error saving day schedule:', error)
      alert('Failed to save schedule')
    } finally {
      setSaving(false)
    }
  }

  // Add time slot to editing day
  const handleAddSlotToDay = () => {
    if (newSlot && !editingDaySlots.includes(newSlot)) {
      // Sort slots by time
      const allSlots = [...editingDaySlots, newSlot].sort((a, b) => {
        const timeToMinutes = (t: string) => {
          const [h, m] = t.split(':').map(Number)
          return (h < 7 ? h + 12 : h) * 60 + m
        }
        return timeToMinutes(a) - timeToMinutes(b)
      })
      setEditingDaySlots(allSlots)
      setNewSlot('')
    }
  }

  // Remove time slot from editing day
  const handleRemoveSlotFromDay = (slot: string) => {
    setEditingDaySlots(editingDaySlots.filter(s => s !== slot))
  }

  // Block date handlers
  const handleBlockDate = async () => {
    if (!selectedDate) return

    setSubmitting(true)
    try {
      const payload: { date: string; reason: string; blockedTimeSlots?: string[] } = {
        date: selectedDate,
        reason: blockReason
      }

      if (blockType === 'slots' && selectedBlockSlots.length > 0) {
        payload.blockedTimeSlots = selectedBlockSlots
      }

      const response = await fetch(`${API_BASE_URL}/blocked-dates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()

      if (data.success) {
        await fetchBlockedDates()
        setShowBlockModal(false)
        setSelectedDate('')
        setBlockReason('')
        setBlockType('full')
        setSelectedBlockSlots([])
      } else {
        alert(data.message || 'Failed to block date')
      }
    } catch (error) {
      console.error('Error blocking date:', error)
      alert('Failed to block date')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleBlock = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocked-dates/${id}/toggle`, {
        method: 'PUT'
      })
      const data = await response.json()

      if (data.success) {
        setBlockedDates(prev =>
          prev.map(bd => bd._id === id ? { ...bd, isActive: !bd.isActive } : bd)
        )
      }
    } catch (error) {
      console.error('Error toggling blocked date:', error)
    }
  }

  const handleDeleteBlock = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocked-dates/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        setBlockedDates(prev => prev.filter(bd => bd._id !== id))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Error deleting blocked date:', error)
    }
  }

  const handleRemoveBlockedSlot = async (id: string, slot: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocked-dates/${id}/slot/${encodeURIComponent(slot)}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        await fetchBlockedDates()
      }
    } catch (error) {
      console.error('Error removing time slot:', error)
    }
  }

  const toggleBlockSlotSelection = (slot: string) => {
    if (selectedBlockSlots.includes(slot)) {
      setSelectedBlockSlots(selectedBlockSlots.filter(s => s !== slot))
    } else {
      setSelectedBlockSlots([...selectedBlockSlots, slot])
    }
  }

  // Get time slots for selected date based on day of week
  const getTimeSlotsForSelectedDate = () => {
    if (!selectedDate || !settings) return []
    const date = new Date(selectedDate + 'T00:00:00')
    const dayIndex = date.getDay()
    const dayNames: DayName[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayName = dayNames[dayIndex]
    return settings.weeklySchedule[dayName].timeSlots
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Stats
  const workingDaysCount = settings ? Object.values(settings.weeklySchedule).filter(d => d.isWorking).length : 0
  const activeBlocksCount = blockedDates.filter(bd => bd.isActive).length
  const partialBlocksCount = blockedDates.filter(bd => !bd.isFullDayBlocked && bd.blockedTimeSlots.length > 0).length

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
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Booking Management</h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Configure working hours, time slots & blocked dates</p>
              </div>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/20 transition-all text-sm font-medium"
            >
              <CalendarOff className="w-4 h-4" />
              <span className="hidden sm:inline">Block Date</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-[#0D9488] animate-spin mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Loading booking settings...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm group hover:shadow-md hover:border-emerald-200 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Working Days</p>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-800">{workingDaysCount}</p>
                      <p className="text-xs text-slate-400 mt-2">Per week</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm group hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Total Time Slots</p>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                        {settings ? Object.values(settings.weeklySchedule).reduce((acc, day) => acc + (day.isWorking ? day.timeSlots.length : 0), 0) : 0}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">Across all days</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm group hover:shadow-md hover:border-red-200 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Active Blocks</p>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-800">{activeBlocksCount}</p>
                      <p className="text-xs text-slate-400 mt-2">Dates blocked</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CalendarOff className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm group hover:shadow-md hover:border-purple-200 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Partial Blocks</p>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-800">{partialBlocksCount}</p>
                      <p className="text-xs text-slate-400 mt-2">Specific slots</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'schedule'
                      ? 'bg-[#0D9488] text-white shadow-lg shadow-[#0D9488]/20'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <Settings2 className="w-4 h-4" />
                  Weekly Schedule
                </button>
                <button
                  onClick={() => setActiveTab('blocked')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'blocked'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <CalendarOff className="w-4 h-4" />
                  Blocked Dates
                  {activeBlocksCount > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                      activeTab === 'blocked' ? 'bg-white/20' : 'bg-red-100 text-red-600'
                    }`}>
                      {activeBlocksCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'schedule' ? (
                /* Weekly Schedule Tab */
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-700">Weekly Working Schedule</h3>
                        <p className="text-sm text-slate-500 mt-0.5">Configure time slots for each day of the week</p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {DAYS.map(({ key, label }) => {
                      const daySchedule = settings?.weeklySchedule[key]
                      const isEditing = editingDay === key

                      return (
                        <div key={key} className={`px-4 sm:px-6 py-4 ${!daySchedule?.isWorking ? 'bg-slate-50/50' : ''}`}>
                          {isEditing ? (
                            /* Editing Mode */
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-slate-800">{label}</span>
                                  <button
                                    onClick={() => setEditingDayWorking(!editingDayWorking)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                      editingDayWorking
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-200 text-slate-600'
                                    }`}
                                  >
                                    {editingDayWorking ? (
                                      <>
                                        <ToggleRight className="w-4 h-4" />
                                        Working Day
                                      </>
                                    ) : (
                                      <>
                                        <ToggleLeft className="w-4 h-4" />
                                        Day Off
                                      </>
                                    )}
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setEditingDay(null)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleSaveDaySchedule}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-[#0D9488] text-white rounded-lg text-sm font-medium hover:bg-[#0F766E] transition-colors disabled:opacity-50"
                                  >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save
                                  </button>
                                </div>
                              </div>

                              {editingDayWorking && (
                                <>
                                  {/* Current time slots */}
                                  <div className="flex flex-wrap gap-2">
                                    {editingDaySlots.length === 0 ? (
                                      <p className="text-sm text-amber-600">No time slots. Add at least one.</p>
                                    ) : (
                                      editingDaySlots.map((slot) => (
                                        <span
                                          key={slot}
                                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium"
                                        >
                                          <Clock className="w-3.5 h-3.5" />
                                          {slot}
                                          <button
                                            onClick={() => handleRemoveSlotFromDay(slot)}
                                            className="ml-1 hover:text-red-500 transition-colors"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                          </button>
                                        </span>
                                      ))
                                    )}
                                  </div>

                                  {/* Add new slot */}
                                  <div className="flex gap-2 max-w-xs">
                                    <input
                                      type="text"
                                      value={newSlot}
                                      onChange={(e) => setNewSlot(e.target.value)}
                                      placeholder="e.g., 10:00 or 2:30"
                                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488]"
                                      onKeyDown={(e) => e.key === 'Enter' && handleAddSlotToDay()}
                                    />
                                    <button
                                      onClick={handleAddSlotToDay}
                                      disabled={!newSlot}
                                      className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            /* Display Mode */
                            <div className="flex items-center justify-between">
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold ${
                                  daySchedule?.isWorking
                                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}>
                                  {label.slice(0, 2)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-slate-800">{label}</h4>
                                    {daySchedule?.isWorking ? (
                                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                        Working
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-xs font-medium">
                                        Day Off
                                      </span>
                                    )}
                                  </div>
                                  {daySchedule?.isWorking && daySchedule.timeSlots.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {daySchedule.timeSlots.map((slot) => (
                                        <span
                                          key={slot}
                                          className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium"
                                        >
                                          {slot}
                                        </span>
                                      ))}
                                    </div>
                                  ) : daySchedule?.isWorking ? (
                                    <p className="text-sm text-amber-600 mt-1">No time slots configured</p>
                                  ) : null}
                                </div>
                              </div>
                              <button
                                onClick={() => handleEditDay(key)}
                                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                /* Blocked Dates Tab */
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-700">Blocked Dates</h3>
                        <p className="text-sm text-slate-500 mt-0.5">Dates when bookings are not allowed</p>
                      </div>
                      <span className="text-sm text-slate-500">
                        {blockedDates.length} date{blockedDates.length !== 1 ? 's' : ''} blocked
                      </span>
                    </div>
                  </div>

                  {blockedDates.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CalendarCheck className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-1">No blocked dates</h3>
                      <p className="text-slate-500 text-sm">
                        All dates follow the weekly schedule
                      </p>
                      <button
                        onClick={() => setShowBlockModal(true)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        Block a Date
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {blockedDates.map((blockedDate) => {
                        const date = new Date(blockedDate.date)
                        const isPast = date < today

                        return (
                          <div
                            key={blockedDate._id}
                            className={`px-4 sm:px-6 py-4 hover:bg-slate-50/50 transition-colors ${
                              !blockedDate.isActive ? 'opacity-60' : ''
                            } ${isPast ? 'bg-slate-50/30' : ''}`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                              <div className="flex items-start gap-3 sm:gap-4">
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex flex-col items-center justify-center text-white font-semibold shadow-sm shrink-0 ${
                                  !blockedDate.isActive
                                    ? 'bg-slate-400'
                                    : isPast
                                    ? 'bg-slate-500'
                                    : blockedDate.isFullDayBlocked
                                    ? 'bg-gradient-to-br from-red-500 to-red-600'
                                    : 'bg-gradient-to-br from-purple-500 to-purple-600'
                                }`}>
                                  <span className="text-[10px] uppercase tracking-wide opacity-90">
                                    {new Date(blockedDate.date).toLocaleDateString('en-US', { month: 'short' })}
                                  </span>
                                  <span className="text-lg sm:text-xl font-bold -mt-0.5">
                                    {new Date(blockedDate.date).getDate()}
                                  </span>
                                </div>

                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="font-semibold text-slate-800 text-sm sm:text-base">
                                      {formatDate(blockedDate.date)}
                                    </h4>
                                    {blockedDate.isFullDayBlocked ? (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">
                                        Full Day
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700">
                                        {blockedDate.blockedTimeSlots.length} Slot{blockedDate.blockedTimeSlots.length !== 1 ? 's' : ''}
                                      </span>
                                    )}
                                    {isPast && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                                        Past
                                      </span>
                                    )}
                                    {!blockedDate.isActive && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
                                        Unblocked
                                      </span>
                                    )}
                                  </div>
                                  {blockedDate.reason && (
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                      Reason: {blockedDate.reason}
                                    </p>
                                  )}

                                  {!blockedDate.isFullDayBlocked && blockedDate.blockedTimeSlots.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {blockedDate.blockedTimeSlots.map((slot) => (
                                        <span
                                          key={slot}
                                          className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium"
                                        >
                                          <Clock className="w-3 h-3" />
                                          {slot}
                                          <button
                                            onClick={() => handleRemoveBlockedSlot(blockedDate._id, slot)}
                                            className="ml-1 hover:text-red-500 transition-colors"
                                            title="Remove this slot"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  <p className="text-xs text-slate-400 mt-2">
                                    Added {formatShortDate(blockedDate.createdAt)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 ml-16 sm:ml-0 shrink-0">
                                <button
                                  onClick={() => handleToggleBlock(blockedDate._id)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    blockedDate.isActive
                                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  }`}
                                  title={blockedDate.isActive ? 'Unblock this date' : 'Block this date'}
                                >
                                  {blockedDate.isActive ? (
                                    <>
                                      <ToggleRight className="w-4 h-4" />
                                      <span className="hidden sm:inline">Blocked</span>
                                    </>
                                  ) : (
                                    <>
                                      <ToggleLeft className="w-4 h-4" />
                                      <span className="hidden sm:inline">Unblocked</span>
                                    </>
                                  )}
                                </button>

                                {deleteConfirm === blockedDate._id ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleDeleteBlock(blockedDate._id)}
                                      className="px-2 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirm(null)}
                                      className="px-2 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-300 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirm(blockedDate._id)}
                                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Block Date Modal */}
      {showBlockModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowBlockModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 text-white relative sticky top-0">
              <button
                onClick={() => setShowBlockModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <CalendarOff className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Block Date</h3>
                  <p className="text-white/80 text-sm">Block full day or specific time slots</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    setSelectedBlockSlots([])
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Block Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setBlockType('full')
                      setSelectedBlockSlots([])
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      blockType === 'full'
                        ? 'bg-red-100 text-red-700 border-2 border-red-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent'
                    }`}
                  >
                    <CalendarOff className="w-4 h-4" />
                    Full Day
                  </button>
                  <button
                    onClick={() => setBlockType('slots')}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      blockType === 'slots'
                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Specific Slots
                  </button>
                </div>
              </div>

              {blockType === 'slots' && selectedDate && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Time Slots to Block
                  </label>
                  {getTimeSlotsForSelectedDate().length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {getTimeSlotsForSelectedDate().map((slot) => (
                        <button
                          key={slot}
                          onClick={() => toggleBlockSlotSelection(slot)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedBlockSlots.includes(slot)
                              ? 'bg-purple-500 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-xl">
                      <div className="flex items-center gap-2 text-amber-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">This is a non-working day. No slots available.</span>
                      </div>
                    </div>
                  )}
                  {selectedBlockSlots.length === 0 && getTimeSlotsForSelectedDate().length > 0 && (
                    <p className="text-xs text-amber-600 mt-2">
                      Select at least one time slot to block
                    </p>
                  )}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g., Holiday, Personal day, etc."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>

              {selectedDate && (
                <div className={`mb-6 p-4 rounded-xl border ${blockType === 'full' ? 'bg-red-50 border-red-100' : 'bg-purple-50 border-purple-100'}`}>
                  <p className={`text-sm ${blockType === 'full' ? 'text-red-700' : 'text-purple-700'}`}>
                    <span className="font-medium">Blocking:</span>{' '}
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className={`text-xs mt-1 ${blockType === 'full' ? 'text-red-600' : 'text-purple-600'}`}>
                    {blockType === 'full'
                      ? 'Users will not be able to book any appointments on this date.'
                      : selectedBlockSlots.length > 0
                      ? `Blocking ${selectedBlockSlots.length} time slot${selectedBlockSlots.length !== 1 ? 's' : ''}: ${selectedBlockSlots.join(', ')}`
                      : 'Select time slots to block'
                    }
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBlockModal(false)
                    setBlockType('full')
                    setSelectedBlockSlots([])
                    setSelectedDate('')
                    setBlockReason('')
                  }}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockDate}
                  disabled={!selectedDate || submitting || (blockType === 'slots' && selectedBlockSlots.length === 0)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Blocking...
                    </>
                  ) : (
                    <>
                      <CalendarOff className="w-4 h-4" />
                      Block {blockType === 'full' ? 'Full Day' : 'Slots'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingManagement
