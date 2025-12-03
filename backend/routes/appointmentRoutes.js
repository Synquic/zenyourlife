const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment,
  getBookedSlots
} = require('../controllers/appointmentController');

// Public routes
router.post('/', createAppointment);
router.get('/', getAllAppointments);
router.get('/booked-slots', getBookedSlots); // MUST be before /:id route
router.get('/:id', getAppointmentById);

// Update routes
router.patch('/:id/status', updateAppointmentStatus);
router.patch('/:id/cancel', cancelAppointment);

// Admin routes (you can add authentication middleware later)
router.delete('/:id', deleteAppointment);

module.exports = router;
