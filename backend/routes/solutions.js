const express = require('express');
const router = express.Router();
const solutionController = require('../controllers/solutionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(solutionController.getAll)
  .post(solutionController.create);

router
  .route('/:id')
  .get(solutionController.getOne)
  .put(solutionController.update)
  .delete(solutionController.delete);

module.exports = router;
