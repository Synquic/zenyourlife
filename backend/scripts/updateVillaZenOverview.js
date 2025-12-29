/**
 * Script to update Villa Zen Your Life property with professional overview and highlights
 * Run this with: node scripts/updateVillaZenOverview.js
 */

const mongoose = require('mongoose');
require('dotenv').config();
const { Property } = require('../models/Property');

const villaZenOverview = {
  title: 'Villa Zen Your Life - Modern Luxury in Paradise',
  description1: "Discover the perfect blend of contemporary design and Canarian charm at Villa Zen Your Life. This stunning villa offers a peaceful sanctuary where modern luxury meets the raw beauty of Lanzarote's volcanic landscape. With spacious interiors, premium amenities, and breathtaking views, this property is designed for those seeking an unforgettable island escape.",
  description2: "Whether you're planning a romantic getaway, a family vacation, or a retreat with friends, Villa Zen Your Life provides the ideal setting. Enjoy the tranquility of your private outdoor space, explore nearby beaches and attractions, or simply relax and embrace the laid-back Lanzarote lifestyle. Every detail has been thoughtfully curated to ensure your stay is nothing short of exceptional.",
  highlights: [
    'Modern villa with stunning volcanic landscape views',
    'Spacious private terrace ideal for outdoor living',
    'Contemporary design with traditional Canarian touches',
    'Fully equipped modern kitchen with premium appliances',
    'High-speed Wi-Fi throughout the property',
    'Air conditioning and heating in all rooms',
    'Private parking on-site',
    'Close proximity to beaches and local attractions',
    'Premium linens and towels provided',
    'Perfect for families, couples, or groups'
  ],
  features: []
};

async function updateVillaZen() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find Villa Zen Your Life property
    const property = await Property.findOne({
      name: { $regex: /zen.*life/i }
    });

    if (!property) {
      console.log('⚠️  Villa Zen Your Life property not found. Available properties:');
      const allProperties = await Property.find({}, 'name');
      allProperties.forEach(p => console.log(`   - ${p.name} (ID: ${p._id})`));
      console.log('\n💡 Please update the property manually using the property ID above');
      process.exit(0);
    }

    console.log(`📝 Found property: ${property.name} (ID: ${property._id})`);

    // Update the property with new overview
    property.overview = villaZenOverview;
    await property.save();

    console.log('✅ Villa Zen Your Life overview updated successfully!');
    console.log('\nUpdated content:');
    console.log(`Title: ${villaZenOverview.title}`);
    console.log(`Highlights: ${villaZenOverview.highlights.length} items`);
    console.log('\nHighlights:');
    villaZenOverview.highlights.forEach((h, i) => {
      console.log(`  ${i + 1}. ${h}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating Villa Zen Your Life:', error);
    process.exit(1);
  }
}

updateVillaZen();
