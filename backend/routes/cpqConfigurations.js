const express = require('express');
const router = express.Router();
const cpqConfigurationController = require('../controllers/cpqConfigurationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(cpqConfigurationController.getAll)
  .post(cpqConfigurationController.create);

router
  .route('/:id')
  .get(cpqConfigurationController.getOne)
  .put(cpqConfigurationController.update)
  .delete(cpqConfigurationController.delete);

module.exports = router;
