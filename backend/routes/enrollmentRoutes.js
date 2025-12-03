const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// Create new enrollment
router.post('/', enrollmentController.createEnrollment);

// Get all enrollments
router.get('/', enrollmentController.getAllEnrollments);

// Get unique users (must be before /:id route)
router.get('/users', enrollmentController.getUniqueUsers);

// Get user by email (must be before /:id route)
router.get('/users/:email', enrollmentController.getUserByEmail);

// Get enrollment by enrollment ID
router.get('/enrollment/:enrollmentId', enrollmentController.getEnrollmentByEnrollmentId);

// Get enrollment by MongoDB ID
router.get('/:id', enrollmentController.getEnrollmentById);

// Update enrollment status
router.patch('/:id/status', enrollmentController.updateEnrollmentStatus);

// Delete enrollment
router.delete('/:id', enrollmentController.deleteEnrollment);

module.exports = router;
