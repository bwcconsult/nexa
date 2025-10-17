const express = require('express');
const router = express.Router();
const assignmentRuleController = require('../controllers/assignmentRuleController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(assignmentRuleController.getAll)
  .post(assignmentRuleController.create);

router
  .route('/:id')
  .get(assignmentRuleController.getOne)
  .put(assignmentRuleController.update)
  .delete(assignmentRuleController.delete);

module.exports = router;
