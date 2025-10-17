const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Territory = sequelize.define('Territory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  territory_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  territory_code: {
    type: DataTypes.STRING,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  territory_type: {
    type: DataTypes.ENUM('geographic', 'industry', 'account_size', 'product', 'custom'),
    defaultValue: 'geographic',
  },
  parent_territory_id: {
    type: DataTypes.UUID,
    references: {
      model: 'territories',
      key: 'id',
    },
  },
  manager_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  assigned_users: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of user IDs assigned to this territory',
  },
  geographic_data: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Countries, states, cities, zip codes',
  },
  industry_data: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Industry categories',
  },
  account_criteria: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Revenue range, employee count, etc.',
  },
  rules: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Assignment rules for this territory',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  revenue_target: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  revenue_achieved: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  accounts_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  leads_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  deals_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    defaultValue: 'Medium',
  },
  color_code: {
    type: DataTypes.STRING,
    defaultValue: '#3B82F6',
  },
  notes: {
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
  tableName: 'territories',
  indexes: [
    { fields: ['territory_code'] },
    { fields: ['manager_id'] },
    { fields: ['is_active'] },
    { fields: ['parent_territory_id'] },
  ],
});

module.exports = Territory;
