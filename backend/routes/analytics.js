const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', analyticsController.getDashboard);
router.get('/revenue', analyticsController.getRevenue);
router.get('/pipeline', analyticsController.getPipeline);
router.get('/lead-sources', analyticsController.getLeadSources);
router.get('/conversion-funnel', analyticsController.getConversionFunnel);

module.exports = router;
