const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { sendCustomerReminder, sendAdminReminder } = require('../services/reminderScheduler');

// Test customer reminder for a specific enrollment
router.post('/test-customer-reminder/:enrollmentId', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ enrollmentId: req.params.enrollmentId });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    console.log('Testing customer reminder for enrollment:', enrollment.enrollmentId);
    const sent = await sendCustomerReminder(enrollment);

    res.json({
      success: sent,
      message: sent ? 'Customer reminder email sent successfully!' : 'Failed to send customer reminder',
      enrollment: {
        id: enrollment.enrollmentId,
        customer: enrollment.fullName,
        email: enrollment.email,
        appointmentDate: enrollment.appointmentDate,
        appointmentTime: enrollment.appointmentTime
      }
    });
  } catch (error) {
    console.error('Error testing customer reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing customer reminder',
      error: error.message
    });
  }
});

// Test admin reminder for a specific enrollment
router.post('/test-admin-reminder/:enrollmentId', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ enrollmentId: req.params.enrollmentId });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    console.log('Testing admin reminder for enrollment:', enrollment.enrollmentId);
    const sent = await sendAdminReminder(enrollment);

    res.json({
      success: sent,
      message: sent ? 'Admin reminder email sent successfully!' : 'Failed to send admin reminder',
      enrollment: {
        id: enrollment.enrollmentId,
        customer: enrollment.fullName,
        appointmentDate: enrollment.appointmentDate,
        appointmentTime: enrollment.appointmentTime
      }
    });
  } catch (error) {
    console.error('Error testing admin reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing admin reminder',
      error: error.message
    });
  }
});

// Test both reminders for a specific enrollment
router.post('/test-both/:enrollmentId', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ enrollmentId: req.params.enrollmentId });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    console.log('Testing both reminders for enrollment:', enrollment.enrollmentId);

    const customerSent = await sendCustomerReminder(enrollment);
    const adminSent = await sendAdminReminder(enrollment);

    res.json({
      success: customerSent || adminSent,
      message: 'Test complete',
      results: {
        customerReminder: customerSent ? 'Sent successfully' : 'Failed',
        adminReminder: adminSent ? 'Sent successfully' : 'Failed'
      },
      enrollment: {
        id: enrollment.enrollmentId,
        customer: enrollment.fullName,
        customerEmail: enrollment.email,
        appointmentDate: enrollment.appointmentDate,
        appointmentTime: enrollment.appointmentTime,
        reminderPreference: enrollment.reminderPreference
      }
    });
  } catch (error) {
    console.error('Error testing reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing reminders',
      error: error.message
    });
  }
});

// Get all enrollments for testing
router.get('/enrollments', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ status: { $in: ['pending', 'confirmed'] } })
      .sort({ appointmentDate: 1 })
      .limit(10);

    res.json({
      success: true,
      message: 'Recent enrollments for testing',
      data: enrollments.map(e => ({
        enrollmentId: e.enrollmentId,
        customer: e.fullName,
        email: e.email,
        appointmentDate: e.appointmentDate,
        appointmentTime: e.appointmentTime,
        reminderPreference: e.reminderPreference,
        reminderSentToCustomer: e.reminderSentToCustomer,
        reminderSentToAdmin: e.reminderSentToAdmin,
        status: e.status
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments',
      error: error.message
    });
  }
});

// Reset reminder flags for an enrollment (for re-testing)
router.post('/reset-flags/:enrollmentId', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOneAndUpdate(
      { enrollmentId: req.params.enrollmentId },
      {
        reminderSentToCustomer: false,
        reminderSentToAdmin: false
      },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      message: 'Reminder flags reset successfully',
      enrollment: {
        id: enrollment.enrollmentId,
        reminderSentToCustomer: enrollment.reminderSentToCustomer,
        reminderSentToAdmin: enrollment.reminderSentToAdmin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting flags',
      error: error.message
    });
  }
});

module.exports = router;
