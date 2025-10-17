const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(activityController.getActivities)
  .post(activityController.createActivity);

router
  .route('/:id')
  .get(activityController.getActivity)
  .put(activityController.updateActivity)
  .delete(activityController.deleteActivity);

module.exports = router;
