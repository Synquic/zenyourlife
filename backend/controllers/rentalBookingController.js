const RentalBooking = require('../models/RentalBooking');
const nodemailer = require('nodemailer');

// Create a new rental booking
exports.createRentalBooking = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      specialRequests,
      message,
      property,
      booking
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !gender) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    // Parse the date from booking info
    let checkInDate = new Date();
    if (booking) {
      if (booking.fullDate) {
        // Use the full ISO date string if provided
        checkInDate = new Date(booking.fullDate);
      } else if (booking.year !== undefined && booking.month !== undefined && booking.date) {
        // Create date from year, month, date
        checkInDate = new Date(booking.year, booking.month, booking.date);
      } else if (booking.date) {
        // Fallback: Create date from the booking date number (legacy support)
        const now = new Date();
        checkInDate = new Date(now.getFullYear(), now.getMonth(), booking.date);
      }
    }

    // Calculate total price
    const numberOfNights = 1; // Default to 1 night
    const pricePerNight = property?.price || 0;
    const totalPrice = pricePerNight * numberOfNights;
    const deposit = totalPrice * 0.3; // 30% deposit

    // Create the rental booking
    const rentalBooking = await RentalBooking.create({
      firstName,
      lastName,
      email,
      phone,
      gender,
      property: property ? {
        propertyId: property.propertyId || null,
        name: property.name,
        price: property.price,
        guests: property.guests,
        bedrooms: property.bedrooms,
        parking: property.parking
      } : null,
      booking: {
        checkInDate: checkInDate,
        checkInTime: booking?.checkInTime || '10:30',
        checkOutTime: booking?.checkOutTime || '10:00',
        numberOfNights: numberOfNights,
        totalPrice: totalPrice
      },
      specialRequests: specialRequests || '',
      message: message || '',
      status: 'confirmed',
      payment: {
        totalAmount: totalPrice,
        deposit: deposit,
        depositPaid: false,
        remainingBalance: totalPrice,
        paymentStatus: 'pending'
      }
    });

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║            📧 RENTAL BOOKING SAVED TO DATABASE                 ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.log('Booking ID:', rentalBooking.bookingId);
    console.log('Customer:', `${firstName} ${lastName}`);
    console.log('Email:', email);
    console.log('Property:', property?.name || 'N/A');
    console.log('Check-in Date:', checkInDate.toDateString());
    console.log('Status:', rentalBooking.status);

    // Send confirmation email
    let emailSent = false;
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD &&
          process.env.EMAIL_USER !== 'your-email@outlook.com' &&
          process.env.EMAIL_PASSWORD !== 'your-app-password-here') {

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });

        const customerEmailHTML = generateEmailTemplate(rentalBooking);

        const mailOptions = {
          from: `"ZenYourLife Wellness" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `Booking Confirmation #${rentalBooking.bookingId} - ZenYourLife`,
          html: customerEmailHTML
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;

        // Update email status in database
        rentalBooking.emailSent = true;
        await rentalBooking.save();

        console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
      }
    } catch (emailError) {
      console.error('\n❌ Error sending email:', emailError.message);
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                  ✅ BOOKING CREATED SUCCESSFULLY               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    res.status(201).json({
      success: true,
      message: emailSent ? 'Booking confirmed! Check your email for confirmation.' : 'Booking confirmed successfully',
      emailSent: emailSent,
      data: rentalBooking
    });

  } catch (error) {
    console.error('\n❌ Error creating rental booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// Get all rental bookings
exports.getAllRentalBookings = async (req, res) => {
  try {
    const { status, email, startDate, endDate } = req.query;
    let query = {};

    // Apply filters
    if (status) query.status = status;
    if (email) query.email = email.toLowerCase();
    if (startDate || endDate) {
      query['booking.checkInDate'] = {};
      if (startDate) query['booking.checkInDate'].$gte = new Date(startDate);
      if (endDate) query['booking.checkInDate'].$lte = new Date(endDate);
    }

    const bookings = await RentalBooking.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching rental bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get single rental booking by ID
exports.getRentalBookingById = async (req, res) => {
  try {
    const booking = await RentalBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// Update rental booking status
exports.updateRentalBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const booking = await RentalBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { depositPaid, paymentStatus } = req.body;

    const updateData = {};
    if (depositPaid !== undefined) updateData['payment.depositPaid'] = depositPaid;
    if (paymentStatus) updateData['payment.paymentStatus'] = paymentStatus;

    if (depositPaid) {
      // Calculate remaining balance when deposit is paid
      const booking = await RentalBooking.findById(req.params.id);
      if (booking) {
        updateData['payment.remainingBalance'] = booking.payment.totalAmount - booking.payment.deposit;
      }
    }

    const updatedBooking = await RentalBooking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: updatedBooking
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

// Cancel rental booking
exports.cancelRentalBooking = async (req, res) => {
  try {
    const booking = await RentalBooking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

// Delete rental booking
exports.deleteRentalBooking = async (req, res) => {
  try {
    const booking = await RentalBooking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
};

// Helper function to generate email template
function generateEmailTemplate(booking) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4A90E2 0%, #7DB4E6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .section-title { font-size: 18px; font-weight: bold; color: #4A90E2; margin: 25px 0 15px 0; border-bottom: 2px solid #4A90E2; padding-bottom: 5px; }
        .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #4A90E2; }
        .property-highlight { background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4A90E2; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmation</h1>
          <p>Booking ID: #${booking.bookingId}</p>
        </div>
        <div class="content">
          <h2>Dear ${booking.firstName} ${booking.lastName},</h2>
          <p>We're excited to confirm your rental booking!</p>

          ${booking.property ? `
          <div class="property-highlight">
            <h3 style="margin-top: 0; color: #1976D2;">🏠 ${booking.property.name}</h3>
            <div style="margin-top: 15px;">
              <div><strong>Price:</strong> €${booking.property.price} per night</div>
              <div><strong>Guests:</strong> ${booking.property.guests} guests</div>
              <div><strong>Bedrooms:</strong> ${booking.property.bedrooms} bedrooms</div>
              <div><strong>Parking:</strong> ${booking.property.parking}</div>
            </div>
          </div>
          ` : ''}

          <div class="section-title">📅 Booking Schedule</div>
          <div class="info-row">
            <span class="label">Check-in Date:</span> ${booking.booking.checkInDate.toDateString()}
          </div>
          <div class="info-row">
            <span class="label">Check-in Time:</span> ${booking.booking.checkInTime}
          </div>
          <div class="info-row">
            <span class="label">Check-out Time:</span> ${booking.booking.checkOutTime}
          </div>

          <div class="section-title">💰 Payment Details</div>
          <div class="info-row">
            <span class="label">Total Amount:</span> €${booking.payment.totalAmount}
          </div>
          <div class="info-row">
            <span class="label">Deposit (30%):</span> €${booking.payment.deposit}
          </div>

          <p style="margin-top: 30px; padding: 15px; background: #E8F5E9; border-left: 4px solid #4CAF50; border-radius: 5px;">
            ✅ Your booking has been confirmed! We will contact you shortly.
          </p>

          <div class="footer">
            <p>Best regards,<br><strong>The ZenYourLife Team</strong></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
