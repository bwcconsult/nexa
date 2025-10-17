const express = require('express');
const router = express.Router();
const validationRuleController = require('../controllers/validationRuleController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(validationRuleController.getAll)
  .post(validationRuleController.create);

router
  .route('/:id')
  .get(validationRuleController.getOne)
  .put(validationRuleController.update)
  .delete(validationRuleController.delete);

module.exports = router;
