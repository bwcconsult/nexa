const express = require('express');
const router = express.Router();
const industryTemplateController = require('../controllers/industryTemplateController');

// Get all industry templates
router.get('/', industryTemplateController.getAllIndustryTemplates);

// Get industry template by name
router.get('/name/:name', industryTemplateController.getIndustryTemplateByName);

// Get single industry template
router.get('/:id', industryTemplateController.getIndustryTemplateById);

// Create industry template
router.post('/', industryTemplateController.createIndustryTemplate);

// Update industry template
router.put('/:id', industryTemplateController.updateIndustryTemplate);

// Delete industry template
router.delete('/:id', industryTemplateController.deleteIndustryTemplate);

// Apply industry template
router.post('/:id/apply', industryTemplateController.applyIndustryTemplate);

module.exports = router;
