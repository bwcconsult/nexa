/**
 * AI Insight Model
 * 
 * Store AI-generated insights and recommendations
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AIInsight = sequelize.define('AIInsight', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  insight_type: {
    type: DataTypes.ENUM(
      'lead_score',
      'next_best_action',
      'anomaly_detection',
      'trend_prediction',
      'churn_risk',
      'upsell_opportunity',
      'email_suggestion',
      'meeting_suggestion'
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
    comment: 'ID of the entity this insight relates to'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Short title of the insight'
  },
  description: {
    type: DataTypes.TEXT,
    comment: 'Detailed explanation of the insight'
  },
  confidence_score: {
    type: DataTypes.FLOAT,
    validate: {
      min: 0,
      max: 1
    },
    comment: 'AI confidence level (0-1)'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  action_recommended: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Suggested actions to take'
  },
  data_used: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Data points used to generate this insight'
  },
  is_dismissed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dismissed_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  dismissed_at: {
    type: DataTypes.DATE,
  },
  acted_upon: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  outcome: {
    type: DataTypes.JSONB,
    comment: 'Result if action was taken'
  },
  expires_at: {
    type: DataTypes.DATE,
    comment: 'When this insight becomes irrelevant'
  },
}, {
  tableName: 'ai_insights',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['entity_type', 'entity_id']
    },
    {
      fields: ['insight_type']
    },
    {
      fields: ['is_dismissed']
    },
    {
      fields: ['priority']
    }
  ]
});

module.exports = AIInsight;
