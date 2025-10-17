/**
 * Feature Flag Controller
 * 
 * API endpoints for frontend to query available features
 */

const {
  getEnabledFeatures,
  getAllFeatures,
  getFeaturesByTier,
  hasFeatureAccess,
  getFeature,
  TIERS
} = require('../config/features');

/**
 * Get all enabled features
 * GET /api/v1/features
 */
exports.getFeatures = async (req, res) => {
  try {
    const userTier = req.user?.tier || TIERS.FREE;
    const features = getEnabledFeatures();
    
    // Filter by user tier access
    const accessibleFeatures = features.filter(feature => 
      hasFeatureAccess(feature.name, userTier)
    );
    
    res.json({
      features: accessibleFeatures,
      userTier: userTier,
      total: accessibleFeatures.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all features (including disabled - admin only)
 * GET /api/v1/features/all
 */
exports.getAllFeatures = async (req, res) => {
  try {
    // TODO: Add admin check
    const features = getAllFeatures();
    
    res.json({
      features: features,
      total: features.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get features by tier
 * GET /api/v1/features/tier/:tier
 */
exports.getFeaturesByTier = async (req, res) => {
  try {
    const { tier } = req.params;
    
    if (!Object.values(TIERS).includes(tier)) {
      return res.status(400).json({
        message: 'Invalid tier',
        validTiers: Object.values(TIERS)
      });
    }
    
    const features = getFeaturesByTier(tier);
    
    res.json({
      tier: tier,
      features: features,
      total: features.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Check if user has access to a specific feature
 * GET /api/v1/features/check/:featureName
 */
exports.checkFeatureAccess = async (req, res) => {
  try {
    const { featureName } = req.params;
    const userTier = req.user?.tier || TIERS.FREE;
    
    const feature = getFeature(featureName);
    
    if (!feature) {
      return res.status(404).json({
        message: 'Feature not found',
        feature: featureName
      });
    }
    
    const hasAccess = hasFeatureAccess(featureName, userTier);
    
    res.json({
      feature: featureName,
      hasAccess: hasAccess,
      enabled: feature.enabled,
      userTier: userTier,
      requiredTier: feature.tier,
      description: feature.description
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get feature details
 * GET /api/v1/features/:featureName
 */
exports.getFeatureDetails = async (req, res) => {
  try {
    const { featureName } = req.params;
    const feature = getFeature(featureName);
    
    if (!feature) {
      return res.status(404).json({
        message: 'Feature not found',
        feature: featureName
      });
    }
    
    const userTier = req.user?.tier || TIERS.FREE;
    const hasAccess = hasFeatureAccess(featureName, userTier);
    
    res.json({
      name: featureName,
      ...feature,
      hasAccess: hasAccess,
      userTier: userTier
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get tiers information
 * GET /api/v1/features/tiers
 */
exports.getTiers = async (req, res) => {
  try {
    const tiers = Object.values(TIERS);
    const tierFeatures = {};
    
    tiers.forEach(tier => {
      tierFeatures[tier] = getFeaturesByTier(tier);
    });
    
    res.json({
      tiers: tiers,
      features: tierFeatures
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
