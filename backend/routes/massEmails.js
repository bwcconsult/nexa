const express = require('express');
const router = express.Router();
const massEmailController = require('../controllers/massEmailController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(massEmailController.getAll)
  .post(massEmailController.create);

router
  .route('/:id')
  .get(massEmailController.getOne)
  .put(massEmailController.update)
  .delete(massEmailController.delete);

module.exports = router;
