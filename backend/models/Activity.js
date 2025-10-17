const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  activity_type: {
    type: DataTypes.ENUM('email', 'call', 'meeting', 'task', 'note', 'deal_update', 'status_change', 'other'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
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
  tableName: 'activities',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['activity_type'] },
    { fields: ['created_at'] },
  ],
});

module.exports = Activity;
