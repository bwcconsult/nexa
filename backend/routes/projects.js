const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(projectController.getAll)
  .post(projectController.create);

router
  .route('/:id')
  .get(projectController.getOne)
  .put(projectController.update)
  .delete(projectController.delete);

module.exports = router;
