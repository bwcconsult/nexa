const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Blueprint = sequelize.define('Blueprint', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  blueprint_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  module_name: {
    type: DataTypes.ENUM('leads', 'deals', 'contacts', 'accounts', 'projects', 'tickets', 'custom'),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  stages: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of stages with order, name, required fields',
  },
  transitions: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of allowed transitions between stages',
  },
  stage_actions: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Actions to execute when entering/exiting stages',
  },
  required_fields_per_stage: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Which fields are required at each stage',
  },
  field_updates_per_stage: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Auto-update fields when stage changes',
  },
  validation_rules_per_stage: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Validation rules for each stage',
  },
  transition_criteria: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Conditions that must be met to move to next stage',
  },
  webhooks_per_stage: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Webhooks to trigger at each stage',
  },
  notifications_per_stage: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Who to notify at each stage',
  },
  sla_per_stage: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'SLA timings for each stage',
  },
  canvas_layout: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Visual layout for blueprint designer',
  },
  execution_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  success_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  avg_completion_days: {
    type: DataTypes.DECIMAL(10, 2),
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
  tableName: 'blueprints',
  indexes: [
    { fields: ['module_name'] },
    { fields: ['is_active'] },
    { fields: ['created_by'] },
  ],
});

module.exports = Blueprint;
