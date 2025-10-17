const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AssignmentRule = sequelize.define('AssignmentRule', {
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
    type: DataTypes.ENUM('leads', 'contacts', 'deals', 'accounts', 'tasks', 'tickets', 'visits'),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  conditions: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of condition objects with field, operator, value',
  },
  assignment_type: {
    type: DataTypes.ENUM('round_robin', 'load_balancing', 'territory', 'specific_user', 'team'),
    defaultValue: 'specific_user',
  },
  assigned_to_user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  assigned_to_team_id: {
    type: DataTypes.UUID,
  },
  territory_id: {
    type: DataTypes.UUID,
  },
  round_robin_users: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of user IDs for round-robin assignment',
  },
  current_round_robin_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  execution_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_executed_at: {
    type: DataTypes.DATE,
  },
  notify_assignee: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'assignment_rules',
  indexes: [
    { fields: ['module_name'] },
    { fields: ['is_active'] },
    { fields: ['priority'] },
  ],
});

module.exports = AssignmentRule;
