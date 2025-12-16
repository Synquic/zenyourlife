import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Calendar, X } from 'lucide-react';
import RBookingForm from './RBookingForm';

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
  const today = new Date();
  const [selectedFullDate, setSelectedFullDate] = useState<Date>(today);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const checkInTime = '10:30 AM';
  const checkOutTime = '10:00 PM';

  // Generate week days for quick selection (current week)
  const generateWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push({
        day: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][i],
        date: date.getDate(),
        fullDate: new Date(date)
      });
    }
    return days;
  };

  const weekDays = generateWeekDays();

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
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleQuickDateSelect = (fullDate: Date) => {
    setSelectedFullDate(fullDate);
  };

  const handleCalendarDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedFullDate(newDate);
    setShowCalendar(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDateSelected = (day: number) => {
    return selectedFullDate.getDate() === day &&
           selectedFullDate.getMonth() === currentMonth.getMonth() &&
           selectedFullDate.getFullYear() === currentMonth.getFullYear();
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

  const isQuickDateSelected = (fullDate: Date) => {
    return selectedFullDate.getDate() === fullDate.getDate() &&
           selectedFullDate.getMonth() === fullDate.getMonth() &&
           selectedFullDate.getFullYear() === fullDate.getFullYear();
  };

  const getSelectedDayName = () => {
    return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][selectedFullDate.getDay()];
  };

  const handleNext = () => {
    console.log('Selected date:', selectedFullDate);
    console.log('Day name:', getSelectedDayName());
    console.log('Check-in time:', checkInTime);
    console.log('Check-out time:', checkOutTime);
    setShowForm(true);
  };

  // If form is shown, render RBookingForm instead
  if (showForm) {
    return (
      <RBookingForm
        onClose={onClose}
        propertyData={propertyData}
        dateInfo={{
          fullDate: selectedFullDate.toISOString(),
          date: selectedFullDate.getDate(),
          month: selectedFullDate.getMonth(),
          year: selectedFullDate.getFullYear(),
          day: getSelectedDayName(),
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
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">Check Availability</h2>
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
        {/* Week Days with Calendar Icon */}
        <div className="flex gap-1.5 sm:gap-3 mb-4 sm:mb-6 items-center">
          {weekDays.map((item) => (
            <button
              key={item.fullDate.toISOString()}
              onClick={() => handleQuickDateSelect(item.fullDate)}
              className={`
                flex-1 flex flex-col items-center justify-center py-2 sm:py-3 px-1 sm:px-2 rounded-lg sm:rounded-xl border-2 transition-all
                ${isQuickDateSelected(item.fullDate)
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }
              `}
            >
              <span className={`text-[8px] sm:text-xs font-medium mb-0.5 sm:mb-1 ${isQuickDateSelected(item.fullDate) ? 'text-white' : 'text-gray-400'}`}>
                {item.day}
              </span>
              <span className="text-sm sm:text-xl font-semibold">
                {item.date}
              </span>
            </button>
          ))}

          {/* Calendar Icon Button */}
          <button
            onClick={() => setShowCalendar(true)}
            className="flex-shrink-0 flex flex-col items-center justify-center py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all"
          >
            <Calendar className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Selected Date Display */}
        <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Selected Date</p>
          <p className="text-sm sm:text-lg font-semibold text-blue-600">
            {getSelectedDayName()}, {monthNames[selectedFullDate.getMonth()]} {selectedFullDate.getDate()}, {selectedFullDate.getFullYear()}
          </p>
        </div>

        {/* Check In & Check Out Times */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
          {/* Check In Time */}
          <div>
            <label className="block text-xs sm:text-base font-medium text-gray-700 mb-1.5 sm:mb-3">
              Check In Time
            </label>
            <input
              type="text"
              value={checkInTime}
              readOnly
              className="w-full px-3 sm:px-5 py-3 sm:py-5 border border-gray-300 rounded-lg bg-gray-50 text-base sm:text-xl font-semibold cursor-default"
            />
          </div>

          {/* Check Out Time */}
          <div>
            <label className="block text-xs sm:text-base font-medium text-gray-700 mb-1.5 sm:mb-3">
              Check Out Time
            </label>
            <input
              type="text"
              value={checkOutTime}
              readOnly
              className="w-full px-3 sm:px-5 py-3 sm:py-5 border border-gray-300 rounded-lg bg-gray-50 text-base sm:text-xl font-semibold cursor-default"
            />
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all flex items-center gap-2"
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
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
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
              {calendarDays.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day !== null ? (
                    <button
                      onClick={() => !isPastDate(day) && handleCalendarDateSelect(day)}
                      disabled={isPastDate(day)}
                      className={`
                        w-full h-full flex items-center justify-center rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all
                        ${isDateSelected(day)
                          ? 'bg-blue-500 text-white'
                          : isToday(day)
                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            : isPastDate(day)
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RBookingDate;
