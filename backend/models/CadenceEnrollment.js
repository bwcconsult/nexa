const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CadenceEnrollment = sequelize.define('CadenceEnrollment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cadence_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'sales_cadences',
      key: 'id',
    },
  },
  record_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'ID of the enrolled record',
  },
  record_type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type of record (leads, contacts, etc.)',
  },
  enrolled_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  assigned_to: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'User responsible for executing this cadence',
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'completed', 'exited', 'failed'),
    defaultValue: 'active',
  },
  current_step: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  total_steps: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  steps_completed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  step_history: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of completed steps with timestamps',
  },
  next_action_date: {
    type: DataTypes.DATE,
  },
  next_action_type: {
    type: DataTypes.STRING,
  },
  enrolled_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  completed_at: {
    type: DataTypes.DATE,
  },
  exit_reason: {
    type: DataTypes.STRING,
  },
  outcome: {
    type: DataTypes.ENUM('converted', 'not_interested', 'no_response', 'other'),
  },
}, {
  tableName: 'cadence_enrollments',
  indexes: [
    { fields: ['cadence_id'] },
    { fields: ['record_id', 'record_type'] },
    { fields: ['assigned_to'] },
    { fields: ['status'] },
    { fields: ['next_action_date'] },
  ],
});

module.exports = CadenceEnrollment;
