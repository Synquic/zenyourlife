const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  assignUniqueImages,
  updateServiceImage,
  addAllServicesGalleryImages,
  addMassageGalleryImages,
  addFacialGalleryImages,
  updateServiceTranslations,
  bulkUpdateTranslations
} = require('../controllers/serviceController');

// Public routes
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Admin routes (you can add authentication middleware later)
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

// Image management routes
router.post('/assign-images', assignUniqueImages);
router.patch('/:id/image', updateServiceImage);
router.post('/add-all-gallery-images', addAllServicesGalleryImages);
router.post('/add-massage-gallery-images', addMassageGalleryImages);
router.post('/add-facial-gallery-images', addFacialGalleryImages);

// Translation management routes (for cost-efficient multi-language support)
router.patch('/:id/translations', updateServiceTranslations);
router.post('/bulk-translations', bulkUpdateTranslations);

module.exports = router;
