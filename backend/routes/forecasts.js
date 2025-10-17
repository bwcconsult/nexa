const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(forecastController.getAll)
  .post(forecastController.create);

router
  .route('/:id')
  .get(forecastController.getOne)
  .put(forecastController.update)
  .delete(forecastController.delete);

module.exports = router;
