const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define('Task', {
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
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  due_date: {
    type: DataTypes.DATE,
  },
  completed_date: {
    type: DataTypes.DATE,
  },
  assigned_to: {
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
  reminder: {
    type: DataTypes.DATE,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'tasks',
  indexes: [
    { fields: ['status'] },
    { fields: ['assigned_to'] },
    { fields: ['due_date'] },
  ],
});

module.exports = Task;
