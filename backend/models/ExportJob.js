/**
 * Export Job Model
 * 
 * Track data export operations
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ExportJob = sequelize.define('ExportJob', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  entity_type: {
    type: DataTypes.ENUM('leads', 'contacts', 'accounts', 'deals', 'products', 'tasks', 'all'),
    allowNull: false,
  },
  export_format: {
    type: DataTypes.ENUM('csv', 'excel', 'json'),
    defaultValue: 'csv',
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_url: {
    type: DataTypes.STRING,
    comment: 'S3 URL or download link'
  },
  file_size: {
    type: DataTypes.INTEGER,
    comment: 'File size in bytes'
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'expired'),
    defaultValue: 'pending',
  },
  filters: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Filters applied to export'
  },
  selected_fields: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'Which fields to include in export'
  },
  total_records: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  expires_at: {
    type: DataTypes.DATE,
    comment: 'When download link expires'
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
  tableName: 'export_jobs',
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

module.exports = ExportJob;
