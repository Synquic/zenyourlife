/**
 * Script to update Casa Artevista property with professional overview and highlights
 * Run this with: node scripts/updateCasaArtevistaOverview.js
 */

const mongoose = require('mongoose');
require('dotenv').config();
const { Property } = require('../models/Property');

const casaArtevistaOverview = {
  title: 'Casa Artevista - Your Lanzarote Sanctuary',
  description1: "Nestled in the tranquil village of Tabayesco, Casa Artevista offers an authentic Lanzarote experience where traditional Canarian architecture meets modern comfort. This beautifully designed villa provides stunning panoramic views of the volcanic landscape, creating a serene retreat away from the bustling tourist areas while remaining conveniently accessible to the island's attractions.",
  description2: "The property features spacious interiors with natural light flooding through large windows, showcasing the dramatic Lanzarote scenery. Whether you're seeking a peaceful escape, a base for exploring the island's natural wonders, or a comfortable home for your family vacation, Casa Artevista delivers an unforgettable stay with its blend of authentic charm and contemporary amenities.",
  highlights: [
    'Stunning panoramic views of Lanzarote\'s volcanic landscape',
    'Traditional Canarian architecture with modern amenities',
    'Peaceful location in authentic Tabayesco village',
    'Fully equipped modern kitchen with quality appliances',
    'Spacious outdoor terrace perfect for al fresco dining',
    'High-speed Wi-Fi throughout the property',
    'Private parking on-site',
    'Walking distance to local restaurants and shops',
    'Air conditioning and heating for year-round comfort',
    'Weekly cleaning service included for extended stays'
  ],
  features: []
};

async function updateCasaArtevista() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find Casa Artevista property (update the filter based on your property name)
    // You might need to update this filter to match your exact property name
    const property = await Property.findOne({
      name: { $regex: /artevista/i }
    });

    if (!property) {
      console.log('⚠️  Casa Artevista property not found. Available properties:');
      const allProperties = await Property.find({}, 'name');
      allProperties.forEach(p => console.log(`   - ${p.name} (ID: ${p._id})`));
      console.log('\n💡 Please update the property manually using the property ID above');
      process.exit(0);
    }

    console.log(`📝 Found property: ${property.name} (ID: ${property._id})`);

    // Update the property with new overview
    property.overview = casaArtevistaOverview;
    await property.save();

    console.log('✅ Casa Artevista overview updated successfully!');
    console.log('\nUpdated content:');
    console.log(`Title: ${casaArtevistaOverview.title}`);
    console.log(`Highlights: ${casaArtevistaOverview.highlights.length} items`);
    console.log('\nHighlights:');
    casaArtevistaOverview.highlights.forEach((h, i) => {
      console.log(`  ${i + 1}. ${h}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating Casa Artevista:', error);
    process.exit(1);
  }
}

updateCasaArtevista();
