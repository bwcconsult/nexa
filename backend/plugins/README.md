# Nexa CRM Plugin System

## Overview

The Nexa CRM plugin system allows you to extend the platform with custom functionality without modifying core code.

## Plugin Structure

```
plugins/
├── @nexa/
│   ├── healthcare-compliance/
│   ├── real-estate-mls/
│   └── saas-analytics/
└── third-party/
    ├── vendor-plugin-1/
    └── vendor-plugin-2/
```

## Creating a Plugin

### Basic Plugin Structure

```javascript
// plugins/@nexa/example-plugin/index.js
module.exports = {
  name: 'example-plugin',
  version: '1.0.0',
  description: 'Example plugin for Nexa CRM',
  
  // Plugin metadata
  metadata: {
    author: 'Nexa Team',
    license: 'MIT',
    dependencies: ['workflows', 'webhooks']
  },
  
  // Initialize plugin
  async initialize(app, config) {
    console.log('Example plugin initialized');
  },
  
  // Register routes
  routes: (router) => {
    router.get('/example', (req, res) => {
      res.json({ message: 'Hello from plugin!' });
    });
    return router;
  },
  
  // Register models (optional)
  models: [],
  
  // Register middleware (optional)
  middleware: [],
  
  // Cleanup on unload
  async cleanup() {
    console.log('Example plugin cleaned up');
  }
};
```

### Plugin Manifest

```json
// plugins/@nexa/example-plugin/manifest.json
{
  "name": "example-plugin",
  "version": "1.0.0",
  "description": "Example plugin",
  "main": "index.js",
  "author": "Nexa Team",
  "license": "MIT",
  "dependencies": {
    "workflows": ">=1.0.0",
    "webhooks": ">=1.0.0"
  },
  "permissions": [
    "read:leads",
    "write:deals",
    "execute:workflows"
  ],
  "configuration": {
    "api_key": {
      "type": "string",
      "required": true,
      "description": "API key for external service"
    },
    "webhook_url": {
      "type": "string",
      "required": false,
      "description": "Webhook callback URL"
    }
  }
}
```

## Plugin Types

### 1. Integration Plugins
Connect Nexa CRM with external services (Stripe, Mailchimp, etc.)

### 2. Industry Plugins
Add industry-specific features (HIPAA compliance, MLS integration, etc.)

### 3. Feature Plugins
Extend core functionality (advanced reporting, AI features, etc.)

### 4. UI Plugins
Add custom pages or components to the frontend

## Plugin API

### Available Hooks

```javascript
// Database hooks
plugin.beforeCreate('Lead', async (lead) => { });
plugin.afterCreate('Lead', async (lead) => { });

// Workflow hooks
plugin.onWorkflowTrigger('deal_won', async (data) => { });

// Event hooks
plugin.on('user:login', async (user) => { });
plugin.on('deal:closed', async (deal) => { });
```

### API Access

```javascript
// Access Nexa CRM APIs from plugins
const { Lead, Deal } = plugin.getModels();
const leads = await Lead.findAll();

// Call services
const emailService = plugin.getService('email');
await emailService.send({ to, subject, body });
```

## Security

### Plugin Sandboxing
- Plugins run in isolated context
- Limited access to system resources
- Rate limiting on API calls
- Permission-based access control

### Verification
- Code signing required for marketplace plugins
- Security audit for official plugins
- Automated vulnerability scanning

## Installation

### Manual Installation
```bash
# Copy plugin to plugins directory
cp -r my-plugin plugins/@nexa/my-plugin

# Install dependencies
cd plugins/@nexa/my-plugin
npm install

# Enable plugin
node scripts/enable-plugin.js my-plugin
```

### Via Marketplace (Coming Soon)
```bash
# Install from marketplace
nexa plugin install @nexa/healthcare-compliance

# Enable plugin
nexa plugin enable healthcare-compliance
```

## Configuration

### Plugin Config File
```javascript
// config/plugins.js
module.exports = {
  enabled: [
    'example-plugin',
    'healthcare-compliance'
  ],
  
  config: {
    'example-plugin': {
      api_key: process.env.EXAMPLE_API_KEY,
      webhook_url: 'https://example.com/webhook'
    }
  }
};
```

## Best Practices

1. **Keep plugins isolated** - Don't modify core files
2. **Use hooks** - Don't override core functionality
3. **Document well** - Include README and API docs
4. **Handle errors** - Graceful degradation if plugin fails
5. **Test thoroughly** - Unit and integration tests
6. **Follow conventions** - Use Nexa coding standards

## Examples

### Integration Plugin
```javascript
// plugins/@nexa/stripe-integration/index.js
module.exports = {
  name: 'stripe-integration',
  
  async initialize(app, config) {
    const stripe = require('stripe')(config.api_key);
    
    // Add Stripe payment route
    app.post('/api/v1/payments/stripe', async (req, res) => {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd'
      });
      res.json(paymentIntent);
    });
  }
};
```

### Industry Plugin
```javascript
// plugins/@nexa/healthcare-compliance/index.js
module.exports = {
  name: 'healthcare-compliance',
  
  async initialize(app, config) {
    // Add HIPAA audit logging
    app.use((req, res, next) => {
      if (req.path.includes('/patients')) {
        // Log access for compliance
        auditLog.create({
          user: req.user.id,
          action: req.method,
          resource: req.path,
          timestamp: new Date()
        });
      }
      next();
    });
  }
};
```

## Roadmap

- [x] Plugin architecture design
- [ ] Plugin loader implementation
- [ ] Plugin marketplace
- [ ] CLI tools for plugin management
- [ ] Plugin testing framework
- [ ] Plugin documentation generator
- [ ] Revenue sharing for third-party plugins

## Support

For plugin development support:
- Documentation: https://docs.nexacrm.com/plugins
- Developer Forum: https://community.nexacrm.com/plugins
- Email: plugins@nexacrm.com
