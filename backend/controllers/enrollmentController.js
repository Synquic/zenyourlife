const Enrollment = require('../models/Enrollment');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
// const transporter = require('../config/emailConfig');
// const { enrollmentConfirmationEmail, adminNotificationEmail } = require('../utils/emailTemplates');

// Create new enrollment
exports.createEnrollment = async (req, res) => {
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

    // Get day of the week from the date
    const date = new Date(selectedDate);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const appointmentDay = days[date.getDay()];

    // Create enrollment (enrollmentId will be auto-generated)
    const enrollment = new Enrollment({
      service: serviceId,
      serviceTitle: serviceTitle || service.title,
      appointmentDate: selectedDate,
      appointmentDay: appointmentDay,
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

    await enrollment.save();

    // Also create an appointment record to maintain booked slots functionality
    await Appointment.create({
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
    await enrollment.populate('service');

    // Console log the enrollment data with formatting
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                  📋 NEW ENROLLMENT CREATED                     ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('🆔 ENROLLMENT ID:', enrollment.enrollmentId);
    console.log('📅 DATABASE ID:', enrollment._id);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💆 SERVICE INFORMATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Service Name:', enrollment.serviceTitle);
    console.log('  Category:', enrollment.service.category);
    console.log('  Duration:', enrollment.service.duration, 'minutes');
    console.log('  Price: €' + enrollment.service.price);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📅 APPOINTMENT SCHEDULE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Date:', new Date(enrollment.appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
    console.log('  Day:', enrollment.appointmentDay);
    console.log('  Time:', enrollment.appointmentTime);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 CUSTOMER INFORMATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Full Name:', enrollment.fullName);
    console.log('  First Name:', enrollment.firstName);
    console.log('  Last Name:', enrollment.lastName);
    console.log('  Email:', enrollment.email);
    console.log('  Phone:', enrollment.phoneNumber);
    console.log('  Country:', enrollment.country);
    console.log('  Gender:', enrollment.gender);

    if (enrollment.specialRequests || enrollment.message) {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💬 ADDITIONAL INFORMATION:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      if (enrollment.specialRequests) {
        console.log('  Special Requests:', enrollment.specialRequests);
      }
      if (enrollment.message) {
        console.log('  Message:', enrollment.message);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ℹ️  STATUS INFORMATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Status:', enrollment.status.toUpperCase());
    console.log('  Created At:', new Date(enrollment.createdAt).toLocaleString());
    console.log('  Updated At:', new Date(enrollment.updatedAt).toLocaleString());

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                  ✅ ENROLLMENT SAVED SUCCESSFULLY               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Email sending removed - keeping nodemailer setup for future use
    // Uncomment below to enable email notifications
    /*
    // Send confirmation email to customer
    try {
      const customerMailOptions = {
        from: `"ZenYourLife Wellness" <${process.env.EMAIL_USER}>`,
        to: enrollment.email,
        subject: `Booking Confirmed - ${enrollment.serviceTitle}`,
        html: enrollmentConfirmationEmail(enrollment)
      };

      await transporter.sendMail(customerMailOptions);
      console.log('📧 Confirmation email sent to customer:', enrollment.email);
    } catch (emailError) {
      console.error('❌ Error sending customer email:', emailError.message);
    }

    // Send notification email to admin
    try {
      const adminMailOptions = {
        from: `"ZenYourLife System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Booking #${enrollment.enrollmentId} - ${enrollment.serviceTitle}`,
        html: adminNotificationEmail(enrollment)
      };

      await transporter.sendMail(adminMailOptions);
      console.log('📧 Notification email sent to admin\n');
    } catch (emailError) {
      console.error('❌ Error sending admin email:', emailError.message);
    }
    */

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: enrollment
    });
  } catch (error) {
    console.error('\n╔════════════════════════════════════════════════════════════════╗');
    console.error('║                  ❌ ENROLLMENT CREATION FAILED                  ║');
    console.error('╚════════════════════════════════════════════════════════════════╝');
    console.error('Error:', error.message);
    console.error('');

    res.status(400).json({
      success: false,
      message: 'Error creating enrollment',
      error: error.message
    });
  }
};

// Get all enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('service')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments',
      error: error.message
    });
  }
};

// Get single enrollment by ID
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('service');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollment',
      error: error.message
    });
  }
};

// Get enrollment by enrollment ID
exports.getEnrollmentByEnrollmentId = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      enrollmentId: req.params.enrollmentId
    }).populate('service');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollment',
      error: error.message
    });
  }
};

// Update enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('service');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment status updated successfully',
      data: enrollment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating enrollment',
      error: error.message
    });
  }
};

// Delete enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting enrollment',
      error: error.message
    });
  }
};

// Get unique users from enrollments
exports.getUniqueUsers = async (req, res) => {
  try {
    // Aggregate to get unique users by email with their info
    const users = await Enrollment.aggregate([
      {
        $group: {
          _id: '$email',
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          fullName: { $first: '$fullName' },
          email: { $first: '$email' },
          phoneNumber: { $first: '$phoneNumber' },
          country: { $first: '$country' },
          gender: { $first: '$gender' },
          totalBookings: { $sum: 1 },
          firstBooking: { $min: '$createdAt' },
          lastBooking: { $max: '$createdAt' }
        }
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          firstName: 1,
          lastName: 1,
          fullName: 1,
          email: 1,
          phoneNumber: 1,
          country: 1,
          gender: 1,
          totalBookings: 1,
          firstBooking: 1,
          lastBooking: 1
        }
      },
      {
        $sort: { lastBooking: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching unique users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get user details by email
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Get user info from first enrollment
    const userInfo = await Enrollment.findOne({ email })
      .select('firstName lastName fullName email phoneNumber country gender')
      .lean();

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all enrollments for this user
    const enrollments = await Enrollment.find({ email })
      .populate('service')
      .sort({ createdAt: -1 });

    // Calculate stats
    const stats = {
      totalBookings: enrollments.length,
      completedBookings: enrollments.filter(e => e.status === 'completed').length,
      pendingBookings: enrollments.filter(e => e.status === 'pending').length,
      cancelledBookings: enrollments.filter(e => e.status === 'cancelled').length
    };

    res.status(200).json({
      success: true,
      data: {
        user: userInfo,
        stats,
        bookings: enrollments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error.message
    });
  }
};
