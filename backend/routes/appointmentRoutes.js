const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { bookingLimiter, strictLimiter } = require('../middleware/rateLimiter');
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment,
  getBookedSlots,
  clearAllAppointments
} = require('../controllers/appointmentController');

// Public routes
router.post('/', bookingLimiter, createAppointment); // Rate limited for bookings
router.get('/booked-slots', getBookedSlots); // Public - must be before /:id route

// Admin routes (authentication required) - MUST be before /:id routes
router.get('/', authMiddleware, getAllAppointments);
router.delete('/clear-all', authMiddleware, strictLimiter, clearAllAppointments);

// Public route - get specific appointment (users need to check their booking)
router.get('/:id', getAppointmentById);

// Admin update routes (authentication required)
router.patch('/:id/status', authMiddleware, strictLimiter, updateAppointmentStatus);
router.patch('/:id/cancel', bookingLimiter, cancelAppointment); // Users can cancel, so not auth required

// Admin delete (authentication required)
router.delete('/:id', authMiddleware, strictLimiter, deleteAppointment);

module.exports = router;
