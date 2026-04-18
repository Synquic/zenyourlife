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
 * Get today's Belgium calendar date as YYYY-MM-DD string.
 * Immune to the user's browser timezone — always returns the Belgium/Netherlands calendar day.
 */
export const getBelgiumTodayStr = (): string => {
  return new Intl.DateTimeFormat('en-CA', { timeZone: BELGIUM_TIMEZONE }).format(new Date());
};

/**
 * Get the Belgium calendar dateStr (YYYY-MM-DD) for a given Date.
 * Always returns the Belgium/Netherlands calendar day, regardless of browser locale.
 */
export const getBelgiumDateStr = (date: Date): string => {
  return new Intl.DateTimeFormat('en-CA', { timeZone: BELGIUM_TIMEZONE }).format(date);
};

/**
 * Generate dates starting from tomorrow in Belgium timezone.
 * The `dateStr` is the authoritative Belgium calendar day (YYYY-MM-DD) — timezone-safe.
 * If the user is in India, Hawaii, Tokyo, anywhere — they still see Belgium days.
 */
export const generateBelgiumDates = (numberOfDays: number): Array<{
  day: string;
  date: number;
  month: string;
  fullDate: Date;
  dateStr: string;
  dayOffset: number;
}> => {
  const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Parse today's Belgium date from its string representation — this avoids any local-time drift.
  const todayStr = getBelgiumTodayStr(); // "YYYY-MM-DD" in Belgium
  const [ty, tm, td] = todayStr.split('-').map(Number);

  return Array.from({ length: numberOfDays }, (_, i) => {
    // Build the target Belgium calendar day by incrementing a UTC-anchored Date.
    // Using UTC arithmetic avoids DST jumps and browser-timezone side effects.
    const utcAnchor = new Date(Date.UTC(ty, tm - 1, td + i + 1, 12, 0, 0));
    const y = utcAnchor.getUTCFullYear();
    const m = utcAnchor.getUTCMonth();
    const d = utcAnchor.getUTCDate();
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    // fullDate: a Date whose local interpretation matches the Belgium calendar day
    // (used only for display; dateStr is the source of truth for comparisons).
    const fullDate = new Date(y, m, d);

    return {
      day: days[fullDate.getDay()],
      date: d,
      month: months[m],
      fullDate,
      dateStr,
      dayOffset: i + 1
    };
  });
};
