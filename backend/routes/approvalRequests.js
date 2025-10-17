const express = require('express');
const router = express.Router();
const approvalRequestController = require('../controllers/approvalRequestController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(approvalRequestController.getAll)
  .post(approvalRequestController.create);

router
  .route('/:id')
  .get(approvalRequestController.getOne)
  .put(approvalRequestController.update)
  .delete(approvalRequestController.delete);

module.exports = router;
