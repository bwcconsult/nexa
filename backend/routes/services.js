const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(serviceController.getAll)
  .post(serviceController.create);

router
  .route('/:id')
  .get(serviceController.getOne)
  .put(serviceController.update)
  .delete(serviceController.delete);

module.exports = router;
