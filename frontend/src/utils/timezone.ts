// Belgium timezone utility functions
// Server and business are located in Belgium (Europe/Brussels timezone)

export const BELGIUM_TIMEZONE = 'Europe/Brussels';

/**
 * Get current date/time in Belgium timezone
 */
export const getBelgiumNow = (): Date => {
  // Get the current time in Belgium timezone
  const now = new Date();
  const belgiumTime = new Date(now.toLocaleString('en-US', { timeZone: BELGIUM_TIMEZONE }));
  return belgiumTime;
};

/**
 * Get today's date at midnight in Belgium timezone
 */
export const getBelgiumToday = (): Date => {
  const belgiumNow = getBelgiumNow();
  belgiumNow.setHours(0, 0, 0, 0);
  return belgiumNow;
};

/**
 * Convert a date to Belgium timezone
 */
export const toBelgiumTime = (date: Date): Date => {
  const belgiumTime = new Date(date.toLocaleString('en-US', { timeZone: BELGIUM_TIMEZONE }));
  return belgiumTime;
};

/**
 * Get Belgium timezone offset in minutes
 */
export const getBelgiumOffset = (): number => {
  const now = new Date();
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const belgiumDate = new Date(now.toLocaleString('en-US', { timeZone: BELGIUM_TIMEZONE }));
  return (belgiumDate.getTime() - utcDate.getTime()) / (1000 * 60);
};

/**
 * Format time in Belgium timezone
 */
export const formatBelgiumTime = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  return date.toLocaleString('en-US', {
    timeZone: BELGIUM_TIMEZONE,
    ...options
  });
};

/**
 * Check if a given time slot on a given date is in the past (Belgium time)
 */
export const isTimeSlotInPast = (date: Date, timeSlot: string): boolean => {
  const belgiumNow = getBelgiumNow();
  const [hours, minutes] = timeSlot.split(':').map(Number);

  const slotDateTime = new Date(date);
  slotDateTime.setHours(hours, minutes, 0, 0);

  // Convert slot time to Belgium timezone for comparison
  const slotInBelgium = toBelgiumTime(slotDateTime);

  return slotInBelgium < belgiumNow;
};

/**
 * Check if a date has any available time slots (considering Belgium timezone)
 */
export const isDateAvailable = (date: Date, timeSlots: string[], minAdvanceHours: number = 0): boolean => {
  const belgiumNow = getBelgiumNow();
  const minAdvanceMs = minAdvanceHours * 60 * 60 * 1000;
  const minAllowedDateTime = new Date(belgiumNow.getTime() + minAdvanceMs);

  // Check if at least one time slot is available
  return timeSlots.some(timeSlot => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(hours, minutes, 0, 0);
    return slotDateTime >= minAllowedDateTime;
  });
};

/**
 * Generate dates starting from tomorrow in Belgium timezone
 */
export const generateBelgiumDates = (numberOfDays: number): Array<{
  day: string;
  date: number;
  fullDate: Date;
  dayOffset: number;
}> => {
  const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const today = getBelgiumToday();

  return Array.from({ length: numberOfDays }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i + 1); // Start from tomorrow
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      fullDate: date,
      dayOffset: i + 1
    };
  });
};
