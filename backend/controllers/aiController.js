/**
 * AI Controller
 * 
 * Handle AI/ML endpoints
 */

const aiService = require('../services/aiService');
const { AIInsight, AIPrediction, Lead, Deal, Contact, Conversation, Message } = require('../models');
const { Op } = require('sequelize');

/**
 * Calculate lead score
 * POST /api/v1/ai/lead-score/:id
 */
exports.calculateLeadScore = async (req, res) => {
  try {
    const { id } = req.params;
    const score = await aiService.calculateLeadScore(id);
    
    res.json({
      lead_id: id,
      score,
      message: 'Lead score calculated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Generate email draft
 * POST /api/v1/ai/generate-email
 */
exports.generateEmailDraft = async (req, res) => {
  try {
    const { recipient, purpose, tone, previous_context } = req.body;
    
    const draft = await aiService.generateEmailDraft({
      recipient,
      purpose,
      tone,
      previous_context
    });
    
    res.json(draft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get next best action
 * GET /api/v1/ai/next-action/:entityType/:entityId
 */
exports.getNextBestAction = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    
    const action = await aiService.getNextBestAction(entityType, entityId);
    
    if (!action) {
      return res.status(404).json({ message: 'No recommendation available' });
    }
    
    res.json(action);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get AI insights for entity
 * GET /api/v1/ai/insights/:entityType/:entityId
 */
exports.getInsights = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { dismissed } = req.query;
    
    const where = {
      entity_type: entityType,
      entity_id: entityId
    };
    
    if (dismissed !== undefined) {
      where.is_dismissed = dismissed === 'true';
    }
    
    const insights = await AIInsight.findAll({
      where,
      order: [
        ['priority', 'DESC'],
        ['created_at', 'DESC']
      ]
    });
    
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all AI insights (dashboard)
 * GET /api/v1/ai/insights
 */
exports.getAllInsights = async (req, res) => {
  try {
    const { type, priority, dismissed = 'false' } = req.query;
    
    const where = {
      is_dismissed: dismissed === 'true'
    };
    
    if (type) where.insight_type = type;
    if (priority) where.priority = priority;
    
    const insights = await AIInsight.findAll({
      where,
      order: [
        ['priority', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit: 50
    });
    
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Dismiss an insight
 * POST /api/v1/ai/insights/:id/dismiss
 */
exports.dismissInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const insight = await AIInsight.findByPk(id);
    
    if (!insight) {
      return res.status(404).json({ message: 'Insight not found' });
    }
    
    await insight.update({
      is_dismissed: true,
      dismissed_by: userId,
      dismissed_at: new Date()
    });
    
    res.json(insight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mark insight as acted upon
 * POST /api/v1/ai/insights/:id/acted
 */
exports.markActedUpon = async (req, res) => {
  try {
    const { id } = req.params;
    const { outcome } = req.body;
    
    const insight = await AIInsight.findByPk(id);
    
    if (!insight) {
      return res.status(404).json({ message: 'Insight not found' });
    }
    
    await insight.update({
      acted_upon: true,
      outcome
    });
    
    res.json(insight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Run anomaly detection
 * POST /api/v1/ai/detect-anomalies
 */
exports.detectAnomalies = async (req, res) => {
  try {
    const anomalies = await aiService.detectAnomalies();
    
    res.json({
      anomalies,
      detected_at: new Date(),
      count: anomalies.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Summarize conversation
 * POST /api/v1/ai/summarize-conversation/:id
 */
exports.summarizeConversation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversation = await Conversation.findByPk(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    const messages = await Message.findAll({
      where: { conversation_id: id },
      order: [['created_at', 'ASC']]
    });
    
    const summary = await aiService.summarizeConversation(messages);
    
    res.json({
      conversation_id: id,
      ...summary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get AI predictions for entity
 * GET /api/v1/ai/predictions/:entityType/:entityId
 */
exports.getPredictions = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    
    const predictions = await AIPrediction.findAll({
      where: {
        entity_type: entityType,
        entity_id: entityId
      },
      order: [['created_at', 'DESC']],
      limit: 10
    });
    
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get AI dashboard statistics
 * GET /api/v1/ai/stats
 */
exports.getAIStats = async (req, res) => {
  try {
    const stats = {
      insights: {
        total: await AIInsight.count(),
        active: await AIInsight.count({ where: { is_dismissed: false } }),
        urgent: await AIInsight.count({ 
          where: { 
            priority: 'urgent',
            is_dismissed: false
          }
        }),
        acted_upon: await AIInsight.count({ where: { acted_upon: true } })
      },
      predictions: {
        total: await AIPrediction.count(),
        recent: await AIPrediction.count({
          where: {
            created_at: {
              [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          }
        })
      },
      by_type: {
        lead_scores: await AIInsight.count({ 
          where: { insight_type: 'lead_score' }
        }),
        next_actions: await AIInsight.count({
          where: { insight_type: 'next_best_action' }
        }),
        anomalies: await AIInsight.count({
          where: { insight_type: 'anomaly_detection' }
        })
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Bulk calculate lead scores
 * POST /api/v1/ai/bulk-score-leads
 */
exports.bulkScoreLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll({
      where: {
        status: {
          [Op.notIn]: ['converted', 'lost']
        }
      },
      limit: 100 // Process in batches
    });
    
    const results = [];
    for (const lead of leads) {
      const score = await aiService.calculateLeadScore(lead.id);
      results.push({ lead_id: lead.id, score });
    }
    
    res.json({
      processed: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
