import { useState, useEffect } from 'react'
import { Plus, Trash2, X, Loader2, CalendarOff, CalendarCheck, Menu, AlertCircle, ToggleLeft, ToggleRight, Clock, Save, Clock3, Settings2, CalendarDays, Edit3 } from 'lucide-react'
import Sidebar from '../components/Sidebar'

import { API_BASE_URL } from '../config/api'

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
  const [minAdvanceHours, setMinAdvanceHours] = useState<number>(0)
  const [savingAdvance, setSavingAdvance] = useState(false)

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
        setMinAdvanceHours(data.data.minAdvanceBooking || 0)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  // Save minimum advance booking hours
  const handleSaveAdvanceBooking = async () => {
    setSavingAdvance(true)
    try {
      const response = await fetch(`${API_BASE_URL}/blocked-dates/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minAdvanceBooking: minAdvanceHours })
      })
      const data = await response.json()
      if (data.success) {
        setSettings(prev => prev ? { ...prev, minAdvanceBooking: minAdvanceHours } : prev)
        alert('Advance booking setting saved successfully!')
      } else {
        alert(data.message || 'Failed to save setting')
      }
    } catch (error) {
      console.error('Error saving advance booking:', error)
      alert('Failed to save setting')
    } finally {
      setSavingAdvance(false)
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
        {/* Header - Modern Design */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 relative z-50">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors -ml-2"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-800">Booking Management</h1>
                <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">Configure working hours, time slots & blocked dates</p>
              </div>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all font-medium shadow-sm text-xs sm:text-sm"
            >
              <CalendarOff className="w-4 h-4" />
              <span className="hidden sm:inline">Block Date</span>
            </button>
          </div>

          {/* Stats row - Compact on mobile, full cards on desktop */}
          {/* Mobile: Compact badges */}
          <div className="flex sm:hidden items-center gap-2 mt-3 overflow-x-auto pb-1 -mx-4 px-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-lg shrink-0">
              <span className="text-xs text-slate-500">Days</span>
              <span className="text-sm font-bold text-slate-800">{workingDaysCount}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-lg shrink-0">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              <span className="text-xs text-emerald-700">{settings ? Object.values(settings.weeklySchedule).reduce((acc, day) => acc + (day.isWorking ? day.timeSlots.length : 0), 0) : 0} slots</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 rounded-lg shrink-0">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <span className="text-xs text-red-700">{activeBlocksCount} blocked</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 rounded-lg shrink-0">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span className="text-xs text-purple-700">{partialBlocksCount} partial</span>
            </div>
          </div>

          {/* Desktop: Modern gradient stat cards - Compact */}
          <div className="hidden sm:grid grid-cols-4 gap-3 mt-3">
            {/* Working Days Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 p-3.5 shadow-md">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{workingDaysCount}</p>
                  <p className="text-xs text-white/80">Working Days</p>
                </div>
                <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Time Slots Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 p-3.5 shadow-md">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {settings ? Object.values(settings.weeklySchedule).reduce((acc, day) => acc + (day.isWorking ? day.timeSlots.length : 0), 0) : 0}
                  </p>
                  <p className="text-xs text-white/80">Time Slots</p>
                </div>
                <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Active Blocks Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-400 via-red-500 to-rose-600 p-3.5 shadow-md">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{activeBlocksCount}</p>
                  <p className="text-xs text-white/80">Active Blocks</p>
                </div>
                <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <CalendarOff className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Partial Blocks Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-400 via-purple-500 to-violet-600 p-3.5 shadow-md">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{partialBlocksCount}</p>
                  <p className="text-xs text-white/80">Partial Blocks</p>
                </div>
                <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <Clock3 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-[#DFB13B] animate-spin mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Loading booking settings...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Modern Tabs with Pill Design */}
              <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-2xl mb-6 w-fit">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'schedule'
                      ? 'bg-white text-slate-800 shadow-md'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  <Settings2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Weekly</span> Schedule
                </button>
                <button
                  onClick={() => setActiveTab('blocked')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'blocked'
                      ? 'bg-white text-slate-800 shadow-md'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  <CalendarOff className="w-4 h-4" />
                  <span className="hidden sm:inline">Blocked</span> Dates
                  {activeBlocksCount > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      activeTab === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-slate-200/70 text-slate-500'
                    }`}>
                      {activeBlocksCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'schedule' ? (
                <div className="space-y-6">
                  {/* Advance Booking Settings - Modern Card */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-100">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#DFB13B] to-[#C9A032] rounded-xl flex items-center justify-center shadow-lg shadow-[#DFB13B]/30">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">Advance Booking Settings</h3>
                        <p className="text-xs text-slate-500">Configure how far in advance users can book</p>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Minimum Advance Booking (Hours)
                          </label>
                          <p className="text-xs text-slate-500 mb-3">
                            Users must book at least this many hours before the appointment time.
                            <span className="font-medium"> E.g., 48 hours means users can only book appointments that are at least 2 days away.</span>
                          </p>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min="0"
                              max="720"
                              value={minAdvanceHours}
                              onChange={(e) => setMinAdvanceHours(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-32 px-4 py-2.5 border-2 border-slate-100 rounded-xl text-center text-lg font-semibold focus:outline-none focus:border-[#DFB13B] focus:shadow-lg focus:shadow-[#DFB13B]/10 transition-all"
                            />
                            <span className="text-slate-600 font-medium">hours</span>
                            <span className="text-slate-400 text-sm">
                              ({minAdvanceHours >= 24 ? `${Math.floor(minAdvanceHours / 24)} day${Math.floor(minAdvanceHours / 24) !== 1 ? 's' : ''}${minAdvanceHours % 24 > 0 ? ` ${minAdvanceHours % 24}h` : ''}` : `${minAdvanceHours}h`})
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleSaveAdvanceBooking}
                          disabled={savingAdvance || minAdvanceHours === settings?.minAdvanceBooking}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#DFB13B] to-[#C9A032] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#DFB13B]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                          {savingAdvance ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save Setting
                            </>
                          )}
                        </button>
                      </div>

                      {minAdvanceHours > 0 && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-[#DFB13B]/10 to-[#C9A032]/5 border border-[#DFB13B]/20 rounded-xl">
                          <p className="text-sm text-[#8B7B2A]">
                            <span className="font-semibold">Current setting:</span> Users can only book appointments that are at least <span className="font-bold">{minAdvanceHours} hours</span> ({minAdvanceHours >= 24 ? `${Math.floor(minAdvanceHours / 24)} day${Math.floor(minAdvanceHours / 24) !== 1 ? 's' : ''}` : `${minAdvanceHours} hours`}) from now.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Weekly Schedule Tab - Modern Card */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <CalendarDays className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Weekly Working Schedule</h3>
                      <p className="text-xs text-slate-500">Configure time slots for each day</p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {DAYS.map(({ key, label, short }) => {
                      const daySchedule = settings?.weeklySchedule[key]
                      const isEditing = editingDay === key

                      return (
                        <div key={key} className={`px-3 sm:px-6 py-3 sm:py-4 ${!daySchedule?.isWorking ? 'bg-slate-50/50' : ''}`}>
                          {isEditing ? (
                            /* Editing Mode */
                            <div className="space-y-3 sm:space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <span className="font-semibold text-slate-800 text-sm sm:text-base">{label}</span>
                                  <button
                                    onClick={() => setEditingDayWorking(!editingDayWorking)}
                                    className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                                      editingDayWorking
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-200 text-slate-600'
                                    }`}
                                  >
                                    {editingDayWorking ? (
                                      <>
                                        <ToggleRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="hidden xs:inline">Working</span>
                                      </>
                                    ) : (
                                      <>
                                        <ToggleLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="hidden xs:inline">Day Off</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setEditingDay(null)}
                                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleSaveDaySchedule}
                                    disabled={saving}
                                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#DFB13B] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#C9A032] transition-colors disabled:opacity-50"
                                  >
                                    {saving ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                    Save
                                  </button>
                                </div>
                              </div>

                              {editingDayWorking && (
                                <>
                                  {/* Current time slots */}
                                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {editingDaySlots.length === 0 ? (
                                      <p className="text-xs sm:text-sm text-amber-600">No time slots. Add at least one.</p>
                                    ) : (
                                      editingDaySlots.map((slot) => (
                                        <span
                                          key={slot}
                                          className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs sm:text-sm font-medium"
                                        >
                                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                          {slot}
                                          <button
                                            onClick={() => handleRemoveSlotFromDay(slot)}
                                            className="ml-0.5 sm:ml-1 hover:text-red-500 transition-colors"
                                          >
                                            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
                                      placeholder="e.g., 10:00"
                                      className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DFB13B]/20 focus:border-[#DFB13B]"
                                      onKeyDown={(e) => e.key === 'Enter' && handleAddSlotToDay()}
                                    />
                                    <button
                                      onClick={handleAddSlotToDay}
                                      disabled={!newSlot}
                                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                    >
                                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            /* Display Mode */
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-start gap-2 sm:gap-4 min-w-0 flex-1">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-semibold text-sm sm:text-base shrink-0 ${
                                  daySchedule?.isWorking
                                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}>
                                  <span className="sm:hidden">{short}</span>
                                  <span className="hidden sm:inline">{label.slice(0, 2)}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    <h4 className="font-semibold text-slate-800 text-sm sm:text-base">{label}</h4>
                                    {daySchedule?.isWorking ? (
                                      <span className="px-1.5 sm:px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] sm:text-xs font-medium">
                                        Working
                                      </span>
                                    ) : (
                                      <span className="px-1.5 sm:px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-[10px] sm:text-xs font-medium">
                                        Off
                                      </span>
                                    )}
                                  </div>
                                  {daySchedule?.isWorking && daySchedule.timeSlots.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                                      {daySchedule.timeSlots.map((slot) => (
                                        <span
                                          key={slot}
                                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-slate-100 text-slate-600 rounded text-[10px] sm:text-xs font-medium"
                                        >
                                          {slot}
                                        </span>
                                      ))}
                                    </div>
                                  ) : daySchedule?.isWorking ? (
                                    <p className="text-[10px] sm:text-sm text-amber-600 mt-1">No slots</p>
                                  ) : null}
                                </div>
                              </div>
                              <button
                                onClick={() => handleEditDay(key)}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0"
                              >
                                <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline">Edit</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                </div>
              ) : (
                /* Blocked Dates Tab - Modern Card */
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-rose-50 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                        <CalendarOff className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">Blocked Dates</h3>
                        <p className="text-xs text-slate-500">Dates when bookings not allowed</p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold">
                      {blockedDates.length} blocked
                    </span>
                  </div>

                  {blockedDates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                        <CalendarCheck className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-700 text-lg">No blocked dates</p>
                      <p className="text-sm text-slate-400 mt-1">All dates follow the weekly schedule</p>
                      <button
                        onClick={() => setShowBlockModal(true)}
                        className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all shadow-md"
                      >
                        <CalendarOff className="w-4 h-4" />
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

      {/* Block Date Modal - Modern Design */}
      {showBlockModal && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowBlockModal(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modern Header with Gradient & Pattern */}
            <div className="bg-gradient-to-br from-red-500 via-red-600 to-rose-600 px-6 py-5 text-white overflow-hidden sticky top-0">
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <CalendarOff className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Block Date</h3>
                    <p className="text-white/80 text-sm mt-0.5">Block full day or specific time slots</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-red-500 transition-all text-sm"
                />
              </div>

              {/* Block Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Block Type
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setBlockType('full')
                      setSelectedBlockSlots([])
                    }}
                    className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      blockType === 'full'
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <CalendarOff className="w-4 h-4" />
                    Full Day
                  </button>
                  <button
                    onClick={() => setBlockType('slots')}
                    className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      blockType === 'slots'
                        ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Specific Slots
                  </button>
                </div>
              </div>

              {/* Time Slots Selection */}
              {blockType === 'slots' && selectedDate && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Time Slots to Block
                  </label>
                  {getTimeSlotsForSelectedDate().length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {getTimeSlotsForSelectedDate().map((slot) => (
                        <button
                          key={slot}
                          onClick={() => toggleBlockSlotSelection(slot)}
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            selectedBlockSlots.includes(slot)
                              ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-2 text-amber-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">This is a non-working day. No slots available.</span>
                      </div>
                    </div>
                  )}
                  {selectedBlockSlots.length === 0 && getTimeSlotsForSelectedDate().length > 0 && (
                    <p className="text-xs text-amber-600 mt-2 font-medium">
                      Select at least one time slot to block
                    </p>
                  )}
                </div>
              )}

              {/* Reason Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Reason <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g., Holiday, Personal day, etc."
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-red-500 transition-all text-sm placeholder-slate-400"
                />
              </div>

              {/* Summary Preview */}
              {selectedDate && (
                <div className={`p-4 rounded-xl ${blockType === 'full' ? 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-100' : 'bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100'}`}>
                  <p className={`text-sm font-semibold ${blockType === 'full' ? 'text-red-700' : 'text-purple-700'}`}>
                    Blocking: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
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

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowBlockModal(false)
                    setBlockType('full')
                    setSelectedBlockSlots([])
                    setSelectedDate('')
                    setBlockReason('')
                  }}
                  className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockDate}
                  disabled={!selectedDate || submitting || (blockType === 'slots' && selectedBlockSlots.length === 0)}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all font-semibold flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-sm"
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
