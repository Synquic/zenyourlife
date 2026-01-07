const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Security Middleware
const { sanitizeInput, preventParameterPollution, xssSanitize } = require('./middleware/security');
const { apiLimiter } = require('./middleware/rateLimiter');

// Configure CORS properly
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware - sanitize inputs
app.use(sanitizeInput); // Prevent NoSQL injection
app.use(preventParameterPollution); // Prevent parameter pollution
app.use(xssSanitize); // Prevent XSS attacks

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files for frontend and admin (in production)
if (process.env.SERVER_ENV === 'production') {
  // Serve admin panel at /admin
  app.use('/admin', express.static(path.join(__dirname, '../admin/dist'), {
    setHeaders: (res) => {
      res.setHeader('Content-Security-Policy', "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; font-src * data:; connect-src *;");
    }
  }));

  // Serve frontend at root
  app.use(express.static(path.join(__dirname, '../frontend/dist'), {
    setHeaders: (res) => {
      res.setHeader('Content-Security-Policy', "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; font-src * data:; connect-src *;");
    }
  }));
}

// Import Reminder Scheduler
const { startReminderScheduler } = require('./services/reminderScheduler');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('✅ MongoDB Connected Successfully');
  // Auto-assign unique images to services on startup
  await assignUniqueImagesToServices();
  // Start reminder scheduler after DB connection
  startReminderScheduler();
})
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Function to assign unique images (m1.png to m9.png) to all services
const assignUniqueImagesToServices = async () => {
  try {
    const Service = require('./models/Service');
    const services = await Service.find({}).sort({ createdAt: 1 });
    const imageNames = ['m1.png', 'm2.png', 'm3.png', 'm4.png', 'm5.png', 'm6.png', 'm7.png', 'm8.png', 'm9.png'];

    if (services.length === 0) {
      console.log('📷 No services found to assign images');
      return;
    }

    let updated = 0;
    for (let i = 0; i < services.length; i++) {
      const imageIndex = i % imageNames.length;
      const expectedImage = imageNames[imageIndex];

      // Only update if image is different or not set properly
      if (services[i].image !== expectedImage) {
        await Service.findByIdAndUpdate(services[i]._id, {
          image: expectedImage,
          displayOrder: i
        });
        updated++;
      }
    }

    if (updated > 0) {
      console.log(`📷 Assigned unique images to ${updated} services`);
    } else {
      console.log('📷 All services already have unique images assigned');
    }
  } catch (error) {
    console.error('Error assigning images to services:', error.message);
  }
};

// Import Routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const rentalBookingRoutes = require('./routes/rentalBooking');
const propertyRoutes = require('./routes/propertyRoutes');
const pageContentRoutes = require('./routes/pageContentRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const servicePageContentRoutes = require('./routes/servicePageContentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const rcontactRoutes = require('./routes/rcontactRoutes');
const rentalTestimonialRoutes = require('./routes/rentalTestimonialRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const translationRoutes = require('./routes/translationRoutes');
const blockedDateRoutes = require('./routes/blockedDateRoutes');
const legalPageRoutes = require('./routes/legalPageRoutes');
const reminderTestRoutes = require('./routes/reminderTestRoutes');
const messageRoutes = require('./routes/messageRoutes');
const rentalPageRoutes = require('./routes/rentalPageRoutes');
const faqRoutes = require('./routes/faqRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/bookings', rentalBookingRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/page-content', pageContentRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/service-page-content', servicePageContentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/rcontact', rcontactRoutes);
app.use('/api/rental-testimonials', rentalTestimonialRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/translate', translationRoutes);
app.use('/api/blocked-dates', blockedDateRoutes);
app.use('/api/legal-pages', legalPageRoutes);
app.use('/api/reminder-test', reminderTestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rental-page', rentalPageRoutes);
app.use('/api/faqs', faqRoutes);

// Health Check Routes
app.get('/', (req, res) => {
  res.json({
    message: 'ZenYourLife API is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// API Health Check endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'ZenYourLife API Server',
    status: 'healthy',
    version: '1.0.0',
    environment: process.env.SERVER_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    endpoints: {
      services: '/api/services',
      properties: '/api/properties',
      appointments: '/api/appointments',
      contact: '/api/contact',
      testimonials: '/api/testimonials',
      legalPages: '/api/legal-pages',
      upload: '/api/upload'
    }
  });
});

// Detailed health check with database status
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform
      },
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'N/A'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Handle 404 for uploads - prevent falling through to SPA catch-all
app.use('/uploads', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'File not found',
    path: req.path
  });
});

// Catch-all routes for SPA (must be after API routes) - Only in production
if (process.env.SERVER_ENV === 'production') {
  // Admin panel catch-all route
  app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/dist/index.html'));
  });

  // Frontend catch-all route (must be last)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.SERVER_ENV === 'development' ? err.message : {}
  });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}`);
});
