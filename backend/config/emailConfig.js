const nodemailer = require('nodemailer');

// Create transporter for Outlook
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your Outlook email
    pass: process.env.EMAIL_PASSWORD, // Your Outlook password or app password
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

module.exports = transporter;
