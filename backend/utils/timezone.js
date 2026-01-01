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
 * Get start of day in Belgium timezone for a given date
 * @param {Date|string} date - Date to get start of day for
 * @returns {Date} Start of day in Belgium timezone
 */
const getStartOfDayBelgium = (date) => {
  const d = new Date(date);
  const belgiumDate = new Date(d.toLocaleString('en-US', { timeZone: BELGIUM_TIMEZONE }));
  belgiumDate.setHours(0, 0, 0, 0);
  return belgiumDate;
};

/**
 * Get end of day in Belgium timezone for a given date
 * @param {Date|string} date - Date to get end of day for
 * @returns {Date} End of day in Belgium timezone
 */
const getEndOfDayBelgium = (date) => {
  const d = new Date(date);
  const belgiumDate = new Date(d.toLocaleString('en-US', { timeZone: BELGIUM_TIMEZONE }));
  belgiumDate.setHours(23, 59, 59, 999);
  return belgiumDate;
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
  getStartOfDayBelgium,
  getEndOfDayBelgium,
  formatBelgiumDate
};
