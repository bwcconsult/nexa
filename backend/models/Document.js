const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_type: {
    type: DataTypes.STRING,
  },
  file_size: {
    type: DataTypes.INTEGER,
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  s3_key: {
    type: DataTypes.STRING,
  },
  folder: {
    type: DataTypes.STRING,
    defaultValue: 'documents',
  },
  uploaded_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  related_to_type: {
    type: DataTypes.ENUM('lead', 'contact', 'account', 'deal', 'ticket', 'general'),
  },
  related_to_id: {
    type: DataTypes.UUID,
  },
  description: {
    type: DataTypes.TEXT,
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'documents',
  indexes: [
    { fields: ['uploaded_by'] },
    { fields: ['related_to_type', 'related_to_id'] },
    { fields: ['folder'] },
  ],
});

module.exports = Document;
