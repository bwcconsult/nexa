const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(workflowController.getWorkflows)
  .post(workflowController.createWorkflow);

router
  .route('/:id')
  .get(workflowController.getWorkflow)
  .put(workflowController.updateWorkflow)
  .delete(workflowController.deleteWorkflow);

module.exports = router;
