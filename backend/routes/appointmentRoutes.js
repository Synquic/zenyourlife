const express = require('express');
const router = express.Router();
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
router.post('/', createAppointment);
router.get('/', getAllAppointments);
router.get('/booked-slots', getBookedSlots); // MUST be before /:id route

// Admin routes - MUST be before /:id routes
router.delete('/clear-all', clearAllAppointments); // Clear all orphaned appointments

router.get('/:id', getAppointmentById);

// Update routes
router.patch('/:id/status', updateAppointmentStatus);
router.patch('/:id/cancel', cancelAppointment);

// Delete single appointment
router.delete('/:id', deleteAppointment);

module.exports = router;
