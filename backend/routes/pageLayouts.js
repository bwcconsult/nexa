const express = require('express');
const router = express.Router();
const pageLayoutController = require('../controllers/pageLayoutController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(pageLayoutController.getAll)
  .post(pageLayoutController.create);

router
  .route('/:id')
  .get(pageLayoutController.getOne)
  .put(pageLayoutController.update)
  .delete(pageLayoutController.delete);

module.exports = router;
