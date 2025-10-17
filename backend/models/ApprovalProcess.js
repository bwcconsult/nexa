const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApprovalProcess = sequelize.define('ApprovalProcess', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  process_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  module_name: {
    type: DataTypes.ENUM('deals', 'quotes', 'orders', 'invoices', 'expenses', 'discounts', 'custom'),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  approval_steps: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of approval steps with order, approver, conditions',
  },
  trigger_conditions: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Conditions that trigger this approval process',
  },
  approval_type: {
    type: DataTypes.ENUM('sequential', 'parallel', 'any_one'),
    defaultValue: 'sequential',
  },
  auto_approve_if: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Conditions for auto-approval',
  },
  rejection_action: {
    type: DataTypes.ENUM('return_to_submitter', 'reject_permanently', 'return_to_previous_step'),
    defaultValue: 'return_to_submitter',
  },
  email_notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  reminder_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  reminder_frequency_hours: {
    type: DataTypes.INTEGER,
    defaultValue: 24,
  },
  execution_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  approval_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    comment: 'Percentage of approvals vs rejections',
  },
  avg_approval_time_hours: {
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
  tableName: 'approval_processes',
  indexes: [
    { fields: ['module_name'] },
    { fields: ['is_active'] },
    { fields: ['created_by'] },
  ],
});

module.exports = ApprovalProcess;
