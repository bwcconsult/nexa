const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SalesCadence = sequelize.define('SalesCadence', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cadence_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  target_module: {
    type: DataTypes.ENUM('leads', 'contacts', 'deals', 'accounts'),
    defaultValue: 'leads',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  steps: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of cadence steps with day, action type, template',
  },
  total_duration_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  auto_enroll_conditions: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Conditions to automatically enroll records',
  },
  exit_conditions: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Conditions to automatically exit cadence',
  },
  skip_weekends: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  skip_holidays: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  working_hours_start: {
    type: DataTypes.TIME,
    defaultValue: '09:00:00',
  },
  working_hours_end: {
    type: DataTypes.TIME,
    defaultValue: '17:00:00',
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'UTC',
  },
  enrolled_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  completed_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  success_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Records that converted/won',
  },
  avg_completion_days: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  success_rate: {
    type: DataTypes.DECIMAL(5, 2),
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
  tableName: 'sales_cadences',
  indexes: [
    { fields: ['target_module'] },
    { fields: ['is_active'] },
    { fields: ['created_by'] },
  ],
});

module.exports = SalesCadence;
