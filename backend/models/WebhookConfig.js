const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WebhookConfig = sequelize.define('WebhookConfig', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  webhook_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  webhook_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  method: {
    type: DataTypes.ENUM('POST', 'PUT', 'PATCH', 'GET'),
    defaultValue: 'POST',
  },
  module_name: {
    type: DataTypes.ENUM('leads', 'contacts', 'deals', 'accounts', 'tasks', 'orders', 'products', 'tickets', 'all'),
    allowNull: false,
  },
  trigger_events: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of events: create, update, delete, status_change',
  },
  headers: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Custom headers for webhook request',
  },
  payload_template: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Custom payload structure',
  },
  authentication_type: {
    type: DataTypes.ENUM('none', 'basic', 'bearer', 'api_key', 'oauth'),
    defaultValue: 'none',
  },
  authentication_config: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Auth credentials (encrypted)',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  retry_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  max_retries: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
  },
  timeout_seconds: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
  conditions: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Conditional webhook firing',
  },
  execution_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  success_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  failure_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_executed_at: {
    type: DataTypes.DATE,
  },
  last_status: {
    type: DataTypes.STRING,
  },
  last_response: {
    type: DataTypes.TEXT,
  },
  created_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'webhook_configs',
  indexes: [
    { fields: ['module_name'] },
    { fields: ['is_active'] },
    { fields: ['created_by'] },
  ],
});

module.exports = WebhookConfig;
