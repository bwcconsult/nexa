const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LinkAnalytics = sequelize.define('LinkAnalytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  short_code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  original_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  campaign_id: {
    type: DataTypes.UUID,
    references: {
      model: 'campaigns',
      key: 'id',
    },
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  unique_clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_clicked_at: {
    type: DataTypes.DATE,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  click_data: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'expired'),
    defaultValue: 'active',
  },
  expires_at: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'link_analytics',
  indexes: [
    { fields: ['short_code'] },
    { fields: ['campaign_id'] },
  ],
});

module.exports = LinkAnalytics;
