/**
 * Feature Flag Middleware
 * 
 * Optional middleware to protect routes based on feature flags
 * This is additive - doesn't affect existing routes unless explicitly added
 */

const { isFeatureEnabled, hasFeatureAccess, getFeature } = require('../config/features');

/**
 * Middleware to check if a feature is enabled
 * Usage: router.get('/endpoint', requireFeature('feature_name'), controller)
 */
function requireFeature(featureName) {
  return (req, res, next) => {
    if (!isFeatureEnabled(featureName)) {
      return res.status(403).json({
        error: 'Feature not available',
        message: `The ${featureName} feature is currently disabled`,
        feature: featureName,
        enabled: false
      });
    }
    next();
  };
}

/**
 * Middleware to check if user has access to a feature based on their tier
 * Usage: router.get('/endpoint', requireFeatureAccess('feature_name'), controller)
 */
function requireFeatureAccess(featureName) {
  return (req, res, next) => {
    // Get user tier from request (assumes auth middleware sets req.user)
    const userTier = req.user?.tier || 'free';
    
    if (!hasFeatureAccess(featureName, userTier)) {
      const feature = getFeature(featureName);
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This feature requires ${feature?.tier} tier or higher`,
        feature: featureName,
        requiredTier: feature?.tier,
        userTier: userTier,
        upgrade_url: '/pricing'
      });
    }
    
    next();
  };
}

/**
 * Middleware to check both feature enabled and user access
 * Usage: router.get('/endpoint', checkFeature('feature_name'), controller)
 */
function checkFeature(featureName) {
  return (req, res, next) => {
    // Check if feature is enabled
    if (!isFeatureEnabled(featureName)) {
      return res.status(403).json({
        error: 'Feature not available',
        message: `The ${featureName} feature is currently disabled`,
        feature: featureName
      });
    }
    
    // Check user tier access
    const userTier = req.user?.tier || 'free';
    if (!hasFeatureAccess(featureName, userTier)) {
      const feature = getFeature(featureName);
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This feature requires ${feature?.tier} tier or higher`,
        feature: featureName,
        requiredTier: feature?.tier,
        userTier: userTier
      });
    }
    
    next();
  };
}

/**
 * Attach feature flags to response (useful for frontend)
 * Usage: app.use(attachFeatureFlags)
 */
function attachFeatureFlags(req, res, next) {
  const originalJson = res.json.bind(res);
  
  res.json = function(data) {
    // Don't add feature flags to error responses
    if (data && !data.error && req.query.include_features === 'true') {
      const { getEnabledFeatures } = require('../config/features');
      data._features = getEnabledFeatures().map(f => f.name);
    }
    return originalJson(data);
  };
  
  next();
}

module.exports = {
  requireFeature,
  requireFeatureAccess,
  checkFeature,
  attachFeatureFlags
};
