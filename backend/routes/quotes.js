const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(quoteController.getAll)
  .post(quoteController.create);

router
  .route('/:id')
  .get(quoteController.getOne)
  .put(quoteController.update)
  .delete(quoteController.delete);

module.exports = router;
