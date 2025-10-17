const express = require('express');
const router = express.Router();
const cadenceEnrollmentController = require('../controllers/cadenceEnrollmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(cadenceEnrollmentController.getAll)
  .post(cadenceEnrollmentController.create);

router
  .route('/:id')
  .get(cadenceEnrollmentController.getOne)
  .put(cadenceEnrollmentController.update)
  .delete(cadenceEnrollmentController.delete);

module.exports = router;
