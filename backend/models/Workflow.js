const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Workflow = sequelize.define('Workflow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  trigger_type: {
    type: DataTypes.ENUM('manual', 'scheduled', 'event', 'webhook'),
    defaultValue: 'manual',
  },
  trigger_config: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  actions: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  conditions: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'draft'),
    defaultValue: 'draft',
  },
  execution_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_executed_at: {
    type: DataTypes.DATE,
  },
  created_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'workflows',
  indexes: [
    { fields: ['status'] },
    { fields: ['trigger_type'] },
  ],
});

module.exports = Workflow;
