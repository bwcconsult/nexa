const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Call = sequelize.define('Call', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  call_type: {
    type: DataTypes.ENUM('inbound', 'outbound'),
    defaultValue: 'outbound',
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'missed', 'cancelled'),
    defaultValue: 'scheduled',
  },
  start_time: {
    type: DataTypes.DATE,
  },
  duration: {
    type: DataTypes.INTEGER, // in seconds
  },
  phone_number: {
    type: DataTypes.STRING,
  },
  related_to_type: {
    type: DataTypes.ENUM('lead', 'contact', 'account'),
  },
  related_to_id: {
    type: DataTypes.UUID,
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  notes: {
    type: DataTypes.TEXT,
  },
  outcome: {
    type: DataTypes.STRING,
  },
  recording_url: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'calls',
  indexes: [
    { fields: ['status'] },
    { fields: ['user_id'] },
    { fields: ['start_time'] },
  ],
});

module.exports = Call;
