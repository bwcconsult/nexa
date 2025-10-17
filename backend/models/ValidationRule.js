const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ValidationRule = sequelize.define('ValidationRule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  rule_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  module_name: {
    type: DataTypes.ENUM('leads', 'contacts', 'deals', 'accounts', 'products', 'orders', 'quotes', 'tasks'),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  trigger_on: {
    type: DataTypes.ENUM('create', 'update', 'both'),
    defaultValue: 'both',
  },
  field_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  validation_type: {
    type: DataTypes.ENUM('required', 'unique', 'email', 'phone', 'url', 'number', 'date', 'regex', 'custom', 'range', 'length'),
    allowNull: false,
  },
  validation_config: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Configuration like regex pattern, min/max values, custom function',
  },
  error_message: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Validation failed',
  },
  conditions: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Optional conditions when this rule should apply',
  },
  execution_order: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  execution_count: {
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
  created_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'validation_rules',
  indexes: [
    { fields: ['module_name'] },
    { fields: ['is_active'] },
    { fields: ['field_name'] },
    { fields: ['execution_order'] },
  ],
});

module.exports = ValidationRule;
