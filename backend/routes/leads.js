const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(leadController.getLeads)
  .post(leadController.createLead);

router
  .route('/:id')
  .get(leadController.getLead)
  .put(leadController.updateLead)
  .delete(authorize('admin', 'manager'), leadController.deleteLead);

router.post('/:id/convert', leadController.convertLead);
router.put('/:id/assign', authorize('admin', 'manager'), leadController.assignLead);
router.get('/stats/overview', leadController.getLeadStats);

module.exports = router;
