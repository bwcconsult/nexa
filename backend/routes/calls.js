const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(callController.getCalls)
  .post(callController.createCall);

router
  .route('/:id')
  .get(callController.getCall)
  .put(callController.updateCall)
  .delete(callController.deleteCall);

module.exports = router;
