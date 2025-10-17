/**
 * Message Model
 * 
 * Individual messages within conversations
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  conversation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'conversations',
      key: 'id',
    },
  },
  direction: {
    type: DataTypes.ENUM('inbound', 'outbound'),
    allowNull: false,
  },
  from_email: {
    type: DataTypes.STRING,
  },
  from_name: {
    type: DataTypes.STRING,
  },
  to_emails: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  cc_emails: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  bcc_emails: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  subject: {
    type: DataTypes.STRING,
  },
  body_text: {
    type: DataTypes.TEXT,
    comment: 'Plain text body'
  },
  body_html: {
    type: DataTypes.TEXT,
    comment: 'HTML body'
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of attachment objects with url, name, size'
  },
  is_internal_note: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Internal team notes not sent to customer'
  },
  sent_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'User who sent the message (for outbound)'
  },
  read_by: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
    comment: 'Users who have read this message'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Email headers, message IDs, etc.'
  },
  sent_at: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['conversation_id']
    },
    {
      fields: ['sent_by']
    },
    {
      fields: ['direction']
    }
  ]
});

module.exports = Message;
