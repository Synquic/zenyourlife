import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Calendar, X } from 'lucide-react';
import RBookingForm from './RBookingForm';
import { getBelgiumNow } from '../../utils/timezone';

interface PropertyData {
  _id: string;
  name: string;
  description: string;
  price: number;
  guests: number;
  bedrooms: number;
  parking: string;
  image: string;
}

interface RBookingDateProps {
  onClose?: () => void;
  propertyData?: PropertyData;
}

const RBookingDate: React.FC<RBookingDateProps> = ({ onClose, propertyData }) => {
  // Use Belgium timezone for today's date since business is in Belgium
  const today = getBelgiumNow();
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [selectingFor, setSelectingFor] = useState<'checkIn' | 'checkOut'>('checkIn');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const checkInTime = '10:30 AM';
  const checkOutTime = '10:00 AM';

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleCalendarDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (selectingFor === 'checkIn') {
      setCheckInDate(newDate);
      // If checkout date is before new checkin, reset it
      if (checkOutDate && newDate >= checkOutDate) {
        setCheckOutDate(null);
      }
      setSelectingFor('checkOut');
    } else {
      // Check-out must be after check-in
      if (checkInDate && newDate > checkInDate) {
        setCheckOutDate(newDate);
        setShowCalendar(false);
      }
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isCheckInDate = (day: number) => {
    if (!checkInDate) return false;
    return checkInDate.getDate() === day &&
           checkInDate.getMonth() === currentMonth.getMonth() &&
           checkInDate.getFullYear() === currentMonth.getFullYear();
  };

  const isCheckOutDate = (day: number) => {
    if (!checkOutDate) return false;
    return checkOutDate.getDate() === day &&
           checkOutDate.getMonth() === currentMonth.getMonth() &&
           checkOutDate.getFullYear() === currentMonth.getFullYear();
  };

  const isInRange = (day: number) => {
    if (!checkInDate || !checkOutDate) return false;
    const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return currentDate > checkInDate && currentDate < checkOutDate;
  };

  const isToday = (day: number) => {
    return today.getDate() === day &&
           today.getMonth() === currentMonth.getMonth() &&
           today.getFullYear() === currentMonth.getFullYear();
  };

  const isPastDate = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return checkDate < todayStart;
  };

  const isBeforeCheckIn = (day: number) => {
    if (!checkInDate || selectingFor !== 'checkOut') return false;
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return checkDate <= checkInDate;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select Date';
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    return `${dayName}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleNext = () => {
    if (!checkInDate || !checkOutDate) {
      return;
    }
    setShowForm(true);
  };

  const openCalendarFor = (type: 'checkIn' | 'checkOut') => {
    setSelectingFor(type);
    if (type === 'checkIn' && checkInDate) {
      setCurrentMonth(new Date(checkInDate.getFullYear(), checkInDate.getMonth(), 1));
    } else if (type === 'checkOut' && checkOutDate) {
      setCurrentMonth(new Date(checkOutDate.getFullYear(), checkOutDate.getMonth(), 1));
    }
    setShowCalendar(true);
  };

  // If form is shown, render RBookingForm instead
  if (showForm) {
    return (
      <RBookingForm
        onClose={onClose}
        propertyData={propertyData}
        dateInfo={{
          checkInDate: checkInDate!.toISOString(),
          checkOutDate: checkOutDate!.toISOString(),
          checkInDateFormatted: formatDate(checkInDate),
          checkOutDateFormatted: formatDate(checkOutDate),
          nights: calculateNights(),
          checkInTime,
          checkOutTime
        }}
      />
    );
  }

  return (
    <div className="bg-white w-full relative">
      {/* Header */}
      <div className="px-3 sm:px-6 py-3 sm:py-5 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">Select Your Dates</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="sm:hidden text-gray-400 hover:text-gray-600 text-xl font-light"
          >
            ×
          </button>
        )}
      </div>

      {/* Date Selection */}
      <div className="px-3 sm:px-6 py-4 sm:py-6">
        {/* Section Heading */}
        <div className="mb-4 sm:mb-5">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">When would you like to stay?</h3>
          <p className="text-xs sm:text-sm text-gray-500">Select your check-in and check-out dates to continue</p>
        </div>

        {/* Check-in and Check-out Date Selection */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Check-in Date */}
          <div
            onClick={() => openCalendarFor('checkIn')}
            className={`cursor-pointer rounded-xl border-2 p-3 sm:p-4 transition-all ${
              selectingFor === 'checkIn' && showCalendar
                ? 'border-blue-500 bg-blue-50'
                : checkInDate
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide font-medium">Check-in Date</p>
            </div>
            <p className={`text-sm sm:text-base font-semibold ${checkInDate ? 'text-gray-900' : 'text-gray-400'}`}>
              {checkInDate ? formatDate(checkInDate) : 'Select Date'}
            </p>
          </div>

          {/* Check-out Date */}
          <div
            onClick={() => checkInDate && openCalendarFor('checkOut')}
            className={`cursor-pointer rounded-xl border-2 p-3 sm:p-4 transition-all ${
              !checkInDate
                ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                : selectingFor === 'checkOut' && showCalendar
                  ? 'border-blue-500 bg-blue-50'
                  : checkOutDate
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide font-medium">Check-out Date</p>
            </div>
            <p className={`text-sm sm:text-base font-semibold ${checkOutDate ? 'text-gray-900' : 'text-gray-400'}`}>
              {checkOutDate ? formatDate(checkOutDate) : checkInDate ? 'Select Date' : 'Select check-in first'}
            </p>
          </div>
        </div>

        {/* Nights Summary */}
        {checkInDate && checkOutDate && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-green-700 font-medium">Your Stay</p>
                <p className="text-lg sm:text-xl font-bold text-green-800">{calculateNights()} Night{calculateNights() > 1 ? 's' : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm text-green-700">Total Price</p>
                <p className="text-lg sm:text-xl font-bold text-green-800">€{(propertyData?.price || 0) * calculateNights()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Check In & Check Out Times Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-blue-800">Property Check-in & Check-out Times</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {/* Check In Time */}
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-blue-100">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide mb-1">Check In Time</p>
              <p className="text-base sm:text-xl font-semibold text-gray-900">{checkInTime}</p>
            </div>

            {/* Check Out Time */}
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-blue-100">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide mb-1">Check Out Time</p>
              <p className="text-base sm:text-xl font-semibold text-gray-900">{checkOutTime}</p>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={handleNext}
            disabled={!checkInDate || !checkOutDate}
            className={`px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all flex items-center gap-2 ${
              checkInDate && checkOutDate
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Popup */}
      {showCalendar && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-[320px] sm:max-w-[350px] shadow-xl">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <div className="text-center">
                <p className="text-xs text-blue-600 font-medium mb-1">
                  {selectingFor === 'checkIn' ? 'Select Check-in Date' : 'Select Check-out Date'}
                </p>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ml-1 sm:ml-2"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-[10px] sm:text-xs font-medium text-gray-500 py-1.5 sm:py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {calendarDays.map((day, index) => {
                const isDisabled = day === null || isPastDate(day) || isBeforeCheckIn(day);
                const isStart = day !== null && isCheckInDate(day);
                const isEnd = day !== null && isCheckOutDate(day);
                const inRange = day !== null && isInRange(day);
                const isTodayDate = day !== null && isToday(day);

                return (
                  <div key={index} className="aspect-square">
                    {day !== null ? (
                      <button
                        onClick={() => !isDisabled && handleCalendarDateSelect(day)}
                        disabled={isDisabled}
                        className={`
                          w-full h-full flex items-center justify-center rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all
                          ${isStart
                            ? 'bg-blue-500 text-white'
                            : isEnd
                              ? 'bg-green-500 text-white'
                              : inRange
                                ? 'bg-blue-100 text-blue-700'
                                : isTodayDate
                                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                  : isDisabled
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        {day}
                      </button>
                    ) : (
                      <div className="w-full h-full"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-gray-600">Check-in</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-gray-600">Check-out</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RBookingDate;
