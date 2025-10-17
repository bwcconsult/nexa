const express = require('express');
const router = express.Router();
const linkAnalyticsController = require('../controllers/linkAnalyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(linkAnalyticsController.getLinkAnalytics)
  .post(linkAnalyticsController.createLinkAnalytic);

router
  .route('/:id')
  .get(linkAnalyticsController.getLinkAnalytic)
  .put(linkAnalyticsController.updateLinkAnalytic)
  .delete(linkAnalyticsController.deleteLinkAnalytic);

module.exports = router;
