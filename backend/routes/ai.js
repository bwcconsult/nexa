/**
 * AI Routes
 * 
 * AI/ML endpoints for predictions, insights, and recommendations
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Lead scoring
router.post('/lead-score/:id', aiController.calculateLeadScore);
router.post('/bulk-score-leads', aiController.bulkScoreLeads);

// Email generation
router.post('/generate-email', aiController.generateEmailDraft);

// Next best action
router.get('/next-action/:entityType/:entityId', aiController.getNextBestAction);

// Insights
router.get('/insights', aiController.getAllInsights);
router.get('/insights/:entityType/:entityId', aiController.getInsights);
router.post('/insights/:id/dismiss', aiController.dismissInsight);
router.post('/insights/:id/acted', aiController.markActedUpon);

// Anomaly detection
router.post('/detect-anomalies', aiController.detectAnomalies);

// Conversation summarization
router.post('/summarize-conversation/:id', aiController.summarizeConversation);

// Predictions
router.get('/predictions/:entityType/:entityId', aiController.getPredictions);

// Stats
router.get('/stats', aiController.getAIStats);

module.exports = router;
