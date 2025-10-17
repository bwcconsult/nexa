const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(visitController.getAll)
  .post(visitController.create);

router
  .route('/:id')
  .get(visitController.getOne)
  .put(visitController.update)
  .delete(visitController.delete);

module.exports = router;
