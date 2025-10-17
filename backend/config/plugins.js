/**
 * Plugin Configuration
 * 
 * Controls which plugins are enabled and their settings
 * This is the foundation for future plugin marketplace
 */

const PLUGIN_CONFIG = {
  // Enable/disable plugin system globally
  enabled: true,
  
  // Directory where plugins are located
  pluginDirectory: './plugins',
  
  // List of enabled plugins
  enabledPlugins: [
    // Official Nexa plugins (when available)
    // '@nexa/healthcare-compliance',
    // '@nexa/real-estate-mls',
    // '@nexa/saas-analytics',
    
    // Third-party plugins (when marketplace launches)
    // 'vendor/stripe-advanced',
    // 'vendor/mailchimp-sync'
  ],
  
  // Plugin-specific configurations
  config: {
    // Example configuration for when plugins are added
    // '@nexa/healthcare-compliance': {
    //   audit_retention_days: 2555, // 7 years for HIPAA
    //   encryption_enabled: true,
    //   auto_anonymize: false
    // }
  },
  
  // Plugin permissions (for security)
  permissions: {
    // Default permissions for all plugins
    default: [
      'read:public_data'
    ],
    
    // Specific plugin permissions (when needed)
    // '@nexa/healthcare-compliance': [
    //   'read:patients',
    //   'write:audit_logs',
    //   'execute:encryption'
    // ]
  },
  
  // Marketplace settings (future use)
  marketplace: {
    enabled: false,
    url: 'https://marketplace.nexacrm.com',
    auto_update: false,
    allow_third_party: false
  }
};

/**
 * Check if plugins system is enabled
 */
function isPluginSystemEnabled() {
  return PLUGIN_CONFIG.enabled;
}

/**
 * Get list of enabled plugins
 */
function getEnabledPlugins() {
  return PLUGIN_CONFIG.enabledPlugins;
}

/**
 * Check if a specific plugin is enabled
 */
function isPluginEnabled(pluginName) {
  return PLUGIN_CONFIG.enabledPlugins.includes(pluginName);
}

/**
 * Get plugin configuration
 */
function getPluginConfig(pluginName) {
  return PLUGIN_CONFIG.config[pluginName] || {};
}

/**
 * Get plugin permissions
 */
function getPluginPermissions(pluginName) {
  return PLUGIN_CONFIG.permissions[pluginName] || PLUGIN_CONFIG.permissions.default;
}

module.exports = {
  PLUGIN_CONFIG,
  isPluginSystemEnabled,
  getEnabledPlugins,
  isPluginEnabled,
  getPluginConfig,
  getPluginPermissions
};
