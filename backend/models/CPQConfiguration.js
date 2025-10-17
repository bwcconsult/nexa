const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CPQConfiguration = sequelize.define('CPQConfiguration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  configuration_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  product_id: {
    type: DataTypes.UUID,
    references: {
      model: 'products',
      key: 'id',
    },
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  configuration_type: {
    type: DataTypes.ENUM('bundle', 'configurable', 'tiered_pricing', 'volume_discount'),
    defaultValue: 'bundle',
  },
  base_price: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  pricing_rules: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of pricing rules and calculations',
  },
  discount_rules: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of discount rules and conditions',
  },
  bundled_products: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of product IDs in bundle',
  },
  product_dependencies: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'If product X, then must include Y',
  },
  configurable_options: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of options customer can configure',
  },
  tiered_pricing: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Price tiers based on quantity',
  },
  min_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  max_quantity: {
    type: DataTypes.INTEGER,
  },
  requires_approval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  approval_threshold: {
    type: DataTypes.DECIMAL(15, 2),
    comment: 'Discount % or amount requiring approval',
  },
  usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  avg_deal_size: {
    type: DataTypes.DECIMAL(15, 2),
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
  tableName: 'cpq_configurations',
  indexes: [
    { fields: ['product_id'] },
    { fields: ['is_active'] },
    { fields: ['configuration_type'] },
  ],
});

module.exports = CPQConfiguration;
