const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(meetingController.getMeetings)
  .post(meetingController.createMeeting);

router
  .route('/:id')
  .get(meetingController.getMeeting)
  .put(meetingController.updateMeeting)
  .delete(meetingController.deleteMeeting);

module.exports = router;
