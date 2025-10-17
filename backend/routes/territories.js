const express = require('express');
const router = express.Router();
const territoryController = require('../controllers/territoryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(territoryController.getAll)
  .post(territoryController.create);

router
  .route('/:id')
  .get(territoryController.getOne)
  .put(territoryController.update)
  .delete(territoryController.delete);

module.exports = router;
