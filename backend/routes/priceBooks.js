const express = require('express');
const router = express.Router();
const priceBookController = require('../controllers/priceBookController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(priceBookController.getAll)
  .post(priceBookController.create);

router
  .route('/:id')
  .get(priceBookController.getOne)
  .put(priceBookController.update)
  .delete(priceBookController.delete);

module.exports = router;
