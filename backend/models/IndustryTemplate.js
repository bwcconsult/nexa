const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const IndustryTemplate = sequelize.define('IndustryTemplate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  industry_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.ENUM(
      'technology',
      'financial_services',
      'healthcare',
      'real_estate',
      'professional_services',
      'manufacturing',
      'education',
      'retail',
      'hospitality',
      'non_profit',
      'automotive',
      'construction',
      'other'
    ),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  fit_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
    comment: 'Feature coverage percentage (0-100)',
  },
  icon: {
    type: DataTypes.STRING,
    comment: 'Lucide icon name',
  },
  color_scheme: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Primary and secondary colors for UI theming',
  },
  terminology: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Custom terminology mappings (e.g., Customer -> Patient)',
  },
  custom_fields: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Pre-configured custom fields for this industry',
  },
  workflow_templates: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Pre-built workflows specific to this industry',
  },
  dashboard_config: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Dashboard widget configuration',
  },
  pipeline_stages: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Recommended pipeline stages',
  },
  email_templates: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Pre-built email templates',
  },
  recommended_integrations: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Recommended third-party integrations',
  },
  compliance_features: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Compliance requirements (HIPAA, SOC2, etc.)',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  popularity_rank: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Order for displaying in selector',
  },
}, {
  tableName: 'industry_templates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = IndustryTemplate;
