/**
 * Comprehensive Translation Verification Script
 * Checks all collections for missing translations in all languages
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Service = require('../models/Service');
const { Property } = require('../models/Property');
const FAQ = require('../models/FAQ');
const Testimonial = require('../models/Testimonial');
const RentalTestimonial = require('../models/RentalTestimonial');
const { RentalOverviewSettings } = require('../models/RentalPageSettings');

const LANGUAGES = ['fr', 'de', 'nl', 'es'];

async function verifyTranslations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    console.log('🔍 Verifying all translations across all collections...\n');
    console.log('━'.repeat(80));

    const collections = [
      {
        name: 'Services',
        model: Service,
        fields: ['title', 'description', 'benefits', 'targetAudience']
      },
      {
        name: 'Properties',
        model: Property,
        fields: ['name', 'description']
      },
      {
        name: 'FAQs',
        model: FAQ,
        fields: ['question', 'answer']
      },
      {
        name: 'Testimonials',
        model: Testimonial,
        fields: ['text', 'role']
      },
      {
        name: 'RentalTestimonials',
        model: RentalTestimonial,
        fields: ['text', 'role']
      },
      {
        name: 'RentalOverviewSettings',
        model: RentalOverviewSettings,
        fields: ['badge', 'title1', 'title2', 'description1', 'description2']
      }
    ];

    let totalIssues = 0;

    for (const collection of collections) {
      console.log(`\n📋 ${collection.name}:`);
      console.log('─'.repeat(80));

      const documents = await collection.model.find();
      console.log(`   Total documents: ${documents.length}`);

      if (documents.length === 0) {
        console.log('   ⚪ Empty collection\n');
        continue;
      }

      let collectionIssues = 0;

      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const docName = doc.title || doc.name || doc.question || doc.badge || `Document ${i + 1}`;

        let docHasIssues = false;
        let missingLangs = [];

        for (const lang of LANGUAGES) {
          if (!doc.translations || !doc.translations[lang]) {
            missingLangs.push(lang.toUpperCase());
            docHasIssues = true;
            continue;
          }

          const translation = doc.translations[lang];
          let missingFields = [];

          for (const field of collection.fields) {
            if (field === 'benefits' || field === 'targetAudience') {
              // Array fields
              if (!translation[field] || translation[field].length === 0) {
                missingFields.push(field);
              }
            } else {
              // String fields
              if (!translation[field] || translation[field].trim() === '') {
                missingFields.push(field);
              }
            }
          }

          if (missingFields.length > 0) {
            if (!docHasIssues) {
              console.log(`\n   ⚠️  "${docName.substring(0, 50)}${docName.length > 50 ? '...' : ''}"`);
              docHasIssues = true;
            }
            console.log(`      ${lang.toUpperCase()}: Missing fields: ${missingFields.join(', ')}`);
            collectionIssues++;
          }
        }

        if (missingLangs.length > 0) {
          if (!docHasIssues) {
            console.log(`\n   ⚠️  "${docName.substring(0, 50)}${docName.length > 50 ? '...' : ''}"`);
          }
          console.log(`      ❌ No translations object for: ${missingLangs.join(', ')}`);
          collectionIssues++;
        }
      }

      if (collectionIssues === 0) {
        console.log('   ✅ All documents have complete translations!');
      } else {
        console.log(`\n   📊 Issues found: ${collectionIssues}`);
        totalIssues += collectionIssues;
      }
    }

    console.log('\n' + '━'.repeat(80));
    console.log('📊 SUMMARY:');
    console.log('━'.repeat(80));

    if (totalIssues === 0) {
      console.log('✅ All collections have complete translations for all languages!');
      console.log('   Languages verified: EN, FR, DE, NL, ES');
    } else {
      console.log(`⚠️  Total issues found: ${totalIssues}`);
      console.log('   Some documents are missing translations or have incomplete fields.');
      console.log('   Review the details above to identify which records need attention.');
    }

    console.log('━'.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyTranslations();
