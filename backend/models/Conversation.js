/**
 * Conversation Model
 * 
 * Shared inbox conversations/threads
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  channel: {
    type: DataTypes.ENUM('email', 'chat', 'sms', 'social', 'phone', 'form'),
    defaultValue: 'email',
  },
  status: {
    type: DataTypes.ENUM('open', 'pending', 'closed', 'spam'),
    defaultValue: 'open',
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal',
  },
  contact_id: {
    type: DataTypes.UUID,
    references: {
      model: 'contacts',
      key: 'id',
    },
  },
  lead_id: {
    type: DataTypes.UUID,
    references: {
      model: 'leads',
      key: 'id',
    },
  },
  account_id: {
    type: DataTypes.UUID,
    references: {
      model: 'accounts',
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
  team_id: {
    type: DataTypes.UUID,
    comment: 'Team inbox this belongs to'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  last_message_at: {
    type: DataTypes.DATE,
  },
  last_message_from: {
    type: DataTypes.STRING,
    comment: 'Name or email of last sender'
  },
  message_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Email headers, phone numbers, etc.'
  },
  closed_at: {
    type: DataTypes.DATE,
  },
  closed_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'conversations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['assigned_to']
    },
    {
      fields: ['contact_id']
    },
    {
      fields: ['channel']
    },
    {
      fields: ['is_read']
    }
  ]
});

module.exports = Conversation;
