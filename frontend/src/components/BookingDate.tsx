import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, AlertCircle, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import BookingForm from "./BookingForm";
import { API_BASE_URL } from "../config/api";
import { getBelgiumNow, generateBelgiumDates } from "../utils/timezone";

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  price: number;
}

interface BlockedDateInfo {
  date: string;
  isFullDayBlocked: boolean;
  blockedTimeSlots: string[];
}

interface DaySchedule {
  isWorking: boolean;
  timeSlots: string[];
}

interface WeeklySchedule {
  sunday: DaySchedule;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
}

interface BookingSettings {
  weeklySchedule: WeeklySchedule;
  timeSlots: string[];
  minAdvanceBooking: number; // hours
}

type DayName = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

interface BookingDateProps {
  onClose?: () => void;
  onSuccess?: () => void;
  selectedService?: Service | null;
}

const BookingDate = ({ onClose: _onClose, onSuccess, selectedService = null }: BookingDateProps) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<number | null>(null); // null means no date selected initially
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [dateLineStart, setDateLineStart] = useState(0); // starting index for visible date line
  const VISIBLE_DATES = 7; // number of dates shown in the horizontal line
  const [showBookingFormModal, setShowBookingFormModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date | null>(null); // tracks which month is displayed
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [blockedDatesInfo, setBlockedDatesInfo] = useState<BlockedDateInfo[]>([]);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [blockedTimeSlotsForDate, setBlockedTimeSlotsForDate] = useState<string[]>([]);

  // Generate dates from today onwards for 30 days with corresponding day names
  // Using Belgium timezone since business is located in Belgium
  const dates = generateBelgiumDates(365);

  const dayNames: DayName[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // Fetch booking settings (weekly schedule) and blocked dates on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/blocked-dates/settings`)
        const data = await response.json();

        if (data.success && data.data) {
          setBookingSettings(data.data);
          console.log('⏰ Fetched booking settings with weekly schedule');
        }
      } catch (error) {
        console.error('Error fetching booking settings:', error);
      }
    };

    const fetchBlockedDates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/blocked-dates/active`)
        const data = await response.json();

        if (data.success) {
          setBlockedDatesInfo(data.data);
          console.log('📅 Fetched blocked dates:', data.data.length);
        }
      } catch (error) {
        console.error('Error fetching blocked dates:', error);
      }
    };

    fetchSettings();
    fetchBlockedDates();
  }, []);

  // Get time slots for a specific day of the week
  const getTimeSlotsForDay = (date: Date): string[] => {
    if (!bookingSettings) return [];
    const dayOfWeek = dayNames[date.getDay()];
    const daySchedule = bookingSettings.weeklySchedule[dayOfWeek];
    return daySchedule?.isWorking ? daySchedule.timeSlots : [];
  };

  // Check if a day is a working day
  const isWorkingDay = (date: Date): boolean => {
    if (!bookingSettings) return true; // Default to working day until settings load
    const dayOfWeek = dayNames[date.getDay()];
    return bookingSettings.weeklySchedule[dayOfWeek]?.isWorking ?? true;
  };

  // Check if a date is completely too soon (all time slots would be blocked)
  // Uses Belgium timezone for accurate time comparison
  const isDateTooSoon = (dateToCheck: Date): boolean => {
    if (!bookingSettings || !bookingSettings.minAdvanceBooking) return false;

    // Use Belgium timezone for current time
    const belgiumNow = getBelgiumNow();
    const minAdvanceMs = bookingSettings.minAdvanceBooking * 60 * 60 * 1000;
    const minAllowedDateTime = new Date(belgiumNow.getTime() + minAdvanceMs);

    // Get the latest possible time slot for this day
    const daySlots = getTimeSlotsForDay(dateToCheck);
    if (daySlots.length === 0) return true;

    // Find the latest time slot
    const latestSlot = daySlots[daySlots.length - 1];
    const [hours, minutes] = latestSlot.split(':').map(Number);

    const latestSlotDateTime = new Date(dateToCheck);
    latestSlotDateTime.setHours(hours, minutes, 0, 0);

    // If even the latest slot is before minimum allowed time, block the whole day
    return latestSlotDateTime < minAllowedDateTime;
  };

  // Check if a specific time slot is too soon based on advance booking
  // Uses Belgium timezone for accurate time comparison
  const isTimeSlotTooSoon = (dateToCheck: Date, timeSlot: string): boolean => {
    if (!bookingSettings || !bookingSettings.minAdvanceBooking) return false;

    // Use Belgium timezone for current time
    const belgiumNow = getBelgiumNow();
    const minAdvanceMs = bookingSettings.minAdvanceBooking * 60 * 60 * 1000;
    const minAllowedDateTime = new Date(belgiumNow.getTime() + minAdvanceMs);

    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotDateTime = new Date(dateToCheck);
    slotDateTime.setHours(hours, minutes, 0, 0);

    return slotDateTime < minAllowedDateTime;
  };

  // Check if a date is fully blocked (whole day blocked OR non-working day OR too soon)
  const isDateFullyBlocked = (dateToCheck: Date) => {
    // First check if it's too soon based on advance booking setting
    if (isDateTooSoon(dateToCheck)) {
      return true;
    }

    // Check if it's a non-working day
    if (!isWorkingDay(dateToCheck)) {
      return true;
    }

    // Then check if it's explicitly blocked
    const checkDate = new Date(dateToCheck);
    checkDate.setHours(0, 0, 0, 0);

    const blockedInfo = blockedDatesInfo.find(info => {
      const bd = new Date(info.date);
      bd.setHours(0, 0, 0, 0);
      return bd.getTime() === checkDate.getTime();
    });

    return blockedInfo?.isFullDayBlocked === true;
  };

  // Get blocked time slots for a specific date (partial day block)
  const getBlockedTimeSlotsForDate = (dateToCheck: Date): string[] => {
    const checkDate = new Date(dateToCheck);
    checkDate.setHours(0, 0, 0, 0);

    const blockedInfo = blockedDatesInfo.find(info => {
      const bd = new Date(info.date);
      bd.setHours(0, 0, 0, 0);
      return bd.getTime() === checkDate.getTime();
    });

    if (blockedInfo && !blockedInfo.isFullDayBlocked) {
      return blockedInfo.blockedTimeSlots || [];
    }
    return [];
  };

  // Find first available (non-fully-blocked) date and auto-select it
  useEffect(() => {
    if (bookingSettings && selectedDate === null) {
      const firstAvailableIndex = dates.findIndex(d => !isDateFullyBlocked(d.fullDate));
      if (firstAvailableIndex !== -1) {
        setSelectedDate(firstAvailableIndex);
        centerDateLine(firstAvailableIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingSettings, blockedDatesInfo]);

  // Update available time slots and blocked time slots when date changes
  useEffect(() => {
    if (selectedDate !== null) {
      const selectedFullDate = dates[selectedDate].fullDate;
      // Get time slots for the day of week
      const daySlots = getTimeSlotsForDay(selectedFullDate);
      setAvailableTimeSlots(daySlots);
      // Get any blocked slots for this specific date
      const blockedSlots = getBlockedTimeSlotsForDate(selectedFullDate);
      setBlockedTimeSlotsForDate(blockedSlots);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, bookingSettings, blockedDatesInfo]);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (selectedDate === null) return;

    const fetchBookedSlots = async () => {
      setLoadingSlots(true);
      try {
        // Use dateStr (YYYY-MM-DD Belgium calendar date) instead of toISOString()
        // This ensures the same date is queried regardless of the user's timezone
        const dateStr = dates[selectedDate].dateStr;

        const response = await fetch(
          `${API_BASE_URL}/appointments/booked-slots?date=${dateStr}`
        );
        const data = await response.json();

        if (data.success) {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('📅 FETCHED BOOKED SLOTS FOR DATE:', dateStr);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('Booked slots array:', data.bookedSlots);
          console.log('Number of booked slots:', data.count);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          setBookedSlots(data.bookedSlots);
        } else {
          console.log('No booked slots or error:', data);
          setBookedSlots([]);
        }
      } catch (error) {
        console.error('Error fetching booked slots:', error);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, refreshKey]);

  // Check if a time slot is booked
  const isSlotBooked = (time: string) => {
    const isBooked = bookedSlots.includes(time);
    return isBooked;
  };

  // Center the date line around a given index
  const centerDateLine = (index: number) => {
    const halfVisible = Math.floor(VISIBLE_DATES / 2);
    const newStart = Math.max(0, Math.min(index - halfVisible, dates.length - VISIBLE_DATES));
    setDateLineStart(newStart);
  };

  // Handle date selection
  const handleDateSelect = (index: number) => {
    const dateItem = dates[index];
    if (isDateFullyBlocked(dateItem.fullDate)) {
      // Don't allow selection of fully blocked dates
      return;
    }
    setSelectedDate(index);
    setSelectedTime(null); // Reset time when date changes
  };

  return (
    <>
      <div className="bg-gray-50 py-3 px-2 sm:px-4 lg:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {t('booking.title')}
            </h1>
          </div>

          {/* Header */}


          {/* Date & Time Selection Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
            {/* Date Section */}
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a017] to-[#8b6914] flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">{selectedDate !== null ? t('booking.selected_date') : t('booking.select_date')}</h2>
                    {selectedDate !== null && (
                      <p className="text-[11px] text-[#b8860b] font-medium">
                        {dates[selectedDate].fullDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const targetDate = selectedDate !== null ? dates[selectedDate].fullDate : dates[0].fullDate;
                    setCalendarMonth(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
                    setShowCalendarModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[#b8860b] bg-[#fdf6e3] hover:bg-[#fcefc7] rounded-lg transition border border-[#e8d5a0]"
                  title={t('booking.view_all_dates')}
                >
                  <Calendar className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('booking.view_all_dates')}</span>
                </button>
              </div>

              {/* Date line */}
              <div className="flex items-stretch gap-1.5">
                {/* Left arrow */}
                <button
                  onClick={() => setDateLineStart(Math.max(0, dateLineStart - VISIBLE_DATES))}
                  disabled={dateLineStart === 0}
                  className={`flex items-center px-0.5 rounded-lg transition shrink-0 ${dateLineStart === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Date cards */}
                <div className="flex-1 grid grid-cols-7 gap-1.5">
                  {dates.slice(dateLineStart, dateLineStart + VISIBLE_DATES).map((item, i) => {
                    const actualIndex = dateLineStart + i;
                    const isBlocked = isDateFullyBlocked(item.fullDate);
                    const isSelected = selectedDate === actualIndex;
                    return (
                      <button
                        key={actualIndex}
                        onClick={() => handleDateSelect(actualIndex)}
                        disabled={isBlocked}
                        className={`flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-xl transition-all relative ${
                          isBlocked
                            ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                            : isSelected
                            ? "bg-gradient-to-b from-[#d4a017] to-[#8b6914] text-white shadow-md ring-2 ring-[#d4a017]/30 ring-offset-1"
                            : "bg-gray-50 text-gray-600 hover:bg-[#fdf6e3] hover:text-[#8b6914]"
                        }`}
                        title={isBlocked ? t('booking.date_unavailable') : ''}
                      >
                        {isBlocked && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-px h-[60%] bg-gray-300/70 rotate-45 absolute"></div>
                          </div>
                        )}
                        <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider ${isBlocked ? 'opacity-25' : isSelected ? 'text-white/70' : 'text-gray-400'}`}>{item.day}</span>
                        <span className={`text-base sm:text-lg font-bold leading-none mt-0.5 ${isBlocked ? 'opacity-25' : ''}`}>{item.date}</span>
                        <span className={`text-[8px] sm:text-[9px] font-medium mt-0.5 ${isBlocked ? 'opacity-25' : isSelected ? 'text-white/60' : 'text-gray-400'}`}>{item.month}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right arrow */}
                <button
                  onClick={() => setDateLineStart(Math.min(dates.length - VISIBLE_DATES, dateLineStart + VISIBLE_DATES))}
                  disabled={dateLineStart >= dates.length - VISIBLE_DATES}
                  className={`flex items-center px-0.5 rounded-lg transition shrink-0 ${dateLineStart >= dates.length - VISIBLE_DATES ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Booking info messages */}
              {bookingSettings?.minAdvanceBooking && bookingSettings.minAdvanceBooking > 0 && (
                <p className="mt-3 text-[11px] text-amber-600 flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {t('booking.advance_booking_required', {
                    duration: bookingSettings.minAdvanceBooking >= 24
                      ? `${Math.floor(bookingSettings.minAdvanceBooking / 24)} ${t('booking.day' + (Math.floor(bookingSettings.minAdvanceBooking / 24) !== 1 ? 's' : ''))}${bookingSettings.minAdvanceBooking % 24 > 0 ? ` ${bookingSettings.minAdvanceBooking % 24} ${t('booking.hours')}` : ''}`
                      : `${bookingSettings.minAdvanceBooking} ${t('booking.hours')}`
                  })}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* Time Section */}
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    {selectedTime !== null ? t('booking.selected_time') : t('booking.select_time')}
                    {loadingSlots && (
                      <span className="ml-2 text-[11px] text-gray-400 font-normal">({t('booking.loading_availability')})</span>
                    )}
                  </h2>
                  {selectedDate !== null && availableTimeSlots.length > 0 && (
                    <p className="text-[11px] text-gray-400">
                      {availableTimeSlots.length - bookedSlots.length - blockedTimeSlotsForDate.length} {t('booking.available')}
                    </p>
                  )}
                </div>
              </div>
              {selectedDate !== null ? (
                <>
                  {availableTimeSlots.length > 0 ? (
                    <>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2">
                        {availableTimeSlots.map((time: string, index: number) => {
                          const isBooked = isSlotBooked(time);
                          const isBlockedByAdmin = blockedTimeSlotsForDate.includes(time);
                          const isTooSoon = selectedDate !== null && isTimeSlotTooSoon(dates[selectedDate].fullDate, time);
                          const isUnavailable = isBooked || isBlockedByAdmin || isTooSoon;
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                if (!isUnavailable && selectedDate !== null) {
                                  setSelectedTime(index);

                                  // Calculate the appointment date
                                  const appointmentDate = dates[selectedDate].fullDate;

                                  // Log selected date and time information
                                  console.log('═══════════════════════════════════════════════════════');
                                  console.log('STEP 2: DATE & TIME SELECTION');
                                  console.log('═══════════════════════════════════════════════════════');
                                  console.log('Selected Date & Time:', {
                                    day: dates[selectedDate].day,
                                    date: dates[selectedDate].date,
                                    fullDate: appointmentDate.toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    }),
                                    time: time,
                                    isoString: appointmentDate.toISOString()
                                  });
                                  console.log('\nAccumulated Information:');
                                  console.log({
                                    service: selectedService?.title,
                                    price: `€${selectedService?.price}`,
                                    duration: `${selectedService?.duration} minutes`,
                                    appointmentDate: appointmentDate.toLocaleDateString(),
                                    appointmentTime: time
                                  });
                                  console.log('═══════════════════════════════════════════════════════\n');

                                  // Auto-proceed to booking form
                                  setShowBookingFormModal(true);
                                }
                              }}
                              disabled={isUnavailable}
                              className={`py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all ${
                                isTooSoon
                                  ? "bg-amber-50 text-amber-300 cursor-not-allowed"
                                  : isBlockedByAdmin
                                  ? "bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                                  : isBooked
                                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                  : selectedTime === index
                                  ? "bg-gradient-to-b from-[#d4a017] to-[#8b6914] text-white shadow-md ring-2 ring-[#d4a017]/30 ring-offset-1"
                                  : "bg-gray-50 text-gray-700 hover:bg-[#fdf6e3] hover:text-[#8b6914]"
                              }`}
                              title={isTooSoon ? t('booking.too_soon') : isBlockedByAdmin ? t('booking.time_blocked') : isBooked ? t('booking.time_booked') : t('booking.available')}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                      {(() => {
                        const tooSoonCount = selectedDate !== null
                          ? availableTimeSlots.filter(time => isTimeSlotTooSoon(dates[selectedDate].fullDate, time)).length
                          : 0;
                        const hasInfo = bookedSlots.length > 0 || blockedTimeSlotsForDate.length > 0 || tooSoonCount > 0;

                        return hasInfo && (
                          <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
                            {tooSoonCount > 0 && (
                              <span className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3" />
                                {t('booking.slots_too_soon', { count: tooSoonCount })}
                              </span>
                            )}
                            {bookedSlots.length > 0 && (
                              <span className="flex items-center gap-1 text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                <AlertCircle className="w-3 h-3" />
                                {t('booking.slots_booked', { count: bookedSlots.length })}
                              </span>
                            )}
                            {blockedTimeSlotsForDate.length > 0 && (
                              <span className="flex items-center gap-1 text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                {t('booking.slots_unavailable', { count: blockedTimeSlotsForDate.length })}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <Calendar className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 font-medium">{t('booking.no_slots_available')}</p>
                      <p className="text-xs text-gray-300 mt-1">{t('booking.select_another_date')}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <Clock className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">{t('booking.select_date_first')}</p>
                </div>
              )}
            </div>
          </div>

                  </div>
      </div>

      {/* BookingForm Modal */}
      {showBookingFormModal && selectedDate !== null && selectedTime !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBookingFormModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-4xl">
            <BookingForm
              onClose={() => setShowBookingFormModal(false)}
              onSuccess={() => {
                setShowBookingFormModal(false);
                // Refresh booked slots after successful booking
                setRefreshKey(prev => prev + 1);
                // Reset selected time
                setSelectedTime(null);
                // Call parent's onSuccess to show approved modal at Booking level
                if (onSuccess) {
                  onSuccess();
                }
              }}
              selectedService={selectedService}
              selectedDate={dates[selectedDate].fullDate}
              selectedDateStr={dates[selectedDate].dateStr}
              selectedTime={availableTimeSlots[selectedTime]}
            />
          </div>
        </div>
      )}

      {/* Calendar Modal - Proper month-based calendar */}
      {showCalendarModal && (() => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const weekDayHeaders = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

        // Determine available date range from the dates array
        const firstAvailableDate = dates[0].fullDate;
        const lastAvailableDate = dates[dates.length - 1].fullDate;

        // Current calendar month (default to first available date's month)
        const viewMonth = calendarMonth || new Date(firstAvailableDate.getFullYear(), firstAvailableDate.getMonth(), 1);
        const viewYear = viewMonth.getFullYear();
        const viewMonthIndex = viewMonth.getMonth();

        // Get first day of month and total days
        const firstDayOfMonth = new Date(viewYear, viewMonthIndex, 1);
        const daysInMonth = new Date(viewYear, viewMonthIndex + 1, 0).getDate();

        // Get day of week for first day (0=Sun, convert to Mon=0)
        let startDayOfWeek = firstDayOfMonth.getDay() - 1;
        if (startDayOfWeek < 0) startDayOfWeek = 6; // Sunday becomes 6

        // Build calendar grid cells
        const calendarCells: Array<{ day: number | null; dateIndex: number | null; fullDate: Date | null }> = [];

        // Empty cells before first day
        for (let i = 0; i < startDayOfWeek; i++) {
          calendarCells.push({ day: null, dateIndex: null, fullDate: null });
        }

        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
          const cellDate = new Date(viewYear, viewMonthIndex, day);
          cellDate.setHours(0, 0, 0, 0);

          // Find matching index in the dates array
          let matchIndex: number | null = null;
          for (let i = 0; i < dates.length; i++) {
            const d = new Date(dates[i].fullDate);
            d.setHours(0, 0, 0, 0);
            if (d.getTime() === cellDate.getTime()) {
              matchIndex = i;
              break;
            }
          }

          calendarCells.push({ day, dateIndex: matchIndex, fullDate: cellDate });
        }

        // Can navigate to previous/next month?
        const prevMonth = new Date(viewYear, viewMonthIndex - 1, 1);
        const nextMonth = new Date(viewYear, viewMonthIndex + 1, 1);
        const canGoPrev = prevMonth.getFullYear() > firstAvailableDate.getFullYear() ||
          (prevMonth.getFullYear() === firstAvailableDate.getFullYear() && prevMonth.getMonth() >= firstAvailableDate.getMonth());
        const canGoNext = nextMonth.getFullYear() < lastAvailableDate.getFullYear() ||
          (nextMonth.getFullYear() === lastAvailableDate.getFullYear() && nextMonth.getMonth() <= lastAvailableDate.getMonth());

        return (
          <div className="fixed inset-0 z-[65] flex items-center justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowCalendarModal(false)}
            ></div>

            {/* Modal Content */}
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl relative z-10">
              {/* Header with month navigation */}
              <div className="border-b border-gray-200 p-4 sm:p-5 rounded-t-2xl sm:rounded-t-3xl">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">{t('booking.select_date')}</h2>
                  <button
                    onClick={() => setShowCalendarModal(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Month navigation */}
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => canGoPrev && setCalendarMonth(prevMonth)}
                    disabled={!canGoPrev}
                    className={`p-2 rounded-full transition ${canGoPrev ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-200 cursor-not-allowed'}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-base font-semibold text-gray-800">
                    {monthNames[viewMonthIndex]} {viewYear}
                  </span>
                  <button
                    onClick={() => canGoNext && setCalendarMonth(nextMonth)}
                    disabled={!canGoNext}
                    className={`p-2 rounded-full transition ${canGoNext ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-200 cursor-not-allowed'}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-4 sm:p-5">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDayHeaders.map((wd) => (
                    <div key={wd} className="text-center text-[11px] font-semibold text-gray-400 py-1">
                      {wd}
                    </div>
                  ))}
                </div>

                {/* Date cells */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((cell, idx) => {
                    if (cell.day === null) {
                      return <div key={`empty-${idx}`} className="aspect-square" />;
                    }

                    const isOutOfRange = cell.dateIndex === null;
                    const isBlocked = !isOutOfRange && isDateFullyBlocked(cell.fullDate!);
                    const isSelected = !isOutOfRange && selectedDate === cell.dateIndex;
                    const isDisabled = isOutOfRange || isBlocked;

                    return (
                      <button
                        key={`day-${cell.day}`}
                        onClick={() => {
                          if (!isDisabled && cell.dateIndex !== null) {
                            handleDateSelect(cell.dateIndex);
                            centerDateLine(cell.dateIndex);
                            setShowCalendarModal(false);
                          }
                        }}
                        disabled={isDisabled}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all relative ${
                          isOutOfRange
                            ? "text-gray-200 cursor-default"
                            : isBlocked
                            ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                            : isSelected
                            ? "bg-gradient-to-br from-[#f8e7b5] via-[#d8a93d] to-[#6b4b09] text-white font-bold shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {isBlocked && !isOutOfRange && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-px h-[60%] bg-gray-300 rotate-45 absolute"></div>
                          </div>
                        )}
                        <span className={isBlocked ? 'opacity-40' : ''}>{cell.day}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                {blockedDatesInfo.length > 0 && (
                  <p className="text-[10px] text-gray-400 mt-3 text-center">
                    {t('booking.blocked_dates_legend')}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
};

export default BookingDate;
