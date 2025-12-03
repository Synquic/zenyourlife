const mongoose = require('mongoose');

const benefitItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  }
});

const targetAudienceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  }
});

const servicePageContentSchema = new mongoose.Schema({
  benefits: [benefitItemSchema],
  targetAudience: [targetAudienceItemSchema],
  benefitsTitle: {
    type: String,
    default: "Benefits You'll Feel"
  },
  targetAudienceTitle: {
    type: String,
    default: "Who It's For"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServicePageContent', servicePageContentSchema);
