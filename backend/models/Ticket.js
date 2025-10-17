const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ticket_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.UUID,
    references: {
      model: 'customers',
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
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'pending', 'resolved', 'closed'),
    defaultValue: 'open',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  category: {
    type: DataTypes.STRING,
  },
  source: {
    type: DataTypes.ENUM('email', 'phone', 'chat', 'web', 'social_media'),
    defaultValue: 'web',
  },
  resolution: {
    type: DataTypes.TEXT,
  },
  resolved_date: {
    type: DataTypes.DATE,
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
}, {
  tableName: 'tickets',
  indexes: [
    { fields: ['ticket_number'] },
    { fields: ['customer_id'] },
    { fields: ['assigned_to'] },
    { fields: ['status'] },
    { fields: ['priority'] },
  ],
});

module.exports = Ticket;
