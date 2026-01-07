import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, AlertCircle, Calendar, Clock } from "lucide-react";
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
  const [showBookingFormModal, setShowBookingFormModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [blockedDatesInfo, setBlockedDatesInfo] = useState<BlockedDateInfo[]>([]);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [blockedTimeSlotsForDate, setBlockedTimeSlotsForDate] = useState<string[]>([]);

  // Generate dates from today onwards for 30 days with corresponding day names
  // Using Belgium timezone since business is located in Belgium
  const dates = generateBelgiumDates(30);

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
        const appointmentDate = dates[selectedDate].fullDate;

        const response = await fetch(
          `${API_BASE_URL}/appointments/booked-slots?date=${appointmentDate.toISOString()}`
        );
        const data = await response.json();

        if (data.success) {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('📅 FETCHED BOOKED SLOTS FOR DATE:', appointmentDate.toLocaleDateString());
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


          {/* Date Selection */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">
                {t('booking.select_date')}
              </h2>
              <button
                onClick={() => setShowCalendarModal(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="View all dates"
              >
                <Calendar className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
              <div className="inline-flex gap-2 sm:gap-3 pb-2">
                {dates.slice(0, 10).map((item, index) => {
                  const isBlocked = isDateFullyBlocked(item.fullDate);
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(index)}
                      disabled={isBlocked}
                      className={`flex flex-col items-center justify-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all min-w-[55px] sm:min-w-[70px] shrink-0 relative ${
                        isBlocked
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : selectedDate === index
                          ? "bg-gradient-to-br from-[#f8e7b5] via-[#d8a93d] to-[#6b4b09] text-white border-2 border-gray-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title={isBlocked ? t('booking.date_unavailable') : ''}
                    >
                      {isBlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-px h-[80%] bg-gray-300 rotate-45 absolute"></div>
                        </div>
                      )}
                      <span className={`text-[10px] sm:text-xs font-medium mb-1 ${isBlocked ? 'opacity-50' : ''}`}>{item.day}</span>
                      <span className={`text-base sm:text-lg font-semibold ${isBlocked ? 'opacity-50' : ''}`}>{item.date}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Booking info messages */}
            {bookingSettings?.minAdvanceBooking && bookingSettings.minAdvanceBooking > 0 && (
              <p className="mt-3 text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Bookings require at least {bookingSettings.minAdvanceBooking >= 24
                  ? `${Math.floor(bookingSettings.minAdvanceBooking / 24)} day${Math.floor(bookingSettings.minAdvanceBooking / 24) !== 1 ? 's' : ''}${bookingSettings.minAdvanceBooking % 24 > 0 ? ` ${bookingSettings.minAdvanceBooking % 24} hours` : ''}`
                  : `${bookingSettings.minAdvanceBooking} hours`} advance notice
              </p>
            )}
            {blockedDatesInfo.length > 0 && (
              <p className="mt-2 text-xs text-gray-400">
                {t('booking.some_dates_blocked')}
              </p>
            )}
          </div>

          {/* Time Selection */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              {t('booking.select_time')}
              {loadingSlots && (
                <span className="ml-2 text-xs text-gray-500">({t('booking.loading_availability')})</span>
              )}
            </h2>
            {selectedDate !== null ? (
              <>
                {availableTimeSlots.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
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
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                              isTooSoon
                                ? "bg-amber-50 text-amber-300 cursor-not-allowed"
                                : isBlockedByAdmin
                                ? "bg-gray-100 text-gray-300 cursor-not-allowed line-through"
                                : isBooked
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : selectedTime === index
                                ? "bg-gradient-to-br from-[#f8e7b5] via-[#d8a93d] to-[#6b4b09] text-white border-2 border-gray-800"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            title={isTooSoon ? 'Too soon - advance booking required' : isBlockedByAdmin ? t('booking.time_blocked') : isBooked ? t('booking.time_booked') : t('booking.available')}
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
                        <div className="mt-3 space-y-1">
                          {tooSoonCount > 0 && (
                            <p className="text-xs text-amber-600">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {tooSoonCount} time slot{tooSoonCount > 1 ? 's' : ''} too soon (advance booking required)
                            </p>
                          )}
                          {bookedSlots.length > 0 && (
                            <p className="text-xs text-gray-500">
                              <AlertCircle className="w-3 h-3 inline mr-1" />
                              {bookedSlots.length} time slot{bookedSlots.length > 1 ? 's' : ''} already booked for this date
                            </p>
                          )}
                          {blockedTimeSlotsForDate.length > 0 && (
                            <p className="text-xs text-gray-400">
                              {blockedTimeSlotsForDate.length} time slot{blockedTimeSlotsForDate.length > 1 ? 's' : ''} unavailable
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">{t('booking.no_slots_available')}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('booking.select_another_date')}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">{t('booking.select_date_first')}</p>
            )}
          </div>

                  </div>
      </div>

      {/* BookingForm Modal */}
      {showBookingFormModal && selectedDate !== null && selectedTime !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-50 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Close Button */}
            <button
              onClick={() => setShowBookingFormModal(false)}
              className="absolute top-6 right-6 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition z-50"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* BookingForm Component */}
            <div className="relative pt-4">
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
                selectedTime={availableTimeSlots[selectedTime]}
              />
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal - Show all 30 dates */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCalendarModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl relative z-10 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{t('booking.select_date')}</h2>
                {blockedDatesInfo.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {t('booking.blocked_dates_legend')}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2">
                {dates.map((item, index) => {
                  const isBlocked = isDateFullyBlocked(item.fullDate);
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isBlocked) {
                          handleDateSelect(index);
                          setShowCalendarModal(false);
                        }
                      }}
                      disabled={isBlocked}
                      className={`flex flex-col items-center justify-center py-2 sm:py-3 px-1 sm:px-2 rounded-lg transition-all relative ${
                        isBlocked
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : selectedDate === index
                          ? "bg-gradient-to-br from-[#f8e7b5] via-[#d8a93d] to-[#6b4b09] text-white border-2 border-gray-800 shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md"
                      }`}
                      title={isBlocked ? t('booking.date_unavailable') : ''}
                    >
                      {isBlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-px h-[80%] bg-gray-300 rotate-45 absolute"></div>
                        </div>
                      )}
                      <span className={`text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 ${isBlocked ? 'opacity-50' : ''}`}>{item.day}</span>
                      <span className={`text-sm sm:text-lg font-semibold ${isBlocked ? 'opacity-50' : ''}`}>{item.date}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingDate;
