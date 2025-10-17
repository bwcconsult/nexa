const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/send', emailController.sendEmail);

router
  .route('/')
  .get(emailController.getEmails)
  .post(emailController.createEmail);

router
  .route('/:id')
  .get(emailController.getEmail)
  .put(emailController.updateEmail)
  .delete(emailController.deleteEmail);

module.exports = router;
