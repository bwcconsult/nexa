const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  campaign_type: {
    type: DataTypes.ENUM('email', 'social_media', 'sms', 'webinar', 'event', 'other'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'active', 'paused', 'completed'),
    defaultValue: 'draft',
  },
  start_date: {
    type: DataTypes.DATE,
  },
  end_date: {
    type: DataTypes.DATE,
  },
  budget: {
    type: DataTypes.DECIMAL(15, 2),
  },
  spent: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  target_audience: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  goals: {
    type: DataTypes.TEXT,
  },
  metrics: {
    type: DataTypes.JSONB,
    defaultValue: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      leads_generated: 0,
    },
  },
  content: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'campaigns',
  indexes: [
    { fields: ['status'] },
    { fields: ['campaign_type'] },
    { fields: ['start_date'] },
  ],
});

module.exports = Campaign;
