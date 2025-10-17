const express = require('express');
const router = express.Router();
const blueprintController = require('../controllers/blueprintController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(blueprintController.getAll)
  .post(blueprintController.create);

router
  .route('/:id')
  .get(blueprintController.getOne)
  .put(blueprintController.update)
  .delete(blueprintController.delete);

module.exports = router;
