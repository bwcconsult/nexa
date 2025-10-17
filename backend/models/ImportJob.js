/**
 * Import Job Model
 * 
 * Track data import operations
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ImportJob = sequelize.define('ImportJob', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  entity_type: {
    type: DataTypes.ENUM('leads', 'contacts', 'accounts', 'deals', 'products', 'tasks'),
    allowNull: false,
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_url: {
    type: DataTypes.STRING,
    comment: 'S3 URL or local path'
  },
  file_size: {
    type: DataTypes.INTEGER,
    comment: 'File size in bytes'
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending',
  },
  field_mapping: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'CSV column to CRM field mapping'
  },
  import_options: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Skip duplicates, update existing, etc.'
  },
  total_rows: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  processed_rows: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  successful_rows: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  failed_rows: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  skipped_rows: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  errors: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of error messages with row numbers'
  },
  started_at: {
    type: DataTypes.DATE,
  },
  completed_at: {
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
  tableName: 'import_jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['created_by']
    },
    {
      fields: ['status']
    },
    {
      fields: ['entity_type']
    }
  ]
});

module.exports = ImportJob;
