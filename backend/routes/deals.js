const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(dealController.getDeals)
  .post(dealController.createDeal);

router
  .route('/:id')
  .get(dealController.getDeal)
  .put(dealController.updateDeal)
  .delete(dealController.deleteDeal);

module.exports = router;
