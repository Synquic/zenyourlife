const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const {
      serviceId,
      serviceTitle,
      selectedDate,
      selectedTime,
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      gender,
      specialRequests,
      message
    } = req.body;

    // Validate required fields
    if (!serviceId || !selectedDate || !selectedTime || !firstName || !lastName || !email || !phoneNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      service: serviceId,
      serviceTitle: serviceTitle || service.title,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      firstName,
      lastName,
      email,
      phoneNumber,
      country: country || 'BE',
      gender,
      specialRequests: specialRequests || '',
      message: message || '',
      status: 'confirmed'
    });

    // Populate service details
    await appointment.populate('service');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, email, date } = req.query;
    let query = {};

    // Apply filters if provided
    if (status) query.status = status;
    if (email) query.email = email.toLowerCase();
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('service')
      .sort({ appointmentDate: -1, appointmentTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// Get single appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('service');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('service');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('service');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting appointment',
      error: error.message
    });
  }
};

// Get booked time slots for a specific date
exports.getBookedSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date'
      });
    }

    // Create date range for the entire day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Find all confirmed appointments for this date
    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: startDate,
        $lte: endDate
      },
      status: { $in: ['confirmed', 'pending'] } // Only confirmed and pending appointments block slots
    }).select('appointmentTime');

    // Extract just the time slots
    const bookedSlots = appointments.map(apt => apt.appointmentTime);

    res.status(200).json({
      success: true,
      date: date,
      bookedSlots: bookedSlots,
      count: bookedSlots.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booked slots',
      error: error.message
    });
  }
};
