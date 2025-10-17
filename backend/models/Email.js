const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Email = sequelize.define('Email', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  from_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  to_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cc: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  bcc: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  html_body: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'sent', 'failed', 'bounced'),
    defaultValue: 'draft',
  },
  sent_at: {
    type: DataTypes.DATE,
  },
  scheduled_at: {
    type: DataTypes.DATE,
  },
  opened_at: {
    type: DataTypes.DATE,
  },
  clicked_at: {
    type: DataTypes.DATE,
  },
  opens_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  clicks_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  template_id: {
    type: DataTypes.STRING,
  },
  campaign_id: {
    type: DataTypes.UUID,
    references: {
      model: 'campaigns',
      key: 'id',
    },
  },
  related_to_type: {
    type: DataTypes.ENUM('lead', 'contact', 'account', 'deal'),
  },
  related_to_id: {
    type: DataTypes.UUID,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'emails',
  indexes: [
    { fields: ['to_email'] },
    { fields: ['status'] },
    { fields: ['sent_at'] },
    { fields: ['campaign_id'] },
  ],
});

module.exports = Email;
