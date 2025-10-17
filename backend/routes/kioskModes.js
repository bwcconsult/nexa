const express = require('express');
const router = express.Router();
const kioskModeController = require('../controllers/kioskModeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(kioskModeController.getAll)
  .post(kioskModeController.create);

router
  .route('/:id')
  .get(kioskModeController.getOne)
  .put(kioskModeController.update)
  .delete(kioskModeController.delete);

module.exports = router;
