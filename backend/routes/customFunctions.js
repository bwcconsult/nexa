const express = require('express');
const router = express.Router();
const customFunctionController = require('../controllers/customFunctionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(customFunctionController.getAll)
  .post(customFunctionController.create);

router
  .route('/:id')
  .get(customFunctionController.getOne)
  .put(customFunctionController.update)
  .delete(customFunctionController.delete);

module.exports = router;
