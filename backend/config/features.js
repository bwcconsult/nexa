/**
 * Feature Toggle System
 * 
 * Controls which features are enabled/disabled across the platform
 * No UI changes - just controls backend availability and menu visibility
 */

const TIERS = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
};

const FEATURE_FLAGS = {
  // Core CRM Features (Always enabled)
  leads: {
    enabled: true,
    tier: TIERS.FREE,
    description: 'Lead management',
    routes: ['/api/v1/leads']
  },
  contacts: {
    enabled: true,
    tier: TIERS.FREE,
    description: 'Contact management',
    routes: ['/api/v1/contacts']
  },
  accounts: {
    enabled: true,
    tier: TIERS.FREE,
    description: 'Account management',
    routes: ['/api/v1/accounts']
  },
  deals: {
    enabled: true,
    tier: TIERS.FREE,
    description: 'Deal pipeline management',
    routes: ['/api/v1/deals']
  },
  tasks: {
    enabled: true,
    tier: TIERS.FREE,
    description: 'Task management',
    routes: ['/api/v1/tasks']
  },
  meetings: {
    enabled: true,
    tier: TIERS.FREE,
    description: 'Meeting scheduling',
    routes: ['/api/v1/meetings']
  },
  calls: {
    enabled: true,
    tier: TIERS.FREE,
    description: 'Call logging',
    routes: ['/api/v1/calls']
  },
  
  // Advanced Features
  workflows: {
    enabled: true,
    tier: TIERS.PRO,
    description: 'Workflow automation',
    routes: ['/api/v1/workflows'],
    dependencies: []
  },
  mass_email: {
    enabled: true,
    tier: TIERS.PRO,
    description: 'Mass email campaigns',
    routes: ['/api/v1/mass-emails'],
    dependencies: []
  },
  assignment_rules: {
    enabled: true,
    tier: TIERS.PRO,
    description: 'Automated assignment rules',
    routes: ['/api/v1/assignment-rules'],
    dependencies: []
  },
  validation_rules: {
    enabled: true,
    tier: TIERS.PRO,
    description: 'Data validation rules',
    routes: ['/api/v1/validation-rules'],
    dependencies: []
  },
  webhooks: {
    enabled: true,
    tier: TIERS.PRO,
    description: 'Webhook configurations',
    routes: ['/api/v1/webhook-configs', '/api/v1/webhooks'],
    dependencies: []
  },
  territories: {
    enabled: true,
    tier: TIERS.PRO,
    description: 'Territory management',
    routes: ['/api/v1/territories'],
    dependencies: []
  },
  
  // Enterprise Features
  approval_processes: {
    enabled: true,
    tier: TIERS.ENTERPRISE,
    description: 'Multi-step approval processes',
    routes: ['/api/v1/approval-processes', '/api/v1/approval-requests'],
    dependencies: []
  },
  sales_cadences: {
    enabled: true,
    tier: TIERS.ENTERPRISE,
    description: 'Sales cadence automation',
    routes: ['/api/v1/sales-cadences', '/api/v1/cadence-enrollments'],
    dependencies: []
  },
  cpq: {
    enabled: true,
    tier: TIERS.ENTERPRISE,
    description: 'Configure Price Quote',
    routes: ['/api/v1/cpq-configurations'],
    dependencies: ['products', 'quotes']
  },
  blueprints: {
    enabled: true,
    tier: TIERS.ENTERPRISE,
    description: 'Visual process builder',
    routes: ['/api/v1/blueprints'],
    dependencies: []
  },
  custom_functions: {
    enabled: true,
    tier: TIERS.ENTERPRISE,
    description: 'Custom serverless functions',
    routes: ['/api/v1/custom-functions'],
    dependencies: []
  },
  client_portals: {
    enabled: true,
    tier: TIERS.ENTERPRISE,
    description: 'Customer self-service portals',
    routes: ['/api/v1/client-portals'],
    dependencies: ['accounts']
  },
  page_layouts: {
    enabled: true,
    tier: TIERS.PRO,
    description: 'Custom page layouts',
    routes: ['/api/v1/page-layouts'],
    dependencies: []
  },
  kiosk_mode: {
    enabled: true,
    tier: TIERS.PRO,
    description: 'Kiosk mode for events',
    routes: ['/api/v1/kiosk-modes'],
    dependencies: []
  },
  
  // Industry & Customization
  industry_templates: {
    enabled: true,
    tier: TIERS.FREE,
    description: 'Industry-specific templates',
    routes: ['/api/v1/industry-templates'],
    dependencies: []
  },
  
  // Coming Soon (Disabled by default)
  ai_assistant: {
    enabled: false,
    tier: TIERS.PRO,
    description: 'AI-powered assistant',
    routes: ['/api/v1/ai'],
    dependencies: [],
    coming_soon: true,
    release_date: 'Q1 2026'
  },
  video_calls: {
    enabled: false,
    tier: TIERS.PRO,
    description: 'Built-in video conferencing',
    routes: ['/api/v1/video'],
    dependencies: [],
    coming_soon: true,
    release_date: 'Q1 2026'
  },
  mobile_app: {
    enabled: false,
    tier: TIERS.FREE,
    description: 'Native mobile applications',
    routes: [],
    dependencies: [],
    coming_soon: true,
    release_date: 'Q2 2026'
  },
  plugin_marketplace: {
    enabled: false,
    tier: TIERS.PRO,
    description: 'Third-party plugin marketplace',
    routes: ['/api/v1/plugins'],
    dependencies: [],
    coming_soon: true,
    release_date: 'Q2 2026'
  }
};

/**
 * Check if a feature is enabled
 */
function isFeatureEnabled(featureName) {
  const feature = FEATURE_FLAGS[featureName];
  return feature && feature.enabled === true;
}

/**
 * Get all enabled features
 */
function getEnabledFeatures() {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, feature]) => feature.enabled)
    .map(([name, feature]) => ({
      name,
      ...feature
    }));
}

/**
 * Get features by tier
 */
function getFeaturesByTier(tier) {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, feature]) => feature.tier === tier && feature.enabled)
    .map(([name, feature]) => ({
      name,
      ...feature
    }));
}

/**
 * Check if user has access to feature based on tier
 */
function hasFeatureAccess(featureName, userTier) {
  const feature = FEATURE_FLAGS[featureName];
  if (!feature || !feature.enabled) return false;
  
  const tierHierarchy = {
    [TIERS.FREE]: 0,
    [TIERS.STARTER]: 1,
    [TIERS.PRO]: 2,
    [TIERS.ENTERPRISE]: 3
  };
  
  return tierHierarchy[userTier] >= tierHierarchy[feature.tier];
}

/**
 * Get feature configuration
 */
function getFeature(featureName) {
  return FEATURE_FLAGS[featureName] || null;
}

/**
 * Get all features (including disabled ones)
 */
function getAllFeatures() {
  return Object.entries(FEATURE_FLAGS).map(([name, feature]) => ({
    name,
    ...feature
  }));
}

module.exports = {
  TIERS,
  FEATURE_FLAGS,
  isFeatureEnabled,
  getEnabledFeatures,
  getFeaturesByTier,
  hasFeatureAccess,
  getFeature,
  getAllFeatures
};
