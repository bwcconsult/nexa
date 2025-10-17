const express = require('express');
const router = express.Router();
const webhookConfigController = require('../controllers/webhookConfigController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(webhookConfigController.getAll)
  .post(webhookConfigController.create);

router
  .route('/:id')
  .get(webhookConfigController.getOne)
  .put(webhookConfigController.update)
  .delete(webhookConfigController.delete);

module.exports = router;
