/**
 * AI Prediction Model
 * 
 * Track AI/ML predictions and their accuracy over time
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AIPrediction = sequelize.define('AIPrediction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  prediction_type: {
    type: DataTypes.ENUM(
      'lead_score',
      'conversion_probability',
      'churn_risk',
      'deal_value',
      'close_date',
      'next_action',
      'email_response_rate'
    ),
    allowNull: false,
  },
  entity_type: {
    type: DataTypes.ENUM('lead', 'contact', 'account', 'deal', 'conversation'),
    allowNull: false,
  },
  entity_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  predicted_value: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'The AI prediction (score, category, value, etc.)'
  },
  confidence: {
    type: DataTypes.FLOAT,
    validate: {
      min: 0,
      max: 1
    },
    comment: 'Model confidence (0-1)'
  },
  model_version: {
    type: DataTypes.STRING,
    comment: 'Version of the ML model used'
  },
  features_used: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Features/data used for prediction'
  },
  actual_value: {
    type: DataTypes.JSONB,
    comment: 'Actual outcome (for accuracy tracking)'
  },
  accuracy_score: {
    type: DataTypes.FLOAT,
    comment: 'How accurate was this prediction'
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verified_at: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'ai_predictions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['entity_type', 'entity_id']
    },
    {
      fields: ['prediction_type']
    },
    {
      fields: ['is_verified']
    }
  ]
});

module.exports = AIPrediction;
