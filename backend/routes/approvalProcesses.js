const express = require('express');
const router = express.Router();
const approvalProcessController = require('../controllers/approvalProcessController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(approvalProcessController.getAll)
  .post(approvalProcessController.create);

router
  .route('/:id')
  .get(approvalProcessController.getOne)
  .put(approvalProcessController.update)
  .delete(approvalProcessController.delete);

module.exports = router;
