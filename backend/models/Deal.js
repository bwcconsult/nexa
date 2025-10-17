const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Deal = sequelize.define('Deal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  deal_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  stage: {
    type: DataTypes.ENUM(
      'Qualification',
      'Needs Analysis',
      'Value Proposition',
      'Identify Decision Makers',
      'Proposal/Price Quote',
      'Negotiation/Review',
      'Closed Won',
      'Closed Lost',
      'On Hold'
    ),
    defaultValue: 'Qualification',
  },
  probability: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    validate: {
      min: 0,
      max: 100,
    },
  },
  expected_close_date: {
    type: DataTypes.DATE,
  },
  close_date: {
    type: DataTypes.DATE,
  },
  account_id: {
    type: DataTypes.UUID,
    references: {
      model: 'accounts',
      key: 'id',
    },
  },
  contact_id: {
    type: DataTypes.UUID,
    references: {
      model: 'contacts',
      key: 'id',
    },
  },
  assigned_to: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  lead_source: {
    type: DataTypes.ENUM('website', 'referral', 'social_media', 'email_campaign', 'event', 'cold_call', 'other'),
  },
  description: {
    type: DataTypes.TEXT,
  },
  next_step: {
    type: DataTypes.TEXT,
  },
  loss_reason: {
    type: DataTypes.STRING,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
  },
  custom_fields: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'deals',
  indexes: [
    { fields: ['stage'] },
    { fields: ['assigned_to'] },
    { fields: ['account_id'] },
    { fields: ['contact_id'] },
  ],
});

module.exports = Deal;
