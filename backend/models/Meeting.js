const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Meeting = sequelize.define('Meeting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
  },
  meeting_link: {
    type: DataTypes.STRING,
  },
  host_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
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
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no_show'),
    defaultValue: 'scheduled',
  },
  meeting_type: {
    type: DataTypes.ENUM('in_person', 'video_call', 'phone_call', 'other'),
    defaultValue: 'video_call',
  },
  attendees: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  notes: {
    type: DataTypes.TEXT,
  },
  outcome: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'meetings',
  indexes: [
    { fields: ['start_time'] },
    { fields: ['host_id'] },
    { fields: ['contact_id'] },
    { fields: ['status'] },
  ],
});

module.exports = Meeting;
