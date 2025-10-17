const express = require('express');
const router = express.Router();
const socialPostController = require('../controllers/socialPostController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(socialPostController.getAll)
  .post(socialPostController.create);

router
  .route('/:id')
  .get(socialPostController.getOne)
  .put(socialPostController.update)
  .delete(socialPostController.delete);

module.exports = router;
