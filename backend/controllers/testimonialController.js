const Testimonial = require('../models/Testimonial');
const { autoTranslateTestimonial } = require('../services/autoTranslateService');

const SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'nl'];

// Helper function to get translated testimonial from stored translations
const getTranslatedTestimonial = (testimonial, lang) => {
  const testimonialObj = testimonial.toObject();

  // If language is English or translations don't exist, return original
  if (lang === 'en' || !testimonialObj.translations || !testimonialObj.translations[lang]) {
    return testimonialObj;
  }

  const translation = testimonialObj.translations[lang];

  // Return testimonial with translated fields, falling back to original if translation is missing
  return {
    ...testimonialObj,
    text: translation.text || testimonialObj.text,
    role: translation.role || testimonialObj.role
  };
};

// Get all active testimonials (with optional translation from DB)
exports.getAllTestimonials = async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    console.log(`📖 [DB READ] Fetching testimonials for language: ${lang}`);

    const testimonials = await Testimonial.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });

    // If language is English or not supported, return original data
    if (lang === 'en' || !SUPPORTED_LANGUAGES.includes(lang)) {
      console.log(`📖 [DB READ] Returning ${testimonials.length} testimonials in English (original)`);
      return res.status(200).json({
        success: true,
        count: testimonials.length,
        data: testimonials,
        language: 'en'
      });
    }

    // Get translated testimonials from stored translations in DB
    let translatedCount = 0;
    const translatedTestimonials = testimonials.map(testimonial => {
      const result = getTranslatedTestimonial(testimonial, lang);
      if (testimonial.translations?.[lang]?.text) translatedCount++;
      return result;
    });

    console.log(`📖 [DB READ] Returning ${testimonials.length} testimonials in ${lang} (${translatedCount} translated from DB, ${testimonials.length - translatedCount} no translation stored)`);

    res.status(200).json({
      success: true,
      count: translatedTestimonials.length,
      data: translatedTestimonials,
      language: lang
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
};

// Get all testimonials (including inactive - for admin)
exports.getAllTestimonialsAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
};

// Get single testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonial',
      error: error.message
    });
  }
};

// Create new testimonial - Auto-translates content to FR/DE/NL
exports.createTestimonial = async (req, res) => {
  try {
    // Auto-translate content to all languages and store in DB
    console.log('[Testimonial Create] Auto-translating content...');
    const translations = await autoTranslateTestimonial(req.body);

    // Create testimonial with translations
    const testimonialData = {
      ...req.body,
      translations
    };

    const testimonial = await Testimonial.create(testimonialData);

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully with translations',
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating testimonial',
      error: error.message
    });
  }
};

// Update testimonial - Auto-translates content to FR/DE/NL
exports.updateTestimonial = async (req, res) => {
  try {
    // Check if translatable fields are being updated
    const translatableFields = ['text', 'role'];
    const hasTranslatableChanges = translatableFields.some(field => req.body[field] !== undefined);

    let updateData = { ...req.body };

    // Auto-translate if translatable content is being updated
    if (hasTranslatableChanges) {
      console.log('[Testimonial Update] Auto-translating content...');
      const translations = await autoTranslateTestimonial(req.body);
      updateData.translations = translations;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: hasTranslatableChanges ? 'Testimonial updated with translations' : 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating testimonial',
      error: error.message
    });
  }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial',
      error: error.message
    });
  }
};

// Seed default testimonials
exports.seedTestimonials = async (req, res) => {
  try {
    const existingCount = await Testimonial.countDocuments();

    if (existingCount > 0) {
      return res.status(200).json({
        success: true,
        message: 'Testimonials already exist',
        count: existingCount
      });
    }

    const defaultTestimonials = [
      {
        name: "Dave Nash",
        role: "@once",
        text: "After exploring the @ZenYourLife platform for a few months, I finally took the plunge. Wow, it's a game changer! Just give it a shot! You won't regret it! 🤘🏻",
        photo: "profile1.png",
        displayOrder: 0
      },
      {
        name: "Sebas",
        role: "@sebasbedoya",
        text: "Once you start using @ZenYourLife, there's no going back. It has completely transformed my wellness journey. Booking massages and treatments has never been easier! 🔥🔥",
        photo: "profile2.png",
        displayOrder: 1
      },
      {
        name: "Dylan Pearson",
        role: "@dylanbusiness",
        text: "ZenYourLife - The Tesla of wellness services. A brief session with their expert nearly doubled my relaxation. Just imagine what their platform can do for you! The future is bright. ☀",
        photo: "profile1.png",
        displayOrder: 2
      },
      {
        name: "Piero Madu",
        role: "@pieromadu",
        text: "@ZenYourLife has revolutionized my self-care routine. Utilizing their services is essential for maintaining balance and navigating the stresses of daily life! ⚡",
        photo: "profile3.png",
        displayOrder: 3
      },
      {
        name: "George Klein",
        role: "@GeorgeBlue94",
        text: "ZenYourLife is the culmination of wellness expertise and contributions from many professionals. Self-care is here to stay. ZenYourLife is the future of wellness! 💎",
        photo: "profile4.png",
        displayOrder: 4
      },
      {
        name: "Jordan Welch",
        role: "@jrdn.w",
        text: "I was part of the beta launch... absolutely mind-blowing. Managing my wellness appointments has never been easier. @ZenYourLife is by far my go-to platform",
        photo: "profile2.png",
        displayOrder: 5
      },
      {
        name: "Faiz W",
        role: "@Faiz",
        text: "Incredible! @ZenYourLife elevates your wellness game. My stress levels dropped significantly in no time! 😱",
        photo: "profile3.png",
        displayOrder: 6
      },
      {
        name: "Sarah Miller",
        role: "@sarahm",
        text: "The best decision I made this year was joining ZenYourLife. Their massage therapists are world-class and the booking system is so smooth! 🤘🏻",
        photo: "profile1.png",
        displayOrder: 7
      }
    ];

    await Testimonial.insertMany(defaultTestimonials);

    res.status(201).json({
      success: true,
      message: `Seeded ${defaultTestimonials.length} testimonials`,
      count: defaultTestimonials.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding testimonials',
      error: error.message
    });
  }
};
