const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PageLayout = sequelize.define('PageLayout', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  layout_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  module_name: {
    type: DataTypes.ENUM('leads', 'contacts', 'deals', 'accounts', 'products', 'orders', 'quotes', 'tickets', 'tasks', 'custom'),
    allowNull: false,
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  assigned_to_roles: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of role IDs this layout applies to',
  },
  assigned_to_profiles: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of profile IDs',
  },
  assigned_to_users: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of specific user IDs',
  },
  sections: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of sections with fields, columns, order',
  },
  visible_fields: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of field names to show',
  },
  hidden_fields: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of field names to hide',
  },
  required_fields: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Fields that are required in this layout',
  },
  readonly_fields: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Fields that are read-only',
  },
  field_properties: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Custom properties per field (labels, placeholders, help text)',
  },
  conditional_visibility: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Show/hide fields based on conditions',
  },
  layout_type: {
    type: DataTypes.ENUM('standard', 'compact', 'detailed', 'custom'),
    defaultValue: 'standard',
  },
  column_count: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
    comment: 'Number of columns in form',
  },
  usage_count: {
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
  tableName: 'page_layouts',
  indexes: [
    { fields: ['module_name'] },
    { fields: ['is_default'] },
    { fields: ['is_active'] },
  ],
});

module.exports = PageLayout;
