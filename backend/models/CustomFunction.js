const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CustomFunction = sequelize.define('CustomFunction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  function_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  display_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.ENUM('automation', 'integration', 'data_transformation', 'validation', 'notification', 'custom'),
    defaultValue: 'custom',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  trigger_type: {
    type: DataTypes.ENUM('manual', 'scheduled', 'event', 'webhook', 'button'),
    defaultValue: 'manual',
  },
  trigger_config: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Configuration for trigger (schedule, events, etc.)',
  },
  function_code: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'JavaScript code to execute',
  },
  input_parameters: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of input parameters with name, type, required',
  },
  output_type: {
    type: DataTypes.STRING,
    comment: 'Expected output type',
  },
  environment_variables: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Environment variables available to function',
  },
  timeout_seconds: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
  max_retries: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  last_execution_status: {
    type: DataTypes.STRING,
  },
  last_execution_result: {
    type: DataTypes.TEXT,
  },
  last_error_message: {
    type: DataTypes.TEXT,
  },
  avg_execution_time_ms: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'custom_functions',
  indexes: [
    { fields: ['function_name'] },
    { fields: ['is_active'] },
    { fields: ['trigger_type'] },
    { fields: ['category'] },
  ],
});

module.exports = CustomFunction;
