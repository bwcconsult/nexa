const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApprovalRequest = sequelize.define('ApprovalRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  approval_process_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'approval_processes',
      key: 'id',
    },
  },
  record_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'ID of the record being approved (deal, quote, etc.)',
  },
  record_type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type of record (deals, quotes, etc.)',
  },
  requested_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  current_step: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  total_steps: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled', 'in_progress'),
    defaultValue: 'pending',
  },
  approval_history: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of all approval/rejection actions',
  },
  current_approvers: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'User IDs who need to approve at current step',
  },
  request_details: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Details about what is being approved',
  },
  rejection_reason: {
    type: DataTypes.TEXT,
  },
  final_decision_at: {
    type: DataTypes.DATE,
  },
  final_decision_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'approval_requests',
  indexes: [
    { fields: ['approval_process_id'] },
    { fields: ['record_id', 'record_type'] },
    { fields: ['requested_by'] },
    { fields: ['status'] },
  ],
});

module.exports = ApprovalRequest;
