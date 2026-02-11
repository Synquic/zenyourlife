/**
 * Belgium timezone utility functions
 * Server and business are located in Belgium (Europe/Brussels timezone)
 */

const BELGIUM_TIMEZONE = 'Europe/Brussels';

/**
 * Get current date/time in Belgium timezone
 * @returns {Date} Current time in Belgium
 */
const getBelgiumNow = () => {
  const now = new Date();
  const belgiumTime = new Date(now.toLocaleString('en-US', { timeZone: BELGIUM_TIMEZONE }));
  return belgiumTime;
};

/**
 * Get today's date at midnight in Belgium timezone
 * @returns {Date} Today at midnight in Belgium
 */
const getBelgiumToday = () => {
  const belgiumNow = getBelgiumNow();
  belgiumNow.setHours(0, 0, 0, 0);
  return belgiumNow;
};

/**
 * Convert a date to Belgium timezone
 * @param {Date} date - Date to convert
 * @returns {Date} Date in Belgium timezone
 */
const toBelgiumTime = (date) => {
  const belgiumTime = new Date(date.toLocaleString('en-US', { timeZone: BELGIUM_TIMEZONE }));
  return belgiumTime;
};

/**
 * Get the Belgium calendar date as YYYY-MM-DD from any date input
 * @param {Date|string} dateInput - Date to extract Belgium calendar date from
 * @returns {string} YYYY-MM-DD string in Belgium timezone
 */
const getBelgiumDateStr = (dateInput) => {
  // If already a YYYY-MM-DD string, use directly
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }
  // Convert to Belgium calendar date using Intl (en-CA gives YYYY-MM-DD format)
  const d = new Date(dateInput);
  return new Intl.DateTimeFormat('en-CA', { timeZone: BELGIUM_TIMEZONE }).format(d);
};

/**
 * Get start of day (midnight) in Belgium timezone as a proper UTC Date.
 * Works correctly regardless of server timezone or user timezone.
 * @param {Date|string} dateInput - Date or YYYY-MM-DD string
 * @returns {Date} UTC Date representing midnight in Belgium
 */
const getStartOfDayBelgium = (dateInput) => {
  const belgiumDateStr = getBelgiumDateStr(dateInput);

  // At midnight UTC on this date, determine what hour it is in Belgium
  // This tells us the UTC offset for Belgium on this date
  const midnightUTC = new Date(belgiumDateStr + 'T00:00:00.000Z');
  const belgiumHour = parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: BELGIUM_TIMEZONE,
      hour: 'numeric',
      hour12: false,
      hourCycle: 'h23'
    }).format(midnightUTC)
  );

  // Belgium is belgiumHour hours ahead of UTC at this moment
  // So midnight Belgium = midnight UTC - belgiumHour hours
  return new Date(midnightUTC.getTime() - belgiumHour * 60 * 60 * 1000);
};

/**
 * Get end of day (23:59:59.999) in Belgium timezone as a proper UTC Date.
 * Works correctly regardless of server timezone or user timezone.
 * @param {Date|string} dateInput - Date or YYYY-MM-DD string
 * @returns {Date} UTC Date representing end of day in Belgium
 */
const getEndOfDayBelgium = (dateInput) => {
  const startOfDay = getStartOfDayBelgium(dateInput);
  // Add 24 hours minus 1ms to get 23:59:59.999 Belgium time
  return new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);
};

/**
 * Format date for display in Belgium timezone
 * @param {Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
const formatBelgiumDate = (date, options = {}) => {
  return date.toLocaleString('en-US', {
    timeZone: BELGIUM_TIMEZONE,
    ...options
  });
};

module.exports = {
  BELGIUM_TIMEZONE,
  getBelgiumNow,
  getBelgiumToday,
  toBelgiumTime,
  getBelgiumDateStr,
  getStartOfDayBelgium,
  getEndOfDayBelgium,
  formatBelgiumDate
};
