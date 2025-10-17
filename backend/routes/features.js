/**
 * Feature Flag Routes
 * 
 * New endpoints for querying feature availability
 */

const express = require('express');
const router = express.Router();
const featureFlagController = require('../controllers/featureFlagController');

// Get all enabled features accessible to user
router.get('/', featureFlagController.getFeatures);

// Get all features (including disabled - admin only)
router.get('/all', featureFlagController.getAllFeatures);

// Get features by tier
router.get('/tier/:tier', featureFlagController.getFeaturesByTier);

// Get tiers information
router.get('/tiers', featureFlagController.getTiers);

// Check feature access for current user
router.get('/check/:featureName', featureFlagController.checkFeatureAccess);

// Get feature details
router.get('/:featureName', featureFlagController.getFeatureDetails);

module.exports = router;
