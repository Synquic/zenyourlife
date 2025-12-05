const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Enrollment = require('../models/Enrollment');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate customer reminder email template (sent 1 day before)
const generateCustomerReminderTemplate = (enrollment) => {
  const appointmentDate = new Date(enrollment.appointmentDate);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #DFB13B 0%, #C9A032 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reminder-box { background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); padding: 25px; border-radius: 10px; margin: 20px 0; text-align: center; border-left: 4px solid #2196F3; }
        .reminder-box h2 { color: #1565C0; margin: 0 0 10px 0; }
        .section-title { font-size: 18px; font-weight: bold; color: #DFB13B; margin: 25px 0 15px 0; border-bottom: 2px solid #DFB13B; padding-bottom: 5px; }
        .info-row { margin: 10px 0; padding: 12px 15px; background: white; border-radius: 5px; }
        .label { font-weight: 600; color: #555; }
        .value { color: #333; }
        .highlight-box { background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #DFB13B; text-align: center; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Appointment Reminder</h1>
          <p>Your massage session is tomorrow!</p>
        </div>
        <div class="content">
          <div class="reminder-box">
            <h2>Don't Forget!</h2>
            <p>Dear ${enrollment.firstName}, this is a friendly reminder about your upcoming massage appointment.</p>
          </div>

          <div class="highlight-box">
            <h3 style="margin-top: 0; color: #C9A032;">Your Appointment is Tomorrow!</h3>
            <p style="font-size: 24px; font-weight: bold; color: #333; margin: 15px 0;">${formattedDate}</p>
            <p style="font-size: 20px; color: #666;">at ${enrollment.appointmentTime}</p>
          </div>

          <div class="section-title">Service Details</div>
          <div class="info-row">
            <span class="label">Service:</span>
            <span class="value">${enrollment.serviceTitle}</span>
          </div>

          <div class="section-title">Location</div>
          <div class="info-row">
            <span class="value">Schapenbaan 45, 1731 Relegem</span>
          </div>

          <div style="background: #E8F5E9; padding: 15px; border-radius: 8px; margin-top: 25px; text-align: center;">
            <p style="margin: 0; color: #2E7D32; font-weight: 500;">Please arrive 10 minutes before your appointment time.</p>
          </div>

          <div class="footer">
            <p>Need to reschedule? Please contact us as soon as possible.</p>
            <p>Best regards,<br><strong>The ZenYourLife Team</strong></p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">© ${new Date().getFullYear()} ZenYourLife. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate admin reminder email template (sent 15 min before appointment)
const generateAdminReminderTemplate = (enrollment) => {
  const appointmentDate = new Date(enrollment.appointmentDate);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0 0 10px 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .urgent-box { background: #FFF3E0; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #FF9800; text-align: center; }
        .section-title { font-size: 16px; font-weight: bold; color: #555; margin: 20px 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid #ddd; }
        .info-row { margin: 8px 0; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: 600; color: #555; display: inline-block; width: 120px; }
        .value { color: #333; }
        .time-highlight { background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; background: #f9f9f9; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Upcoming Appointment in 15 Minutes!</h1>
          <p>Booking ID: #${enrollment.enrollmentId}</p>
        </div>
        <div class="content">
          <div class="urgent-box">
            <strong>Get Ready!</strong> You have an appointment starting in 15 minutes.
          </div>

          <div class="time-highlight">
            <p style="font-size: 14px; color: #666; margin: 0;">Appointment Time</p>
            <p style="font-size: 28px; font-weight: bold; color: #D32F2F; margin: 10px 0;">${enrollment.appointmentTime}</p>
            <p style="font-size: 14px; color: #666; margin: 0;">${formattedDate}</p>
          </div>

          <div class="section-title">Customer Details</div>
          <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">${enrollment.fullName}</span>
          </div>
          <div class="info-row">
            <span class="label">Phone:</span>
            <span class="value">${enrollment.phoneNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">${enrollment.email}</span>
          </div>
          <div class="info-row">
            <span class="label">Gender:</span>
            <span class="value">${enrollment.gender}</span>
          </div>

          <div class="section-title">Service</div>
          <div class="info-row">
            <span class="label">Service:</span>
            <span class="value">${enrollment.serviceTitle}</span>
          </div>

          ${enrollment.specialRequests ? `
          <div class="section-title">Special Requests</div>
          <div class="info-row" style="background: #FFFDE7;">
            <span class="value">${enrollment.specialRequests}</span>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>This is an automated reminder from ZenYourLife Booking System</p>
          <p>© ${new Date().getFullYear()} ZenYourLife. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send customer reminder email (1 day before)
const sendCustomerReminder = async (enrollment) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email credentials not configured, skipping customer reminder');
    return false;
  }

  try {
    const mailOptions = {
      from: `"ZenYourLife Wellness" <${process.env.EMAIL_USER}>`,
      to: enrollment.email,
      subject: `Reminder: Your Massage Appointment Tomorrow - ${enrollment.serviceTitle}`,
      html: generateCustomerReminderTemplate(enrollment)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Customer reminder sent to: ${enrollment.email} for appointment on ${enrollment.appointmentDate}`);
    return true;
  } catch (error) {
    console.error('Error sending customer reminder:', error.message);
    return false;
  }
};

// Send admin reminder email (15 min before)
const sendAdminReminder = async (enrollment) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email credentials not configured, skipping admin reminder');
    return false;
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const mailOptions = {
      from: `"ZenYourLife Booking System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `STARTING IN 15 MIN - ${enrollment.fullName} - ${enrollment.serviceTitle}`,
      html: generateAdminReminderTemplate(enrollment)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admin reminder sent for appointment #${enrollment.enrollmentId} at ${enrollment.appointmentTime}`);
    return true;
  } catch (error) {
    console.error('Error sending admin reminder:', error.message);
    return false;
  }
};

// Check and send customer reminders (appointments tomorrow)
const checkCustomerReminders = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Set to start of tomorrow
    const tomorrowStart = new Date(tomorrow);
    tomorrowStart.setHours(0, 0, 0, 0);

    // Set to end of tomorrow
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    // Find appointments for tomorrow that haven't received customer reminder
    const enrollments = await Enrollment.find({
      appointmentDate: {
        $gte: tomorrowStart,
        $lte: tomorrowEnd
      },
      reminderPreference: 'email',
      reminderSentToCustomer: false,
      status: { $in: ['pending', 'confirmed'] }
    });

    console.log(`Found ${enrollments.length} appointments for tomorrow needing customer reminders`);

    for (const enrollment of enrollments) {
      const sent = await sendCustomerReminder(enrollment);
      if (sent) {
        await Enrollment.findByIdAndUpdate(enrollment._id, {
          reminderSentToCustomer: true
        });
      }
    }
  } catch (error) {
    console.error('Error checking customer reminders:', error.message);
  }
};

// Check and send admin reminders (appointments in 15 minutes)
const checkAdminReminders = async () => {
  try {
    const now = new Date();

    // Get today's date at midnight
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date at midnight
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find today's appointments that haven't received admin reminder
    const enrollments = await Enrollment.find({
      appointmentDate: {
        $gte: today,
        $lt: tomorrow
      },
      reminderSentToAdmin: false,
      status: { $in: ['pending', 'confirmed'] }
    });

    for (const enrollment of enrollments) {
      // Parse appointment time
      const [hours, minutes] = enrollment.appointmentTime.split(':').map(Number);

      // Create appointment datetime
      const appointmentDateTime = new Date(enrollment.appointmentDate);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      // Calculate 15 minutes before appointment
      const reminderTime = new Date(appointmentDateTime);
      reminderTime.setMinutes(reminderTime.getMinutes() - 15);

      // Check if it's time to send (within 5 minute window)
      const timeDiff = now.getTime() - reminderTime.getTime();

      // Send if we're within 5 minutes after the reminder time (to account for cron interval)
      if (timeDiff >= 0 && timeDiff <= 5 * 60 * 1000) {
        const sent = await sendAdminReminder(enrollment);
        if (sent) {
          await Enrollment.findByIdAndUpdate(enrollment._id, {
            reminderSentToAdmin: true
          });
        }
      }
    }
  } catch (error) {
    console.error('Error checking admin reminders:', error.message);
  }
};

// Start the scheduler
const startReminderScheduler = () => {
  console.log('Starting reminder scheduler...');

  // Check customer reminders every day at 9:00 AM (for tomorrow's appointments)
  cron.schedule('0 9 * * *', () => {
    console.log('Running customer reminder check at 9:00 AM');
    checkCustomerReminders();
  });

  // Check admin reminders every 5 minutes (for 15-min-before notifications)
  cron.schedule('*/5 * * * *', () => {
    checkAdminReminders();
  });

  console.log('Reminder scheduler started successfully');
  console.log('- Customer reminders: Daily at 9:00 AM (for next day appointments)');
  console.log('- Admin reminders: Every 5 minutes (15 min before appointment)');
};

module.exports = {
  startReminderScheduler,
  checkCustomerReminders,
  checkAdminReminders,
  sendCustomerReminder,
  sendAdminReminder
};
