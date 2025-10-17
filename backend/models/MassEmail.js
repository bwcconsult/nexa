const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MassEmail = sequelize.define('MassEmail', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  campaign_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email_body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  from_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  from_name: {
    type: DataTypes.STRING,
  },
  reply_to: {
    type: DataTypes.STRING,
  },
  target_module: {
    type: DataTypes.ENUM('leads', 'contacts', 'accounts', 'custom'),
    allowNull: false,
  },
  target_criteria: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  recipient_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  sent_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  opened_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  clicked_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  bounced_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  unsubscribed_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'sending', 'sent', 'failed'),
    defaultValue: 'draft',
  },
  scheduled_at: {
    type: DataTypes.DATE,
  },
  sent_at: {
    type: DataTypes.DATE,
  },
  template_id: {
    type: DataTypes.UUID,
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  tracking_enabled: {
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
  tableName: 'mass_emails',
  indexes: [
    { fields: ['status'] },
    { fields: ['target_module'] },
    { fields: ['created_by'] },
  ],
});

module.exports = MassEmail;
