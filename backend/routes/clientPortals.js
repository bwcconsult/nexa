const express = require('express');
const router = express.Router();
const clientPortalController = require('../controllers/clientPortalController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(clientPortalController.getAll)
  .post(clientPortalController.create);

router
  .route('/:id')
  .get(clientPortalController.getOne)
  .put(clientPortalController.update)
  .delete(clientPortalController.delete);

module.exports = router;
