const express = require('express');
const router = express.Router();
const salesCadenceController = require('../controllers/salesCadenceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(salesCadenceController.getAll)
  .post(salesCadenceController.create);

router
  .route('/:id')
  .get(salesCadenceController.getOne)
  .put(salesCadenceController.update)
  .delete(salesCadenceController.delete);

module.exports = router;
