/**
 * Contact List Model
 * 
 * Saved contact segments/lists (static and dynamic)
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ContactList = sequelize.define('ContactList', {
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
  list_type: {
    type: DataTypes.ENUM('static', 'dynamic'),
    allowNull: false,
    defaultValue: 'static',
    comment: 'Static = manual, Dynamic = auto-updated based on criteria'
  },
  criteria: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Filter criteria for dynamic lists'
  },
  contact_ids: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
    comment: 'Contact IDs for static lists'
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#3B82F6',
    comment: 'UI color for the list'
  },
  icon: {
    type: DataTypes.STRING,
    comment: 'Lucide icon name'
  },
  is_favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_shared: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Shared with team'
  },
  created_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  contact_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Cached count for performance'
  },
  last_updated_count: {
    type: DataTypes.DATE,
    comment: 'When count was last calculated'
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
}, {
  tableName: 'contact_lists',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['created_by']
    },
    {
      fields: ['list_type']
    },
    {
      fields: ['is_favorite']
    }
  ]
});

module.exports = ContactList;
