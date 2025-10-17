const { createController } = require('./genericController');
const { WebhookConfig } = require('../models');

const controller = createController(WebhookConfig, 'WebhookConfig', ['webhook_name', 'webhook_url', 'module_name', 'is_active']);

module.exports = controller;
