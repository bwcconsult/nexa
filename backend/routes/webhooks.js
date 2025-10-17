const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Webhook routes are typically public
router.post('/', webhookController.handleWebhook);
router.get('/status', webhookController.getWebhookStatus);

module.exports = router;
